"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { useGameSound } from "@/hooks/useGameSound";
import {
  Play, RotateCcw, Brain, AlertTriangle,
  Shield, Star, Zap, Flame, Trophy, Heart,
  Volume2, VolumeX, Eye, ArrowRight,
} from "lucide-react";

/* ─────────────────────────────────────────────
   GRADIENT MAP (inline — avoids Tailwind purge)
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
  startGrid: number;          // grid dimension (startGrid x startGrid)
  startTiles: number;         // highlighted tiles at level 1
  tilesPerLevel: number;      // extra tiles each level
  gridGrowEvery: number;      // grow grid size every N levels
  baseShowMs: number;         // base memorize time
  msPerTile: number;          // extra ms per tile
  lives: number;
  penaltyOnWrong: boolean;    // wrong click = instant life loss
  hasInputTimer: boolean;
  inputTimerSec: number;
  tileRevealOnFail: boolean;  // show correct pattern after wrong
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3×3 grid · Slow reveal · 3 lives · Pattern shown on error",
    startGrid: 3, startTiles: 3, tilesPerLevel: 1, gridGrowEvery: 4,
    baseShowMs: 2500, msPerTile: 400,
    lives: 3, penaltyOnWrong: false, hasInputTimer: false, inputTimerSec: 0,
    tileRevealOnFail: true,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3×3 grid · Medium reveal · 2 lives · Pattern shown on error",
    startGrid: 3, startTiles: 4, tilesPerLevel: 1, gridGrowEvery: 3,
    baseShowMs: 2000, msPerTile: 300,
    lives: 2, penaltyOnWrong: false, hasInputTimer: false, inputTimerSec: 0,
    tileRevealOnFail: true,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4×4 grid · Fast reveal · 1 life · Penalty on wrong",
    startGrid: 4, startTiles: 4, tilesPerLevel: 1, gridGrowEvery: 4,
    baseShowMs: 1800, msPerTile: 250,
    lives: 1, penaltyOnWrong: true, hasInputTimer: false, inputTimerSec: 0,
    tileRevealOnFail: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "5×5 grid · Short reveal · 1 life · Input timer · No pattern hint",
    startGrid: 5, startTiles: 5, tilesPerLevel: 2, gridGrowEvery: 3,
    baseShowMs: 1500, msPerTile: 200,
    lives: 1, penaltyOnWrong: true, hasInputTimer: true, inputTimerSec: 12,
    tileRevealOnFail: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6×6 grid · Ultra-fast · 1 life · 8s input timer",
    startGrid: 6, startTiles: 6, tilesPerLevel: 2, gridGrowEvery: 2,
    baseShowMs: 1200, msPerTile: 150,
    lives: 1, penaltyOnWrong: true, hasInputTimer: true, inputTimerSec: 8,
    tileRevealOnFail: false,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function calcGrid(config: DiffConfig, level: number) {
  const extraGrows = Math.floor((level - 1) / config.gridGrowEvery);
  return Math.min(config.startGrid + extraGrows, config.id === "professional" ? 8 : 7);
}
function calcTiles(config: DiffConfig, level: number) {
  const tiles = config.startTiles + (level - 1) * config.tilesPerLevel;
  const maxTiles = calcGrid(config, level) ** 2 - 1;
  return Math.min(tiles, maxTiles);
}
function generatePattern(total: number, count: number): number[] {
  const set = new Set<number>();
  while (set.size < count) set.add(Math.floor(Math.random() * total));
  return Array.from(set);
}

/* ─────────────────────────────────────────────
   DIFFICULTY CARD
───────────────────────────────────────────── */
function DifficultyCard({ diffKey, selected, onSelect, highScore, disabled }: {
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
      {selected && <div className="absolute inset-0 opacity-5" style={{ background: DIFF_GRADIENT[diffKey] }} />}
      <div className="relative z-10 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: DIFF_GRADIENT[diffKey] }}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-xs text-slate-800">{d.label}</span>
            {selected && (
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>ACTIVE</span>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: Level {highScore}</p>}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function VisualMemoryPageClient() {
  const content = getToolContent("visual-memory", "Visual Memory");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "memorize" | "input" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [level, setLevel] = useState(1);
  const [gridSize, setGridSize] = useState(4);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [wrongTiles, setWrongTiles] = useState<number[]>([]);
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);
  const [inputTimeLeft, setInputTimeLeft] = useState(0);
  const [showFailReveal, setShowFailReveal] = useState(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({ beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 });

  const inputTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => { if (!muted) play(type); }, [muted, play]);

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => { const v = localStorage.getItem(`visual-hs-${k}`); if (v) saved[k] = parseInt(v); });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (inputTimerRef.current) clearInterval(inputTimerRef.current); }, []);

  const stopInputTimer = useCallback(() => {
    if (inputTimerRef.current) clearInterval(inputTimerRef.current);
    setInputTimeLeft(0);
  }, []);

  /* ── save high score ── */
  const saveHighScore = useCallback((lvl: number) => {
    setHighScores(prev => {
      if (lvl > prev[diffId]) {
        const updated = { ...prev, [diffId]: lvl };
        localStorage.setItem(`visual-hs-${diffId}`, lvl.toString());
        return updated;
      }
      return prev;
    });
  }, [diffId]);

  /* ── start input timer ── */
  const startInputTimer = useCallback((d: DiffConfig) => {
    if (!d.hasInputTimer) return;
    stopInputTimer();
    setInputTimeLeft(d.inputTimerSec);
    inputTimerRef.current = setInterval(() => {
      setInputTimeLeft(t => {
        if (t <= 1) {
          clearInterval(inputTimerRef.current!);
          // Timer expire = instant game over
          setPhase("gameover");
          play("error");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [stopInputTimer, play]);

  /* ── launch a level ── */
  const launchLevel = useCallback((lvl: number, d: DiffConfig) => {
    const gs = calcGrid(d, lvl);
    const tc = calcTiles(d, lvl);
    const pat = generatePattern(gs * gs, tc);
    setGridSize(gs);
    setPattern(pat);
    setUserPattern([]);
    setWrongTiles([]);
    setShowFailReveal(false);
    setPhase("memorize");
    playSound("start");

    const showMs = d.baseShowMs + tc * d.msPerTile;
    setTimeout(() => {
      setPhase("input");
      startInputTimer(d);
    }, showMs);
  }, [playSound, startInputTimer]);

  /* ── start game ── */
  const startGame = useCallback(() => {
    stopInputTimer();
    setLevel(1);
    setLivesLeft(diff.lives);
    setStreak(0);
    launchLevel(1, diff);
  }, [diff, launchLevel, stopInputTimer]);

  /* ── tile click ── */
  const handleTileClick = useCallback((idx: number) => {
    if (phase !== "input") return;
    if (userPattern.includes(idx) || wrongTiles.includes(idx)) return;

    if (pattern.includes(idx)) {
      // Correct tile
      playSound("click");
      const newUser = [...userPattern, idx];
      setUserPattern(newUser);

      if (newUser.length === pattern.length) {
        // Level complete!
        stopInputTimer();
        const newStreak = streak + 1;
        setStreak(newStreak);
        playSound("success");
        const newLevel = level + 1;
        setLevel(newLevel);
        setTimeout(() => {
          playSound("levelUp");
          launchLevel(newLevel, diff);
        }, 500);
      }
    } else {
      // Wrong tile
      setWrongTiles(prev => [...prev, idx]);
      const newLives = livesLeft - 1;

      if (diff.penaltyOnWrong || newLives <= 0) {
        stopInputTimer();
        playSound("error");
        setLivesLeft(newLives);
        if (newLives <= 0) {
          saveHighScore(level);
          setShowFailReveal(true);
          setTimeout(() => setPhase("gameover"), diff.tileRevealOnFail ? 2000 : 800);
        } else {
          // Lives remain — replay level
          setStreak(0);
          setLivesLeft(newLives);
          playSound("error");
          if (diff.tileRevealOnFail) {
            setShowFailReveal(true);
            setTimeout(() => launchLevel(level, diff), 2000);
          } else {
            setTimeout(() => launchLevel(level, diff), 600);
          }
        }
      } else {
        // Wrong but no instant death, just flash
        setLivesLeft(newLives);
        playSound("error");
      }
    }
  }, [phase, userPattern, wrongTiles, pattern, playSound, stopInputTimer, streak, level, diff, livesLeft, saveHighScore, launchLevel]);

  const currentTiles = calcTiles(diff, level);
  const showMs = diff.baseShowMs + currentTiles * diff.msPerTile;
  const isPlaying = phase === "memorize" || phase === "input";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">VISUAL MEMORY</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">SPATIAL PATTERN CALIBRATION</p>
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
                    key={key} diffKey={key} selected={diffId === key}
                    onSelect={() => { if (!isPlaying) setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={isPlaying}
                  />
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Level</div>
                  <div className="text-2xl font-mono font-bold text-slate-800 mt-0.5">{level < 10 ? `0${level}` : level}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Grid</div>
                  <div className={`text-2xl font-mono font-bold mt-0.5 ${diff.textColor}`}>{gridSize}×{gridSize}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Lives</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {Array.from({ length: diff.lives }).map((_, i) => (
                      <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Streak</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${streak >= 3 ? "text-orange-500" : "text-slate-800"}`}>
                    {streak >= 3 ? `🔥x${streak}` : `x${streak}`}
                  </div>
                </div>
              </div>

              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>Level {highScores[diffId]}</div>
                  </div>
                </div>
              )}

              {/* Tiles progress */}
              {phase === "input" && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Found</span>
                    <span className="text-[9px] font-mono text-slate-600 font-bold">{userPattern.length} / {pattern.length}</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: DIFF_GRADIENT[diffId] }}
                      animate={{ width: `${(userPattern.length / Math.max(pattern.length, 1)) * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                </div>
              )}

              {/* Input timer bar */}
              {diff.hasInputTimer && phase === "input" && inputTimeLeft > 0 && (
                <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time Left</span>
                    <span className={`text-sm font-mono font-bold ${inputTimeLeft <= 4 ? "text-red-500" : "text-slate-700"}`}>{inputTimeLeft}s</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: inputTimeLeft <= 4 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                      animate={{ width: `${(inputTimeLeft / diff.inputTimerSec) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
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
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              {/* Corner decals */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />
              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                {gridSize}×{gridSize} · {currentTiles} TILES
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.15)_50%)] bg-[size:100%_4px]" />

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT ── */}
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
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Retinal Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Memorize the highlighted tiles on the grid, then click them from memory when the pattern hides.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Scan
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. MEMORIZE + INPUT GRID ── */}
                  {(phase === "memorize" || phase === "input") && (
                    <motion.div key="grid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full flex flex-col items-center gap-4">
                      {/* Status label */}
                      <div className="flex items-center gap-2">
                        {phase === "memorize" ? (
                          <span className="text-[10px] font-mono uppercase tracking-widest animate-pulse" style={{ color: "#7c3aed" }}>
                            [ MEMORIZE {currentTiles} TILES ]
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                            Click the {pattern.length - userPattern.length} remaining tiles
                          </span>
                        )}
                      </div>

                      {/* Memorize progress bar */}
                      {phase === "memorize" && (
                        <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: DIFF_GRADIENT[diffId] }}
                            initial={{ width: "100%" }}
                            animate={{ width: "0%" }}
                            transition={{ duration: showMs / 1000, ease: "linear" }}
                          />
                        </div>
                      )}

                      {/* Grid */}
                      <div
                        className="grid gap-2 sm:gap-3 bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-inner w-full"
                        style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
                      >
                        {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                          const isHighlighted = pattern.includes(i);
                          const isUserCorrect = userPattern.includes(i);
                          const isWrong = wrongTiles.includes(i);
                          const isRevealedAfterFail = showFailReveal && isHighlighted && !isUserCorrect;

                          let tileStyle = "";
                          let tileInline: React.CSSProperties = {};
                          let isPressed = false;

                          if (phase === "memorize" && isHighlighted) {
                            // Lit up in diff color
                            tileInline = { background: DIFF_GRADIENT[diffId] };
                            tileStyle = "border-transparent shadow-lg";
                            isPressed = true;
                          } else if (isUserCorrect) {
                            tileInline = { background: DIFF_GRADIENT[diffId] };
                            tileStyle = "border-transparent shadow-md opacity-80";
                            isPressed = true;
                          } else if (isWrong) {
                            tileStyle = "bg-red-400 border-red-500 shadow-[0_0_12px_rgba(239,68,68,0.4)]";
                            isPressed = true;
                          } else if (isRevealedAfterFail) {
                            tileStyle = "bg-orange-300 border-orange-400 shadow-md animate-pulse";
                            isPressed = true;
                          } else {
                            tileStyle = "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300";
                          }

                          const isSmall = gridSize >= 6;

                          return (
                            <div key={i} className="relative aspect-square w-full">
                              <div className={`absolute inset-0 rounded-lg border-b-2 border-black/10 translate-y-0.5 ${isUserCorrect || (phase === "memorize" && isHighlighted) ? "opacity-50" : "bg-slate-100"}`} />
                              <motion.button
                                animate={{ y: isPressed ? 2 : 0 }}
                                whileHover={phase === "input" && !isUserCorrect && !isWrong ? { y: -1 } : {}}
                                whileTap={phase === "input" && !isUserCorrect && !isWrong ? { y: 2 } : {}}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                onClick={() => handleTileClick(i)}
                                disabled={phase !== "input" || isUserCorrect || isWrong}
                                className={`absolute inset-0 rounded-lg border-2 transition-all duration-75 cursor-pointer select-none disabled:cursor-default flex items-center justify-center ${tileStyle}`}
                                style={tileInline}
                              >
                                {isUserCorrect && (
                                  <span className="text-white font-bold" style={{ fontSize: isSmall ? "10px" : "14px" }}>✓</span>
                                )}
                                {isWrong && (
                                  <span className="text-white font-bold" style={{ fontSize: isSmall ? "10px" : "14px" }}>✕</span>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 opacity-20 pointer-events-none rounded-lg" />
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-600 tracking-wider">PHASE DISRUPT</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode · Reached Level {level}</p>
                        {level >= highScores[diffId] && level > 1 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — Level {level}!
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-red-100 rounded-xl p-3 font-mono text-[9px] text-red-700/90 text-left space-y-1 w-full">
                        <div>&gt; DIAG: RETINAL_SEQUENCE_DISRUPT</div>
                        <div>&gt; PATTERN BUFFER CLEARED</div>
                        <div>&gt; REBOOT TO RESTORE CONNECTION</div>
                      </div>
                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { stopInputTimer(); setPhase("select"); setLevel(1); setStreak(0); setLivesLeft(diff.lives); }}
                          className="relative group cursor-pointer focus:outline-none select-none"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <ArrowRight className="w-4 h-4" />
                            Change Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Abort */}
            {isPlaying && (
              <div className="flex justify-end">
                <button
                  onClick={() => { stopInputTimer(); saveHighScore(level); setPhase("gameover"); }}
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
            title="Visual Memory"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Scales from 3×3 (Beginner) to 8×8 (Professional) for continuous, long-term challenge.",
              "Beginner/Easy reveals the correct pattern after a wrong click so you can learn from errors.",
              "Normal+ penalises wrong clicks immediately to build precise spatial accuracy.",
              "Grid size grows automatically as you advance — keeps difficulty fresh every session.",
              "Input countdown timer on Hard/Pro trains visual recall speed under genuine pressure.",
              "Streak counter motivates consistent accuracy with 🔥 combo momentum.",
              "Per-difficulty high scores in localStorage track long-term spatial memory growth.",
            ]}
            howToPlay={[
              "Pick a difficulty — Beginner (3×3, 3 lives, hint) to Professional (6×6+, ultra-fast, timed).",
              "Watch the grid: coloured tiles light up for a few seconds — memorize their positions.",
              "When the pattern hides, click every tile that was highlighted from memory.",
              "Correct tiles glow ✓; wrong tiles flash red ✕.",
              "On Beginner/Easy a wrong click replays the level — the correct tiles briefly pulse orange as a hint.",
              "On Normal+ a wrong click costs a life and the round ends immediately.",
              "Hard & Professional modes add a countdown timer — find all tiles before it expires!",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
