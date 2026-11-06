"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Anchor, Aperture, Archive, Award, Bell, Bird, Camera, Cloud, Code, Coins, Compass,
  Crown, Diamond, Feather, Flag, Flame, Gift, Heart, Image as ImageIcon, Key, Map,
  Moon, Music, Package, Pen, Phone, Star, Sun, Tag, Umbrella, Play, RotateCcw,
  Puzzle, AlertTriangle, Trophy, Shield, Zap, Volume2, VolumeX, ArrowRight, Eye
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
   ICONS LIST
───────────────────────────────────────────── */
const ICONS = [
  Anchor, Aperture, Archive, Award, Bell, Bird, Camera, Cloud, Code, Coins,
  Compass, Crown, Diamond, Feather, Flag, Flame, Gift, Heart, ImageIcon, Key,
  Map, Moon, Music, Package, Pen, Phone, Star, Sun, Tag, Umbrella
];

interface Card {
  id: number;
  iconIdx: number;
  isFlipped: boolean;
  isMatched: boolean;
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
  hasMoveLimit: boolean;
  maxMoves: number;
  hasTimeLimit: boolean;
  timeLimitSec: number;
  hasShuffleDistortion: boolean; // unmatched cards shuffle every N incorrect moves
  shuffleEveryMisses: number;
  hintCount: number; // beginner mode hints
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3×4 grid · 6 pairs · Infinite moves · 3 hints",
    rows: 3, cols: 4, hasMoveLimit: false, maxMoves: 0, hasTimeLimit: false, timeLimitSec: 0,
    hasShuffleDistortion: false, shuffleEveryMisses: 0, hintCount: 3,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4×4 grid · 8 pairs · Infinite moves · No hints",
    rows: 4, cols: 4, hasMoveLimit: false, maxMoves: 0, hasTimeLimit: false, timeLimitSec: 0,
    hasShuffleDistortion: false, shuffleEveryMisses: 0, hintCount: 0,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "5×4 grid · 10 pairs · 30 moves limit",
    rows: 5, cols: 4, hasMoveLimit: true, maxMoves: 30, hasTimeLimit: false, timeLimitSec: 0,
    hasShuffleDistortion: false, shuffleEveryMisses: 0, hintCount: 0,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "6×4 grid · 12 pairs · 25 moves · 90s timer",
    rows: 6, cols: 4, hasMoveLimit: true, maxMoves: 25, hasTimeLimit: true, timeLimitSec: 90,
    hasShuffleDistortion: false, shuffleEveryMisses: 0, hintCount: 0,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6×5 grid · 15 pairs · 30 moves · 60s timer · Board shuffle distortion!",
    rows: 6, cols: 5, hasMoveLimit: true, maxMoves: 30, hasTimeLimit: true, timeLimitSec: 60,
    hasShuffleDistortion: true, shuffleEveryMisses: 4, hintCount: 0,
    icon: Puzzle, textColor: "text-rose-600", borderColor: "border-rose-500",
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
          {highScore > 0 && (
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>
              Best: {highScore} {d.hasTimeLimit ? "s left" : "moves"}
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
export default function SymbolMemoryPageClient() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [hintsLeft, setHintsLeft] = useState(0);
  const [incorrectStreak, setIncorrectStreak] = useState(0); // tracker for pro shuffle
  const [muted, setMuted] = useState(false);
  
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 999, easy: 999, normal: 999, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];
  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 999, easy: 999, normal: 999, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`symbol-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const setupGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const d = DIFFICULTIES[diffId];
    const totalCards = d.rows * d.cols;
    const pairsCount = totalCards / 2;

    // Pick distinct random icons
    const selectedIcons: number[] = [];
    const usedIndices = new Set<number>();
    while (selectedIcons.length < pairsCount) {
      const r = Math.floor(Math.random() * ICONS.length);
      if (!usedIndices.has(r)) {
        usedIndices.add(r);
        selectedIcons.push(r);
      }
    }

    const gameCards = [...selectedIcons, ...selectedIcons]
      .sort(() => Math.random() - 0.5)
      .map((iconIdx, i) => ({
        id: i,
        iconIdx,
        isFlipped: false,
        isMatched: false
      }));

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setHintsLeft(d.hintCount);
    setIncorrectStreak(0);
    setPhase("playing");
    playSound("start");

    if (d.hasTimeLimit) {
      setTimeLeft(d.timeLimitSec);
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
    }
  }, [diffId, playSound]);

  const handleCardClick = useCallback((idx: number) => {
    if (phase !== "playing") return;
    if (cards[idx].isFlipped || cards[idx].isMatched) return;
    if (flippedCards.length >= 2) return;

    playSound("click");
    const newCards = [...cards];
    newCards[idx].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedCards, idx];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      const newMoves = moves + 1;
      setMoves(newMoves);

      // Check match
      const [idx1, idx2] = newFlipped;
      const isMatch = cards[idx1].iconIdx === cards[idx2].iconIdx;

      setTimeout(() => {
        const checkedCards = [...cards];
        if (isMatch) {
          checkedCards[idx1].isMatched = true;
          checkedCards[idx2].isMatched = true;
          setCards(checkedCards);
          setFlippedCards([]);
          setIncorrectStreak(0);
          playSound("success");

          // Check Win Condition
          if (checkedCards.every(c => c.isMatched)) {
            if (timerRef.current) clearInterval(timerRef.current);
            playSound("levelUp");
            setPhase("gameover");

            // Save High Score
            setHighScores(hs => {
              const currentScore = diff.hasTimeLimit ? timeLeft : newMoves;
              const isNewRecord = diff.hasTimeLimit ? (currentScore > hs[diffId]) : (currentScore < hs[diffId]);
              if (isNewRecord || hs[diffId] === 0 || hs[diffId] === 999) {
                localStorage.setItem(`symbol-hs-${diffId}`, currentScore.toString());
                return { ...hs, [diffId]: currentScore };
              }
              return hs;
            });
          }
        } else {
          // No Match
          checkedCards[idx1].isFlipped = false;
          checkedCards[idx2].isFlipped = false;
          setCards(checkedCards);
          setFlippedCards([]);
          playSound("error");

          // Pro mode shuffle distortion on incorrect flips
          if (diff.hasShuffleDistortion) {
            const nextMisses = incorrectStreak + 1;
            if (nextMisses >= diff.shuffleEveryMisses) {
              setIncorrectStreak(0);
              // Shuffle unmatched cards
              const unmatchedIndices = checkedCards
                .map((c, i) => ({ card: c, i }))
                .filter(item => !item.card.isMatched)
                .map(item => item.i);

              if (unmatchedIndices.length > 2) {
                // Shuffle their iconIdxs
                const iconPool = unmatchedIndices.map(i => checkedCards[i].iconIdx);
                const shuffledPool = [...iconPool].sort(() => Math.random() - 0.5);
                unmatchedIndices.forEach((gridIdx, poolIdx) => {
                  checkedCards[gridIdx].iconIdx = shuffledPool[poolIdx];
                });
                setCards(checkedCards);
                playSound("levelUp"); // play sound for distrotion trigger
              }
            } else {
              setIncorrectStreak(nextMisses);
            }
          }
        }

        // Check Move Limit Gameover
        if (diff.hasMoveLimit && newMoves >= diff.maxMoves && !checkedCards.every(c => c.isMatched)) {
          if (timerRef.current) clearInterval(timerRef.current);
          playSound("error");
          setPhase("gameover");
        }
      }, 750);
    }
  }, [phase, cards, flippedCards, moves, diff, playSound, incorrectStreak, diffId, timeLeft]);

  // Beginner Hint helper
  const triggerHint = useCallback(() => {
    if (hintsLeft <= 0 || phase !== "playing" || flippedCards.length !== 1) return;
    const flippedIdx = flippedCards[0];
    const targetIconIdx = cards[flippedIdx].iconIdx;

    // Find the paired card index
    const pairIdx = cards.findIndex((c, i) => c.iconIdx === targetIconIdx && i !== flippedIdx);
    if (pairIdx !== -1) {
      setHintsLeft(h => h - 1);
      // Briefly flash target card
      const tempCards = [...cards];
      tempCards[pairIdx].isFlipped = true;
      setCards(tempCards);

      setTimeout(() => {
        setCards(prev => {
          const revert = [...prev];
          if (!revert[pairIdx].isMatched) revert[pairIdx].isFlipped = false;
          return revert;
        });
      }, 800);
    }
  }, [hintsLeft, phase, flippedCards, cards]);

  const matchedPairs = cards.filter(c => c.isMatched).length / 2;
  const totalPairs = (diff.rows * diff.cols) / 2;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">SYMBOL PAIRS</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">TELEMETRY COGNITIVE PAIRING</p>
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
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {moves} {diff.hasMoveLimit && <span className="text-xs text-slate-400">/{diff.maxMoves}</span>}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Pairs Match</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {matchedPairs}/{totalPairs}
                  </div>
                </div>
                {diff.hasTimeLimit ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Timer</div>
                    <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 10 ? "text-red-500" : "text-slate-800"}`}>
                      {timeLeft}s
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Dimension</div>
                    <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                      {diff.cols}×{diff.rows}
                    </div>
                  </div>
                )}
                {diff.hintCount > 0 ? (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Hints</div>
                    <div className="text-xl font-mono font-bold text-emerald-600 mt-0.5">{hintsLeft}</div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Lives Status</div>
                    <div className="text-xs font-mono font-bold text-emerald-600 mt-1">NOMINAL</div>
                  </div>
                )}
              </div>

              {/* Best score display */}
              {highScores[diffId] > 0 && highScores[diffId] !== 999 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Record</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>
                      {diff.hasTimeLimit ? `${highScores[diffId]} seconds left` : `${highScores[diffId]} moves`}
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Shuffle alert counter */}
              {diff.hasShuffleDistortion && phase === "playing" && (
                <div className="mt-3 bg-slate-50 border border-red-150 rounded-xl p-3">
                  <div className="text-[11px] font-mono text-red-600 dark:text-red-500 uppercase tracking-widest animate-pulse">SHUFFLE STREAK</div>
                  <div className="text-sm font-mono font-bold text-slate-700 mt-0.5">
                    {incorrectStreak} / {diff.shuffleEveryMisses} misses
                  </div>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-tight mt-1">Unmatched cards shuffle at max misses!</p>
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
              {/* Corner decals */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />

              <div className="absolute top-4 left-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[10px] font-mono text-slate-500 dark:text-slate-400 tracking-widest hidden sm:block">
                DIM: {diff.cols}×{diff.rows}
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
                          <Puzzle className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Retinal Pair Calibration</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Match identical symbol pairs by flipping cards. Complete the grid in minimal cycles before the session ends.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={setupGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Deck
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. PLAYING SCREEN ── */}
                  {phase === "playing" && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-4">
                      
                      {/* Hint Button (Beginner mode) */}
                      {diff.hintCount > 0 && (
                        <div className="flex justify-between items-center w-full max-w-md">
                          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">[ HINTS ALLOWED ]</span>
                          <button
                            onClick={triggerHint}
                            disabled={hintsLeft <= 0 || flippedCards.length !== 1}
                            className={`px-3 py-1 rounded-xl border font-mono text-[10px] flex items-center gap-1.5 transition-all select-none ${
                              hintsLeft > 0 && flippedCards.length === 1
                                ? "border-emerald-250 bg-emerald-50 text-emerald-700 cursor-pointer hover:bg-emerald-100/60"
                                : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                            }`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Reveal Partner ({hintsLeft})
                          </button>
                        </div>
                      )}

                      {/* Display Grid */}
                      <div
                        className="grid gap-2 sm:gap-3 bg-slate-50 border border-slate-250 p-4 rounded-3xl shadow-inner w-full max-w-md"
                        style={{ gridTemplateColumns: `repeat(${diff.cols}, minmax(0, 1fr))` }}
                      >
                        {cards.map((card, idx) => {
                          const Icon = ICONS[card.iconIdx];
                          const isFlipped = card.isFlipped || card.isMatched;

                          return (
                            <div key={idx} className="relative aspect-square w-full">
                              {/* 3D shadow depth base */}
                              <div className={`absolute inset-0 rounded-xl translate-y-0.5 border-b border-black/10 ${isFlipped ? "bg-fuchsia-100" : "bg-slate-200"}`} />
                              
                              <motion.div
                                animate={{
                                  y: isFlipped ? 2 : 0,
                                  rotateY: isFlipped ? 180 : 0
                                }}
                                whileHover={!isFlipped ? { y: -0.5 } : {}}
                                whileTap={!isFlipped ? { y: 2 } : {}}
                                transition={{ type: "spring", stiffness: 450, damping: 20 }}
                                onClick={() => handleCardClick(idx)}
                                className="absolute inset-0 rounded-xl cursor-pointer"
                                style={{ transformStyle: "preserve-3d" }}
                              >
                                {/* Back side cap */}
                                <div
                                  className="absolute inset-0 rounded-xl border border-slate-200 bg-white hover:bg-slate-50/50 flex items-center justify-center shadow-sm select-none"
                                  style={{ backfaceVisibility: "hidden" }}
                                >
                                  <span className="text-slate-300 font-mono font-bold text-sm sm:text-base">?</span>
                                </div>

                                {/* Front side cap */}
                                <div
                                  className={`absolute inset-0 rounded-xl border flex items-center justify-center shadow-inner ${
                                    card.isMatched
                                      ? "bg-emerald-50/60 border-emerald-250 opacity-60"
                                      : "bg-fuchsia-50 border-fuchsia-200"
                                  }`}
                                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                                >
                                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${card.isMatched ? "text-emerald-500" : "text-fuchsia-500"}`} />
                                </div>
                              </motion.div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      {cards.every(c => c.isMatched) ? (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                            <Trophy className="w-8 h-8 text-emerald-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">ALIGN_COMPLETE</div>
                            <p className="text-xs font-mono text-slate-500">Board matched successfully!</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm w-full">
                            <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Total Moves</div>
                            <div className="text-4xl text-fuchsia-600 font-mono font-black">{moves}</div>
                            {diff.hasTimeLimit && (
                              <div className="text-xs font-mono text-slate-500 mt-1">Finished with {timeLeft}s left</div>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                          </div>
                          <div className="space-y-1">
                            <div className="text-2xl font-mono font-black text-red-650 tracking-wider">ALIGN_DISRUPT</div>
                            <p className="text-xs font-mono text-slate-500">Stability limit reached before matching board.</p>
                          </div>
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm w-full">
                            <div className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase">Matches Cleared</div>
                            <div className="text-3xl text-slate-700 font-mono font-bold mt-1">{matchedPairs} / {totalPairs} Pairs</div>
                          </div>
                        </>
                      )}

                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={setupGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry Deck
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setMoves(0); setIncorrectStreak(0); }}
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
