import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = [
  { id: 0, bg: "bg-red-500", active: "bg-red-300", label: "Red" },
  { id: 1, bg: "bg-blue-500", active: "bg-blue-300", label: "Blue" },
  { id: 2, bg: "bg-green-500", active: "bg-green-300", label: "Green" },
  { id: 3, bg: "bg-yellow-500", active: "bg-yellow-300", label: "Yellow" },
];

const MAX_LEVELS = 10;

export default function MemorySequence() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting"); // waiting, showing, input, result, finished
  const [sequence, setSequence] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [activeColor, setActiveColor] = useState(null);
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState("");

  const flashColor = useCallback(async (seq) => {
    setGameState("showing");
    await new Promise(r => setTimeout(r, 600));

    for (let i = 0; i < seq.length; i++) {
      setActiveColor(seq[i]);
      await new Promise(r => setTimeout(r, 600));
      setActiveColor(null);
      await new Promise(r => setTimeout(r, 300));
    }
    setGameState("input");
    setMessage("Your turn! Repeat the sequence.");
  }, []);

  const startLevel = useCallback((lvl, prevSeq) => {
    const newColor = Math.floor(Math.random() * 4);
    const newSeq = [...prevSeq, newColor];
    setSequence(newSeq);
    setUserInput([]);
    setMessage("Watch carefully...");
    setTimeout(() => flashColor(newSeq), 500);
  }, [flashColor]);

  const handleColorClick = (colorId) => {
    if (gameState !== "input") return;

    const newInput = [...userInput, colorId];
    setUserInput(newInput);

    // Flash the clicked color
    setActiveColor(colorId);
    setTimeout(() => setActiveColor(null), 300);

    const currentIndex = newInput.length - 1;

    // Wrong input
    if (newInput[currentIndex] !== sequence[currentIndex]) {
      setMessage("Wrong! ❌ Game Over!");
      setGameState("finished");
      return;
    }

    // Completed sequence
    if (newInput.length === sequence.length) {
      const points = level * 100;
      setScore(s => s + points);
      setMessage(`Correct! +${points} points 🎉`);
      setGameState("result");

      if (level >= MAX_LEVELS) {
        setTimeout(() => setGameState("finished"), 1500);
      } else {
        setTimeout(() => {
          setLevel(l => l + 1);
          startLevel(level + 1, sequence);
        }, 1500);
      }
    }
  };

  // FINISHED SCREEN
  if (gameState === "finished") {
    const passed = level > MAX_LEVELS;
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🧠 Memory Sequence — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">{passed ? "🏆" : "💪"}</p>
          <p className="text-gray-400 mb-2">You reached</p>
          <p className="text-5xl font-bold text-purple-400 mb-1">Level {level}</p>
          <p className="text-gray-400 mb-6">out of {MAX_LEVELS}</p>
          <p className="text-3xl font-bold text-green-400 mb-8">Score: {score}</p>

          <div className="flex gap-3">
            <button
              onClick={() => { setLevel(1); setScore(0); setSequence([]); setUserInput([]); setGameState("waiting"); }}
              className="flex-1 bg-purple-600 hover:bg-purple-700 py-3 rounded-xl transition"
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
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">🧠</span>
        <h1 className="text-3xl font-bold">Memory Sequence</h1>
      </div>

      {/* Level + Score */}
      <div className="flex gap-8 text-center">
        <div>
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-2xl font-bold text-purple-400">{level}</p>
        </div>
        <div>
          <p className="text-gray-400 text-sm">Score</p>
          <p className="text-2xl font-bold text-green-400">{score}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1">
        {Array.from({ length: MAX_LEVELS }).map((_, i) => (
          <div
            key={i}
            className={`w-6 h-2 rounded-full ${i < level - 1 ? "bg-purple-500" : i === level - 1 ? "bg-purple-300" : "bg-gray-700"}`}
          />
        ))}
      </div>

      {/* Message */}
      <p className="text-gray-300 text-lg min-h-7">{message}</p>

      {/* Color Grid */}
      <div className="grid grid-cols-2 gap-4">
        {COLORS.map((color) => (
          <button
            key={color.id}
            onClick={() => handleColorClick(color.id)}
            disabled={gameState !== "input"}
            className={`w-36 h-36 rounded-2xl transition-all duration-150 
              ${activeColor === color.id ? color.active : color.bg}
              ${gameState === "input" ? "cursor-pointer hover:opacity-90 active:scale-95" : "cursor-not-allowed opacity-70"}
              shadow-lg`}
          />
        ))}
      </div>

      {/* Start Button */}
      {gameState === "waiting" && (
        <button
          onClick={() => startLevel(1, [])}
          className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
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