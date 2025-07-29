// src/components/Threads/ThreadCard.jsx
import React from 'react'
import {
  ThumbUpIcon,
  HeartIcon,
  ThumbDownIcon,
  ChatAltIcon,
  UserCircleIcon,
  ClockIcon,
} from '@heroicons/react/outline'

export default function ThreadCard({ thread }) {
  
  const upvotes = thread.upvotes ?? thread.likes ?? 0
  const appreciations = thread.appreciations ?? 0
  const downvotes = thread.downvotes ?? 0
  const commentsCount = Array.isArray(thread.comments)
    ? thread.comments.length
    : thread.comments ?? 0

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border-l-4 border-orange-500 hover:border-l-8 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10 group">
      {/* Author Section */}
      <div className="flex items-start space-x-4 mb-4">
        <div className="relative">
          <div className="h-12 w-12 bg-orange-700 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-8 w-8 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-white">{thread.author}</h3>
            {/* <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
              Student
            </span> */}
          </div>
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <ClockIcon className="h-4 w-4" />
            <span>{formatTimeAgo(thread.createdAt || thread.timestamp)}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-100 text-lg leading-relaxed">{thread.content}</p>
      </div>

      {/* Enhanced Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="group flex items-center space-x-2 px-4 py-2 bg-orange-500/10 hover:bg-orange-500/20 rounded-xl transition-all duration-300 hover:scale-105">
            <ThumbUpIcon className="h-5 w-5 text-orange-400 group-hover:text-orange-300" />
            <span className="text-sm font-medium">{upvotes}</span>
          </button>
          <button className="group flex items-center space-x-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-xl transition-all duration-300 hover:scale-105">
            <HeartIcon className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300" />
            <span className="text-sm font-medium">{appreciations}</span>
          </button>
          <button className="group flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-105">
            <ThumbDownIcon className="h-5 w-5 text-red-400 group-hover:text-red-300" />
            <span className="text-sm font-medium">{downvotes}</span>
          </button>
        </div>
        
        <button className="group flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all duration-300 hover:scale-105">
          <ChatAltIcon className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300" />
          <span className="text-sm font-medium">{commentsCount}</span>
        </button>
      </div>
    </div>
  )
}
