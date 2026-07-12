"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, ArrowUpDown
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
  activeCategories: string[];
  maxMistakes: number;
  timeLimitSec: number;
  hasShuffling: boolean; // Shuffles bin buttons locations on hits
  hasDistractor: boolean; // Adds "Discard" glitch items
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2 Categories (Fruit/Animal) · 30s timer · No strike limits",
    activeCategories: ["Fruit", "Animal"], maxMistakes: 999, timeLimitSec: 30, hasShuffling: false, hasDistractor: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3 Categories (Fruit/Animal/Vehicle) · 30s timer · No strike limits",
    activeCategories: ["Fruit", "Animal", "Vehicle"], maxMistakes: 999, timeLimitSec: 30, hasShuffling: false, hasDistractor: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4 Categories (Fruit/Animal/Vehicle/Sport) · 45s timer · 5 lives",
    activeCategories: ["Fruit", "Animal", "Vehicle", "Sport"], maxMistakes: 5, timeLimitSec: 45, hasShuffling: false, hasDistractor: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "5 Categories (adds Instrument) · Shuffles bin locations on hits · 3 lives",
    activeCategories: ["Fruit", "Animal", "Vehicle", "Sport", "Instrument"], maxMistakes: 3, timeLimitSec: 45, hasShuffling: true, hasDistractor: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6 Categories (adds Flags) + Discard distractor bins · Shuffles bins · 3 lives",
    activeCategories: ["Fruit", "Animal", "Vehicle", "Sport", "Instrument", "Flag"], maxMistakes: 3, timeLimitSec: 45, hasShuffling: true, hasDistractor: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface SortItem {
  id: number;
  label: string;
  category: string;
  emoji: string;
}

