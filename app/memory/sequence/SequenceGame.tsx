"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  RotateCcw,
  Brain,
  Cpu,
  Workflow,
  Gauge,
  Atom,
  Volume2,
  VolumeX,
  AlertTriangle,
  Trophy,
  Zap,
  Heart,
  Star,
  Flame,
  Clock,
  Grid,
  Layers,
  Shield,
} from "lucide-react";
import { useGameSound } from "@/hooks/useGameSound";

/* ─────────────────────────────────────────────
   INLINE GRADIENT STYLES
   (Tailwind purges dynamically-assembled classes,
    so we use concrete CSS strings instead)
───────────────────────────────────────────── */
const DIFF_GRADIENT: Record<string, string> = {
  beginner:     "linear-gradient(135deg, #34d399, #14b8a6)",
  easy:         "linear-gradient(135deg, #38bdf8, #3b82f6)",
  normal:       "linear-gradient(135deg, #8b5cf6, #9333ea)",
  hard:         "linear-gradient(135deg, #fb923c, #ef4444)",
  professional: "linear-gradient(135deg, #f43f5e, #ec4899)",
};

/* ─────────────────────────────────────────────
   DIFFICULTY CONFIGURATION
───────────────────────────────────────────── */
const DIFFICULTIES = {
  beginner: {
    id: "beginner",
    label: "Beginner",
    subtitle: "Learn the basics",
    color: "from-emerald-400 to-teal-500",
    borderColor: "border-emerald-400",
    textColor: "text-emerald-600",
    bgColor: "bg-emerald-50",
    gridSize: 4,
    flashDuration: 700,
    flashInterval: 950,
    lives: 3,
    hasTimer: false,
    timerSeconds: 0,
    startLength: 1,
    icon: "Shield",
    description: "4 buttons · Slow flash · 3 lives",
  },
  easy: {
    id: "easy",
    label: "Easy",
    subtitle: "Build confidence",
    color: "from-sky-400 to-blue-500",
    borderColor: "border-sky-400",
    textColor: "text-sky-600",
    bgColor: "bg-sky-50",
    gridSize: 4,
    flashDuration: 550,
    flashInterval: 750,
    lives: 2,
    hasTimer: false,
    timerSeconds: 0,
    startLength: 1,
    icon: "Star",
    description: "4 buttons · Medium flash · 2 lives",
  },
  normal: {
    id: "normal",
    label: "Normal",
    subtitle: "Standard challenge",
    color: "from-violet-500 to-purple-600",
    borderColor: "border-violet-500",
    textColor: "text-violet-600",
    bgColor: "bg-violet-50",
    gridSize: 4,
    flashDuration: 400,
    flashInterval: 580,
    lives: 1,
    hasTimer: false,
    timerSeconds: 0,
    startLength: 1,
    icon: "Zap",
    description: "4 buttons · Fast flash · 1 life",
  },
  hard: {
    id: "hard",
    label: "Hard",
    subtitle: "Test your limits",
    color: "from-orange-400 to-red-500",
    borderColor: "border-orange-400",
    textColor: "text-orange-600",
    bgColor: "bg-orange-50",
    gridSize: 9,
    flashDuration: 350,
    flashInterval: 500,
    lives: 1,
    hasTimer: true,
    timerSeconds: 8,
    startLength: 2,
    icon: "Flame",
    description: "9 buttons · Timed input · 1 life",
  },
  professional: {
    id: "professional",
    label: "Professional",
    subtitle: "Elite cognition",
    color: "from-rose-500 to-pink-600",
    borderColor: "border-rose-500",
    textColor: "text-rose-600",
    bgColor: "bg-rose-50",
    gridSize: 16,
    flashDuration: 280,
    flashInterval: 400,
    lives: 1,
    hasTimer: true,
    timerSeconds: 6,
    startLength: 3,
    icon: "Brain",
    description: "16 buttons · Ultra-fast · Timed",
  },
};

