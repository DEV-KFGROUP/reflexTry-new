"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, Play, RotateCcw, Trophy, Brain, Clock, AlertTriangle,
  Shield, Star, Zap, Flame, Heart, Volume2, VolumeX, ArrowRight, Eye
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
   WORD BANK
───────────────────────────────────────────── */
const WORD_BANK = [
  "ocean", "bridge", "candle", "forest", "marble", "silver", "garden", "thunder",
  "puzzle", "crystal", "shadow", "beacon", "velvet", "copper", "breeze", "glacier",
  "lantern", "anchor", "ribbon", "temple", "coral", "mirror", "valley", "spark",
  "amber", "eclipse", "harbor", "summit", "mosaic", "whisper", "falcon", "prism",
  "aurora", "ember", "quartz", "river", "arrow", "tower", "cloud", "flame",
  "diamond", "meadow", "shield", "comet", "pearl", "castle", "phoenix", "orbit",
];

function pickRandomWords(count: number): string[] {
  const shuffled = [...WORD_BANK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  startWordCount: number;
  wordsPerLevel: number;
  wordDisplayMs: number; // speed of flashing
  lives: number;
  hasDistortion: boolean; // fonts/angles rotation
  strictOrder: boolean; // must match words in exact order
  hasRecallTimer: boolean; // input timer
  recallTimerSec: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2+ words · 2s display · 3 lives · Any order · Show hints",
    startWordCount: 2, wordsPerLevel: 1, wordDisplayMs: 2000, lives: 3,
    hasDistortion: false, strictOrder: false, hasRecallTimer: false, recallTimerSec: 0,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3+ words · 1.5s display · 3 lives · Any order",
    startWordCount: 3, wordsPerLevel: 1, wordDisplayMs: 1500, lives: 3,
    hasDistortion: false, strictOrder: false, hasRecallTimer: false, recallTimerSec: 0,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4+ words · 1s display · 1 life · Any order",
    startWordCount: 4, wordsPerLevel: 1, wordDisplayMs: 1000, lives: 1,
    hasDistortion: false, strictOrder: false, hasRecallTimer: false, recallTimerSec: 0,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "5+ words · 800ms display · 1 life · Distorted text · 30s input limit",
    startWordCount: 5, wordsPerLevel: 1, wordDisplayMs: 800, lives: 1,
    hasDistortion: true, strictOrder: false, hasRecallTimer: true, recallTimerSec: 30,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6+ words · 600ms display · 1 life · Timed (15s) · Sequential exact order!",
    startWordCount: 6, wordsPerLevel: 2, wordDisplayMs: 600, lives: 1,
    hasDistortion: true, strictOrder: true, hasRecallTimer: true, recallTimerSec: 15,
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
          <p className="text-[9px] text-slate-400 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && (
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: Stage {highScore}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function WordRecallGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "memorize" | "recall" | "result" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [level, setLevel] = useState(1);
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [input, setInput] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);

  // Timers and visuals
  const [showTimer, setShowTimer] = useState(0); // display count for memorize timer
  const [inputTimeLeft, setInputTimeLeft] = useState(0);
  const [showReveal, setShowReveal] = useState(false);
  const [wordAngle, setWordAngle] = useState(0);
  const [wordSize, setWordSize] = useState("text-6xl");

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const displayTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load high scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`wordrecall-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    return () => {
      if (displayTimerRef.current) clearInterval(displayTimerRef.current);
      if (inputTimerRef.current) clearInterval(inputTimerRef.current);
    };
  }, []);

  const stopAllTimers = useCallback(() => {
    if (displayTimerRef.current) clearInterval(displayTimerRef.current);
    if (inputTimerRef.current) clearInterval(inputTimerRef.current);
  }, []);

  const startInputTimer = useCallback(() => {
    if (!diff.hasRecallTimer) return;
    setInputTimeLeft(diff.recallTimerSec);
    inputTimerRef.current = setInterval(() => {
      setInputTimeLeft(t => {
        if (t <= 1) {
          clearInterval(inputTimerRef.current!);
          // Timer expire = fail level
          handleFailure();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diff, playSound]);

  const startLevel = useCallback((lvl: number, d: DiffConfig) => {
    stopAllTimers();
    const count = d.startWordCount + (lvl - 1) * d.wordsPerLevel;
    const picked = pickRandomWords(count);
    setWords(picked);
    setCurrentWordIndex(0);
    setAnswers([]);
    setInput("");
    setShowReveal(false);
    setPhase("memorize");
    playSound("start");

    // Memorize timer
    setShowTimer(count * (d.wordDisplayMs / 1000));

    let index = 0;
    displayTimerRef.current = setInterval(() => {
      index++;
      if (index >= picked.length) {
        clearInterval(displayTimerRef.current!);
        // Advance to recall
        setTimeout(() => {
          setPhase("recall");
          startInputTimer();
        }, 300);
      } else {
        setCurrentWordIndex(index);
        if (d.hasDistortion) {
          setWordAngle(Math.floor(Math.random() * 31) - 15); // random angle between -15deg and 15deg
          setWordSize(Math.random() > 0.5 ? "text-5xl" : "text-7xl");
        } else {
          setWordAngle(0);
          setWordSize("text-6xl");
        }
      }
    }, d.wordDisplayMs);

  }, [playSound, stopAllTimers, startInputTimer]);

  const startGame = useCallback(() => {
    setLevel(1);
    setScore(0);
    setLivesLeft(diff.lives);
    setStreak(0);
    startLevel(1, diff);
  }, [diff, startLevel]);

  const handleFailure = useCallback(() => {
    stopAllTimers();
    playSound("error");
    setStreak(0);

    const remainingLives = livesLeft - 1;
    setLivesLeft(remainingLives);

    // Save high score
    setHighScores(hs => {
      if (level > hs[diffId]) {
        const updated = { ...hs, [diffId]: level };
        localStorage.setItem(`wordrecall-hs-${diffId}`, level.toString());
        return updated;
      }
      return hs;
    });

    if (remainingLives <= 0) {
      setPhase("gameover");
    } else {
      setPhase("result");
    }
  }, [livesLeft, level, diffId, playSound, stopAllTimers]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toLowerCase();
    if (!trimmed) return;

    playSound("click");
    const newAnswers = [...answers, trimmed];
    setAnswers(newAnswers);
    setInput("");

    // Check progress
    if (newAnswers.length >= words.length) {
      stopAllTimers();
      
      let isCorrect = false;
      if (diff.strictOrder) {
        // Sequential check
        isCorrect = newAnswers.every((ans, idx) => ans === words[idx]);
      } else {
        // Any order check
        const correctSet = new Set(newAnswers.filter(a => words.includes(a)));
        isCorrect = correctSet.size === words.length;
      }

      if (isCorrect) {
        playSound("success");
        setStreak(s => s + 1);
        setScore(s => s + words.length);
        const nextLvl = level + 1;
        setLevel(nextLvl);
        setTimeout(() => startLevel(nextLvl, diff), 800);
      } else {
        handleFailure();
      }
    }
  }, [input, answers, words, diff, playSound, level, startLevel, handleFailure, stopAllTimers]);

  // Proceed from result (replaying level on life remaining)
  const handleProceed = useCallback(() => {
    startLevel(level, diff);
  }, [level, diff, startLevel]);

  const wordCount = diff.startWordCount + (level - 1) * diff.wordsPerLevel;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">WORD RECALL</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">VERBAL STORAGE RETRIEVAL</p>
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
                    onSelect={() => { if (phase === "select" || phase === "gameover" || phase === "result") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "memorize" || phase === "recall"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Level</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">Stage {level}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Words count</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{wordCount}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Lives</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {Array.from({ length: diff.lives }).map((_, i) => (
                      <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Streak</div>
                  <div className={`text-lg font-mono font-bold mt-0.5 ${streak >= 3 ? "text-orange-500" : "text-slate-800"}`}>
                    {streak >= 3 ? `🔥x${streak}` : `x${streak}`}
                  </div>
                </div>
              </div>

              {/* Best Score */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Stage</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>Stage {highScores[diffId]}</div>
                  </div>
                </div>
              )}

              {/* Input Timer bar */}
              {diff.hasRecallTimer && phase === "recall" && inputTimeLeft > 0 && (
                <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Recall Time</span>
                    <span className={`text-sm font-mono font-bold ${inputTimeLeft <= 4 ? "text-red-500" : "text-slate-700"}`}>{inputTimeLeft}s</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: inputTimeLeft <= 4 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                      animate={{ width: `${(inputTimeLeft / diff.recallTimerSec) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
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
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                WORDS DISPLAY: {diff.wordDisplayMs}MS
              </div>

              <div className="p-6 md:p-8 min-h-[460px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <BookOpen className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Verbal Stack Calibration</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Watch words flash on screen and memorize them. Input them back in exact sequential order (Pro mode) or any order.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Recall
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. MEMORIZE PHASE SCREEN ── */}
                  {phase === "memorize" && (
                    <motion.div key="memorize" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center space-y-8 w-full max-w-md">
                      <div className="flex items-center justify-center gap-2 text-slate-400 font-mono text-[10px] uppercase tracking-widest">
                        <Clock className="w-4 h-4 animate-spin" />
                        [ MEMORIZING STACK {currentWordIndex + 1}/{words.length} ]
                      </div>

                      <div className="h-32 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentWordIndex}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotate: wordAngle }}
                            exit={{ opacity: 0, y: -20, scale: 0.8 }}
                            transition={{ duration: 0.15 }}
                            className={`font-black text-slate-800 tracking-tight font-mono select-none ${wordSize}`}
                          >
                            {words[currentWordIndex]}
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <div className="w-full max-w-xs mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: DIFF_GRADIENT[diffId] }}
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: (words.length * diff.wordDisplayMs) / 1000, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. RECALL PHASE SCREEN ── */}
                  {phase === "recall" && (
                    <motion.div key="recall" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center space-y-6 w-full max-w-md">
                      <div className="space-y-1">
                        <Brain className="w-10 h-10 text-cyan-600 mx-auto" />
                        <h3 className="text-lg font-mono font-bold text-slate-700 block uppercase tracking-wider">
                          Recall Input Deck
                        </h3>
                        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                          {diff.strictOrder ? "[ CRITICAL: TYPE WORDS IN THE EXACT ORDER THEY APPEARED ]" : "[ TYPE WORDS IN ANY ORDER ]"}
                        </p>
                      </div>

                      {/* Display already entered words */}
                      <div className="flex flex-wrap gap-2 justify-center min-h-[45px] py-1">
                        {answers.map((ans, idx) => {
                          const isWordCorrect = diff.strictOrder
                            ? words[idx] === ans.toLowerCase()
                            : words.includes(ans.toLowerCase());

                          return (
                            <span
                              key={idx}
                              className={`px-3 py-1 rounded-full text-xs font-mono font-semibold transition-all border ${
                                isWordCorrect
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-250"
                                  : "bg-red-50 text-red-600 border-red-200"
                              }`}
                            >
                              {ans}
                            </span>
                          );
                        })}
                      </div>

                      <form onSubmit={handleSubmit} className="flex gap-3 max-w-sm mx-auto w-full">
                        <div className="relative flex-1">
                          <div className="absolute inset-0 rounded-xl bg-slate-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]" />
                          <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Type recalled word..."
                            autoFocus
                            className="relative w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 text-base font-mono focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20 shadow-sm"
                          />
                        </div>
                        <button
                          type="submit"
                          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-mono font-bold text-xs shadow-md select-none cursor-pointer flex items-center justify-center"
                        >
                          Submit
                        </button>
                      </form>

                    </motion.div>
                  )}

                  {/* ── 4. RESULT SCREEN (life remaining retry) ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 w-full max-w-md">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">RECALL_DISRUPT</div>
                        <p className="text-xs font-mono text-slate-500">
                          Mismatch detected. {livesLeft} life left — try again.
                        </p>
                      </div>

                      {/* Display expected words list */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                        <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2">EXPECTED SEQUENCE</div>
                        <div className="flex flex-wrap gap-2">
                          {words.map((w, idx) => (
                            <span key={idx} className="px-2.5 py-1 bg-white border border-slate-250 text-slate-700 font-mono text-xs rounded-lg">
                              {idx + 1}. {w}
                            </span>
                          ))}
                        </div>
                      </div>

                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={handleProceed} className="relative group cursor-pointer focus:outline-none select-none w-full">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-80" style={{ background: DIFF_GRADIENT[diffId], filter: "brightness(0.7)" }} />
                        <div className="relative py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <RotateCcw className="w-4 h-4" />
                          Retry Stage {level}
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 5. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">GAME OVER</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode · Failed at Stage {level}</p>
                        {level >= highScores[diffId] && level > 1 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — Stage {level}!
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm w-full">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Words Memorized</div>
                        <div className="text-3xl text-slate-700 font-mono font-bold mt-1">{score} Words</div>
                      </div>
                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Game
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setScore(0); setStreak(0); setLevel(1); }}
                          className="relative group cursor-pointer focus:outline-none select-none"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
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
            {phase !== "select" && phase !== "gameover" && phase !== "result" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { stopAllTimers(); setPhase("gameover"); }}
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
