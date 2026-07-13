"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameSound } from "@/hooks/useGameSound";
import {
  Play, RotateCcw, ArrowRight, Hash, AlertTriangle, Brain,
  Shield, Star, Zap, Flame, Trophy, Heart, Eye, EyeOff,
  Volume2, VolumeX, ChevronRight,
} from "lucide-react";

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
  startDigits: number;
  digitsPerLevel: number;
  baseDisplayMs: number;          // base memorize time
  msPerDigit: number;             // extra ms per digit
  lives: number;
  groupDigits: boolean;           // show in groups (123 456)
  groupSize: number;
  includeDecimals: boolean;
  includeNegatives: boolean;
  hasInputTimer: boolean;
  inputTimerSec: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Easy numbers · Long display · 3 lives · Digit groups",
    startDigits: 2, digitsPerLevel: 1, baseDisplayMs: 4000, msPerDigit: 800,
    lives: 3, groupDigits: true, groupSize: 2, includeDecimals: false, includeNegatives: false,
    hasInputTimer: false, inputTimerSec: 0,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4+ digits · Medium display · 2 lives · Grouped",
    startDigits: 3, digitsPerLevel: 1, baseDisplayMs: 3000, msPerDigit: 600,
    lives: 2, groupDigits: true, groupSize: 3, includeDecimals: false, includeNegatives: false,
    hasInputTimer: false, inputTimerSec: 0,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard · Fast display · 1 life",
    startDigits: 4, digitsPerLevel: 1, baseDisplayMs: 2000, msPerDigit: 450,
    lives: 1, groupDigits: false, groupSize: 0, includeDecimals: false, includeNegatives: false,
    hasInputTimer: false, inputTimerSec: 0,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Decimals & negatives · Short display · 1 life · Input timer",
    startDigits: 5, digitsPerLevel: 1, baseDisplayMs: 2000, msPerDigit: 350,
    lives: 1, groupDigits: false, groupSize: 0, includeDecimals: true, includeNegatives: true,
    hasInputTimer: true, inputTimerSec: 15,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Ultra-fast · Complex numbers · Input timer · No hints",
    startDigits: 7, digitsPerLevel: 2, baseDisplayMs: 1500, msPerDigit: 250,
    lives: 1, groupDigits: false, groupSize: 0, includeDecimals: true, includeNegatives: true,
    hasInputTimer: true, inputTimerSec: 10,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

/* ─────────────────────────────────────────────
   NUMBER GENERATOR
───────────────────────────────────────────── */
function generateNumber(digits: number, config: DiffConfig): string {
  let num = "";
  // first digit never 0
  num += Math.floor(Math.random() * 9) + 1;
  for (let i = 1; i < digits; i++) {
    num += Math.floor(Math.random() * 10);
  }

  if (config.includeDecimals && digits > 4 && Math.random() > 0.5) {
    const decimalPlaces = Math.floor(Math.random() * 2) + 1;
    const splitAt = digits - decimalPlaces;
    num = num.slice(0, splitAt) + "." + num.slice(splitAt);
  }

  if (config.includeNegatives && Math.random() > 0.6) {
    num = "-" + num;
  }

  return num;
}

