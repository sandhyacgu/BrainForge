import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    // We will connect this to backend in Phase 7
    console.log('Login:', email, password)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-900 rounded-2xl p-8 shadow-2xl">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">🧠 BrainForge</h1>
          <p className="text-gray-400 mt-2">Train your mind. Track your growth.</p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="text-gray-300 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="text-gray-300 text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>

        {/* Links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-gray-400 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-purple-400 hover:text-purple-300">
              Sign up
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}

export default LoginPage  