const SECTOR_COLORS = [
  { cap: "bg-cyan-50 border-cyan-300 text-cyan-700", active: "bg-cyan-500 text-white border-cyan-400 shadow-[0_0_28px_rgba(6,182,212,0.55)]", base: "bg-cyan-700", Icon: Cpu },
  { cap: "bg-emerald-50 border-emerald-300 text-emerald-700", active: "bg-emerald-500 text-white border-emerald-400 shadow-[0_0_28px_rgba(16,185,129,0.55)]", base: "bg-emerald-700", Icon: Workflow },
  { cap: "bg-amber-50 border-amber-300 text-amber-700", active: "bg-amber-500 text-white border-amber-400 shadow-[0_0_28px_rgba(245,158,11,0.55)]", base: "bg-amber-700", Icon: Gauge },
  { cap: "bg-fuchsia-50 border-fuchsia-300 text-fuchsia-700", active: "bg-fuchsia-500 text-white border-fuchsia-400 shadow-[0_0_28px_rgba(217,70,239,0.55)]", base: "bg-fuchsia-700", Icon: Atom },
  { cap: "bg-blue-50 border-blue-300 text-blue-700", active: "bg-blue-500 text-white border-blue-400 shadow-[0_0_28px_rgba(59,130,246,0.55)]", base: "bg-blue-700", Icon: Layers },
  { cap: "bg-rose-50 border-rose-300 text-rose-700", active: "bg-rose-500 text-white border-rose-400 shadow-[0_0_28px_rgba(244,63,94,0.55)]", base: "bg-rose-700", Icon: Flame },
  { cap: "bg-lime-50 border-lime-300 text-lime-700", active: "bg-lime-500 text-white border-lime-400 shadow-[0_0_28px_rgba(132,204,22,0.55)]", base: "bg-lime-700", Icon: Grid },
  { cap: "bg-orange-50 border-orange-300 text-orange-700", active: "bg-orange-500 text-white border-orange-400 shadow-[0_0_28px_rgba(249,115,22,0.55)]", base: "bg-orange-700", Icon: Clock },
  { cap: "bg-teal-50 border-teal-300 text-teal-700", active: "bg-teal-500 text-white border-teal-400 shadow-[0_0_28px_rgba(20,184,166,0.55)]", base: "bg-teal-700", Icon: Shield },
  { cap: "bg-purple-50 border-purple-300 text-purple-700", active: "bg-purple-500 text-white border-purple-400 shadow-[0_0_28px_rgba(168,85,247,0.55)]", base: "bg-purple-700", Icon: Star },
  { cap: "bg-pink-50 border-pink-300 text-pink-700", active: "bg-pink-500 text-white border-pink-400 shadow-[0_0_28px_rgba(236,72,153,0.55)]", base: "bg-pink-700", Icon: Zap },
  { cap: "bg-sky-50 border-sky-300 text-sky-700", active: "bg-sky-500 text-white border-sky-400 shadow-[0_0_28px_rgba(14,165,233,0.55)]", base: "bg-sky-700", Icon: Brain },
  { cap: "bg-indigo-50 border-indigo-300 text-indigo-700", active: "bg-indigo-500 text-white border-indigo-400 shadow-[0_0_28px_rgba(99,102,241,0.55)]", base: "bg-indigo-700", Icon: Trophy },
  { cap: "bg-red-50 border-red-300 text-red-700", active: "bg-red-500 text-white border-red-400 shadow-[0_0_28px_rgba(239,68,68,0.55)]", base: "bg-red-700", Icon: AlertTriangle },
  { cap: "bg-yellow-50 border-yellow-300 text-yellow-700", active: "bg-yellow-400 text-white border-yellow-300 shadow-[0_0_28px_rgba(250,204,21,0.55)]", base: "bg-yellow-600", Icon: Trophy },
  { cap: "bg-green-50 border-green-300 text-green-700", active: "bg-green-500 text-white border-green-400 shadow-[0_0_28px_rgba(34,197,94,0.55)]", base: "bg-green-700", Icon: RotateCcw },
];

type DifficultyId = keyof typeof DIFFICULTIES;

const DIFF_ICONS: Record<string, React.ElementType> = {
  Shield, Star, Zap, Flame, Brain,
};

