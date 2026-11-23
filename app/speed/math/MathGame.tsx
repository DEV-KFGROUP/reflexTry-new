"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Calculator, Flame, Play, RotateCcw, Shield, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* ─────────────────────────────────────────────
   INLINE GRADIENT MAP (avoids Tailwind purging)
───────────────────────────────────────────── */
const DIFF_GRADIENT: Record<string, string> = {
  beginner:     "linear-gradient(135deg, #34d399, #14b8a6)",
  easy:         "linear-gradient(135deg, #38bdf8, #3b82f6)",
  normal:       "linear-gradient(135deg, #8b5cf6, #9333ea)",
  hard:         "linear-gradient(135deg, #fb923c, #ef4444)",
  professional: "linear-gradient(135deg, #f43f5e, #ec4899)",
};

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  timeLimitSec: number;
  maxMistakes: number;
  ops: string[];
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Addition & Subtraction · Numbers 1-10 · 45s timer · 5 lives",
    timeLimitSec: 45, maxMistakes: 5, ops: ["+", "-"],
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Addition, Subtraction & Multiplication · Numbers 1-12 · 45s · 3 lives",
    timeLimitSec: 45, maxMistakes: 3, ops: ["+", "-", "*"],
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "All operators including Division · Numbers 1-20 · 60s · 3 lives",
    timeLimitSec: 60, maxMistakes: 3, ops: ["+", "-", "*", "/"],
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Double operands (e.g. (a + b) * c) · Numbers 1-30 · 60s · 3 lives",
    timeLimitSec: 60, maxMistakes: 3, ops: ["double"],
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Algebra equations - Solve for X! (e.g. 3x + 5 = 17) · 60s · 3 lives",
    timeLimitSec: 60, maxMistakes: 3, ops: ["algebra"],
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

