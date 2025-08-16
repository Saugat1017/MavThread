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
  CheckIcon,
  XIcon,
} from '@heroicons/react/outline'
import { getProfile, updateProfile, getSettings, updateSettings } from '../services/api'

export default function SettingsPage() {
  // --- Loading and Error States ---
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // --- Personal Settings ---
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [major, setMajor] = useState('')
  const [year, setYear] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // --- Privacy Settings ---
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [showPostHistory, setShowPostHistory] = useState(true)
  const [allowReplies, setAllowReplies] = useState(true)

  // --- Theme Settings ---
  const [darkMode, setDarkMode] = useState(true)

  // Load user data and settings
  useEffect(() => {
    async function loadUserData() {
      try {
        setLoading(true)
        
        // Load user profile
        const userData = await getProfile()
        console.log('User profile:', userData)
        
        // Load user settings
        const settingsData = await getSettings()
        console.log('User settings:', settingsData)
        
        // Set personal info
        setName(userData.name || userData.username || '')
        setEmail(userData.email || '')
        setMajor(userData.major || '')
        setYear(userData.year || '')
        
        // Set privacy settings
        if (settingsData) {
          setEmailNotifications(settingsData.emailNotifications !== false)
          setShowPostHistory(settingsData.showPostHistory !== false)
          setAllowReplies(settingsData.allowReplies !== false)
        }
        
        // Set theme (default to dark mode)
        setDarkMode(settingsData?.darkMode !== false)
        
      } catch (err) {
        console.error('Failed to load user data:', err)
        setMessage({ type: 'error', text: 'Failed to load user data. Please try again.' })
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [])

  // apply dark mode class
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  // Show message helper
  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  // handlers
  const savePersonal = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      const updateData = {
        name,
        email,
        major,
        year
      }
      
      await updateProfile(updateData)
      showMessage('success', 'Personal information updated successfully!')
      
    } catch (err) {
      console.error('Failed to update profile:', err)
      showMessage('error', err.message || 'Failed to update personal information')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      showMessage('error', 'Passwords do not match')
      return
    }
    if (newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters')
      return
    }
    
    try {
      setSaving(true)
      
      await updateProfile({
        currentPassword,
        newPassword
      })
      
      showMessage('success', 'Password updated successfully!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
    } catch (err) {
      console.error('Failed to change password:', err)
      showMessage('error', err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  const savePrivacy = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      await updateSettings({
        emailNotifications,
        showPostHistory,
        allowReplies
      })
      
      showMessage('success', 'Privacy settings updated successfully!')
      
    } catch (err) {
      console.error('Failed to update privacy settings:', err)
      showMessage('error', err.message || 'Failed to update privacy settings')
    } finally {
      setSaving(false)
    }
  }

  const saveTheme = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      
      await updateSettings({
        darkMode
      })
      
      showMessage('success', 'Theme updated successfully!')
      
    } catch (err) {
      console.error('Failed to update theme:', err)
      showMessage('error', err.message || 'Failed to update theme')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br  from-black via-slate-900 to-black text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br  from-black via-slate-900 to-black text-gray-100 py-8 px-4 pb-24">
      {/* Message Banner */}
      {message.text && (
        <div className={`max-w-3xl mx-auto mb-6 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success' 
            ? 'bg-green-600/20 border border-green-500/30 text-green-300' 
            : 'bg-red-600/20 border border-red-500/30 text-red-300'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <CheckIcon className="h-5 w-5 mr-2" />
            ) : (
              <XIcon className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
          <button 
            onClick={() => setMessage({ type: '', text: '' })}
            className="text-gray-400 hover:text-white"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
      )}

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
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border border-gray-700 rounded-lg p-3 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                placeholder="Enter your email"
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
                  <option value="">Select Major</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Computer Engineering">Computer Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Chemical Engineering">Chemical Engineering</option>
                  <option value="Biomedical Engineering">Biomedical Engineering</option>
                  <option value="Aerospace Engineering">Aerospace Engineering</option>
                  <option value="Industrial Engineering">Industrial Engineering</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="Business Administration">Business Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Accounting">Accounting</option>
                  <option value="Economics">Economics</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Sociology">Sociology</option>
                  <option value="Political Science">Political Science</option>
                  <option value="History">History</option>
                  <option value="English">English</option>
                  <option value="Philosophy">Philosophy</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Theater">Theater</option>
                  <option value="Communications">Communications</option>
                  <option value="Journalism">Journalism</option>
                  <option value="Education">Education</option>
                  <option value="Nursing">Nursing</option>
                  <option value="Pre-Medicine">Pre-Medicine</option>
                  <option value="Pre-Law">Pre-Law</option>
                  <option value="Environmental Science">Environmental Science</option>
                  <option value="Geology">Geology</option>
                  <option value="Astronomy">Astronomy</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Year</label>
                <select
                  value={year}
                  onChange={e => setYear(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                >
                  <option value="">Select Year</option>
                  <option value="Freshman">Freshman</option>
                  <option value="Sophomore">Sophomore</option>
                  <option value="Junior">Junior</option>
                  <option value="Senior">Senior</option>
                  <option value="Graduate">Graduate</option>
                </select>
              </div>
            </div>
            
            {/* Change Password */}
            <div className="mt-4 bg-gray-800 bg-opacity-50 rounded-lg p-4 space-y-3">
              <h3 className="flex items-center text-lg font-semibold">
                <LockClosedIcon className="h-5 w-5 mr-2 text-emerald-400" />
                Change Password
              </h3>
              <div>
                <label className="block text-gray-300 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent border border-gray-700 rounded-lg p-2 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                type="button"
                onClick={changePassword}
                disabled={saving}
                className="mt-2 bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update Password'}
              </button>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Personal Info'}
            </button>
          </form>
        </section>

        {/* Privacy Settings
        <section className="bg-gray-850 bg-opacity-60 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
          <h2 className="flex items-center text-2xl font-bold mb-4">
            <BellIcon className="h-6 w-6 mr-2 text-emerald-400" />
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
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition" />
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
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition" />
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
                <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500 transition" />
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full peer-checked:translate-x-5 transition" />
              </label>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Privacy Settings'}
            </button>
          </form>
        </section> */}

        {/* Theme Settings
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
                className="form-radio h-5 w-5 text-emerald-400"
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
                className="form-radio h-5 w-5 text-emerald-400"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-2 bg-gradient-to-r from-orange-500 to-red-500 px-6 py-2 rounded-full text-white font-semibold hover:scale-105 transform transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Theme'}
            </button>
          </form>
        </section> */}
      </div>
    </div>
  )
}
