// src/components/Threads/ThreadCard.jsx
import React from 'react'
import { parseIsoDateWithMicro } from '../../utils/parseIsoDate'
import {
  ThumbUpIcon,
  HeartIcon,
  ThumbDownIcon,
  ChatAltIcon,
  UserCircleIcon,
} from '@heroicons/react/outline'

export default function ThreadCard({ thread }) {
  const date = parseIsoDateWithMicro(thread.timestamp || thread.createdAt)
  const upvotes = thread.upvotes ?? thread.likes ?? 0
  const appreciations = thread.appreciations ?? 0
  const downvotes = thread.downvotes ?? 0
  const commentsCount = Array.isArray(thread.comments)
    ? thread.comments.length
    : thread.comments ?? 0

  return (
    <div className="bg-gray-850 bg-opacity-60 backdrop-blur-lg rounded-2xl p-6 mb-6 shadow-md hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <UserCircleIcon className="h-8 w-8 text-orange-400" />
        <div>
          <p className="text-white font-semibold">{thread.author}</p>
          <p className="text-gray-400 text-xs">
             {date.toLocaleString()}
             {console.log("Date:", date)}
          </p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-100 mb-6">{thread.content}</p>

      {/* Actions */}
      <div className="flex justify-between items-center text-sm text-gray-200">
        <button className="flex items-center space-x-1 px-3 py-1 bg-gray-700 bg-opacity-50 rounded-full hover:bg-gray-700 transition">
          <ThumbUpIcon className="h-5 w-5 text-green-400" />
          <span>{upvotes}</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 bg-gray-700 bg-opacity-50 rounded-full hover:bg-gray-700 transition">
          <HeartIcon className="h-5 w-5 text-pink-400" />
          <span>{appreciations}</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 bg-gray-700 bg-opacity-50 rounded-full hover:bg-gray-700 transition">
          <ThumbDownIcon className="h-5 w-5 text-red-400" />
          <span>{downvotes}</span>
        </button>
        <button className="flex items-center space-x-1 px-3 py-1 bg-gray-700 bg-opacity-50 rounded-full hover:bg-gray-700 transition">
          <ChatAltIcon className="h-5 w-5 text-blue-400" />
          <span>{commentsCount}</span>
        </button>
      </div>
    </div>
  )
}
