"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { CircleDot, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain } from "lucide-react";
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
  trials: number;
  stimulusMs: number;
  isiMs: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "20 Trials · Slow Pace",
    trials: 20, stimulusMs: 1200, isiMs: 900,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "25 Trials · Moderate Pace",
    trials: 25, stimulusMs: 1000, isiMs: 700,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "30 Trials · Standard Pace",
    trials: 30, stimulusMs: 800, isiMs: 500,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "35 Trials · Fast Pace",
    trials: 35, stimulusMs: 600, isiMs: 400,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "40 Trials · Rapid Fire",
    trials: 40, stimulusMs: 450, isiMs: 300,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "gameover";
type Stimulus = "go" | "nogo" | "blank";

export default function GoNoGoGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");

  const [score, setScore] = useState(0);
  const [trial, setTrial] = useState(0);
  const [stimulus, setStimulus] = useState<Stimulus>("blank");
  const [lastRt, setLastRt] = useState<number | null>(null);
  const [avgRt, setAvgRt] = useState(0);

  const trialRef = useRef(0);
  const stimulusRef = useRef<Stimulus>("blank");
  const respondedRef = useRef(false);
  const correctRef = useRef(0);
  const rtsRef = useRef<number[]>([]);
  const stimulusStartRef = useRef(0);
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
      const v = localStorage.getItem(`gonogo-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`gonogo-hs-${diffId}`, score.toString());
        return { ...prev, [diffId]: score };
      }
      return prev;
    });
  }, [gameState, score, diffId]);

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
    setStimulus("blank");
    stimulusRef.current = "blank";
    setScore(correctRef.current);
    if (rtsRef.current.length > 0) {
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
    }
    setGameState("gameover");
  }, []);

  const scheduleNext = useCallback(() => {
    if (!runningRef.current) return;
    const d = DIFFICULTIES[diffId];
    const next = trialRef.current + 1;

    if (next > d.trials) {
      endGame();
      return;
    }

    setStimulus("blank");
    stimulusRef.current = "blank";

    timerRef.current = setTimeout(() => {
      if (!runningRef.current) return;

      const isGo = Math.random() < 0.8;
      const type: Stimulus = isGo ? "go" : "nogo";
      stimulusRef.current = type;
      respondedRef.current = false;
      trialRef.current = next;
      stimulusStartRef.current = performance.now();

      setTrial(next);
      setStimulus(type);
      setLastRt(null);
      play("tick");

      timerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        // Timeout: miss on Go, correct withhold on No-Go
        if (stimulusRef.current === "go" && !respondedRef.current) {
          play("error");
        } else if (stimulusRef.current === "nogo" && !respondedRef.current) {
          correctRef.current += 1;
          setScore(correctRef.current);
        }
        scheduleNext();
      }, d.stimulusMs);
    }, d.isiMs);
  }, [diffId, endGame, play]);

  const handlePress = useCallback(() => {
    if (gameState !== "playing" || !runningRef.current) return;
    if (stimulusRef.current === "blank" || respondedRef.current) return;

    respondedRef.current = true;
    const rt = Math.round(performance.now() - stimulusStartRef.current);

    if (stimulusRef.current === "go") {
      play("success");
      correctRef.current += 1;
      rtsRef.current.push(rt);
      setScore(correctRef.current);
      setLastRt(rt);
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
    } else {
      // False alarm on No-Go
      play("error");
    }
  }, [gameState, play]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handlePress();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handlePress]);

  const startGame = () => {
    play("click");
    clearTimer();
    trialRef.current = 0;
    correctRef.current = 0;
    rtsRef.current = [];
    respondedRef.current = false;
    runningRef.current = true;

    setScore(0);
    setTrial(0);
    setLastRt(null);
    setAvgRt(0);
    setStimulus("blank");
    setGameState("playing");

    timerRef.current = setTimeout(() => scheduleNext(), 500);
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

  const stats = (
    <>
      <StatBox label="Score" value={score} highlight={score > 0} />
      <StatBox label="Best" value={highScores[diffId] > 0 ? highScores[diffId] : "-"} highlight={highScores[diffId] > 0} />
      <StatBox label="Trial" value={gameState === "playing" || gameState === "gameover" ? `${trial}/${diff.trials}` : diff.trials} />
      <StatBox label="RT" value={lastRt !== null ? `${lastRt}ms` : avgRt > 0 ? `${avgRt}ms` : "-"} />
    </>
  );

  return (
    <GameDashboardLayout
      title="GO / NO-GO"
      subtitle="INHIBITORY CONTROL"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="PRESS GREEN · HOLD RED"
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
              <CircleDot className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Go / No-Go Test
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Green circle = press Space or tap ASAP. Red circle = do not press. Inhibit false alarms while reacting fast.
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
            <div className="flex gap-3 mb-8">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Green = Go
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                Red = Hold
              </span>
            </div>
            <motion.button
              type="button"
              onClick={handlePress}
              key={stimulus + String(trial)}
              initial={{ scale: 0.9, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className={`w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center transition-colors active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-indigo-300 ${
                stimulus === "go"
                  ? "bg-emerald-500 shadow-[0_0_50px_rgba(34,197,94,0.45)]"
                  : stimulus === "nogo"
                    ? "bg-rose-500 shadow-[0_0_50px_rgba(244,63,94,0.45)]"
                    : "bg-slate-200 dark:bg-slate-700 shadow-inner"
              }`}
              aria-label={stimulus === "go" ? "Go stimulus" : stimulus === "nogo" ? "No-go stimulus" : "Waiting"}
            >
              <span className={`font-black text-2xl uppercase tracking-[0.3em] drop-shadow ${
                stimulus === "blank" ? "text-slate-400 dark:text-slate-500" : "text-white"
              }`}>
                {stimulus === "go" ? "GO" : stimulus === "nogo" ? "STOP" : "···"}
              </span>
            </motion.button>
            <div className="h-8 mt-6">
              {lastRt !== null && (
                <p className="text-emerald-500 text-sm font-bold uppercase tracking-widest">{lastRt}ms</p>
              )}
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
              Space or tap · Trial {trial}/{diff.trials}
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
              Correct: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{score}/{diff.trials}</span>
            </div>
            {avgRt > 0 && (
              <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
                Avg Go RT: <span className="text-lg font-black text-slate-900 dark:text-white ml-2">{avgRt}ms</span>
              </div>
            )}
            {score > 0 && score >= highScores[diffId] ? (
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
