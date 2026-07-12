"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Crosshair
} from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
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
  targetSize: number; // 24px to 72px
  baseSpeed: number; // Duration divisor
  damageDrainRate: number; // Health drain multiplier
  hasGlitchPhase: boolean; // Target turns semi-invisible periodically
  hasRecoilJitter: boolean; // Console container jitters randomly
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Large target (72px) · Slow stable movement · Low damage rate · No glitches",
    targetSize: 72, baseSpeed: 1.0, damageDrainRate: 10, hasGlitchPhase: false, hasRecoilJitter: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Medium target (60px) · Standard movement · Mild damage rate · No glitches",
    targetSize: 60, baseSpeed: 1.25, damageDrainRate: 15, hasGlitchPhase: false, hasRecoilJitter: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard target (48px) · Accelerates slowly · Survive as long as possible",
    targetSize: 48, baseSpeed: 1.6, damageDrainRate: 20, hasGlitchPhase: false, hasRecoilJitter: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Small target (36px) · Periodically turns semi-invisible (Fades) · Rapid damage",
    targetSize: 36, baseSpeed: 2.2, damageDrainRate: 30, hasGlitchPhase: true, hasRecoilJitter: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Tiny target (24px) · Periodic invisibility + heavy screen recoil jitter · Extreme drain",
    targetSize: 24, baseSpeed: 3.0, damageDrainRate: 45, hasGlitchPhase: true, hasRecoilJitter: true,
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
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore.toFixed(2)}s</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function TargetTrackingClient() {
  const content = getToolContent("target-tracking", "Target Tracking");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [trackedTime, setTrackedTime] = useState(0);
  const [health, setHealth] = useState(100);
  const [isHovering, setIsHovering] = useState(false);
  const [muted, setMuted] = useState(false);

  // Glitch states
  const [isGlitching, setIsGlitching] = useState(false);
  const [jitterActive, setJitterActive] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Physics Refs
  const mousePosRef = useRef({ x: -200, y: -200 });
  const healthRef = useRef(100);
  const isHoveringRef = useRef(false);
  const totalTrackedTimeRef = useRef(0);
  const difficultyMultiplierRef = useRef(1);

  const lastTimeRef = useRef<number>(0);
  const requestRef = useRef<number>(0);
  const glitchTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const jitterTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      const v = localStorage.getItem(`tracking-hs-${k}`);
      if (v) saved[k] = parseFloat(v);
    });
    setHighScores(saved);
  }, []);

  const stopGame = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
    if (jitterTimerRef.current) clearInterval(jitterTimerRef.current);
    
    controls.stop();
    playSound("error");
    setPhase("result");

    const finalSecs = totalTrackedTimeRef.current / 1000;
    // Save high score
    setHighScores(hs => {
      if (finalSecs > hs[diffId]) {
        localStorage.setItem(`tracking-hs-${diffId}`, finalSecs.toString());
        return { ...hs, [diffId]: finalSecs };
      }
      return hs;
    });
  }, [diffId, controls, playSound]);

  const updateLogic = useCallback((time: number) => {
    if (phase !== "playing") return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTimeMillis = time - lastTimeRef.current;
    const deltaTime = deltaTimeMillis / 1000;
    lastTimeRef.current = time;

    const container = containerRef.current;
    if (!container) {
      requestRef.current = requestAnimationFrame(updateLogic);
      return;
    }

    // Difficulty increases slowly over time
    difficultyMultiplierRef.current += deltaTime * 0.04;

    // Check collision precisely
    const targetEl = container.querySelector(".tracking-target-element");
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const absMouseX = mousePosRef.current.x + containerRect.left;
      const absMouseY = mousePosRef.current.y + containerRect.top;

      const targetCenterX = rect.left + rect.width / 2;
      const targetCenterY = rect.top + rect.height / 2;
      const radius = rect.width / 2;

      const dist = Math.hypot(absMouseX - targetCenterX, absMouseY - targetCenterY);
      isHoveringRef.current = dist <= radius;
    }

    if (isHoveringRef.current) {
      totalTrackedTimeRef.current += deltaTimeMillis;
      setTrackedTime(totalTrackedTimeRef.current);

      // Heal slowly
      healthRef.current = Math.min(100, healthRef.current + 8 * deltaTime);
    } else {
      // Drain health based on difficulty configs
      const drain = diff.damageDrainRate * difficultyMultiplierRef.current;
      healthRef.current = Math.max(0, healthRef.current - drain * deltaTime);
    }

    setHealth(healthRef.current);
    setIsHovering(isHoveringRef.current);

    if (healthRef.current <= 0) {
      stopGame();
      return;
    }

    requestRef.current = requestAnimationFrame(updateLogic);
  }, [phase, diff, stopGame]);

  const moveTarget = useCallback(async () => {
    if (phase !== "playing") return;
    if (!containerRef.current) return;

    const size = diff.targetSize;
    const w = containerRef.current.offsetWidth - size;
    const h = containerRef.current.offsetHeight - size;

    const nextX = Math.random() * w;
    const nextY = Math.random() * h;

    // Speed scaling
    const baseDuration = 0.5 + Math.random() * 0.6;
    const duration = baseDuration / (diff.baseSpeed * Math.sqrt(difficultyMultiplierRef.current));

    await controls.start({
      x: nextX,
      y: nextY,
      transition: {
        duration: duration,
        ease: "easeInOut"
      }
    });

    if (phase === "playing") {
      moveTarget();
    }
  }, [phase, diff, controls]);

  const startGame = useCallback(() => {
    healthRef.current = 100;
    setHealth(100);
    isHoveringRef.current = false;
    setIsHovering(false);
    totalTrackedTimeRef.current = 0;
    setTrackedTime(0);
    difficultyMultiplierRef.current = 1;
    lastTimeRef.current = 0;

    setIsGlitching(false);
    setJitterActive(false);

    setPhase("playing");
    playSound("start");

    // Start target movement from center
    if (containerRef.current) {
      const size = diff.targetSize;
      controls.set({
        x: (containerRef.current.offsetWidth - size) / 2,
        y: (containerRef.current.offsetHeight - size) / 2
      });
    }

    // Set timers for gltches
    if (diff.hasGlitchPhase) {
      glitchTimerRef.current = setInterval(() => {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 2000);
      }, 7000);
    }

    if (diff.hasRecoilJitter) {
      jitterTimerRef.current = setInterval(() => {
        setJitterActive(true);
        setTimeout(() => setJitterActive(false), 250);
      }, 4000);
    }

    // Spawn physics animation frame loops
    setTimeout(() => {
      moveTarget();
      requestRef.current = requestAnimationFrame(updateLogic);
    }, 50);

  }, [diff, playSound, moveTarget, updateLogic, controls]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (glitchTimerRef.current) clearInterval(glitchTimerRef.current);
      if (jitterTimerRef.current) clearInterval(jitterTimerRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">TARGET TRACKING</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">precision smooth pursuit tracker</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 col-span-2">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Tracked Duration</div>
                  <div className="text-2xl font-mono font-black text-cyan-600 mt-0.5">{(trackedTime / 1000).toFixed(2)}s</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Signal Locked</div>
                  <div className={`text-xs font-mono font-bold mt-1.5 ${isHovering ? "text-emerald-500 animate-pulse" : "text-red-500"}`}>
                    {isHovering ? "TRUE 🟢" : "FALSE 🔴"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Speed Scale</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1.5">
                    {difficultyMultiplierRef.current.toFixed(2)}x
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Duration ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId].toFixed(2)}s</div>
                  </div>
                </div>
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
            <div
              className={`relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)] transition-all ${
                jitterActive ? "animate-[shake_0.2s_ease-in-out_infinite]" : ""
              }`}
            >
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                ARENA // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                GLITCH CAPABLE: {diff.hasGlitchPhase ? "TRUE" : "FALSE"}
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
                          <Crosshair className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Smooth Pursuit</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Keep your cursor locked onto the center target as it slides erratically. Losing locking drains the telemetry health bar.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Commence Pursuit Calibration
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
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden"
                    >
                      {/* Health stability telemetry HUD */}
                      <div className="absolute top-4 inset-x-6 z-20 flex flex-col items-center">
                        <div className="flex justify-between w-full text-[8px] font-mono text-slate-400 mb-1 max-w-xs">
                          <span>TELEMETRY STABILITY</span>
                          <span>{health.toFixed(1)}%</span>
                        </div>
                        <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                          <div
                            className={`h-full transition-all duration-75 shadow-[0_0_8px_currentColor] ${
                              health > 30 ? "bg-cyan-500 text-cyan-400" : "bg-red-500 text-red-400"
                            }`}
                            style={{ width: `${health}%` }}
                          />
                        </div>
                      </div>

                      {/* Bounding box viewport with mouse listener */}
                      <div
                        onMouseMove={handleMouseMove}
                        className="w-full h-full relative cursor-crosshair"
                      >
                        {/* Target Orb */}
                        <motion.div
                          animate={controls}
                          className="tracking-target-element absolute rounded-full border-4 shadow-2xl flex items-center justify-center transition-all duration-75 z-10"
                          style={{
                            width: `${diff.targetSize}px`,
                            height: `${diff.targetSize}px`,
                            opacity: isGlitching ? 0.15 : 1.0,
                            transform: "translate(-50%, -50%)",
                            background: isHovering ? "#06b6d4" : "#f43f5e",
                            borderColor: "#ffffff",
                            boxShadow: isHovering
                              ? "0px 0px 20px rgba(6,182,212,0.7)"
                              : "0px 0px 15px rgba(244,63,94,0.4)"
                          }}
                        >
                          <Crosshair className="w-4 h-4 text-white opacity-70" />
                        </motion.div>
                      </div>

                      {isGlitching && (
                        <div className="absolute bottom-4 text-[9px] font-mono text-red-400 uppercase tracking-widest animate-pulse">
                          [ SIGNAL GLARE GLITCH DETECTED — TARGET TRANSPARENT ]
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <Crosshair className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">TARGET_LOST</div>
                        <p className="text-xs font-mono text-slate-500">Optic locking failed and telemetry tracking dropped.</p>
                        {(trackedTime / 1000) >= highScores[diffId] && trackedTime > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {(trackedTime / 1000).toFixed(2)}s!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Survives duration</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{(trackedTime / 1000).toFixed(2)}s</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Max Speed Mult</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{difficultyMultiplierRef.current.toFixed(2)}x</div>
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
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Abort Session ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* SEO Content */}
        <div className="w-full max-w-5xl bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 relative z-10">
          <ToolContent
            title="Continuous Target Tracking"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Improves ocular motor smooth pursuit control capacity.",
              "Trains cursor stabilization and micro-flicking speed tracking.",
              "Develops prediction capabilities during periodic target phase-outs.",
              "Saves maximal tracking survival durations per difficulty level.",
              "Essential training for FPS gaming tracking engagement stability.",
            ]}
            howToPlay={[
              "Choose your difficulty — Beginner (72px, slow stable) to Professional (24px, fast chaotic, fades, jitter recoil).",
              "Click 'Commence Pursuit Calibration' to start.",
              "Locate the target sphere inside the tracking console window.",
              "Hover and follow the sphere smoothly with your cursor. Hovering fills the Telemetry Health bar.",
              "Losing contact with the target drains health. The drain accelerates over time.",
              "On Hard and Professional, track the sphere through faded glitch phases.",
              "Telemetry Health hitting 0% fails the session.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
