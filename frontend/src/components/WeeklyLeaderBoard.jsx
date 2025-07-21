// src/components/WeeklyLeaderboard.jsx
import React, { useState, useEffect } from 'react'
import {
  TableIcon as TrophyIcon,
  UserCircleIcon,
  ArrowRightIcon,
} from '@heroicons/react/outline'
import { useNavigate } from 'react-router-dom'

const mockData = [
  { id: 1, name: 'Alice Johnson', points: 120, helped:  8 },
  { id: 2, name: 'Bob Smith',     points: 110, helped:  5 },
  { id: 3, name: 'You',           points: 105, helped:  6 },
  { id: 4, name: 'Carol Lee',     points:  98, helped:  4 },
  { id: 5, name: 'Danielle Ray',  points:  92, helped:  3 },
  { id: 6, name: 'Evan Cole',     points:  88, helped:  2 },
]

export default function WeeklyLeaderboard() {
  const [leaders, setLeaders] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const top5 = [...mockData]
      .sort((a, b) => b.points - a.points)
      .slice(0, 5)
    setLeaders(top5)
  }, [])

  const maxPoints = leaders[0]?.points || 1
  const medalGradients = [
    'from-yellow-400 to-yellow-600', // 🥇
    'from-gray-300 to-gray-500',     // 🥈
    'from-yellow-700 to-yellow-800', // 🥉
  ]
  const medals = ['🥇','🥈','🥉']

  return (
    <div className="max-w-md mx-auto bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl pt-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Weekly Leaderboard</h2>
        <TrophyIcon className="h-7 w-7 text-yellow-400" />
      </div>

      {/* List */}
      <ol className="space-y-4">
        {leaders.map((user, idx) => {
          const pct = Math.round((user.points / maxPoints) * 100)
          return (
            <li
              key={user.id}
              onClick={() => navigate(`/profile/${user.id}`)}
              className={`
                flex flex-col bg-gray-800 bg-opacity-50 rounded-lg p-4 
                hover:bg-gray-700 hover:scale-105 transform transition
                cursor-pointer
              `}
            >
              {/* Top-3 Medal */}
              {idx < 3 && (
                <span
                  className={`
                    inline-block mb-2 px-2 py-0.5 rounded-full 
                    bg-gradient-to-r ${medalGradients[idx]} 
                    text-black text-xs font-semibold
                  `}
                >
                  {medals[idx]}
                </span>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold text-white">{idx + 1}.</span>
                  <UserCircleIcon className="h-8 w-8 text-orange-400" />
                  <span className="font-medium text-white">{user.name}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-300 font-semibold">{user.points} pts</span>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Helped count */}
              <p className="mt-2 text-gray-400 text-sm italic">
                helped {user.helped} mav{user.helped > 1 ? 's' : ''}
              </p>
            </li>
          )
        })}
      </ol>

      {/* View Full */}
      <div className="mt-6 text-center">
        <button
          onClick={() => navigate('/leaderboard')}
          className="inline-flex items-center space-x-1 text-sm text-lime-400 hover:underline"
        >
          <span>View Full Leaderboard</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
