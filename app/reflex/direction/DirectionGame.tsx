"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUp, Play, RotateCcw,
  Trophy, AlertTriangle, Shield, Star, Zap, Flame, Volume2, VolumeX, Brain,
  ChevronLeft, ChevronRight, ChevronUp, ChevronDown
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
  timeLimitSec: number;
  missPenaltyScore: number;
  hasColorInversion: boolean; // Green = direct, Red = opposite
  hasFlankers: boolean; // conflict arrows around center (e.g. << > <<)
  hasPromptModifiers: boolean; // "DIRECT" vs "INVERSE" text switches
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Standard arrows · 45s timer · No penalties",
    timeLimitSec: 45, missPenaltyScore: 0,
    hasColorInversion: false, hasFlankers: false, hasPromptModifiers: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Standard arrows · 30s timer · No penalties",
    timeLimitSec: 30, missPenaltyScore: 0,
    hasColorInversion: false, hasFlankers: false, hasPromptModifiers: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Color-coded (Green = direct, Red = opposite) · -50 penalty",
    timeLimitSec: 30, missPenaltyScore: 50,
    hasColorInversion: true, hasFlankers: false, hasPromptModifiers: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Color rules + Conflict flanker decoys (e.g. << > <<) · -100 penalty",
    timeLimitSec: 30, missPenaltyScore: 100,
    hasColorInversion: true, hasFlankers: true, hasPromptModifiers: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Flankers + Random 'DIRECT' / 'INVERSE' mode modifiers · -150 penalty",
    timeLimitSec: 30, missPenaltyScore: 150,
    hasColorInversion: true, hasFlankers: true, hasPromptModifiers: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type ArrowDirection = "up" | "down" | "left" | "right";

