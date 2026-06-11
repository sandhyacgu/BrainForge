import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";
import api from "../../services/api";

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get("/api/analytics");
      setAnalytics(res.data);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Analytics...</div>
      </div>
    );
  }

  const hasData = analytics?.totalSessions > 0;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧠</span>
          <span className="text-xl font-bold">BrainForge</span>
        </div>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm transition"
        >
          ← Dashboard
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-8">📊 Your Analytics</h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Sessions" value={analytics?.totalSessions ?? 0} icon="🎮" color="text-blue-400" />
          <StatCard label="Total Score" value={analytics?.totalScore ?? 0} icon="⭐" color="text-yellow-400" />
          <StatCard label="Avg Score" value={analytics?.averageScore ?? 0} icon="📈" color="text-green-400" />
          <StatCard label="Best Game" value={analytics?.bestGame ?? "N/A"} icon="🏆" color="text-purple-400" />
        </div>

        {!hasData ? (
          <div className="bg-gray-900 rounded-2xl p-12 text-center">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-xl text-gray-300 mb-2">No data yet!</p>
            <p className="text-gray-500 mb-6">Play some games to see your analytics.</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition"
            >
              Go Play Games!
            </button>
          </div>
        ) : (
          <>
            {/* Score History Chart */}
            {analytics?.scoreHistory?.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">📈 Score History</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analytics.scoreHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#6366F1"
                      strokeWidth={2}
                      dot={{ fill: "#6366F1", r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Game Stats Chart */}
            {analytics?.gameStats?.length > 0 && (
              <div className="bg-gray-900 rounded-2xl p-6 mb-6">
                <h2 className="text-xl font-bold mb-6">🎯 Game Performance</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.gameStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="gameName" stroke="#9CA3AF" tick={{ fontSize: 11 }} />
                    <YAxis stroke="#9CA3AF" tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px" }}
                      labelStyle={{ color: "#F9FAFB" }}
                    />
                    <Legend />
                    <Bar dataKey="bestScore" fill="#6366F1" name="Best Score" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="avgScore" fill="#10B981" name="Avg Score" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Game Stats Table */}
            {analytics?.gameStats?.length > 0 && (
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-800">
                  <h2 className="text-xl font-bold">🏅 Game Breakdown</h2>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm">Game</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm">Played</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm">Best Score</th>
                      <th className="text-left px-6 py-3 text-gray-400 text-sm">Avg Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.gameStats.map((stat, idx) => (
                      <tr key={idx} className="border-t border-gray-800 hover:bg-gray-800 transition">
                        <td className="px-6 py-4 font-medium">{stat.gameName}</td>
                        <td className="px-6 py-4 text-gray-400">{stat.timesPlayed}x</td>
                        <td className="px-6 py-4 text-yellow-400 font-bold">{stat.bestScore}</td>
                        <td className="px-6 py-4 text-green-400">{stat.avgScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-col gap-2">
      <span className="text-2xl">{icon}</span>
      <span className={`text-2xl font-bold ${color}`}>{value}</span>
      <span className="text-gray-400 text-sm">{label}</span>
    </div>
  );
}
