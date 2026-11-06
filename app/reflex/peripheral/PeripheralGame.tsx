"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crosshair, Play, RotateCcw, Trophy, Eye, AlertTriangle,
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
  targetSizePx: number;
  timeLimitSec: number;
  minOffsetPercent: number; // min distance from center (50%, 50%)
  maxOffsetPercent: number; // max distance from center
  missPenaltyScore: number;
  hasFixationDistraction: boolean; // fixation crosshair changes color
  hasCentralCognitiveLoad: boolean; // shows numbers at center (only click on even)
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Close-to-center targets (70px) · 45s timer · No penalties",
    targetSizePx: 70, timeLimitSec: 45, minOffsetPercent: 8, maxOffsetPercent: 22, missPenaltyScore: 0,
    hasFixationDistraction: false, hasCentralCognitiveLoad: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Mid-distance targets (55px) · 30s timer · No penalties",
    targetSizePx: 55, timeLimitSec: 30, minOffsetPercent: 15, maxOffsetPercent: 30, missPenaltyScore: 0,
    hasFixationDistraction: false, hasCentralCognitiveLoad: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Wide-periphery targets (45px) · 30s timer · -50 penalty",
    targetSizePx: 45, timeLimitSec: 30, minOffsetPercent: 22, maxOffsetPercent: 40, missPenaltyScore: 50,
    hasFixationDistraction: false, hasCentralCognitiveLoad: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Extreme periphery (30px) · Fixation color check (Click on red only)",
    targetSizePx: 30, timeLimitSec: 30, minOffsetPercent: 30, maxOffsetPercent: 45, missPenaltyScore: 100,
    hasFixationDistraction: true, hasCentralCognitiveLoad: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Micro targets (22px) · Central digit checks (Click even digits only)",
    targetSizePx: 22, timeLimitSec: 30, minOffsetPercent: 35, maxOffsetPercent: 48, missPenaltyScore: 150,
    hasFixationDistraction: false, hasCentralCognitiveLoad: true,
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
export default function PeripheralGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hitsCount, setHitsCount] = useState(0);
  const [missesCount, setMissesCount] = useState(0);
  const [muted, setMuted] = useState(false);

  // Targets and center state
  const [targetPos, setTargetPos] = useState({ top: "50%", left: "50%" });
  const [centerFixationColor, setCenterFixationColor] = useState("#ef4444"); // Red default
  const [centerFixationDigit, setCenterFixationDigit] = useState(0); // Pro number load

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const distractionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`peripheral-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);
    };
  }, []);

  const moveTarget = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    
    // Choose random angle (radians)
    const angle = Math.random() * Math.PI * 2;
    // Choose random radius offset within config ranges
    const radius = Math.random() * (d.maxOffsetPercent - d.minOffsetPercent) + d.minOffsetPercent;

    // Convert polar coordinates to center-relative screen percentages
    const leftOffset = Math.sin(angle) * radius;
    const topOffset = Math.cos(angle) * radius;

    const left = 50 + leftOffset;
    const top = 50 + topOffset;

    setTargetPos({ top: `${top}%`, left: `${left}%` });

    // Rotate center distraction states
    if (d.hasFixationDistraction) {
      // 70% chance red, 30% chance amber (distraction)
      setCenterFixationColor(Math.random() > 0.3 ? "#ef4444" : "#f59e0b");
    } else {
      setCenterFixationColor("#ef4444");
    }

    if (d.hasCentralCognitiveLoad) {
      // Random digit between 0 and 9
      setCenterFixationDigit(Math.floor(Math.random() * 10));
    }
  }, [diffId]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);

    const d = DIFFICULTIES[diffId];
    setScore(0);
    setTimeLeft(d.timeLimitSec);
    setHitsCount(0);
    setMissesCount(0);
    setPhase("playing");
    playSound("start");
    moveTarget();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);
          playSound("levelUp");
          setPhase("gameover");

          // Save high score
          setHighScores(hs => {
            if (score > hs[diffId]) {
              localStorage.setItem(`peripheral-hs-${diffId}`, score.toString());
              return { ...hs, [diffId]: score };
            }
            return hs;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    // Dynamic rotation of central colors/digits for continuous distraction
    if (d.hasFixationDistraction || d.hasCentralCognitiveLoad) {
      distractionTimerRef.current = setInterval(() => {
        if (d.hasFixationDistraction) {
          setCenterFixationColor(Math.random() > 0.4 ? "#ef4444" : "#f59e0b");
        }
        if (d.hasCentralCognitiveLoad) {
          setCenterFixationDigit(Math.floor(Math.random() * 10));
        }
      }, 1400);
    }
  }, [diffId, playSound, moveTarget, score]);

  const handleTargetClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // prevent matching background miss
    if (phase !== "playing") return;

    // Check cognitive validation rules
    let isCorrect = true;
    if (diff.hasFixationDistraction) {
      // Must not click if fixation is amber (#f59e0b)
      if (centerFixationColor === "#f59e0b") isCorrect = false;
    }

    if (diff.hasCentralCognitiveLoad) {
      // Must click only if center digit is even
      if (centerFixationDigit % 2 !== 0) isCorrect = false;
    }

    if (isCorrect) {
      setHitsCount(h => h + 1);
      setScore(s => s + 100);
      playSound("success");
      moveTarget();
    } else {
      setMissesCount(m => m + 1);
      setScore(s => Math.max(0, s - diff.missPenaltyScore));
      playSound("error");
      moveTarget(); // move anyway to keep loop fresh
    }
  }, [phase, diff, centerFixationColor, centerFixationDigit, playSound, moveTarget]);

  // Clicked empty background
  const handleBoardMiss = useCallback(() => {
    if (phase !== "playing") return;

    // If professional cognitive checks requires ignoring (e.g. odd digit), clicking background is a miss
    setMissesCount(m => m + 1);
    setScore(s => Math.max(0, s - diff.missPenaltyScore));
    playSound("error");
  }, [phase, diff, playSound]);

  const totalClicks = hitsCount + missesCount;
  const accuracyPercent = totalClicks > 0 ? Math.round((hitsCount / totalClicks) * 100) : 100;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">PERIPHERAL</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">LATERAL GAZE CALIBRATION</p>
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
                    onSelect={() => { if (phase === "select" || phase === "gameover") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracyPercent}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Hits/Misses</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1">
                    {hitsCount} <span className="text-slate-500 font-normal">/</span> <span className="text-red-500">{missesCount}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Left</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Record ({diff.label})</div>
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
                GAZE: FIXATED ON CROSSHAIR
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
                          <Eye className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Fixation Gaze Calibration</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Keep your eyes fixed strictly on the center crosshair. Tap target dots in your side peripheral vision.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Gaze
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
                      onClick={handleBoardMiss}
                      className="absolute inset-0 bg-slate-900 border border-slate-850 rounded-[2.2rem] overflow-hidden cursor-crosshair z-20"
                    >
                      {/* Grid crosshair guidelines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:25px_25px]" />

                      {/* Center Fixation Anchor */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute w-20 h-20 border border-slate-700/20 rounded-full animate-[ping_4s_linear_infinite]" />
                          <div className="absolute w-12 h-12 border border-dashed border-slate-700/40 rounded-full animate-[spin_10s_linear_infinite]" />
                          
                          {/* Visual/Cognitive loads displayed inside fixation crosshair */}
                          <div className="flex flex-col items-center justify-center">
                            <Crosshair
                              className="w-10 h-10 drop-shadow-md transition-colors duration-150"
                              style={{ color: centerFixationColor }}
                            />
                            
                            {/* Cognitive load digits (Professional mode) */}
                            {diff.hasCentralCognitiveLoad && (
                              <motion.span
                                key={centerFixationDigit}
                                initial={{ scale: 0.7 }}
                                animate={{ scale: 1 }}
                                className="absolute font-mono font-black text-sm text-white"
                              >
                                {centerFixationDigit}
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Lateral target dot */}
                      <motion.button
                        key={score}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute bg-cyan-500 rounded-full border border-white active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center z-40"
                        style={{
                          width: `${diff.targetSizePx}px`,
                          height: `${diff.targetSizePx}px`,
                          top: targetPos.top,
                          left: targetPos.left,
                          transform: "translate(-50%, -50%)",
                        }}
                        onMouseDown={handleTargetClick}
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">SESSION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode calibration completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Final score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Hits / Accuracy</div>
                          <div className="text-base text-slate-700 font-mono font-bold">{hitsCount} hits ({accuracyPercent}%)</div>
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
                  onClick={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    if (distractionTimerRef.current) clearInterval(distractionTimerRef.current);
                    setPhase("gameover");
                  }}
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
