"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, RotateCcw, Trophy, Zap, Target, AlertTriangle,
  Shield, Star, Flame, Volume2, VolumeX, ArrowRight, Brain
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
type MoleType = "normal" | "bomb" | "golden" | "slomo";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  holesCount: number; // 4, 9, 16, or 25 holes
  spawnRateMs: number;
  lifespanMs: number;
  maxLives: number;
  hasDecoys: boolean; // Bomb and Golden moles included
  hasPowerups: boolean; // Slomo green moles included
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2x2 grid (4 holes) · Slow speed · 3 lives · No bombs",
    holesCount: 4, spawnRateMs: 1500, lifespanMs: 1800, maxLives: 3, hasDecoys: false, hasPowerups: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3x3 grid (9 holes) · Standard speed · 3 lives · No bombs",
    holesCount: 9, spawnRateMs: 1200, lifespanMs: 1500, maxLives: 3, hasDecoys: false, hasPowerups: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "3x3 grid (9 holes) · Fast speed · 5 lives · No bombs",
    holesCount: 9, spawnRateMs: 1000, lifespanMs: 1200, maxLives: 5, hasDecoys: false, hasPowerups: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "4x4 grid (16 holes) · Quick spawn · Bomb decoys (-300pts) · 5 lives",
    holesCount: 16, spawnRateMs: 750, lifespanMs: 900, maxLives: 5, hasDecoys: true, hasPowerups: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "5x5 grid (25 holes) · Bomb decoys + Green Slo-Mo Moles · 5 lives",
    holesCount: 25, spawnRateMs: 500, lifespanMs: 650, maxLives: 5, hasDecoys: true, hasPowerups: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface Mole {
  id: number;
  hole: number;
  type: MoleType;
  appearedAt: number;
  lifespan: number;
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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} pts</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN GAME
───────────────────────────────────────────── */
export default function WhackAMoleGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [muted, setMuted] = useState(false);

  // Mole state
  const [moles, setMoles] = useState<Mole[]>([]);
  const moleIdRef = useRef(0);

  // Powerups state
  const [isSlomoActive, setIsSlomoActive] = useState(false);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`whackamole-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
      if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
    };
  }, []);

  // Time buffer countdown loop
  useEffect(() => {
    if (phase !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          clearInterval(spawnTimerRef.current!);
          playSound("levelUp");
          setPhase("result");

          // Save high score
          setHighScores(hs => {
            if (score > hs[diffId]) {
              localStorage.setItem(`whackamole-hs-${diffId}`, score.toString());
              return { ...hs, [diffId]: score };
            }
            return hs;
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [phase, score, diffId, playSound]);

  // Spawning moles loop
  useEffect(() => {
    if (phase !== "playing") return;

    // Apply Slo-mo logic (spawning rate is halved)
    const activeSpawnRate = isSlomoActive ? diff.spawnRateMs * 2.2 : diff.spawnRateMs;

    spawnTimerRef.current = setInterval(() => {
      // Pick random hole index that does not contain a mole currently
      setMoles(prev => {
        if (prev.length >= diff.holesCount) return prev;

        const occupiedHoles = prev.map(m => m.hole);
        const freeHoles = Array.from({ length: diff.holesCount }, (_, i) => i).filter(h => !occupiedHoles.includes(h));

        if (freeHoles.length === 0) return prev;
        const hole = freeHoles[Math.floor(Math.random() * freeHoles.length)];

        // Decide mole type
        let type: MoleType = "normal";
        if (diff.hasDecoys) {
          const roll = Math.random();
          if (roll < 0.22) {
            type = "bomb";
          } else if (roll < 0.35) {
            type = "golden";
          } else if (diff.hasPowerups && roll < 0.43) {
            type = "slomo";
          }
        }

        moleIdRef.current++;
        const activeLifespan = isSlomoActive ? diff.lifespanMs * 2.0 : diff.lifespanMs;
        const newMole: Mole = {
          id: moleIdRef.current,
          hole,
          type,
          appearedAt: Date.now(),
          lifespan: activeLifespan
        };
        return [...prev, newMole];
      });

    }, activeSpawnRate);

    return () => clearInterval(spawnTimerRef.current!);
  }, [phase, diff, isSlomoActive]);

  // Removing expired moles loop
  useEffect(() => {
    if (phase !== "playing") return;
    expiryTimerRef.current = setInterval(() => {
      const now = Date.now();
      setMoles(prev => {
        const expired = prev.filter(m => now - m.appearedAt >= m.lifespan);
        
        // Moles of type "normal" or "golden" expiring count as a miss penalty
        const missedTargets = expired.filter(m => m.type === "normal" || m.type === "golden").length;
        if (missedTargets > 0) {
          setMisses(m => m + missedTargets);
          setLives(l => {
            const nextL = l - missedTargets;
            if (nextL <= 0) {
              // Trigger sudden death gameover
              clearInterval(timerRef.current!);
              clearInterval(spawnTimerRef.current!);
              playSound("error");
              setPhase("result");
              return 0;
            }
            return nextL;
          });
        }
        return prev.filter(m => now - m.appearedAt < m.lifespan);
      });
    }, 100);
    return () => clearInterval(expiryTimerRef.current!);
  }, [phase, playSound]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
    if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);

    const d = DIFFICULTIES[diffId];
    setScore(0);
    setHits(0);
    setMisses(0);
    setLives(d.maxLives);
    setTimeLeft(30);
    setMoles([]);
    setIsSlomoActive(false);
    moleIdRef.current = 0;
    setPhase("playing");
    playSound("start");
  }, [diffId, playSound]);

  const whackMole = useCallback((moleId: number, type: MoleType, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent registering empty hole clicks
    if (phase !== "playing") return;

    setMoles(prev => prev.filter(m => m.id !== moleId));

    if (type === "bomb") {
      setScore(s => Math.max(0, s - 300));
      playSound("error");
      // Bomb strike deducts 1 life
      setLives(l => {
        const nextL = l - 1;
        if (nextL <= 0) {
          setPhase("result");
          playSound("error");
          return 0;
        }
        return nextL;
      });
    } else if (type === "golden") {
      setHits(h => h + 1);
      setScore(s => s + 300);
      playSound("success");
    } else if (type === "slomo") {
      setHits(h => h + 1);
      setScore(s => s + 100);
      playSound("success");
      
      // Trigger Slow motion state for 3 seconds
      setIsSlomoActive(true);
      setTimeout(() => {
        setIsSlomoActive(false);
      }, 3000);
    } else {
      // Normal mole
      setHits(h => h + 1);
      setScore(s => s + 100);
      playSound("click");
    }
  }, [phase, playSound]);

  // Clicked empty background
  const handleBoardMiss = useCallback(() => {
    if (phase !== "playing") return;
    setScore(s => Math.max(0, s - 50));
    playSound("error");
  }, [phase, playSound]);

  const totalClicks = hits + misses;
  const accuracyPercent = totalClicks > 0 ? Math.round((hits / totalClicks) * 100) : 100;

  // Grid styling dynamic maps
  const getGridColsClass = () => {
    if (diff.holesCount === 4) return "grid-cols-2 max-w-xs";
    if (diff.holesCount === 9) return "grid-cols-3 max-w-sm";
    if (diff.holesCount === 16) return "grid-cols-4 max-w-md";
    return "grid-cols-5 max-w-lg"; // 25 holes
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">GRID WHACK</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">SPATIAL TARGET ALIGNER</p>
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Score</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Lives Remaining</div>
                  <div className="text-xl font-mono font-bold text-red-500 mt-0.5">{lives} ❤️</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1">{accuracyPercent}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time Remaining</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-850"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Slo-Mo active powerup state */}
              {isSlomoActive && (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="mt-3 bg-emerald-50 border border-emerald-250 p-2.5 rounded-xl text-center text-[10px] font-mono text-emerald-700 font-bold tracking-wider animate-pulse uppercase">
                  ⚡ Slo-Mo Powerup Active!
                </motion.div>
              )}

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Score ({diff.label})</div>
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
                DECK: {diff.holesCount} SLOTS
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
                          <Target className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Mole Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Whack the emerging molecular moles as fast as possible. Avoid hit bombs and empty holes.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Gallery
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
                      className={`grid gap-4.5 p-5 bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] w-full justify-center ${getGridColsClass()}`}
                    >
                      {Array.from({ length: diff.holesCount }).map((_, holeIndex) => {
                        const activeMole = moles.find(m => m.hole === holeIndex);
                        
                        // Select styling values based on mole type
                        let moleBg = "bg-cyan-500 border-white shadow-[0_4px_12px_rgba(6,182,212,0.35)]";
                        if (activeMole) {
                          if (activeMole.type === "bomb") moleBg = "bg-red-500 border-white shadow-[0_4px_12px_rgba(239,68,68,0.35)]";
                          if (activeMole.type === "golden") moleBg = "bg-amber-400 border-white shadow-[0_4px_12px_rgba(245,158,11,0.35)]";
                          if (activeMole.type === "slomo") moleBg = "bg-emerald-500 border-white shadow-[0_4px_12px_rgba(16,185,129,0.35)]";
                        }

                        return (
                          <div
                            key={holeIndex}
                            className="aspect-square rounded-full bg-slate-900 border border-slate-800 shadow-[inset_0_4px_8px_rgba(0,0,0,0.4)] flex items-center justify-center relative overflow-hidden min-h-[50px] min-w-[50px]"
                          >
                            <AnimatePresence>
                              {activeMole && (
                                <motion.button
                                  key={activeMole.id}
                                  initial={{ y: 55, scale: 0.7 }}
                                  animate={{ y: 0, scale: 1 }}
                                  exit={{ y: 55, scale: 0.7, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 350, damping: 15 }}
                                  onClick={(e) => whackMole(activeMole.id, activeMole.type, e)}
                                  className={`absolute inset-x-1.5 bottom-1.5 aspect-square rounded-full border-4 cursor-pointer flex items-center justify-center active:scale-90 hover:brightness-105 ${moleBg}`}
                                >
                                  {/* Center crosshair dot */}
                                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                </motion.button>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode whacking completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Hits / Accuracy</div>
                          <div className="text-base text-slate-700 font-mono font-bold">{hits} hits ({accuracyPercent}%)</div>
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
                          onClick={() => { setPhase("idle"); setScore(0); }}
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
                    if (spawnTimerRef.current) clearInterval(spawnTimerRef.current);
                    if (expiryTimerRef.current) clearInterval(expiryTimerRef.current);
                    setPhase("result");
                  }}
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
