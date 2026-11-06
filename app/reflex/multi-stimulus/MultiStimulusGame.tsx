"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, AlertTriangle, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain
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
  gridSize: number; // 4, 6, 8, or 9 buttons
  hasStroopEffect: boolean; // instruction text color is different
  hasDifferentSearch: boolean; // "Click the DIFFERENT one"
  hasNegativeCommand: boolean; // "DONT CLICK GREEN"
  hasShapeMatching: boolean; // Button contains Shape + Color combination
  hasRoundTimer: boolean;
  roundTimerMs: number;
  maxMistakes: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "4 basic colors · Simple instruction · No timer · 3 lives",
    gridSize: 4, hasStroopEffect: false, hasDifferentSearch: false, hasNegativeCommand: false,
    hasShapeMatching: false, hasRoundTimer: false, roundTimerMs: 0, maxMistakes: 3,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4 colors · 'Different' matching included · No timer · 3 lives",
    gridSize: 4, hasStroopEffect: false, hasDifferentSearch: true, hasNegativeCommand: false,
    hasShapeMatching: false, hasRoundTimer: false, roundTimerMs: 0, maxMistakes: 3,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "6 colors · Stroop color-word conflict instructions · 3 lives",
    gridSize: 6, hasStroopEffect: true, hasDifferentSearch: true, hasNegativeCommand: false,
    hasShapeMatching: false, hasRoundTimer: false, roundTimerMs: 0, maxMistakes: 3,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "8 buttons · 'DON'T click' negatives · 1.5s round limit · 3 lives",
    gridSize: 8, hasStroopEffect: true, hasDifferentSearch: true, hasNegativeCommand: true,
    hasShapeMatching: false, hasRoundTimer: true, roundTimerMs: 1500, maxMistakes: 3,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "9 buttons · Shape + Color combos · 1.0s round limit · 3 lives",
    gridSize: 9, hasStroopEffect: true, hasDifferentSearch: true, hasNegativeCommand: true,
    hasShapeMatching: true, hasRoundTimer: true, roundTimerMs: 1000, maxMistakes: 3,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface ColorOption {
  name: string;
  bg: string;
  border: string;
  depth: string;
  textHex: string;
}

const ALL_COLORS: ColorOption[] = [
  { name: "red", bg: "bg-red-500", border: "border-red-400", depth: "bg-red-700", textHex: "#ef4444" },
  { name: "green", bg: "bg-emerald-500", border: "border-emerald-400", depth: "bg-emerald-700", textHex: "#10b981" },
  { name: "blue", bg: "bg-blue-500", border: "border-blue-400", depth: "bg-blue-700", textHex: "#3b82f6" },
  { name: "yellow", bg: "bg-amber-400", border: "border-amber-350", depth: "bg-amber-600", textHex: "#f59e0b" },
  { name: "purple", bg: "bg-purple-500", border: "border-purple-400", depth: "bg-purple-700", textHex: "#a855f7" },
  { name: "orange", bg: "bg-orange-500", border: "border-orange-400", depth: "bg-orange-700", textHex: "#f97316" },
  { name: "pink", bg: "bg-pink-500", border: "border-pink-400", depth: "bg-pink-700", textHex: "#ec4899" },
  { name: "gray", bg: "bg-slate-500", border: "border-slate-400", depth: "bg-slate-700", textHex: "#64748b" },
  { name: "teal", bg: "bg-teal-500", border: "border-teal-400", depth: "bg-teal-700", textHex: "#14b8a6" },
];

type ShapeType = "circle" | "square" | "triangle";
const SHAPE_ICONS: Record<ShapeType, string> = {
  circle: "●",
  square: "■",
  triangle: "▲"
};

interface GridButtonData {
  color: ColorOption;
  shape: ShapeType;
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
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
export default function MultiStimulusGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "summary">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [errorsCount, setErrorsCount] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [startTime, setStartTime] = useState(0);
  const [muted, setMuted] = useState(false);

  // Stimulus State
  const [gridButtons, setGridButtons] = useState<GridButtonData[]>([]);
  const [instructionText, setInstructionText] = useState("");
  const [instructionColorHex, setInstructionColorHex] = useState("#0f172a"); // Stroop color
  const [correctButtonIndices, setCorrectButtonIndices] = useState<number[]>([]); // multiple buttons can match negative commands