const CATEGORIES_DATA: Record<string, { items: { label: string; emoji: string }[], bg: string, depth: string, border: string }> = {
  "Fruit": {
    items: [
      { label: "Apple", emoji: "🍎" }, { label: "Banana", emoji: "🍌" }, { label: "Cherry", emoji: "🍒" },
      { label: "Grapes", emoji: "🍇" }, { label: "Orange", emoji: "🍊" }, { label: "Mango", emoji: "🥭" },
    ],
    bg: "bg-emerald-500", depth: "bg-emerald-700", border: "border-emerald-400"
  },
  "Animal": {
    items: [
      { label: "Dog", emoji: "🐕" }, { label: "Cat", emoji: "🐈" }, { label: "Bird", emoji: "🐦" },
      { label: "Fish", emoji: "🐟" }, { label: "Horse", emoji: "🐴" }, { label: "Rabbit", emoji: "🐇" },
    ],
    bg: "bg-amber-400", depth: "bg-amber-600", border: "border-amber-350"
  },
  "Vehicle": {
    items: [
      { label: "Car", emoji: "🚗" }, { label: "Train", emoji: "🚂" }, { label: "Plane", emoji: "✈️" },
      { label: "Boat", emoji: "⛵" }, { label: "Bus", emoji: "🚌" }, { label: "Bike", emoji: "🚲" },
    ],
    bg: "bg-blue-500", depth: "bg-blue-700", border: "border-blue-400"
  },
  "Sport": {
    items: [
      { label: "Soccer", emoji: "⚽" }, { label: "Tennis", emoji: "🎾" }, { label: "Basketball", emoji: "🏀" },
      { label: "Golf", emoji: "⛳" }, { label: "Swimming", emoji: "🏊" }, { label: "Baseball", emoji: "⚾" },
    ],
    bg: "bg-purple-500", depth: "bg-purple-700", border: "border-purple-400"
  },
  "Instrument": {
    items: [
      { label: "Guitar", emoji: "🎸" }, { label: "Piano", emoji: "🎹" }, { label: "Violin", emoji: "🎻" },
      { label: "Drums", emoji: "🥁" }, { label: "Saxophone", emoji: "🎷" }, { label: "Trumpet", emoji: "🎺" },
    ],
    bg: "bg-pink-500", depth: "bg-pink-700", border: "border-pink-400"
  },
  "Flag": {
    items: [
      { label: "USA", emoji: "🇺🇸" }, { label: "Japan", emoji: "🇯🇵" }, { label: "UK", emoji: "🇬🇧" },
      { label: "France", emoji: "🇫🇷" }, { label: "Canada", emoji: "🇨🇦" }, { label: "Germany", emoji: "🇩🇪" },
    ],
    bg: "bg-teal-500", depth: "bg-teal-700", border: "border-teal-400"
  },
  "Discard": {
    items: [
      { label: "Trash", emoji: "🗑️" }, { label: "Glitch", emoji: "👾" }, { label: "Toxic", emoji: "☣️" }
    ],
    bg: "bg-slate-500", depth: "bg-slate-700", border: "border-slate-400"
  }
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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} sorted</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function QuickSortGame() {
  const content = getToolContent("quick-sort", "Quick Sort");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [sortedCount, setSortedCount] = useState(0);
  const [errorsCount, setErrorsCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [muted, setMuted] = useState(false);

  // Sorting items states
  const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const diff = DIFFICULTIES[diffId];

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`quicksort-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateNextSortItem = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    
    // Choose if distractor trash item is generated (15% chance in Professional)
    const isDistractor = d.hasDistractor && Math.random() < 0.15;
    
    let activeCat = "";
    let itemData = { label: "", emoji: "" };
    
    if (isDistractor) {
      activeCat = "Discard";
      const trashItems = CATEGORIES_DATA["Discard"].items;
      itemData = trashItems[Math.floor(Math.random() * trashItems.length)];
    } else {
      activeCat = d.activeCategories[Math.floor(Math.random() * d.activeCategories.length)];
      const itemsList = CATEGORIES_DATA[activeCat].items;
      itemData = itemsList[Math.floor(Math.random() * itemsList.length)];
    }

    setCurrentItem({
      id: Date.now(),
      label: itemData.label,
      category: activeCat,
      emoji: itemData.emoji
    });

    // Populate category sorting bins (include Discard if professional is active)
    const list = [...d.activeCategories];
    if (d.hasDistractor) {
      list.push("Discard");
    }

    // Shuffle buttons if shuffling active
    if (d.hasShuffling) {
      list.sort(() => Math.random() - 0.5);
    }
    setCategoriesList(list);
  }, [diffId]);

  const startGame = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    setSortedCount(0);
    setErrorsCount(0);
    setTimeLeft(d.timeLimitSec);
    setFeedback(null);
    setPhase("playing");
    playSound("start");
    
    // Wait briefly to generate item to avoid overlaps
    setTimeout(() => generateNextSortItem(), 50);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          playSound("levelUp");
          setPhase("result");

          // Save high score
          setHighScores(hs => {
            if (sortedCount > hs[diffId]) {
              localStorage.setItem(`quicksort-hs-${diffId}`, sortedCount.toString());
              return { ...hs, [diffId]: sortedCount };
            }
            return hs;
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, sortedCount, playSound, generateNextSortItem]);

  const handleSort = useCallback((category: string) => {
    if (!currentItem || phase !== "playing") return;

    if (currentItem.category === category) {
      playSound("click");
      setSortedCount(s => s + 1);
      setFeedback("correct");
      
      setTimeout(() => {
        setFeedback(null);
        generateNextSortItem();
      }, 150);
    } else {
      playSound("error");
      setErrorsCount(e => {
        const nextE = e + 1;
        if (nextE >= diff.maxMistakes) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("result");
          playSound("error");
        }
        return nextE;
      });
      setFeedback("wrong");
      setTimeout(() => setFeedback(null), 300);
    }
  }, [currentItem, phase, diff, playSound, generateNextSortItem]);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const totalAttempts = sortedCount + errorsCount;
  const accuracyPercent = totalAttempts > 0 ? Math.round((sortedCount / totalAttempts) * 100) : 100;

  // Grid styling for choice cards
  const getGridColsClass = () => {
    const listLen = categoriesList.length;
    if (listLen <= 2) return "grid-cols-2 max-w-xs";
    if (listLen === 3) return "grid-cols-3 max-w-sm";
    if (listLen === 4) return "grid-cols-2 max-w-sm sm:grid-cols-4 sm:max-w-md";
    return "grid-cols-3 max-w-md"; // 5 or 7 options (including Discard)
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">QUICK SORT</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">CATEGORIAL DECK ALIGNER</p>
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Sorted</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{sortedCount}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracyPercent}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - errorsCount} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time Buffer</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Score ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} sorted</div>
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
                SORT ENGINE: {diff.hasShuffling ? "SHUFFLED KEYPADS" : "STATIC KEYPADS"}
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
                          <ArrowUpDown className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Quick Sorting</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Sort emerging emoji elements into correct classification boxes as quickly as possible. Don't mismatch targets!
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Sorter Deck
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && currentItem && (
                    <motion.div
                      key="playing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-8 text-center w-full max-w-md flex flex-col items-center justify-center"
                    >
                      {/* Active Sorting Item LCD Screen */}
                      <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-6 py-8 shadow-inner w-full min-h-[160px] flex items-center justify-center overflow-hidden relative">
                        <div className="text-[8px] font-mono text-slate-400 uppercase tracking-widest absolute top-3">
                          [ CURRENT TARGET ITEM ]
                        </div>
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentItem.id}
                            initial={{ scale: 0.85, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.85, opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                          >
                            <span className="text-5xl mb-2 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]">{currentItem.emoji}</span>
                            <span className="text-2xl font-mono font-bold text-slate-800">{currentItem.label.toUpperCase()}</span>
                          </motion.div>
                        </AnimatePresence>

                        <AnimatePresence>
                          {feedback && (
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className={`absolute bottom-3 text-xs font-mono font-black uppercase tracking-wider ${
                                feedback === "correct" ? "text-emerald-500" : "text-red-500"
                              }`}
                            >
                              {feedback === "correct" ? "✓ correct sorting" : "✗ wrong classification"}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Sorting Choice Bins Grid */}
                      <div className={`grid gap-3.5 p-4 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner w-full justify-center ${getGridColsClass()}`}>
                        {categoriesList.map(cat => {
                          const catData = CATEGORIES_DATA[cat];
                          return (
                            <div key={cat} className="relative h-16 w-28">
                              {/* 3D Depth base */}
                              <div className={`absolute inset-0 rounded-2xl ${catData.depth} translate-y-1 border-b-2 border-black/25`} />
                              {/* Keycap */}
                              <motion.button
                                whileHover={{ y: 0.5 }}
                                whileTap={{ y: 3 }}
                                onClick={() => handleSort(cat)}
                                className={`absolute inset-0 rounded-2xl border-2 ${catData.bg} ${catData.border} text-white font-mono font-black text-[10px] md:text-xs shadow-md flex items-center justify-center transition-all select-none cursor-pointer hover:brightness-105 active:translate-y-1`}
                              >
                                {cat.toUpperCase()}
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex gap-4 text-[9px] font-mono text-slate-400 uppercase">
                        <span>Sorted: {sortedCount}</span>
                        <span>Mistakes: {errorsCount}/{diff.maxMistakes}</span>
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_COMPLETE</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode sorting completed.</p>
                        {sortedCount >= highScores[diffId] && sortedCount > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {sortedCount} sorted!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Total Sorted</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{sortedCount} items</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Accuracy</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{accuracyPercent}% ACC</div>
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
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("result"); }}
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
            title="Quick Sort Speed Game"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Improves cognitive categorization speeds and sorting reflexes.",
              "Sharpens decision choice mapping accuracy under high time pressure.",
              "Forces scanning adaptation by shuffling bin buttons on hits.",
              "Tests visual classification accuracy through mistake strike caps.",
              "Retains highest sorting records across all challenge difficulties.",
            ]}
            howToPlay={[
              "Choose a difficulty — Beginner (2 categories, static) to Professional (6 categories, shuffles, bomb distractors).",
              "Click 'Initialize Sorter Deck' to begin the countdown timer.",
              "Locate the active emoji node displayed inside the LCD display screen.",
              "Sort it into the correct category button. Correct clicks spawn the subsequent node.",
              "On Hard and Professional, watch the choice keys rearrange positions after correct sorting hits.",
              "On Professional, check for distractor trash items and click 'DISCARD' to discard them.",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
