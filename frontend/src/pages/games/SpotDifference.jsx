import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 5;
const ROUNDS = 5;
const TIME_PER_ROUND = 30;

function generateGrids() {
  const base = Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
    Math.floor(Math.random() * 6)
  );
  const changed = [...base];
  const differences = [];
  const numDiffs = Math.floor(Math.random() * 3) + 2; // 2-4 differences

  while (differences.length < numDiffs) {
    const idx = Math.floor(Math.random() * base.length);
    if (!differences.includes(idx)) {
      let newVal;
      do { newVal = Math.floor(Math.random() * 6); } while (newVal === base[idx]);
      changed[idx] = newVal;
      differences.push(idx);
    }
  }
  return { base, changed, differences };
}

const EMOJIS = ["🔴", "🔵", "🟢", "🟡", "🟣", "🟠"];

export default function SpotDifference() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ROUND);
  const [grids, setGrids] = useState(null);
  const [found, setFound] = useState([]);
  const [wrongClicks, setWrongClicks] = useState([]);
  const [message, setMessage] = useState("");
  const timerRef = useRef(null);

  const startRound = (r) => {
    const newGrids = generateGrids();
    setGrids(newGrids);
    setFound([]);
    setWrongClicks([]);
    setTimeLeft(TIME_PER_ROUND);
    setMessage(`Find all ${newGrids.differences.length} differences!`);
    setGameState("playing");

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (r >= ROUNDS) {
            setGameState("finished");
          } else {
            setMessage("Time's up! Next round...");
            setGameState("between");
            setTimeout(() => {
              setRound(prev => prev + 1);
              startRound(r + 1);
            }, 1500);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleCellClick = (idx, isChanged) => {
    if (gameState !== "playing") return;

    if (grids.differences.includes(idx)) {
      if (found.includes(idx)) return;
      const newFound = [...found, idx];
      setFound(newFound);
      setMessage(`✅ Found ${newFound.length}/${grids.differences.length}!`);

      if (newFound.length === grids.differences.length) {
        clearInterval(timerRef.current);
        const points = timeLeft * 10 + 50;
        setScore(s => s + points);
        setMessage(`🎉 All found! +${points} points!`);

        if (round >= ROUNDS) {
          setTimeout(() => setGameState("finished"), 1500);
        } else {
          setGameState("between");
          setTimeout(() => {
            setRound(r => r + 1);
            startRound(round + 1);
          }, 1500);
        }
      }
    } else {
      setWrongClicks(w => [...w, idx]);
      setTimeout(() => setWrongClicks(w => w.filter(i => i !== idx)), 500);
      setScore(s => Math.max(0, s - 5));
    }
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const getCellStyle = (idx, isRight) => {
    const isFound = found.includes(idx);
    const isDiff = grids?.differences.includes(idx);
    const isWrong = wrongClicks.includes(idx);

    if (isWrong) return "scale-90 opacity-50 border-red-500 border-2";
    if (isRight && isFound) return "border-green-500 border-2 scale-95";
    return "border-gray-700 border";
  };

  // FINISHED
  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🔍 Spot Difference — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">🏆</p>
          <p className="text-gray-400 mb-2">Final Score</p>
          <p className="text-5xl font-bold text-indigo-400 mb-8">{score}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setRound(1); setScore(0); setFound([]); setGameState("waiting"); }}
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

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">🔍</span>
        <h1 className="text-3xl font-bold">Spot Difference</h1>
      </div>

      {gameState === "waiting" && (
        <div className="text-center">
          <p className="text-gray-400 mb-2">Two grids will appear side by side.</p>
          <p className="text-gray-400 mb-6">Click the cells in the <strong className="text-indigo-400">RIGHT grid</strong> that are different!</p>
          <button
            onClick={() => startRound(1)}
            className="bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Start Game
          </button>
        </div>
      )}

      {(gameState === "playing" || gameState === "between") && grids && (
        <>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-gray-400 text-sm">Round</p>
              <p className="text-2xl font-bold">{round}/{ROUNDS}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-indigo-400">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-400" : "text-green-400"}`}>{timeLeft}s</p>
            </div>
          </div>

          <p className="text-gray-300">{message}</p>

          <div className="flex gap-6">
            {/* Left Grid - Original */}
            <div>
              <p className="text-center text-gray-400 text-sm mb-2">Original</p>
              <div className="grid grid-cols-5 gap-1">
                {grids.base.map((val, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xl border border-gray-700"
                  >
                    {EMOJIS[val]}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Grid - Changed */}
            <div>
              <p className="text-center text-gray-400 text-sm mb-2">Find differences →</p>
              <div className="grid grid-cols-5 gap-1">
                {grids.changed.map((val, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx, true)}
                    className={`w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-xl transition-all
                      ${getCellStyle(idx, true)}`}
                  >
                    {EMOJIS[val]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-gray-500 text-sm">-5 points for wrong clicks!</p>
        </>
      )}

      <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back to Dashboard
      </button>
    </div>
  );
}