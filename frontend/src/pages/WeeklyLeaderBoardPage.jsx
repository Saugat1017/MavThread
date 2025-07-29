// src/components/WeeklyLeaderboard.jsx
import React, { useState, useEffect } from 'react'
import WeeklyLeaderBoard from "../components/WeeklyLeaderBoard"

export default function WeeklyLeaderBoardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 text-gray-100 py-8">
            <WeeklyLeaderBoard />
        </div>
    )
}