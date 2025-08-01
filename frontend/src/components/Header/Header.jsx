// src/components/Header.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // new state to track whether we're scrolled to top
  const [isAtTop, setIsAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY === 0)
    }

    // listen for scroll events
    window.addEventListener('scroll', handleScroll)
    // call once to initialize
    handleScroll()

    // cleanup
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogin = () => navigate('/login')
  const handleSignUp = () => navigate('/signup')
  const handleLogoClick = () => user ? navigate('/threads') : navigate('/')
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // if not at top, render nothing
  if (!isAtTop) return null

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-transparent z-50 p-3">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl font-extrabold tracking-wide cursor-pointer"
          onClick={handleLogoClick}
        >
          <span className="text-white">MAV</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">
            THREAD
          </span>
        </h1>

        {/* Nav buttons */}
        <div className="flex gap-4">
          {user ? (
            <>
              <button
                className="text-white border border-white px-4 py-1 rounded-md hover:bg-white hover:text-blue-600 transition"
                onClick={() => navigate('/profile')}
              >
                PROFILE
              </button>
              <button
                className="bg-red-500 text-white px-4 py-1 rounded-md shadow-md hover:bg-red-400 transition"
                onClick={handleLogout}
              >
                LOGOUT
              </button>
            </>
          ) : (
            <>
              <button
                className="text-white border border-white px-4 py-1 rounded-md hover:bg-white hover:text-blue-600 transition"
                onClick={handleLogin}
              >
                LOGIN
              </button>
              <button
                className="bg-lime-500 text-white px-4 py-1 rounded-md shadow-md hover:bg-lime-300 transition"
                onClick={handleSignUp}
              >
                SIGN UP
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
