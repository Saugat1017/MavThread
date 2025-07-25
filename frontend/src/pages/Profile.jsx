// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'
import {
  LightningBoltIcon,
  HeartIcon,
  ChatAlt2Icon,
  UserCircleIcon,
} from '@heroicons/react/outline'
import ThreadCard from '../components/Threads/ThreadCard'
import { getProfile, getMyPosts, getMyHistory } from '../services/api'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProfile() {
      try {
        // 1) Fetch current user
        const u = await getProfile()
        console.log(u) // DEBUG
        // 2) Fetch that user’s threads/posts
        const posts = await getMyHistory()   // expects an array
        console.log(posts) // DEBUG
        setUser(u)
        setThreads(posts)
      } catch (err) {
        console.error('Failed to load profile or threads:', err)
        // optionally redirect to /login on 401
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Loading your profile…</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Unable to load profile. Please log in again.</p>
      </div>
    )
  }

  const avatarUrl = user.avatarUrl || `https://i.pravatar.cc/150?u=${user.id}`

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100 px-4 py-8">
      {/* Cover + Avatar */}
      <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-t-2xl overflow-visible">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 bg-gray-900 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Name & Bio */}
      <div className="mt-20 text-center">
        <h1 className="text-3xl font-bold">{user.name}</h1>
        {user.bio && <p className="mt-2 text-gray-300 italic">{user.bio}</p>}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="bg-gray-850 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center">
          <LightningBoltIcon className="h-8 w-8 text-yellow-400" />
          <span className="mt-2 text-xl font-semibold">{user.points}</span>
          <span className="text-sm text-gray-400">Points</span>
        </div>
        <div className="bg-gray-850 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center">
          <HeartIcon className="h-8 w-8 text-pink-400" />
          <span className="mt-2 text-xl font-semibold">{user.helped}</span>
          <span className="text-sm text-gray-400">Helped Mavs</span>
        </div>
        <div className="bg-gray-850 bg-opacity-50 backdrop-blur-lg rounded-lg p-4 flex flex-col items-center">
          <ChatAlt2Icon className="h-8 w-8 text-blue-400" />
          <span className="mt-2 text-xl font-semibold">{threads.length}</span>
          <span className="text-sm text-gray-400">Threads</span>
        </div>
      </div>

      {/* Your Threads */}
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Recent Threads</h2>
        {threads.length > 0 ? (
          <div className="space-y-6">
            {threads.map((t) => (
              <div
                key={t.id}
                className="transform hover:scale-105 transition duration-200"
              >
                <ThreadCard
                  thread={{
                    author: user.name,
                    content: t.content,
                    timestamp: t.timestamp,
                    upvotes: t.upvotes,
                    downvotes: t.downvotes,
                    appreciations: t.appreciations,
                  }}
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You haven't posted any threads yet.</p>
        )}
      </div>
    </div>
  )
}