const DIRECTION_OPPOSITES: Record<ArrowDirection, ArrowDirection> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};

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
export default function DirectionGame() {
  const content = getToolContent("directional-reflex", "Directional Reflex Test");
  const { play } = useGameSound();

  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [direction, setDirection] = useState<ArrowDirection>("up");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [hitsCount, setHitsCount] = useState(0);
  const [missesCount, setMissesCount] = useState(0);
  const [muted, setMuted] = useState(false);

  // Advanced mechanics state
  const [arrowColor, setArrowColor] = useState<"green" | "red">("green"); // green = direct, red = opposite
  const [flankerDirection, setFlankerDirection] = useState<ArrowDirection>("up"); // decoy surrounding arrows
  const [promptMode, setPromptMode] = useState<"direct" | "inverse">("direct"); // Pro text modifier

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`direction-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const newDirection = useCallback(() => {
    const dirs: ArrowDirection[] = ["up", "down", "left", "right"];
    const mainDir = dirs[Math.floor(Math.random() * dirs.length)];
    setDirection(mainDir);

    const d = DIFFICULTIES[diffId];

    if (d.hasColorInversion) {
      setArrowColor(Math.random() > 0.5 ? "green" : "red");
    } else {
      setArrowColor("green");
    }

    if (d.hasFlankers) {
      // 50% chance flankers point same direction (congruent), 50% opposite/different (incongruent)
      setFlankerDirection(Math.random() > 0.5 ? mainDir : dirs[Math.floor(Math.random() * dirs.length)]);
    }

    if (d.hasPromptModifiers) {
      setPromptMode(Math.random() > 0.5 ? "direct" : "inverse");
    } else {
      setPromptMode("direct");
    }
  }, [diffId]);

  const startGame = useCallback(() => {
    setScore(0);
    setHitsCount(0);
    setMissesCount(0);
    setTimeLeft(diff.timeLimitSec);
    setGameState("playing");
    newDirection();
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
              localStorage.setItem(`direction-hs-${diffId}`, score.toString());
              return { ...hs, [diffId]: score };
            }
            return hs;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, diff, score, playSound, newDirection]);

  const handleInput = useCallback((inputDir: ArrowDirection) => {
    if (gameState !== "playing") return;

    // Evaluate correct target direction based on rules
    let expectedDir: ArrowDirection = direction;

    // Rule 1: Prompt Modifier (Professional)
    if (diff.hasPromptModifiers) {
      if (promptMode === "inverse") {
        expectedDir = DIRECTION_OPPOSITES[expectedDir];
      }
    }

    // Rule 2: Color inversion (Normal / Hard / Pro)
    if (diff.hasColorInversion) {
      if (arrowColor === "red") {
        expectedDir = DIRECTION_OPPOSITES[expectedDir];
      }
    }

    if (inputDir === expectedDir) {
      setHitsCount(h => h + 1);
      setScore(s => s + 100);
      playSound("success");
      newDirection();
    } else {
      setMissesCount(m => m + 1);
      setScore(s => Math.max(0, s - diff.missPenaltyScore));
      playSound("error");
    }
  }, [gameState, direction, arrowColor, promptMode, diff, playSound, newDirection]);

  // Prevent scrolling with arrows & register keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        const dir = e.key.replace("Arrow", "").toLowerCase() as ArrowDirection;
        handleInput(dir);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleInput]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalClicks = hitsCount + missesCount;
  const accuracyPercent = totalClicks > 0 ? Math.round((hitsCount / totalClicks) * 100) : 100;

  // Arrow icons mapping
  const getArrowIcon = (dir: ArrowDirection, colorClass: string, isCenter: boolean) => {
    const size = isCenter ? "w-16 h-16 md:w-20 md:h-20" : "w-8 h-8 md:w-10 md:h-10 opacity-40";
    switch (dir) {
      case "up": return <ArrowBigUp className={`${size} ${colorClass}`} />;
      case "down": return <ArrowBigDown className={`${size} ${colorClass}`} />;
      case "left": return <ArrowBigLeft className={`${size} ${colorClass}`} />;
      case "right": return <ArrowBigRight className={`${size} ${colorClass}`} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">VECTOR REFLEX</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">SPATIAL VECTOR ALIGNMENT</p>
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
                    onSelect={() => { if (gameState === "idle" || gameState === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={gameState === "playing"}
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracyPercent}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Hits/Misses</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1">
                    {hitsCount} <span className="text-slate-400 font-normal">/</span> <span className="text-red-500">{missesCount}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time Left</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record display */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Record ({diff.label})</div>
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
                VECTOR ENGINE: SYNCHRONIZED
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
                          <div className="flex gap-1.5 rotate-45">
                            <ArrowBigUp className="w-6 h-6 text-violet-600" />
                            <ArrowBigRight className="w-6 h-6 text-violet-600" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Vector Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Replicate arrow directions using keyboard arrow keys. Fast execution is recommended.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Vector
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
                      className="space-y-8 text-center w-full max-w-md flex flex-col items-center justify-center"
                    >
                      {/* Rules banner display */}
                      <div className="space-y-2 w-full flex flex-col items-center">
                        {/* Pro Prompt Mode banner */}
                        {diff.hasPromptModifiers && (
                          <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border shadow-sm ${
                            promptMode === "direct"
                              ? "bg-emerald-50 border-emerald-250 text-emerald-700"
                              : "bg-rose-50 border-rose-250 text-rose-700 animate-pulse"
                          }`}>
                            ACTION RULE: {promptMode.toUpperCase()} DIRECTION
                          </span>
                        )}

                        {/* Color Code rules banner */}
                        {diff.hasColorInversion && (
                          <span className="px-3.5 py-1 rounded-full text-[10px] font-mono font-semibold border border-slate-200 bg-slate-50 text-slate-500 shadow-sm">
                            GREEN = DIRECT · RED = INVERSE OPPOSITE
                          </span>
                        )}
                      </div>

                      {/* Flankers / Center arrow sockets */}
                      <div className="flex items-center justify-center gap-4 bg-slate-50 border border-slate-250 rounded-3xl p-6 md:p-8 min-w-[280px] shadow-inner relative">
                        {/* Flanker Left */}
                        {diff.hasFlankers && (
                          <div className="flex gap-1">
                            {getArrowIcon(flankerDirection, "text-slate-300", false)}
                            {getArrowIcon(flankerDirection, "text-slate-300", false)}
                          </div>
                        )}

                        {/* Center Target Arrow */}
                        <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-200">
                          {getArrowIcon(
                            direction,
                            arrowColor === "green"
                              ? "text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                              : "text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.3)]",
                            true
                          )}
                        </div>

                        {/* Flanker Right */}
                        {diff.hasFlankers && (
                          <div className="flex gap-1">
                            {getArrowIcon(flankerDirection, "text-slate-300", false)}
                            {getArrowIcon(flankerDirection, "text-slate-300", false)}
                          </div>
                        )}
                      </div>

                      {/* Keyboard Info */}
                      <p className="hidden md:block text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                        Press keyboard arrow keys
                      </p>

                      {/* Mobile D-Pad controller keycaps */}
                      <div className="grid grid-cols-3 gap-3 max-w-[200px] mx-auto md:hidden w-full">
                        <div />
                        {/* UP */}
                        <button
                          onClick={() => handleInput("up")}
                          aria-label="Move Up"
                          className="h-12 w-12 rounded-xl border bg-white border-slate-200 text-slate-700 flex items-center justify-center shadow-md active:translate-y-0.5"
                        >
                          <ChevronUp className="w-5 h-5" />
                        </button>
                        <div />

                        {/* LEFT */}
                        <button
                          onClick={() => handleInput("left")}
                          aria-label="Move Left"
                          className="h-12 w-12 rounded-xl border bg-white border-slate-200 text-slate-700 flex items-center justify-center shadow-md active:translate-y-0.5"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        {/* DOWN */}
                        <button
                          onClick={() => handleInput("down")}
                          aria-label="Move Down"
                          className="h-12 w-12 rounded-xl border bg-white border-slate-200 text-slate-700 flex items-center justify-center shadow-md active:translate-y-0.5"
                        >
                          <ChevronDown className="w-5 h-5" />
                        </button>
                        {/* RIGHT */}
                        <button
                          onClick={() => handleInput("right")}
                          aria-label="Move Right"
                          className="h-12 w-12 rounded-xl border bg-white border-slate-200 text-slate-700 flex items-center justify-center shadow-md active:translate-y-0.5"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {gameState === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">SESSION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode calibration completed.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Hits / Accuracy</div>
                          <div className="text-base text-slate-700 font-mono font-bold">{hitsCount} hits ({accuracyPercent}%)</div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Vector
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
            title="Directional Reflex Test"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Improves spatial orientation and choices under speed pressure.",
              "Sharpens visual search filtering by tuning out flanker decoy arrows.",
              "Enhances keyboard coordination muscle memory patterns (WASD/Arrows).",
              "Forces cognitive flexibility through red/green inversion rules.",
              "Provides stats metrics to track progress parameters.",
            ]}
            howToPlay={[
              "Choose a difficulty — Beginner (Basic arrows, 45s) to Professional (Flanker decoys + prompt mods).",
              "Click 'Initialize Vector' to begin.",
              "Replicate arrows on screen using Arrow keys or on-screen D-pad.",
              "On Normal/Hard, Green arrows mean direct entry, Red arrows require opposite directions.",
              "On Professional, check the top prompt banner rule (Direct or Inverse opposite) on every turn.",
              "Avoid misfires to ensure your final accuracy rating and scores stay optimal.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
