"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MousePointer, Play, RotateCcw, Trophy, AlertTriangle,
  Shield, Star, Zap, Flame, Volume2, VolumeX, ArrowRight, Brain
} from "lucide-react";
import { useGameSound } from "@/hooks/useGameSound";

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
  targetCps: number;
  timeLimitSec: number;
  clickMode: "standard" | "alternate" | "moving" | "ascending";
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Standard pad · 10s duration · Goal: 3.0 CPS",
    targetCps: 3.0, timeLimitSec: 10, clickMode: "standard",
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Standard pad · 5s duration · Goal: 5.0 CPS",
    targetCps: 5.0, timeLimitSec: 5, clickMode: "standard",
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Alternating dual pads (L -> R -> L...) · Goal: 7.0 CPS",
    targetCps: 7.0, timeLimitSec: 5, clickMode: "alternate",
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Moving target dot · Shrinks on click · Goal: 9.0 CPS",
    targetCps: 9.0, timeLimitSec: 5, clickMode: "moving",
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Ascending sequence pads (1 -> 2 -> 3) · Goal: 11.0+ CPS",
    targetCps: 11.0, timeLimitSec: 5, clickMode: "ascending",
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} CPS</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ClickGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "result">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [muted, setMuted] = useState(false);

  // Click details and locations
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const clickAreaRef = useRef<HTMLDivElement>(null);

  // Mode-specific game states
  const [nextExpectedPad, setNextExpectedPad] = useState<"left" | "right">("left"); // Alternate mode
  const [movingTargetPos, setMovingTargetPos] = useState({ top: "50%", left: "50%" }); // Moving mode
  const [expectedAscendingNum, setExpectedAscendingNum] = useState<number>(1); // Ascending mode (1, 2, 3)

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`cps-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const triggerMovingTarget = useCallback(() => {
    const top = Math.floor(Math.random() * 65) + 15 + "%";
    const left = Math.floor(Math.random() * 65) + 15 + "%";
    setMovingTargetPos({ top, left });
  }, []);

  const startGame = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setTimeLeft(d.timeLimitSec);
    setPhase("playing");
    setClicks([]);

    // Initialize mode variables
    setNextExpectedPad("left");
    setExpectedAscendingNum(1);
    triggerMovingTarget();
    playSound("start");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 0.1) {
          clearInterval(timerRef.current!);
          playSound("levelUp");
          setPhase("result");

          // Save score
          const finalCps = (score / d.timeLimitSec);
          const finalCpsInt = parseFloat(finalCps.toFixed(1));

          setHighScores(hs => {
            if (finalCpsInt > hs[diffId]) {
              localStorage.setItem(`cps-hs-${diffId}`, finalCpsInt.toString());
              return { ...hs, [diffId]: finalCpsInt };
            }
            return hs;
          });
          return 0;
        }
        return t - 0.1;
      });
    }, 100);
  }, [diffId, score, playSound, triggerMovingTarget]);

  // Basic Click registration
  const registerClickFeedback = useCallback((e: React.MouseEvent) => {
    if (clickAreaRef.current) {
      const rect = clickAreaRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setClicks(prev => [...prev, { id: Date.now(), x, y }].slice(-8)); // Keep last 8 ripples
    }
  }, []);

  const handleStandardClick = useCallback((e: React.MouseEvent) => {
    if (phase !== "playing") return;
    setScore(s => s + 1);
    playSound("click");
    registerClickFeedback(e);
  }, [phase, playSound, registerClickFeedback]);

  // Alternating click modes
  const handleAlternateClick = useCallback((pad: "left" | "right", e: React.MouseEvent) => {
    if (phase !== "playing") return;

    if (pad === nextExpectedPad) {
      setScore(s => s + 1);
      playSound("click");
      setNextExpectedPad(pad === "left" ? "right" : "left");
      registerClickFeedback(e);
    } else {
      playSound("error"); // wrong order penalty
    }
  }, [phase, nextExpectedPad, playSound, registerClickFeedback]);

  // Moving target click mode
  const handleMovingClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "playing") return;

    setScore(s => s + 1);
    playSound("click");
    triggerMovingTarget();
    registerClickFeedback(e);
  }, [phase, playSound, triggerMovingTarget, registerClickFeedback]);

  const handleMovingMiss = useCallback(() => {
    if (phase !== "playing") return;
    setScore(s => Math.max(0, s - 1)); // penalty
    playSound("error");
  }, [phase, playSound]);

  // Ascending target click mode (1 -> 2 -> 3)
  const handleAscendingClick = useCallback((num: number, e: React.MouseEvent) => {
    if (phase !== "playing") return;

    if (num === expectedAscendingNum) {
      setScore(s => s + 1);
      playSound("click");
      setExpectedAscendingNum(num === 3 ? 1 : num + 1);
      registerClickFeedback(e);
    } else {
      playSound("error");
    }
  }, [phase, expectedAscendingNum, playSound, registerClickFeedback]);

  const runningCps = (score / (diff.timeLimitSec - timeLeft)).toFixed(1);
  const finalCps = (score / diff.timeLimitSec).toFixed(1);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">CLICK ARENA</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">FREQUENCY SPEED CALIBRATION</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "select" || phase === "result") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Score</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Target CPS</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{diff.targetCps}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Running CPS</div>
                  <div className="text-xl font-mono font-bold text-fuchsia-600 mt-0.5">
                    {isFinite(Number(runningCps)) ? runningCps : "0.0"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 2 ? "text-red-500" : "text-slate-800"}`}>
                    {Math.max(0, timeLeft).toFixed(1)}s
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best CPS ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} CPS</div>
                  </div>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4">
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                ARENA // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                MODE: {diff.clickMode.toUpperCase()}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <MousePointer className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">CPS Calibration</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Unleash clicking speed frequency capacity. Match or exceed the target CPS limits before buffer expiry.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize CPS Pad
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-[400px] flex items-center justify-center relative bg-slate-900 border border-slate-800 rounded-[2.2rem] overflow-hidden"
                      ref={clickAreaRef}
                    >
                      {/* Grid crosshair guidelines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:30px_30px]" />

                      {/* Ripple particles overlay */}
                      <AnimatePresence>
                        {clicks.map((click) => (
                          <motion.div
                            key={click.id}
                            initial={{ scale: 0, opacity: 1 }}
                            animate={{ scale: 2.2, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="absolute w-8 h-8 rounded-full border-2 border-cyan-400 pointer-events-none z-30"
                            style={{ left: click.x, top: click.y, transform: "translate(-50%, -50%)" }}
                          />
                        ))}
                      </AnimatePresence>

                      {/* --- A. Standard click pad (Beginner / Easy) --- */}
                      {diff.clickMode === "standard" && (
                        <motion.button
                          onMouseDown={handleStandardClick}
                          whileTap={{ scale: 0.95 }}
                          className="w-56 h-56 rounded-full border-4 border-slate-800 bg-white shadow-lg active:bg-slate-50 flex flex-col items-center justify-center select-none cursor-pointer z-10"
                        >
                          <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 animate-pulse">
                            <MousePointer className="w-6 h-6 fill-current" />
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-400 mt-3 uppercase tracking-wider">
                            SPAM CLICK PAD
                          </span>
                        </motion.button>
                      )}

                      {/* --- B. Alternating pads (Normal) --- */}
                      {diff.clickMode === "alternate" && (
                        <div className="flex gap-8 z-10 w-full px-6">
                          {/* Left pad */}
                          <motion.button
                            onMouseDown={(e) => handleAlternateClick("left", e)}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 h-44 rounded-3xl border-3 flex flex-col items-center justify-center select-none cursor-pointer ${
                              nextExpectedPad === "left"
                                ? "bg-cyan-500 border-white text-white shadow-md animate-pulse"
                                : "bg-slate-800 border-slate-700 text-slate-500"
                            }`}
                          >
                            <span className="text-sm font-mono font-black uppercase">PAD_L</span>
                          </motion.button>

                          {/* Right pad */}
                          <motion.button
                            onMouseDown={(e) => handleAlternateClick("right", e)}
                            whileTap={{ scale: 0.95 }}
                            className={`flex-1 h-44 rounded-3xl border-3 flex flex-col items-center justify-center select-none cursor-pointer ${
                              nextExpectedPad === "right"
                                ? "bg-cyan-500 border-white text-white shadow-md animate-pulse"
                                : "bg-slate-800 border-slate-700 text-slate-500"
                            }`}
                          >
                            <span className="text-sm font-mono font-black uppercase">PAD_R</span>
                          </motion.button>
                        </div>
                      )}

                      {/* --- C. Moving Targets (Hard) --- */}
                      {diff.clickMode === "moving" && (
                        <div className="absolute inset-0 w-full h-full" onClick={handleMovingMiss}>
                          <motion.button
                            key={score}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            onMouseDown={handleMovingClick}
                            className="absolute w-12 h-12 bg-cyan-500 border-2 border-white rounded-full flex items-center justify-center z-10 cursor-pointer"
                            style={{
                              top: movingTargetPos.top,
                              left: movingTargetPos.left,
                              transform: "translate(-50%, -50%)"
                            }}
                          >
                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          </motion.button>
                        </div>
                      )}

                      {/* --- D. Ascending sequence pads (Professional) --- */}
                      {diff.clickMode === "ascending" && (
                        <div className="flex gap-4 z-10 w-full px-6">
                          {[1, 2, 3].map((num) => (
                            <motion.button
                              key={num}
                              onMouseDown={(e) => handleAscendingClick(num, e)}
                              whileTap={{ scale: 0.95 }}
                              className={`flex-1 h-36 rounded-2xl border-3 flex flex-col items-center justify-center select-none cursor-pointer ${
                                expectedAscendingNum === num
                                  ? "bg-cyan-500 border-white text-white shadow-md animate-pulse"
                                  : "bg-slate-800 border-slate-700 text-slate-500"
                              }`}
                            >
                              <span className="text-2xl font-mono font-black">{num}</span>
                            </motion.button>
                          ))}
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* ── 3. RESULT OVERLAY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode whacking completed.</p>
                        {parseFloat(finalCps) >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {finalCps} CPS!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Final CPS Rate</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{finalCps} CPS</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Target Threshold</div>
                          <div className="text-base text-slate-700 font-mono font-bold">{diff.targetCps} CPS</div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Arena
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setScore(0); }}
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
            {phase === "playing" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("result"); }}
                  className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
