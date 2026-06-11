import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const GRID_SIZE = 5;
const GAME_DURATION = 60;
const TARGET_LETTER = "X";

export default function FocusGrid() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [grid, setGrid] = useState([]);
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [flashCell, setFlashCell] = useState(null);
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const generateGrid = useCallback(() => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWYZ";
    const cells = Array.from({ length: GRID_SIZE * GRID_SIZE }, () => {
      return Math.random() < 0.2
        ? TARGET_LETTER
        : letters[Math.floor(Math.random() * letters.length)];
    });
    setGrid(cells);
  }, []);

  const startGame = () => {
    setScore(0);
    setMissed(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    generateGrid();

    intervalRef.current = setInterval(() => {
      generateGrid();
    }, 2000);

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          clearInterval(timerRef.current);
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  };

  const handleCellClick = (index, letter) => {
    if (gameState !== "playing") return;

    setFlashCell(index);
    setTimeout(() => setFlashCell(null), 200);

    if (letter === TARGET_LETTER) {
      setScore(s => s + 10);
    } else {
      setMissed(m => m + 1);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-400";
    if (timeLeft > 10) return "text-yellow-400";
    return "text-red-400";
  };

  // FINISHED
  if (gameState === "finished") {
    const finalScore = Math.max(0, score - missed * 5);
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🔲 Focus Grid — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">🎯</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Hits</p>
              <p className="text-2xl font-bold text-green-400">{score / 10}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Misses</p>
              <p className="text-2xl font-bold text-red-400">{missed}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{finalScore}</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-8">Final Score: {finalScore}</p>
          <div className="flex gap-3">
            <button
              onClick={startGame}
              className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl transition"
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
        <span className="text-3xl">🔲</span>
        <h1 className="text-3xl font-bold">Focus Grid</h1>
      </div>

      {gameState === "playing" && (
        <>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className={`text-2xl font-bold ${getTimerColor()}`}>{timeLeft}s</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-green-400">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Misses</p>
              <p className="text-2xl font-bold text-red-400">{missed}</p>
            </div>
          </div>

          <p className="text-yellow-400 font-semibold">
            Click all <span className="text-white bg-yellow-500 px-2 py-0.5 rounded">X</span> letters!
          </p>

          <div className="grid grid-cols-5 gap-2">
            {grid.map((letter, i) => (
              <button
                key={i}
                onClick={() => handleCellClick(i, letter)}
                className={`w-14 h-14 rounded-xl text-xl font-bold transition-all duration-100
                  ${flashCell === i
                    ? letter === TARGET_LETTER ? "bg-green-400 scale-90" : "bg-red-400 scale-90"
                    : letter === TARGET_LETTER
                      ? "bg-gray-700 hover:bg-yellow-500 text-yellow-400 hover:text-white"
                      : "bg-gray-700 hover:bg-gray-600 text-gray-300"
                  }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </>
      )}

      {gameState === "waiting" && (
        <div className="text-center">
          <p className="text-gray-400 mb-2">Click all <strong className="text-yellow-400">X</strong> letters as fast as possible!</p>
          <p className="text-gray-400 mb-6">Grid refreshes every 2 seconds. You have 60 seconds!</p>
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Start Game
          </button>
        </div>
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