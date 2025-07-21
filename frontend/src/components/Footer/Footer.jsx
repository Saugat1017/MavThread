import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ThumbUpIcon,
  HeartIcon,
  ThumbDownIcon,
  ChatAltIcon,
  HomeIcon,
  TableIcon as TrophyIcon,
  CogIcon,
  UserCircleIcon,
} from '@heroicons/react/outline'



export default function Footer() {

  const navigate = useNavigate()

  const handleHomeClick = () => {
    navigate("/")
  }

  const handleLeaderBoardClick = () => {
    navigate("/leaderboard")
  }

  const handleSettingClick = () => {
    navigate("/settings")
  }

  const handleProfileClick = () => {
    navigate("/profile")
  }


  return (
    <>{/* 📱 Bottom Nav */}
      <nav className="bg-gray-900 border-t border-gray-700 py-3 fixed bottom-0 inset-x-0">
        <div className="container mx-auto px-8 flex justify-between text-gray-500">
          <button className="flex flex-col items-center hover:text-orange-400 transition">
            <HomeIcon className="h-6 w-6" onClick={handleHomeClick}/>
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition" onClick={handleLeaderBoardClick}>
            <TrophyIcon className="h-6 w-6" />
            <span className="text-xs">LeaderBoard</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition" onClick={handleSettingClick}>
            <CogIcon className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition" onClick={handleProfileClick}>
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
    </>
  )
}