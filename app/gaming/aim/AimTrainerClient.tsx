"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flame, Play, RotateCcw, Shield, Star, Target, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
type TargetType = "normal" | "decoy" | "bomb";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  targetSize: number; // 24px to 64px
  spawnIntervalMs: number;
  maxMistakes: number;
  hasDecoys: boolean;
  hasBombs: boolean;
  screenShakeOnMiss: boolean;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Large target (64px) · Slow spawn · No decoys · No strike limits",
    targetSize: 64, spawnIntervalMs: 1500, maxMistakes: 999, hasDecoys: false, hasBombs: false, screenShakeOnMiss: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Medium target (52px) · 1.2s spawn · No decoys · No strike limits",
    targetSize: 52, spawnIntervalMs: 1200, maxMistakes: 999, hasDecoys: false, hasBombs: false, screenShakeOnMiss: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard target (40px) · 0.9s spawn · 5 lives limit",
    targetSize: 40, spawnIntervalMs: 900, maxMistakes: 5, hasDecoys: false, hasBombs: false, screenShakeOnMiss: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Small target (32px) · Red decoy bomb targets · 3 lives limit",
    targetSize: 32, spawnIntervalMs: 700, maxMistakes: 3, hasDecoys: false, hasBombs: true, screenShakeOnMiss: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Tiny targets (24px) · Ultra-fast spawn · Red decoy bombs · Screen shake on miss",
    targetSize: 24, spawnIntervalMs: 480, maxMistakes: 3, hasDecoys: true, hasBombs: true, screenShakeOnMiss: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface TargetItem {
  id: number;
  x: number; // percentage left
  y: number; // percentage top
  type: TargetType;
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
export default function AimTrainerClient() {
  const { setTimeout, setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [hitsCount, setHitsCount] = useState(0);
  const [missesCount, setMissesCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [muted, setMuted] = useState(false);

  // Targets State
  const [targets, setTargets] = useState<TargetItem[]>([]);
  const targetIdRef = useRef(0);

  // FX state
  const [shakeActive, setShakeActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      const v = safeStorage.getItem(`reflextry_v2_aim-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const spawnTarget = useLatestCallback(() => {
    const d = DIFFICULTIES[diffId];

    // Decide target type
    let type: TargetType = "normal";
    if (d.hasBombs && Math.random() < 0.25) {
      type = "bomb";
    } else if (d.hasDecoys && Math.random() < 0.2) {
      type = "decoy";
    }

    const x = 10 + Math.random() * 80;
    const y = 10 + Math.random() * 80;

    targetIdRef.current++;
    const newTarget: TargetItem = {
      id: targetIdRef.current,
      x,
      y,
      type
    };

    setTargets(prev => {
      // Keep only recent targets on screen depending on speed
      const filtered = prev.slice(-2);
      return [...filtered, newTarget];
    });
  });

  const startGame = useCallback(() => {
    cancelTimers();
    setScore(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(30);
    setTargets([]);
    setShakeActive(false);
    setPhase("playing");
    playSound("start");

    // Spawn first target
    spawnTarget();

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = (() => { const deadline = performance.now() + (30) * 1000; return setInterval(() => {
      const remaining = Math.max(0, (deadline - performance.now()) / 1000);
      setTimeLeft(Math.ceil(remaining));
      if (remaining === 0) { clearInterval(timerRef.current!);
if (spawnRef.current) clearInterval(spawnRef.current);
playSound("levelUp");
setPhase("result"); }
    }, 50); })();

    if (spawnRef.current) clearInterval(spawnRef.current);
    spawnRef.current = setInterval(() => {
      spawnTarget();
    }, diff.spawnIntervalMs);

  }, [diffId, score, playSound, spawnTarget, diff]);

  const handleHit = useCallback((target: TargetItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "playing") return;

    // Filter hit target out
    setTargets(prev => prev.filter(t => t.id !== target.id));

    if (target.type === "bomb") {
      // Bomb decoy clicked -> Deduct life and points
      setScore(s => Math.max(0, s - 300));
      playSound("error");
      setMissesCount(m => {
        const nextM = m + 1;
        if (nextM >= diff.maxMistakes) {
          if (timerRef.current) clearInterval(timerRef.current);
          if (spawnRef.current) clearInterval(spawnRef.current);
          setPhase("result");
          playSound("error");
        }
        return nextM;
      });
    } else if (target.type === "decoy") {
      // Decoy targets yield no score and count as miss
      playSound("error");
      setMissesCount(m => m + 1);
    } else {
      // Normal target hit
      setScore(s => s + 100);
      setHitsCount(h => h + 1);
      playSound("click");
    }

    // Force spawn next target immediately
    spawnTarget();
  }, [phase, diff, playSound, spawnTarget]);

  // Clicked empty background
  const handleMiss = useCallback(() => {
    if (phase !== "playing") return;

    setScore(s => Math.max(0, s - 50));
    playSound("error");
    
    setMissesCount(m => {
      const nextM = m + 1;
      if (nextM >= diff.maxMistakes) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (spawnRef.current) clearInterval(spawnRef.current);
        setPhase("result");
        playSound("error");
      }
      return nextM;
    });

    if (diff.screenShakeOnMiss) {
      setShakeActive(true);
      setTimeout(() => setShakeActive(false), 200);
    }
  }, [phase, diff, playSound]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, []);

  const totalClicks = hitsCount + missesCount;
  const accuracyPercent = totalClicks > 0 ? Math.round((hitsCount / totalClicks) * 100) : 100;


  const progress = useToolProgress({
    toolId: "aim-trainer", phase: phase, difficulty: diffId,
    value: score, unit: "pts", higherIsBetter: true,
    terminal: ["result"], idle: ["idle"], recordKey: "reflextry_v2_aim-hs-",
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
            <ToolIcon toolId="/gaming/aim" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Aim Arena</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">TARGET OPTIC ALIGNMENT</p>
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
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - missesCount} ❤️`}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-[#161614]"}`}>
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
                className={`mt-3 w-full min-h-[48px] px-4 py-3 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 touch-manipulation ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-[#FAF9F6] border-[#E6E3DB] text-[#57554E] hover:border-violet-200 hover:text-violet-600"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-sm sm:text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* ═══ RIGHT PANEL: Game Console ═══ */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="game-arena flex flex-col gap-4">
            <div
              className={`relative bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden transition-all ${
                shakeActive ? "animate-[shake_0.2s_ease-in-out_infinite]" : ""
              }`}
            >




              <div className="absolute top-4 left-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                {diff.label} Mode
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                Target Size: {diff.targetSize}px
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
                          <Target className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Aim Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Test coordinate pointing speed and cursor accuracy. Avoid decoy bomb targets and keep targets cleared.
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
                      onPointerDown={handleMiss}
                      className="absolute inset-0 w-full h-full bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden cursor-crosshair touch-none select-none"
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                      {targets.map(t => {
                        let targetColor = "bg-cyan-500 border-white shadow-[0_4px_12px_rgba(6,182,212,0.4)]";
                        let innerDotColor = "bg-white";

                        if (t.type === "bomb") {
                          targetColor = "bg-red-500 border-white shadow-[0_4px_12px_rgba(239,68,68,0.4)]";
                          innerDotColor = "bg-white animate-ping";
                        } else if (t.type === "decoy") {
                          targetColor = "bg-slate-400 border-white shadow-[0_4px_12px_rgba(148,163,184,0.4)]";
                          innerDotColor = "bg-white";
                        }

                        return (
                          <motion.button
                            key={t.id}
                            aria-label={t.type === "bomb" ? "Bomb" : t.type === "decoy" ? "Decoy" : "Aim target"}
                            onPointerDown={(e) => handleHit(t, e)}
                            onClick={(e) => { if (e.detail === 0) handleHit(t, e); }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            className={`game-target-dot absolute rounded-full border-4 cursor-pointer flex items-center justify-center active:scale-90 outline-none select-none z-10 touch-none ${targetColor}`}
                            style={{
                              left: `clamp(${diff.targetSize / 2 + 10}px, ${t.x}%, calc(100% - ${diff.targetSize / 2 + 10}px))`,
                              top: `clamp(${diff.targetSize / 2 + 10}px, ${t.y}%, calc(100% - ${diff.targetSize / 2 + 10}px))`,
                              width: `${diff.targetSize}px`,
                              height: `${diff.targetSize}px`,
                              translate: "-50% -50%"
                            }}
                          >
                            <div className={`w-2 h-2 rounded-full pointer-events-none ${innerDotColor}`} />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">Round complete</div>
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
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Hits / Accuracy</div>
                          <div className="text-base text-[#3F3E39] font-mono font-bold">{hitsCount} hits ({accuracyPercent}%)</div>
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
                  onClick={() => {
                    if (timerRef.current) clearInterval(timerRef.current);
                    if (spawnRef.current) clearInterval(spawnRef.current);
                    setPhase("result");
                  }}
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
