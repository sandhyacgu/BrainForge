import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { saveGameSession } from "../../services/sessionService";

const ROUNDS = 5;

export default function ReflexRush() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting"); // waiting, ready, active, result, finished
  const [round, setRound] = useState(1);
  const [reactionTime, setReactionTime] = useState(null);
  const [results, setResults] = useState([]);
  const [showCircle, setShowCircle] = useState(false);
  const [tooEarly, setTooEarly] = useState(false);
  const startTimeRef = useRef(null);
  const timerRef = useRef(null);

  const startRound = () => {
    setTooEarly(false);
    setShowCircle(false);
    setGameState("ready");

    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    timerRef.current = setTimeout(() => {
      setShowCircle(true);
      setGameState("active");
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleClick = () => {
    if (gameState === "ready") {
      clearTimeout(timerRef.current);
      setTooEarly(true);
      setGameState("waiting");
      return;
    }

    if (gameState === "active") {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setShowCircle(false);
      setGameState("result");

      const newResults = [...results, time];
      setResults(newResults);

      if (round >= ROUNDS) {
        setTimeout(() => {
          setGameState("finished");
          const finalResults = [...results, time];
          const avg = Math.round(finalResults.reduce((a, b) => a + b, 0) / finalResults.length);
          const score = avg < 200 ? 1000 : avg < 300 ? 800 : avg < 400 ? 600 : avg < 500 ? 400 : 200;
          saveGameSession({
            gameSlug: "reflex-rush",
            score,
            durationMs: finalResults.reduce((a, b) => a + b, 0),
            accuracy: 100,
            metadata: { avgReactionTime: avg, results: finalResults },
          });
        }, 1000);
      }
    }
  };

  const nextRound = () => {
    setRound((r) => r + 1);
    setReactionTime(null);
    startRound();
  };

  const getScore = () => {
    if (results.length === 0) return 0;
    const avg = results.reduce((a, b) => a + b, 0) / results.length;
    if (avg < 200) return 1000;
    if (avg < 300) return 800;
    if (avg < 400) return 600;
    if (avg < 500) return 400;
    return 200;
  };

  const getGrade = (time) => {
    if (time < 200) return { label: "Superhuman! ⚡", color: "text-yellow-400" };
    if (time < 300) return { label: "Excellent! 🔥", color: "text-green-400" };
    if (time < 400) return { label: "Good! 👍", color: "text-blue-400" };
    if (time < 500) return { label: "Average 😐", color: "text-orange-400" };
    return { label: "Keep Training 💪", color: "text-red-400" };
  };

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  // FINISHED SCREEN
  if (gameState === "finished") {
    const avg = Math.round(results.reduce((a, b) => a + b, 0) / results.length);
    const score = getScore();
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">⚡ Reflex Rush — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-gray-400 mb-2">Average Reaction Time</p>
          <p className="text-5xl font-bold text-yellow-400 mb-1">{avg}ms</p>
          <p className={`text-xl mb-6 ${getGrade(avg).color}`}>{getGrade(avg).label}</p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            {results.map((r, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Round {i + 1}</p>
                <p className="text-white font-bold">{r}ms</p>
              </div>
            ))}
          </div>

          <p className="text-2xl font-bold text-green-400 mb-6">Score: {score}</p>

          <div className="flex gap-3">
            <button
              onClick={() => { setRound(1); setResults([]); setGameState("waiting"); setReactionTime(null); }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-3 rounded-xl transition"
            >
              Play Again
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN GAME SCREEN
  return (
    <div
      className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6"
      onClick={gameState === "active" || gameState === "ready" ? handleClick : undefined}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">⚡</span>
        <h1 className="text-3xl font-bold">Reflex Rush</h1>
      </div>

      <p className="text-gray-400">Round {round} of {ROUNDS}</p>

      {/* Progress */}
      <div className="flex gap-2">
        {Array.from({ length: ROUNDS }).map((_, i) => (
          <div
            key={i}
            className={`w-8 h-2 rounded-full ${i < results.length ? "bg-green-500" : "bg-gray-700"}`}
          />
        ))}
      </div>

      {/* Game Area */}
      <div className="relative w-80 h-80 bg-gray-900 rounded-2xl border border-gray-800 flex items-center justify-center">
        {gameState === "waiting" && (
          <div className="text-center">
            {tooEarly && <p className="text-red-400 mb-3 font-semibold">Too Early! 😅</p>}
            <button
              onClick={startRound}
              className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
            >
              {round === 1 ? "Start Game" : "Next Round"}
            </button>
          </div>
        )}

        {gameState === "ready" && (
          <p className="text-gray-400 text-lg animate-pulse">Wait for green circle...</p>
        )}

        {gameState === "active" && showCircle && (
          <div className="w-24 h-24 bg-green-500 rounded-full cursor-pointer animate-bounce shadow-lg shadow-green-500/50" />
        )}

        {gameState === "result" && reactionTime && (
          <div className="text-center">
            <p className="text-4xl font-bold text-yellow-400">{reactionTime}ms</p>
            <p className={`mt-2 ${getGrade(reactionTime).color}`}>{getGrade(reactionTime).label}</p>
            {round < ROUNDS && (
              <button
                onClick={nextRound}
                className="mt-4 bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-xl transition"
              >
                Next Round →
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="text-gray-500 hover:text-gray-300 text-sm transition"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}