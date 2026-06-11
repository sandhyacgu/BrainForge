import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../services/api";

const GAMES = [
  { id: 1, name: "Reflex Rush", description: "Test your reaction time", skill: "Reaction Speed", icon: "⚡", color: "from-yellow-500 to-orange-500" },
  { id: 2, name: "Memory Sequence", description: "Remember the pattern", skill: "Working Memory", icon: "🧠", color: "from-purple-500 to-pink-500" },
  { id: 3, name: "Pattern Recall", description: "Visual memory challenge", skill: "Visual Memory", icon: "🎯", color: "from-blue-500 to-cyan-500" },
  { id: 4, name: "Focus Grid", description: "Stay focused under pressure", skill: "Sustained Attention", icon: "🔲", color: "from-green-500 to-teal-500" },
  { id: 5, name: "Color Trap", description: "Don't get tricked!", skill: "Cognitive Flexibility", icon: "🎨", color: "from-red-500 to-pink-500" },
  { id: 6, name: "Spot Difference", description: "Find what changed", skill: "Observation", icon: "🔍", color: "from-indigo-500 to-purple-500" },
  { id: 7, name: "Typing Focus", description: "Speed and accuracy", skill: "Attention + Speed", icon: "⌨️", color: "from-teal-500 to-green-500" },
  { id: 8, name: "Speed Math", description: "Calculate at lightning speed", skill: "Mental Processing", icon: "🔢", color: "from-orange-500 to-red-500" },
  { id: 9, name: "Daily Challenge", description: "Today's special challenge", skill: "Retention", icon: "📅", color: "from-cyan-500 to-blue-500" },
  { id: 10, name: "Cognitive Boss Mode", description: "Ultimate brain challenge", skill: "All Skills", icon: "👑", color: "from-yellow-400 to-yellow-600" },
];

const gameRoutes = {
  1: "/games/reflex-rush",
  2: "/games/memory-sequence",
  3: "/games/pattern-recall",
  4: "/games/focus-grid",
  5: "/games/color-trap",
  6: "/games/spot-difference",
  7: "/games/typing-focus",
  8: "/games/speed-math",
  9: "/games/daily-challenge",
  10: "/games/boss-mode",
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get("/api/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to fetch stats", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading BrainForge...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-bold text-white">BrainForge</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400">Hey, <span className="text-white font-semibold">{stats?.username || user?.username}</span>!</span>
          <button
            onClick={() => navigate("/analytics")}
            className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm transition"
          >
            📊 Analytics
          </button>
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm transition">
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Sessions" value={stats?.totalSessions ?? 0} icon="🎮" />
          <StatCard label="Total Score" value={stats?.totalScore ?? 0} icon="⭐" />
          <StatCard label="Avg Score" value={stats?.averageScore ?? 0} icon="📊" />
          <StatCard label="Current Streak" value={`${stats?.currentStreak ?? 0} days`} icon="🔥" />
        </div>

        <h2 className="text-2xl font-bold mb-6">🎯 Choose Your Training</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
          {GAMES.map((game) => (
            <GameCard key={game.id} game={game} onPlay={() => navigate(gameRoutes[game.id])} />
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-4">📈 Recent Activity</h2>
        {stats?.recentActivity?.length === 0 ? (
          <div className="bg-gray-900 rounded-xl p-8 text-center text-gray-400">
            <p className="text-4xl mb-3">🎮</p>
            <p className="text-lg">No games played yet!</p>
            <p className="text-sm mt-1">Pick a game above and start training your brain.</p>
          </div>
        ) : (
          <div className="bg-gray-900 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Game</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Score</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Accuracy</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Played At</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((activity, idx) => (
                  <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4">{activity.gameName}</td>
                    <td className="px-6 py-4 text-yellow-400 font-semibold">{activity.score}</td>
                    <td className="px-6 py-4 text-green-400">{activity.accuracy}%</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(activity.playedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2">
      <span className="text-2xl">{icon}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
  );
}

function GameCard({ game, onPlay }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition cursor-pointer group">
      <div className={`bg-gradient-to-r ${game.color} p-6 flex items-center justify-center`}>
        <span className="text-4xl">{game.icon}</span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-white mb-1">{game.name}</h3>
        <p className="text-gray-400 text-sm mb-3">{game.description}</p>
        <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-full">{game.skill}</span>
        <button
          onClick={onPlay}
          className="w-full mt-3 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-sm transition group-hover:bg-indigo-500">
          Play Now
        </button>
      </div>
    </div>
  );
}