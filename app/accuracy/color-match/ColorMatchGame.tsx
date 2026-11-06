"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Palette, Lock, AlertTriangle
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
  snapInterval: number; // snap sliders to multiples of this
  showNumbers: boolean; // display numeric RGB values
  timeLimitSec?: number;
  flashDurationMs?: number; // target color hides after this duration
  hasOverlay: boolean; // scanline overlay on User color
  penaltyMultiplier: number;
  minPointsThreshold: number;
  maxMistakesAllowed: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "32-step snaps · Numeric labels shown · Static view · No timers",
    snapInterval: 32, showNumbers: true, hasOverlay: false,
    penaltyMultiplier: 1.0, minPointsThreshold: 0, maxMistakesAllowed: 999,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "16-step snaps · Numeric labels shown · Static view · No timers",
    snapInterval: 16, showNumbers: true, hasOverlay: false,
    penaltyMultiplier: 1.25, minPointsThreshold: 0, maxMistakesAllowed: 999,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Smooth sliders · Numeric labels hidden · 30s timer · Strikes on scores < 75",
    snapInterval: 1, showNumbers: false, hasOverlay: false, timeLimitSec: 30,
    penaltyMultiplier: 1.5, minPointsThreshold: 75, maxMistakesAllowed: 3,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Smooth · Target flashes for 1.5s then hides · 15s timer · Strikes on < 80",
    snapInterval: 1, showNumbers: false, hasOverlay: false, timeLimitSec: 15, flashDurationMs: 1500,
    penaltyMultiplier: 1.75, minPointsThreshold: 80, maxMistakesAllowed: 3,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Smooth · 0.8s flash · Visual scanline overlay · 8s timer · Strikes on < 85",
    snapInterval: 1, showNumbers: false, hasOverlay: true, timeLimitSec: 8, flashDurationMs: 800,
    penaltyMultiplier: 2.0, minPointsThreshold: 85, maxMistakesAllowed: 2,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];
const TOTAL_ROUNDS = 10;

function randomColor(): [number, number, number] {
  return [
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
    Math.floor(Math.random() * 256),
  ];
}

function colorDiff(c1: [number, number, number], c2: [number, number, number]): number {
  return Math.sqrt(
    Math.pow(c1[0] - c2[0], 2) +
    Math.pow(c1[1] - c2[1], 2) +
    Math.pow(c1[2] - c2[2], 2)
  );
}

