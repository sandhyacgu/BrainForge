import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const COLORS = ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"];

const COLOR_STYLES = {
  Red: "text-red-500",
  Blue: "text-blue-500",
  Green: "text-green-500",
  Yellow: "text-yellow-500",
  Purple: "text-purple-500",
  Orange: "text-orange-500",
};

const TOTAL_ROUNDS = 15;

function generateQuestion() {
  const word = COLORS[Math.floor(Math.random() * COLORS.length)];
  let inkColor;
  do {
    inkColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  } while (inkColor === word && Math.random() > 0.4);
  return { word, inkColor, correct: word === inkColor };
}

export default function ColorTrap() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [question, setQuestion] = useState(null);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(3);
  const [feedback, setFeedback] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);
  const roundRef = useRef(1);
  const scoreRef = useRef(0);
  const resultsRef = useRef([]);
  const answeredRef = useRef(false);

  const showNextQuestion = useCallback(() => {
    if (roundRef.current > TOTAL_ROUNDS) {
      setGameState("finished");
      return;
    }

    answeredRef.current = false;
    const q = generateQuestion();
    setQuestion(q);
    setFeedback(null);
    setTimeLeft(3);

    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          if (!answeredRef.current) {
            answeredRef.current = true;
            const newResults = [...resultsRef.current, { correct: false }];
            resultsRef.current = newResults;
            setResults(newResults);
            roundRef.current += 1;
            setRound(roundRef.current);
            setTimeout(() => showNextQuestion(), 600);
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const handleAnswer = (answer) => {
    if (answeredRef.current || !question) return;
    answeredRef.current = true;
    clearInterval(timerRef.current);

    const isCorrect = answer === question.correct;
    const points = isCorrect ? timeLeft * 10 + 20 : 0;
    scoreRef.current += points;
    setScore(scoreRef.current);

    const newResults = [...resultsRef.current, { correct: isCorrect }];
    resultsRef.current = newResults;
    setResults(newResults);
    setFeedback(isCorrect ? "correct" : "wrong");

    roundRef.current += 1;
    setRound(roundRef.current);

    setTimeout(() => showNextQuestion(), 800);
  };

  const startGame = () => {
    roundRef.current = 1;
    scoreRef.current = 0;
    resultsRef.current = [];
    answeredRef.current = false;
    setScore(0);
    setRound(1);
    setResults([]);
    setFeedback(null);
    setGameState("playing");
    setTimeout(() => showNextQuestion(), 100);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // FINISHED
  if (gameState === "finished") {
    const correct = resultsRef.current.filter(r => r.correct).length;
    const accuracy = Math.round((correct / TOTAL_ROUNDS) * 100);
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🎨 Color Trap — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">🧠</p>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Correct</p>
              <p className="text-2xl font-bold text-green-400">{correct}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Accuracy</p>
              <p className="text-2xl font-bold text-blue-400">{accuracy}%</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-3">
              <p className="text-gray-400 text-xs">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{scoreRef.current}</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-8">Final Score: {scoreRef.current}</p>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 bg-red-600 hover:bg-red-700 py-3 rounded-xl transition">
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
        <span className="text-3xl">🎨</span>
        <h1 className="text-3xl font-bold">Color Trap</h1>
      </div>

      {gameState === "waiting" && (
        <div className="text-center max-w-md">
          <p className="text-gray-300 mb-2 text-lg">Does the <strong>word</strong> match its <strong>ink color</strong>?</p>
          <p className="text-gray-400 mb-2">Example: <span className="text-blue-500 font-bold">RED</span> → NO! (word is Red but ink is Blue)</p>
          <p className="text-gray-400 mb-6">Answer YES or NO before time runs out!</p>
          <button onClick={startGame} className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Start Game
          </button>
        </div>
      )}

      {gameState === "playing" && question && (
        <>
          <div className="flex gap-8 text-center">
            <div>
              <p className="text-gray-400 text-sm">Round</p>
              <p className="text-2xl font-bold">{Math.min(round, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-yellow-400">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className={`text-2xl font-bold ${timeLeft <= 1 ? "text-red-400" : "text-green-400"}`}>{timeLeft}s</p>
            </div>
          </div>

          <div className="flex gap-1">
            {Array.from({ length: TOTAL_ROUNDS }).map((_, i) => (
              <div key={i} className={`w-4 h-2 rounded-full ${
                i < results.length
                  ? results[i].correct ? "bg-green-500" : "bg-red-500"
                  : "bg-gray-700"
              }`} />
            ))}
          </div>

          <p className="text-gray-400">Does the word match the ink color?</p>

          <div className={`bg-gray-900 rounded-2xl p-10 flex items-center justify-center border-2 transition-all w-72 h-40
            ${feedback === "correct" ? "border-green-500" : feedback === "wrong" ? "border-red-500" : "border-gray-700"}`}>
            <span className={`text-6xl font-black ${COLOR_STYLES[question.inkColor]}`}>
              {question.word}
            </span>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => handleAnswer(true)}
              disabled={!!feedback}
              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 px-10 py-4 rounded-xl text-xl font-bold transition"
            >
              ✅ YES
            </button>
            <button
              onClick={() => handleAnswer(false)}
              disabled={!!feedback}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-10 py-4 rounded-xl text-xl font-bold transition"
            >
              ❌ NO
            </button>
          </div>
        </>
      )}

      <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back to Dashboard
      </button>
    </div>
  );
}