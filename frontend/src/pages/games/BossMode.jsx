import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

const ROUNDS = [
  {
    id: 1,
    type: "reflex",
    title: "⚡ Reflex Round",
    instruction: "Click the GREEN circle as fast as possible!",
    duration: 10,
  },
  {
    id: 2,
    type: "memory",
    title: "🧠 Memory Round",
    instruction: "Memorize these numbers!",
    duration: 15,
  },
  {
    id: 3,
    type: "math",
    title: "🔢 Math Round",
    instruction: "Solve 3 math problems!",
    duration: 20,
  },
  {
    id: 4,
    type: "word",
    title: "⌨️ Word Round",
    instruction: "Type all words correctly!",
    duration: 20,
  },
];

const MATH_QUESTIONS = [
  { q: "12 + 15 = ?", a: "27" },
  { q: "8 × 7 = ?", a: "56" },
  { q: "144 ÷ 12 = ?", a: "12" },
];

const WORDS = ["neural", "focus", "brain", "forge"];

export default function BossMode() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState("waiting");
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef(null);

  // Reflex state
  const [showCircle, setShowCircle] = useState(false);
  const [reflexDone, setReflexDone] = useState(false);
  const reflexStartRef = useRef(null);

  // Memory state
  const [memoryPhase, setMemoryPhase] = useState("show"); // show, input
  const [memoryInput, setMemoryInput] = useState("");
  const MEMORY_SEQ = "4 7 2 9 5";

  // Math state
  const [mathIndex, setMathIndex] = useState(0);
  const [mathInput, setMathInput] = useState("");
  const [mathCorrect, setMathCorrect] = useState(0);
  const [mathFeedback, setMathFeedback] = useState(null);

  // Word state
  const [wordIndex, setWordIndex] = useState(0);
  const [wordInput, setWordInput] = useState("");
  const [wordCorrect, setWordCorrect] = useState(0);
  const [wordFeedback, setWordFeedback] = useState(null);

  const startTimer = useCallback((duration, onEnd) => {
    clearInterval(timerRef.current);
    setTimeLeft(duration);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          onEnd();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, []);

  const nextRound = useCallback((roundIndex, currentScore, scores) => {
    if (roundIndex >= ROUNDS.length) {
      setGameState("finished");
      return;
    }
    const round = ROUNDS[roundIndex];
    setCurrentRound(roundIndex);
    setGameState("playing");

    // Reset round states
    setShowCircle(false);
    setReflexDone(false);
    setMemoryPhase("show");
    setMemoryInput("");
    setMathIndex(0);
    setMathInput("");
    setMathCorrect(0);
    setMathFeedback(null);
    setWordIndex(0);
    setWordInput("");
    setWordCorrect(0);
    setWordFeedback(null);

    if (round.type === "reflex") {
      startTimer(round.duration, () => {
        const pts = reflexDone ? 200 : 50;
        const newScores = [...scores, { round: round.title, score: pts }];
        setRoundScores(newScores);
        setScore(currentScore + pts);
        setTimeout(() => nextRound(roundIndex + 1, currentScore + pts, newScores), 1000);
      });
      setTimeout(() => {
        setShowCircle(true);
        reflexStartRef.current = Date.now();
      }, Math.random() * 3000 + 1000);
    } else if (round.type === "memory") {
      startTimer(5, () => {
        setMemoryPhase("input");
        startTimer(round.duration - 5, () => {
          const pts = 100;
          const newScores = [...scores, { round: round.title, score: pts }];
          setRoundScores(newScores);
          setScore(currentScore + pts);
          setTimeout(() => nextRound(roundIndex + 1, currentScore + pts, newScores), 500);
        });
      });
    } else {
      startTimer(round.duration, () => {
        const pts = round.type === "math" ? mathCorrect * 100 : wordCorrect * 100;
        const newScores = [...scores, { round: round.title, score: pts }];
        setRoundScores(newScores);
        setScore(currentScore + pts);
        setTimeout(() => nextRound(roundIndex + 1, currentScore + pts, newScores), 500);
      });
    }
  }, [startTimer, reflexDone, mathCorrect, wordCorrect]);

  const handleReflexClick = () => {
    if (!showCircle || reflexDone) return;
    const time = Date.now() - reflexStartRef.current;
    setShowCircle(false);
    setReflexDone(true);
    const pts = time < 300 ? 400 : time < 500 ? 300 : 200;
    clearInterval(timerRef.current);
    const newScores = [...roundScores, { round: ROUNDS[0].title, score: pts }];
    setRoundScores(newScores);
    setScore(s => s + pts);
    setTimeout(() => nextRound(1, score + pts, newScores), 800);
  };

  const handleMemorySubmit = () => {
    const correct = memoryInput.replace(/\s/g, "") === MEMORY_SEQ.replace(/\s/g, "");
    const pts = correct ? 300 : 50;
    clearInterval(timerRef.current);
    const newScores = [...roundScores, { round: ROUNDS[1].title, score: pts }];
    setRoundScores(newScores);
    setScore(s => s + pts);
    setTimeout(() => nextRound(2, score + pts, newScores), 500);
  };

  const handleMathSubmit = () => {
    const correct = mathInput.trim() === MATH_QUESTIONS[mathIndex].a;
    if (correct) {
      setMathCorrect(c => c + 1);
      setMathFeedback("correct");
    } else {
      setMathFeedback("wrong");
    }
    setMathInput("");
    setTimeout(() => {
      setMathFeedback(null);
      if (mathIndex >= MATH_QUESTIONS.length - 1) {
        clearInterval(timerRef.current);
        const pts = (correct ? mathCorrect + 1 : mathCorrect) * 100;
        const newScores = [...roundScores, { round: ROUNDS[2].title, score: pts }];
        setRoundScores(newScores);
        setScore(s => s + pts);
        setTimeout(() => nextRound(3, score + pts, newScores), 500);
      } else {
        setMathIndex(i => i + 1);
      }
    }, 500);
  };

  const handleWordSubmit = () => {
    const correct = wordInput.trim().toLowerCase() === WORDS[wordIndex];
    if (correct) {
      setWordCorrect(c => c + 1);
      setWordFeedback("correct");
    } else {
      setWordFeedback("wrong");
    }
    setWordInput("");
    setTimeout(() => {
      setWordFeedback(null);
      if (wordIndex >= WORDS.length - 1) {
        clearInterval(timerRef.current);
        const pts = (correct ? wordCorrect + 1 : wordCorrect) * 100;
        const newScores = [...roundScores, { round: ROUNDS[3].title, score: pts }];
        setRoundScores(newScores);
        setScore(s => s + pts);
        setTimeout(() => setGameState("finished"), 500);
      } else {
        setWordIndex(i => i + 1);
      }
    }, 500);
  };

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  // FINISHED
  if (gameState === "finished") {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
        <h1 className="text-4xl font-bold">👑 Boss Mode — Results</h1>
        <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md text-center">
          <p className="text-6xl mb-4">👑</p>
          <p className="text-gray-400 mb-4">Round Breakdown</p>
          <div className="space-y-2 mb-6">
            {roundScores.map((r, i) => (
              <div key={i} className="flex justify-between bg-gray-800 rounded-xl px-4 py-3">
                <span className="text-gray-300">{r.round}</span>
                <span className="text-yellow-400 font-bold">+{r.score}</span>
              </div>
            ))}
          </div>
          <p className="text-4xl font-bold text-yellow-400 mb-8">Total: {score}</p>
          <div className="flex gap-3">
            <button
              onClick={() => { setScore(0); setRoundScores([]); setGameState("waiting"); }}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700 py-3 rounded-xl transition"
            >
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

  const round = ROUNDS[currentRound];

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-6 p-6">
      <div className="flex items-center gap-3">
        <span className="text-3xl">👑</span>
        <h1 className="text-3xl font-bold">Cognitive Boss Mode</h1>
      </div>

      {gameState === "waiting" && (
        <div className="text-center max-w-md">
          <p className="text-gray-300 mb-2 text-lg">The ultimate brain challenge!</p>
          <p className="text-gray-400 mb-2">4 rounds — Reflex, Memory, Math, Typing</p>
          <p className="text-gray-400 mb-6">Complete all rounds for maximum score! 🏆</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {ROUNDS.map(r => (
              <div key={r.id} className="bg-gray-800 rounded-xl p-3 text-sm">
                <p className="font-bold">{r.title}</p>
                <p className="text-gray-400">{r.duration}s</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => nextRound(0, 0, [])}
            className="bg-yellow-600 hover:bg-yellow-700 px-8 py-4 rounded-xl text-lg font-semibold transition"
          >
            Start Boss Mode!
          </button>
        </div>
      )}

      {gameState === "playing" && round && (
        <div className="w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{round.title}</h2>
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-400 animate-pulse" : "text-green-400"}`}>
              {timeLeft}s
            </span>
          </div>
          <p className="text-gray-400 mb-6">{round.instruction}</p>

          {/* REFLEX ROUND */}
          {round.type === "reflex" && (
            <div
              className="w-full h-64 bg-gray-900 rounded-2xl border border-gray-700 flex items-center justify-center cursor-pointer"
              onClick={handleReflexClick}
            >
              {showCircle ? (
                <div className="w-24 h-24 bg-green-500 rounded-full animate-bounce shadow-lg shadow-green-500/50" />
              ) : reflexDone ? (
                <p className="text-green-400 text-xl font-bold">✅ Got it!</p>
              ) : (
                <p className="text-gray-500 animate-pulse">Wait for green circle...</p>
              )}
            </div>
          )}

          {/* MEMORY ROUND */}
          {round.type === "memory" && (
            <div className="space-y-4">
              {memoryPhase === "show" ? (
                <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-700">
                  <p className="text-gray-400 mb-2">Memorize this sequence!</p>
                  <p className="text-5xl font-bold tracking-widest text-purple-400">{MEMORY_SEQ}</p>
                  <p className="text-gray-500 mt-4 text-sm">Hiding in {timeLeft}s...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-gray-300">Type the sequence you saw:</p>
                  <input
                    value={memoryInput}
                    onChange={e => setMemoryInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleMemorySubmit()}
                    placeholder="e.g. 4 7 2 9 5"
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-purple-500"
                    autoFocus
                  />
                  <button onClick={handleMemorySubmit} className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl transition">
                    Submit
                  </button>
                </div>
              )}
            </div>
          )}

          {/* MATH ROUND */}
          {round.type === "math" && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Question {mathIndex + 1}/{MATH_QUESTIONS.length}</span>
                <span className="text-green-400">Correct: {mathCorrect}</span>
              </div>
              <div className={`bg-gray-900 rounded-2xl p-6 text-center border-2 transition
                ${mathFeedback === "correct" ? "border-green-500" : mathFeedback === "wrong" ? "border-red-500" : "border-gray-700"}`}>
                <p className="text-4xl font-bold">{MATH_QUESTIONS[mathIndex].q}</p>
              </div>
              <input
                value={mathInput}
                onChange={e => setMathInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleMathSubmit()}
                placeholder="Your answer..."
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-orange-500"
                autoFocus
              />
              <button onClick={handleMathSubmit} className="w-full bg-orange-600 hover:bg-orange-700 py-3 rounded-xl transition">
                Submit
              </button>
            </div>
          )}

          {/* WORD ROUND */}
          {round.type === "word" && (
            <div className="space-y-4">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Word {wordIndex + 1}/{WORDS.length}</span>
                <span className="text-green-400">Correct: {wordCorrect}</span>
              </div>
              <div className={`bg-gray-900 rounded-2xl p-6 text-center border-2 transition
                ${wordFeedback === "correct" ? "border-green-500" : wordFeedback === "wrong" ? "border-red-500" : "border-gray-700"}`}>
                <p className="text-4xl font-bold tracking-widest">{WORDS[wordIndex].toUpperCase()}</p>
              </div>
              <input
                value={wordInput}
                onChange={e => setWordInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleWordSubmit()}
                placeholder="Type the word..."
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-600 text-white outline-none focus:border-teal-500"
                autoFocus
              />
              <button onClick={handleWordSubmit} className="w-full bg-teal-600 hover:bg-teal-700 py-3 rounded-xl transition">
                Submit
              </button>
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