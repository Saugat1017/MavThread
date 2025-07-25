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

  // fetch threads on mount
  useEffect(() => {
    fetchThreads()
    console.log("Called fetchThread")
  }, [])

  async function fetchThreads() {
    try {
      const data = await getGroupPosts()
      console.log("Post Data: ", data) // DEBUG
      console.log("Called fetchThread")
      setThreads(data)
    } catch (err) {
      console.error('Failed to load posts:', err)
    }
  }

  // create new top‐level post
  async function handleCreate({ content }) {
    try {
      const newThread = await createPost(content)
      setThreads(prev => [{ ...newThread, comments: [] }, ...prev])
    } catch (err) {
      console.error('Failed to create post:', err)
    } finally {
      setShowModal(false)
    }
  }

  // reply to a post
  async function handleReply(post, text) {
    try {
      const comment = await replyPost(post.id, text)
      setThreads(prev =>
        prev.map(t =>
          t.id === post.id
            ? { ...t, comments: [...(t.comments || []), comment] }
            : t
        )
      )
    } catch (err) {
      console.error('Failed to reply:', err)
    } finally {
      setReplyTo(null)
    }
  }

  // cast a vote (upvote/ appreciation / downvote)
  async function handleVote(postId, type) {
    try {
      await votePost(postId, type)
      // optionally refetch or update counts:
      setThreads(prev =>
        prev.map(t =>
          t.id === postId
            ? {
              ...t,
              [type === 'upvote' ? 'upvotes'
                : type === 'downvote' ? 'downvotes'
                  : 'appreciations'
              ]: t[type === 'upvote' ? 'upvotes'
                : type === 'downvote' ? 'downvotes'
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

  const toggleComments = (id) =>
    setExpanded(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 pt-8">
          <h1 className="text-2xl font-bold">Threads</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-semibold hover:scale-105 transition"
          >
            <span className="text-xl">+</span>
            <span>Create Thread</span>
          </button>
        </div>

        {/* Thread List */}
        {threads.map(t => (
          <div
            key={t.id}
            className="relative bg-gray-850 bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl shadow-lg border-l-4 border-indigo-500 hover:shadow-xl transition"
          >
            {/* Main Thread */}
            <div className="flex items-center space-x-3 mb-4">
              <UserCircleIcon className="h-10 w-10 text-orange-400" />
              <div>
                <p className="font-semibold text-white">{t.author}</p>
                <p className="text-xs text-gray-400">
                  {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
            <p className="mb-5 text-gray-100">{t.content}</p>

            {/* Actions */}
            <div className="flex space-x-4 text-sm text-gray-300">
              <button
                onClick={() => handleVote(t.id, 'upvote')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              >
                <ThumbUpIcon className="h-5 w-5 text-green-400" />
                <span>{t.upvotes}</span>
              </button>
              <button
                onClick={() => handleVote(t.id, 'appreciation')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              >
                <HeartIcon className="h-5 w-5 text-pink-400" />
                <span>{t.appreciations}</span>
              </button>
              <button
                onClick={() => handleVote(t.id, 'downvote')}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              >
                <ThumbDownIcon className="h-5 w-5 text-red-400" />
                <span>{t.downvotes}</span>
              </button>
              <button
                onClick={() => setReplyTo(t)}
                className="flex items-center space-x-1 px-3 py-1 bg-gray-800 rounded-full hover:bg-gray-700 transition"
              >
                <ChatAltIcon className="h-5 w-5 text-blue-400" />
                <span>Reply</span>
              </button>
            </div>

            {/* Toggle Comments */}
            <button
              onClick={() => toggleComments(t.id)}
              className="mt-4 flex items-center text-sm text-gray-400 hover:text-gray-200 transition"
            >
              {expanded.includes(t.id) ? (
                <ChevronUpIcon className="h-4 w-4" />
              ) : (
                <ChevronDownIcon className="h-4 w-4" />
              )}
              <span className="ml-1">{t.comments?.length || 0} Comments</span>
            </button>

            {/* comments */}
            {expanded.includes(t.id) && t.comments?.length > 0 && (
              <div className="mt-4 space-y-3">
                {t.comments.map(c => (
                  <div key={c.id} className="ml-10 pl-4 border-l-2 border-emerald-500 …">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold">{c.author}</span>
                      <span className="text-gray-500">
                        {new Date(c.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p>{c.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <Footer />
      </div>

      {/* Create Thread Modal */}
      {showModal && (
        <CreateThread
          onClose={() => setShowModal(false)}
          onCreate={handleCreate}
        />
      )}

      {/* Reply Modal */}
      {replyTo && (
        <ReplyModal
          thread={replyTo}
          onClose={() => setReplyTo(null)}
          onReply={text => handleReply(replyTo, text)}
        />
      )}
    </div>
  )
}
