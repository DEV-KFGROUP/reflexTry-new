"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Trophy, Play, RotateCcw, AlertTriangle, Shield, Star, Flame,
  Volume2, VolumeX, ArrowRight, Brain
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
  gridSize: number; // 4, 6, 9, or 12 buttons
  startLength: number;
  flashDurationMs: number;
  pauseDurationMs: number;
  hasTimeLimit: boolean;
  timeLimitSec: number;
  hasShuffle: boolean; // Shuffles color button positions after showing
  hasRotateOnHit: boolean; // Shuffles color positions after every click
  maxLives: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "4 buttons · Slow speed · Starts at 3 · 3 lives · No shuffle",
    gridSize: 4, startLength: 3, flashDurationMs: 800, pauseDurationMs: 300,
    hasTimeLimit: false, timeLimitSec: 0, hasShuffle: false, hasRotateOnHit: false, maxLives: 3,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4 buttons · Standard speed · Starts at 3 · 3 lives · No shuffle",
    gridSize: 4, startLength: 3, flashDurationMs: 600, pauseDurationMs: 250,
    hasTimeLimit: false, timeLimitSec: 0, hasShuffle: false, hasRotateOnHit: false, maxLives: 3,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "6 buttons · Fast speed · Starts at 4 · 15s timer · 1 life",
    gridSize: 6, startLength: 4, flashDurationMs: 450, pauseDurationMs: 150,
    hasTimeLimit: true, timeLimitSec: 15, hasShuffle: false, hasRotateOnHit: false, maxLives: 1,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "9 buttons · 10s timer · Shuffles board before replay · 1 life",
    gridSize: 9, startLength: 5, flashDurationMs: 320, pauseDurationMs: 120,
    hasTimeLimit: true, timeLimitSec: 10, hasShuffle: true, hasRotateOnHit: false, maxLives: 1,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "12 buttons · 8s timer · Shuffles on every click! · 1 life",
    gridSize: 12, startLength: 6, flashDurationMs: 200, pauseDurationMs: 80,
    hasTimeLimit: true, timeLimitSec: 8, hasShuffle: true, hasRotateOnHit: true, maxLives: 1,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface ColorOption {
  id: number;
  name: string;
  bg: string;
  border: string;
  depth: string;
  shadow: string;
}

