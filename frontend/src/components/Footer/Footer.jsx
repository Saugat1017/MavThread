import React from "react";
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

export default function Footer () {
    return(
        <>{/* 📱 Bottom Nav */}
      <nav className="bg-gray-900 border-t border-gray-700 py-3 fixed bottom-0 inset-x-0">
        <div className="container mx-auto px-8 flex justify-between text-gray-500">
          <button className="flex flex-col items-center hover:text-orange-400 transition">
            <HomeIcon className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition">
            <TrophyIcon className="h-6 w-6" />
            <span className="text-xs">LeaderBoard</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition">
            <CogIcon className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
          <button className="flex flex-col items-center hover:text-orange-400 transition">
            <UserCircleIcon className="h-6 w-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </nav>
      </>
    )
}