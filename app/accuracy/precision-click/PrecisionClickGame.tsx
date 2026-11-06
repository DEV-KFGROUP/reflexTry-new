"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Target, MousePointer2
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
  initialSize: number;
  lifetimeMs: number;
  maxConcurrentTargets: number;
  maxMistakesAllowed: number;
  hasJitter: boolean;
  hasDrift: boolean;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Large targets (65px) · 2.5s lifetime · Static placement · No strike limits",
    initialSize: 65, lifetimeMs: 2500, maxConcurrentTargets: 1, maxMistakesAllowed: 999, hasJitter: false, hasDrift: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Medium-large (52px) · 1.8s lifetime · Static placement · No strike limits",
    initialSize: 52, lifetimeMs: 1850, maxConcurrentTargets: 1, maxMistakesAllowed: 999, hasJitter: false, hasDrift: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard targets (45px) · 1.2s lifetime · Up to 2 active targets · 6 lives limit",
    initialSize: 45, lifetimeMs: 1250, maxConcurrentTargets: 2, maxMistakesAllowed: 6, hasJitter: false, hasDrift: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Small targets (32px) · 850ms lifetime · Jittering vibrations · 4 lives limit",
    initialSize: 32, lifetimeMs: 850, maxConcurrentTargets: 3, maxMistakesAllowed: 4, hasJitter: true, hasDrift: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Tiny targets (20px) · 600ms lifetime · Moving drift targets · 3 lives limit",
    initialSize: 20, lifetimeMs: 600, maxConcurrentTargets: 4, maxMistakesAllowed: 3, hasJitter: true, hasDrift: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface TargetItem {
  id: number;
  x: number; // absolute horizontal position in px
  y: number; // absolute vertical position in px
  size: number;
  appearedAt: number;
  lifetime: number;
  vx: number; // horizontal drift speed
  vy: number; // vertical drift speed
  jitterX: number; // temporary offset
  jitterY: number;
}

