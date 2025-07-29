// src/components/CreateThread.jsx
import React, { useState, useEffect } from 'react'
import { XIcon as XMarkIcon, PaperClipIcon, PhotographIcon as PhotoIcon, DocumentIcon } from '@heroicons/react/outline'

export default function CreateThread({ onClose, onCreate }) {
  const [content, setContent] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  // clean up preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (!selected) return

    setFile(selected)
    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected))
    } else {
      setPreview(null)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return null
    })
  }

  const handleSubmit = () => {
    if (!content.trim() && !file) return
    onCreate({
      content,
      file,               // your parent can now handle uploading
      timestamp: new Date().toISOString(),
    })
    setContent('')
    handleRemoveFile()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Enhanced backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Enhanced modal */}
      <div className="relative bg-gradient-to-br from-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-600/30 animate-in slide-in-from-bottom-4 duration-300">
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
              <p className="text-gray-400 text-sm">Share your thoughts with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors duration-200 group"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Enhanced textarea */}
        <div className="relative mb-6">
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Share your thoughts, questions, or experiences..."
            className="w-full bg-gray-700/30 border border-gray-600/50 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all duration-300 resize-none"
            style={{ minHeight: '120px' }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {content.length}/500
          </div>
        </div>

        {/* Enhanced file upload */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 border border-orange-500/20">
              <PaperClipIcon className="h-5 w-5 text-orange-400" />
              <span className="text-orange-300 text-sm font-medium">Attach File</span>
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx"
              />
            </label>
            
            {file && (
              <button
                onClick={handleRemoveFile}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-105 border border-red-500/20"
              >
                <XMarkIcon className="h-4 w-4 text-red-400" />
              </button>
            )}
          </div>

          {file && (
            <div className="mt-3 p-3 bg-gray-700/30 rounded-xl border border-gray-600/30">
              <div className="flex items-center space-x-3">
                {preview ? (
                  <img
                    src={preview}
                    alt="preview"
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
              </div>
            </div>
          )}
        </div>

        {/* Enhanced actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border border-gray-600/50 text-gray-300 hover:bg-gray-700/50 hover:border-gray-500/50 transition-all duration-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() && !file}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl text-white font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-orange-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Post Thread
          </button>
        </div>
      </div>
    </div>
  )
}
