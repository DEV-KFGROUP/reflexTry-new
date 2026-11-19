"use client";

import { GameProgressFeedback } from "@/components/GameProgressFeedback";
import { useGameTimers } from "@/hooks/useGameTimers";
import { useLatestCallback } from "@/hooks/useLatestCallback";
import { useToolProgress } from "@/hooks/useToolProgress";
import { safeStorage } from "@/utils/safeStorage";

import { useGameSound } from "@/hooks/useGameSound";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Brain, Eye, Flame, Play, RotateCcw, Shield, Star, Trophy, Volume2, VolumeX, Zap } from "lucide-react";
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
  roundLimit: number;
  timeLimitSec?: number;
  maxMistakes: number;
  distortionStyle: React.CSSProperties;
  useMultipleChoice: boolean;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "Clear images · Simple typing well · Unlimited lives · No timers",
    roundLimit: 10, maxMistakes: 999, useMultipleChoice: false,
    distortionStyle: {},
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "Slightly blurred image · Typing input · Unlimited lives · No timers",
    roundLimit: 10, maxMistakes: 999, useMultipleChoice: false,
    distortionStyle: { filter: "blur(5px)" },
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "Blurred + 45° tilted image · 15s round timer · 3 lives limit",
    roundLimit: 10, timeLimitSec: 15, maxMistakes: 3, useMultipleChoice: false,
    distortionStyle: { filter: "blur(10px)", transform: "rotate(45deg)" },
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "Heavily blurred + inverted colors · 8s round timer · 3 lives limit",
    roundLimit: 12, timeLimitSec: 8, maxMistakes: 3, useMultipleChoice: false,
    distortionStyle: { filter: "blur(18px) invert(1) hue-rotate(120deg)", transform: "rotate(-45deg)" },
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "Extreme blur + grayscale mosaic · 4s timer · Choice grid (1-4 keys) · 2 lives limit",
    roundLimit: 15, timeLimitSec: 4, maxMistakes: 2, useMultipleChoice: true,
    distortionStyle: { filter: "blur(24px) grayscale(1) contrast(1.5)", transform: "rotate(135deg)" },
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface ImageSample {
  id: string;
  hint: string;
  correct: string;
  options: string[]; // multiple choices
}

