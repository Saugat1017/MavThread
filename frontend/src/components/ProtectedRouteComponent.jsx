// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return <div className="text-center mt-20 text-gray-400">Loading…</div>
  }

  if (!user) {
    // send them to /login, but remember where they were going
    return <Navigate to="/login" state={{ from: loc }} replace />
  }

  return <Outlet />
}
