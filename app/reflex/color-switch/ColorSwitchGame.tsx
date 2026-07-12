"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, AlertTriangle, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Palette
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
  buttonsCount: number; // 3, 4, 6, or 8 options
  hasStroopConflict: boolean; // word and ink mismatch
  hasRotatedText: boolean; // 90/180/270 degrees rotation
  hasRuleShifting: boolean; // "Match Ink Color" vs "Match Word Name" switches
  hasRoundTimer: boolean;
  roundTimerMs: number;
  totalRounds: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3 basic buttons · Direct matches · No conflict · 10 rounds",
    buttonsCount: 3, hasStroopConflict: false, hasRotatedText: false, hasRuleShifting: false,
    hasRoundTimer: false, roundTimerMs: 0, totalRounds: 10,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4 buttons · Mismatched ink/word names · No timer · 15 rounds",
    buttonsCount: 4, hasStroopConflict: true, hasRotatedText: false, hasRuleShifting: false,
    hasRoundTimer: false, roundTimerMs: 0, totalRounds: 15,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "6 buttons · Mismatched ink/word names · 20 rounds",
    buttonsCount: 6, hasStroopConflict: true, hasRotatedText: false, hasRuleShifting: false,
    hasRoundTimer: false, roundTimerMs: 0, totalRounds: 20,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "6 buttons · Stroop conflict + Rotated text · 1.5s timer · 20 rounds",
    buttonsCount: 6, hasStroopConflict: true, hasRotatedText: true, hasRuleShifting: false,
    hasRoundTimer: true, roundTimerMs: 1500, totalRounds: 20,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "8 buttons · Rotated text + Dynamic 'Word vs Ink' shifting · 1.0s timer",
    buttonsCount: 8, hasStroopConflict: true, hasRotatedText: true, hasRuleShifting: true,
    hasRoundTimer: true, roundTimerMs: 1000, totalRounds: 20,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface ColorOption {
  name: string;
  bg: string;
  border: string;
  depth: string;
  hex: string;
}

