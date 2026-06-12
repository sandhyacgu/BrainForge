import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveGameSession } from "../../services/sessionService";

const DAILY_CHALLENGES = [
  {
    type: "memory",
    title: "Number Memory",
    description: "Memorize this number sequence",
    data: "7 3 9 1 5 8 2",
    question: "Type the sequence you saw",
    answer: "7391582",
    hint: "7 numbers — focus hard!",
  },
  {
    type: "logic",
    title: "Logic Puzzle",
    description: "Solve the pattern",
    data: "2, 4, 8, 16, ?",
    question: "What comes next?",
    answer: "32",
    hint: "Each number doubles",
  },
  {
    type: "word",
    title: "Word Unscramble",
    description: "Unscramble this word",
    data: "NRBIA",
    question: "What is the word?",
    answer: "BRAIN",
    hint: "It's inside your skull!",
  },
  {
    type: "math",
    title: "Math Chain",
    description: "Follow the chain",
    data: "Start: 5 → ×3 → +7 → ÷2 → -1 = ?",
    question: "What is the answer?",
    answer: "9",
    hint: "Follow each step carefully",
  },
  {
    type: "memory",
    title: "Color Sequence",
    description: "Remember the order",
    data: "🔴 🔵 🟡 🟢 🟣 🔴 🔵",
    question: "How many RED circles?",
    answer: "2",
    hint: "Count only the red ones",
  },
  {
    type: "logic",
    title: "Number Pattern",
    description: "Find the missing number",
    data: "1, 1, 2, 3, 5, 8, ?",
    question: "What comes next?",
    answer: "13",
    hint: "Fibonacci sequence!",
  },
  {
    type: "word",
    title: "Reverse Word",
    description: "Read this backwards",
    data: "EGROF NIARB",
    question: "What does it say?",
    answer: "BRAIN FORGE",
    hint: "Just reverse each word!",
  },
];

function getTodaysChallenge() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

export default function DailyChallenge() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [challenge] = useState(getTodaysChallenge());
  const [input, setInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);

   useEffect(() => {
    if (!timerActive) return;
    if (timeLeft <= 0) {
      setResult("timeout");
      setGameState("finished");
      saveGameSession({
        gameSlug: "daily-challenge",
        score: 0,
        durationMs: 60000,
        accuracy: 0,
        metadata: { challengeType: challenge.type, timeout: true },
      });
      return;
    }
    const t = setTimeout(() => setTimeLeft(tl => tl - 1), 1000);
    return () => clearTimeout(t);
  }, [timerActive, timeLeft]);

  const startChallenge = () => {
    setGameState("playing");
    setTimerActive(true);
  };
   const handleSubmit = () => {
    const userAnswer = input.trim().toUpperCase();
    const correctAnswer = challenge.answer.toUpperCase();
    const isCorrect = userAnswer === correctAnswer;

    setTimerActive(false);
    setResult(isCorrect ? "correct" : "wrong");
    setGameState("finished");

    const score = isCorrect ? (500 + timeLeft * 5 - (showHint ? 100 : 0)) : 0;
    saveGameSession({
      gameSlug: "daily-challenge",
      score,
      durationMs: (60 - timeLeft) * 1000,
      accuracy: isCorrect ? 100 : 0,
      metadata: { challengeType: challenge.type, usedHint: showHint },
    });
  };

  const getScore = () => {
    if (result !== "correct") return 0;
    const baseScore = 500;
    const timeBonus = timeLeft * 5;
    const hintPenalty = showHint ? 100 : 0;
    return baseScore + timeBonus - hintPenalty;
  };

  const getTypeColor = () => {
    switch (challenge.type) {
      case "memory": return "text-purple-400 bg-purple-900/30";
      case "logic": return "text-blue-400 bg-blue-900/30";
      case "word": return "text-green-400 bg-green-900/30";
      case "math": return "text-orange-400 bg-orange-900/30";
      default: return "text-gray-400";
    }
  };

  // FINISHED
  if (gameState === "finished") {
    const score = getScore();
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">📅 Daily Challenge — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          {result === "correct" && <p className="text-6xl mb-4">🏆</p>}
          {result === "wrong" && <p className="text-6xl mb-4">😔</p>}
          {result === "timeout" && <p className="text-6xl mb-4">⏰</p>}

          <p className={`text-2xl font-bold mb-2 ${result === "correct" ? "text-green-400" : "text-red-400"}`}>
            {result === "correct" ? "Correct! Amazing!" : result === "timeout" ? "Time's up!" : "Not quite!"}
          </p>

          <p className="text-gray-400 mb-1">Correct Answer:</p>
          <p className="text-xl font-bold text-white mb-6">{challenge.answer}</p>

          {result === "correct" && (
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-sm">Base: 500 + Time bonus: {timeLeft * 5}{showHint ? " - Hint: 100" : ""}</p>
              <p className="text-3xl font-bold text-green-400 mt-1">Score: {score}</p>
            </div>
          )}

          <p className="text-gray-500 text-sm mb-6">Come back tomorrow for a new challenge!</p>

          <button onClick={() => navigate("/dashboard")} className="w-full bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl transition">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">📅</span>
        <h1 className="text-3xl font-bold">Daily Challenge</h1>
      </div>

      <p className="text-gray-400">Today's challenge — {new Date().toLocaleDateString()}</p>

      {gameState === "waiting" && (
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-4 ${getTypeColor()}`}>
            {challenge.type.toUpperCase()}
          </span>
          <h2 className="text-2xl font-bold mb-2">{challenge.title}</h2>
          <p className="text-gray-400 mb-6">{challenge.description}</p>
          <button onClick={startChallenge} className="bg-cyan-600 hover:bg-cyan-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Start Challenge
          </button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-lg">
          {/* Timer */}
          <div className="flex justify-between items-center mb-6">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor()}`}>
              {challenge.type.toUpperCase()}
            </span>
            <span className={`text-2xl font-bold ${timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
              ⏱ {timeLeft}s
            </span>
          </div>

          <h2 className="text-2xl font-bold mb-4">{challenge.title}</h2>

          {/* Data Display */}
          <div className="bg-gray-800 rounded-xl p-6 mb-6 text-center">
            <p className="text-3xl font-bold text-white tracking-wider">{challenge.data}</p>
          </div>

          <p className="text-gray-300 mb-4">{challenge.question}</p>

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Your answer..."
            className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-cyan-500 mb-4"
          />

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700 py-3 rounded-xl font-semibold transition"
            >
              Submit Answer
            </button>
            {!showHint && (
              <button
                onClick={() => setShowHint(true)}
                className="bg-gray-700 hover:bg-gray-600 px-4 py-3 rounded-xl transition text-sm"
              >
                💡 Hint (-100pts)
              </button>
            )}
          </div>

          {showHint && (
            <div className="mt-4 bg-yellow-900/30 border border-yellow-600 rounded-xl p-3 text-yellow-400 text-sm">
              💡 {challenge.hint}
            </div>
          )}
        </div>
      )}

      <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back to Dashboard
      </button>
    </div>
  );
}