const IMAGE_SAMPLES: ImageSample[] = [
  { id: "img_001", hint: "🐱", correct: "Cat", options: ["Cat", "Dog", "Tiger", "Fox"] },
  { id: "img_002", hint: "🌅", correct: "Sunset", options: ["Sunset", "Sunrise", "Ocean", "Desert"] },
  { id: "img_003", hint: "💎", correct: "Diamond", options: ["Diamond", "Crystal", "Emerald", "Ring"] },
  { id: "img_004", hint: "🚗", correct: "Car", options: ["Car", "Truck", "Taxi", "Train"] },
  { id: "img_005", hint: "🌳", correct: "Tree", options: ["Tree", "Flower", "Grass", "Forest"] },
  { id: "img_006", hint: "🏠", correct: "House", options: ["House", "Castle", "Office", "Tent"] },
  { id: "img_007", hint: "⭐", correct: "Star", options: ["Star", "Moon", "Sun", "Spark"] },
  { id: "img_008", hint: "🌙", correct: "Moon", options: ["Moon", "Cloud", "Sun", "Star"] },
  { id: "img_009", hint: "🍎", correct: "Apple", options: ["Apple", "Peach", "Tomato", "Cherry"] },
  { id: "img_010", hint: "🐘", correct: "Elephant", options: ["Elephant", "Rhino", "Hippo", "Mammoth"] },
  { id: "img_011", hint: "🚀", correct: "Rocket", options: ["Rocket", "Plane", "UFO", "Satellite"] },
  { id: "img_012", hint: "🎸", correct: "Guitar", options: ["Guitar", "Violin", "Harp", "Cello"] },
  { id: "img_013", hint: "🍕", correct: "Pizza", options: ["Pizza", "Pie", "Cake", "Cookie"] },
  { id: "img_014", hint: "🍔", correct: "Burger", options: ["Burger", "Sandwich", "Taco", "Hotdog"] },
  { id: "img_015", hint: "⚽", correct: "Soccer", options: ["Soccer", "Tennis", "Basketball", "Baseball"] },
  { id: "img_016", hint: "🐠", correct: "Fish", options: ["Fish", "Shark", "Whale", "Dolphin"] },
  { id: "img_017", hint: "🦉", correct: "Owl", options: ["Owl", "Eagle", "Bat", "Parrot"] },
  { id: "img_018", hint: "🍦", correct: "Ice Cream", options: ["Ice Cream", "Cake", "Candy", "Cookie"] },
  { id: "img_019", hint: "🐝", correct: "Bee", options: ["Bee", "Fly", "Wasp", "Ant"] },
  { id: "img_020", hint: "🎈", correct: "Balloon", options: ["Balloon", "Bubble", "Lantern", "Kite"] },
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
      disabled={disabled}
      aria-pressed={selected}
      onClick={disabled ? undefined : onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-3 transition-all focus:outline-none overflow-hidden ${
        disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"
      } ${selected ? `${d.borderColor} bg-white shadow-lg` : "border-slate-200 bg-white/70 hover:border-slate-300"}`}
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
            <span className="font-mono font-bold text-xs text-slate-800">{d.label}</span>
            {selected && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore}% Acc</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function ImageRecognitionClient() {
  const roundLocked = useRef(false);
  const { setTimeout, setInterval, clearInterval, cancelTimers } = useGameTimers();

    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result" | "gameover">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [muted, setMuted] = useState(false);

  const [currentImage, setCurrentImage] = useState<ImageSample>(IMAGE_SAMPLES[0]);
  const [input, setInput] = useState("");
  const [lastResult, setLastResult] = useState<boolean | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
      const v = safeStorage.getItem(`reflextry_v2_imgrec-hs-${k}`);
      if (v !== null && Number.isFinite(Number(v))) saved[k] = Number(v);
    });
    setHighScores(saved);
  }, []);

  const nextImage = useLatestCallback(() => {
    const idx = Math.floor(Math.random() * IMAGE_SAMPLES.length);
    setCurrentImage(IMAGE_SAMPLES[idx]);
    setInput("");
    setLastResult(null);
    setPhase("playing");

    roundLocked.current = false;
    const d = DIFFICULTIES[diffId];
    clearInterval(timerRef.current);
    if (d.timeLimitSec) {
      const deadline = performance.now() + d.timeLimitSec * 1000;
      setTimeLeft(d.timeLimitSec);
      timerRef.current = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((deadline - performance.now()) / 1000));
        setTimeLeft(remaining);
        if (!remaining) submitAnswer("");
      }, 100);
    }
  });

  const startGame = useCallback(() => {
    cancelTimers();
    setScore(0);
    setRound(0);
    setMistakes(0);
    setPhase("playing");
    setInput("");
    playSound("start");
    
    // Defer loading target image slightly to ensure state resets
    setTimeout(() => nextImage(), 50);
  }, [playSound, nextImage]);

  const submitAnswer = useLatestCallback((typedAnswer: string) => {
    if (phase !== "playing" || roundLocked.current) return;
    roundLocked.current = true;
    clearInterval(timerRef.current);
    const normalize = (value: string) => value.trim().toLocaleLowerCase().replace(/\s+/g, " ");
    const correct = normalize(typedAnswer) === normalize(currentImage.correct);
    const nextMistakes = mistakes + (correct ? 0 : 1);
    const nextRound = round + 1;
    setLastResult(correct);
    setRound(nextRound);
    setMistakes(nextMistakes);
    setScore(value => value + (correct ? 100 : 0));
    playSound(correct ? "success" : "error");
    setPhase("result");
    if (nextMistakes >= diff.maxMistakes || nextRound >= diff.roundLimit) {
      setTimeout(() => setPhase("gameover"), 900);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitAnswer(input);
  };

  // Keyboard choice bindings for Pro mode (1, 2, 3, 4 keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (phase !== "playing" || !diff.useMultipleChoice) return;
      const key = e.key;
      const idx = ["1", "2", "3", "4"].indexOf(key);
      if (idx !== -1 && idx < currentImage.options.length) {
        submitAnswer(currentImage.options[idx]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, diff, currentImage, submitAnswer]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalPossibleScore = round * 100;
  const accuracy = totalPossibleScore > 0 ? Math.round((score / totalPossibleScore) * 100) : 100;

  // Complete game summary logic
  useEffect(() => {
    if (phase === "gameover") {
    }
  }, [phase, accuracy, diffId]);


  const progress = useToolProgress({
    toolId: "image-recognition", phase: phase, difficulty: diffId,
    value: accuracy, unit: "%", higherIsBetter: true,
    terminal: ["gameover"], idle: ["idle"], recordKey: "reflextry_v2_imgrec-hs-",
    setHighScores, cancelTimers, reset: () => setPhase("idle"),
    eligible: true,
  });

  return (
    <div data-idle={phase === "idle"} className="game-tool w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <GameProgressFeedback result={progress} />
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-6 pt-0">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">IMAGE RECOGNITION</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">VISUAL PATTERN CALIBRATION</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Main Layout */}
        <div className="game-columns w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">

          {/* ═══ LEFT PANEL ═══ */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="game-settings flex flex-col gap-4">

            {/* Difficulty Selector */}
            <div className="game-difficulty bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {DIFF_ORDER.map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase === "idle" || phase === "gameover") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "playing" || phase === "result"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="game-stats bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Calibration Score</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider font-bold">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracy}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5 animate-pulse">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - mistakes} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Round Progress</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{round}/{diff.roundLimit}</div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Accuracy ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}% Acc</div>
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
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="game-arena flex flex-col gap-4">
            <div className="relative bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,23,42,0.07)]">
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                ARENA // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                TIMER: {diff.timeLimitSec ? `${diff.timeLimitSec}s` : "STATIC"}
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
                          <Eye className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Visual Mapping</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Identify distorted emojis projected inside the central LCD ring. Overcome extreme blurs, rotation tilts, and color inversions.
                        </p>
                        <p className={`game-level-description text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Play
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {(phase === "playing" || phase === "result") && (
                    <motion.div
                      key="playing"
                      initial={false}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0 } }}
                      className="space-y-8 w-full flex flex-col items-center justify-center"
                    >
                      {/* Round timer indicator */}
                      {diff.timeLimitSec && phase === "playing" && (
                        <div className="w-full max-w-xs flex flex-col items-center">
                          <div className="flex justify-between w-full text-[10px] font-mono text-slate-500 dark:text-slate-400 mb-1">
                            <span>OPTIC EXPOSURE BUFFER</span>
                            <span className={timeLeft <= 2 ? "text-red-500 font-bold" : ""}>{timeLeft}s</span>
                          </div>
                          <div className="w-full bg-slate-850 h-1 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className={`h-full transition-all duration-700 ${
                                timeLeft <= 2 ? "bg-red-500" : "bg-cyan-500"
                              }`}
                              style={{ width: `${(timeLeft / diff.timeLimitSec) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Prompt Display Ring with CSS filters */}
                      <div className="w-48 h-48 bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] flex items-center justify-center relative overflow-hidden select-none">
                        <div className="absolute inset-0 border border-dashed border-cyan-500/10 rounded-full animate-[spin_40s_linear_infinite]" />
                        
                        <div
                          className="text-7xl font-sans"
                          style={diff.distortionStyle}
                        >
                          {currentImage.hint}
                        </div>
                      </div>

                      {phase === "playing" ? (
                        <div className="w-full max-w-md">
                          {diff.useMultipleChoice ? (
                            /* Professional Choice grid button layout */
                            <div className="grid grid-cols-2 gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner">
                              {currentImage.options.map((opt, i) => (
                                <div key={opt} className="relative h-16 w-full">
                                  <div className="absolute inset-0 rounded-2xl bg-slate-350 translate-y-1 border-b-2 border-black/20" />
                                  <button
                                    onClick={() => submitAnswer(opt)}
                                    className="absolute inset-0 rounded-2xl border-2 bg-white border-slate-200 text-slate-700 font-mono font-black text-xs shadow-md flex flex-col items-center justify-center transition-all select-none cursor-pointer hover:bg-slate-50 active:translate-y-1"
                                  >
                                    <span>{opt.toUpperCase()}</span>
                                    <span className="opacity-40 text-[11px] font-bold mt-0.5">[{i + 1}]</span>
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            /* Simple Typing input well */
                            <form onSubmit={handleSubmit} className="space-y-6 w-full">
                              <div className="relative flex flex-col space-y-1.5">
                                <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-widest pl-1">Identify Target Label</div>
                                <input
                                  type="text"
                                  value={input}
                                  onChange={(e) => setInput(e.target.value)}
                                  placeholder="Type answer here..."
                                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 shadow-inner rounded-2xl text-xl text-slate-800 text-center focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono"
                                  autoFocus
                                />
                              </div>

                              <div className="relative w-full h-12">
                                <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1 border-b-2 border-black/25" />
                                <button
                                  type="submit"
                                  className="absolute inset-0 w-full rounded-xl bg-cyan-500 border border-cyan-400 text-white font-mono font-bold tracking-widest text-xs shadow-md flex items-center justify-center hover:brightness-105 active:translate-y-1 cursor-pointer py-3.5"
                                >
                                  Submit Identification
                                </button>
                              </div>
                            </form>
                          )}
                        </div>
                      ) : (
                        /* Result/Answer verification panel */
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center space-y-6">
                          <div className={`text-3xl font-mono font-black tracking-wider ${lastResult ? "text-cyan-600" : "text-red-500 animate-pulse"}`}>
                            {lastResult ? "MAPPING_CORRECT" : "MAPPING_INCORRECT"}
                          </div>
                          {!lastResult && (
                            <div className="text-sm font-mono text-slate-500">
                              Exact target label: <span className="text-slate-800 font-bold capitalize">{currentImage.correct}</span>
                            </div>
                          )}
                          {round < diff.roundLimit && mistakes < diff.maxMistakes && (
                            <div className="pt-2 flex justify-center w-full">
                              <motion.button
                                onClick={nextImage}
                                whileHover={{ translateY: -2 }}
                                whileTap={{ translateY: 6 }}
                                className="relative group cursor-pointer focus:outline-none select-none px-8 py-3 bg-cyan-500 text-white font-mono font-bold tracking-widest text-xs border border-cyan-400 rounded-xl shadow-md"
                              >
                                Next Target <ArrowRight className="w-4 h-4 inline ml-1" />
                              </motion.button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, transition: { duration: 0 } }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">Round complete</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode calibration completed.</p>
                        {accuracy >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {accuracy}% Acc!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Total Score</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score} pts</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Accuracy Rating</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{accuracy}% Acc</div>
                        </div>
                      </div>

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none flex-1">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Play again
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
                <button onClickCapture={() => window.dispatchEvent(new Event("game_abort_requested"))}
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("gameover"); }}
                  className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
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
