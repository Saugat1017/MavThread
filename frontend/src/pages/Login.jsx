import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleLoginSubmit = async () => {
    const data = {
      email,
      password,
    }

    try {
      const res = await fetch('http://localhost:8082/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(err.message || 'Log in failed')
        return
      }

      const result = await res.json()
      console.log('Login success:', result)
      alert('Login successful!')
      navigate('/threads') // Redirect to threads after login
    } catch (error) {
      console.error('LOGIN ERROR:', error)
      alert('An error occurred during login.')
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleLoginSubmit()
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6"
      >
        <h2 className="text-3xl font-bold text-center">
          Login to <span className="text-lime-300">MavThread</span>
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full py-3 bg-lime-400 hover:bg-lime-300 text-white font-semibold rounded-md transition-all"
        >
          Login
        </button>

        <div className="text-center">
          <button
            type="button"
            className="text-sm text-lime-300 hover:underline transition"
            onClick={() => navigate('/forgot-password')}
          >
            Forgot Password?
          </button>
        </div>

        <p className="text-center text-sm text-white/80">
          Don't have an account?{' '}
          <button
            type="button"
            className="text-lime-300 hover:underline"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </p>
      </form>
    </div>
  )
}