function formatForDisplay(num: string, config: DiffConfig): string {
  if (!config.groupDigits) return num;
  const digits = num.replace(/\D/g, "");
  const groups: string[] = [];
  for (let i = 0; i < digits.length; i += config.groupSize) {
    groups.push(digits.slice(i, i + config.groupSize));
  }
  return groups.join("  ");
}

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
      onClick={disabled ? undefined : onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-3 transition-all focus:outline-none overflow-hidden ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? `${d.borderColor} bg-white shadow-lg` : "border-slate-200 bg-white/70 hover:border-slate-300"}`}
    >
      {selected && (
        <div className="absolute inset-0 opacity-5" style={{ background: DIFF_GRADIENT[diffKey] }} />
      )}
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: DIFF_GRADIENT[diffKey] }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-slate-800">{d.label}</span>
            {selected && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} digits</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function NumberMemoryPageClient() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "memorize" | "input" | "result" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState("");
  const [userInput, setUserInput] = useState("");
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);
  const [inputTimeLeft, setInputTimeLeft] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });
  const [lastCorrect, setLastCorrect] = useState(false);

  const inputTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  /* load high scores */
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`number-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (inputTimerRef.current) clearInterval(inputTimerRef.current); }, []);

  const stopInputTimer = useCallback(() => {
    if (inputTimerRef.current) clearInterval(inputTimerRef.current);
    setInputTimeLeft(0);
  }, []);

  const startInputTimer = useCallback(() => {
    if (!diff.hasInputTimer) return;
    setInputTimeLeft(diff.inputTimerSec);
    inputTimerRef.current = setInterval(() => {
      setInputTimeLeft(t => {
        if (t <= 1) {
          clearInterval(inputTimerRef.current!);
          // auto-submit on expire
          setPhase("result");
          play("error");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diff, play]);

  /* ── start / restart ── */
  const startGame = useCallback(() => {
    stopInputTimer();
    const d = DIFFICULTIES[diffId];
    const digits = d.startDigits;
    const num = generateNumber(digits, d);
    setCurrentNumber(num);
    setLevel(1);
    setLivesLeft(d.lives);
    setStreak(0);
    setUserInput("");
    setShowReveal(false);
    setPhase("memorize");
    playSound("start");

    const displayMs = d.baseDisplayMs + (num.replace(/[^0-9]/g, "").length * d.msPerDigit);
    setTimeout(() => {
      setPhase("input");
      startInputTimer();
      setTimeout(() => inputRef.current?.focus(), 100);
    }, displayMs);
  }, [diffId, playSound, startInputTimer, stopInputTimer]);

  /* ── advance level ── */
  const goNextLevel = useCallback((currentLevel: number) => {
    stopInputTimer();
    const d = DIFFICULTIES[diffId];
    const newLevel = currentLevel + 1;
    const digits = d.startDigits + (newLevel - 1) * d.digitsPerLevel;
    const num = generateNumber(digits, d);
    setCurrentNumber(num);
    setLevel(newLevel);
    setUserInput("");
    setShowReveal(false);
    setPhase("memorize");
    playSound("levelUp");

    const displayMs = d.baseDisplayMs + (num.replace(/[^0-9]/g, "").length * d.msPerDigit);
    setTimeout(() => {
      setPhase("input");
      startInputTimer();
      setTimeout(() => inputRef.current?.focus(), 100);
    }, displayMs);
  }, [diffId, playSound, startInputTimer, stopInputTimer]);

  /* ── submit answer ── */
  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault();
    stopInputTimer();
    const isCorrect = userInput.trim() === currentNumber;
    setLastCorrect(isCorrect);
    setPhase("result");

    if (isCorrect) {
      playSound("success");
      setStreak(s => s + 1);
    } else {
      playSound("error");
      setStreak(0);
      const newLives = livesLeft - 1;
      setLivesLeft(newLives);
      // update high score on any failure
      const currentDigits = DIFFICULTIES[diffId].startDigits + (level - 1) * DIFFICULTIES[diffId].digitsPerLevel;
      setHighScores(prev => {
        if (currentDigits > prev[diffId]) {
          const updated = { ...prev, [diffId]: currentDigits };
          localStorage.setItem(`number-hs-${diffId}`, currentDigits.toString());
          return updated;
        }
        return prev;
      });
    }
  }, [userInput, currentNumber, playSound, livesLeft, diffId, level, stopInputTimer]);

  /* ── proceed after result ── */
  const handleProceed = useCallback(() => {
    if (lastCorrect) {
      goNextLevel(level);
    } else {
      const newLives = livesLeft; // already decremented in handleSubmit
      if (newLives <= 0) {
        setPhase("gameover");
      } else {
        // replay same level
        const d = DIFFICULTIES[diffId];
        const digits = d.startDigits + (level - 1) * d.digitsPerLevel;
        const num = generateNumber(digits, d);
        setCurrentNumber(num);
        setUserInput("");
        setShowReveal(false);
        setPhase("memorize");
        playSound("tick");
        const displayMs = d.baseDisplayMs + (num.replace(/[^0-9]/g, "").length * d.msPerDigit);
        setTimeout(() => {
          setPhase("input");
          startInputTimer();
          setTimeout(() => inputRef.current?.focus(), 100);
        }, displayMs);
      }
    }
  }, [lastCorrect, level, goNextLevel, livesLeft, diffId, playSound, startInputTimer]);

  const currentDigits = diff.startDigits + (level - 1) * diff.digitsPerLevel;
  const displayMs = diff.baseDisplayMs + (currentDigits * diff.msPerDigit);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">NUMBER MEMORY</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">COGNITIVE DIGIT CALIBRATION</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "select" || phase === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "memorize" || phase === "input" || phase === "result"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Level</div>
                  <div className="text-2xl font-mono font-bold text-slate-800 mt-0.5">{level < 10 ? `0${level}` : level}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Digits</div>
                  <div className={`text-2xl font-mono font-bold mt-0.5 ${diff.textColor}`}>{currentDigits}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Lives</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {Array.from({ length: diff.lives }).map((_, i) => (
                      <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Streak</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${streak >= 3 ? "text-orange-500" : "text-slate-800"}`}>
                    {streak >= 3 ? `🔥x${streak}` : `x${streak}`}
                  </div>
                </div>
              </div>

              {/* Best */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} digits</div>
                  </div>
                </div>
              )}

              {/* Input Timer bar */}
              {diff.hasInputTimer && phase === "input" && inputTimeLeft > 0 && (
                <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time Left</span>
                    <span className={`text-sm font-mono font-bold ${inputTimeLeft <= 4 ? "text-red-500" : "text-slate-700"}`}>{inputTimeLeft}s</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: inputTimeLeft <= 4 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                      animate={{ width: `${(inputTimeLeft / diff.inputTimerSec) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-[9px] font-mono uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4">
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              {/* Corner decals */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />
              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                {currentDigits} DIGITS
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.15)_50%)] bg-[size:100%_4px]" />

              <div className="p-6 md:p-10 min-h-[460px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Hash className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Digit Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          A number will flash on screen. Memorize it, then type it back. Select your difficulty on the left.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. MEMORIZE SCREEN ── */}
                  {phase === "memorize" && (
                    <motion.div key="memorize" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }} className="text-center space-y-8 w-full">
                      {/* Digit Groups or Raw */}
                      <div className="flex flex-wrap justify-center gap-3 px-4">
                        {diff.groupDigits
                          ? formatForDisplay(currentNumber, diff).split("  ").map((group, gi) => (
                            <motion.div
                              key={gi}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: gi * 0.12 }}
                              className="bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 font-mono font-black text-3xl sm:text-4xl text-slate-800 tracking-widest shadow-sm"
                            >
                              {group}
                            </motion.div>
                          ))
                          : (
                            <div className="text-5xl sm:text-7xl font-mono font-black text-slate-800 tracking-widest break-all leading-tight select-all">
                              {currentNumber}
                            </div>
                          )
                        }
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-mono uppercase tracking-widest animate-pulse" style={{ color: DIFF_GRADIENT[diffId].includes("#34d399") ? "#059669" : DIFF_GRADIENT[diffId].includes("#38bdf8") ? "#0284c7" : "#7c3aed" }}>
                          [ MEMORIZE THIS NUMBER ]
                        </p>
                        <div className="w-full max-w-md mx-auto h-2.5 bg-slate-100 border border-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: DIFF_GRADIENT[diffId] }}
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: displayMs / 1000, ease: "linear" }}
                          />
                        </div>
                        <p className="text-[9px] font-mono text-slate-400">{currentDigits} digit{currentDigits !== 1 ? "s" : ""} · Level {level}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. INPUT SCREEN ── */}
                  {phase === "input" && (
                    <motion.form key="input" onSubmit={handleSubmit} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6 w-full max-w-md text-center">
                      <div className="space-y-1">
                        <label className="text-lg font-mono font-bold text-slate-700 block uppercase tracking-wider">Type the Number</label>
                        <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                          {currentDigits} digits · {diff.hasInputTimer ? `${diff.inputTimerSec}s limit` : "no time limit"}
                        </span>
                      </div>

                      {/* Input field */}
                      <div className="relative w-full">
                        <div className="absolute inset-0 rounded-2xl bg-slate-100 shadow-[inset_0_2px_6px_rgba(0,0,0,0.06)]" />
                        <input
                          ref={inputRef}
                          type="text"
                          inputMode="text"
                          value={userInput}
                          onChange={e => { setUserInput(e.target.value); playSound("click"); }}
                          placeholder="···"
                          className="relative w-full text-center text-4xl sm:text-5xl bg-white border border-slate-200 rounded-2xl py-5 px-4 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-400/20 text-slate-800 tracking-widest font-mono shadow-sm placeholder:text-slate-200"
                          autoFocus
                        />
                      </div>

                      {/* Char counter */}
                      <div className="flex justify-center gap-1">
                        {Array.from({ length: currentDigits }).map((_, i) => (
                          <div key={i} className={`w-2 h-2 rounded-full transition-all duration-150 ${i < userInput.length ? "" : "bg-slate-200"}`}
                            style={i < userInput.length ? { background: DIFF_GRADIENT[diffId] } : {}}
                          />
                        ))}
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ translateY: -2 }}
                        whileTap={{ translateY: 6 }}
                        className="relative group cursor-pointer focus:outline-none select-none w-full"
                      >
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-80" style={{ background: DIFF_GRADIENT[diffId], filter: "brightness(0.7)" }} />
                        <div className="relative py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          Submit Answer
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </motion.button>
                    </motion.form>
                  )}

                  {/* ── 4. RESULT SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 w-full max-w-md">
                      {lastCorrect ? (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl">
                            <Brain className="w-8 h-8 text-emerald-500" />
                            <motion.div initial={{ scale: 0 }} animate={{ scale: [0, 1.3, 1] }} transition={{ duration: 0.4 }} className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-400 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">✓</span>
                            </motion.div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CORRECT!</div>
                            {streak >= 3 && (
                              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-600 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                                🔥 STREAK x{streak}!
                              </motion.div>
                            )}
                            <p className="text-xs text-slate-500 font-mono">Level {level} cleared · {currentDigits} digits</p>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                            <div className="text-[9px] font-mono text-slate-400 uppercase mb-1">You recalled</div>
                            <div className="text-2xl font-mono font-bold text-emerald-600 break-all tracking-widest">{currentNumber}</div>
                          </div>
                          <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={handleProceed} className="relative group cursor-pointer focus:outline-none select-none w-full">
                            <div className="absolute inset-0 rounded-xl translate-y-1.5" style={{ background: "#059669" }} />
                            <div className="relative py-4 rounded-xl bg-emerald-500 text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg">
                              <ArrowRight className="w-4 h-4" />
                              Next Level ({currentDigits + diff.digitsPerLevel} digits)
                            </div>
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-red-600 tracking-wider">WRONG</div>
                            <p className="text-xs text-slate-500 font-mono">
                              {livesLeft > 0 ? `${livesLeft} life remaining — try again` : "No lives left"}
                            </p>
                          </div>

                          {/* Comparison */}
                          <div className="grid grid-cols-2 gap-3 text-left">
                            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                              <div className="text-[9px] font-mono text-slate-400 uppercase mb-1">Correct</div>
                              <div
                                className="font-mono font-bold break-all leading-tight"
                                style={{ fontSize: currentNumber.length > 10 ? "1rem" : "1.25rem", color: "#059669" }}
                              >
                                {currentNumber}
                              </div>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-xl p-3">
                              <div className="text-[9px] font-mono text-red-400 uppercase mb-1">Your Answer</div>
                              <div
                                className="font-mono font-bold break-all text-red-500 line-through leading-tight"
                                style={{ fontSize: (userInput || "—").length > 10 ? "1rem" : "1.25rem" }}
                              >
                                {userInput || "—"}
                              </div>
                            </div>
                          </div>

                          {/* Reveal toggle (Beginner only) */}
                          {diff.id === "beginner" && (
                            <button
                              onClick={() => setShowReveal(r => !r)}
                              className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400 hover:text-violet-500 transition-colors cursor-pointer mx-auto"
                            >
                              {showReveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                              {showReveal ? "Hide" : "Show"} correct number
                            </button>
                          )}

                          <div className="flex gap-3 w-full">
                            {livesLeft > 0 ? (
                              <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={handleProceed} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                                <div className="absolute inset-0 rounded-xl translate-y-1.5" style={{ background: DIFF_GRADIENT[diffId], filter: "brightness(0.7)" }} />
                                <div className="relative py-3.5 rounded-xl text-white font-mono font-bold tracking-widest text-xs flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-md" style={{ background: DIFF_GRADIENT[diffId] }}>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  Try Again
                                </div>
                              </motion.button>
                            ) : null}
                            <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                              <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                              <div className="relative py-3.5 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-md">
                                <RotateCcw className="w-3.5 h-3.5" />
                                Restart
                              </div>
                            </motion.button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  )}

                  {/* ── 5. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-600 tracking-wider">GAME OVER</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode · Reached {currentDigits} digits</p>
                        {currentDigits >= highScores[diffId] && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {currentDigits} digits!
                          </motion.div>
                        )}
                      </div>
                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }}
                          whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setLevel(1); setStreak(0); setLivesLeft(diff.lives); }}
                          className="relative group cursor-pointer focus:outline-none select-none"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            Change Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>

            {/* Abort session while memorizing or inputting */}
            {(phase === "memorize" || phase === "input") && (
              <div className="flex justify-end">
                <button
                  onClick={() => { stopInputTimer(); setPhase("gameover"); }}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Abort Session ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