const ALL_COLORS: ColorOption[] = [
  { name: "Red", bg: "bg-red-500", border: "border-red-400", depth: "bg-red-700", hex: "#ef4444" },
  { name: "Blue", bg: "bg-blue-500", border: "border-blue-400", depth: "bg-blue-700", hex: "#3b82f6" },
  { name: "Green", bg: "bg-emerald-500", border: "border-emerald-400", depth: "bg-emerald-700", hex: "#10b981" },
  { name: "Yellow", bg: "bg-amber-400", border: "border-amber-350", depth: "bg-amber-600", hex: "#f59e0b" },
  { name: "Purple", bg: "bg-purple-500", border: "border-purple-400", depth: "bg-purple-700", hex: "#a855f7" },
  { name: "Orange", bg: "bg-orange-500", border: "border-orange-400", depth: "bg-orange-700", hex: "#f97316" },
  { name: "Pink", bg: "bg-pink-500", border: "border-pink-400", depth: "bg-pink-700", hex: "#ec4899" },
  { name: "Teal", bg: "bg-teal-500", border: "border-teal-400", depth: "bg-teal-700", hex: "#14b8a6" },
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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best Acc: {highScore}%</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ColorSwitchGame() {
  const content = getToolContent("color-switch", "Color Switch");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [roundStart, setRoundStart] = useState(0);
  const [muted, setMuted] = useState(false);

  // Stroop State variables
  const [targetColorIdx, setTargetColorIdx] = useState(0); // correct answer matching rules
  const [displayColorIdx, setDisplayColorIdx] = useState(0); // what color word text shows
  const [inkColorIdx, setInkColorIdx] = useState(0); // actual printed text color
  const [rotationAngle, setRotationAngle] = useState(0); // rotation offset
  const [currentRule, setCurrentRule] = useState<"ink" | "word">("ink"); // active prompt match

  // Round Timer bar
  const [timerProgress, setTimerProgress] = useState(100);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`colorswitch-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateRound = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    
    // Pick from color subset
    const numColors = d.buttonsCount;
    const wordIdx = Math.floor(Math.random() * numColors);
    let inkIdx = wordIdx;

    if (d.hasStroopConflict) {
      // 80% chance of conflict
      if (Math.random() < 0.8) {
        let alt = Math.floor(Math.random() * numColors);
        while (alt === wordIdx) alt = Math.floor(Math.random() * numColors);
        inkIdx = alt;
      }
    }

    // Determine current rule instruction (Professional)
    let rule: "ink" | "word" = "ink";
    if (d.hasRuleShifting) {
      rule = Math.random() > 0.5 ? "ink" : "word";
    }

    // Set correct index target
    const targetIdx = rule === "ink" ? inkIdx : wordIdx;

    // Apply rotation
    if (d.hasRotatedText) {
      const angles = [0, 90, 180, 270];
      setRotationAngle(angles[Math.floor(Math.random() * angles.length)]);
    } else {
      setRotationAngle(0);
    }

    setTargetColorIdx(targetIdx);
    setDisplayColorIdx(wordIdx);
    setInkColorIdx(inkIdx);
    setCurrentRule(rule);
    setRoundStart(Date.now());

    // Set round timer if active
    if (d.hasRoundTimer) {
      setTimerProgress(100);
      if (countdownRef.current) clearInterval(countdownRef.current);

      const step = 100 / (d.roundTimerMs / 50); // decrement step per 50ms
      countdownRef.current = setInterval(() => {
        setTimerProgress(p => {
          if (p <= step) {
            clearInterval(countdownRef.current!);
            handleRoundTimeout();
            return 0;
          }
          return p - step;
        });
      }, 50);
    }
  }, [diffId]);

  const handleRoundTimeout = useCallback(() => {
    playSound("error");
    setWrong(w => w + 1);
    proceedNextRound();
  }, [playSound]);

  const startGame = useCallback(() => {
    setRound(0);
    setCorrect(0);
    setWrong(0);
    setTotalTime(0);
    setPhase("playing");
    playSound("start");
    generateRound();
  }, [playSound, generateRound]);

  const handleAnswer = useCallback((colorIdx: number) => {
    if (phase !== "playing") return;
    if (countdownRef.current) clearInterval(countdownRef.current);

    const reactionTime = Date.now() - roundStart;
    setTotalTime(t => t + reactionTime);

    const isCorrect = colorIdx === targetColorIdx;
    if (isCorrect) {
      setCorrect(c => c + 1);
      playSound("click");
    } else {
      setWrong(w => w + 1);
      playSound("error");
    }

    proceedNextRound();
  }, [phase, roundStart, targetColorIdx, playSound]);

  const proceedNextRound = useCallback(() => {
    const nextRoundNum = round + 1;
    setRound(nextRoundNum);

    if (nextRoundNum >= diff.totalRounds) {
      playSound("success");
      setPhase("result");
      
      // Save high score (accuracy %)
      const accuracy = Math.round((correct / diff.totalRounds) * 100);
      setHighScores(hs => {
        if (accuracy > hs[diffId]) {
          localStorage.setItem(`colorswitch-hs-${diffId}`, accuracy.toString());
          return { ...hs, [diffId]: accuracy };
        }
        return hs;
      });
    } else {
      generateRound();
    }
  }, [round, diff, correct, diffId, playSound, generateRound]);

  useEffect(() => {
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, []);

  const avgTime = round > 0 ? Math.round(totalTime / round) : 0;
  const activeColors = ALL_COLORS.slice(0, diff.buttonsCount);

  // Grid columns styling helper
  const getGridColsClass = () => {
    if (diff.buttonsCount === 3) return "grid-cols-3 max-w-xs";
    if (diff.buttonsCount === 4) return "grid-cols-2 max-w-xs";
    if (diff.buttonsCount === 6) return "grid-cols-3 max-w-sm";
    return "grid-cols-4 max-w-md"; // 8 options
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">STROOP SWITCH</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">STROOP CHOICE REFLEX SYNC</p>
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Round</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {Math.min(diff.totalRounds, round + 1)}/{diff.totalRounds}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Correct / Wrong</div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1">
                    {correct} <span className="text-slate-400 font-normal">/</span> <span className="text-red-500">{wrong}</span>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Avg Latency</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{avgTime}ms</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {round > 0 ? Math.round((correct / round) * 100) : 100}%
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Accuracy ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}% ACC</div>
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
                STROOP ENGINE: CONNECTED
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
                          <Palette className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Stroop Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Process Stroop interference matches. Click the option representing ink colors or word text as prompted by the rules.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Stroop
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
                      className="space-y-6 text-center w-full max-w-md flex flex-col items-center justify-center animate-fade-in"
                    >
                      {/* Round timer progress bar */}
                      {diff.hasRoundTimer && (
                        <div className="w-full max-w-sm bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-75"
                            style={{ width: `${timerProgress}%` }}
                          />
                        </div>
                      )}

                      {/* Display active matching instruction */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 py-5 shadow-sm max-w-sm mx-auto w-full relative">
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-1.5">
                          Round {round + 1}/{diff.totalRounds} Command
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-black border shadow-sm ${
                          currentRule === "ink"
                            ? "bg-violet-50 border-violet-200 text-violet-700"
                            : "bg-orange-50 border-orange-200 text-orange-700 animate-pulse"
                        }`}>
                          {currentRule === "ink" ? "MATCH INK COLOR" : "MATCH WORD TEXT"}
                        </span>
                      </div>

                      {/* LCD Display displaying Stroop Word */}
                      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 py-10 shadow-inner w-full min-h-[160px] flex items-center justify-center overflow-hidden">
                        <motion.div
                          key={round}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1, rotate: rotationAngle }}
                          className="text-4xl md:text-5xl font-black font-mono tracking-wider select-none origin-center"
                          style={{ color: ALL_COLORS[inkColorIdx].hex }}
                        >
                          {ALL_COLORS[displayColorIdx].name.toUpperCase()}
                        </motion.div>
                      </div>

                      {/* Choice Buttons Grid */}
                      <div className={`grid gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner w-full justify-center ${getGridColsClass()}`}>
                        {activeColors.map((color, idx) => (
                          <div key={idx} className="relative h-16 w-16 md:h-20 md:w-20">
                            {/* Depth base */}
                            <div className={`absolute inset-0 rounded-2xl ${color.depth} translate-y-1 border-b-2 border-black/20`} />
                            {/* Option keycap */}
                            <motion.button
                              whileHover={{ y: 0.5 }}
                              whileTap={{ y: 3 }}
                              onClick={() => handleAnswer(idx)}
                              className={`absolute inset-0 rounded-2xl border-2 ${color.bg} ${color.border} text-white font-mono font-black text-[10px] md:text-xs shadow-md flex items-center justify-center transition-all select-none cursor-pointer hover:brightness-105 active:translate-y-1`}
                            >
                              {color.name.toUpperCase()}
                            </motion.button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 text-[9px] font-mono text-slate-400 uppercase">
                        <span>Correct: {correct}</span>
                        <span>Wrong: {wrong}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode calibration completed.</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final Accuracy</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">
                            {Math.round((correct / diff.totalRounds) * 100)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Correct Hits</div>
                          <div className="text-lg text-slate-700 font-mono font-bold">{correct} / {diff.totalRounds}</div>
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
                          onClick={() => { setPhase("idle"); setCorrect(0); }}
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
                  onClick={() => { if (countdownRef.current) clearInterval(countdownRef.current); setPhase("result"); }}
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
            title="Color Switch Reflex Test"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Improves selective attention and executive control function capabilities.",
              "Resolves Stroop interference conflicts to boost neural response times.",
              "Forces cognitive flexibility by switching between 'match ink' and 'match word' rules.",
              "Sharpens spatial orientation by processing upside down rotated texts.",
              "Maintains historical accuracy metrics per difficulty level.",
            ]}
            howToPlay={[
              "Choose a difficulty — Beginner (3 colors, direct match) to Professional (8 colors, rotated text, rule switches, 1s timer).",
              "Click 'Initialize Stroop' to start the challenge.",
              "Observe the flashing color word inside the LCD console.",
              "On Hard, read the text rotated at random angles.",
              "On Professional, check the top rules banner to see whether to match 'Ink Color' or literal 'Word Text'.",
              "Complete all 20 rounds before the countdown timers run out.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
