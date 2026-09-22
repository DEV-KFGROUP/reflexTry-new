"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { LayoutGrid, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain } from "lucide-react";
import { useGameSound } from "@/hooks/useGameSound";
import { GameDashboardLayout } from "@/components/dashboard/GameDashboardLayout";
import { DashboardDifficultyCard } from "@/components/dashboard/DashboardDifficultyCard";
import { StatBox } from "@/components/dashboard/StatBox";
import { motion, AnimatePresence } from "framer-motion";

type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  choices: number;
  attempts: number;
  minWaitMs: number;
  maxWaitMs: number;
  decoys: boolean;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "2 Choices · 8 Attempts · Slow",
    choices: 2, attempts: 8, minWaitMs: 1000, maxWaitMs: 2500, decoys: false,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "2 Choices · 10 Attempts",
    choices: 2, attempts: 10, minWaitMs: 800, maxWaitMs: 2000, decoys: false,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "3 Choices · 12 Attempts",
    choices: 3, attempts: 12, minWaitMs: 600, maxWaitMs: 1800, decoys: false,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "4 Choices · 15 Attempts · Fast",
    choices: 4, attempts: 15, minWaitMs: 400, maxWaitMs: 1400, decoys: false,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "4 Choices · 20 Attempts · Decoys",
    choices: 4, attempts: 20, minWaitMs: 300, maxWaitMs: 1000, decoys: true,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

const COLORS = [
  { id: 0, bg: "bg-rose-500", ring: "ring-rose-300", label: "Red" },
  { id: 1, bg: "bg-sky-500", ring: "ring-sky-300", label: "Blue" },
  { id: 2, bg: "bg-emerald-500", ring: "ring-emerald-300", label: "Green" },
  { id: 3, bg: "bg-amber-400", ring: "ring-amber-200", label: "Yellow" },
];

type GameState = "select" | "playing" | "gameover";
type Phase = "wait" | "ready" | "result";

