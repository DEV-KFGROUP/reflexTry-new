"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Brain, Circle, Diamond, Flame, Heart, Heart as HeartIcon, Hexagon, Play, RotateCcw, Shapes, Shield, Square, Star, Triangle, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
   SHAPES DATABASE
───────────────────────────────────────────── */
interface ShapeItem {
  id: string;
  icon: React.ElementType;
  color: string;
  borderColor: string;
  hex: string;
}

const ALL_SHAPES: ShapeItem[] = [
  { id: "circle", icon: Circle, color: "text-pink-500", borderColor: "border-pink-200", hex: "#ec4899" },
  { id: "square", icon: Square, color: "text-blue-500", borderColor: "border-blue-200", hex: "#3b82f6" },
  { id: "triangle", icon: Triangle, color: "text-emerald-500", borderColor: "border-emerald-200", hex: "#10b981" },
  { id: "hexagon", icon: Hexagon, color: "text-amber-500", borderColor: "border-amber-250", hex: "#f59e0b" },
  { id: "star", icon: Star, color: "text-fuchsia-500", borderColor: "border-fuchsia-200", hex: "#d946ef" },
  { id: "diamond", icon: Diamond, color: "text-cyan-500", borderColor: "border-cyan-200", hex: "#06b6d4" },
  { id: "heart", icon: HeartIcon, color: "text-red-500", borderColor: "border-red-200", hex: "#ef4444" },
];

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  gridSize: number; // grid dimension N x N
  shapePoolCount: number; // subset of shapes to use
  timeLimitSec: number;
  lives: number;
  minTargets: number;
  maxTargets: number;
  hasDistortion: boolean; // rotated layout
  hasDualTargets: boolean; // matching two shapes instead of one
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3×3 grid · 3 shapes · 60s · 3 lives",
    gridSize: 3, shapePoolCount: 3, timeLimitSec: 60, lives: 3, minTargets: 2, maxTargets: 3,
    hasDistortion: false, hasDualTargets: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4×4 grid · 4 shapes · 45s · 3 lives",
    gridSize: 4, shapePoolCount: 4, timeLimitSec: 45, lives: 3, minTargets: 3, maxTargets: 4,
    hasDistortion: false, hasDualTargets: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "5×5 grid · 5 shapes · 30s · 2 lives",
    gridSize: 5, shapePoolCount: 5, timeLimitSec: 30, lives: 2, minTargets: 4, maxTargets: 6,
    hasDistortion: false, hasDualTargets: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "6×6 grid · 6 shapes · 25s · 1 life · Distortions",
    gridSize: 6, shapePoolCount: 6, timeLimitSec: 25, lives: 1, minTargets: 5, maxTargets: 7,
    hasDistortion: true, hasDualTargets: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "7×7 grid · 7 shapes · 20s · Dual target clearing",
    gridSize: 7, shapePoolCount: 7, timeLimitSec: 20, lives: 1, minTargets: 6, maxTargets: 8,
    hasDistortion: true, hasDualTargets: true,
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
export default function ShapeMemoryPageClient() {
  const { setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  // Gameplay Grid State
  const [grid, setGrid] = useState<number[]>([]);
  const [targetShapes, setTargetShapes] = useState<number[]>([]); // indexes in ALL_SHAPES
  const [clearedCoordinates, setClearedCoordinates] = useState<number[]>([]); // indexes in grid
  const [distortionAngle, setDistortionAngle] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];

  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  // Load high scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_shape-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const generateGrid = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    const poolSize = d.shapePoolCount;
    const gridCellCount = d.gridSize * d.gridSize;

    // Pick target shape(s)
    const targets: number[] = [];
    const mainTarget = Math.floor(Math.random() * poolSize);
    targets.push(mainTarget);

    if (d.hasDualTargets) {
      let dualTarget = Math.floor(Math.random() * poolSize);
      while (dualTarget === mainTarget) {
        dualTarget = Math.floor(Math.random() * poolSize);
      }
      targets.push(dualTarget);
    }

    setTargetShapes(targets);
    setClearedCoordinates([]);

    // Fill grid randomly with items from the pool
    const newGrid = Array.from({ length: gridCellCount }, () => Math.floor(Math.random() * poolSize));

    // Force inject a specific amount of target elements
    const targetCount = Math.floor(Math.random() * (d.maxTargets - d.minTargets + 1)) + d.minTargets;
    let injected = 0;
    while (injected < targetCount) {
      const cellIdx = Math.floor(Math.random() * gridCellCount);
      const targetSelection = targets[Math.floor(Math.random() * targets.length)];
      if (!targets.includes(newGrid[cellIdx])) {
        newGrid[cellIdx] = targetSelection;
        injected++;
      }
    }

    setGrid(newGrid);

    // Hard/Professional feature rotations
    if (d.hasDistortion) {
      setDistortionAngle(Math.random() > 0.5 ? 90 : -90);
    } else {
      setDistortionAngle(0);
    }
  }, [diffId]);

  const startGame = useCallback(() => {
    cancelTimers();
    if (timerRef.current) clearInterval(timerRef.current);
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setTimeLeft(d.timeLimitSec);
    setLivesLeft(d.lives);
    setStreak(0);
    setPhase("playing");
    playSound("start");
    generateGrid();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          playSound("levelUp");
          setPhase(prev => {
            return "gameover";
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, generateGrid, playSound, score]);

  const handleShapeClick = useCallback((cellIdx: number, shapeIdx: number) => {
    if (phase !== "playing") return;
    if (clearedCoordinates.includes(cellIdx)) return;

    const isTarget = targetShapes.includes(shapeIdx);

    if (isTarget) {
      playSound("success");
      setScore(s => s + 50);

      // Mutate coordinate to a non-target shape so it clears visually
      const newGrid = [...grid];
      let replacement = Math.floor(Math.random() * diff.shapePoolCount);
      while (targetShapes.includes(replacement)) {
        replacement = Math.floor(Math.random() * diff.shapePoolCount);
      }
      newGrid[cellIdx] = replacement;
      setGrid(newGrid);

      // Check if all instances of target shapes are cleared from grid
      const gridHasTargets = newGrid.some(sIdx => targetShapes.includes(sIdx));

      if (!gridHasTargets) {
        playSound("levelUp");
        setStreak(s => s + 1);
        setScore(s => {
          const streakBonus = streak >= 3 ? 200 : 100;
          if (diff.id === "professional") {
            // Pro gains time bonus on board clear
            setTimeLeft(t => Math.min(t + 2, diff.timeLimitSec));
          }
          return s + streakBonus;
        });
        generateGrid();
      }
    } else {
      playSound("error");
      setStreak(0);
      setScore(s => Math.max(0, s - 100));

      const nextLives = livesLeft - 1;
      setLivesLeft(nextLives);

      if (nextLives <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("gameover");
      }
    }
  }, [phase, clearedCoordinates, targetShapes, grid, diff, playSound, streak, livesLeft, diffId, generateGrid, score]);


  const progress = useToolProgress({
    toolId: "shape-memory", phase: phase, difficulty: diffId,
    value: score, unit: "pts", higherIsBetter: true,
    terminal: ["gameover"], idle: ["select"], recordKey: "reflextry_v2_shape-hs-",
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
            <ToolIcon toolId="/memory/shape" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Shape Rush</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">SPATIAL TARGET RECALL</p>
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
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Streak</div>
                  <div className={`text-lg font-mono font-bold mt-0.5 ${streak >= 3 ? "text-orange-500" : "text-[#161614]"}`}>
                    {streak >= 3 ? `🔥x${streak}` : `x${streak}`}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Lives</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {Array.from({ length: diff.lives }).map((_, i) => (
                      <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Time Left</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-[#161614]"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best Score */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best ({diff.label})</div>
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
              {/* Corner decals */}




              <div className="absolute top-4 left-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                {diff.label} Mode
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                GRID: {diff.gridSize}×{diff.gridSize}
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
                          <Shapes className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Shape Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Find and click all coordinate matches of the target shape displayed at the top before your session expires.
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
                    <motion.div key="playing" initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="w-full flex flex-col items-center gap-6">
                      
                      {/* Target Shape HUD displays */}
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">[ TARGET SHAPE TO CLEAR ]</span>
                        <div className="flex gap-4">
                          {targetShapes.map(sIdx => {
                            const Item = ALL_SHAPES[sIdx];
                            const TargetIcon = Item.icon;
                            return (
                              <div
                                key={Item.id}
                                className="w-12 h-12 rounded-2xl border flex items-center justify-center bg-white shadow-sm"
                                style={{ borderColor: Item.hex, boxShadow: `0 4px 12px ${Item.hex}15` }}
                              >
                                <TargetIcon className="w-6 h-6 animate-pulse" style={{ color: Item.hex }} />
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <motion.div
                        animate={{ rotate: distortionAngle }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="grid gap-2 bg-[#FAF9F6] border border-[#E6E3DB]/80 p-4 rounded-2xl shadow-inner max-w-sm sm:max-w-md w-full aspect-square"
                        style={{ gridTemplateColumns: `repeat(${diff.gridSize}, minmax(0, 1fr))` }}
                      >
                        {grid.map((shapeIdx, idx) => {
                          const Item = ALL_SHAPES[shapeIdx];
                          const IconItem = Item.icon;
                          const isCleared = clearedCoordinates.includes(idx);

                          return (
                            <div key={idx} className="relative aspect-square w-full">
                              <div className="absolute inset-0 rounded-lg bg-[#F3F1EB] translate-y-0.5 border-b border-black/10" />
                              <motion.button aria-label={`${ALL_SHAPES[shapeIdx].id}, position ${idx + 1}`}
                                whileHover={{ y: -0.5 }}
                                whileTap={{ y: 2 }}
                                transition={{ type: "spring", stiffness: 450, damping: 18 }}
                                onClick={() => handleShapeClick(idx, shapeIdx)}
                                className="absolute inset-0 rounded-lg border border-slate-250 bg-white flex items-center justify-center cursor-pointer select-none hover:bg-[#FAF9F6] transition-colors"
                              >
                                <IconItem className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: Item.hex }} />
                              </motion.button>
                            </div>
                          );
                        })}
                      </motion.div>

                      {/* Timer Bar */}
                      <div className="w-full max-w-xs h-1 bg-[#F3F1EB] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: timeLeft <= 5 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                          animate={{ width: `${(timeLeft / diff.timeLimitSec) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>

                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">Round Complete</div>
                        <p className="text-xs font-mono text-[#78756C]">{diff.label} mode · Stability session expired</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-5 shadow-sm max-w-xs mx-auto">
                        <div className="text-xs font-mono text-[#57554E] dark:text-slate-400 uppercase tracking-wider mb-1">Peak Score</div>
                        <div className="text-4xl text-fuchsia-600 font-mono font-black">{score}</div>
                        <div className="text-[11px] font-mono text-[#57554E] dark:text-slate-400 mt-2">Score Saved</div>
                      </div>
                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Replay Game
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setScore(0); setStreak(0); setLivesLeft(diff.lives); }}
                          className="relative group cursor-pointer focus:outline-none select-none"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
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
                  End Round ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
