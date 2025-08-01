// src/components/WeeklyLeaderboard.jsx
import React, { useState, useEffect } from 'react'
import WeeklyLeaderBoard from "../components/WeeklyLeaderBoard"

export default function WeeklyLeaderBoardPage() {
    return (
        <div className="min-h-screen bg-gradient-to-tr  from-black via-slate-900 to-black text-gray-100 py-8">
            <WeeklyLeaderBoard />
        </div>
    )
}