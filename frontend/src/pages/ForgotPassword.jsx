// src/pages/ForgotPassword.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * POST /auth/forgot-password
 * Request JSON: { email: string }
 * Response JSON: { message: string }
 */
export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("http://localhost:8082/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        setIsSuccess(true)
        setMessage(data.message || "Reset link sent! Check your email.")
      } else {
        setIsSuccess(false)
        setMessage(data.message || "Failed to send reset link.")
      }
    } catch (error) {
      console.error(error)
      setIsSuccess(false)
      setMessage("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-slate-900 via-slate-700 to-slate-900 px-4 py-6">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-xl w-full max-w-md text-white space-y-6">
        <h2 className="text-3xl font-bold text-center">
          Forgot <span className="text-lime-300">Password</span>
        </h2>

        <p className="text-center text-white/80 text-sm">
          Enter your email and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-3 bg-white/20 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-300 placeholder-white/80"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />

          <button
            type="submit"
            className={`w-full py-3 font-semibold rounded-md transition-all ${
              isLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-lime-400 hover:bg-lime-300"
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <div
            className={`p-4 rounded-md text-sm ${
              isSuccess
                ? "bg-green-500/20 border border-green-500/30 text-green-300"
                : "bg-red-500/20 border border-red-500/30 text-red-300"
            }`}
          >
            {message}
          </div>
        )}

        <div className="text-center space-y-2">
          <button
            onClick={() => navigate("/login")}
            className="text-sm text-lime-300 hover:underline transition"
          >
            Back to Login
          </button>
          <p className="text-sm text-white/80">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-lime-300 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
