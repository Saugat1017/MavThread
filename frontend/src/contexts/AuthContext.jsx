// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { getProfile, logout as apiLogout } from '../../src/services/api'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // on app start, try to load current user
    getProfile()
      .then(u => setUser(u))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const logout = async () => {
    await apiLogout()          // e.g. POST /auth/logout that clears cookie
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
