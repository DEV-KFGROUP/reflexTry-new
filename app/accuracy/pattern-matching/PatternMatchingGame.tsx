"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, Eye, AlertTriangle
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
  symbols: string[];
  patternLength: number;
  exposureMs: number;
  optionsCount: number;
  maxMistakes: number;
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "4-length (●/○) · 2.2s visual exposure · 4 options · Unlimited lives",
    symbols: ["●", "○"], patternLength: 4, exposureMs: 2200, optionsCount: 4, maxMistakes: 999,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "5-length (●/○) · 1.8s exposure · 4 options · Unlimited lives",
    symbols: ["●", "○"], patternLength: 5, exposureMs: 1800, optionsCount: 4, maxMistakes: 999,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "6-length (●/○/▲) · 1.4s exposure · 4 options · 3 lives limit",
    symbols: ["●", "○", "▲"], patternLength: 6, exposureMs: 1400, optionsCount: 4, maxMistakes: 3,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "7-length (●/○/▲/■) · 1.0s exposure · 6 options grid · 3 lives limit",
    symbols: ["●", "○", "▲", "■"], patternLength: 7, exposureMs: 1000, optionsCount: 6, maxMistakes: 3,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "8-length (adds ◆) · 0.6s flash exposure · 8 options · 2 lives limit",
    symbols: ["●", "○", "▲", "■", "◆"], patternLength: 8, exposureMs: 600, optionsCount: 8, maxMistakes: 2,
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
            <p className={`text-[9px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore}/10 Match</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function PatternMatchingGame() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "showing" | "selecting" | "result" | "failed">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [muted, setMuted] = useState(false);

  const [targetPattern, setTargetPattern] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      const v = localStorage.getItem(`pattern-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const generateRandomPattern = useCallback((len: number, symList: string[]) => {
    let str = "";
    for (let i = 0; i < len; i++) {
      str += symList[Math.floor(Math.random() * symList.length)];
    }
    return str;
  }, []);

  const generateRound = useCallback(() => {
    const d = DIFFICULTIES[diffId];

    // Generate unique target pattern
    const target = generateRandomPattern(d.patternLength, d.symbols);
    
    // Generate highly similar distractor wrong options by swapping symbols in target
    const wrongOptionsSet = new Set<string>();
    while (wrongOptionsSet.size < d.optionsCount - 1) {
      const chars = target.split("");
      // Swap 1 or 2 characters randomly
      const swapCount = Math.random() < 0.5 ? 1 : 2;
      for (let s = 0; s < swapCount; s++) {
        const idx = Math.floor(Math.random() * chars.length);
        const nextChar = d.symbols[Math.floor(Math.random() * d.symbols.length)];
        chars[idx] = nextChar;
      }
      const candidate = chars.join("");
      if (candidate !== target) {
        wrongOptionsSet.add(candidate);
      }
    }

    const wrongOptions = Array.from(wrongOptionsSet);
    const allOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);

    setTargetPattern(target);
    setOptions(allOptions);
    setSelectedIndex(null);
    setPhase("showing");

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setPhase("selecting");
    }, d.exposureMs);

  }, [diffId, generateRandomPattern]);

  const startGame = useCallback(() => {
    setScore(0);
    setRound(0);
    setMistakes(0);
    playSound("start");
    
    // Defer loading visual display slightly to ensure proper render resets
    setTimeout(() => generateRound(), 50);
  }, [playSound, generateRound]);

  const handleSelect = useCallback((index: number) => {
    if (phase !== "selecting") return;
    setSelectedIndex(index);

    const isCorrect = options[index] === targetPattern;

    if (isCorrect) {
      playSound("success");
      setScore(s => s + 1);
    } else {
      playSound("error");
      setMistakes(m => {
        const nextM = m + 1;
        if (nextM >= diff.maxMistakes) {
          setTimeout(() => {
            setPhase("failed");
            playSound("levelUp");
          }, 1200);
        }
        return nextM;
      });
    }

    setRound(r => r + 1);

    setTimeout(() => {
      const nextRound = round + 1;
      if (nextRound < 10 && mistakes < diff.maxMistakes) {
        generateRound();
      } else if (mistakes < diff.maxMistakes) {
        setPhase("result");
        playSound("levelUp");
        
        // Save high score
        setHighScores(hs => {
          const finalScore = score + (isCorrect ? 1 : 0);
          if (finalScore > hs[diffId]) {
            localStorage.setItem(`pattern-hs-${diffId}`, finalScore.toString());
            return { ...hs, [diffId]: finalScore };
          }
          return hs;
        });
      }
    }, 1100);

  }, [phase, options, targetPattern, round, diff, mistakes, score, playSound, generateRound]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const totalPossible = round;
  const accuracy = totalPossible > 0 ? Math.round((score / totalPossible) * 100) : 100;

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      {/* Background Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">PATTERN MATCHING</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-[0.25em]">SPATIAL PRECISION CALIBRATION</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result" || phase === "failed") setDiffId(key); }}
                    highScore={highScores[key]}
                    disabled={phase === "showing" || phase === "selecting"}
                  />
                ))}
              </div>
            </div>

            {/* Stats Panel */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Session Stats</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Matched Rounds</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{score}/10</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Accuracy</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{accuracy}%</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5 animate-pulse">
                    {diff.maxMistakes === 999 ? "∞" : `${diff.maxMistakes - mistakes} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest font-bold">Exposure Speed</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">{diff.exposureMs}ms</div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Best Score ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]}/10 match</div>
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
                SYMBOLS COUNT: {diff.symbols.length}
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
                          <Eye className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Pattern Matching</h2>
                        <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                          A spatial symbol pattern will appear briefly. Memorize and select the matching configuration among similar distractors.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Initialize Optical Deck
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* ── 2. DISPLAY PATTERN SCREEN ── */}
                  {phase === "showing" && (
                    <motion.div
                      key="showing"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="text-center space-y-8 max-w-md w-full"
                    >
                      <div className="space-y-1 text-center">
                        <div className="text-[10px] font-mono text-cyan-600 uppercase tracking-[0.25em] font-bold">Calibration Code Projection</div>
                        <h2 className="text-[9px] text-slate-400 font-mono tracking-widest uppercase">MEMORIZE CONFIG</h2>
                      </div>

                      {/* Prompt well */}
                      <div className="p-8 bg-slate-50 border border-slate-200 shadow-inner rounded-[2rem] text-4xl md:text-5xl font-mono text-slate-850 tracking-widest flex items-center justify-center select-none font-bold">
                        {targetPattern}
                      </div>

                      {/* Countdown bar */}
                      <div className="w-48 h-2 mx-auto bg-slate-100 border border-slate-200 rounded-full overflow-hidden relative shadow-inner">
                        <motion.div
                          className="absolute inset-y-0 left-0 bg-cyan-500"
                          initial={{ width: "100%" }}
                          animate={{ width: "0%" }}
                          transition={{ duration: diff.exposureMs / 1000, ease: "linear" }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SELECTING MATCH SCREEN ── */}
                  {phase === "selecting" && (
                    <motion.div
                      key="selecting"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-6 w-full max-w-2xl"
                    >
                      <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">Select matching configuration:</p>

                      <div className={`grid gap-4 ${
                        diff.optionsCount === 8 ? "grid-cols-2 sm:grid-cols-4" : diff.optionsCount === 6 ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-2"
                      }`}>
                        {options.map((option, index) => {
                          const isSelected = selectedIndex === index;
                          const isCorrect = option === targetPattern;
                          const showResult = selectedIndex !== null;

                          let btnStyles = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50";
                          let depthStyles = "bg-slate-350";

                          if (showResult) {
                            if (isCorrect) {
                              btnStyles = "bg-emerald-500 border-emerald-400 text-white";
                              depthStyles = "bg-emerald-700";
                            } else if (isSelected) {
                              btnStyles = "bg-red-500 border-red-400 text-white";
                              depthStyles = "bg-red-700";
                            } else {
                              btnStyles = "bg-slate-100 border-slate-200 text-slate-400 opacity-60";
                              depthStyles = "bg-slate-200";
                            }
                          }

                          return (
                            <div key={index} className="relative h-24">
                              <div className={`absolute inset-0 rounded-2xl ${depthStyles} translate-y-1.5 border-b-2 border-black/25`} />
                              <button
                                disabled={selectedIndex !== null}
                                onClick={() => handleSelect(index)}
                                className={`absolute inset-0 rounded-2xl border-2 font-mono font-black text-lg md:text-xl flex flex-col items-center justify-center transition-all duration-100 select-none cursor-pointer ${btnStyles} active:translate-y-1.5`}
                              >
                                <span className="tracking-wide">{option}</span>
                                {showResult && isCorrect && (
                                  <span className="text-[8px] font-mono text-white/90 uppercase tracking-widest mt-1">✓ Correct</span>
                                )}
                                {showResult && isSelected && !isCorrect && (
                                  <span className="text-[8px] font-mono text-white/90 uppercase tracking-widest mt-1">✗ Fail</span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 4. SUCCESS SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-emerald-50 border border-emerald-100 rounded-2xl animate-pulse">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-emerald-600 tracking-wider">CALIBRATION_SUCCESS</div>
                        <p className="text-xs font-mono text-slate-500">{diff.label} pattern mapping statistics logged.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score}/10 cleared!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Cleared Matches</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">{score}/10</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Accuracy Rating</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{accuracy}% Acc</div>
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

                  {/* ── 5. FAILED SCREEN ── */}
                  {phase === "failed" && (
                    <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-550" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIBRATION_DISRUPTED</div>
                        <p className="text-xs font-mono text-slate-500">Mistake threshold crossed. Memory matching failed.</p>
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Final Score</div>
                          <div className="text-2xl text-slate-805 font-mono font-bold">{score}/10</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Accuracy Rating</div>
                          <div className="text-xl text-slate-700 font-mono font-bold">{accuracy}% Acc</div>
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
            {phase === "showing" || phase === "selecting" ? (
              <div className="flex justify-end">
                <button
                  onClick={() => setPhase("idle")}
                  className="text-[10px] font-mono text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Abort Session ×
                </button>
              </div>
            ) : null}
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}
