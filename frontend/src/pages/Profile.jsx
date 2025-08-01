// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'
import {
  LightningBoltIcon,
  ChatAlt2Icon,
  UserCircleIcon,
  FireIcon,
  StarIcon,
  CalendarIcon,
  SparklesIcon,
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
        setLoading(true)
        // 1) Fetch current user profile
        const userData = await getProfile()
        console.log('User profile:', userData) // DEBUG
        
        // 2) Fetch that user's threads/posts
        const posts = await getMyHistory()
        console.log('User posts:', posts) // DEBUG
        
        setUser(userData)
        setThreads(Array.isArray(posts) ? posts : [])
      } catch (err) {
        console.error('Failed to load profile or threads:', err)
        setUser(null)
        setThreads([])
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr  from-black via-slate-900 to-black text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr  from-black via-slate-900 to-black text-gray-100">
        <div className="text-center">
          <UserCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">Unable to load profile. Please log in again.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr  from-black via-slate-900 to-black text-gray-100">
      <div className="container mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="text-center mb-12">
          {/* Simple Profile Icon */}
          <div className="inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-full p-1 shadow-lg">
              <div className="w-full h-full bg-gray-900 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <h1 className="text-4xl font-bold text-white mb-3">
            {user.name || user.username || user.email || 'User'}
          </h1>
          {user.bio && (
            <p className="text-gray-300 max-w-lg mx-auto leading-relaxed mb-4">
              {user.bio}
            </p>
          )}
          
          {/* Join Date */}
          <div className="flex items-center justify-center space-x-2 text-gray-400 text-sm">
            <CalendarIcon className="h-4 w-4" />
            <span>Member since {new Date().getFullYear()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 hover:border-emerald-400/50 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <LightningBoltIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-300 mb-1">
                {user.points || user.totalPoints || 0}
              </div>
              <div className="text-sm text-gray-300">Total Points</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-xl rounded-2xl p-6 border border-orange-500/30 hover:border-orange-400/50 transition-all duration-300 group">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <ChatAlt2Icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-300 mb-1">{threads.length}</div>
              <div className="text-sm text-gray-300">Threads Created</div>
            </div>
          </div>
        </div>

        {/* Activity Section */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Your Activity</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-300">
              <FireIcon className="h-4 w-4 text-emerald-400" />
              <span>Community Contributor</span>
            </div>
          </div>

          {threads.length > 0 ? (
            <div className="space-y-6">
              {threads.map((t) => (
                <div
                  key={t.id}
                  className="transform hover:scale-105 transition duration-300"
                >
                  <ThreadCard
                    thread={{
                      author: user.name || user.username || 'You',
                      content: t.content,
                      timestamp: t.createdAt || t.timestamp,
                      upvotes: t.upvotes || 0,
                      downvotes: t.downvotes || 0,
                      appreciations: t.appreciations || 0,
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-emerald-600/10 to-orange-600/10 backdrop-blur-xl rounded-3xl p-12 border border-emerald-500/20 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <SparklesIcon className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Ready to Share?</h3>
                <p className="text-gray-300 leading-relaxed">
                  Start your journey by creating your first thread and connecting with the community!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