const ALL_COLORS: ColorOption[] = [
  { id: 0, name: "red", bg: "bg-red-500", border: "border-red-400", depth: "bg-red-700", shadow: "shadow-[0_0_20px_rgba(239,68,68,0.4)]" },
  { id: 1, name: "green", bg: "bg-emerald-500", border: "border-emerald-400", depth: "bg-emerald-700", shadow: "shadow-[0_0_20px_rgba(16,185,129,0.4)]" },
  { id: 2, name: "blue", bg: "bg-blue-500", border: "border-blue-400", depth: "bg-blue-700", shadow: "shadow-[0_0_20px_rgba(59,130,246,0.4)]" },
  { id: 3, name: "yellow", bg: "bg-amber-400", border: "border-amber-350", depth: "bg-amber-600", shadow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]" },
  { id: 4, name: "purple", bg: "bg-purple-500", border: "border-purple-400", depth: "bg-purple-700", shadow: "shadow-[0_0_20px_rgba(168,85,247,0.4)]" },
  { id: 5, name: "orange", bg: "bg-orange-500", border: "border-orange-400", depth: "bg-orange-700", shadow: "shadow-[0_0_20px_rgba(249,115,22,0.4)]" },
  { id: 6, name: "pink", bg: "bg-pink-500", border: "border-pink-400", depth: "bg-pink-700", shadow: "shadow-[0_0_20px_rgba(236,72,153,0.4)]" },
  { id: 7, name: "gray", bg: "bg-slate-500", border: "border-slate-400", depth: "bg-slate-700", shadow: "shadow-[0_0_20px_rgba(100,116,139,0.4)]" },
  { id: 8, name: "teal", bg: "bg-teal-500", border: "border-teal-400", depth: "bg-teal-700", shadow: "shadow-[0_0_20px_rgba(20,184,166,0.4)]" },
  { id: 9, name: "cyan", bg: "bg-cyan-500", border: "border-cyan-400", depth: "bg-cyan-700", shadow: "shadow-[0_0_20px_rgba(6,182,212,0.4)]" },
  { id: 10, name: "indigo", bg: "bg-indigo-500", border: "border-indigo-400", depth: "bg-indigo-700", shadow: "shadow-[0_0_20px_rgba(99,102,241,0.4)]" },
  { id: 11, name: "amber", bg: "bg-amber-600", border: "border-amber-500", depth: "bg-amber-800", shadow: "shadow-[0_0_20px_rgba(217,119,6,0.4)]" },
];

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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best Avg: {highScore}ms</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SequenceReactionGame() {
  const content = getToolContent("sequence-reaction", "Sequence Reaction Test");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "showing" | "playing" | "summary">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [lives, setLives] = useState(3);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Active board mapping
  const [gridColors, setGridColors] = useState<ColorOption[]>([]);
  const [sequence, setSequence] = useState<number[]>([]); // stores color IDs sequentially
  const [userSequence, setUserSequence] = useState<number[]>([]); // user inputted color IDs
  
  const [currentShowingIndex, setCurrentShowingIndex] = useState(-1);
  const [timerProgress, setTimerProgress] = useState(100);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`seqreact-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  // Initialize board layout
  const initializeBoard = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    // Slice clean colors pool matching configured grid size
    setGridColors(ALL_COLORS.slice(0, d.gridSize));
  }, [diffId]);

  // Shuffle colors coordinates
  const shuffleBoard = useCallback(() => {
    setGridColors(prev => [...prev].sort(() => Math.random() - 0.5));
  }, []);

  const generateSequence = useCallback((length: number) => {
    const d = DIFFICULTIES[diffId];
    const seq: number[] = [];
    for (let i = 0; i < length; i++) {
      // Pick random color ID from the active color subset
      const randColor = ALL_COLORS[Math.floor(Math.random() * d.gridSize)];
      seq.push(randColor.id);
    }
    return seq;
  }, [diffId]);

  const showSequence = useCallback((seq: number[]) => {
    setPhase("showing");
    setCurrentShowingIndex(0);

    const d = DIFFICULTIES[diffId];
    let idx = 0;

    const interval = setInterval(() => {
      setCurrentShowingIndex(idx);
      playSound("hover");

      setTimeout(() => {
        setCurrentShowingIndex(-1);
      }, d.flashDurationMs - 50);

      idx++;
      if (idx >= seq.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (d.hasShuffle) {
            shuffleBoard();
          }
          setPhase("playing");
          setUserSequence([]);
          setStartTime(Date.now());
          startRoundTimer();
        }, d.pauseDurationMs + 200);
      }
    }, d.flashDurationMs + d.pauseDurationMs);
  }, [diffId, playSound, shuffleBoard]);

  const startRoundTimer = () => {
    const d = DIFFICULTIES[diffId];
    if (!d.hasTimeLimit) return;

    setTimerProgress(100);
    if (countdownRef.current) clearInterval(countdownRef.current);

    const timeSliceMs = 50;
    const step = 100 / ((d.timeLimitSec * 1000) / timeSliceMs);
    
    countdownRef.current = setInterval(() => {
      setTimerProgress(p => {
        if (p <= step) {
          clearInterval(countdownRef.current!);
          handleTimeExpire();
          return 0;
        }
        return p - step;
      });
    }, timeSliceMs);
  };

  const handleTimeExpire = () => {
    playSound("error");
    const nextLives = lives - 1;
    setLives(nextLives);

    if (nextLives <= 0) {
      triggerSummary();
    } else {
      // Retry sequence
      setUserSequence([]);
      setTimeout(() => showSequence(sequence), 1000);
    }
  };

  const startGame = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    initializeBoard();
    setScore(0);
    setRound(1);
    setLives(d.maxLives);
    setReactionTimes([]);
    
    const initialSeq = generateSequence(d.startLength);
    setSequence(initialSeq);
    setUserSequence([]);
    setPhase("showing");
    playSound("start");

    setTimeout(() => {
      showSequence(initialSeq);
    }, 500);
  }, [diffId, initializeBoard, generateSequence, playSound, showSequence]);

  const handleClick = useCallback((colorId: number) => {
    if (phase !== "playing") return;

    const duration = Date.now() - startTime;
    const nextUserSeq = [...userSequence, colorId];
    setUserSequence(nextUserSeq);

    // Verify correct index match
    const stepIdx = userSequence.length;
    const expectedColorId = sequence[stepIdx];

    if (colorId === expectedColorId) {
      playSound("success");
      
      // Pro mode: shuffle colors immediately after every hit!
      if (diff.hasRotateOnHit && nextUserSeq.length < sequence.length) {
        shuffleBoard();
      }

      if (nextUserSeq.length === sequence.length) {
        // Round cleared successfully!
        if (countdownRef.current) clearInterval(countdownRef.current);
        setReactionTimes(prev => [...prev, duration]);
        setScore(s => s + sequence.length * 100);

        const nextRound = round + 1;
        setRound(nextRound);

        if (nextRound <= 10) {
          const nextLength = diff.startLength + Math.floor((nextRound - 1) / 2);
          const nextSeq = generateSequence(nextLength);
          setSequence(nextSeq);
          setUserSequence([]);
          setTimeout(() => showSequence(nextSeq), 1000);
        } else {
          triggerSummary();
        }
      }
    } else {
      // Wrong button hit
      if (countdownRef.current) clearInterval(countdownRef.current);
      playSound("error");
      const nextLives = lives - 1;
      setLives(nextLives);

      if (nextLives <= 0) {
        triggerSummary();
      } else {
        // Redo sequence
        setUserSequence([]);
        setTimeout(() => showSequence(sequence), 1000);
      }
    }
  }, [phase, sequence, userSequence, startTime, diff, lives, round, playSound, generateSequence, showSequence, shuffleBoard]);

  const triggerSummary = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("summary");
    playSound("levelUp");

    const sum = reactionTimes.reduce((a, b) => a + b, 0);
    const avg = reactionTimes.length > 0 ? Math.round(sum / reactionTimes.length) : 999;

    setHighScores(hs => {
      if (avg < hs[diffId] || hs[diffId] === 999) {
        localStorage.setItem(`seqreact-hs-${diffId}`, avg.toString());
        return { ...hs, [diffId]: avg };
      }
      return hs;
    });
  }, [reactionTimes, diffId, playSound]);

  const averageReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  // Grid styling helper
  const getGridColsClass = () => {
    if (diff.gridSize === 4) return "grid-cols-2 max-w-xs";
    if (diff.gridSize === 6) return "grid-cols-2 sm:grid-cols-3 max-w-sm";
    if (diff.gridSize === 9) return "grid-cols-3 max-w-sm";
    return "grid-cols-3 sm:grid-cols-4 max-w-md"; // 12 buttons
  };

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">SEQUENCE ARENA</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">TEMPORAL SEQUENCE STABILIZER</p>
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
                    onSelect={() => { if (phase === "select" || phase === "summary") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing" || phase === "showing"}
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Round</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{round}/10</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Lives Remaining</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1">{lives} ❤️</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Avg Latency</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1">{averageReaction > 0 ? `${averageReaction}ms` : "—"}</div>
                </div>
              </div>

              {/* Best record */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Avg ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}ms</div>
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
                GRID: {diff.gridSize} SENSORS
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Zap className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Sequence Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Observe the flashing sequence of colored sensors and click them in identical order.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Arena
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING/SHOWING SCREEN ── */}
                  {(phase === "showing" || phase === "playing") && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-center w-full max-w-lg flex flex-col items-center justify-center"
                    >
                      {/* Round timer bar for Normal+ */}
                      {diff.hasTimeLimit && phase === "playing" && (
                        <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-75"
                            style={{ width: `${timerProgress}%` }}
                          />
                        </div>
                      )}

                      {/* Display Status Panel */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm max-w-sm mx-auto w-full relative">
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1">
                          Round {round}/10 Calibration
                        </div>
                        <h3 className="text-base md:text-lg font-mono font-black text-slate-700 uppercase tracking-wide">
                          {phase === "showing"
                            ? "WATCH CAREFULLY..."
                            : `REPEAT ORDER: ${userSequence.length}/${sequence.length}`}
                        </h3>
                      </div>

                      {/* Color grids mapping */}
                      <div className={`grid gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner w-full justify-center ${getGridColsClass()}`}>
                        {gridColors.map((color, index) => {
                          const isShowingFlash = phase === "showing" &&
                            currentShowingIndex >= 0 &&
                            sequence[currentShowingIndex] === color.id;

                          return (
                            <div key={index} className="relative h-20 w-20 md:h-24 md:w-24">
                              {/* 3D Depth base */}
                              <div className={`absolute inset-0 rounded-2xl ${color.depth} translate-y-1 border-b-2 border-black/20`} />
                              {/* Button */}
                              <motion.button
                                whileHover={phase === "playing" ? { y: 0.5 } : {}}
                                whileTap={phase === "playing" ? { y: 3 } : {}}
                                onClick={() => handleClick(color.id)}
                                disabled={phase === "showing"}
                                className={`absolute inset-0 rounded-2xl border-2 transition-all cursor-pointer ${
                                  isShowingFlash
                                    ? `${color.bg} ${color.border} ${color.shadow} translate-y-1`
                                    : `${color.bg} ${color.border} hover:brightness-105 active:translate-y-1`
                                }`}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-4 text-[9px] font-mono text-slate-400 uppercase justify-center">
                        <span>Score: {score}</span>
                        <span>Sequence size: {sequence.length}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "summary" && (
                    <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode calibration completed.</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Average Speed</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">
                            {averageReaction > 0 ? `${averageReaction}ms` : "—"}
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
                          onClick={() => { setPhase("select"); setScore(0); }}
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
            {(phase === "playing" || phase === "showing") && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    setPhase("summary");
                  }}
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
            title="Sequence Reaction Test"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Binds spatial recall mapping logic with motor reaction execution speeds.",
              "Improves cognitive adaptiveness by scanning dynamically shifting grids.",
              "Sharpens short term memory capacity under high-speed input countdown buffers.",
              "Develops parallel tracking mechanisms required in competitive sports.",
              "Preserves detailed historical scores per difficulty configuration.",
            ]}
            howToPlay={[
              "Choose a difficulty level — Beginner (4 buttons, slow flashes) to Professional (12 buttons, dynamic grid shuffles).",
              "Click 'Initialize Arena' to start.",
              "Carefully watch the sensor lights flash sequentially.",
              "On Hard mode, notice the button coordinates shuffle positions before you begin typing.",
              "On Professional mode, notice the button coordinates shuffle *every time you hit a correct color*.",
              "Input all sequence colors before the time limit progress bar runs out.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