function toHex(c: [number, number, number]): string {
  return `#${c.map(v => v.toString(16).padStart(2, "0")).join("")}`;
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
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
export default function ColorMatchGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result" | "failed">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [muted, setMuted] = useState(false);

  const [target, setTarget] = useState<[number, number, number]>([128, 128, 128]);
  const [userColor, setUserColor] = useState<[number, number, number]>([128, 128, 128]);
  const [showTargetColor, setShowTargetColor] = useState(true);
  const [scores, setScores] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<{ diff: number; points: number; correct: [number, number, number] } | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`color-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateRound = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setTarget(randomColor());
    setUserColor([128, 128, 128]);
    setShowTargetColor(true);
    setFeedback(null);

    // Flash timing trigger
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    if (d.flashDurationMs) {
      flashTimerRef.current = setTimeout(() => {
        setShowTargetColor(false);
        playSound("error"); // alert warning sound of lock
      }, d.flashDurationMs);
    }

    // Round countdown timer
    if (timerRef.current) clearInterval(timerRef.current);
    if (d.timeLimitSec) {
      setTimeLeft(d.timeLimitSec);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            submitAnswer(); // Auto submit current values
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
  }, [diffId, playSound]);

  const startGame = useCallback(() => {
    setRound(0);
    setMistakes(0);
    setScores([]);
    setFeedback(null);
    setPhase("playing");
    playSound("start");

    // Defer loading target to ensure state resets
    setTimeout(() => generateRound(), 50);
  }, [playSound, generateRound]);

  const submitAnswer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (flashTimerRef.current) clearTimeout(flashTimerRef.current);

    // Final calculation
    setShowTargetColor(true); // reveal correct target
    const diffVal = Math.round(colorDiff(target, userColor));
    const maxDiff = 441; // sqrt(255^2 * 3)
    const points = Math.max(0, Math.round(100 * (1 - (diffVal * diff.penaltyMultiplier) / maxDiff)));
    const newScores = [...scores, points];
    setScores(newScores);

    setFeedback({ diff: diffVal, points, correct: target });

    if (points >= diff.minPointsThreshold) {
      playSound(points >= 88 ? "success" : "click");
    } else {
      playSound("error");
      setMistakes(m => {
        const nextM = m + 1;
        if (nextM >= diff.maxMistakesAllowed) {
          setTimeout(() => {
            setPhase("failed");
            playSound("levelUp");
          }, 1400);
        }
        return nextM;
      });
    }

    setRound(r => r + 1);

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound < TOTAL_ROUNDS && mistakes < diff.maxMistakesAllowed) {
        generateRound();
      } else if (mistakes < diff.maxMistakesAllowed) {
        setPhase("result");
        playSound("levelUp");

        // Save high score
        setHighScores(hs => {
          const finalAvg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
          if (finalAvg > hs[diffId]) {
            localStorage.setItem(`color-hs-${diffId}`, finalAvg.toString());
            return { ...hs, [diffId]: finalAvg };
          }
          return hs;
        });
      }
    }, 1450);

  }, [target, userColor, scores, round, diff, mistakes, playSound, generateRound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
    };
  }, []);

  const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">COLOR MATCH</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">CHROMATIC SPECTRUM CALIBRATION</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result" || phase === "failed") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Average Points</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{avgScore} pts</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Visual Lock</div>
                  <div className="text-xs font-mono font-bold text-slate-850 mt-1.5 uppercase">
                    {diff.flashDurationMs ? `${diff.flashDurationMs}ms Flash` : "Static View"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5 animate-pulse">
                    {diff.maxMistakesAllowed === 999 ? "∞" : `${diff.maxMistakesAllowed - mistakes} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Round Progress</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Average ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} pts</div>
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
                SNAP STEPS: {diff.snapInterval === 1 ? "SMOOTH" : `${diff.snapInterval}-STEP`}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Palette className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Color Match</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Match target color tones using RGB sliders. Pro difficulty limits time, hides slider numbers, and flashes target colors briefly in visual memory.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Palette className="w-4 h-4 fill-current" />
                          Initialize Spectrum Deck
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
                      className="text-center w-full max-w-md flex flex-col items-center space-y-6"
                    >
                      {/* Round timer countdown bar */}
                      {diff.timeLimitSec && !feedback && (
                        <div className="w-full max-w-xs flex flex-col items-center">
                          <div className="flex justify-between w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                            <span>CHROMATIC STABILITY TIME</span>
                            <span className={timeLeft <= 2 ? "text-red-500 font-bold" : ""}>{timeLeft}s</span>
                          </div>
                          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200 shadow-inner">
                            <div
                              className={`h-full transition-all duration-700 ${
                                timeLeft <= 2 ? "bg-red-500 animate-pulse" : "bg-cyan-500"
                              }`}
                              style={{ width: `${(timeLeft / diff.timeLimitSec) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Color circles panel */}
                      <div className="flex gap-8 justify-center">
                        <div className="text-center space-y-2">
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-widest">Target Color</p>
                          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-[2rem] border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden flex items-center justify-center bg-slate-200 transition-colors duration-300">
                            {showTargetColor ? (
                              <div className="absolute inset-0" style={{ backgroundColor: toHex(target) }} />
                            ) : (
                              <div className="absolute inset-0 bg-slate-300 dark:bg-slate-800 flex flex-col items-center justify-center text-slate-800 dark:text-slate-200 font-mono text-xs uppercase tracking-wider gap-1">
                                <Lock className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                                Memory Locked
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-center space-y-2">
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 font-mono uppercase tracking-widest">User Mix</p>
                          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-[2rem] border border-slate-200 shadow-[0_4px_16px_rgba(0,0,0,0.06)] overflow-hidden">
                            <div className="absolute inset-0" style={{ backgroundColor: toHex(userColor) }} />
                            {diff.hasOverlay && (
                              /* Professional overlay screen grid mask */
                              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:6px_6px] pointer-events-none opacity-40 mix-blend-overlay" />
                            )}
                          </div>
                        </div>
                      </div>

                      <AnimatePresence mode="wait">
                        {feedback ? (
                          <motion.div
                            key="feedback"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="h-44 flex flex-col items-center justify-center space-y-1.5"
                          >
                            <p className={`text-2xl font-mono font-black uppercase tracking-wider ${
                              feedback.points >= diff.minPointsThreshold ? "text-cyan-600" : "text-red-500"
                            }`}>
                              {feedback.points >= 90 ? "🎯 EXCELLENT MATCH!" : feedback.points >= diff.minPointsThreshold ? "👍 ACCURATE!" : "😬 STRIKE OUT!"}
                            </p>
                            <p className="text-slate-600 dark:text-slate-400 text-xs font-mono">
                              Target HEX: <span className="text-slate-800 font-bold uppercase">{toHex(feedback.correct)}</span> | Mix: <span className="text-slate-850 font-bold uppercase">{toHex(userColor)}</span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">Spectrum Offset distance: {feedback.diff} | Received {feedback.points} pts</p>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="sliders"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full flex flex-col items-center space-y-3 h-44"
                          >
                            {/* Sliders */}
                            <div className="space-y-2 w-full">
                              {[
                                { label: "Red", idx: 0, color: "accent-red-500", labelColor: "text-red-500" },
                                { label: "Green", idx: 1, color: "accent-emerald-500", labelColor: "text-emerald-600" },
                                { label: "Blue", idx: 2, color: "accent-blue-500", labelColor: "text-blue-500" },
                              ].map(({ label, idx, color, labelColor }) => (
                                <div key={label} className="flex items-center gap-3">
                                  <span className={`text-[10px] font-mono font-bold w-10 text-left ${labelColor}`}>{label}</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={255}
                                    step={diff.snapInterval}
                                    value={userColor[idx]}
                                    onChange={e => {
                                      const newColor = [...userColor] as [number, number, number];
                                      newColor[idx] = Number(e.target.value);
                                      setUserColor(newColor);
                                    }}
                                    className={`flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-ew-resize ${color}`}
                                  />
                                  <span className="text-xs font-mono text-slate-600 dark:text-slate-400 w-8 text-right">
                                    {diff.showNumbers ? userColor[idx] : "??"}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Tactile Submit Button */}
                            <div className="relative w-full max-w-xs h-10 mt-1">
                              <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1 border-b-2 border-black/25" />
                              <button
                                onClick={submitAnswer}
                                className="absolute inset-0 w-full rounded-xl bg-cyan-500 border border-cyan-400 text-white font-mono font-bold tracking-widest text-xs shadow-md flex items-center justify-center hover:brightness-105 active:translate-y-1 cursor-pointer py-2.5"
                              >
                                Submit Spectrum
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {/* ── 3. SUCCESS SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_SUCCESS</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} average chromatic calibration complete.</p>
                        {avgScore >= highScores[diffId] && avgScore > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {avgScore} avg!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Average Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{avgScore} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Highest Average</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{highScores[diffId]} pts</div>
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
                          onClick={() => { setPhase("idle"); }}
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

                  {/* ── 4. FAILED SCREEN ── */}
                  {phase === "failed" && (
                    <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIBRATION_FAILED</div>
                        <p className="text-xs font-mono text-slate-500">Too many estimates below threshold. Color match failed.</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Rounds Finished</div>
                          <div className="text-2xl text-slate-800 font-mono font-bold">{round}/{TOTAL_ROUNDS}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Average Points</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{avgScore} pts</div>
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
                          onClick={() => { setPhase("idle"); }}
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
                  onClick={() => setPhase("idle")}
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
