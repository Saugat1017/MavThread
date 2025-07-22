// src/pages/SettingsPage.jsx
import React, { useState, useEffect } from 'react'
import {
  UserIcon,
  CogIcon,
  BellIcon,
  EyeIcon,
  EyeOffIcon,
  MoonIcon,
  SunIcon,
  LockClosedIcon,
} from '@heroicons/react/outline'

export default function SettingsPage() {
  // --- Personal Settings ---
  const [name, setName] = useState('Test User')
  const [email, setEmail] = useState('you@example.com')
  const [major, setMajor] = useState('Computer Science')
  const [year, setYear] = useState('Senior')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // --- Privacy Settings ---
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [showPostHistory, setShowPostHistory] = useState(true)
  const [allowReplies, setAllowReplies] = useState(true)

  // --- Theme Settings ---
  const [darkMode, setDarkMode] = useState(true)

  // apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // handlers (stubbed)
  const savePersonal = e => {
    e.preventDefault()
    console.log('Saved personal:', { name, email, major, year })
  }
  const changePassword = e => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match')
      return
    }
    console.log('Password changed:', { currentPassword, newPassword })
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }
  const savePrivacy = e => {
    e.preventDefault()
    console.log('Saved privacy:', { emailNotifications, showPostHistory, allowReplies })
  }
  const saveTheme = e => {
    e.preventDefault()
    console.log('Saved theme:', { darkMode })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Personal Settings */}
        <section className="bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <UserIcon className="h-6 w-6 mr-2 text-orange-400" />
            Personal Settings
          </h2>
          <form onSubmit={savePersonal} className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Major</label>
                <select
                  value={major}
                  onChange={e => setMajor(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                >
                  <option>Computer Science</option>
                  <option>Engineering</option>
                  <option>Business</option>
                  <option>Arts</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Year</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                >
                  <option>Freshman</option>
                  <option>Sophomore</option>
                  <option>Junior</option>
                  <option>Senior</option>
                </select>
              </div>
            </div>
            {/* Change Password */}
            <div className="mt-4 bg-gray-800 bg-opacity-50 rounded-lg p-4 space-y-3">
              <h3 className="flex items-center text-lg font-semibold">
                <LockClosedIcon className="h-5 w-5 mr-2 text-pink-400" />
                Change Password
              </h3>
              <div>
                <label className="block text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                />
              </div>
              <button
                type="button"
                onClick={changePassword}
                className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition"
              >
                Update Password
              </button>
            </div>

            <button
              type="submit"
              className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition"
            >
              Save Personal
            </button>
          </form>
        </section>

        {/* Privacy Settings */}
        <section className="bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <BellIcon className="h-6 w-6 mr-2 text-lime-400" />
            Privacy Settings
          </h2>
          <form onSubmit={savePrivacy} className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Email Notifications</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={e => setEmailNotifications(e.target.checked)}
                  className="sr-only"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-lime-500 transition" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Show Post History</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPostHistory}
                  onChange={e => setShowPostHistory(e.target.checked)}
                  className="sr-only"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-lime-500 transition" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span>Allow Replies</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={allowReplies}
                  onChange={e => setAllowReplies(e.target.checked)}
                  className="sr-only"
                />
                <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-lime-500 transition" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition" />
              </label>
            </div>
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition"
            >
              Save Privacy
            </button>
          </form>
        </section>

        {/* Theme Settings */}
        <section className="bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <CogIcon className="h-6 w-6 mr-2 text-blue-400" />
            Theme Settings
          </h2>
          <form onSubmit={saveTheme} className="space-y-4">
            <div className="flex items-center space-x-3">
              <SunIcon className={`h-6 w-6 ${!darkMode ? 'text-yellow-300' : 'text-gray-500'}`} />
              <label className="flex-1">Light Mode</label>
              <input
                type="radio"
                name="theme"
                checked={!darkMode}
                onChange={() => setDarkMode(false)}
                className="form-radio h-5 w-5 text-lime-400"
              />
            </div>
            <div className="flex items-center space-x-3">
              <MoonIcon className={`h-6 w-6 ${darkMode ? 'text-gray-200' : 'text-gray-500'}`} />
              <label className="flex-1">Dark Mode</label>
              <input
                type="radio"
                name="theme"
                checked={darkMode}
                onChange={() => setDarkMode(true)}
                className="form-radio h-5 w-5 text-lime-400"
              />
            </div>
            <button
              type="submit"
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition"
            >
              Save Theme
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
