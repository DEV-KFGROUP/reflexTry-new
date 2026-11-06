"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Play, RotateCcw, Shield, Star, Zap, Flame,
  Volume2, VolumeX, ArrowRight, Brain, AlertTriangle
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
type ColorName = "Red" | "Blue" | "Green" | "Yellow" | "Purple" | "Orange";

interface ColorConfig {
  name: ColorName;
  hex: string;
  bg: string;
  depth: string;
  border: string;
  hotkey: string;
}

const COLORS: Record<ColorName, ColorConfig> = {
  Red: { name: "Red", hex: "#ef4444", bg: "bg-red-500", depth: "bg-red-700", border: "border-red-400", hotkey: "r" },
  Blue: { name: "Blue", hex: "#3b82f6", bg: "bg-blue-500", depth: "bg-blue-700", border: "border-blue-400", hotkey: "b" },
  Green: { name: "Green", hex: "#10b981", bg: "bg-emerald-500", depth: "bg-emerald-700", border: "border-emerald-400", hotkey: "g" },
  Yellow: { name: "Yellow", hex: "#eab308", bg: "bg-amber-400", depth: "bg-amber-600", border: "border-amber-350", hotkey: "y" },
  Purple: { name: "Purple", hex: "#a855f7", bg: "bg-purple-500", depth: "bg-purple-700", border: "border-purple-400", hotkey: "p" },
  Orange: { name: "Orange", hex: "#f97316", bg: "bg-orange-500", depth: "bg-orange-700", border: "border-orange-400", hotkey: "o" },
};

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  activeColors: ColorName[];
  congruentChance: number; // probability that text matches color
  baseSpeed: number;
  initialLives: number;
  hasRotations: boolean; // Words fall with random rotation angles
  hasBlurs: boolean; // Words periodically blur to confuse readability
  maxTargets?: number; // Beginner/Easy play to a fixed target count
  icon: React.ElementType;
  textColor: string;
  borderColor: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2 colors (Red/Blue) · 80% congruent · 15 word trial · Unlimited lives",
    activeColors: ["Red", "Blue"], congruentChance: 0.8, baseSpeed: 50, initialLives: 999, hasRotations: false, hasBlurs: false, maxTargets: 15,
    icon: Shield, textColor: "text-emerald-600", borderColor: "border-emerald-400",
  },
  easy: {
    id: "easy", label: "Easy", description: "3 colors (Red/Blue/Green) · 60% congruent · 20 word trial · Unlimited lives",
    activeColors: ["Red", "Blue", "Green"], congruentChance: 0.6, baseSpeed: 70, initialLives: 999, hasRotations: false, hasBlurs: false, maxTargets: 20,
    icon: Star, textColor: "text-sky-600", borderColor: "border-sky-400",
  },
  normal: {
    id: "normal", label: "Normal", description: "4 colors (Red/Blue/Green/Yellow) · 40% congruent · 3 lives limit",
    activeColors: ["Red", "Blue", "Green", "Yellow"], congruentChance: 0.4, baseSpeed: 95, initialLives: 3, hasRotations: false, hasBlurs: false,
    icon: Zap, textColor: "text-violet-600", borderColor: "border-violet-500",
  },
  hard: {
    id: "hard", label: "Hard", description: "5 colors (adds Purple [P]) · 20% congruent · Word rotations · Sudden Death (1 life)",
    activeColors: ["Red", "Blue", "Green", "Yellow", "Purple"], congruentChance: 0.2, baseSpeed: 130, initialLives: 1, hasRotations: true, hasBlurs: false,
    icon: Flame, textColor: "text-orange-600", borderColor: "border-orange-400",
  },
  professional: {
    id: "professional", label: "Professional", description: "6 colors (adds Orange [O]) · 10% congruent · Rotations + Blurs · Sudden Death (1 life)",
    activeColors: ["Red", "Blue", "Green", "Yellow", "Purple", "Orange"], congruentChance: 0.1, baseSpeed: 175, initialLives: 1, hasRotations: true, hasBlurs: true,
    icon: Brain, textColor: "text-rose-600", borderColor: "border-rose-500",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

interface FallingWord {
  id: number;
  text: ColorName;
  colorName: ColorName;
  hex: string;
  y: number;
  speed: number;
  rotation: number;
  isBlurred: boolean;
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
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore} cleared</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function StroopDropClient() {
    const { play } = useGameSound();

  const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(1);
  const [wrongClicks, setWrongClicks] = useState(0); // hit counter for beginner/easy
  const [muted, setMuted] = useState(false);

  // Falling words
  const [renderWords, setRenderWords] = useState<FallingWord[]>([]);
  const wordsRef = useRef<FallingWord[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const difficultyMultiplierRef = useRef(1.0);
  const wordIdRef = useRef(0);
  const lastTimeRef = useRef(0);
  const nextSpawnTimeRef = useRef(0);
  const requestRef = useRef<number>(0);

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
      const v = localStorage.getItem(`stroop-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  const spawnWord = useCallback((currentTime: number) => {
    const d = DIFFICULTIES[diffId];
    
    // Choose text color from active list
    const textName = d.activeColors[Math.floor(Math.random() * d.activeColors.length)];
    
    // Determine font color based on congruent chance
    let colorName: ColorName;
    if (Math.random() < d.congruentChance) {
      colorName = textName;
    } else {
      const otherColors = d.activeColors.filter(c => c !== textName);
      colorName = otherColors.length > 0 
        ? otherColors[Math.floor(Math.random() * otherColors.length)] 
        : textName;
    }

    const baseSpeed = d.baseSpeed * (0.85 + Math.random() * 0.3);
    const speed = baseSpeed * difficultyMultiplierRef.current;

    const rotation = d.hasRotations 
      ? (Math.random() - 0.5) * 55  // Rotate up to 25 degrees
      : 0;

    const isBlurred = d.hasBlurs && Math.random() < 0.25;

    wordsRef.current.push({
      id: wordIdRef.current++,
      text: textName,
      colorName,
      hex: COLORS[colorName].hex,
      y: -50,
      speed,
      rotation,
      isBlurred
    });
  }, [diffId]);

  const stopGame = useCallback(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    playSound("error");
    setPhase("result");

    // Save high score
    setHighScores(hs => {
      if (score > hs[diffId]) {
        localStorage.setItem(`stroop-hs-${diffId}`, score.toString());
        return { ...hs, [diffId]: score };
      }
      return hs;
    });
  }, [diffId, score, playSound]);

  const handleColorClick = useCallback((clickedColor: ColorName) => {
    if (phase !== "playing") return;
    if (wordsRef.current.length === 0) return;

    // Target lowest falling word
    const targetWord = wordsRef.current[0];

    if (targetWord.colorName === clickedColor) {
      playSound("click");
      setScore(s => {
        const nextS = s + 1;
        // Beginner/Easy max check
        if (diff.maxTargets && nextS >= diff.maxTargets) {
          stopGame();
        }
        return nextS;
      });
      wordsRef.current.shift();
      setRenderWords([...wordsRef.current]);

      // Speed up slightly on hits
      difficultyMultiplierRef.current += 0.04;
    } else {
      playSound("error");
      if (diff.initialLives === 999) {
        // Beginner hit penalty counter
        setWrongClicks(wc => wc + 1);
        wordsRef.current.shift();
        setRenderWords([...wordsRef.current]);
      } else {
        setLives(l => {
          const nextL = l - 1;
          if (nextL <= 0) {
            stopGame();
          }
          return nextL;
        });
        wordsRef.current.shift();
        setRenderWords([...wordsRef.current]);
      }
    }
  }, [phase, diff, playSound, stopGame]);

  const updateLoop = useCallback((time: number) => {
    if (phase !== "playing") return;

    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTimeMillis = time - lastTimeRef.current;
    const deltaTime = deltaTimeMillis / 1000;
    lastTimeRef.current = time;

    const container = containerRef.current;
    if (!container) {
      requestRef.current = requestAnimationFrame(updateLoop);
      return;
    }

    const { height } = container.getBoundingClientRect();

    // Check if lowest word crossed bottom threshold
    if (wordsRef.current.length > 0) {
      const lowestWord = wordsRef.current[0];
      if (lowestWord.y > height - 100) {
        // Boundary miss penalty
        playSound("error");
        if (diff.initialLives === 999) {
          setWrongClicks(wc => wc + 1);
          wordsRef.current.shift();
        } else {
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              stopGame();
            }
            return nextL;
          });
          wordsRef.current.shift();
        }
      }
    }

    // Spawn logic
    const lastWord = wordsRef.current[wordsRef.current.length - 1];
    if (!lastWord || lastWord.y > 150) {
      if (time > nextSpawnTimeRef.current) {
        spawnWord(time);
        const spawnInterval = Math.max(380, 1800 / difficultyMultiplierRef.current);
        nextSpawnTimeRef.current = time + spawnInterval;
      }
    }

    // Move falling words
    wordsRef.current.forEach(w => {
      w.y += w.speed * deltaTime;
    });

    setRenderWords([...wordsRef.current]);

    requestRef.current = requestAnimationFrame(updateLoop);
  }, [phase, diff, spawnWord, playSound, stopGame]);

  // Keyboard Hotkeys binding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase !== "playing") return;
      const key = e.key.toLowerCase();

      // Find matching color from active list
      const matched = diff.activeColors.find(c => COLORS[c].hotkey === key);
      if (matched) {
        handleColorClick(matched);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [phase, diff, handleColorClick]);

  const startGame = useCallback(() => {
    wordsRef.current = [];
    setRenderWords([]);
    setLives(diff.initialLives);
    setWrongClicks(0);
    setScore(0);
    difficultyMultiplierRef.current = 1.0;
    nextSpawnTimeRef.current = 0;
    lastTimeRef.current = 0;

    setPhase("playing");
    playSound("start");

    setTimeout(() => {
      requestRef.current = requestAnimationFrame(updateLoop);
    }, 50);
  }, [diff, playSound, updateLoop]);

  useEffect(() => {
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
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
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">STROOP DROP</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">INHIBITORY REFLEX CALIBRATION</p>
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
                    onSelect={() => { if (phase === "idle" || phase === "result") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Cleared</div>
                  <div className="text-xl font-mono font-bold text-slate-800 mt-0.5">
                    {diff.maxTargets ? `${score}/${diff.maxTargets}` : score}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Active Keys</div>
                  <div className="text-xs font-mono font-bold text-slate-800 mt-1.5 flex gap-0.5 flex-wrap">
                    {diff.activeColors.map(c => (
                      <span key={c} className="bg-slate-200 px-1 py-0.5 rounded text-[11px] font-medium">{COLORS[c].hotkey.toUpperCase()}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Remaining Lives</div>
                  <div className="text-sm font-mono font-bold text-red-500 mt-1.5">
                    {diff.initialLives === 999 ? "∞" : `${lives} ❤️`}
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {diff.initialLives === 999 ? "Hits Mismatched" : "Speed Scale"}
                  </div>
                  <div className="text-sm font-mono font-bold text-slate-800 mt-1.5">
                    {diff.initialLives === 999 ? `${wrongClicks} errors` : `${difficultyMultiplierRef.current.toFixed(2)}x`}
                  </div>
                </div>
              </div>

              {/* Best record displayed */}
              {highScores[diffId] > 0 && (
                <div className="mt-3 bg-slate-50 border border-slate-100 rounded-xl p-3 flex items-center gap-2">
                  <Trophy className={`w-4 h-4 ${diff.textColor}`} />
                  <div>
                    <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best Cleared ({diff.label})</div>
                    <div className={`text-sm font-mono font-bold ${diff.textColor}`}>{highScores[diffId]} words</div>
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
                ACTIVE KEYS: {diff.activeColors.map(c => COLORS[c].hotkey.toUpperCase()).join(" / ")}
              </div>

              <div className="p-6 md:p-8 min-h-[500px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* ── 1. SELECT SCREEN ── */}
                  {phase === "idle" && (
                    <motion.div key="select" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex flex-col items-center justify-center space-y-8 text-center w-full max-w-md">
                      <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                        <div className="absolute inset-0 border border-dashed border-violet-400/20 rounded-full animate-[spin_20s_linear_infinite]" />
                        <div className="absolute inset-2 border border-dashed border-violet-400/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        <div className="absolute inset-4 border border-violet-400/10 rounded-full animate-pulse bg-violet-400/[0.04] flex items-center justify-center">
                          <Brain className="w-10 h-10 text-violet-600" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Stroop Drop</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Identify the FONT COLOR of the falling words, ignoring the literal text. Click keypads or tap hotkeys on your keyboard.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm" style={{ background: DIFF_GRADIENT[diffId] }} />
                        <div className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg" style={{ background: DIFF_GRADIENT[diffId] }}>
                          <Play className="w-4 h-4 fill-current" />
                          Commence Interference Test
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
                      className="absolute inset-0 w-full h-full flex flex-col items-center justify-between bg-slate-900 border border-slate-800 shadow-inner rounded-[2.5rem] overflow-hidden"
                    >
                      {/* Bounding falling canvas area */}
                      <div ref={containerRef} className="flex-1 w-full relative overflow-hidden">
                        {/* Target line threshold indicator */}
                        <div className="absolute bottom-[80px] inset-x-0 h-[1px] border-t border-dashed border-red-500/25 pointer-events-none" />
                        <div className="absolute bottom-[84px] right-6 text-[10px] font-mono text-red-500/30 pointer-events-none">
                          DROP BOUNDARY LIMIT
                        </div>

                        {renderWords.map(w => (
                          <div
                            key={w.id}
                            className="absolute w-full text-center transition-none font-black tracking-widest text-3xl sm:text-4xl uppercase select-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]"
                            style={{
                              top: w.y,
                              color: w.hex,
                              transform: `rotate(${w.rotation}deg)`,
                              filter: w.isBlurred ? "blur(3.5px)" : "none",
                            }}
                          >
                            {w.text}
                          </div>
                        ))}
                      </div>

                      {/* 3D keypad panel */}
                      <div className="h-20 w-full bg-slate-950/80 border-t border-slate-800 flex items-center justify-between px-6 gap-3 z-10 p-2.5">
                        {diff.activeColors.map(c => {
                          const colData = COLORS[c];
                          return (
                            <div key={c} className="relative flex-1 h-full">
                              <div className={`absolute inset-0 rounded-xl ${colData.depth} translate-y-1 border-b-2 border-black/20`} />
                              <button
                                onClick={() => handleColorClick(c)}
                                className={`absolute inset-0 rounded-xl border-2 ${colData.bg} ${colData.border} text-white font-mono font-black text-[10px] md:text-xs shadow-md flex flex-col items-center justify-center transition-all select-none cursor-pointer hover:brightness-105 active:translate-y-1`}
                              >
                                <span>{c.toUpperCase()}</span>
                                <span className="opacity-40 text-[11px] font-bold mt-0.5">[{colData.hotkey.toUpperCase()}]</span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* ── 3. SUMMARY SCREEN ── */}
                  {phase === "result" && (
                    <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm mx-auto">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-1">
                        <div className="text-2xl font-mono font-black text-red-650 tracking-wider">CALIBRATION_DISRUPTED</div>
                        <p className="text-xs font-mono text-slate-500">Incongruence conflict limit exceeded. Focus disrupted.</p>
                        {score >= highScores[diffId] && score > 0 && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} cleared!
                          </motion.div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-sm w-full grid grid-cols-2 gap-3 text-left">
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">Cleared Words</div>
                          <div className="text-2xl text-fuchsia-600 font-mono font-black">
                            {diff.maxTargets ? `${score}/${diff.maxTargets}` : `${score} words`}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase mb-1">
                            {diff.initialLives === 999 ? "Total Mistakes" : "Peak Speed Mult"}
                          </div>
                          <div className="text-xl text-slate-700 font-mono font-bold">
                            {diff.initialLives === 999 ? `${wrongClicks} errors` : `${difficultyMultiplierRef.current.toFixed(2)}x`}
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
                  onClick={stopGame}
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
