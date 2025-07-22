
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/Home'
import Signup from './pages/SignUp'
import Login from './pages/Login'
import Threads from './pages/Threads'
import WeeklyLeaderboardPage from './pages/WeeklyLeaderBoardPage'
import ProfilePage from './pages/Profile'
import SettingsPage from './pages/Settings'


export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/threads" element={<Threads />} />
        <Route path="/leaderboard" element={<WeeklyLeaderboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        
      </Route>
    </Routes>
  )
}

