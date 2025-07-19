import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  }

  const handleSignUp = () => {
    navigate("/signup")
  }

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-md bg-white/10 z-50 p-3">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl font-extrabold tracking-wide">
          <span className="text-white">MAV</span>
          <span className="bg-gradient-to-r from-orange-500 to-red-500 text-transparent bg-clip-text">THREAD</span>
        </h1>

        {/* Nav buttons */}
        <div className="flex gap-4">
          <button className="text-white border border-white px-4 py-1 rounded-md hover:bg-white hover:text-blue-600 transition" 
          onClick={handleLogin}>
            LOGIN
          </button>
          <button className="bg-lime-500 text-white px-4 py-1 rounded-md shadow-md hover:bg-lime-300 transition "
          onClick={handleSignUp}>
            SIGN UP
          </button>
        </div>
      </div>
    </header>
  );
}
