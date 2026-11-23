"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flame, Play, RotateCcw, Shield, ShieldAlert, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
type BulletType = "normal" | "homing" | "pulse";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  initialSpawnIntervalMs: number;
  baseSpeed: number;
  initialLives: number;
  hasHoming: boolean;
  hasPulse: boolean;
  timeLimitSec?: number; // Beginner uses time limit instead of sudden death
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Slow spawn · Fixed 45s trial duration · Unlimited lives (hit counter)",
    initialSpawnIntervalMs: 1400, baseSpeed: 100, initialLives: 999, hasHoming: false, hasPulse: false, timeLimitSec: 45,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Moderate speed · 5 lives limit · Survive as long as possible",
    initialSpawnIntervalMs: 950, baseSpeed: 135, initialLives: 5, hasHoming: false, hasPulse: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard speed · 1 life limit (Sudden Death) · Fast acceleration",
    initialSpawnIntervalMs: 650, baseSpeed: 180, initialLives: 1, hasHoming: false, hasPulse: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Fast speed · Yellow homing missiles chase your cursor · 1 life limit",
    initialSpawnIntervalMs: 480, baseSpeed: 230, initialLives: 1, hasHoming: true, hasPulse: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Ultra speed · Homing missiles + Purple expanding pulse bombs · 1 life",
    initialSpawnIntervalMs: 340, baseSpeed: 290, initialLives: 1, hasHoming: true, hasPulse: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface Projectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: BulletType;
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
      className={`relative w-full min-h-[56px] text-left rounded-2xl border-2 p-3.5 transition-all focus:outline-none overflow-hidden touch-manipulation ${
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
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore.toFixed(2)}s</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function EndlessDodgeClient() {
  const { setTimeout, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [survivalTime, setSurvivalTime] = useState(0);
  const [lives, setLives] = useState(1);
  const [hitsCount, setHitsCount] = useState(0); // For beginner hit counts
  const [muted, setMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Projectiles
  const [renderProjectiles, setRenderProjectiles] = useState<Projectile[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);

  // Physics refs
  const mousePosRef = useRef({ x: 0, y: 0 });
  const [mousePosState, setMousePosState] = useState({ x: 0, y: 0 });
  const cursorSize = 18;
  const positionInitialized = useRef(false);

  const difficultyMultiplierRef = useRef(1.0);
  const projectileIdRef = useRef(0);
  const startTimeRef = useRef(0);
  const lastTimeRef = useRef(0);
  const nextSpawnTimeRef = useRef(0);
  const requestRef = useRef<number>(0);

  const diff = DIFFICULTIES[diffId];

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_dodge-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const spawnProjectile = useLatestCallback((width: number, height: number) => {
    const side = Math.floor(Math.random() * 4); // 0: top, 1: right, 2: bottom, 3: left
    let x = 0, y = 0, vx = 0, vy = 0;

    // Speeds scale with multiplier
    const speed = diff.baseSpeed * difficultyMultiplierRef.current * (0.85 + Math.random() * 0.3);
    const size = 10 + Math.random() * 18; // 10px to 28px

    // Determine bullet type (homing, expanding pulse, or normal)
    let type: BulletType = "normal";
    if (diff.hasPulse && Math.random() < 0.12) {
      type = "pulse";
    } else if (diff.hasHoming && Math.random() < 0.2) {
      type = "homing";
    }

    const startOffset = type === "pulse" ? 40 : size;

    switch (side) {
      case 0: // top
        x = Math.random() * width;
        y = -startOffset;
        vx = (Math.random() - 0.5) * speed;
        vy = speed;
        break;
      case 1: // right
        x = width + startOffset;
        y = Math.random() * height;
        vx = -speed;
        vy = (Math.random() - 0.5) * speed;
        break;
      case 2: // bottom
        x = Math.random() * width;
        y = height + startOffset;
        vx = (Math.random() - 0.5) * speed;
        vy = -speed;
        break;
      case 3: // left
        x = -startOffset;
        y = Math.random() * height;
        vx = speed;
        vy = (Math.random() - 0.5) * speed;
        break;
    }

    projectilesRef.current.push({
      id: projectileIdRef.current++,
      x,
      y,
      vx,
      vy,
      size: type === "pulse" ? 40 : size,
      type
    });
  });

  const stopGame = useLatestCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    playSound("error");
    setPhase("result");

    const elapsedSecs = totalTrackedTimeRef();
  });

  const checkCollision = useCallback((px: number, py: number) => {
    const hitRadius = cursorSize / 2;
    for (const p of projectilesRef.current) {
      const dx = px - p.x;
      const dy = py - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < hitRadius + p.size / 2) {
        // Return collision target id
        return p;
      }
    }
    return null;
  }, [cursorSize]);

  const totalTrackedTimeRef = () => {
    if (startTimeRef.current === 0) return 0;
    return (lastTimeRef.current - startTimeRef.current) / 1000;
  };

  const updateLoop = useLatestCallback((time: number) => {
    if (phase !== "playing") return;

    if (!startTimeRef.current) {
      startTimeRef.current = time;
      lastTimeRef.current = time;
    }

    const deltaTimeMillis = Math.min(50, Math.max(0, time - lastTimeRef.current));
    const deltaTime = deltaTimeMillis / 1000;
    lastTimeRef.current = time;

    const elapsed = time - startTimeRef.current;
    setSurvivalTime(elapsed);

    // Beginner limit check
    if (diff.timeLimitSec && elapsed >= diff.timeLimitSec * 1000) {
      stopGame();
      return;
    }

    const container = containerRef.current;
    if (!container) {
      requestRef.current = requestAnimationFrame(updateLoop);
      return;
    }

    const { width, height } = container.getBoundingClientRect();
    if (!positionInitialized.current) {
      mousePosRef.current = { x: width / 2, y: height / 2 };
      setMousePosState(mousePosRef.current);
      positionInitialized.current = true;
    }

    // Spawn logic
    if (time > nextSpawnTimeRef.current) {
      spawnProjectile(width, height);
      // Spawn interval accelerates over time
      const spawnInterval = Math.max(80, diff.initialSpawnIntervalMs / difficultyMultiplierRef.current);
      nextSpawnTimeRef.current = time + spawnInterval;
    }

    // Difficulty multiplier scales
    difficultyMultiplierRef.current = 1 + elapsed / 7000; // increases every 7 seconds

    // Move projectiles
    projectilesRef.current.forEach(p => {
      if (p.type === "homing") {
        // Homing bullet chases mouse position slowly
        const dx = mousePosRef.current.x - p.x;
        const dy = mousePosRef.current.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const chaseSpeed = diff.baseSpeed * difficultyMultiplierRef.current * 0.45;
          // Interpolate current velocities towards target direction
          const blend = 1 - Math.exp(-3 * deltaTime);
          p.vx += ((dx / dist) * chaseSpeed - p.vx) * blend;
          p.vy += ((dy / dist) * chaseSpeed - p.vy) * blend;
        }
      } else if (p.type === "pulse") {
        // Expanding pulse bombs grow up to 70px
        p.size = Math.min(75, p.size + 15 * deltaTime);
      }

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;
    });

    // Remove off-screen bullets
    projectilesRef.current = projectilesRef.current.filter(
      p => p.x > -150 && p.x < width + 150 && p.y > -150 && p.y < height + 150
    );

    // Render pass
    setRenderProjectiles([...projectilesRef.current]);

    // Collision check
    const hitObj = checkCollision(mousePosRef.current.x, mousePosRef.current.y);
    if (hitObj) {
      // Remove hit bullet
      projectilesRef.current = projectilesRef.current.filter(p => p.id !== hitObj.id);
      playSound("error");

      if (diff.initialLives === 999) {
        // Beginner hit counter
        setHitsCount(hc => hc + 1);
      } else {
        setLives(l => {
          const nextL = l - 1;
          if (nextL <= 0) {
            stopGame();
          }
          return nextL;
        });
      }
    }

    requestRef.current = requestAnimationFrame(updateLoop);
  });

  const startGame = useCallback(() => {
    cancelTimers();
    projectilesRef.current = [];
    setRenderProjectiles([]);
    setLives(diff.initialLives);
    setHitsCount(0);
    difficultyMultiplierRef.current = 1.0;
    projectileIdRef.current = 0;
    nextSpawnTimeRef.current = performance.now();
    startTimeRef.current = 0;
    lastTimeRef.current = 0;

    // Reset mouse positions
    positionInitialized.current = false;
    mousePosRef.current = { x: 0, y: 0 };
    setMousePosState({ x: 0, y: 0 });

    setPhase("playing");
    playSound("start");

    setTimeout(() => {
      const arena = containerRef.current;
      if (arena) {
        const center = { x: arena.clientWidth / 2, y: arena.clientHeight / 2 };
        mousePosRef.current = center;
        setMousePosState(center);
      }
      requestRef.current = requestAnimationFrame(updateLoop);
    }, 50);
  }, [diff, playSound, updateLoop]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    positionInitialized.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosRef.current = { x, y };
    setMousePosState({ x, y });
  };

  useEffect(() => {
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, []);


  const progress = useToolProgress({
    toolId: "endless-dodge", phase: phase, difficulty: diffId,
    value: survivalTime / 1000, unit: "s", higherIsBetter: true,
    terminal: ["result"], idle: ["idle"], recordKey: "reflextry_v2_dodge-hs-",
    setHighScores, cancelTimers, reset: () => setPhase("idle"),
    eligible: true,
  });

  return (
    <div data-idle={phase === "idle"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/gaming/endless-dodge" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Endless Dodge</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">SPATIAL EVASION TELEMETRY</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result") setDiffId(key); }}
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
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 col-span-2">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Survives duration</div>
                  <div className="text-2xl font-mono font-black text-cyan-600 mt-0.5">{(survivalTime / 1000).toFixed(2)}s</div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Lives Remaining</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5 animate-pulse">
                    {diff.initialLives === 999 ? "∞" : `${lives} ❤️`}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">
                    {diff.initialLives === 999 ? "Hits Penalty" : "Dodge Speed"}
                  </div>
                  <div className="text-sm font-mono font-bold text-[#161614] mt-1.5">
                    {diff.initialLives === 999 ? `${hitsCount} hits` : `${difficultyMultiplierRef.current.toFixed(2)}x`}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Duration ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId].toFixed(2)}s</div>
                  </div>
                </div>
              )}

              {/* Mute */}
              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full min-h-[48px] px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-[#FAF9F6] border-[#E6E3DB] text-[#57554E] hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-sm sm:text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
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
                BULLET COUNT: {renderProjectiles.length}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="game-start-icon relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <ShieldAlert className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Endless Dodge</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Move your mouse, or drag your finger inside the arena, to dodge incoming projectiles.
                        </p>
                        <p className={`game-level-description text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none w-full sm:w-auto min-w-[200px] touch-manipulation">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative min-h-[52px] px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
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
                      ref={containerRef}
                      onPointerDown={(event) => {
                        event.currentTarget.setPointerCapture(event.pointerId);
                        handlePointerMove(event);
                      }}
                      onPointerMove={handlePointerMove}
                      onPointerCancel={() => { mousePosRef.current = { x: -200, y: -200 }; }}
                      className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden touch-none cursor-none"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                      {/* Display beginner remaining time bar */}
                      {diff.timeLimitSec && (
                        <div className="absolute top-4 inset-x-6 z-20 flex flex-col items-center">
                          <div className="flex justify-between w-full text-[10px] font-mono text-[#78756C] dark:text-slate-400 mb-1 max-w-xs">
                            <span>TRIAL TIMEOUT</span>
                            <span>{Math.max(0, diff.timeLimitSec - survivalTime/1000).toFixed(1)}s</span>
                          </div>
                          <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-emerald-500 text-emerald-400" style={{ width: `${Math.max(0, 100 - (survivalTime / (diff.timeLimitSec * 10)))}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Projectiles */}
                      {renderProjectiles.map(p => {
                        let bulletColor = "bg-rose-500 border-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.6)]";
                        if (p.type === "homing") {
                          bulletColor = "bg-amber-400 border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)] animate-pulse";
                        } else if (p.type === "pulse") {
                          bulletColor = "bg-violet-500 border-violet-400 shadow-[0_0_16px_rgba(139,92,246,0.7)]";
                        }

                        return (
                          <div
                            key={p.id}
                            className={`absolute rounded-full border ${bulletColor}`}
                            style={{
                              left: p.x - p.size / 2,
                              top: p.y - p.size / 2,
                              width: p.size,
                              height: p.size,
                            }}
                          />
                        );
                      })}

                      {/* Player Cursor */}
                      <div
                        className="absolute pointer-events-none rounded-full bg-cyan-500 border-2 border-white shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                        style={{
                          left: mousePosState.x - cursorSize / 2,
                          top: mousePosState.y - cursorSize / 2,
                          width: cursorSize,
                          height: cursorSize,
                        }}
                      />
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIBRATION_DISRUPTED</div>
                        <p className="text-xs font-mono text-[#78756C]">Projectile impact detected. Evasion stability broken.</p>
                        {(survivalTime / 1000) >= highScores[diffId] && survivalTime > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {(survivalTime / 1000).toFixed(2)}s!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Survives duration</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{(survivalTime / 1000).toFixed(2)}s</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">
                            {diff.initialLives === 999 ? "Total Hits Received" : "Peak Speed Mult"}
                          </div>
                          <div className="text-xl text-[#3F3E39] font-mono font-bold">
                            {diff.initialLives === 999 ? `${hitsCount} hits` : `${difficultyMultiplierRef.current.toFixed(2)}x`}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Play again
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("idle"); }}
                          className="relative group cursor-pointer focus:outline-none select-none w-full sm:flex-1 touch-manipulation"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative min-h-[52px] py-3.5 px-4 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs sm:text-sm border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
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
                  onClick={stopGame}
                  className="min-h-[44px] min-w-[128px] px-4 py-2.5 rounded-xl border border-[#E6E3DB] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono font-semibold text-[#3F3E39] dark:text-slate-300 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer touch-manipulation"
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
