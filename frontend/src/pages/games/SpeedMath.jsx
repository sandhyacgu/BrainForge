import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const GAME_DURATION = 60;

function generateQuestion(level) {
  const ops = level < 3 ? ["+", "-"] : level < 6 ? ["+", "-", "*"] : ["+", "-", "*", "/"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a, b, answer;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * (10 * level)) + 1;
      b = Math.floor(Math.random() * (10 * level)) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * (10 * level)) + 10;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case "*":
      a = Math.floor(Math.random() * 12) + 1;
      b = Math.floor(Math.random() * 12) + 1;
      answer = a * b;
      break;
    case "/":
      b = Math.floor(Math.random() * 11) + 2;
      answer = Math.floor(Math.random() * 10) + 1;
      a = b * answer;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }
  return { question: `${a} ${op} ${b}`, answer, op };
}

function generateChoices(correct) {
  const choices = new Set([correct]);
  while (choices.size < 4) {
    const offset = Math.floor(Math.random() * 10) - 5;
    const wrong = correct + offset;
    if (wrong !== correct && wrong >= 0) choices.add(wrong);
  }
  return [...choices].sort(() => Math.random() - 0.5);
}

export default function SpeedMath() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [question, setQuestion] = useState(null);
  const [choices, setChoices] = useState([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const timerRef = useRef(null);
  const correctRef = useRef(0);

  const nextQuestion = useCallback((lvl) => {
    const q = generateQuestion(lvl);
    setQuestion(q);
    setChoices(generateChoices(q.answer));
    setFeedback(null);
    setSelectedChoice(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setLevel(1);
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    correctRef.current = 0;
    setGameState("playing");
    nextQuestion(1);

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
  };

  const handleChoice = (choice) => {
    if (feedback) return;
    setSelectedChoice(choice);

    const isCorrect = choice === question.answer;
    const points = isCorrect ? level * 20 : 0;

    if (isCorrect) {
      setScore(s => s + points);
      setCorrect(c => c + 1);
      correctRef.current += 1;
      setFeedback("correct");

      // Level up every 5 correct
      if (correctRef.current % 5 === 0) {
        setLevel(l => Math.min(l + 1, 8));
      }
    } else {
      setWrong(w => w + 1);
      setFeedback("wrong");
    }

    setTimeout(() => nextQuestion(level), 600);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const getTimerColor = () => {
    if (timeLeft > 30) return "text-green-400";
    if (timeLeft > 10) return "text-yellow-400";
    return "text-red-400 animate-pulse";
  };

  const getChoiceStyle = (choice) => {
    if (!feedback || selectedChoice !== choice) {
      return "bg-gray-800 hover:bg-gray-700 text-white";
    }
    if (choice === question.answer) return "bg-green-600 text-white";
    if (choice === selectedChoice) return "bg-red-600 text-white";
    return "bg-gray-800 text-white";
  };

  // FINISHED
  if (gameState === "finished") {
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">🔢 Speed Math — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-6">🧮</p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Correct</p>
              <p className="text-3xl font-bold text-green-400">{correct}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Wrong</p>
              <p className="text-3xl font-bold text-red-400">{wrong}</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Accuracy</p>
              <p className="text-3xl font-bold text-yellow-400">{accuracy}%</p>
            </div>
            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Max Level</p>
              <p className="text-3xl font-bold text-blue-400">{level}</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-8">Score: {score}</p>
          <div className="flex gap-3">
            <button onClick={startGame} className="flex-1 bg-orange-600 hover:bg-orange-700 py-3 rounded-xl transition">
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
        <span className="text-3xl">🔢</span>
        <h1 className="text-3xl font-bold">Speed Math</h1>
      </div>

      {gameState === "waiting" && (
        <div className="text-center max-w-md">
          <p className="text-gray-300 mb-2 text-lg">Solve math problems as fast as you can!</p>
          <p className="text-gray-400 mb-2">Questions get harder as you level up.</p>
          <p className="text-gray-400 mb-6">Every 5 correct answers = Level Up! 🚀</p>
          <button onClick={startGame} className="bg-orange-600 hover:bg-orange-700 px-8 py-4 rounded-xl text-lg font-semibold transition">
            Start Game
          </button>
        </div>
      )}

      {gameState === "playing" && question && (
        <>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-gray-400 text-sm">Time</p>
              <p className={`text-2xl font-bold ${getTimerColor()}`}>{timeLeft}s</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Score</p>
              <p className="text-2xl font-bold text-green-400">{score}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Level</p>
              <p className="text-2xl font-bold text-orange-400">{level}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Correct</p>
              <p className="text-2xl font-bold text-blue-400">{correct}</p>
            </div>
          </div>

          {/* Question */}
          <div className={`bg-gray-900 rounded-2xl px-16 py-10 border-2 transition-all
            ${feedback === "correct" ? "border-green-500" : feedback === "wrong" ? "border-red-500" : "border-gray-700"}`}>
            <p className="text-6xl font-black tracking-wide text-white">{question.question} = ?</p>
          </div>

          {/* Choices */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {choices.map((choice, i) => (
              <button
                key={i}
                onClick={() => handleChoice(choice)}
                disabled={!!feedback}
                className={`py-6 rounded-xl text-3xl font-bold transition-all disabled:cursor-not-allowed ${getChoiceStyle(choice)}`}
              >
                {choice}
              </button>
            ))}
          </div>
        </>
      )}

      <button onClick={() => navigate("/dashboard")} className="text-gray-500 hover:text-gray-300 text-sm transition">
        ← Back to Dashboard
      </button>
    </div>
  );
}