// src/components/CreateThread.jsx
import React, { useState, useEffect } from 'react'

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-60"
        onClick={onClose}
      />

      {/* modal */}
      <div className="relative bg-gray-850 bg-opacity-80 backdrop-blur-lg rounded-2xl p-6 max-w-md w-full shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">
          Create a New Thread
        </h2>

        {/* text */}
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What are you thinking?"
          className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />

        {/* file upload */}
        <div className="mt-4">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
            <span className="flex items-center space-x-1 px-3 py-1 bg-gray-700 rounded-md text-sm text-gray-200 hover:bg-gray-600 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828M13 5l7 7m0 0l-7 7m7-7H6"
                />
              </svg>
              <span>Attach File</span>
            </span>
          </label>

          {file && (
            <div className="mt-2 flex items-center space-x-3 text-sm text-gray-300">
              {preview ? (
                <img
                  src={preview}
                  alt="preview"
                  className="h-12 w-12 object-cover rounded-lg"
                />
              ) : (
                <span className="truncate">{file.name}</span>
              )}
              <button
                onClick={handleRemoveFile}
                className="text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* actions */}
        <div className="mt-5 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg text-white font-medium hover:scale-105 transform transition"
          >
            Post
          </button>
        </div>
      </div>
    </div>
  )
}
