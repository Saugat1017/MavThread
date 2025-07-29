// src/components/ReplyModal.jsx
import React, { useState } from 'react'
import { XIcon as XMarkIcon, ChatAltIcon, UserCircleIcon } from '@heroicons/react/outline'

export default function ReplyModal({ thread, onClose, onReply }) {
  const [comment, setComment] = useState('')

  const handleSubmit = () => {
    if (!comment.trim()) return
    onReply(thread.id, comment)
    setComment('')
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
            <div className="p-2 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
              <ChatAltIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Reply to Thread
              </h2>
              <p className="text-gray-400 text-sm">Share your response with the community</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700/50 rounded-xl transition-colors duration-200 group"
          >
            <XMarkIcon className="h-6 w-6 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </div>

        {/* Original thread preview */}
        <div className="mb-6 p-4 bg-gray-700/30 rounded-2xl border border-gray-600/30">
          <div className="flex items-start space-x-3">
            <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
              <UserCircleIcon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <span className="font-medium text-white text-sm">{thread.author}</span>
                <span className="text-gray-400 text-xs">• Original post</span>
              </div>
              <p className="text-gray-300 text-sm line-clamp-2">{thread.content}</p>
            </div>
          </div>
        </div>

        {/* Enhanced textarea */}
        <div className="relative mb-6">
          <textarea
            rows={4}
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Write your reply... Share your thoughts, ask questions, or add to the conversation..."
            className="w-full bg-gray-700/30 border border-gray-600/50 rounded-2xl p-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300 resize-none"
            style={{ minHeight: '100px' }}
          />
          <div className="absolute bottom-3 right-3 text-xs text-gray-500">
            {comment.length}/300
          </div>
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
            disabled={!comment.trim()}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white font-semibold hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            Post Reply
          </button>
        </div>
      </div>
    </div>
  )
}
