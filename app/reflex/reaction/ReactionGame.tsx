"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RotateCcw, Zap, AlertTriangle, ShieldAlert,
  Shield, Star, Flame, Trophy, Volume2, VolumeX, ArrowRight, Brain, Target, Play
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
  minDelayMs: number;
  maxDelayMs: number;
  attemptsCount: number;
  earlyClickPenalty: boolean;
  hasFauxSignals: boolean; // flashes false warning colors first
  targetMode: "anywhere" | "random-position"; // Professional requires hitting a random dot
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Anywhere tap · Long delay · 5 attempts · No penalties",
    minDelayMs: 3000, maxDelayMs: 6000, attemptsCount: 5, earlyClickPenalty: false,
    hasFauxSignals: false, targetMode: "anywhere",
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Anywhere tap · Standard delay · 5 attempts · Minor warning",
    minDelayMs: 2000, maxDelayMs: 5000, attemptsCount: 5, earlyClickPenalty: false,
    hasFauxSignals: false, targetMode: "anywhere",
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Anywhere tap · Faster delay · 5 attempts · Misfires count",
    minDelayMs: 1500, maxDelayMs: 4000, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxSignals: false, targetMode: "anywhere",
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Faux signal distractions · Short delay · Misfires count",
    minDelayMs: 1000, maxDelayMs: 3000, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxSignals: true, targetMode: "anywhere",
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Must tap dynamic Target Dot · Faux signals · Fast delay",
    minDelayMs: 800, maxDelayMs: 2500, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxSignals: true, targetMode: "random-position",
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
          <p className="text-[9px] text-slate-600 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && highScore !== 999 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best Avg: {highScore}ms</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN GAME
