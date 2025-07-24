// src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'

import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRouteComponent'

import Layout from './components/Layout'
import HomePage               from './pages/Home'
import Signup                 from './pages/SignUp'
import Login                  from './pages/Login'
import ForgotPassword         from './pages/ForgotPassword'
// import ResetPassword          from './pages/ResetPassword'
import Threads                from './pages/Threads'
import WeeklyLeaderboardPage  from './pages/WeeklyLeaderBoardPage'
import ProfilePage            from './pages/Profile'
import SettingsPage           from './pages/Settings'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* everything lives under one Layout */}
        <Route element={<Layout />}>
          
          {/* Public Routes */}
          <Route index               element={<HomePage />} />
          <Route path="signup"       element={<Signup />} />
          <Route path="login"        element={<Login />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          {/* <Route path="reset-password"  element={<ResetPassword />} /> */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="threads"      element={<Threads />} />
            <Route path="leaderboard"  element={<WeeklyLeaderboardPage />} />
            <Route path="profile"      element={<ProfilePage />} />
            <Route path="settings"     element={<SettingsPage />} />
          </Route>

        </Route>
      </Routes>
    </AuthProvider>
  )
}
