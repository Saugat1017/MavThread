// src/components/Threads/ThreadCard.jsx
import React, { useState } from 'react'
import {
  ThumbUpIcon,
  HeartIcon,
  ThumbDownIcon,
  ChatAltIcon,
  UserCircleIcon,
  ClockIcon,
  DocumentIcon,
} from '@heroicons/react/outline'

export default function ThreadCard({ thread }) {
  const [selectedImage, setSelectedImage] = useState(null)
  
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
    <>
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

      {/* File Attachments - Handle both new files array and legacy imageUrl/videoUrl */}
      {(thread.files && thread.files.length > 0) || thread.imageUrl || thread.videoUrl ? (
        <div className="mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Display files from the files array (new format) */}
            {thread.files && thread.files.map((file, fileIndex) => (
              <div
                key={`file-${fileIndex}`}
                className="relative group"
              >
                {file.type.startsWith('image/') ? (
                  <div 
                    className="cursor-pointer relative overflow-hidden rounded-2xl shadow-2xl"
                    onClick={() => setSelectedImage(file)}
                  >
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                    
                    {/* Hover effect overlay */}
                    <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-500 rounded-2xl"></div>
                    
                    {/* Click indicator */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                    
                    {/* Subtle border glow */}
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-500"></div>
                  </div>
                ) : file.type.startsWith('video/') ? (
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                    <video
                      src={file.url}
                      controls
                      className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                    />
                    {/* Video indicator */}
                    <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-white text-xs font-medium">VIDEO</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-gray-700 to-gray-800 rounded-2xl flex items-center justify-center shadow-2xl border border-gray-600/30">
                    <DocumentIcon className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
            
            {/* Display legacy imageUrl if no files array or as fallback */}
            {thread.imageUrl && (!thread.files || thread.files.length === 0) && (
              <div className="relative group">
                <div 
                  className="cursor-pointer relative overflow-hidden rounded-2xl shadow-2xl"
                  onClick={() => setSelectedImage({
                    url: thread.imageUrl,
                    name: 'Image',
                    type: 'image/jpeg',
                    size: 0
                  })}
                >
                  <img
                    src={thread.imageUrl}
                    alt="Thread image"
                    className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  />
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-all duration-500 rounded-2xl"></div>
                  
                  {/* Click indicator */}
                  <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                  
                  {/* Subtle border glow */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-orange-500/30 transition-all duration-500"></div>
                </div>
              </div>
            )}
            
            {/* Display legacy videoUrl if no files array or as fallback */}
            {thread.videoUrl && (!thread.files || thread.files.length === 0) && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                  <video
                    src={thread.videoUrl}
                    controls
                    className="w-full h-48 object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  {/* Video indicator */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-white text-xs font-medium">VIDEO</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

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

    {/* Image Modal */}
    {selectedImage && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        />
        <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-all"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img
            src={selectedImage.url}
            alt={selectedImage.name}
            className="w-full h-auto max-h-[90vh] object-contain"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4">
            <p className="text-white font-medium">{selectedImage.name}</p>
            {selectedImage.size > 0 && (
              <p className="text-gray-300 text-sm">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </>
  )
}
