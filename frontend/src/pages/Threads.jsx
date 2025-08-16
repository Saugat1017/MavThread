// src/pages/ThreadsPage.jsx
import React, { useState, useEffect } from 'react'
import CreateThread from '../components/Threads/CreateThread'
import ReplyModal from '../components/Threads/ReplyModal'
import Footer from '../components/Footer/Footer'

import {
  ThumbUpIcon,
  HeartIcon,
  ThumbDownIcon,
  ChatAltIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  FireIcon,
  ClockIcon,
  FilterIcon,
  AcademicCapIcon,
  DocumentIcon,
  XIcon as XMarkIcon,
} from '@heroicons/react/outline'
import {
  getGroupPosts,
  // getAllPosts,
  createPost,
  getRecentPosts,
  replyPost,
  votePost,
  getProfile,
  getAllPosts,
} from '../services/api'

export default function ThreadsPage() {
  const [threads, setThreads] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [expanded, setExpanded] = useState([])
  const [loading, setLoading] = useState(true)
  const [userVotes, setUserVotes] = useState({}) // Track user's votes for each post
  const [userMajor, setUserMajor] = useState('')
  const [filterType, setFilterType] = useState('all') // 'all' or 'same-major'
  const [selectedImage, setSelectedImage] = useState(null)

  useEffect(() => {
    fetchThreads()
    fetchUserProfile()
  }, [])

  async function fetchUserProfile() {
    try {
      const userData = await getProfile()
      setUserMajor(userData.major || '')
    } catch (err) {
      console.error('Failed to load user profile:', err)
    }
  }

  async function fetchThreads() {
    try {
      setLoading(true)
      // Use getAllPosts to get all threads, not just group-specific ones
      const data = await getAllPosts()
      console.log("Threads: ", data)
      const list = Array.isArray(data) ? data : data.posts || []
      
      // Debug: Log the first few threads to see their structure
      if (list.length > 0) {
        console.log("First thread structure:", list[0])
        console.log("First thread files:", list[0].files)
        console.log("First thread imageUrl:", list[0].imageUrl)
        console.log("First thread videoUrl:", list[0].videoUrl)
      }
      
      // Normalize the data structure to ensure files are properly formatted
      const normalizedList = list.map(thread => {
        // Handle case where files might be a JSON string
        let normalizedFiles = thread.files
        if (typeof thread.files === 'string') {
          try {
            normalizedFiles = JSON.parse(thread.files)
          } catch (e) {
            console.warn('Failed to parse files JSON:', thread.files)
            normalizedFiles = []
          }
        }
        
        // Handle case where files might be null/undefined
        if (!normalizedFiles) {
          normalizedFiles = []
        }
        
        return {
          ...thread,
          files: normalizedFiles
        }
      })
      
      setThreads(normalizedList)
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }

  // Filter threads based on current filter
  const filteredThreads = threads.filter(thread => {
    if (filterType === 'all') {
      return true
    } else if (filterType === 'same-major' && userMajor) {
      return thread.authorMajor === userMajor
    }
    return true
  })

  async function handleCreate({ content, files = [] }) {
    try {
      // Process uploaded files to extract URLs
      const imageFiles = files.filter(file => file.type.startsWith('image/'))
      const videoFiles = files.filter(file => file.type.startsWith('video/'))
      
      // Prepare data to send to backend
      const postData = {
        content,
        imageUrl: imageFiles.length > 0 ? imageFiles[0].url : null,
        videoUrl: videoFiles.length > 0 ? videoFiles[0].url : null,
        // Send all file URLs as an array for the backend to process
        fileUrls: files.map(file => ({
          url: file.url,
          type: file.type,
          name: file.name,
          size: file.size
        }))
      }
      
      console.log('Sending post data to backend:', postData)
      
      const newThread = await createPost(postData)
      console.log('New thread response:', newThread) // Debug log
      console.log('New thread files:', newThread.files)
      console.log('New thread imageUrl:', newThread.imageUrl)
      console.log('New thread videoUrl:', newThread.videoUrl)
      
      // Add the new thread to the beginning of the list
      setThreads(prev => [{
        id: newThread.id,
        content: content, // Use the content from the form, not API response
        authorName: newThread.authorName || 'You',
        authorMajor: userMajor, // Add user's major to new threads
        createdAt: newThread.createdAt || new Date().toISOString(),
        upvotes: newThread.upvotes || 0,
        downvotes: newThread.downvotes || 0,
        appreciations: newThread.appreciations || 0,
        replies: newThread.replies || [],
        imageUrl: imageFiles.length > 0 ? imageFiles[0].url : null,
        videoUrl: videoFiles.length > 0 ? videoFiles[0].url : null,
        files: files, // Store all uploaded files
        anonymous: newThread.anonymous || false,
        totalPoints: newThread.totalPoints || 0
      }, ...prev])
    } catch (err) {
      console.error('Failed to create post:', err)
    } finally {
      setShowModal(false)
    }
  }

  async function handleReply(postId, text) {
    try {
      const reply = await replyPost(postId, text)
      // Update the specific thread with the new reply
      setThreads(prev =>
        prev.map(t =>
          t.id === postId
            ? { 
                ...t, 
                replies: [...(t.replies || []), {
                  id: reply.id || Date.now(),
                  content: text,
                  authorName: reply.authorName || 'You',
                  createdAt: new Date().toISOString(),
                  imageUrl: null,
                  videoUrl: null,
                  anonymous: false
                }]
              }
            : t
        )
      )
    } catch (err) {
      console.error('Failed to reply:', err)
    } finally {
      setReplyTo(null)
    }
  }

  async function handleVote(postId, type) {
    try {
      const currentVote = userVotes[postId]
      let newVote = null
      
      console.log('Vote Debug:', { postId, type, currentVote })
      
      // Handle like/unlike logic
      if (type === 'appreciation') {
        if (currentVote === 'appreciation') {
          // Unlike
          newVote = null
        } else {
          // Like
          newVote = 'appreciation'
        }
      } else if (type === 'upvote') {
        if (currentVote === 'upvote') {
          // Remove upvote
          newVote = null
        } else {
          // Add upvote
          newVote = 'upvote'
        }
      } else if (type === 'downvote') {
        if (currentVote === 'downvote') {
          // Remove downvote
          newVote = null
        } else {
          // Add downvote
          newVote = 'downvote'
        }
      }

      console.log('New vote will be:', newVote)

      // Update user votes state
      setUserVotes(prev => ({
        ...prev,
        [postId]: newVote
      }))

      // Update thread counts with proper logic for vote switching
      setThreads(prev =>
        prev.map(t =>
          t.id === postId
            ? {
                ...t,
                upvotes: (() => {
                  if (type === 'upvote') {
                    if (currentVote === 'upvote') {
                      // Remove upvote
                      return Math.max(0, t.upvotes - 1)
                    } else {
                      // Add upvote
                      return t.upvotes + 1
                    }
                  } else if (currentVote === 'upvote' && newVote !== 'upvote') {
                    // Switching away from upvote
                    return Math.max(0, t.upvotes - 1)
                  } else {
                    return t.upvotes
                  }
                })(),
                downvotes: (() => {
                  if (type === 'downvote') {
                    if (currentVote === 'downvote') {
                      // Remove downvote
                      return Math.max(0, t.downvotes - 1)
                    } else {
                      // Add downvote
                      return t.downvotes + 1
                    }
                  } else if (currentVote === 'downvote' && newVote !== 'downvote') {
                    // Switching away from downvote
                    return Math.max(0, t.downvotes - 1)
                  } else {
                    return t.downvotes
                  }
                })(),
                appreciations: (() => {
                  if (type === 'appreciation') {
                    if (currentVote === 'appreciation') {
                      // Remove appreciation
                      return Math.max(0, t.appreciations - 1)
                    } else {
                      // Add appreciation
                      return t.appreciations + 1
                    }
                  } else if (currentVote === 'appreciation' && newVote !== 'appreciation') {
                    // Switching away from appreciation
                    return Math.max(0, t.appreciations - 1)
                  } else {
                    return t.appreciations
                  }
                })()
              }
            : t
        )
      )

      // Temporarily comment out API call to test local logic
      // await votePost(postId, type)
      console.log('Local state updated successfully')
    } catch (err) {
      console.error('Failed to vote:', err)
      // Revert state on error
      setUserVotes(prev => {
        const newState = { ...prev }
        delete newState[postId]
        return newState
      })
    }
  }

  const toggleComments = id =>
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return 'Just now'
    
    const now = new Date()
    const postTime = new Date(timestamp)
    
    // Check if the date is valid
    if (isNaN(postTime.getTime())) {
      return 'Just now'
    }
    
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr  from-black via-slate-900 to-black text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading threads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-black via-slate-900 to-black text-gray-100 pb-24">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Enhanced Header */}
        <div className="mb-8 pt-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl">
                <FireIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                  Campus Threads
                </h1>
                <p className="text-gray-400 text-sm">Connect with your community</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white font-semibold hover:scale-150 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Thread</span>
            </button>
          </div>

          {/* Filter Section */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FilterIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-300 text-sm font-medium">Filter:</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    filterType === 'all'
                      ? 'bg-emerald-500 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  All Threads
                </button>
                <button
                  onClick={() => setFilterType('same-major')}
                  disabled={!userMajor}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                    filterType === 'same-major'
                      ? 'bg-orange-500 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  } ${!userMajor ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <AcademicCapIcon className="h-4 w-4" />
                  <span>Same Major</span>
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              {filterType === 'all' ? (
                <span>Showing all threads ({filteredThreads.length})</span>
              ) : (
                <span>Showing {userMajor} threads ({filteredThreads.length})</span>
              )}
            </div>
          </div>
        </div>

        {/* Thread List with Connected Design */}
        <div className="space-y-6">
          {filteredThreads.map((t, index) => (
            <div
              key={t.id}
              style={{ perspective: '1000px' }}
              className="relative group"
            >
              {/* Main Thread Card */}
              <div className="thread-card
             bg-gradient-to-r from-gray-800/80 to-gray-700/80
             backdrop-blur-xl p-6 rounded-2xl
             border border-gray-600/30
             transition-all duration-300
             hover:border-orange-500/50  
             shadow-[0_10px_10px_rgba(0,0,0,0.4)]">
                {/* Thread Connection Line */}
                {index < filteredThreads.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-orange-500 to-transparent z-0"></div>
                )}
                
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
                      <h3 className="font-semibold text-white">{t.authorName || t.author || 'Anonymous'}</h3>
                      {t.authorMajor && (
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">
                          {t.authorMajor}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 text-sm">
                      <ClockIcon className="h-4 w-4" />
                      <span>{formatTimeAgo(t.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-100 text-lg leading-relaxed">{t.content}</p>
                </div>

                {/* File Attachments - Handle both new files array and legacy imageUrl/videoUrl */}
                {(t.files && t.files.length > 0) || t.imageUrl || t.videoUrl ? (
                  <div className="mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Display files from the files array (new format) */}
                      {t.files && t.files.map((file, fileIndex) => (
                        <div
                          key={`file-${fileIndex}`}
                          className="relative bg-gray-700/30 rounded-lg p-3 border border-gray-600/30"
                        >
                          {file.type.startsWith('image/') ? (
                            <div 
                              className="cursor-pointer group"
                              onClick={() => setSelectedImage(file)}
                            >
                              <img
                                src={file.url}
                                alt={file.name}
                                className="w-full h-48 object-cover rounded-lg border border-gray-600/30 transition-all duration-300 group-hover:scale-105 group-hover:border-orange-500/50"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                                  Click to expand
                                </div>
                              </div>
                            </div>
                          ) : file.type.startsWith('video/') ? (
                            <video
                              src={file.url}
                              controls
                              className="w-full h-48 object-cover rounded-lg border border-gray-600/30"
                            />
                          ) : (
                            <div className="w-full h-48 bg-gray-600/50 rounded-lg flex items-center justify-center">
                              <DocumentIcon className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="mt-3">
                            <p className="text-sm text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">
                              {(file.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      ))}
                      
                      {/* Display legacy imageUrl if no files array or as fallback */}
                      {t.imageUrl && (!t.files || t.files.length === 0) && (
                        <div className="relative bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                          <div 
                            className="cursor-pointer group"
                            onClick={() => setSelectedImage({
                              url: t.imageUrl,
                              name: 'Image',
                              type: 'image/jpeg',
                              size: 0
                            })}
                          >
                            <img
                              src={t.imageUrl}
                              alt="Thread image"
                              className="w-full h-48 object-cover rounded-lg border border-gray-600/30 transition-all duration-300 group-hover:scale-105 group-hover:border-orange-500/50"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-sm font-medium">
                                Click to expand
                              </div>
                            </div>
                          </div>
                          <div className="mt-3">
                            <p className="text-sm text-white truncate">Thread Image</p>
                            <p className="text-xs text-gray-400">Image attachment</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Display legacy videoUrl if no files array or as fallback */}
                      {t.videoUrl && (!t.files || t.files.length === 0) && (
                        <div className="relative bg-gray-700/30 rounded-lg p-3 border border-gray-600/30">
                          <video
                            src={t.videoUrl}
                            controls
                            className="w-full h-48 object-cover rounded-lg border border-gray-600/30"
                          />
                          <div className="mt-3">
                            <p className="text-sm text-white truncate">Thread Video</p>
                            <p className="text-xs text-gray-400">Video attachment</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Enhanced Actions with Like/Unlike */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVote(t.id, 'upvote')}
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-150 ${
                        userVotes[t.id] === 'upvote' 
                          ? 'bg-green-500/30 text-green-300' 
                          : 'bg-gray-700/50 hover:bg-green-500/20 text-green-400'
                      }`}
                    >
                      <ThumbUpIcon className="h-5 w-5 group-hover:text-green-300" />
                      <span className="text-sm font-medium">{t.upvotes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(t.id, 'appreciation')}
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-150 ${
                        userVotes[t.id] === 'appreciation' 
                          ? 'bg-pink-500/30 text-pink-300' 
                          : 'bg-gray-700/50 hover:bg-pink-500/20 text-pink-400'
                      }`}
                    >
                      <HeartIcon className={`h-5 w-5 group-hover:text-pink-300 ${
                        userVotes[t.id] === 'appreciation' ? 'text-pink-300' : 'text-pink-400'
                      }`} />
                      <span className="text-sm font-medium">{t.appreciations || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(t.id, 'downvote')}
                      className={`group flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-150 ${
                        userVotes[t.id] === 'downvote' 
                          ? 'bg-red-500/30 text-red-300' 
                          : 'bg-gray-700/50 hover:bg-red-500/20 text-red-400'
                      }`}
                    >
                      <ThumbDownIcon className="h-5 w-5 group-hover:text-red-300" />
                      <span className="text-sm font-medium">{t.downvotes || 0}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => setReplyTo(t)}
                    className="group flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all duration-300 hover:scale-150"
                  >
                    <ChatAltIcon className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300" />
                    <span className="text-sm font-medium">Reply</span>
                  </button>
                </div>

                {/* Comments Toggle */}
                {t.replies?.length > 0 && (
                  <button
                    onClick={() => toggleComments(t.id)}
                    className="mt-4 flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors duration-300 hover:scale-150"
                  >
                    {expanded.includes(t.id) ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                    <span className="text-sm font-medium">
                      {t.replies.length} {t.replies.length === 1 ? 'Reply' : 'Replies'}
                    </span>
                  </button>
                )}
              </div>

              {/* Threaded Comments with Connected Design */}
              {expanded.includes(t.id) && t.replies?.length > 0 && (
                <div className="mt-4 ml-8 space-y-4">
                  {[...t.replies]
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .map((reply, replyIndex) => (
                    <div
                      key={reply.id}
                      className="relative group"
                    >
                      {/* Comment Connection Line */}
                      {replyIndex < t.replies.length - 1 && (
                        <div className="absolute left-6 top-full w-0.5 h-4 bg-gradient-to-b from-emerald-500 to-transparent z-0"></div>
                      )}
                      
                      <div className="relative bg-gradient-to-r from-gray-700/60 to-gray-600/60 backdrop-blur-lg rounded-xl p-4 border border-gray-600/30 hover:border-emerald-500/50 transition-all duration-300">
                        {/* Comment Author */}
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-8 w-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <UserCircleIcon className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm">{reply.authorName || 'Anonymous'}</h4>
                            <p className="text-gray-400 text-xs">{formatTimeAgo(reply.createdAt)}</p>
                          </div>
                        </div>
                        
                        {/* Comment Content */}
                        <p className="text-gray-200 text-sm leading-relaxed ml-11">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

      {/* Create Thread Modal */}
      {showModal && (
        <CreateThread onClose={() => setShowModal(false)} onCreate={handleCreate} />
      )}

      {/* Reply Modal */}
      {replyTo && (
        <ReplyModal
          thread={replyTo}
          onClose={() => setReplyTo(null)}
          onReply={handleReply}
        />
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          />
          
          {/* Modal Content */}
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all duration-300 group"
            >
              <XMarkIcon className="h-6 w-6 text-white group-hover:text-gray-300" />
            </button>
            
            {/* Image */}
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            
            {/* Image Info */}
            <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
              <p className="text-white font-medium">{selectedImage.name}</p>
              <p className="text-gray-300 text-sm">
                {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