───────────────────────────────────────────── */
export default function ReactionGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "idle" | "waiting" | "faux" | "ready" | "early" | "result" | "summary">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Distraction / Target positioning
  const [targetCoords, setTargetCoords] = useState({ top: "50%", left: "50%" });
  const [fauxColor, setFauxColor] = useState(""); // orange or yellow triggers

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load high scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`reaction-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const triggerReady = useCallback(() => {
    setPhase("ready");
    setStartTime(Date.now());
    playSound("start");
  }, [playSound]);

  const startWaiting = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setPhase("waiting");
    
    // Pick dynamic coordinates for Pro Target Dot
    if (d.targetMode === "random-position") {
      const randomTop = Math.floor(Math.random() * 61) + 20; // 20% to 80%
      const randomLeft = Math.floor(Math.random() * 61) + 20;
      setTargetCoords({ top: `${randomTop}%`, left: `${randomLeft}%` });
    } else {
      setTargetCoords({ top: "50%", left: "50%" });
    }

    const delay = Math.floor(Math.random() * (d.maxDelayMs - d.minDelayMs + 1)) + d.minDelayMs;
    playSound("hover");

    if (d.hasFauxSignals && Math.random() > 0.5) {
      // Flash a fake warning color before the true green light
      const fauxDelay = delay / 2;
      timerRef.current = setTimeout(() => {
        setPhase("faux");
        setFauxColor(Math.random() > 0.5 ? "bg-amber-400" : "bg-blue-400");
        playSound("click");

        // Schedule true green light after remaining delay
        timerRef.current = setTimeout(() => {
          triggerReady();
        }, delay - fauxDelay);

      }, fauxDelay);
    } else {
      timerRef.current = setTimeout(() => {
        triggerReady();
      }, delay);
    }
  }, [diffId, playSound, triggerReady]);

  const handlePadClick = useCallback(() => {
    if (phase === "select") {
      setPhase("idle");
      setCurrentAttempt(1);
      setAttempts([]);
      return;
    }

    if (phase === "idle") {
      startWaiting();
      return;
    }

    if (phase === "waiting" || phase === "faux") {
      // Early misfire clicked
      if (timerRef.current) clearTimeout(timerRef.current);
      playSound("error");
      setPhase("early");
      return;
    }

    if (phase === "ready" && diff.targetMode === "anywhere") {
      const duration = Date.now() - startTime;
      setReactionTime(duration);
      setAttempts(prev => [...prev, duration]);
      playSound("success");
      setPhase("result");
      return;
    }

    if (phase === "early") {
      if (diff.earlyClickPenalty) {
        setAttempts(prev => [...prev, 1000]); // 1000ms penalty
        proceedToNext();
      } else {
        startWaiting();
      }
      return;
    }

    if (phase === "result") {
      proceedToNext();
      return;
    }
  }, [phase, diff, startTime, playSound, startWaiting]);

  // Target Dot click for Pro mode
  const handleTargetClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // prevent triggering parent pad click
    if (phase === "ready" && diff.targetMode === "random-position") {
      const duration = Date.now() - startTime;
      setReactionTime(duration);
      setAttempts(prev => [...prev, duration]);
      playSound("success");
      setPhase("result");
    }
  }, [phase, diff, startTime, playSound]);

  const proceedToNext = useCallback(() => {
    const nextAttempt = currentAttempt + 1;
    if (nextAttempt > diff.attemptsCount) {
      setPhase("summary");
      // Calculate Average Score excluding penalties or including them
      const sum = attempts.reduce((a, b) => a + b, 0) + (phase === "early" && diff.earlyClickPenalty ? 1000 : 0);
      const avg = Math.round(sum / diff.attemptsCount);

      setHighScores(hs => {
        if (avg < hs[diffId] || hs[diffId] === 999) {
          localStorage.setItem(`reaction-hs-${diffId}`, avg.toString());
          return { ...hs, [diffId]: avg };
        }
        return hs;
      });
    } else {
      setCurrentAttempt(nextAttempt);
      startWaiting();
    }
  }, [currentAttempt, diff, attempts, phase, diffId, startWaiting]);

  const averageScore = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : 0;
  const bestScore = attempts.length > 0 ? Math.min(...attempts) : 0;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={false} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">REACTION TIME TEST</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.25em]">REACTION VELOCITY CALIBRATION</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "select" || phase === "summary") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase !== "select" && phase !== "summary"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Attempt</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {currentAttempt}/{diff.attemptsCount}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Avg Speed</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {averageScore > 0 ? `${averageScore}ms` : "—"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Best Click</div>
                  <div className="text-xl font-mono font-bold text-emerald-600 mt-0.5">
                    {bestScore > 0 ? `${bestScore}ms` : "—"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Fail Penalty</div>
                  <div className="text-xs font-mono font-bold text-red-700 mt-1">
                    {diff.earlyClickPenalty ? "1000ms" : "NONE"}
                  </div>
                </div>
              </div>

              {/* Best record score */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Best Avg ({diff.label})</div>
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
          <motion.div initial={false} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="flex flex-col gap-4">
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-600 tracking-widest hidden sm:block">
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-600 tracking-widest hidden sm:block">
                MODE: {diff.targetMode.toUpperCase()}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT STAGE ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Target className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Reflex Calibration</h2>
                        <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                          Test your physical reaction speeds. Tap the arena as soon as the screen flashes emerald green.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={handlePadClick} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Arena
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. ACTIVE CALIBRATION ARENA ── */}
                  {(phase === "idle" || phase === "waiting" || phase === "faux" || phase === "ready" || phase === "early" || phase === "result") && (
                    <motion.div
                      key="arena"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={handlePadClick}
                      className={`relative w-full h-[400px] rounded-3xl flex flex-col items-center justify-center border transition-all duration-150 select-none cursor-pointer ${
                        phase === "idle" ? "bg-slate-50 border-slate-200 hover:bg-slate-100/50" : ""
                      } ${
                        phase === "waiting" ? "bg-amber-50/20 border-amber-250/60 shadow-inner" : ""
                      } ${
                        phase === "faux" ? `${fauxColor} border-amber-300 shadow-md` : ""
                      } ${
                        phase === "ready" && diff.targetMode === "anywhere" ? "bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]" : ""
                      } ${
                        phase === "ready" && diff.targetMode === "random-position" ? "bg-slate-900 border-slate-700 shadow-inner" : ""
                      } ${
                        phase === "early" ? "bg-red-50/40 border-red-200 shadow-inner" : ""
                      } ${
                        phase === "result" ? "bg-slate-50 border-slate-250 shadow-inner" : ""
                      }`}
                    >
                      {/* Scanline pattern overlay */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.1)_50%)] bg-[size:100%_4px]" />

                      {/* Display content based on active state */}
                      {phase === "idle" && (
                        <div className="text-center space-y-4">
                          <Zap className="w-10 h-10 text-cyan-500 mx-auto animate-bounce" />
                          <h3 className="text-sm font-mono font-bold text-slate-700 uppercase tracking-widest">[ TAP PAD TO INITIATE ]</h3>
                        </div>
                      )}

                      {phase === "waiting" && (
                        <div className="text-center space-y-4">
                          <span className="inline-block w-4 h-4 rounded-full bg-amber-500 animate-ping" />
                          <h3 className="text-sm font-mono font-bold text-amber-600 uppercase tracking-widest">[ CALIBRATING TIMING STACK ]</h3>
                          <p className="text-[9px] font-mono text-slate-600">DO NOT CLICK UNTIL GREEN LIGHT FIRES</p>
                        </div>
                      )}

                      {phase === "faux" && (
                        <div className="text-center space-y-3">
                          <h3 className="text-lg font-mono font-black text-slate-900 uppercase tracking-wider">HOLD...</h3>
                          <p className="text-[9px] font-mono text-slate-700">[ FAUX SIGNAL FLASH DETECTED ]</p>
                        </div>
                      )}

                      {/* Professional Dynamic Target Dot */}
                      {phase === "ready" && diff.targetMode === "random-position" && (
                        <motion.button
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          onClick={handleTargetClick}
                          className="absolute w-20 h-20 rounded-full bg-emerald-500 border border-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.5)] flex items-center justify-center cursor-pointer select-none"
                          style={{
                            top: targetCoords.top,
                            left: targetCoords.left,
                            transform: "translate(-50%, -50%)"
                          }}
                        >
                          <Zap className="w-8 h-8 text-white fill-white" />
                        </motion.button>
                      )}

                      {phase === "ready" && diff.targetMode === "anywhere" && (
                        <div className="text-center space-y-2">
                          <div className="text-5xl font-mono font-black text-white tracking-widest">TAP NOW!</div>
                          <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">[ CLICK ANYWHERE ]</span>
                        </div>
                      )}

                      {phase === "early" && (
                        <div className="text-center space-y-4 p-4">
                          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                          <h3 className="text-lg font-mono font-bold text-red-700 uppercase tracking-wider">MISFIRE WARNING</h3>
                          <p className="text-[10px] font-mono text-slate-500 max-w-xs mx-auto leading-relaxed">
                            {diff.earlyClickPenalty
                              ? "Registered early. 1000ms penalty added to attempt. Tap to proceed."
                              : "Registered before green light. Tap anywhere to reset."}
                          </p>
                        </div>
                      )}

                      {phase === "result" && (
                        <div className="text-center space-y-4">
                          <div className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">Reaction speed</div>
                          <div className="bg-white border border-slate-200 p-4 px-8 rounded-2xl shadow-sm inline-block">
                            <span className="text-4xl font-mono font-black text-fuchsia-600">{reactionTime}ms</span>
                          </div>
                          <p className="text-[9px] font-mono text-slate-600">[ TAP ANYWHERE TO CONTINUE ]</p>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY RESULT SCREEN ── */}
                  {phase === "summary" && (
                    <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 w-full max-w-md">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">SESSION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode average of 5 rounds</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                          <div className="text-[9px] font-mono text-slate-600 uppercase mb-1">Average Response</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{averageScore}ms</div>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm">
                          <div className="text-[9px] font-mono text-slate-600 uppercase mb-1">Fastest Peak</div>
                          <div className="text-2xl text-emerald-600 font-mono font-black">{bestScore}ms</div>
                        </div>
                      </div>

                      {/* Display attempt lists */}
                      <div className="bg-slate-50 border border-slate-250 rounded-xl p-3 text-left">
                        <div className="text-[9px] font-mono text-slate-600 uppercase mb-2">calibration log</div>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {attempts.slice(0, 5).map((time, idx) => (
                            <div key={idx} className="bg-white border border-slate-200 p-2 rounded-lg font-mono text-xs text-slate-700">
                              #{idx + 1}
                              <div className={`font-bold mt-1 ${time === 1000 ? "text-red-500" : "text-slate-800"}`}>
                                {time === 1000 ? "FAIL" : `${time}ms`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={() => { setPhase("idle"); setCurrentAttempt(1); setAttempts([]); startWaiting(); }} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-80" style={{ background: DIFF_GRADIENT[diffId], filter: "brightness(0.7)" }} />
                          <div className="relative py-3.5 rounded-xl text-white font-mono font-bold tracking-widest text-xs flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-md" style={{ background: DIFF_GRADIENT[diffId] }}>
                            <RotateCcw className="w-3.5 h-3.5" />
                            Recalibrate
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => setPhase("select")}
                          className="relative group cursor-pointer focus:outline-none select-none flex-1"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative py-3.5 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
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
            {phase !== "select" && phase !== "summary" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setPhase("summary"); }}
                  className="text-[10px] font-mono text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
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