/* ─────────────────────────────────────────────
   DIFFICULTY CARD
───────────────────────────────────────────── */
function DifficultyCard({
  diffKey, selected, onSelect, highScore, disabled,
}: {
  diffKey: DiffId; selected: boolean; onSelect: () => void; highScore: number; disabled: boolean;
}) {
  const d = DIFFICULTIES[diffKey];
  const Icon = d.icon;
  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      disabled={disabled}
      aria-pressed={selected}
      onClick={disabled ? undefined : onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-3 transition-all focus:outline-none overflow-hidden ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? `${d.borderColor} bg-white shadow-lg` : "border-[#E6E3DB] bg-white/70 hover:border-[#D8D4C9]"}`}
    >
      {selected && (
        <div className="absolute inset-0 opacity-5" style={{ background: DIFF_GRADIENT[diffKey] }} />
      )}
      <div className="relative z-10 flex items-start gap-3">
        <div className="difficulty-icon w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: DIFF_GRADIENT[diffKey] }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-[#161614]">{d.label}</span>
            {selected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#57554E] dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} pts</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function MathGame() {
  const { setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [hitsCount, setHitsCount] = useState(0);
  const [missesCount, setMissesCount] = useState(0);
  const [muted, setMuted] = useState(false);

  // Math State
  const [problem, setProblem] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_math-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const generateProblem = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    
    // 1. Beginner Mode: Add/Sub 1-10
    if (d.id === "beginner") {
      const op = d.ops[Math.floor(Math.random() * d.ops.length)];
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      
      if (op === "+") {
        setProblem(`${a} + ${b}`);
        setCorrectAnswer(a + b);
      } else {
        // Prevent negative results for beginners
        const max = Math.max(a, b);
        const min = Math.min(a, b);
        setProblem(`${max} - ${min}`);
        setCorrectAnswer(max - min);
      }
    } 

    // 2. Easy Mode: Add/Sub/Mul 1-12
    else if (d.id === "easy") {
      const op = d.ops[Math.floor(Math.random() * d.ops.length)];
      if (op === "*") {
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        setProblem(`${a} × ${b}`);
        setCorrectAnswer(a * b);
      } else {
        const a = Math.floor(Math.random() * 12) + 2;
        const b = Math.floor(Math.random() * 12) + 2;
        if (op === "+") {
          setProblem(`${a} + ${b}`);
          setCorrectAnswer(a + b);
        } else {
          const max = Math.max(a, b);
          const min = Math.min(a, b);
          setProblem(`${max} - ${min}`);
          setCorrectAnswer(max - min);
        }
      }
    }

    // 3. Normal Mode: Add/Sub/Mul/Div 1-20
    else if (d.id === "normal") {
      const op = d.ops[Math.floor(Math.random() * d.ops.length)];
      if (op === "/") {
        const divisor = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const quotient = Math.floor(Math.random() * 9) + 2; // 2 to 10
        const dividend = divisor * quotient;
        setProblem(`${dividend} ÷ ${divisor}`);
        setCorrectAnswer(quotient);
      } else if (op === "*") {
        const a = Math.floor(Math.random() * 11) + 2;
        const b = Math.floor(Math.random() * 11) + 2;
        setProblem(`${a} × ${b}`);
        setCorrectAnswer(a * b);
      } else {
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        if (op === "+") {
          setProblem(`${a} + ${b}`);
          setCorrectAnswer(a + b);
        } else {
          const max = Math.max(a, b);
          const min = Math.min(a, b);
          setProblem(`${max} - ${min}`);
          setCorrectAnswer(max - min);
        }
      }
    }

    // 4. Hard Mode: Double operands (e.g. (a + b) * c)
    else if (d.ops.includes("double")) {
      const roll = Math.random();
      if (roll < 0.35) {
        // (a + b) * c
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 4) + 2; // 2 to 5
        setProblem(`(${a} + ${b}) × ${c}`);
        setCorrectAnswer((a + b) * c);
      } else if (roll < 0.7) {
        // a * b - c
        const a = Math.floor(Math.random() * 9) + 2;
        const b = Math.floor(Math.random() * 9) + 2;
        const c = Math.floor(Math.random() * 15) + 1;
        setProblem(`${a} × ${b} - ${c}`);
        setCorrectAnswer(a * b - c);
      } else {
        // a + b + c
        const a = Math.floor(Math.random() * 20) + 5;
        const b = Math.floor(Math.random() * 20) + 5;
        const c = Math.floor(Math.random() * 20) + 5;
        setProblem(`${a} + ${b} + ${c}`);
        setCorrectAnswer(a + b + c);
      }
    }

    // 5. Professional Mode: Algebra - Solve for X!
    else if (d.ops.includes("algebra")) {
      const roll = Math.random();
      if (roll < 0.35) {
        // ax + b = c
        const x = Math.floor(Math.random() * 8) + 2; // answer is x
        const a = Math.floor(Math.random() * 7) + 2; // 2 to 8
        const b = Math.floor(Math.random() * 12) + 1;
        const c = a * x + b;
        setProblem(`${a}x + ${b} = ${c}`);
        setCorrectAnswer(x);
      } else if (roll < 0.7) {
        // ax - b = c
        const x = Math.floor(Math.random() * 8) + 2;
        const a = Math.floor(Math.random() * 7) + 2;
        const b = Math.floor(Math.random() * 12) + 1;
        const c = a * x - b;
        setProblem(`${a}x - ${b} = ${c}`);
        setCorrectAnswer(x);
      } else {
        // x / a + b = c
        const a = Math.floor(Math.random() * 3) + 2; // 2 to 4
        const factor = Math.floor(Math.random() * 5) + 2; // 2 to 6
        const x = a * factor; // answer is x
        const b = Math.floor(Math.random() * 10) + 1;
        const c = factor + b;
        setProblem(`x/${a} + ${b} = ${c}`);
        setCorrectAnswer(x);
      }
    }

    setUserAnswer("");
  }, [diffId]);

  const startGame = useCallback(() => {
    cancelTimers();
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(d.timeLimitSec);
    setGameState("playing");
    generateProblem();
    playSound("start");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = (() => { const deadline = performance.now() + (diff.timeLimitSec) * 1000; return setInterval(() => {
      const remaining = Math.max(0, (deadline - performance.now()) / 1000);
      setTimeLeft(Math.ceil(remaining));
      if (remaining === 0) { clearInterval(timerRef.current!);
playSound("levelUp");
setGameState("gameover"); }
    }, 50); })();
  }, [diffId, score, playSound, generateProblem]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const num = userAnswer.trim() === "" ? NaN : Number(userAnswer);

    if (!isNaN(num) && num === correctAnswer) {
      setHitsCount(h => h + 1);
      setScore(s => s + 100);
      playSound("success");
      generateProblem();
    } else {
      setMissesCount(m => m + 1);
      playSound("error");
      setUserAnswer("");

      // Check lives limit
      const nextMisses = missesCount + 1;
      if (nextMisses >= diff.maxMistakes) {
        clearInterval(timerRef.current!);
        playSound("error");
        setGameState("gameover");
      }
    }
  };

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalAttempts = hitsCount + missesCount;
  const accuracyPercent = totalAttempts > 0 ? Math.round((hitsCount / totalAttempts) * 100) : 100;


  const progress = useToolProgress({
    toolId: "math-speed", phase: gameState, difficulty: diffId,
    value: score, unit: "pts", higherIsBetter: true,
    terminal: ["gameover"], idle: ["idle"], recordKey: "reflextry_v2_math-hs-",
    setHighScores, cancelTimers, reset: () => setGameState("idle"),
    eligible: true,
  });

  return (
    <div data-idle={gameState === "idle"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/speed/math" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Speed Math</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">ARITHMETIC ACCURACY CALIBRATION</p>
          </div>
            </div>
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="game-columns w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="game-settings flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="game-difficulty bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-xs font-mono font-semibold text-[#57554E] dark:text-slate-300 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (gameState === "idle" || gameState === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={gameState === "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="game-stats bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-xs font-mono font-semibold text-[#57554E] dark:text-slate-300 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Score</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">{score}</div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">{accuracyPercent}%</div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {Math.max(0, diff.maxMistakes - missesCount)} ❤️
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-855"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Score ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} pts</div>
                  </div>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-[#FAF9F6] border-[#E6E3DB] text-[#78756C] hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="game-arena flex flex-col gap-4">
            <div className="relative bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">




              <div className="absolute top-4 left-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                {diff.label} Mode
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                MATH ENGINE: SYNCHRONIZED
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {gameState === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="game-start-icon relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Calculator className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Arithmetic Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Solve math equations as fast as possible. Be precise — wrong inputs subtract lives!
                        </p>
                        <p className={`game-level-description text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Play
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {gameState === "playing" && (
                    <motion.div
                      key="playing"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                      className="space-y-8 text-center w-full max-w-sm"
                    >
                      {/* Formula display screen */}
                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-3xl p-6 py-10 shadow-inner relative overflow-hidden flex items-center justify-center min-h-[160px]">
                        <motion.div
                          key={problem}
                          initial={{ scale: 0.85, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-5xl md:text-6xl font-bold text-[#161614] font-mono tracking-wider select-none"
                        >
                          {problem}
                        </motion.div>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Numerical input well */}
                        <div className="relative w-full">
                          <div className="absolute inset-0 rounded-2xl bg-slate-200/80 border border-slate-350 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]" />
                          <input
                            type="number"
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            className="relative w-full bg-white border border-slate-250 text-center text-3xl py-3.5 text-[#161614] outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 font-mono rounded-2xl shadow-inner"
                            autoFocus
                            placeholder="Type answer..."
                          />
                        </div>

                        {/* Submit Button */}
                        <div className="relative h-14 w-full">
                          <div className="absolute inset-0 rounded-2xl bg-cyan-700 translate-y-1.5 border-b-2 border-black/30" />
                          <button
                            type="submit"
                            className="absolute inset-0 rounded-2xl border bg-cyan-500 border-cyan-400 text-white font-mono font-bold text-xs tracking-widest flex items-center justify-center shadow-md select-none cursor-pointer hover:bg-cyan-400/90 active:translate-y-1.5"
                          >
                            SUBMIT CALCULATION
                          </button>
                        </div>
                      </form>

                      <div className="flex gap-4 text-[11px] font-mono text-[#57554E] dark:text-slate-400 uppercase justify-center">
                        <span>Score: {score}</span>
                        <span>Mistakes: {missesCount}/{diff.maxMistakes}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {gameState === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">Round complete</div>
                        <p className="text-xs font-mono text-[#78756C]">{diff.label} mode math completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Accuracy</div>
                          <div className="text-xl text-[#3F3E39] font-mono font-bold">{accuracyPercent}%</div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Play again
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setGameState("idle"); setScore(0); }}
                          className="relative group cursor-pointer focus:outline-none select-none flex-1"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            Select Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Abort */}
            {gameState === "playing" && (
              <div className="flex justify-end">
                <button onClickCapture={() => window.dispatchEvent(new Event("game_abort_requested"))}
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setGameState("gameover"); }}
                  className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                >
                  End round ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
