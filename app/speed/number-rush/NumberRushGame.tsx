"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Hash
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
  totalNumbers: number; // 10, 15, 20, 30, or 40 numbers
  maxMistakes: number;
  hasShuffling: boolean; // Shuffles remaining numbers on correct click
  hasDecoys: boolean; // Includes red decoy mines
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "10 numbers · Easy scan · No shuffles · No strike limits",
    totalNumbers: 10, maxMistakes: 999, hasShuffling: false, hasDecoys: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "15 numbers · Standard scan · No shuffles · No strike limits",
    totalNumbers: 15, maxMistakes: 999, hasShuffling: false, hasDecoys: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "20 numbers · Quick scan · 5 lives limit",
    totalNumbers: 20, maxMistakes: 5, hasShuffling: false, hasDecoys: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "30 numbers · Shuffles coordinates on correct hits · 3 lives limit",
    totalNumbers: 30, maxMistakes: 3, hasShuffling: true, hasDecoys: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "40 numbers · Shuffles on hit + Red decoy bomb mines · 3 lives limit",
    totalNumbers: 40, maxMistakes: 3, hasShuffling: true, hasDecoys: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface NumberTile {
  id: number;
  value: number;
  x: number; // percentage left
  y: number; // percentage top
  found: boolean;
  isDecoy: boolean;
}

