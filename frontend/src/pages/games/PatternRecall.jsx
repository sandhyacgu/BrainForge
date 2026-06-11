import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 4; // 4x4 grid
const LEVELS = [
  { level: 1, cells: 3, showTime: 2000 },
  { level: 2, cells: 4, showTime: 2000 },
  { level: 3, cells: 5, showTime: 1800 },
  { level: 4, cells: 6, showTime: 1800 },
  { level: 5, cells: 7, showTime: 1500 },
  { level: 6, cells: 8, showTime: 1500 },
  { level: 7, cells: 9, showTime: 1200 },
  { level: 8, cells: 10, showTime: 1200 },
];

export default function PatternRecall() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [level, setLevel] = useState(0);
  const [pattern, setPattern] = useState([]);
  const [selected, setSelected] = useState([]);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");
  const [showPattern, setShowPattern] = useState(false);

  const startLevel = useCallback((lvlIndex) => {
    const lvl = LEVELS[lvlIndex];
    const totalCells = GRID_SIZE * GRID_SIZE;
    const newPattern = [];

    while (newPattern.length < lvl.cells) {
      const rand = Math.floor(Math.random() * totalCells);
      if (!newPattern.includes(rand)) newPattern.push(rand);
    }

    setPattern(newPattern);
    setSelected([]);
    setShowPattern(true);
    setGameState("showing");
    setMessage("Memorize the pattern!");

    setTimeout(() => {
      setShowPattern(false);
      setGameState("input");
      setMessage(`Select ${lvl.cells} cells you remember!`);
    }, lvl.showTime);
  }, []);

  const handleCellClick = (index) => {
    if (gameState !== "input") return;
    const lvl = LEVELS[level];

    if (selected.includes(index)) {
      setSelected(selected.filter(s => s !== index));
      return;
    }

    if (selected.length >= lvl.cells) return;

    const newSelected = [...selected, index];
    setSelected(newSelected);

    if (newSelected.length === lvl.cells) {
      checkAnswer(newSelected);
    }
  };

  const checkAnswer = (sel) => {
    const correct = sel.filter(s => pattern.includes(s)).length;
    const total = pattern.length;
    const points = Math.round((correct / total) * 100 * (level + 1));
    setScore(s => s + points);

    if (correct === total) {
      setMessage(`Perfect! +${points} points 🎉`);
    } else {
      setMessage(`${correct}/${total} correct! +${points} points`);
    }

    setGameState("result");
    setShowPattern(true);

    if (level >= LEVELS.length - 1) {
      setTimeout(() => setGameState("finished"), 2000);
    } else {
      setTimeout(() => {
        setLevel(l => l + 1);
        startLevel(level + 1);
      }, 2000);
    }
  };

  const getCellStyle = (index) => {
    if (showPattern && pattern.includes(index)) return "bg-blue-500 scale-95";
    if (!showPattern && selected.includes(index)) return "bg-indigo-500 scale-95";
    if (gameState === "result" && pattern.includes(index)) return "bg-blue-500";
    if (gameState === "result" && selected.includes(index) && !pattern.includes(index)) return "bg-red-500";
    return "bg-gray-700 hover:bg-gray-600";
  };

  // FINISHED
  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🎯 Pattern Recall — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">🏆</p>
          <p className="text-gray-400 mb-2">Final Score</p>
          <p className="text-5xl font-bold text-blue-400 mb-8">{score}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setLevel(0); setScore(0); setPattern([]); setSelected([]); setGameState("waiting"); setShowPattern(false); }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl transition"
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
        <span className="text-3xl">🎯</span>
        <h1 className="text-3xl font-bold">Pattern Recall</h1>
      </div>

      <div className="flex gap-8 text-center">
        <div>
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-2xl font-bold text-blue-400">{level + 1}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Cells</p>
          <p className="text-2xl font-bold text-yellow-400">{LEVELS[level]?.cells}</p>
        </div>
      </div>

      <p className="text-gray-300 text-lg min-h-7">{message}</p>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
          <button
            key={i}
            onClick={() => handleCellClick(i)}
            className={`w-16 h-16 rounded-xl transition-all duration-200 ${getCellStyle(i)}`}
          />
        ))}
      </div>

      {gameState === "waiting" && (
        <button
          onClick={() => startLevel(0)}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
        >
          Start Game
        </button>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="text-gray-500 hover:text-gray-300 text-sm transition"
      >
        ← Back to Dashboard
      </button>
    </div>
  );
}