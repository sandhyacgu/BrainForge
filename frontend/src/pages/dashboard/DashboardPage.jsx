import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-400">🧠 BrainForge</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">
            {user ? `Hello, ${user.username}` : 'Welcome!'}
          </span>
          <button
            onClick={handleLogout}
            className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-gray-400 mt-1">Track your cognitive progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Games Played', value: '0', color: 'purple' },
            { label: 'Best Score', value: '0', color: 'blue' },
            { label: 'Day Streak', value: '0', color: 'green' },
            { label: 'Achievements', value: '0', color: 'yellow' },
          ].map((stat) => (
            <div key={stat.label} className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Games Grid */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Choose a Game</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { name: 'Reflex Rush', emoji: '⚡', skill: 'Reaction' },
              { name: 'Memory Sequence', emoji: '🎯', skill: 'Memory' },
              { name: 'Pattern Recall', emoji: '🔲', skill: 'Visual Memory' },
              { name: 'Focus Grid', emoji: '🔢', skill: 'Attention' },
              { name: 'Color Trap', emoji: '🎨', skill: 'Flexibility' },
              { name: 'Spot Difference', emoji: '👁️', skill: 'Observation' },
              { name: 'Typing Focus', emoji: '⌨️', skill: 'Speed' },
              { name: 'Speed Math', emoji: '🔢', skill: 'Processing' },
              { name: 'Daily Challenge', emoji: '📅', skill: 'Mixed' },
              { name: 'Boss Mode', emoji: '👑', skill: 'All Skills' },
            ].map((game) => (
              <div
                key={game.name}
                className="bg-gray-900 border border-gray-800 hover:border-purple-500 rounded-xl p-5 cursor-pointer transition-all hover:scale-105"
              >
                <div className="text-3xl mb-2">{game.emoji}</div>
                <p className="font-semibold text-sm">{game.name}</p>
                <p className="text-gray-500 text-xs mt-1">{game.skill}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default DashboardPage