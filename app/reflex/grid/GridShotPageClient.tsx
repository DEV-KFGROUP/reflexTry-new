"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Crosshair, Flame, Play, RotateCcw, Shield, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
  targetSizePx: number;
  timeLimitSec: number;
  simultaneousTargets: number;
  missPenaltyScore: number;
  hasTargetExpiry: boolean;
  targetLifespanMs: number; // auto-hide time
  isFloatingTarget: boolean; // dynamic floating targets
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Large targets (70px) · 45s timer · 1 target · No penalty",
    targetSizePx: 70, timeLimitSec: 45, simultaneousTargets: 1, missPenaltyScore: 0,
    hasTargetExpiry: false, targetLifespanMs: 0, isFloatingTarget: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Medium-large targets (55px) · 30s · 1 target · No penalty",
    targetSizePx: 55, timeLimitSec: 30, simultaneousTargets: 1, missPenaltyScore: 0,
    hasTargetExpiry: false, targetLifespanMs: 0, isFloatingTarget: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard (45px) · 30s · 2 targets simultaneously · -50 penalty",
    targetSizePx: 45, timeLimitSec: 30, simultaneousTargets: 2, missPenaltyScore: 50,
    hasTargetExpiry: false, targetLifespanMs: 0, isFloatingTarget: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Small (32px) · 3 targets simultaneously · 2s lifespan · -100 penalty",
    targetSizePx: 32, timeLimitSec: 30, simultaneousTargets: 3, missPenaltyScore: 100,
    hasTargetExpiry: true, targetLifespanMs: 2000, isFloatingTarget: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Micro (22px) · 4 targets · 1.2s lifespan · Jitter tracking · -150 penalty",
    targetSizePx: 22, timeLimitSec: 30, simultaneousTargets: 4, missPenaltyScore: 150,
    hasTargetExpiry: true, targetLifespanMs: 1200, isFloatingTarget: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface ActiveTarget {
  id: number;
  top: number; // percentage
  left: number; // percentage
  spawnTime: number;
  offsetY: number; // floating offset
  offsetX: number;
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
export default function GridShotPageClient() {
  const { setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hitsCount, setHitsCount] = useState(0);
  const [missesCount, setMissesCount] = useState(0);
  const [muted, setMuted] = useState(false);

  // Active targets list
  const [targets, setTargets] = useState<ActiveTarget[]>([]);
  const targetIdRef = useRef(0);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const animationRef = useRef<number | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_gridshot-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Helper to spawn a new target
  const spawnNewTarget = useCallback(() => {
    const top = Math.floor(Math.random() * 70) + 15; // 15% to 85%
    const left = Math.floor(Math.random() * 70) + 15;
    targetIdRef.current++;
    const newTarget: ActiveTarget = {
      id: targetIdRef.current,
      top,
      left,
      spawnTime: performance.now(),
      offsetX: 0,
      offsetY: 0
    };
    return newTarget;
  }, []);

  // Jitter tracking for Professional mode
  const animateFloatingTargets = useLatestCallback(() => {
    if (phase !== "playing") return;

    setTargets(prev =>
      prev.map(t => {
        if (!diff.isFloatingTarget) return t;
        // Apply tiny floating sinusoidal movement
        const timeFactor = performance.now() * 0.005 + t.id * 10;
        const offsetX = Math.sin(timeFactor) * 1.5;
        const offsetY = Math.cos(timeFactor) * 1.5;
        return { ...t, offsetX, offsetY };
      })
    );

    // Lifespan expiry checks
    if (diff.hasTargetExpiry) {
      const now = performance.now();
      setTargets(prev => {
        const active = prev.filter(t => {
          const isExpired = now - t.spawnTime >= diff.targetLifespanMs;
          if (isExpired) {
            // Trigger score penalty for expired target
            setScore(s => Math.max(0, s - diff.missPenaltyScore));
            setMissesCount(m => m + 1);
            playSound("error");
          }
          return !isExpired;
        });

        // Refill back to configured simultaneous target count
        while (active.length < diff.simultaneousTargets) {
          active.push(spawnNewTarget());
        }
        return active;
      });
    }

    animationRef.current = requestAnimationFrame(animateFloatingTargets);
  });

  // Launch animation loop
  useEffect(() => {
    if (phase === "playing") {
      animationRef.current = requestAnimationFrame(animateFloatingTargets);
    } else {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [phase, animateFloatingTargets]);

  const startGame = useCallback(() => {
    cancelTimers();
    if (timerRef.current) clearInterval(timerRef.current);
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setTimeLeft(d.timeLimitSec);
    setHitsCount(0);
    setMissesCount(0);
    setPhase("playing");
    playSound("start");

    // Spawn initial pool of targets
    const initialPool: ActiveTarget[] = [];
    for (let i = 0; i < d.simultaneousTargets; i++) {
      initialPool.push(spawnNewTarget());
    }
    setTargets(initialPool);

    timerRef.current = (() => { const deadline = performance.now() + (diff.timeLimitSec) * 1000; return setInterval(() => {
      const remaining = Math.max(0, (deadline - performance.now()) / 1000);
      setTimeLeft(Math.ceil(remaining));
      if (remaining === 0) { clearInterval(timerRef.current!);
playSound("levelUp");
setPhase("gameover"); }
    }, 50); })();
  }, [diffId, playSound, spawnNewTarget, score]);

  const handleHit = useCallback((targetId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent registering a miss on the board wrapper
    if (phase !== "playing") return;

    setHitsCount(h => h + 1);
    setScore(s => s + 100);
    playSound("success");

    // Replace matched target
    setTargets(prev => {
      const remaining = prev.filter(t => t.id !== targetId);
      while (remaining.length < diff.simultaneousTargets) {
        remaining.push(spawnNewTarget());
      }
      return remaining;
    });
  }, [phase, diff, spawnNewTarget, playSound]);

  // Clicked empty board background = miss
  const handleBoardMiss = useCallback(() => {
    if (phase !== "playing") return;
    setMissesCount(m => m + 1);
    setScore(s => Math.max(0, s - diff.missPenaltyScore));
    playSound("error");
  }, [phase, diff, playSound]);

  const totalClicks = hitsCount + missesCount;
  const accuracyPercent = totalClicks > 0 ? Math.round((hitsCount / totalClicks) * 100) : 100;


  const progress = useToolProgress({
    toolId: "grid-shot", phase: phase, difficulty: diffId,
    value: score, unit: "pts", higherIsBetter: true,
    terminal: ["gameover"], idle: ["select"], recordKey: "reflextry_v2_gridshot-hs-",
    setHighScores, cancelTimers, reset: () => setPhase("select"),
    eligible: true,
  });

  return (
    <div data-idle={phase === "select"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/reflex/grid" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Grid Shot</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">TARGET ACQUISITION ARENA</p>
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
                    onSelect={() => { if (phase === "select" || phase === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
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
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Hits/Misses</div>
                  <div className="text-sm font-mono font-bold text-[#161614] mt-1">
                    {hitsCount} <span className="text-[#78756C] font-normal">/</span> <span className="text-red-500">{missesCount}</span>
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Time Left</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-[#161614]"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Record ({diff.label})</div>
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
                POOL: {diff.simultaneousTargets} TARGETS
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="game-start-icon relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Crosshair className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Target Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Test your clicking speed and precision. Click the target dots as fast as you can. Avoid missing!
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
                  {phase === "playing" && (
                    <motion.div
                      key="playing"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                      onPointerDown={handleBoardMiss}
                      className="absolute inset-0 bg-slate-900 border border-slate-850 rounded-[2.2rem] overflow-hidden cursor-crosshair z-20"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:25px_25px]" />

                      {/* Display targets */}
                      {targets.map(t => (
                        <motion.button
                          key={t.id}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="absolute bg-cyan-500 rounded-full border border-white active:scale-95 shadow-[0_0_12px_rgba(6,182,212,0.4)] flex items-center justify-center z-30"
                          style={{
                            width: `${diff.targetSizePx}px`,
                            height: `${diff.targetSizePx}px`,
                            top: `calc(${t.top}% + ${t.offsetY}px)`,
                            left: `calc(${t.left}% + ${t.offsetX}px)`,
                            translate: "-50% -50%",
                          }}
                          aria-label="Grid target"
                          onPointerDown={e => handleHit(t.id, e)}
                          onClick={e => { if (e.detail === 0) handleHit(t.id, e); }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">SESSION_COMPLETE</div>
                        <p className="text-xs font-mono text-[#78756C]">{diff.label} mode calibration completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Final score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Hits / Accuracy</div>
                          <div className="text-base text-[#3F3E39] font-mono font-bold">{hitsCount} hits ({accuracyPercent}%)</div>
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
                <button onClickCapture={() => window.dispatchEvent(new Event("game_abort_requested"))}
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("gameover"); }}
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
