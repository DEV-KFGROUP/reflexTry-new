"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Grid3X3
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
type CellType = "empty" | "target" | "mine" | "multiplier" | "shuffle";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  gridSize: number; // 3 (3x3), 4 (4x4), 5 (5x5), 6 (6x6)
  targetRange: [number, number]; // [min, max] targets
  timeLimitSec: number;
  maxMistakes: number;
  hasMines: boolean;
  hasPowerups: boolean;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3x3 grid · 2-3 targets · 30s timer · No mines · No strike limits",
    gridSize: 3, targetRange: [2, 3], timeLimitSec: 30, maxMistakes: 999, hasMines: false, hasPowerups: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3x3 grid · 3-4 targets · 30s timer · No mines · No strike limits",
    gridSize: 3, targetRange: [3, 4], timeLimitSec: 30, maxMistakes: 999, hasMines: false, hasPowerups: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4x4 grid · 4-6 targets · 30s timer · No mines · 5 lives",
    gridSize: 4, targetRange: [4, 6], timeLimitSec: 30, maxMistakes: 5, hasMines: false, hasPowerups: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "5x5 grid · 5-8 targets · Red mine decoys (-50pts/life) · 3 lives",
    gridSize: 5, targetRange: [5, 8], timeLimitSec: 45, maxMistakes: 3, hasMines: true, hasPowerups: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6x6 grid · Multiplier & Shuffle blocks · Red mine decoys · 3 lives",
    gridSize: 6, targetRange: [6, 10], timeLimitSec: 45, maxMistakes: 3, hasMines: true, hasPowerups: true,
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
export default function GridSpeedGame() {
    const { play } = useGameSound();

  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [wavesCompleted, setWavesCompleted] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [muted, setMuted] = useState(false);

  // Board State
  const [gridCells, setGridCells] = useState<CellType[]>([]);
  const [isMultiplierActive, setIsMultiplierActive] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      const v = localStorage.getItem(`grid-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateLevel = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    const totalCells = d.gridSize * d.gridSize;
    
    // Choose random number of targets
    const targetCount = Math.floor(Math.random() * (d.targetRange[1] - d.targetRange[0] + 1)) + d.targetRange[0];
    
    const newCells: CellType[] = new Array(totalCells).fill("empty");
    let placedTargets = 0;

    // Place targets
    while (placedTargets < targetCount) {
      const idx = Math.floor(Math.random() * totalCells);
      if (newCells[idx] === "empty") {
        newCells[idx] = "target";
        placedTargets++;
      }
    }

    // Place mines (Hard/Professional)
    if (d.hasMines) {
      const mineCount = d.id === "professional" ? 4 : 3;
      let placedMines = 0;
      while (placedMines < mineCount) {
        const idx = Math.floor(Math.random() * totalCells);
        if (newCells[idx] === "empty") {
          newCells[idx] = "mine";
          placedMines++;
        }
      }
    }

    // Place powerups (Professional)
    if (d.hasPowerups) {
      // Place multiplier
      let placedMult = false;
      while (!placedMult) {
        const idx = Math.floor(Math.random() * totalCells);
        if (newCells[idx] === "empty") {
          newCells[idx] = "multiplier";
          placedMult = true;
        }
      }
      
      // Place shuffle
      let placedShuffle = false;
      while (!placedShuffle) {
        const idx = Math.floor(Math.random() * totalCells);
        if (newCells[idx] === "empty") {
          newCells[idx] = "shuffle";
          placedShuffle = true;
        }
      }
    }

    setGridCells(newCells);
  }, [diffId]);

  const startGame = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setWavesCompleted(0);
    setWrongClicks(0);
    setTimeLeft(d.timeLimitSec);
    setIsMultiplierActive(false);
    setGameState("playing");
    generateLevel();
    playSound("start");

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          playSound("levelUp");
          setGameState("gameover");

          // Save high score
          setHighScores(hs => {
            if (score > hs[diffId]) {
              localStorage.setItem(`grid-hs-${diffId}`, score.toString());
              return { ...hs, [diffId]: score };
            }
            return hs;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, score, playSound, generateLevel]);

  const handleCellClick = useCallback((type: CellType, index: number) => {
    if (gameState !== "playing") return;

    if (type === "target") {
      const increment = isMultiplierActive ? 20 : 10;
      setScore(s => s + increment);
      playSound("click");

      const newCells = [...gridCells];
      newCells[index] = "empty";
      setGridCells(newCells);

      // Check if all targets cleared
      if (!newCells.some(x => x === "target")) {
        setWavesCompleted(w => w + 1);
        setScore(s => s + 50);
        playSound("levelUp");
        generateLevel();
      }
    } else if (type === "mine") {
      // Mine penalty
      setScore(s => Math.max(0, s - 50));
      playSound("error");
      
      setWrongClicks(w => {
        const nextW = w + 1;
        if (nextW >= diff.maxMistakes) {
          clearInterval(timerRef.current!);
          playSound("error");
          setGameState("gameover");
        }
        return nextW;
      });

      const newCells = [...gridCells];
      newCells[index] = "empty";
      setGridCells(newCells);
    } else if (type === "multiplier") {
      // Multiplier double score active
      playSound("success");
      setIsMultiplierActive(true);
      setTimeout(() => {
        setIsMultiplierActive(false);
      }, 5000); // 5 seconds double points

      const newCells = [...gridCells];
      newCells[index] = "empty";
      setGridCells(newCells);
    } else if (type === "shuffle") {
      // Shuffle target positions on grid
      playSound("success");
      const tempTargets = gridCells.filter(x => x === "target").length;
      const totalCells = diff.gridSize * diff.gridSize;
      
      const shuffled: CellType[] = new Array(totalCells).fill("empty");
      let placed = 0;
      while (placed < tempTargets) {
        const idx = Math.floor(Math.random() * totalCells);
        if (shuffled[idx] === "empty") {
          shuffled[idx] = "target";
          placed++;
        }
      }
      setGridCells(shuffled);
    } else {
      // Clicked empty cell
      setScore(s => Math.max(0, s - 10));
      playSound("error");
      setWrongClicks(w => {
        const nextW = w + 1;
        if (nextW >= diff.maxMistakes) {
          clearInterval(timerRef.current!);
          playSound("error");
          setGameState("gameover");
        }
        return nextW;
      });
    }
  }, [gameState, gridCells, isMultiplierActive, diff, playSound, generateLevel]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalClicks = wavesCompleted * 6 + wrongClicks; // approx hits
  const accuracyPercent = totalClicks > 0 ? Math.round(((totalClicks - wrongClicks) / totalClicks) * 100) : 100;

  // Grid styling helpers
  const getGridColsClass = () => {
    if (diff.gridSize === 3) return "grid-cols-3 max-w-xs";
    if (diff.gridSize === 4) return "grid-cols-4 max-w-sm";
    if (diff.gridSize === 5) return "grid-cols-5 max-w-md";
    return "grid-cols-6 max-w-lg"; // 6x6 grid
  };

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">GRID SELECTION</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">SPATIAL VELOCITY ALIGNMENT</p>
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
                    onSelect={() => { if (gameState === "idle" || gameState === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={gameState === "playing"}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Waves Completed</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{wavesCompleted}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - wrongClicks} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Multiplier active banner */}
              {isMultiplierActive && (
                <div className="mt-3 bg-emerald-50 border border-emerald-250 p-2.5 rounded-xl text-[10px] font-mono text-emerald-700 font-bold tracking-wider animate-pulse text-center uppercase">
                  ⚡ 2x Score Active (5s)!
                </div>
              )}

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Score ({diff.label})</div>
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
                MATRIX: {diff.gridSize} x {diff.gridSize} SLOTS
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {gameState === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Grid3X3 className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Grid Selection</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Click illuminated targets as fast as possible to clear the board. Avoid decoys and mine cells.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Telemetry Grid
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {gameState === "playing" && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative p-5 bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] w-full flex items-center justify-center"
                    >
                      <div className={`grid gap-3 justify-center w-full ${getGridColsClass()}`}>
                        {gridCells.map((type, i) => {
                          
                          let cellStyle = "bg-slate-100 border-slate-200 hover:bg-slate-200/50";
                          let keycapClass = "";
                          
                          if (type === "target") {
                            cellStyle = "bg-cyan-500 border-cyan-400 text-white shadow-[0_4px_10px_rgba(6,182,212,0.3)]";
                            keycapClass = "bg-cyan-700";
                          } else if (type === "mine") {
                            cellStyle = "bg-red-500 border-red-400 text-white shadow-[0_4px_10px_rgba(239,68,68,0.3)]";
                            keycapClass = "bg-red-700";
                          } else if (type === "multiplier") {
                            cellStyle = "bg-amber-400 border-amber-300 text-white shadow-[0_4px_10px_rgba(245,158,11,0.3)]";
                            keycapClass = "bg-amber-600";
                          } else if (type === "shuffle") {
                            cellStyle = "bg-purple-500 border-purple-400 text-white shadow-[0_4px_10px_rgba(168,85,247,0.3)]";
                            keycapClass = "bg-purple-700";
                          }

                          return (
                            <div key={i} className="relative aspect-square w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center">
                              {type !== "empty" ? (
                                <>
                                  {/* 3D Depth Base */}
                                  <div className={`absolute inset-0 rounded-xl ${keycapClass} translate-y-1 border-b-2 border-black/20`} />
                                  {/* Keycap */}
                                  <motion.button
                                    whileTap={{ y: 2 }}
                                    onClick={() => handleCellClick(type, i)}
                                    className={`absolute inset-0 rounded-xl border flex items-center justify-center transition-all select-none cursor-pointer hover:brightness-105 active:translate-y-1 ${cellStyle}`}
                                  >
                                    {type === "target" && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                                    {type === "mine" && <div className="w-2 h-2 rounded-full bg-white animate-ping" />}
                                    {type === "multiplier" && <span className="text-[10px] font-black font-mono">2X</span>}
                                    {type === "shuffle" && <span className="text-[10px] font-black font-mono">S</span>}
                                  </motion.button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleCellClick("empty", i)}
                                  className="absolute inset-0 rounded-xl bg-slate-900 border border-slate-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.35)] cursor-pointer hover:bg-slate-800/80 transition-colors"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {gameState === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode grid completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Waves Cleared</div>
                          <div className="text-lg text-slate-700 font-mono font-bold">{wavesCompleted} waves</div>
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
                          onClick={() => { setGameState("idle"); setScore(0); }}
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
            {gameState === "playing" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setGameState("gameover"); }}
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
