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
} from '@heroicons/react/outline'
import {
  getGroupPosts,
  createPost,
  replyPost,
  votePost,
} from '../services/api'

export default function ThreadsPage() {
  const [threads, setThreads] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [replyTo, setReplyTo] = useState(null)
  const [expanded, setExpanded] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchThreads()
  }, [])

  async function fetchThreads() {
    try {
      setLoading(true)
      const data = await getGroupPosts()
      console.log("Threads: ", data)
      const list = Array.isArray(data) ? data : data.posts || []
      setThreads(list)
    } catch (err) {
      console.error('Failed to load posts:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate({ content }) {
    try {
      const newThread = await createPost(content)
      console.log('New thread response:', newThread) // Debug log
      
      // Add the new thread to the beginning of the list
      setThreads(prev => [{
        id: newThread.id,
        content: content, // Use the content from the form, not API response
        authorName: newThread.authorName || 'You',
        createdAt: newThread.createdAt || new Date().toISOString(),
        upvotes: newThread.upvotes || 0,
        downvotes: newThread.downvotes || 0,
        appreciations: newThread.appreciations || 0,
        replies: newThread.replies || [],
        imageUrl: newThread.imageUrl || null,
        videoUrl: newThread.videoUrl || null,
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
      await votePost(postId, type)
      setThreads(prev =>
        prev.map(t =>
          t.id === postId
            ? {
                ...t,
                [type === 'upvote'
                  ? 'upvotes'
                  : type === 'downvote'
                  ? 'downvotes'
                  : 'appreciations'
                ]: t[type === 'upvote'
                  ? 'upvotes'
                  : type === 'downvote'
                  ? 'downvotes'
                  : 'appreciations'
                ] + 1
              }
            : t
        )
      )
    } catch (err) {
      console.error('Failed to vote:', err)
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading threads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100">
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
              className="group flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
            >
              <PlusIcon className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              <span>New Thread</span>
            </button>
          </div>
        </div>

        {/* Thread List with Connected Design */}
        <div className="space-y-6">
          {threads.map((t, index) => (
            <div
              key={t.id}
              className="relative group"
            >
              {/* Main Thread Card */}
              <div className="relative bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-600/30 hover:border-orange-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-orange-500/10">
                {/* Thread Connection Line */}
                {index < threads.length - 1 && (
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
                      <h3 className="font-semibold text-white">{t.author}</h3>
                      {/* <span className="px-2 py-1 bg-orange-500/20 text-orange-300 text-xs rounded-full">
                        Student
                      </span> */}
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

                {/* Enhanced Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleVote(t.id, 'upvote')}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-green-500/20 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <ThumbUpIcon className="h-5 w-5 text-green-400 group-hover:text-green-300" />
                      <span className="text-sm font-medium">{t.upvotes || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(t.id, 'appreciation')}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-pink-500/20 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <HeartIcon className="h-5 w-5 text-pink-400 group-hover:text-pink-300" />
                      <span className="text-sm font-medium">{t.appreciations || 0}</span>
                    </button>
                    <button
                      onClick={() => handleVote(t.id, 'downvote')}
                      className="group flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-red-500/20 rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <ThumbDownIcon className="h-5 w-5 text-red-400 group-hover:text-red-300" />
                      <span className="text-sm font-medium">{t.downvotes || 0}</span>
                    </button>
                  </div>
                  
                                     <button
                     onClick={() => setReplyTo(t)}
                     className="group flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-xl transition-all duration-300 hover:scale-105"
                   >
                     <ChatAltIcon className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300" />
                     <span className="text-sm font-medium">Reply</span>
                   </button>
                </div>

                {/* Comments Toggle */}
                {t.replies?.length > 0 && (
                  <button
                    onClick={() => toggleComments(t.id)}
                    className="mt-4 flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors duration-300"
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
                  {t.replies.map((reply, replyIndex) => (
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
    </div>
  )
}
