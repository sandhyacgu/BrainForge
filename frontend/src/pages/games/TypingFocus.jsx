import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const WORDS = [
  "focus", "brain", "speed", "train", "sharp", "quick", "alert", "smart",
  "think", "react", "adapt", "learn", "grow", "skill", "power", "mind",
  "logic", "memory", "pattern", "reflex", "vision", "recall", "sequence",
  "attention", "cognitive", "challenge", "precision", "accuracy", "response"
];

const GAME_DURATION = 60;

export default function TypingFocus() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [currentWord, setCurrentWord] = useState("");
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [wordsTyped, setWordsTyped] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [wordStatus, setWordStatus] = useState(null); // correct, wrong
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  const getRandomWord = useCallback(() => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
  }, []);

  const startGame = () => {
    setScore(0);
    setWordsTyped(0);
    setMistakes(0);
    setTimeLeft(GAME_DURATION);
    setInput("");
    setWordStatus(null);
    setCurrentWord(getRandomWord());
    setGameState("playing");

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setGameState("finished");
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.endsWith(" ") || value === currentWord) {
      const typed = value.trim();
      if (typed === currentWord) {
        const points = Math.max(10, currentWord.length * 10);
        setScore(s => s + points);
        setWordsTyped(w => w + 1);
        setWordStatus("correct");
      } else {
        setMistakes(m => m + 1);
        setWordStatus("wrong");
      }
      setInput("");
      setTimeout(() => {
        setWordStatus(null);
        setCurrentWord(getRandomWord());
        inputRef.current?.focus();
      }, 300);
    }
  };

  const getInputColor = () => {
    if (wordStatus === "correct") return "border-green-500 bg-green-900/20";
    if (wordStatus === "wrong") return "border-red-500 bg-red-900/20";
    if (input.length > 0) {
      return currentWord.startsWith(input)
        ? "border-blue-500"
        : "border-red-400";
    }
    return "border-gray-600";
  };

  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-400";
    if (timeLeft > 10) return "text-yellow-400";
    return "text-red-400 animate-pulse";
  };

  const getWPM = () => {
    const minutesElapsed = (GAME_DURATION - timeLeft) / 60;
    if (minutesElapsed === 0) return 0;
    return Math.round(wordsTyped / minutesElapsed);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // FINISHED
  if (gameState === "finished") {
    const wpm = Math.round(wordsTyped / (GAME_DURATION / 60));
    const accuracy = wordsTyped + mistakes > 0
      ? Math.round((wordsTyped / (wordsTyped + mistakes)) * 100)
      : 0;
    const finalScore = score;

    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">⌨️ Typing Focus — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-6">⌨️</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Words Typed</p>
              <p className="text-3xl font-bold text-green-400">{wordsTyped}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">WPM</p>
              <p className="text-3xl font-bold text-blue-400">{wpm}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-yellow-400">{accuracy}%</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Mistakes</p>
              <p className="text-3xl font-bold text-red-400">{mistakes}</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-8">Score: {finalScore}</p>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 bg-teal-600 hover:bg-teal-700 py-3 rounded-xl transition">
              Play Again
            </button>
            <button onClick={() => navigate("/dashboard")} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-xl transition">
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
        <span className="text-3xl">⌨️</span>
        <h1 className="text-3xl font-bold">Typing Focus</h1>
      </div>

      {gameState === "waiting" && (
        <div className="text-center max-w-md">
          <p className="text-gray-300 mb-2 text-lg">Type the word shown as fast as possible!</p>
          <p className="text-gray-400 mb-2">Press <strong>Space</strong> or finish typing to submit.</p>
          <p className="text-gray-400 mb-6">You have <strong>60 seconds</strong>. Score more by typing longer words!</p>
          <button onClick={startGame} className="bg-teal-600 hover:bg-teal-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Start Game
          </button>
        </div>
      )}

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
              <p className="text-gray-400 text-sm">Words</p>
              <p className="text-2xl font-bold text-blue-400">{wordsTyped}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">WPM</p>
              <p className="text-2xl font-bold text-yellow-400">{getWPM()}</p>
            </div>
          </div>

          {/* Word Display */}
          <div className={`bg-gray-900 rounded-2xl px-16 py-8 border-2 transition-all
            ${wordStatus === "correct" ? "border-green-500" : wordStatus === "wrong" ? "border-red-500" : "border-gray-700"}`}>
            <p className="text-5xl font-bold tracking-widest text-white">{currentWord}</p>
          </div>

          {/* Character hints */}
          <div className="flex gap-1">
            {currentWord.split("").map((char, i) => (
              <span
                key={i}
                className={`text-xl font-mono px-1 rounded ${
                  i < input.length
                    ? input[i] === char ? "text-green-400" : "text-red-400"
                    : "text-gray-600"
                }`}
              >
                {char}
              </span>
            ))}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            value={input}
            onChange={handleInput}
            disabled={!!wordStatus}
            placeholder="Type here..."
            className={`w-72 px-6 py-4 rounded-xl text-xl text-center bg-gray-900 border-2 outline-none transition-all text-white ${getInputColor()}`}
          />

          <p className="text-gray-500 text-sm">Press Space after each word</p>
        </>
      )}

      <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back to Dashboard
      </button>
    </div>
  );
}