  // Round Timer bar
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
      const v = localStorage.getItem(`multistim-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateStimulus = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    
    // 1. Pick pool of colors & shapes
    const shuffledColors = [...ALL_COLORS].sort(() => Math.random() - 0.5).slice(0, d.gridSize);
    const shapes: ShapeType[] = ["circle", "square", "triangle"];

    const pool: GridButtonData[] = shuffledColors.map(c => ({
      color: c,
      shape: shapes[Math.floor(Math.random() * shapes.length)]
    }));

    let instr = "";
    let colorHex = "#0f172a";
    let corrects: number[] = [];

    // Helper to generate a random different configuration
    const triggerDifferentOption = () => {
      const baseColor = shuffledColors[0];
      const differentColor = ALL_COLORS.find(c => c.name !== baseColor.name)!;
      for (let i = 0; i < d.gridSize - 1; i++) {
        pool[i] = { color: baseColor, shape: "circle" };
      }
      pool[d.gridSize - 1] = { color: differentColor, shape: "circle" };
      
      // Shuffle positions
      pool.sort(() => Math.random() - 0.5);
      
      instr = "CLICK THE DIFFERENT COLOR";
      const targetIdx = pool.findIndex(b => b.color.name === differentColor.name);
      corrects = [targetIdx];
    };

    // 2. Select Instruction Type
    const roll = Math.random();

    if (d.hasDifferentSearch && roll < 0.25) {
      triggerDifferentOption();
    } else if (d.hasNegativeCommand && roll < 0.45) {
      // Negative instruction: e.g. "DON'T CLICK BLUE"
      const targetColor = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];
      instr = `DON'T CLICK THE ${targetColor.name.toUpperCase()} ONE`;
      
      pool.forEach((b, idx) => {
        if (b.color.name !== targetColor.name) corrects.push(idx);
      });
    } else if (d.hasShapeMatching && roll < 0.7) {
      // Shape matching: e.g. "GREEN TRIANGLE" or "ANY SQUARE"
      const subRoll = Math.random();
      if (subRoll < 0.4) {
        const targetShape = shapes[Math.floor(Math.random() * shapes.length)];
        instr = `CLICK ANY ${targetShape.toUpperCase()}`;
        pool.forEach((b, idx) => {
          if (b.shape === targetShape) corrects.push(idx);
        });
      } else {
        const targetBtn = pool[Math.floor(Math.random() * pool.length)];
        instr = `CLICK THE ${targetBtn.color.name.toUpperCase()} ${targetBtn.shape.toUpperCase()}`;
        pool.forEach((b, idx) => {
          if (b.color.name === targetBtn.color.name && b.shape === targetBtn.shape) {
            corrects.push(idx);
          }
        });
      }
    } else {
      // Standard color click: "CLICK GREEN"
      const targetBtn = pool[Math.floor(Math.random() * pool.length)];
      instr = `CLICK THE ${targetBtn.color.name.toUpperCase()} ONE`;
      corrects = [pool.findIndex(b => b.color.name === targetBtn.color.name)];
    }

    // Fallback if corrects is empty
    if (corrects.length === 0) {
      corrects = [0];
    }

    // 3. Stroop Inversion (Normal / Hard / Pro)
    if (d.hasStroopEffect) {
      const strobeColor = ALL_COLORS[Math.floor(Math.random() * ALL_COLORS.length)];
      colorHex = strobeColor.textHex;
    } else {
      colorHex = "#334155"; // standard slate
    }

    setGridButtons(pool);
    setInstructionText(instr);
    setInstructionColorHex(colorHex);
    setCorrectButtonIndices(corrects);
    setStartTime(Date.now());

    // 4. Reset round timer if active
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
    const nextErrors = errorsCount + 1;
    setErrorsCount(nextErrors);

