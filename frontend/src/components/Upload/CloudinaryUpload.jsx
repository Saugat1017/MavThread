// src/components/CreateThread.jsx
import React, { useState } from 'react'
import {
  XIcon as XMarkIcon,
  PaperClipIcon,
  PhotographIcon as PhotoIcon,
  DocumentIcon,
} from '@heroicons/react/outline'

export default function CreateThread({ onClose, onCreate }) {
  const [content, setContent] = useState('')
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [showUpload, setShowUpload] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10 MB

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('📁 handleFileChange fired')
    console.log('  • cloud name:', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME)
    console.log('  • upload preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESETS)

    setError('')
    if (file.size > MAX_FILE_SIZE) {
      setError('File exceeds 10 MB limit.')
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESETS)

    try {
      const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`
      console.log('  → fetch URL:', url)

      const resp = await fetch(url, {
        method: 'POST',
        body: formData,
      })

      console.log('  ← status:', resp.status, 'ok?', resp.ok)
      const payload = await resp.json()
      console.log('  ← Cloudinary payload:', payload)

      if (!resp.ok) {
        throw new Error(payload.error?.message || 'Upload failed')
      }

      const fileObj = {
        id:   payload.public_id,
        url:  payload.secure_url,
        name: file.name,
        size: file.size,
        type: file.type,
      }

      setUploadedFiles((prev) => [...prev, fileObj])
    } catch (uploadErr) {
      console.error('Upload failed:', uploadErr)
      setError(uploadErr.message)
    } finally {
      setUploading(false)
      e.target.value = null  // allow re-selecting same file if needed
    }
  }

  const handleRemoveFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const handleSubmit = () => {
    if (!content.trim() && uploadedFiles.length === 0) return
    onCreate({
      content,
      files: uploadedFiles,
      timestamp: new Date().toISOString(),
    })
    setContent('')
    setUploadedFiles([])
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-gray-600/30 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
              <PhotoIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Create New Thread
              </h2>
              <p className="text-gray-400 text-sm">
                Share your thoughts with the community
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-700/50 rounded-xl">
            <XMarkIcon className="h-6 w-6 text-gray-400 hover:text-white" />
          </button>
        </div>

        {/* Textarea */}
        <div className="relative mb-6">
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full bg-gray-700/30 border border-gray-600/50 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none"
            style={{ minHeight: '120px' }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {content.length}/500
          </div>
        </div>

        {/* Attachments */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Attachments</h3>
            <button
              onClick={() => setShowUpload((v) => !v)}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl border border-orange-500/20 transition-all"
            >
              <PaperClipIcon className="h-5 w-5 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">
                {showUpload ? 'Hide Upload' : 'Add Files'}
              </span>
            </button>
          </div>

          {showUpload && (
            <div className="mb-4">
              <input
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-100 mb-2"
              />
              {uploading && <p className="text-xs text-gray-400">Uploading…</p>}
              {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Attached Files:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="relative bg-gray-700/30 rounded-lg p-3 border border-gray-600/30"
                  >
                    <div className="flex items-center space-x-3">
                      {file.type.startsWith('image/') ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="h-12 w-12 object-cover rounded-lg border border-gray-600/30"
                        />
                      ) : (
                        <div className="h-12 w-12 bg-gray-600/50 rounded-lg flex items-center justify-center">
                          <DocumentIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(file.id)}
                        className="p-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg"
                      >
                        <XMarkIcon className="h-4 w-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() && uploadedFiles.length === 0}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:scale-105 transform transition-all shadow-lg disabled:opacity-50"
          >
            Post Thread
          </button>
        </div>
      </div>
    </div>
  )
}
