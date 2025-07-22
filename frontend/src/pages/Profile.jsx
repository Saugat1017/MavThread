// // src/pages/ProfilePage.jsx
// import React, { useState, useEffect } from 'react'
// import { UserCircleIcon } from '@heroicons/react/outline'
// import ThreadCard from '../components/Threads/ThreadCard'

// export default function ProfilePage() {
//   const [user, setUser] = useState(null)
//   const [threads, setThreads] = useState([])

//   useEffect(() => {
//     // Replace these with your real endpoints
//     Promise.all([
//       fetch('/api/me'),
//       fetch('/api/threads/mine'),
//     ])
//       .then(async ([uRes, tRes]) => {
//         if (!uRes.ok || !tRes.ok) throw new Error('Failed to load')
//         const u = await uRes.json()
//         const t = await tRes.json()
//         setUser(u)
//         setThreads(t)
//       })
//       .catch(err => {
//         console.error(err)
//         // handle error (e.g. redirect to login)
//       })
//   }, [])

//   if (!user) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
//         <p>Loading your profile…</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-8">
//       <div className="max-w-2xl mx-auto bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
//         {/* Profile Header */}
//         <div className="flex items-center space-x-4 mb-6">
//           <UserCircleIcon className="h-16 w-16 text-orange-400" />
//           <div>
//             <h1 className="text-3xl font-bold">{user.name}</h1>
//             <p className="text-gray-400">{user.email}</p>
//             {user.bio && <p className="mt-1 text-gray-400 italic">{user.bio}</p>}
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="flex space-x-6 mb-8">
//           <div className="text-center">
//             <p className="text-xl font-semibold text-yellow-300">{user.points}</p>
//             <p className="text-gray-400 text-sm">Points</p>
//           </div>
//           <div className="text-center">
//             <p className="text-xl font-semibold text-lime-300">{user.helped}</p>
//             <p className="text-gray-400 text-sm">Helped Mavs</p>
//           </div>
//         </div>

//         {/* Your Threads */}
//         <h2 className="text-2xl font-bold mb-4">Your Threads</h2>
//         {threads.length > 0 ? (
//           <div className="space-y-6">
//             {threads.map((thread) => (
//               <ThreadCard
//                 key={thread.id}
//                 thread={{
//                   author: user.name,
//                   content: thread.content,
//                   timestamp: thread.timestamp,
//                   upvotes: thread.upvotes,
//                   downvotes: thread.downvotes,
//                   appreciations: thread.appreciations,
//                 }}
//               />
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-400">You haven't posted any threads yet.</p>
//         )}
//       </div>
//     </div>
//   )
// }


// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react'
import {
  LightningBoltIcon,
  HeartIcon,
  ChatAlt2Icon,
} from '@heroicons/react/outline'
import ThreadCard from '../components/Threads/ThreadCard'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [threads, setThreads] = useState([])

  useEffect(() => {
    // —– MOCK DATA FOR DEMO —–
    const mockUser = {
      id: 3,
      name: 'Test User',
      bio: 'Maverick coder and open-source lover.',
      points: 84,
      helped: 12,
      threadCount: 7,
      avatarUrl: 'https://i.pravatar.cc/150?img=3',
    }
    const mockThreads = [
      {
        id: 101,
        content: 'Just discovered glass-morphism in Tailwind—so cool!',
        timestamp: '2025-07-20T12:00:00Z',
        upvotes: 14,
        downvotes: 1,
        appreciations: 5,
      },
      {
        id: 102,
        content: 'Does anyone have tips for React suspense?',
        timestamp: '2025-07-19T09:30:00Z',
        upvotes: 8,
        downvotes: 0,
        appreciations: 3,
      },
      // …more
    ]

    // simulate loading
    setTimeout(() => {
      setUser(mockUser)
      setThreads(mockThreads)
    }, 200)
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
        <p>Loading your profile…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100 px-4 py-8">
      {/* Cover + Avatar */}
      <div className="relative h-48 bg-gradient-to-r from-emerald-500 to-emerald-700 rounded-t-2xl overflow-visible">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="w-32 h-32 bg-gray-900 rounded-full border-4 border-white overflow-hidden shadow-lg">
            <img
              src={user.avatarUrl}
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
          <span className="mt-2 text-xl font-semibold">{user.threadCount}</span>
          <span className="text-sm text-gray-400">Threads</span>
        </div>
      </div>

      {/* Recent Threads */}
      <div className="mt-12 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Your Recent Threads</h2>
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
      </div>
    </div>
  )
}
