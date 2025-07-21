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
} from '@heroicons/react/outline'

const mockThreads = [
  {
    id: 1,
    author: 'Anmol Pandey',
    content: 'Started working on a new thread app today!',
    timestamp: '2025-07-20T18:35:00Z',
    upvotes: 10,
    downvotes: 2,
    appreciations: 3,
    comments: [],
  },
  // …
]

export default function ThreadsPage() {
  const [threads, setThreads] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [replyTo, setReplyTo] = useState(null)

  useEffect(() => {
    // TODO: replace with real fetch
    setThreads(mockThreads)
  }, [])

  const handleCreate = (newThread) => {
    const threadWithMeta = {
      id: Date.now(),
      author: 'You',
      upvotes: 0,
      downvotes: 0,
      appreciations: 0,
      comments: [],
      ...newThread,
    }
    setThreads((prev) => [threadWithMeta, ...prev])
  }

  const handleReply = (threadId, text) => {
    setThreads((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          const newComment = {
            id: Date.now(),
            author: 'You',
            content: text,
            timestamp: new Date().toISOString(),
          }
          return {
            ...thread,
            comments: [...(thread.comments || []), newComment],
          }
        }
        return thread
      })
    )
    setReplyTo(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 space-y-6">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 pt-8">
          <h1 className="text-2xl font-bold">Threads</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-semibold hover:scale-105 transform transition"
          >
            <span className="text-xl">+</span>
            <span>Create Thread</span>
          </button>
        </div>

        {/* Thread List */}
        {threads.map((t) => (
          <div
            key={t.id}
            className="relative bg-gray-850 bg-opacity-60 backdrop-blur-sm p-6 rounded-2xl shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-4">
              <UserCircleIcon className="h-10 w-10 text-orange-400" />
              <div>
                <p className="font-semibold">{t.author}</p>
                <p className="text-xs text-gray-400">
                  {new Date(t.timestamp).toLocaleString()}
                </p>
              </div>
            </div>

            <p className="mb-5">{t.content}</p>

            <div className="flex justify-between">
              <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                <ThumbUpIcon className="h-5 w-5 text-green-400" />
                <span className="text-sm">{t.upvotes}</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                <HeartIcon className="h-5 w-5 text-pink-400" />
                <span className="text-sm">{t.appreciations}</span>
              </button>
              <button className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-700 transition">
                <ThumbDownIcon className="h-5 w-5 text-red-400" />
                <span className="text-sm">{t.downvotes}</span>
              </button>
              <button
                onClick={() => setReplyTo(t)}
                className="flex items-center space-x-1 px-3 py-2 rounded-full hover:bg-gray-700 transition"
              >
                <ChatAltIcon className="h-5 w-5 text-blue-400" />
                <span className="text-sm">Reply</span>
              </button>
            </div>

            {/* Comments */}
            {t.comments?.length > 0 && (
              <div className="mt-4 space-y-3">
                {t.comments.map((c) => (
                  <div
                    key={c.id}
                    className="ml-12 bg-gray-800 bg-opacity-60 backdrop-blur-sm p-4 rounded-lg"
                  >
                    <p className="text-sm">
                      <span className="font-semibold">{c.author}</span>{' '}
                      <span className="text-gray-400">
                        {new Date(c.timestamp).toLocaleString()}
                      </span>
                    </p>
                    <p className="mt-1">{c.content}</p>
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
          onReply={handleReply}
        />
      )}
    </div>
  )
}