function DifficultyCard({
  diffKey,
  selected,
  onSelect,
  highScore,
  disabled,
}: {
  diffKey: DifficultyId;
  selected: boolean;
  onSelect: () => void;
  highScore: number;
  disabled: boolean;
}) {
  const d = DIFFICULTIES[diffKey];
  const Icon = DIFF_ICONS[d.icon] || Brain;
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
            <p className={`text-[11px] font-mono font-bold mt-1 ${d.textColor}`}>Best: {highScore}</p>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export default function SequenceGame() {
  
  const [phase, setPhase] = useState<"select" | "playing" | "gameover">("select");
  const [diffId, setDiffId] = useState<DifficultyId>("normal");
  const [sequence, setSequence] = useState<number[]>([]);
  const [userSequence, setUserSequence] = useState<number[]>([]);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [score, setScore] = useState(0);
  const [livesLeft, setLivesLeft] = useState(1);
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [muted, setMuted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [timerLeft, setTimerLeft] = useState(0);
  const [showComboFlash, setShowComboFlash] = useState(false);
  const [logs, setLogs] = useState<string[]>(["CALIB_SYS: READY. SELECT DIFFICULTY LEVEL."]);
  const [highScores, setHighScores] = useState<Record<DifficultyId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const gameOverRef = useRef(false);
  const { play } = useGameSound();
  const diff = DIFFICULTIES[diffId];
  const cols = Math.round(Math.sqrt(diff.gridSize));

  const playSound = useCallback((type: Parameters<typeof play>[0]) => {
    if (!muted) play(type);
  }, [muted, play]);

  const addLog = useCallback((text: string) => {
    const time = new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
    setLogs(prev => [`[${time}] ${text}`, ...prev].slice(0, 12));
  }, []);

  useEffect(() => {
    const saved: Record<DifficultyId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    (Object.keys(DIFFICULTIES) as DifficultyId[]).forEach(k => {
      const v = localStorage.getItem(`sequence-hs-${k}`);
      if (v) saved[k] = parseInt(v);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerLeft(0);
  }, []);

  const triggerGameOver = useCallback(() => {
    if (gameOverRef.current) return;
    gameOverRef.current = true;
    stopTimer();
    setPhase("gameover");
    playSound("error");
    addLog("!! TIME EXPIRED — REACTION TOO SLOW !!");
  }, [stopTimer, playSound, addLog]);

  const startInputTimer = useCallback((d: typeof diff) => {
    if (!d.hasTimer) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setTimerLeft(d.timerSeconds);
    timerRef.current = setInterval(() => {
      setTimerLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          triggerGameOver();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }, [diff, triggerGameOver]);

  const activateButton = useCallback((index: number, flashMs: number) => {
    setActiveButton(index);
    playSound("tick");
    setTimeout(() => setActiveButton(null), flashMs);
  }, [playSound]);

  const playSequenceAnim = useCallback((seq: number[], d: typeof diff, onDone: () => void) => {
    setIsShowingSequence(true);
    stopTimer();
    addLog(`TRANSMITTING SEQUENCE · LENGTH: ${seq.length}`);
    let i = 0;
    const interval = setInterval(() => {
      if (i >= seq.length) {
        clearInterval(interval);
        setIsShowingSequence(false);
        addLog("TRANSMISSION COMPLETE — AWAIT YOUR ECHO");
        onDone();
        return;
      }
      activateButton(seq[i], d.flashDuration);
      i++;
    }, d.flashInterval);
  }, [activateButton, addLog, stopTimer]);

  const startGame = useCallback(() => {
    const d = DIFFICULTIES[diffId];
    gameOverRef.current = false;
    const initialSeq: number[] = Array.from({ length: d.startLength }, () =>
      Math.floor(Math.random() * d.gridSize)
    );
    setSequence(initialSeq);
    setUserSequence([]);
    setScore(0);
    setLivesLeft(d.lives);
    setCombo(0);
    setPhase("playing");
    addLog(`BOOT: ${d.label.toUpperCase()} MODE — ${d.gridSize} SECTORS`);
    playSound("start");
    setTimeout(() => playSequenceAnim(initialSeq, d, () => startInputTimer(d)), 600);
  }, [diffId, addLog, playSound, playSequenceAnim, startInputTimer]);

  const advanceSequence = useCallback((current: number[], d: typeof diff, currentCombo: number) => {
    stopTimer();
    const next = [...current, Math.floor(Math.random() * d.gridSize)];
    const newScore = next.length - d.startLength + 1;
    setSequence(next);
    setUserSequence([]);
    setScore(newScore);
    addLog(currentCombo >= 3
      ? `🔥 COMBO x${currentCombo}  —  STAGE ${newScore} LOADING …`
      : `STAGE ${newScore} — TRANSMITTING …`);
    setTimeout(() => playSequenceAnim(next, d, () => startInputTimer(d)), 800);
  }, [stopTimer, addLog, playSequenceAnim, startInputTimer]);

  const handleInput = useCallback((index: number) => {
    if (phase !== "playing" || isShowingSequence || gameOverRef.current) return;

    activateButton(index, diff.flashDuration * 0.6);
    playSound("click");
    stopTimer();

    const newUser = [...userSequence, index];
    setUserSequence(newUser);
    const pos = newUser.length - 1;

    if (newUser[pos] !== sequence[pos]) {
      const newLives = livesLeft - 1;
      if (newLives <= 0) {
        gameOverRef.current = true;
        playSound("error");
        setPhase("gameover");
        addLog(`!! PHASE DISRUPT — FAILED AT STAGE ${score} !!`);
        setHighScores(prev => {
          if (score > prev[diffId]) {
            const updated = { ...prev, [diffId]: score };
            localStorage.setItem(`sequence-hs-${diffId}`, score.toString());
            addLog(`[NEW RECORD] ${score} stages on ${diff.label}`);
            return updated;
          }
          return prev;
        });
      } else {
        setLivesLeft(newLives);
        setCombo(0);
        playSound("error");
        addLog(`!! MISMATCH — ${newLives} LIFE REMAINING. REPLAYING …`);
        setUserSequence([]);
        setTimeout(() => playSequenceAnim(sequence, diff, () => startInputTimer(diff)), 1000);
      }
      return;
    }

    if (newUser.length === sequence.length) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo >= 3) {
        setShowComboFlash(true);
        setTimeout(() => setShowComboFlash(false), 800);
      }
      playSound("success");
      addLog(newCombo >= 3 ? `🔥 COMBO x${newCombo}!` : "ECHO LOCKED — ADVANCING.");
      setTimeout(() => {
        playSound("levelUp");
        advanceSequence(sequence, diff, newCombo);
      }, 600);
    } else {
      startInputTimer(diff);
    }
  }, [phase, isShowingSequence, activateButton, diff, playSound, stopTimer, userSequence, sequence, livesLeft, score, diffId, combo, advanceSequence, playSequenceAnim, startInputTimer, addLog]);

  return (
    <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-[-5%] left-[5%] w-[600px] h-[600px] bg-violet-500/[0.03] blur-[140px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-5%] right-[5%] w-[500px] h-[500px] bg-cyan-500/[0.03] blur-[120px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center space-y-8 pt-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center w-full">
          <h1 className="text-3xl md:text-5xl font-mono font-black tracking-widest text-slate-800">MEMORY SEQUENCE</h1>
          <div className="flex items-center justify-center gap-3 mt-1">
            <span className="h-[1px] w-8 bg-slate-300" />
            <p className="text-xs font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-[0.2em]">COGNITIVE CALIBRATION SYSTEM</p>
            <span className="h-[1px] w-8 bg-slate-300" />
          </div>
        </motion.div>

        {/* Layout */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 items-start">
          {/* Left Panel */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex flex-col gap-4">
            {/* Difficulty Selector */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
              <div className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-widest mb-3">Difficulty Level</div>
              <div className="flex flex-col gap-2">
                {(Object.keys(DIFFICULTIES) as DifficultyId[]).map(key => (
                  <DifficultyCard
                    key={key}
                    diffKey={key}
                    selected={diffId === key}
                    onSelect={() => { if (phase !== "playing") setDiffId(key); }}
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Stage</div>
                  <div className="text-2xl font-mono font-bold text-slate-800 mt-0.5">{score < 10 ? `0${score}` : score}</div>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Best</div>
                  <div className={`text-2xl font-mono font-bold mt-0.5 ${diff.textColor}`}>{highScores[diffId]}</div>
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
                  <div className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Combo</div>
                  <div className={`text-xl font-mono font-bold mt-0.5 ${combo >= 3 ? "text-orange-500" : "text-slate-800"}`}>
                    {combo >= 3 ? `🔥x${combo}` : `x${combo}`}
                  </div>
                </div>
              </div>

              {diff.hasTimer && phase === "playing" && !isShowingSequence && timerLeft > 0 && (
                <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-mono font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">Time Left</span>
                    <span className={`text-sm font-mono font-bold ${timerLeft <= 3 ? "text-red-500" : "text-slate-700"}`}>{timerLeft}s</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: timerLeft <= 3 ? "#ef4444" : DIFF_GRADIENT[diffId] }}
                      animate={{ width: `${(timerLeft / diff.timerSeconds) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setMuted(m => !m)}
                className={`mt-3 w-full p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${muted ? "bg-red-50 border-red-200 text-red-600" : "bg-slate-50 border-slate-200 text-slate-500 hover:text-violet-600 hover:border-violet-200"}`}
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                <span className="text-xs font-mono font-medium uppercase tracking-widest">{muted ? "Unmute" : "Sound On"}</span>
              </button>
            </div>
          </motion.div>

          {/* Right Panel: Game Console */}
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
                GRID_{diff.gridSize}
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(148,163,184,0)_50%,rgba(148,163,184,0.15)_50%)] bg-[size:100%_4px]" />

              {/* Combo flash */}
              <AnimatePresence>
                {showComboFlash && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-orange-500/10 z-30 pointer-events-none rounded-3xl"
                  />
                )}
              </AnimatePresence>

              <div className="p-6 md:p-8 min-h-[480px] flex flex-col items-center justify-center relative z-10">
                <AnimatePresence mode="wait">

                  {/* SELECT SCREEN */}
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
                        <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-800 uppercase tracking-wider">Neural Lock Standby</h2>
                        <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
                          Select a difficulty on the left, then press Initialize to begin.
                        </p>
                        <p className={`text-xs font-mono font-semibold ${diff.textColor} mt-1`}>{diff.label}: {diff.description}</p>
                      </div>
                      <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                        <div
                          className="absolute inset-0 rounded-xl translate-y-1.5 opacity-70 blur-sm"
                          style={{ background: DIFF_GRADIENT[diffId] }}
                        />
                        <div
                          className="relative px-10 py-4 rounded-xl text-white font-mono font-bold tracking-widest text-sm flex items-center justify-center gap-2 group-active:translate-y-1.5 shadow-lg"
                          style={{ background: DIFF_GRADIENT[diffId] }}
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Initialize
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {/* PLAYING SCREEN */}
                  {phase === "playing" && (
                    <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full flex flex-col items-center gap-4">
                      <div className="w-full flex items-center justify-between">
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400 uppercase tracking-widest">
                          {isShowingSequence ? "Watch carefully…" : "Your turn!"}
                        </span>
                        <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{userSequence.length}/{sequence.length}</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ background: DIFF_GRADIENT[diffId] }}
                          animate={{ width: `${(userSequence.length / Math.max(sequence.length, 1)) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <div className="w-full grid gap-2 md:gap-3" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
                        {Array.from({ length: diff.gridSize }).map((_, i) => {
                          const s = SECTOR_COLORS[i % SECTOR_COLORS.length];
                          const BtnIcon = s.Icon;
                          const isActive = activeButton === i;
                          const isSmall = diff.gridSize > 4;
                          return (
                            <div key={i} className="relative aspect-square w-full">
                              <div className={`absolute inset-0 rounded-xl ${s.base} translate-y-1.5 border-b-4 border-black/30`} />
                              <motion.button
                                animate={{ y: isActive ? 6 : 0 }}
                                whileHover={isShowingSequence ? {} : { y: -2 }}
                                whileTap={isShowingSequence ? {} : { y: 6 }}
                                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                                className={`absolute inset-0 rounded-xl border-2 transition-all duration-75 flex flex-col justify-between cursor-pointer select-none disabled:cursor-not-allowed ${isActive ? s.active : s.cap} ${isSmall ? "p-1 sm:p-1.5" : "p-3 sm:p-4"}`}
                                onClick={() => handleInput(i)}
                                disabled={isShowingSequence || phase !== "playing"}
                              >
                                {!isSmall && (
                                  <div className="flex justify-between items-start w-full">
                                    <span className="text-[10px] font-mono tracking-wider opacity-60">{String(i + 1).padStart(2, "0")}</span>
                                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-white animate-ping" : "bg-current opacity-25"}`} />
                                  </div>
                                )}
                                <div className="flex items-center justify-center flex-grow">
                                  <BtnIcon className={`${isSmall ? "w-4 h-4 sm:w-5 sm:h-5" : "w-7 h-7 sm:w-9 sm:h-9"} ${isActive ? "text-white" : "text-current"}`} />
                                </div>
                                {!isSmall && (
                                  <div className="flex justify-between items-end w-full">
                                    <span className="text-[11px] font-mono font-bold tracking-wider opacity-80">S{String(i + 1).padStart(2, "0")}</span>
                                  </div>
                                )}
                                {isActive && <div className="absolute inset-0 bg-white/20 blur-md rounded-xl pointer-events-none" />}
                              </motion.button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* GAME OVER SCREEN */}
                  {phase === "gameover" && (
                    <motion.div key="gameover" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center space-y-6 w-full max-w-sm">
                      <div className="relative w-16 h-16 mx-auto flex items-center justify-center bg-red-50 border border-red-100 rounded-2xl animate-pulse">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                      </div>
                      <div className="space-y-2">
                        <div className="text-2xl font-mono font-black text-red-600 tracking-wider">PHASE DISRUPT</div>
                        <div className="text-xs font-mono text-slate-500">
                          {diff.label} mode · Failed at Stage <span className="text-red-500 font-bold">{score}</span>
                        </div>
                        {score > 0 && score >= highScores[diffId] && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 rounded-full px-3 py-1 text-[11px] font-mono font-bold">
                            <Trophy className="w-3.5 h-3.5" />
                            NEW RECORD — {score} stages!
                          </motion.div>
                        )}
                      </div>
                      <div className="bg-slate-50 border border-red-100 rounded-xl p-3 font-mono text-[11px] text-red-700 dark:text-red-400 text-left space-y-1 w-full">
                        <div>&gt; DIAG: SEQ_MISMATCH_REGISTERED</div>
                        <div>&gt; SECTOR RECEPTOR ECHO COMPROMISED</div>
                        <div>&gt; SYSTEM STATE: REBOOT_REQUIRED</div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                        <motion.button whileHover={{ translateY: -2 }} whileTap={{ translateY: 6 }} onClick={startGame} className="relative group cursor-pointer focus:outline-none select-none">
                          <div className="absolute inset-0 rounded-xl bg-red-700 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-red-500 text-white font-mono font-bold tracking-widest text-xs border border-red-400 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <RotateCcw className="w-4 h-4" />
                            Retry
                          </div>
                        </motion.button>
                        <motion.button
                          whileHover={{ translateY: -2 }}
                          whileTap={{ translateY: 6 }}
                          onClick={() => { setPhase("select"); setScore(0); setCombo(0); setLivesLeft(diff.lives); }}
                          className="relative group cursor-pointer focus:outline-none select-none"
                        >
                          <div className="absolute inset-0 rounded-xl bg-slate-500 translate-y-1.5" />
                          <div className="relative px-6 py-3 rounded-xl bg-slate-600 text-white font-mono font-bold tracking-widest text-xs border border-slate-500 group-active:translate-y-1.5 flex items-center justify-center gap-2 shadow-md">
                            <Layers className="w-4 h-4" />
                            Change Level
                          </div>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Telemetry Log */}
              <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 font-mono text-[11px] text-slate-600 dark:text-slate-400 overflow-hidden relative">
                <div className="absolute top-2 right-4 text-[10px] text-slate-600 dark:text-slate-400 tracking-wider">TELEMETRY_STREAM</div>
                <div className="h-20 overflow-y-auto flex flex-col gap-1 pr-2">
                  {logs.map((log, idx) => (
                    <div key={idx} className={`${idx === 0 ? "text-violet-700 font-bold" : "opacity-50"} transition-opacity duration-200`}>{log}</div>
                  ))}
                </div>
              </div>
            </div>

            {phase === "playing" && (
              <div className="flex justify-end">
                <button
                  onClick={() => { gameOverRef.current = true; stopTimer(); setPhase("gameover"); addLog("!! MANUAL ABORT !!"); }}
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
