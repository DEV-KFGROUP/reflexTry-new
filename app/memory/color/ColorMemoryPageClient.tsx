"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { useGameSound } from "@/hooks/useGameSound";
import {
  Play, RotateCcw, Palette, AlertTriangle,
  Shield, Star, Zap, Flame, Trophy, Heart,
  Volume2, VolumeX, ArrowRight, Brain
} from "lucide-react";

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
   COLORS DATABASE
───────────────────────────────────────────── */
interface ColorItem {
  name: string;
  hex: string;
  styleClass: string; // fallback matching classes
}

const ALL_COLORS: ColorItem[] = [
  { name: "RED", hex: "#ef4444", styleClass: "text-red-500" },
  { name: "BLUE", hex: "#3b82f6", styleClass: "text-blue-500" },
  { name: "GREEN", hex: "#10b981", styleClass: "text-emerald-500" },
  { name: "YELLOW", hex: "#f59e0b", styleClass: "text-amber-500" },
  { name: "PURPLE", hex: "#8b5cf6", styleClass: "text-purple-500" },
  { name: "ORANGE", hex: "#f97316", styleClass: "text-orange-500" },
  { name: "PINK", hex: "#ec4899", styleClass: "text-pink-500" },
];

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIG
───────────────────────────────────────────── */
type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  colorCount: number;
  congruentChance: number; // probability of word matching ink color
  timeLimitSec: number;
  lives: number;
  hasDistortion: boolean; // rotated words
  hasReverseStroop: boolean; // match word text vs match ink color randomly
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3 colors · Long timer · 3 lives · Standard matching",
    colorCount: 3, congruentChance: 0.6, timeLimitSec: 60, lives: 3,
    hasDistortion: false, hasReverseStroop: false,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "4 colors · 45s timer · 3 lives · Standard matching",
    colorCount: 4, congruentChance: 0.4, timeLimitSec: 45, lives: 3,
    hasDistortion: false, hasReverseStroop: false,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "5 colors · 30s timer · 2 lives · Incongruent",
    colorCount: 5, congruentChance: 0.15, timeLimitSec: 30, lives: 2,
    hasDistortion: false, hasReverseStroop: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "6 colors · 25s timer · 1 life · Rotated text",
    colorCount: 6, congruentChance: 0.1, timeLimitSec: 25, lives: 1,
    hasDistortion: true, hasReverseStroop: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "7 colors · 20s timer · 1 life · Dual Switch Mode",
    colorCount: 7, congruentChance: 0.1, timeLimitSec: 20, lives: 1,
    hasDistortion: true, hasReverseStroop: true,
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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} pts</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN CLIENT
───────────────────────────────────────────── */
export default function ColorMemoryPageClient() {
  const content = getToolContent("color-memory", "Color Matching (Stroop Test)");
  const { play } = useGameSound();

  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [livesLeft, setLivesLeft] = useState(1);
  const [streak, setStreak] = useState(0);
  const [muted, setMuted] = useState(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  // Stroop round state
  const [wordText, setWordText] = useState("");
  const [wordColor, setWordColor] = useState<ColorItem>(ALL_COLORS[0]);
  const [matchMode, setMatchMode] = useState<"ink" | "word">("ink"); // ink matching or word value matching
  const [distortionAngle, setDistortionAngle] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const diff = DIFFICULTIES[diffId];

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  // Load scores
  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`color-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const nextRound = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    const pool = ALL_COLORS.slice(0, d.colorCount);
    
    // Choose random color for word text
    const textIdx = Math.floor(Math.random() * pool.length);
    const word = pool[textIdx];

    // Determine if it should be congruent
    let ink: ColorItem;
    if (Math.random() < d.congruentChance) {
      ink = word;
    } else {
      const poolWithoutWord = pool.filter(c => c.name !== word.name);
      ink = poolWithoutWord[Math.floor(Math.random() * poolWithoutWord.length)];
    }

    setWordText(word.name);
    setWordColor(ink);

    // Hard/Professional features
    if (d.hasDistortion) {
      setDistortionAngle(Math.floor(Math.random() * 41) - 20); // random angle between -20deg and 20deg
    } else {
      setDistortionAngle(0);
    }

    if (d.hasReverseStroop) {
      setMatchMode(Math.random() > 0.5 ? "word" : "ink");
    } else {
      setMatchMode("ink");
    }
  }, [diffId]);

  const startGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const d = DIFFICULTIES[diffId];
    setScore(0);
    setTimeLeft(d.timeLimitSec);
    setLivesLeft(d.lives);
    setStreak(0);
    setPhase("playing");
    playSound("start");
    nextRound();

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          playSound("levelUp");
          setPhase(prev => {
            // Update high score
            setHighScores(hs => {
              if (score > hs[diffId]) {
                const updated = { ...hs, [diffId]: score };
                localStorage.setItem(`color-hs-${diffId}`, score.toString());
                return updated;
              }
              return hs;
            });
            return "gameover";
          });
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diffId, nextRound, playSound, score]);

  const handleAnswer = useCallback((colorHex: string) => {
    if (phase !== "playing") return;

    // Check if target is correct based on mode
    const targetItem = matchMode === "ink" ? wordColor : ALL_COLORS.find(c => c.name === wordText);
    const isCorrect = targetItem && targetItem.hex === colorHex;

    if (isCorrect) {
      playSound("success");
      setStreak(s => s + 1);
      // Capped +1s professional bonus, or normal score additions
      setScore(s => {
        const bonus = streak >= 3 ? 150 : 100;
        const newScore = s + bonus;
        // Pro adds 1s per correct answer
        if (diff.id === "professional") {
          setTimeLeft(t => Math.min(t + 1, diff.timeLimitSec));
        }
        return newScore;
      });
      nextRound();
    } else {
      playSound("error");
      setStreak(0);
      setScore(s => Math.max(0, s - 50));
      const remainingLives = livesLeft - 1;
      setLivesLeft(remainingLives);

      if (remainingLives <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Save score immediately
        setHighScores(hs => {
          if (score > hs[diffId]) {
            localStorage.setItem(`color-hs-${diffId}`, score.toString());
            return { ...hs, [diffId]: score };
          }
          return hs;
        });
        setPhase("gameover");
      } else {
        nextRound();
      }
    }
  }, [phase, matchMode, wordColor, wordText, streak, playSound, diff, livesLeft, score, diffId, nextRound]);

  const activeColors = ALL_COLORS.slice(0, diff.colorCount);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">COLOR MATCHING</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">STROOP COGNITIVE TEST</p>
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
                    onSelect={() => { if (phase === "select" || phase === "gameover") setDiffId(key); }}
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Score</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Streak</div>
                  <div className={`text-lg font-mono font-bold mt-0.5 ${streak >= 3 ? "text-orange-500" : "text-slate-800"}`}>
                    {streak >= 3 ? `🔥x${streak}` : `x${streak}`}
                  </div>
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
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Time</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${timeLeft <= 5 ? "text-red-500" : "text-slate-800"}`}>
                    {timeLeft}s
                  </div>
                </div>
              </div>

              {/* Best Score display */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} pts</div>
                  </div>
                </div>
              )}

              {/* Mute toggle */}
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
              {/* Decals */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-slate-200" />
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-slate-200" />
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-slate-200" />
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-slate-200" />
              
              <div className="absolute top-4 left-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                DECK // {diff.label.toUpperCase()}
              </div>
              <div className="absolute top-4 right-10 text-[8px] font-mono text-slate-400 tracking-widest hidden sm:block">
                POOL: {diff.colorCount} COLORS
              </div>

              <div className="p-6 md:p-10 min-h-[460px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "select" && (
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
                          A color word will flash on screen. Match the requested style (ink or word value) before the time expires.
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
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-10 w-full flex flex-col items-center">
                      
                      {/* Top banner prompt instruction */}
                      <div className="text-center">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold shadow-sm border ${
                          matchMode === "ink"
                            ? "bg-cyan-50 border-cyan-200 text-cyan-700"
                            : "bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700"
                        }`}>
                          {matchMode === "ink" ? "MATCH INK COLOR" : "MATCH TEXT VALUE"}
                        </span>
                      </div>

                      {/* Display Stroop word */}
                      <div className="h-32 flex items-center justify-center relative w-full">
                        <motion.div
                          key={`${wordText}-${wordColor.name}`}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1, rotate: distortionAngle }}
                          transition={{ type: "spring", stiffness: 350, damping: 15 }}
                          className="text-6xl sm:text-7xl font-mono font-black select-none tracking-tight"
                          style={{
                            color: wordColor.hex,
                            filter: `drop-shadow(0 4px 8px ${wordColor.hex}25)`
                          }}
                        >
                          {wordText}
                        </motion.div>
                      </div>

                      {/* Timer Bar */}
                      <div className="w-full max-w-md h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: timeLeft <= 5 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                          animate={{ width: `${(timeLeft / diff.timeLimitSec) * 100}%` }}
                          transition={{ duration: 1, ease: "linear" }}
                        />
                      </div>

                      {/* Interaction buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-xl">
                        {activeColors.map(c => (
                          <div key={c.name} className="relative h-14 w-full">
                            {/* Depth base */}
                            <div className="absolute inset-0 rounded-xl bg-slate-200 translate-y-0.5 border-b border-black/10" />
                            <motion.button
                              whileHover={{ y: -1 }}
                              whileTap={{ y: 2 }}
                              transition={{ type: "spring", stiffness: 450, damping: 18 }}
                              onClick={() => handleAnswer(c.hex)}
                              className="absolute inset-0 rounded-xl border border-slate-200 bg-white font-mono font-bold text-xs flex items-center justify-center shadow-sm select-none cursor-pointer hover:bg-slate-50 transition-colors"
                              style={{ borderLeft: `4px solid ${c.hex}` }}
                            >
                              {c.name}
                            </motion.button>
                          </div>
                        ))}
                      </div>

                    </motion.div>
                  )}

                  {/* ── 3. GAME OVER SCREEN ── */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIB_FINISHED</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} mode · Time out or zero lives</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} pts!
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm max-w-xs mx-auto">
                        <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">Peak Score</div>
                        <div className="text-4xl text-fuchsia-600 font-mono font-black">{score}</div>
                        <div className="text-[9px] font-mono text-slate-400 mt-2">[ SCORE REGISTERED ]</div>
                      </div>
                      <div className="flex gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Replay Game
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setScore(0); setStreak(0); setLivesLeft(diff.lives); }}
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
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Abort Calibration ×
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* SEO Content */}
        <div className="w-full max-w-5xl bg-white border border-slate-200 shadow-sm rounded-3xl p-6 md:p-8 relative z-10">
          <ToolContent
            title="Color Matching (Stroop Test)"
            description={content.description}
            howToUse={content.howToUse}
            howToImprove={content.howToImprove}
            faqs={content.faqs}
            relatedTools={content.relatedTools}
            benefits={[
              "Enhances selective attention by filtering out text meaning from color values.",
              "Improves cognitive flexibility through rapid task switching (Professional mode).",
              "Trains response inhibition — overrides the natural impulse to read words.",
              "Sharpens visual processing speeds under time-restricted pressure.",
              "Provides persistent score tracking to monitor cognitive resilience.",
            ]}
            howToPlay={[
              "Choose a difficulty — Beginner (3 colors) to Professional (7 colors, dual-mode switch).",
              "A color word will flash on screen in a colored ink.",
              "On Professional mode, look at the banner: either match INK COLOR or match TEXT value.",
              "On other modes, click the button matching the INK COLOR.",
              "Wrong choices cost a life; timer count down warns you of the limit.",
              "Score as many points as possible before time runs out!",
            ]}
          />
        </div>
      </div>
    </div>
  );
}
