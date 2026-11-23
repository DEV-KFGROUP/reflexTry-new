"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, ArrowUp, Brain, Flame, Play, RotateCcw, Shield, ShieldAlert, Star, Sword, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
type GameState = "idle" | "waiting" | "attack" | "blocked" | "hit" | "tooEarly";
type Direction = "left" | "top" | "right";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  hasCues: boolean; // Pre-attack cues (e.g. countdown or warning flash)
  hasFeints: boolean; // Fake attacks to test impulse control
  hasDirections: boolean; // Attack from Left/Right/Top (Directional Choice Reaction)
  maxMistakes: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Warning cues active · Simple click response · No feints · No strike limits",
    hasCues: true, hasFeints: false, hasDirections: false, maxMistakes: 999,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Warning cues active · Simple click response · No strike limits",
    hasCues: true, hasFeints: false, hasDirections: false, maxMistakes: 999,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "No warning cues · Pure visual reaction click · 3 lives limit",
    hasCues: false, hasFeints: false, hasDirections: false, maxMistakes: 3,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Sword feints (fake attacks) active · Click to block · 3 lives limit",
    hasCues: false, hasFeints: true, hasDirections: false, maxMistakes: 3,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Directional attacks (Left/Top/Right) · Feints active · 3 lives limit",
    hasCues: false, hasFeints: true, hasDirections: true, maxMistakes: 3,
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
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} ms</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function RPGReactionClient() {
  const { setTimeout, clearTimeout, setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [gameState, setGameState] = useState<GameState>("idle");
  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [totalReactionTime, setTotalReactionTime] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [muted, setMuted] = useState(false);

  // Reaction parameters
  const [startTime, setStartTime] = useState(0);
  const [activeDirection, setActiveDirection] = useState<Direction>("top");
  const [cueProgress, setCueProgress] = useState(0);
  const [isFeintActive, setIsFeintActive] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cueIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      const v = safeStorage.getItem(`reflextry_v2_rpgreact-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const triggerAttack = useCallback(() => {
    const d = DIFFICULTIES[diffId];

    // Determine direction
    if (d.hasDirections) {
      const dirs: Direction[] = ["left", "top", "right"];
      setActiveDirection(dirs[Math.floor(Math.random() * dirs.length)]);
    } else {
      setActiveDirection("top");
    }

    setGameState("attack");
    setStartTime(performance.now());
    playSound("click"); // Attack sound cue
  }, [diffId, playSound]);

  const startRound = useCallback(() => {
    setGameState("waiting");
    setIsFeintActive(false);
    setCueProgress(0);

    const d = DIFFICULTIES[diffId];
    const delay = Math.random() * 2000 + 1800; // 1.8s to 3.8s

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (cueIntervalRef.current) clearInterval(cueIntervalRef.current);

    // Setup Beginner countdown/progress cues
    if (d.hasCues) {
      let progress = 0;
      cueIntervalRef.current = setInterval(() => {
        progress += 100 / (delay / 100);
        setCueProgress(Math.min(100, progress));
      }, 100);
    }

    // Trigger fake attack feint
    if (d.hasFeints && Math.random() < 0.4) {
      // Setup feint after half delay
      timeoutRef.current = setTimeout(() => {
        setIsFeintActive(true);
        playSound("error"); // Flash warning feint

        // After 600ms feint, start real attack delay
        timeoutRef.current = setTimeout(() => {
          setIsFeintActive(false);
          triggerAttack();
        }, 1000);
      }, delay / 2);
    } else {
      // Normal attack delay
      timeoutRef.current = setTimeout(() => {
        triggerAttack();
      }, delay);
    }
  }, [diffId, triggerAttack, playSound]);

  const startGame = useCallback(() => {
    cancelTimers();
    setScore(0);
    setRound(0);
    setTotalReactionTime(0);
    setMistakes(0);
    setPhase("playing");
    playSound("start");
    startRound();
  }, [playSound, startRound]);

  // Action Click (Basic click anywhere, or directional arrow click)
  const handleBlock = useCallback((dir: Direction) => {
    if (phase !== "playing") return;

    if (gameState === "attack") {
      const d = DIFFICULTIES[diffId];
      
      // Professional: check direction alignment
      if (d.hasDirections && dir !== activeDirection) {
        playSound("error");
        setMistakes(m => {
          const nextM = m + 1;
          if (nextM >= diff.maxMistakes) {
            setGameState("hit");
            playSound("error");
            setTimeout(() => setPhase("result"), 1000);
          }
          return nextM;
        });
        return;
      }

      const elapsed = performance.now() - startTime;
      setReactionTime(elapsed);
      setTotalReactionTime(t => t + elapsed);
      setRound(r => r + 1);

      // Score compiles on reaction latency
      const bonus = elapsed < 200 ? 200 : elapsed < 300 ? 150 : elapsed < 400 ? 100 : 50;
      setScore(s => s + bonus);
      setGameState("blocked");
      playSound("success");

    } else if (gameState === "waiting") {
      // Too early misfire
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cueIntervalRef.current) clearInterval(cueIntervalRef.current);

      setGameState("tooEarly");
      playSound("error");
      
      setMistakes(m => {
        const nextM = m + 1;
        if (nextM >= diff.maxMistakes) {
          setTimeout(() => setPhase("result"), 1000);
        }
        return nextM;
      });
    }
  }, [phase, gameState, diffId, activeDirection, startTime, playSound, diff]);

  useEffect(() => {
    if (phase === "result") {
      // Save high score (lowest average latency)
      const avg = round > 0 ? Math.round(totalReactionTime / round) : 9999;
    }
  }, [phase, round, totalReactionTime, diffId]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cueIntervalRef.current) clearInterval(cueIntervalRef.current);
    };
  }, []);

  const averageTime = round > 0 ? Math.round(totalReactionTime / round) : 0;

  // Direction angle compiler
  const getDirectionRotation = () => {
    if (activeDirection === "left") return -90;
    if (activeDirection === "right") return 90;
    return 0; // top
  };


  const progress = useToolProgress({
    toolId: "rpg-reaction", phase: phase, difficulty: diffId,
    value: averageTime, unit: "ms", higherIsBetter: false,
    terminal: ["result"], idle: ["idle"], recordKey: "reflextry_v2_rpgreact-hs-",
    setHighScores, cancelTimers, reset: () => { setPhase("idle"); setGameState("idle"); },
    eligible: true,
  });

  return (
    <div data-idle={phase === "idle"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/gaming/reaction" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Hero'S Reflex</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">DEFENSIVE COMBAT BLOCK CALIBRATOR</p>
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
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Rounds</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">{round}</div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - mistakes} ❤️`}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Avg Time</div>
                  <div className="text-xl font-mono font-bold text-fuchsia-600 mt-0.5">{averageTime}ms</div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Avg Latency ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} ms</div>
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
                DIRECTIONAL MODE: {diff.hasDirections ? "ACTIVE" : "FALSE"}
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
                          <Shield className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Reflex Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Deploy defensive shield blocks immediately on incoming attacks. Beware of fake attack feints and directional strikes.
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
                      className="w-full min-h-[400px] bg-slate-900 border border-slate-800 shadow-inner rounded-[2rem] overflow-hidden flex flex-col items-center justify-center relative touch-none select-none"
                      onPointerDown={() => { if (!diff.hasDirections) handleBlock("top"); }}
                    >
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                      {/* Beginner progress countdown cue */}
                      {diff.hasCues && gameState === "waiting" && (
                        <div className="absolute top-6 inset-x-6 flex flex-col items-center">
                          <span className="text-[11px] font-mono text-[#57554E] dark:text-slate-400 tracking-widest uppercase mb-1">Optic Locking...</span>
                          <div className="w-full max-w-xs bg-slate-800 h-1.5 rounded-full overflow-hidden border border-slate-700">
                            <div className="h-full bg-cyan-500 transition-all duration-75" style={{ width: `${cueProgress}%` }} />
                          </div>
                        </div>
                      )}

                      {/* Display warning feint icon */}
                      {isFeintActive && (
                        <motion.div initial={{ scale: 0.7 }} animate={{ scale: 1 }} exit={{ scale: 0.7 }} className="absolute flex flex-col items-center">
                          <ShieldAlert className="w-24 h-24 text-amber-500 animate-pulse drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
                          <span className="text-[10px] font-mono text-amber-500 font-bold uppercase tracking-widest mt-2 animate-ping">
                            FEINT DETECTED! HOLD BLOCK
                          </span>
                        </motion.div>
                      )}

                      {/* Waiting screen center shield */}
                      {gameState === "waiting" && !isFeintActive && (
                        <div className="flex flex-col items-center space-y-3">
                          <Shield className="w-20 h-20 text-[#3F3E39] animate-pulse" />
                          <span className="text-[10px] font-mono text-[#78756C] uppercase tracking-widest">
                            {diff.hasDirections ? "WAIT FOR DIRECTIONAL SIGNAL..." : "CLICK ANYWHERE TO BLOCK STRIKE..."}
                          </span>
                        </div>
                      )}

                      {/* Attack state (Sword icon pops up) */}
                      {gameState === "attack" && (
                        <motion.div
                          key={activeDirection}
                          initial={{ scale: 0.7, rotate: getDirectionRotation() }}
                          animate={{ scale: 1, rotate: getDirectionRotation() }}
                          className="flex flex-col items-center"
                        >
                          <Sword className="w-32 h-32 text-red-500 drop-shadow-[0_0_24px_rgba(239,68,68,0.45)] animate-bounce" />
                          <span className="text-xl font-mono font-black text-red-500 uppercase tracking-widest mt-4">
                            STRIKE {activeDirection.toUpperCase()}!
                          </span>
                        </motion.div>
                      )}

                      {/* Blocked state display */}
                      {gameState === "blocked" && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center space-y-3">
                          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-400 rounded-full flex items-center justify-center text-emerald-500">
                            <Shield className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-mono font-black text-emerald-500 uppercase tracking-wider">Blocked Success!</div>
                            <div className="text-3xl font-mono font-black text-white mt-1">{reactionTime}ms</div>
                          </div>
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); startRound(); }}
                            className="min-h-[48px] px-7 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-mono text-xs sm:text-sm font-bold rounded-xl border border-emerald-400 shadow-md cursor-pointer transition-colors touch-manipulation"
                          >
                            Next Strike →
                          </button>
                        </motion.div>
                      )}

                      {/* Misfire / Too early state */}
                      {gameState === "tooEarly" && (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="flex flex-col items-center space-y-3">
                          <div className="w-14 h-14 bg-red-500/10 border border-red-400 rounded-full flex items-center justify-center text-red-500 animate-bounce">
                            <AlertTriangle className="w-6 h-6" />
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-mono font-black text-red-500 uppercase tracking-wider">Misfire Strike!</div>
                            <p className="text-[10px] text-[#78756C] font-mono mt-1">You blocked too early.</p>
                          </div>
                          <button
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => { e.stopPropagation(); startRound(); }}
                            className="min-h-[48px] px-7 py-3 bg-red-500 hover:bg-red-400 text-white font-mono text-xs sm:text-sm font-bold rounded-xl border border-red-400 shadow-md cursor-pointer transition-colors touch-manipulation"
                          >
                            Reset Shield
                          </button>
                        </motion.div>
                      )}

                      {/* Directional Action Control pad (Professional mode) */}
                      {diff.hasDirections && (gameState === "attack" || gameState === "waiting") && (
                        <div className="absolute bottom-4 inset-x-3 sm:inset-x-6 grid grid-cols-3 gap-2 sm:gap-2.5 z-20">
                          {/* Left Shield */}
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            onPointerDown={(e) => { e.stopPropagation(); handleBlock("left"); }}
                            onClick={(e) => { e.stopPropagation(); if (e.detail === 0) handleBlock("left"); }}
                            className="min-h-[58px] px-1.5 sm:px-4 py-3 bg-slate-800 border border-slate-700 hover:border-cyan-500 text-white rounded-xl font-mono text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-md touch-none whitespace-nowrap"
                          >
                            <ArrowLeft className="w-4 h-4 shrink-0" />
                            <span>BLOCK LEFT</span>
                          </motion.button>

                          {/* Top Shield */}
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            onPointerDown={(e) => { e.stopPropagation(); handleBlock("top"); }}
                            onClick={(e) => { e.stopPropagation(); if (e.detail === 0) handleBlock("top"); }}
                            className="min-h-[58px] px-1.5 sm:px-4 py-3 bg-slate-800 border border-slate-700 hover:border-cyan-500 text-white rounded-xl font-mono text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-md touch-none whitespace-nowrap"
                          >
                            <ArrowUp className="w-4 h-4 shrink-0" />
                            <span>BLOCK TOP</span>
                          </motion.button>

                          {/* Right Shield */}
                          <motion.button
                            whileTap={{ scale: 0.94 }}
                            onPointerDown={(e) => { e.stopPropagation(); handleBlock("right"); }}
                            onClick={(e) => { e.stopPropagation(); if (e.detail === 0) handleBlock("right"); }}
                            className="min-h-[58px] px-1.5 sm:px-4 py-3 bg-slate-800 border border-slate-700 hover:border-cyan-500 text-white rounded-xl font-mono text-[10px] sm:text-xs font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 cursor-pointer shadow-md touch-none whitespace-nowrap"
                          >
                            <ArrowRight className="w-4 h-4 shrink-0 sm:order-2" />
                            <span>BLOCK RIGHT</span>
                          </motion.button>
                        </div>
                      )}
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
                        {averageTime <= highScores[diffId] && round > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {averageTime}ms!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Average Latency</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{averageTime} ms</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase mb-1">Accumulated Score</div>
                          <div className="text-lg text-[#3F3E39] font-mono font-bold">{score} pts</div>
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
                    if (timeoutRef.current) clearTimeout(timeoutRef.current);
                    if (cueIntervalRef.current) clearInterval(cueIntervalRef.current);
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
