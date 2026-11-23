"use client";

import { ToolIcon } from "@/components/ToolIcon";
import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useReactionTone } from "@/hooks/useReactionTone";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { Brain, Flame, Play, RotateCcw, Shield, ShieldAlert, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  minDelayMs: number;
  maxDelayMs: number;
  attemptsCount: number;
  earlyClickPenalty: boolean;
  hasFauxTones: boolean; // low pitch faux distractions
  dualTaskInstruction: boolean; // high vs low task instruction
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Standard tone · Long delay · 5 attempts · No penalties",
    minDelayMs: 3000, maxDelayMs: 6000, attemptsCount: 5, earlyClickPenalty: false,
    hasFauxTones: false, dualTaskInstruction: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Standard tone · Normal delay · 5 attempts · No penalties",
    minDelayMs: 2000, maxDelayMs: 5000, attemptsCount: 5, earlyClickPenalty: false,
    hasFauxTones: false, dualTaskInstruction: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Standard tone · Faster delay · 5 attempts · Misfires count",
    minDelayMs: 1500, maxDelayMs: 4000, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxTones: false, dualTaskInstruction: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Auditory discrimination · Ignore low pitch tones · 1 life penalty",
    minDelayMs: 1200, maxDelayMs: 3500, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxTones: true, dualTaskInstruction: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Dual-task switches · Match pitch instruction (High/Low)",
    minDelayMs: 1000, maxDelayMs: 3000, attemptsCount: 5, earlyClickPenalty: true,
    hasFauxTones: true, dualTaskInstruction: true,
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
          {highScore > 0 && highScore !== 999 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best Avg: {highScore}ms</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function SoundReactionGame() {
  const { setTimeout, clearTimeout, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "idle" | "waiting" | "ready" | "early" | "result" | "summary">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [currentAttempt, setCurrentAttempt] = useState(1);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Sound settings
  const [activeTaskTone, setActiveTaskTone] = useState<"high" | "low">("high"); // pro mode matching instruction
  const [soundFrequency, setSoundFrequency] = useState(880); // frequency of played beep

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999,
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useLatestCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  });

  const { prepare: prepareAudio, beep: playBeep } = useReactionTone();
  const [audioUnavailable, setAudioUnavailable] = useState(false);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999 };
    DIFF_ORDER.forEach(k => {
      const v = safeStorage.getItem(`reflextry_v2_sound-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const triggerBeep = useCallback((freq: number) => {
    const onset = playBeep(freq);
    if (onset === null) {
      setAudioUnavailable(true);
      setPhase("idle");
      return;
    }
    setAudioUnavailable(false);
    setSoundFrequency(freq);
    setPhase("ready");
    setStartTime(onset);
  }, [playBeep]);

  const startWaiting = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setPhase("waiting");
    playSound("hover");

    const nextTaskTone = d.dualTaskInstruction && Math.random() > 0.5 ? "low" : "high";
    setActiveTaskTone(nextTaskTone);

    const delay = Math.floor(Math.random() * (d.maxDelayMs - d.minDelayMs + 1)) + d.minDelayMs;

    if (d.hasFauxTones && Math.random() > 0.4) {
      // Play a fake low pitch beep first to distract the player
      const fauxDelay = delay / 2;
      timerRef.current = setTimeout(() => {
        // Play low frequency beep (350Hz)
        playBeep(nextTaskTone === "low" ? 880 : 350);

        // Schedule true green light after remaining delay
        timerRef.current = setTimeout(() => {
          // If Pro mode, can play low or high frequency beep as target
          const targetFreq = nextTaskTone === "low" ? 350 : 880;
          triggerBeep(targetFreq);
        }, delay - fauxDelay);

      }, fauxDelay);
    } else {
      timerRef.current = setTimeout(() => {
        const targetFreq = nextTaskTone === "low" ? 350 : 880;
        triggerBeep(targetFreq);
      }, delay);
    }
  }, [diffId, playSound, triggerBeep, playBeep]);

  const handleAction = useCallback(() => {
    prepareAudio();
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

    if (phase === "waiting") {
      // Early misfire clicked
      if (timerRef.current) clearTimeout(timerRef.current);
      playSound("error");
      setPhase("early");
      return;
    }

    if (phase === "ready") {
      const duration = Math.max(0, performance.now() - startTime);

      // Verify if they matched correct task instructions
      let isCorrect = true;
      if (diff.dualTaskInstruction) {
        const isHighTone = soundFrequency === 880;
        if (activeTaskTone === "high" && !isHighTone) isCorrect = false;
        if (activeTaskTone === "low" && isHighTone) isCorrect = false;
      } else if (diff.hasFauxTones) {
        // Hard mode: must not click on low tones (350Hz)
        if (soundFrequency === 350) isCorrect = false;
      }

      if (isCorrect) {
        setReactionTime(duration);
        setAttempts(prev => [...prev, duration]);
        playSound("success");
        setPhase("result");
      } else {
        // Misfire click penalty
        playSound("error");
        setPhase("early");
      }
      return;
    }

    if (phase === "early") {
      if (diff.earlyClickPenalty) {
        setAttempts(prev => [...prev, 1000]); // penalty
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
  }, [phase, diff, startTime, soundFrequency, activeTaskTone, playSound, startWaiting]);

  const proceedToNext = useCallback(() => {
    const nextAttempt = currentAttempt + 1;
    if (nextAttempt > diff.attemptsCount) {
      setPhase("summary");
      const sum = attempts.reduce((a, b) => a + b, 0) + (phase === "early" && diff.earlyClickPenalty ? 1000 : 0);
      const avg = Math.round(sum / diff.attemptsCount);
    } else {
      setCurrentAttempt(nextAttempt);
      startWaiting();
    }
  }, [currentAttempt, diff, attempts, phase, diffId, startWaiting]);

  const averageScore = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : 0;
  const bestScore = attempts.length > 0 ? Math.min(...attempts) : 0;


  const progress = useToolProgress({
    toolId: "sound-reaction", phase: phase, difficulty: diffId,
    value: averageScore, unit: "ms", higherIsBetter: false,
    terminal: ["summary"], idle: ["select"], recordKey: "reflextry_v2_sound-hs-",
    setHighScores, cancelTimers, reset: () => setPhase("select"),
    eligible: true,
  });

  return (
    <div data-idle={phase === "select"} className="game-tool w-full bg-[#FAF9F6] text-[#161614] font-sans relative overflow-hidden py-4 px-2 sm:px-4 lg:px-6 mb-4">
      <GameProgressFeedback result={progress} />
      {audioUnavailable && <p role="status" className="game-progress-feedback">Sound is not ready. Tap the play area again to enable audio, then start your attempt.</p>}

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <div className="inline-flex items-center justify-center gap-4 mb-1">
            <ToolIcon toolId="/reflex/sound" variant="3d-pedestal" size="md" interactive />
            <div className="text-left">
              <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight text-[#161614]">Audio Test</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-[0.2em]">AUDITORY LATENCY STABILITY</p>
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
                    onSelect={() => { if (phase === "select" || phase === "summary") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase !== "select" && phase !== "summary"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="game-stats bg-white border border-[#E6E3DB] rounded-2xl p-4">
              <div className="text-xs font-mono font-semibold text-[#57554E] dark:text-slate-300 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Attempt</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">
                    {currentAttempt}/{diff.attemptsCount}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Avg Latency</div>
                  <div className="text-xl font-mono font-bold text-[#161614] mt-0.5">
                    {averageScore > 0 ? `${averageScore}ms` : "—"}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Click</div>
                  <div className="text-xl font-mono font-bold text-emerald-600 mt-0.5">
                    {bestScore > 0 ? `${bestScore}ms` : "—"}
                  </div>
                </div>
                <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Penalty</div>
                  <div className="text-xs font-mono font-bold text-red-500 mt-1">
                    {diff.earlyClickPenalty ? "1000ms" : "NONE"}
                  </div>
                </div>
              </div>

              {/* Best record display */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Best Avg ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}ms</div>
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




              <div className="absolute top-4 left-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                {diff.label} Mode
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-[#78756C] dark:text-slate-400 tracking-widest hidden sm:block">
                TONES: {diff.hasFauxTones ? "HIGH + LOW" : "HIGH ONLY"}
              </div>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10 animate-fade-in">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="game-start-icon relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Volume2 className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-[#161614] uppercase tracking-wider">Auditory Calibration</h2>
                        <p className="text-xs text-[#57554E] dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Listen carefully and tap immediately when the target audio tone plays. Use headphones for best results.
                        </p>
                        <p className={`game-level-description text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={handleAction} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Play
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. ACTIVE AUDITORY ARENA ── */}
                  {(phase === "idle" || phase === "waiting" || phase === "ready" || phase === "early" || phase === "result") && (
                    <motion.div
                      key="arena"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onPointerDown={handleAction}
                      onKeyDown={(event) => { if (!event.repeat && (event.key === " " || event.key === "Enter")) { event.preventDefault(); handleAction(); } }}
                      role="button" tabIndex={0}
                      className={`relative w-full h-[400px] rounded-3xl flex flex-col items-center justify-center border transition-all duration-150 select-none cursor-pointer ${
                        phase === "idle" ? "bg-[#FAF9F6] border-[#E6E3DB] hover:bg-[#F3F1EB]/50" : ""
                      } ${
                        phase === "waiting" ? "bg-amber-50/20 border-amber-250/60 shadow-inner" : ""
                      } ${
                        phase === "ready" ? "bg-emerald-500 border-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)]" : ""
                      } ${
                        phase === "early" ? "bg-red-50/40 border-red-200 shadow-inner" : ""
                      } ${
                        phase === "result" ? "bg-[#FAF9F6] border-slate-250 shadow-inner" : ""
                      }`}
                    >
                      {/* Scanline */}
                      <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.1)_50%)] bg-[size:100%_4px]" />

                      {/* Display current active task instruction on Pro mode */}
                      {diff.dualTaskInstruction && (phase === "waiting" || phase === "ready") && (
                        <div className="absolute top-6">
                          <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold border shadow-sm ${
                            activeTaskTone === "high"
                              ? "bg-rose-50 border-rose-200 text-rose-700"
                              : "bg-blue-50 border-blue-200 text-blue-700"
                          }`}>
                            CLICK ONLY ON: {activeTaskTone.toUpperCase()} PITCH BEEP (880Hz)
                          </span>
                        </div>
                      )}

                      {/* Hard mode instruction */}
                      {diff.hasFauxTones && !diff.dualTaskInstruction && (phase === "waiting" || phase === "ready") && (
                        <div className="absolute top-6">
                          <span className="px-4 py-1.5 rounded-full text-xs font-mono font-bold border border-orange-200 bg-orange-50 text-orange-700 shadow-sm uppercase tracking-wide">
                            CLICK ONLY ON HIGH PITCH TONES (880Hz)
                          </span>
                        </div>
                      )}

                      {phase === "idle" && (
                        <div className="text-center space-y-4">
                          <Volume2 className="w-10 h-10 text-cyan-500 mx-auto animate-pulse" />
                          <h3 className="text-sm font-mono font-bold text-[#3F3E39] uppercase tracking-widest">[ TAP PAD TO START TEST ]</h3>
                        </div>
                      )}

                      {phase === "waiting" && (
                        <div className="text-center space-y-4">
                          <span className="inline-block w-4 h-4 rounded-full bg-amber-500 animate-ping" />
                          <h3 className="text-sm font-mono font-bold text-amber-600 uppercase tracking-widest">[ SYNCHRONIZING DECK TONE ]</h3>
                          <p className="text-[11px] font-mono text-[#57554E] dark:text-slate-400">DO NOT CLICK YET — LISTEN CAREFULLY</p>
                        </div>
                      )}

                      {phase === "ready" && (
                        <div className="text-center space-y-2">
                          <Volume2 className="w-16 h-16 text-white mx-auto animate-bounce" />
                          <div className="text-5xl font-mono font-black text-white tracking-widest">TAP NOW!</div>
                          <span className="text-[10px] font-mono text-white/80 uppercase tracking-widest">
                            [ BEEP FIRED: {soundFrequency === 880 ? "HIGH" : "LOW"} PITCH ]
                          </span>
                        </div>
                      )}

                      {phase === "early" && (
                        <div className="text-center space-y-4 p-4">
                          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                          <h3 className="text-lg font-mono font-bold text-red-700 uppercase tracking-wider">MISFIRE DETECTED</h3>
                          <p className="text-[10px] font-mono text-[#78756C] max-w-xs mx-auto leading-relaxed">
                            {diff.earlyClickPenalty
                              ? "Registered early or clicked wrong frequency tone. +1000ms penalty added. Tap to proceed."
                              : "Registered tap before tone was synchronized. Tap anywhere to reset."}
                          </p>
                        </div>
                      )}

                      {phase === "result" && (
                        <div className="text-center space-y-4">
                          <div className="text-[11px] font-mono font-medium text-[#57554E] dark:text-slate-400 uppercase tracking-wider">Auditory Latency</div>
                          <div className="bg-white border border-[#E6E3DB] p-4 px-8 rounded-2xl shadow-sm inline-block">
                            <span className="text-4xl font-mono font-black text-fuchsia-600">{reactionTime}ms</span>
                          </div>
                          <p className="text-[11px] font-mono text-[#57554E] dark:text-slate-400">[ TAP ANYWHERE TO CONTINUE ]</p>
                        </div>
                      )}

                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "summary" && (
                    <motion.div key="summary" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="text-center space-y-6 w-full max-w-md">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">SESSION_COMPLETE</div>
                        <p className="text-xs font-mono text-[#78756C]">{diff.label} mode average latency</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-left max-w-sm mx-auto">
                        <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm">
                          <div className="text-[11px] font-mono text-[#57554E] dark:text-slate-400 uppercase mb-1">Average Latency</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{averageScore}ms</div>
                        </div>
                        <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 shadow-sm">
                          <div className="text-[11px] font-mono text-[#57554E] dark:text-slate-400 uppercase mb-1">Fastest Latency</div>
                          <div className="text-2xl text-emerald-600 font-mono font-black">{bestScore}ms</div>
                        </div>
                      </div>

                      {/* Display attempt lists */}
                      <div className="bg-[#FAF9F6] border border-slate-250 rounded-xl p-3 text-left">
                        <div className="text-[11px] font-mono text-[#57554E] dark:text-slate-400 uppercase mb-2">auditory latency logs</div>
                        <div className="grid grid-cols-5 gap-2 text-center">
                          {attempts.slice(0, 5).map((time, idx) => (
                            <div key={idx} className="bg-white border border-[#E6E3DB] p-2 rounded-lg font-mono text-xs text-[#3F3E39]">
                              #{idx + 1}
                              <div className={`font-bold mt-1 ${time === 1000 ? "text-red-500" : "text-[#161614]"}`}>
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
                <button onClickCapture={() => window.dispatchEvent(new Event("game_abort_requested"))}
                  onClick={() => { if (timerRef.current) clearTimeout(timerRef.current); setPhase("summary"); }}
                  className="text-xs font-mono font-medium text-[#57554E] dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