const GAME_DURATION = 30;

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
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} hits</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PrecisionClickGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [muted, setMuted] = useState(false);

  const [targets, setTargets] = useState<TargetItem[]>([]);
  const targetsRef = useRef<TargetItem[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const targetIdRef = useRef(0);
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const gameTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const v = localStorage.getItem(`precision-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const spawnTarget = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const d = DIFFICULTIES[diffId];

    // Decreasing target size progressively based on score
    const size = Math.max(10, d.initialSize - score * 0.35);
    const padding = size * 1.5;

    const x = Math.random() * (rect.width - padding * 2) + padding;
    const y = Math.random() * (rect.height - padding * 2) + padding;

    const angle = Math.random() * Math.PI * 2;
    const speed = d.hasDrift ? 85 + Math.random() * 85 : 0;

    targetIdRef.current++;
    const newTarget: TargetItem = {
      id: targetIdRef.current,
      x,
      y,
      size,
      appearedAt: Date.now(),
      lifetime: Math.max(450, d.lifetimeMs - score * 8),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      jitterX: 0,
      jitterY: 0
    };

    targetsRef.current.push(newTarget);
    setTargets([...targetsRef.current]);
  }, [diffId, score]);

  const stopGame = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);

    playSound("success");
    setPhase("result");

    // Save high score
    setHighScores(hs => {
      if (score > hs[diffId]) {
        localStorage.setItem(`precision-hs-${diffId}`, score.toString());
        return { ...hs, [diffId]: score };
      }
      return hs;
    });
  }, [diffId, score, playSound]);

  const updateLoop = useCallback((time: number) => {
    if (phase !== "playing") return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTimeMillis = time - lastTimeRef.current;
    const dt = deltaTimeMillis / 1000;
    lastTimeRef.current = time;

    const container = containerRef.current;
    if (!container) {
      requestRef.current = requestAnimationFrame(updateLoop);
      return;
    }

    const { width, height } = container.getBoundingClientRect();
    const d = DIFFICULTIES[diffId];

    // 1. Filter out expired targets
    const now = Date.now();
    const active = targetsRef.current.filter(t => {
      if (now - t.appearedAt >= t.lifetime) {
        // Strike miss penalty
        playSound("error");
        setMisses(m => {
          const nextM = m + 1;
          if (nextM >= d.maxMistakesAllowed) {
            stopGame();
          }
          return nextM;
        });
        return false;
      }
      return true;
    });

    // 2. Drift moving physics
    active.forEach(t => {
      if (d.hasDrift) {
        t.x += t.vx * dt;
        t.y += t.vy * dt;

        // Bounce boundaries
        const radius = t.size / 2;
        if (t.x - radius < 0) { t.x = radius; t.vx *= -1; }
        if (t.x + radius > width) { t.x = width - radius; t.vx *= -1; }
        if (t.y - radius < 0) { t.y = radius; t.vy *= -1; }
        if (t.y + radius > height) { t.y = height - radius; t.vy *= -1; }
      }

      // 3. Jitter vibration offset
      if (d.hasJitter) {
        t.jitterX = (Math.random() - 0.5) * 4.5;
        t.jitterY = (Math.random() - 0.5) * 4.5;
      } else {
        t.jitterX = 0;
        t.jitterY = 0;
      }
    });

    targetsRef.current = active;

    // 4. Fill active targets up to max concurrent
    if (targetsRef.current.length < d.maxConcurrentTargets) {
      // Small spawn chance on frames to stagger entry
      if (Math.random() < 0.08) {
        spawnTarget();
      }
    }

    setTargets([...targetsRef.current]);
    requestRef.current = requestAnimationFrame(updateLoop);
  }, [phase, diffId, spawnTarget, playSound, stopGame]);

  const handleTargetClick = useCallback((targetId: number) => {
    if (phase !== "playing") return;

    // Remove hit target
    const initialLen = targetsRef.current.length;
    targetsRef.current = targetsRef.current.filter(t => t.id !== targetId);

    if (targetsRef.current.length < initialLen) {
      setScore(s => s + 1);
      playSound("click");
      // Instant replenish
      spawnTarget();
    }
  }, [phase, spawnTarget, playSound]);

  const handleBackgroundMiss = useCallback(() => {
    if (phase !== "playing") return;
    playSound("error");
    setMisses(m => {
      const nextM = m + 1;
      if (nextM >= diff.maxMistakesAllowed) {
        stopGame();
      }
      return nextM;
    });
  }, [phase, diff, playSound, stopGame]);

  const startGame = useCallback(() => {
    setScore(0);
    setMisses(0);
    setTimeLeft(GAME_DURATION);
    targetsRef.current = [];
    setTargets([]);
    targetIdRef.current = 0;
    lastTimeRef.current = 0;
    setPhase("playing");
    playSound("start");

    // Spawn first target
    setTimeout(() => spawnTarget(), 100);

    // Ticking countdown timer
    if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    gameTimerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          stopGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    setTimeout(() => {
      requestRef.current = requestAnimationFrame(updateLoop);
    }, 150);

  }, [spawnTarget, updateLoop, playSound, stopGame]);

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (gameTimerRef.current) clearInterval(gameTimerRef.current);
    };
  }, []);

  const totalClicks = score + misses;
  const accuracy = totalClicks > 0 ? Math.round((score / totalClicks) * 100) : 100;
  const clicksPerSecond = (GAME_DURATION - timeLeft) > 0 ? score / (GAME_DURATION - timeLeft) : 0;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">PRECISION CLICK</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">SNAP CLICK CALIBRATION</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">Total Hits</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracy}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Errors / Limit</div>
                  <div className="text-sm font-mono font-bold text-red-505 mt-1.5 animate-pulse">
                    {diff.maxMistakesAllowed === 999 ? `${misses}/∞` : `${misses}/${diff.maxMistakesAllowed}`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Hits ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} hits</div>
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
                TARGET DRIFT: {diff.hasDrift ? "ACTIVE" : "FALSE"}
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
                          <MousePointer2 className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Precision Click</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Test fine motor cursor positioning. Click target nodes. Pro presets trigger high frequency vibrating and drifting targets.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Precision Deck
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
                      className="absolute inset-0 w-full h-full flex flex-col justify-between"
                    >
                      <div
                        ref={containerRef}
                        onClick={handleBackgroundMiss}
                        className="flex-1 w-full relative bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden cursor-crosshair shadow-inner"
                      >
                        {/* Grid guides */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                        <AnimatePresence>
                          {targets.map(t => {
                            const renderX = t.x + t.jitterX;
                            const renderY = t.y + t.jitterY;

                            return (
                              <motion.button
                                key={t.id}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleTargetClick(t.id);
                                }}
                                className="absolute cursor-pointer rounded-full bg-cyan-500 border-4 border-white shadow-[0_0_12px_rgba(6,182,212,0.65)] flex items-center justify-center outline-none focus:outline-none hover:scale-105 active:scale-95"
                                style={{
                                  left: `${renderX}px`,
                                  top: `${renderY}px`,
                                  width: `${t.size}px`,
                                  height: `${t.size}px`,
                                  transform: "translate(-50%, -50%)"
                                }}
                              >
                                <Target className="w-[60%] h-[60%] text-white" />
                              </motion.button>
                            );
                          })}
                        </AnimatePresence>
                      </div>

                      <div className="mt-2 text-center text-xs font-mono text-slate-600 dark:text-slate-400 select-none">
                        TARGETS ON SCREEN: {targets.length} | CLICKS RATE: {clicksPerSecond.toFixed(1)}/s
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} precision click sequence complete.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} hits!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Total Hits</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score} hits</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Accuracy Rating</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{accuracy}% Acc</div>
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
                  onClick={stopGame}
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