    if (nextErrors >= diff.maxMistakes) {
      triggerSummary();
    } else {
      proceedNextRound();
    }
  }, [errorsCount, diff, playSound]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(1);
    setErrorsCount(0);
    setReactionTimes([]);
    setPhase("playing");
    playSound("start");
    generateStimulus();
  }, [playSound, generateStimulus]);

  const handleClick = useCallback((index: number) => {
    if (phase !== "playing") return;
    if (countdownRef.current) clearInterval(countdownRef.current);

    const isCorrect = correctButtonIndices.includes(index);
    const duration = Date.now() - startTime;

    if (isCorrect) {
      setScore(s => s + 1);
      setReactionTimes(prev => [...prev, duration]);
      playSound("success");
      proceedNextRound();
    } else {
      playSound("error");
      const nextErrors = errorsCount + 1;
      setErrorsCount(nextErrors);

      if (nextErrors >= diff.maxMistakes) {
        triggerSummary();
      } else {
        proceedNextRound();
      }
    }
  }, [phase, correctButtonIndices, errorsCount, diff, startTime, playSound]);

  const proceedNextRound = useCallback(() => {
    const nextRound = round + 1;
    if (nextRound > 10) {
      triggerSummary();
    } else {
      setRound(nextRound);
      generateStimulus();
    }
  }, [round, generateStimulus]);

  const triggerSummary = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setPhase("summary");
    playSound("levelUp");

    // Save score (lowest average reaction speed of hits)
    const sum = reactionTimes.reduce((a, b) => a + b, 0);
    const avg = reactionTimes.length > 0 ? Math.round(sum / reactionTimes.length) : 999;

    setHighScores(hs => {
      if (avg < hs[diffId] || hs[diffId] === 999) {
        localStorage.setItem(`multistim-hs-${diffId}`, avg.toString());
        return { ...hs, [diffId]: avg };
      }
      return hs;
    });
  }, [reactionTimes, diffId, playSound]);

  const averageReaction = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0;

  const bestReaction = reactionTimes.length > 0
    ? Math.min(...reactionTimes)
    : 0;

  // Grid styling dynamic maps
  const getGridColsClass = () => {
    if (diff.gridSize === 4) return "grid-cols-2 max-w-xs";
    if (diff.gridSize === 6) return "grid-cols-2 sm:grid-cols-3 max-w-sm";
    if (diff.gridSize === 8) return "grid-cols-2 sm:grid-cols-4 max-w-md";
    return "grid-cols-3 max-w-sm"; // 9 buttons
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">MULTI STIMULUS</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">SELECTIVE ATTENTION STABILIZER</p>
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
                    onSelect={() => { if (phase === "select" || phase === "summary") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing"}
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
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}/10</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Lives</div>
                  <div className="text-xl font-mono font-bold text-red-500 mt-0.5">
                    {Math.max(0, diff.maxMistakes - errorsCount)} ❤️
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Avg Speed</div>
                  <div className="text-sm font-mono font-bold text-slate-850 mt-1.5">
                    {averageReaction > 0 ? `${averageReaction}ms` : "—"}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Hit</div>
                  <div className="text-sm font-mono font-bold text-emerald-600 mt-1.5">
                    {bestReaction > 0 ? `${bestReaction}ms` : "—"}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Avg ({diff.label})</div>
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
                GRID: {diff.gridSize} ELEMENTS
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
                          <Brain className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Multi-Stimulus Calibration</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Process cognitive command prompts. Find and click matching colors/shapes while avoiding conflicting distractions.
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

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6 text-center w-full max-w-lg flex flex-col items-center justify-center"
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

                      {/* Display prompt instructions */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm max-w-sm mx-auto w-full relative">
                        <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5">
                          Round {round}/10 Command
                        </div>
                        <motion.h3
                          key={round}
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-lg md:text-xl font-mono font-black uppercase tracking-wide"
                          style={{ color: instructionColorHex }}
                        >
                          {instructionText}
                        </motion.h3>
                      </div>

                      {/* Interactive Button Grid */}
                      <div className={`grid gap-4 p-4 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner w-full justify-center ${getGridColsClass()}`}>
                        {gridButtons.map((b, index) => (
                          <div key={index} className="relative h-20 w-20 md:h-24 md:w-24">
                            {/* Depth base */}
                            <div className={`absolute inset-0 rounded-2xl ${b.color.depth} translate-y-1 border-b-2 border-black/20`} />
                            {/* Interactive Button */}
                            <motion.button
                              whileHover={{ y: 0.5 }}
                              whileTap={{ y: 3 }}
                              onClick={() => handleClick(index)}
                              className={`absolute inset-0 rounded-2xl border-2 ${b.color.bg} ${b.color.border} shadow-md flex items-center justify-center transition-all select-none cursor-pointer hover:brightness-105 active:translate-y-1`}
                            >
                              {/* Shape symbol on Professional level */}
                              {diff.hasShapeMatching && (
                                <span className="font-mono font-black text-2xl md:text-3xl text-white/90 drop-shadow-md">
                                  {SHAPE_ICONS[b.shape]}
                                </span>
                              )}
                            </motion.button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 text-[11px] font-mono text-slate-600 dark:text-slate-400 uppercase">
                        <span>Hits: {score}</span>
                        <span>Mistakes: {errorsCount}/{diff.maxMistakes}</span>
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
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Total Hits</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}/10</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Average Latency</div>
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
            {phase === "playing" && (
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    if (countdownRef.current) clearInterval(countdownRef.current);
                    setPhase("summary");
                  }}
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
