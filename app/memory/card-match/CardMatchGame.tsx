"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers, Play, RotateCcw, Trophy, AlertTriangle,
  Shield, Star, Zap, Flame, Heart, Volume2, VolumeX, ArrowRight, Brain
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
   EMOJIS DATABASE
───────────────────────────────────────────── */
const EMOJIS = [
  "🍎", "🍊", "🍋", "🍇", "🍉", "🌸", "🔥", "⚡", "🌙", "🎯", "💎", "🎵", "🌊", "🍀", "🦋", "🎨", "🚀", "⭐"
];

// Professional border colors
const BORDERS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];

interface Card {
  id: number;
  emoji: string;
  matched: boolean;
  isFlipped: boolean;
  borderColor?: string; // used for Professional extra criteria
}

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  rows: number;
  cols: number;
  timeLimitSec: number;
  lives: number;
  hasTimeDeduction: boolean; // mismatch subtracts time, match adds time
  hasBorderMatch: boolean; // must match BOTH emoji and border color
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3×2 grid · 3 pairs · 45s timer · 3 lives",
    rows: 3, cols: 2, timeLimitSec: 45, lives: 3, hasTimeDeduction: false, hasBorderMatch: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4×3 grid · 6 pairs · 60s timer · 3 lives",
    rows: 4, cols: 3, timeLimitSec: 60, lives: 3, hasTimeDeduction: false, hasBorderMatch: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4×4 grid · 8 pairs · 45s timer · 2 lives",
    rows: 4, cols: 4, timeLimitSec: 45, lives: 2, hasTimeDeduction: false, hasBorderMatch: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "6×4 grid · 12 pairs · 60s timer · 1 life",
    rows: 6, cols: 4, timeLimitSec: 60, lives: 1, hasTimeDeduction: false, hasBorderMatch: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6×6 grid · 18 pairs · Match emoji AND border color! · Timer ±3s changes",
    rows: 6, cols: 6, timeLimitSec: 90, lives: 1, hasTimeDeduction: true, hasBorderMatch: true,
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
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full text-white" style={{ background: DIFF_GRADIENT[diffKey] }}>
                ACTIVE
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-tight">{d.description}</p>
          {highScore > 0 && highScore !== 999 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>
              Best: {highScore}s
            </p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function CardMatchGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load high scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 999, easy: 999, normal: 999, hard: 999, professional: 999 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`cardmatch-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const d = DIFFICULTIES[diffId];
    const totalCards = d.rows * d.cols;
    const pairCount = totalCards / 2;

    // Pick subset of Emojis
    const selectedEmojis = EMOJIS.slice(0, pairCount);

    let deck: Card[] = [];
    if (d.hasBorderMatch) {
      // Professional: Each emoji card has a border color. Pairs must match both!
      // Select random border color for each pair
      deck = selectedEmojis.flatMap((emoji, idx) => {
        const border = BORDERS[idx % BORDERS.length];
        return [
          { id: idx * 2, emoji, matched: false, isFlipped: false, borderColor: border },
          { id: idx * 2 + 1, emoji, matched: false, isFlipped: false, borderColor: border }
        ];
      });
    } else {
      deck = [...selectedEmojis, ...selectedEmojis].map((emoji, idx) => ({
        id: idx,
        emoji,
        matched: false,
        isFlipped: false,
      }));
    }

    // Shuffle deck
    deck.sort(() => Math.random() - 0.5);

    setCards(deck);
    setFlipped([]);
    setLocked(false);
    setMoves(0);
    setMatches(0);
    setLivesLeft(d.lives);
    setStreak(0);
    setTimeLeft(d.timeLimitSec);
    setPhase("playing");
    playSound("start");

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          playSound("error");
          setPhase("gameover");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, playSound]);

  const handleCardClick = useCallback((id: number) => {
    if (locked || phase !== "playing") return;
    const idx = cards.findIndex(c => c.id === id);
    if (idx === -1 || cards[idx].matched || cards[idx].isFlipped) return;
    if (flipped.length >= 2) return;

    playSound("click");
    const updatedCards = [...cards];
    updatedCards[idx].isFlipped = true;
    setCards(updatedCards);

    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setLocked(true);
      const [id1, id2] = newFlipped;
      const c1 = cards.find(c => c.id === id1);
      const c2 = cards.find(c => c.id === id2);

      const isEmojiMatch = c1 && c2 && c1.emoji === c2.emoji;
      const isBorderMatch = !diff.hasBorderMatch || (c1 && c2 && c1.borderColor === c2.borderColor);
      const isMatch = isEmojiMatch && isBorderMatch;

      setTimeout(() => {
        setCards(prev => {
          const next = [...prev];
          const i1 = next.findIndex(c => c.id === id1);
          const i2 = next.findIndex(c => c.id === id2);

          if (isMatch) {
            next[i1].matched = true;
            next[i2].matched = true;
            playSound("success");
            setMatches(m => {
              const nextMatches = m + 1;
              const totalPairs = (diff.rows * diff.cols) / 2;

              if (diff.hasTimeDeduction) {
                // Correct match bonus
                setTimeLeft(t => Math.min(t + 4, diff.timeLimitSec));
              }

              if (nextMatches === totalPairs) {
                if (timerRef.current) clearInterval(timerRef.current);
                playSound("levelUp");
                setPhase("gameover");

                // Save High Score (lowest time remaining, i.e. finished fastest, or most time remaining)
                setHighScores(hs => {
                  const usedTime = diff.timeLimitSec - timeLeft;
                  if (usedTime < hs[diffId] || hs[diffId] === 999) {
                    localStorage.setItem(`cardmatch-hs-${diffId}`, usedTime.toString());
                    return { ...hs, [diffId]: usedTime };
                  }
                  return hs;
                });
              }
              return nextMatches;
            });
          } else {
            next[i1].isFlipped = false;
            next[i2].isFlipped = false;
            playSound("error");

            if (diff.hasTimeDeduction) {
              // Mismatch penalty
              setTimeLeft(t => Math.max(0, t - 3));
            }

            const nextLives = livesLeft - 1;
            setLivesLeft(nextLives);

            if (nextLives <= 0) {
              if (timerRef.current) clearInterval(timerRef.current);
              setPhase("gameover");
            }
          }
          return next;
        });

        setFlipped([]);
        setLocked(false);
      }, 750);
    }
  }, [locked, phase, cards, flipped, diff, playSound, livesLeft, timeLeft, diffId]);

  const pairCount = (diff.rows * diff.cols) / 2;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">CARD MATCH</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">EMOJI PAIRS COGNI MATCHING</p>
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
                    onSelect={() => { if (phase === "select" || phase === "gameover") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Moves</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{moves}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Aligned</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{matches}/{pairCount}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Lives</div>
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {Array.from({ length: diff.lives }).map((_, i) => (
                      <Heart key={i} className={`w-4 h-4 ${i < livesLeft ? "text-rose-500 fill-rose-500" : "text-slate-200 fill-slate-200"}`} />
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Left</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 10 ? "text-red-500" : "text-slate-800"}`}>{timeLeft}s</div>
                </div>
              </div>

              {/* Best score */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Record</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}s clear</div>
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
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                GRID: {diff.cols}×{diff.rows}
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
                          <Layers className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Emoji Match Calibration</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Re-order and align matching emoji card coordinates before the countdown timer runs out.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Matcher
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-4">
                      
                      {diff.hasBorderMatch && (
                        <div className="text-center">
                          <span className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-mono font-bold rounded-full uppercase tracking-wider">
                            CRITICAL: Match Emoji AND Card Border Color!
                          </span>
                        </div>
                      )}

                      {/* Display grid */}
                      <div
                        className="grid gap-2 sm:gap-3 bg-slate-50 border border-slate-200/80 p-4 rounded-3xl shadow-inner w-full max-w-md"
                        style={{ gridTemplateColumns: `repeat(${diff.cols}, minmax(0, 1fr))` }}
                      >
                        {cards.map(card => {
                          const isFlipped = flipped.includes(card.id) || card.matched;

                          return (
                            <div key={card.id} className="relative aspect-square w-full">
                              <div className={`absolute inset-0 rounded-xl translate-y-0.5 border-b border-black/10 ${isFlipped ? "bg-fuchsia-100" : "bg-slate-200"}`} />
                              <motion.div
                                animate={{
                                  y: isFlipped ? 2 : 0,
                                  rotateY: isFlipped ? 180 : 0
                                }}
                                whileHover={!isFlipped ? { y: -0.5 } : {}}
                                whileTap={!isFlipped ? { y: 2 } : {}}
                                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                onClick={() => handleCardClick(card.id)}
                                className="absolute inset-0 rounded-xl cursor-pointer"
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                {/* Back side */}
                                <div
                                  className="absolute inset-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 flex items-center justify-center shadow-sm select-none"
                                  style={{
                                    backfaceVisibility: "hidden",
                                    borderWidth: diff.hasBorderMatch ? "2px" : "1px",
                                    borderColor: diff.hasBorderMatch ? card.borderColor : "#e2e8f0"
                                  }}
                                >
                                  <span className="text-slate-300 font-mono font-bold text-sm sm:text-base">?</span>
                                </div>

                                {/* Front side */}
                                <div
                                  className={`absolute inset-0 rounded-xl border flex items-center justify-center shadow-inner ${
                                    card.matched
                                      ? "bg-emerald-50/60 border-emerald-250 opacity-60"
                                      : "bg-fuchsia-50 border-fuchsia-200"
                                  }`}
                                  style={{
                                    transform: "rotateY(180deg)",
                                    backfaceVisibility: "hidden",
                                    borderWidth: diff.hasBorderMatch ? "3px" : "1px",
                                    borderColor: diff.hasBorderMatch ? card.borderColor : "#e2e8f0"
                                  }}
                                >
                                  <span className="text-xl sm:text-2xl md:text-3xl select-none">{card.emoji}</span>
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Timer Bar */}
                      <div className="w-full max-w-xs h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: timeLeft <= 10 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                          animate={{ width: `${(timeLeft / diff.timeLimitSec) * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      {matches === pairCount ? (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                            <Trophy className="w-8 h-8 text-emerald-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIB_SUCCESS</div>
                            <p className="text-xs font-mono text-slate-500">Board matched successfully!</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm w-full">
                            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Clear Time</div>
                            <div className="text-3xl text-fuchsia-600 font-mono font-black">{diff.timeLimitSec - timeLeft} seconds</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIB_DISRUPT</div>
                            <p className="text-xs font-mono text-slate-500">Stability limit reached before matching board.</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm w-full">
                            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Aligned Pairs</div>
                            <div className="text-3xl text-slate-700 font-mono font-bold mt-1">{matches} / {pairCount} Pairs</div>
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Deck
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setMoves(0); }}
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
            {phase === "playing" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setPhase("gameover"); }}
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
