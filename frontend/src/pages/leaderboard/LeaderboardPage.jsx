import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const RANK_STYLES = {
  1: { bg: "bg-yellow-500", text: "text-yellow-400", icon: "🥇" },
  2: { bg: "bg-gray-400", text: "text-gray-300", icon: "🥈" },
  3: { bg: "bg-orange-500", text: "text-orange-400", icon: "🥉" },
};

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/api/leaderboard");
      setLeaderboard(res.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading Leaderboard...</div>
      </div>
    );
  }

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

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">🏆 Leaderboard</h1>
        <p className="text-gray-400 mb-8">Top brain trainers on BrainForge</p>

        {/* Your Rank Card */}
        {leaderboard?.currentUserRank > 0 && (
          <div className="bg-indigo-900/40 border border-indigo-700 rounded-2xl p-5 mb-8 flex justify-between items-center">
            <div>
              <p className="text-gray-400 text-sm">Your Rank</p>
              <p className="text-3xl font-bold text-indigo-400">#{leaderboard.currentUserRank}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Your Score</p>
              <p className="text-3xl font-bold text-yellow-400">{leaderboard.currentUserScore}</p>
            </div>
            <div className="text-4xl">🧠</div>
          </div>
        )}

        {/* No data */}
        {leaderboard?.entries?.length === 0 && (
          <div className="bg-gray-900 rounded-2xl p-12 text-center">
            <p className="text-5xl mb-4">🏆</p>
            <p className="text-xl text-gray-300 mb-2">No rankings yet!</p>
            <p className="text-gray-500 mb-6">Be the first to play and claim the top spot!</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition"
            >
              Start Playing!
            </button>
          </div>
        )}

        {/* Leaderboard Table */}
        {leaderboard?.entries?.length > 0 && (
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            {/* Top 3 */}
            <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-800">
              {leaderboard.entries.slice(0, 3).map((entry) => (
                <div key={entry.rank} className="text-center">
                  <p className="text-4xl mb-2">{RANK_STYLES[entry.rank]?.icon}</p>
                  <p className="font-bold text-white">{entry.username}</p>
                  <p className={`text-xl font-bold ${RANK_STYLES[entry.rank]?.text}`}>
                    {entry.totalScore}
                  </p>
                  <p className="text-gray-500 text-xs">{entry.totalSessions} sessions</p>
                </div>
              ))}
            </div>

            {/* Full Table */}
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Rank</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Player</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Total Score</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Sessions</th>
                  <th className="text-left px-6 py-3 text-gray-400 text-sm">Avg Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.entries.map((entry) => (
                  <tr key={entry.rank} className="border-t border-gray-800 hover:bg-gray-800 transition">
                    <td className="px-6 py-4">
                      <span className={`font-bold ${RANK_STYLES[entry.rank]?.text || "text-gray-400"}`}>
                        #{entry.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{entry.username}</td>
                    <td className="px-6 py-4 text-yellow-400 font-bold">{entry.totalScore}</td>
                    <td className="px-6 py-4 text-gray-400">{entry.totalSessions}</td>
                    <td className="px-6 py-4 text-green-400">{entry.avgScore}</td>
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