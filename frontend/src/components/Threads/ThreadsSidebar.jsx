// src/components/Threads/ThreadsSidebar.jsx
import React from 'react'
import {
  BellIcon,
  DesktopComputerIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline'

export default function ThreadsSidebar() {
  return (
    <aside className="w-1/3 hidden lg:block sticky top-24">
      <div className="space-y-6">
        {/* Pinned Announcements */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/40 shadow-lg">
          <div className="flex items-center mb-4">
            <BellIcon className="h-6 w-6 text-amber-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Pinned Announcements</h2>
          </div>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• Welcome Week Social — Aug 10</li>
            <li>• Career Fair Prep Session — Aug 12</li>
            <li>• System Maintenance — Aug 15</li>
          </ul>
        </div>

        {/* Study Groups & Trending Topics */}
        <div className="bg-gradient-to-br from-gray-800/70 to-gray-700/70 backdrop-blur-lg rounded-2xl p-6 border border-gray-600/40 shadow-lg">
          <div className="flex items-center mb-4">
            <DesktopComputerIcon className="h-6 w-6 text-emerald-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Study Groups</h2>
          </div>
          <ul className="space-y-2 text-gray-300 text-sm mb-4">
            <li>• Linear Algebra — Wed 6PM</li>
            <li>• Algorithms — Thu 7PM</li>
            <li>• Databases — Fri 5PM</li>
          </ul>

          <div className="flex items-center mb-4">
            <TrendingUpIcon className="h-6 w-6 text-pink-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">Trending Topics</h2>
          </div>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>• #ReactHooks</li>
            <li>• #TailwindCSS</li>
            <li>• #SystemDesign</li>
          </ul>
        </div>
      </div>
    </aside>
  )
}