export default function ChoiceReactionGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");

  const [attempt, setAttempt] = useState(0);
  const [phase, setPhase] = useState<Phase>("wait");
  const [targetIdx, setTargetIdx] = useState<number | null>(null);
  const [avgRt, setAvgRt] = useState(0);
  const [lastRt, setLastRt] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [feedback, setFeedback] = useState<"hit" | "early" | "wrong" | null>(null);

  const attemptRef = useRef(0);
  const targetRef = useRef<number | null>(null);
  const rtsRef = useRef<number[]>([]);
  const errorsRef = useRef(0);
  const stimulusStartRef = useRef(0);
  const phaseRef = useRef<Phase>("wait");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`choicereaction-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover" || rtsRef.current.length === 0) return;
    const avg = Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length);
    setAvgRt(avg);
    setHighScores(prev => {
      // Lower avg RT is better; 0 means unset
      if (prev[diffId] === 0 || avg < prev[diffId]) {
        localStorage.setItem(`choicereaction-hs-${diffId}`, avg.toString());
        return { ...prev, [diffId]: avg };
      }
      return prev;
    });
  }, [gameState, diffId]);

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => () => clearTimer(), []);

  const endGame = useCallback(() => {
    runningRef.current = false;
    clearTimer();
    phaseRef.current = "wait";
    setPhase("wait");
    setTargetIdx(null);
    if (rtsRef.current.length > 0) {
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
    }
    setGameState("gameover");
  }, []);

  const scheduleAttempt = useCallback(() => {
    if (!runningRef.current) return;
    const d = DIFFICULTIES[diffId];
    const next = attemptRef.current + 1;

    if (next > d.attempts) {
      endGame();
      return;
    }

    attemptRef.current = next;
    targetRef.current = null;
    phaseRef.current = "wait";
    setAttempt(next);
    setTargetIdx(null);
    setPhase("wait");
    setFeedback(null);
    setLastRt(null);

    const wait = d.minWaitMs + Math.random() * (d.maxWaitMs - d.minWaitMs);

    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;
      const target = Math.floor(Math.random() * d.choices);
      targetRef.current = target;
      phaseRef.current = "ready";
      stimulusStartRef.current = performance.now();
      setTargetIdx(target);
      setPhase("ready");
      play("tick");
    }, wait);
  }, [diffId, endGame, play]);

  const handleBoxClick = (idx: number) => {
    if (gameState !== "playing" || !runningRef.current) return;

    if (phaseRef.current === "wait") {
      // Early click
      play("error");
      clearTimer();
      errorsRef.current += 1;
      setErrors(errorsRef.current);
      setFeedback("early");
      phaseRef.current = "result";
      setPhase("result");
      timerRef.current = setTimeout(scheduleAttempt, 700);
      return;
    }

    if (phaseRef.current !== "ready") return;

    const rt = Math.round(performance.now() - stimulusStartRef.current);
    phaseRef.current = "result";
    setPhase("result");

    if (idx === targetRef.current) {
      play("success");
      rtsRef.current.push(rt);
      setLastRt(rt);
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
      setFeedback("hit");
    } else {
      play("error");
      errorsRef.current += 1;
      setErrors(errorsRef.current);
      setFeedback("wrong");
      // On pro with decoys, wrong still counts against you but we don't add RT
    }

    timerRef.current = setTimeout(scheduleAttempt, 600);
  };

  const startGame = () => {
    play("click");
    clearTimer();
    attemptRef.current = 0;
    rtsRef.current = [];
    errorsRef.current = 0;
    targetRef.current = null;
    phaseRef.current = "wait";
    runningRef.current = true;

    setAttempt(0);
    setAvgRt(0);
    setLastRt(null);
    setErrors(0);
    setFeedback(null);
    setTargetIdx(null);
    setPhase("wait");
    setGameState("playing");

    timerRef.current = setTimeout(scheduleAttempt, 500);
  };

  const difficultySelector = DIFF_ORDER.map(k => {
    const d = DIFFICULTIES[k];
    return (
      <DashboardDifficultyCard
        key={k}
        id={k}
        label={d.label}
        description={d.description}
        selected={diffId === k}
        onSelect={() => {
          play("click");
          if (gameState === "select") setDiffId(k);
        }}
        disabled={gameState !== "select"}
        icon={d.icon}
        iconColorClass={d.iconColorClass}
        iconBgClass={d.iconBgClass}
      />
    );
  });

  const boxes = COLORS.slice(0, diff.choices);

  const stats = (
    <>
      <StatBox label="Avg RT" value={avgRt > 0 ? `${avgRt}ms` : "-"} highlight={avgRt > 0} />
      <StatBox label="Best RT" value={highScores[diffId] > 0 ? `${highScores[diffId]}ms` : "-"} highlight={highScores[diffId] > 0} />
      <StatBox label="Attempt" value={gameState === "playing" || gameState === "gameover" ? `${attempt}/${diff.attempts}` : diff.attempts} />
      <StatBox label="Errors" value={errors} />
    </>
  );

  return (
    <GameDashboardLayout
      title="CHOICE REACTION"
      subtitle="MULTI-CHOICE RT"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="CLICK THE LIT BOX"
      soundEnabled={!isMuted}
      onToggleSound={toggleMute}
    >
      <AnimatePresence mode="wait">
        {gameState === "select" && (
          <motion.div
            key="start"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col items-center justify-center text-center max-w-md"
          >
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
              <LayoutGrid className="w-10 h-10 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Choice Reaction Time Test
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Wait for a colored box to light up, then click it as fast as possible. Early or wrong clicks count as errors. Lower average RT wins.
            </p>
            <button
              onClick={startGame}
              className="w-full sm:w-auto px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 fill-current" />
              Initialize Test
            </button>
          </motion.div>
        )}

        {gameState === "playing" && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center p-4 max-w-2xl"
          >
            <div className={`mb-6 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
              phase === "wait"
                ? "bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800"
                : phase === "ready"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border-emerald-200 dark:border-emerald-800 animate-pulse"
                  : feedback === "hit"
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                    : "bg-rose-50 text-rose-600 border-rose-200"
            }`}>
              {phase === "wait" ? "Wait…" : phase === "ready" ? "Click the lit box!" : feedback === "hit" ? "Hit!" : feedback === "early" ? "Too Early!" : "Wrong!"}
            </div>
            <div className={`grid gap-4 w-full max-w-md ${diff.choices <= 2 ? "grid-cols-2" : "grid-cols-2"}`}>
              {boxes.map((c, idx) => {
                const isLit = phase === "ready" && targetIdx === idx;
                return (
                  <motion.button
                    key={c.id}
                    onClick={() => handleBoxClick(idx)}
                    whileTap={{ scale: 0.96 }}
                    className={`aspect-square rounded-2xl transition-all duration-150 border-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${
                      isLit
                        ? `${c.bg} border-white scale-[1.03] shadow-xl ring-4 ${c.ring}`
                        : phase === "ready" && diff.decoys
                          ? `${c.bg} opacity-20 border-transparent scale-95`
                          : `bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600`
                    }`}
                    aria-label={c.label}
                  >
                    {!isLit && phase === "wait" && (
                      <span className="sr-only">{c.label}</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
            <div className="h-8 mt-6">
              {lastRt !== null && (
                <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">{lastRt}ms</p>
              )}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Attempt {attempt}/{diff.attempts} · {diff.choices} choices
            </p>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">
              Calibration Complete
            </h2>
            <div className="text-slate-500 mb-1 text-sm uppercase tracking-widest">
              Avg RT: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{avgRt > 0 ? `${avgRt}ms` : "-"}</span>
            </div>
            <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
              Errors: <span className="text-lg font-black text-slate-900 dark:text-white ml-2">{errors}</span>
            </div>
            {avgRt > 0 && (highScores[diffId] === 0 || avgRt <= highScores[diffId]) ? (
              <p className="text-amber-500 font-bold text-xs uppercase tracking-widest mb-6">New Record!</p>
            ) : (
              <div className="mb-6" />
            )}
            <div className="flex gap-4">
              <button
                onClick={startGame}
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all shadow-lg hover:shadow-indigo-500/20"
              >
                <RotateCcw className="w-4 h-4" />
                Recalibrate
              </button>
              <button
                onClick={() => setGameState("select")}
                className="flex items-center gap-2 px-8 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold uppercase tracking-widest text-xs transition-all"
              >
                Menu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GameDashboardLayout>
  );
}
