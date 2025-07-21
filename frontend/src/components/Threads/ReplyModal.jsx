// src/components/ReplyModal.jsx
import React, { useState } from 'react'

export default function ReplyModal({ thread, onClose, onReply }) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (!comment.trim()) return
    onReply(thread.id, comment)
    setComment('')
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
          Reply to {thread.author}
        </h2>

        <textarea
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write your reply..."
          className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />

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
            Post Reply
          </button>
        </div>
      </div>
    </div>
  )
}
