// src/components/WeeklyLeaderboard.jsx
import React, { useState, useEffect } from 'react'
import {
  TableIcon as TrophyIcon,
  UserCircleIcon,
  FireIcon,
  HeartIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'
import { getLeaderboard, getGroupLeaderboard, getMyRank } from '../services/api'

export default function WeeklyLeaderboard() {
  const [leaders, setLeaders] = useState([])
  const [myRank, setMyRank] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadLeaderboard() {
      try {
        setLoading(true)
        setError(null)
        
        // Try to get the main leaderboard first
        let leaderboardData
        try {
          leaderboardData = await getLeaderboard()
          console.log('Leaderboard data:', leaderboardData)
        } catch (err) {
          console.log('Main leaderboard failed, trying group leaderboard:', err)
          // Fallback to group leaderboard
          leaderboardData = await getGroupLeaderboard()
          console.log('Group leaderboard data:', leaderboardData)
        }
        
        // Get current user's rank
        try {
          const rankData = await getMyRank()
          console.log('My rank data:', rankData)
          setMyRank(rankData)
        } catch (err) {
          console.log('Failed to get user rank:', err)
          setMyRank(null)
        }
        
        // Process leaderboard data
        if (Array.isArray(leaderboardData)) {
          setLeaders(leaderboardData)
        } else if (leaderboardData && Array.isArray(leaderboardData.users)) {
          setLeaders(leaderboardData.users)
        } else if (leaderboardData && Array.isArray(leaderboardData.leaders)) {
          setLeaders(leaderboardData.leaders)
        } else {
          // Fallback to empty array if data structure is unexpected
          setLeaders([])
        }
        
      } catch (err) {
        console.error('Failed to load leaderboard:', err)
        setError('Failed to load leaderboard. Please try again.')
        setLeaders([])
      } finally {
        setLoading(false)
      }
    }
    
    loadLeaderboard()
  }, [])

  const getRankStyle = (rank) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-orange-500',
          icon: '🥇',
          title: 'Champion'
        }
      case 2:
        return {
          bg: 'bg-emerald-500',
          icon: '🥈',
          title: 'Runner-up'
        }
      case 3:
        return {
          bg: 'bg-orange-400',
          icon: '🥉',
          title: 'Bronze'
        }
      default:
        return {
          bg: 'bg-gray-600',
          icon: `${rank}`,
          title: 'Contender'
        }
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading leaderboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <ExclamationCircleIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Oops!</h2>
          <p className="text-gray-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-full text-white font-semibold transition"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-orange-500 rounded-2xl">
            <TrophyIcon className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">
              Weekly Leaderboard
            </h1>
            <p className="text-gray-400 text-sm mt-1">Top contributors this week</p>
          </div>
        </div>
        
        {/* My Rank Display */}
        {myRank && (
          <div className="mt-4 p-4 bg-orange-500/20 border border-orange-500/30 rounded-lg">
            <p className="text-orange-300 font-semibold">
              Your Rank: #{myRank.rank || myRank.position || 'N/A'}
            </p>
            {myRank.points && (
              <p className="text-gray-300 text-sm">
                Points: {myRank.points}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard List */}
      {leaders.length > 0 ? (
        <div className="space-y-4">
          {leaders.map((user, idx) => {
            const rankStyle = getRankStyle(idx + 1)
            const isCurrentUser = user.isCurrentUser || user.name === 'You' || user.username === 'You'
            
            return (
              <div
                key={user.id || idx}
                className={`
                  relative bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 
                  border border-gray-600/30 hover:border-orange-500/50 
                  transition-all duration-300 cursor-pointer
                  ${isCurrentUser ? 'ring-2 ring-orange-500/50' : ''}
                `}
              >
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3">
                  <div className={`
                    ${rankStyle.bg} w-12 h-12 rounded-full 
                    flex items-center justify-center text-white font-bold text-lg
                    shadow-lg
                  `}>
                    {rankStyle.icon}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="h-12 w-12 bg-gray-600 rounded-full flex items-center justify-center">
                        <UserCircleIcon className="h-8 w-8 text-white" />
                      </div>
                      {isCurrentUser && (
                        <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full border-2 border-gray-800"></div>
                      )}
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${isCurrentUser ? 'text-orange-400' : 'text-white'}`}>
                        {user.name || user.username || user.authorName || 'Anonymous'}
                      </h3>
                      <p className="text-gray-400 text-sm">{rankStyle.title}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <FireIcon className="h-5 w-5 text-orange-400" />
                      <span className="text-orange-300 font-bold">
                        {user.points || user.totalPoints || user.score || 0}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <HeartIcon className="h-5 w-5 text-emerald-400" />
                      <span className="text-emerald-300 font-bold">
                        {user.helped || user.helpCount || user.assists || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="bg-gray-800/60 backdrop-blur-sm rounded-3xl p-12 border border-gray-600/30 max-w-md mx-auto">
            <TrophyIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">No Data Yet</h3>
            <p className="text-gray-300 leading-relaxed">
              The leaderboard is empty. Start participating to see rankings!
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