/* ─────────────────────────────────────────────
   TILE COORDINATE GENERATOR (prevents overlap)
───────────────────────────────────────────── */
function generateTilePositions(count: number, decoysCount: number): NumberTile[] {
  const tiles: NumberTile[] = [];
  const used: { x: number; y: number }[] = [];

  const totalItems = count + decoysCount;
  for (let i = 1; i <= totalItems; i++) {
    const isDecoy = i > count;
    let x = 0, y = 0;
    let attempts = 0;

    do {
      x = 5 + Math.random() * 85;
      y = 5 + Math.random() * 85;
      attempts++;
    } while (
      attempts < 80 &&
      used.some(p => Math.abs(p.x - x) < 11 && Math.abs(p.y - y) < 11)
    );

    used.push({ x, y });
    tiles.push({
      id: i,
      value: isDecoy ? -99 : i, // decoy value placeholder
      x,
      y,
      found: false,
      isDecoy
    });
  }
  return tiles;
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
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {(highScore / 1000).toFixed(2)}s</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function NumberRushGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [nextNumber, setNextNumber] = useState(1);
  const [timer, setTimer] = useState(0);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [muted, setMuted] = useState(false);

  // Tiles State
  const [tiles, setTiles] = useState<NumberTile[]>([]);
  const startTimeRef = useRef(0);
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
      const v = localStorage.getItem(`numrush-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => setTimer(Date.now() - startTimeRef.current), 50);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [phase]);

  const startGame = useCallback(() => {
    const decoyCount = diff.hasDecoys ? 5 : 0;
    const newTiles = generateTilePositions(diff.totalNumbers, decoyCount);
    
    setTiles(newTiles);
    setNextNumber(1);
    setWrongClicks(0);
    startTimeRef.current = Date.now();
    setTimer(0);
    setPhase("playing");
    playSound("start");
  }, [diff, playSound]);

  const shuffleRemainingTiles = useCallback((currentFoundVal: number) => {
    setTiles(prev => {
      // Find remaining unfound tiles
      const unfound = prev.filter(t => !t.found && t.value !== currentFoundVal);
      const used: { x: number; y: number }[] = [];
      
      return prev.map(t => {
        if (t.found || t.value === currentFoundVal) return t;
        
        let x = 0, y = 0;
        let attempts = 0;
        do {
          x = 5 + Math.random() * 85;
          y = 5 + Math.random() * 85;
          attempts++;
        } while (
          attempts < 80 &&
          used.some(p => Math.abs(p.x - x) < 11 && Math.abs(p.y - y) < 11)
        );
        
        used.push({ x, y });
        return { ...t, x, y };
      });
    });
  }, []);

  const handleTileClick = useCallback((tile: NumberTile, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phase !== "playing") return;

    if (tile.isDecoy) {
      playSound("error");
      setWrongClicks(w => {
        const nextW = w + 1;
        if (nextW >= diff.maxMistakes) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("result");
          playSound("error");
        }
        return nextW;
      });
      return;
    }

    if (tile.value !== nextNumber) {
      playSound("error");
      setWrongClicks(w => {
        const nextW = w + 1;
        if (nextW >= diff.maxMistakes) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("result");
          playSound("error");
        }
        return nextW;
      });
      return;
    }

    playSound("click");
    
    // Set found state
    setTiles(prev => prev.map(t => t.id === tile.id ? { ...t, found: true } : t));

    if (tile.value === diff.totalNumbers) {
      const finalTime = Date.now() - startTimeRef.current;
      setTimer(finalTime);
      playSound("success");
      setPhase("result");

      // Save high score (lowest time in ms)
      setHighScores(hs => {
        const prevHs = hs[diffId];
        if (prevHs === 0 || finalTime < prevHs) {
          localStorage.setItem(`numrush-hs-${diffId}`, finalTime.toString());
          return { ...hs, [diffId]: finalTime };
        }
        return hs;
      });
    } else {
      setNextNumber(tile.value + 1);
      if (diff.hasShuffling) {
        shuffleRemainingTiles(tile.value);
      }
    }
  }, [phase, nextNumber, diff, diffId, playSound, shuffleRemainingTiles]);

  // Clicked empty background miss
  const handleBoardMiss = useCallback(() => {
    if (phase !== "playing") return;
    playSound("error");
    setWrongClicks(w => {
      const nextW = w + 1;
      if (nextW >= diff.maxMistakes) {
        if (timerRef.current) clearInterval(timerRef.current);
        setPhase("result");
        playSound("error");
      }
      return nextW;
    });
  }, [phase, diff, playSound]);

  const formatTime = (ms: number) => {
    const s = ms / 1000;
    return s.toFixed(2);
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">NUMBER RUSH</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">SEQUENTIAL SCANNING ALIGNMENT</p>
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
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Next Target</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">FIND {nextNumber}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Progress</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{nextNumber - 1}/{diff.totalNumbers}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Strikes Limit</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - wrongClicks} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Elapsed Time</div>
                  <div className="text-xl font-mono font-bold text-fuchsia-600 mt-0.5">{formatTime(timer)}s</div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Time ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{formatTime(highScores[diffId])}s</div>
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
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                ARENA // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                COORDINATE DECK: SHUFFLING {diff.hasShuffling ? "ACTIVE" : "FALSE"}
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
                          <Hash className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Number Scanning</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Locate and tap numbers sequentially starting from 1 to {diff.totalNumbers}. Do not click out of order or hit bomb decoys!
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Scanner Board
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
                      className="relative w-full h-[440px] bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden"
                    >
                      {/* Technical visual scan lines */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

                      {tiles.map(tile => {
                        let activeStyles = "bg-white border-slate-200 text-slate-700 hover:brightness-105 active:scale-95";
                        let depthStyles = "bg-slate-350";
                        
                        if (tile.value === nextNumber) {
                          activeStyles = "bg-cyan-500 border-cyan-400 text-white shadow-[0_4px_12px_rgba(6,182,212,0.3)] animate-pulse";
                          depthStyles = "bg-cyan-700";
                        } else if (tile.isDecoy) {
                          activeStyles = "bg-red-500 border-red-400 text-white shadow-[0_4px_12px_rgba(239,68,68,0.3)]";
                          depthStyles = "bg-red-700";
                        }

                        return (
                          <motion.div
                            key={tile.id}
                            layout
                            className="absolute"
                            style={{ left: `${tile.x}%`, top: `${tile.y}%`, transform: "translate(-50%, -50%)" }}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{
                              scale: tile.found ? 0 : 1,
                              opacity: tile.found ? 0 : 1,
                            }}
                            transition={{ type: "spring", stiffness: 350, damping: 20 }}
                          >
                            <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex items-center justify-center">
                              {/* 3D base */}
                              <div className={`absolute inset-0 rounded-xl translate-y-1 border-b-2 border-black/20 ${depthStyles}`} />
                              {/* Keycap */}
                              <button
                                onClick={(e) => handleTileClick(tile, e)}
                                className={`absolute inset-0 rounded-xl border-2 font-mono font-black text-[11px] sm:text-xs flex items-center justify-center select-none cursor-pointer active:translate-y-1 transition-all ${activeStyles}`}
                              >
                                {tile.isDecoy ? "💣" : tile.value}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">
                          {nextNumber - 1 >= diff.totalNumbers ? "CALIBRATION_COMPLETE" : "CALIBRATION_FAILED"}
                        </div>
                        <p className="text-xs font-mono text-slate-500">
                          {nextNumber - 1 >= diff.totalNumbers
                            ? `${diff.label} scanning completed successfully.`
                            : `Strikes threshold exceeded during calibration.`
                          }
                        </p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Time Elapsed</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">
                            {formatTime(timer)}s
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Progress</div>
                          <div className="text-base text-slate-700 font-mono font-bold">
                            {nextNumber - 1} / {diff.totalNumbers} Found
                          </div>
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
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("result"); }}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
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
