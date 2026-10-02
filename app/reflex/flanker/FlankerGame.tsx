"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { ArrowLeftRight, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain, ChevronLeft, ChevronRight } from "lucide-react";
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
  lives: number;
  incongruentPct: number;
  timeoutMs: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "20 Trials · 20% Incongruent · 5 Lives",
    trials: 20, lives: 5, incongruentPct: 0.2, timeoutMs: 2500,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "25 Trials · 30% Incongruent · 3 Lives",
    trials: 25, lives: 3, incongruentPct: 0.3, timeoutMs: 2000,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "30 Trials · 50% Incongruent · 3 Lives",
    trials: 30, lives: 3, incongruentPct: 0.5, timeoutMs: 1500,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "35 Trials · 70% Incongruent · 2 Lives",
    trials: 35, lives: 2, incongruentPct: 0.7, timeoutMs: 1200,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "40 Trials · 80% Incongruent · 1 Life",
    trials: 40, lives: 1, incongruentPct: 0.8, timeoutMs: 900,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "gameover";
type Direction = "left" | "right";

export default function FlankerGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [trial, setTrial] = useState(0);
  const [arrows, setArrows] = useState("");
  const [avgRt, setAvgRt] = useState(0);
  const [lastRt, setLastRt] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const centerRef = useRef<Direction>("left");
  const trialRef = useRef(0);
  const livesRef = useRef(3);
  const scoreRef = useRef(0);
  const rtsRef = useRef<number[]>([]);
  const stimulusStartRef = useRef(0);
  const respondedRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);
  const awaitingRef = useRef(false);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`flanker-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`flanker-hs-${diffId}`, score.toString());
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
    awaitingRef.current = false;
    clearTimer();
    setScore(scoreRef.current);
    if (rtsRef.current.length > 0) {
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
    }
    setGameState("gameover");
  }, []);

  const showNextTrial = useCallback(() => {
    if (!runningRef.current) return;
    const d = DIFFICULTIES[diffId];
    const next = trialRef.current + 1;

    if (next > d.trials || livesRef.current <= 0) {
      endGame();
      return;
    }

    const center: Direction = Math.random() < 0.5 ? "left" : "right";
    const incongruent = Math.random() < d.incongruentPct;
    const flanker: Direction = incongruent
      ? (center === "left" ? "right" : "left")
      : center;

    const f = flanker === "left" ? "<" : ">";
    const c = center === "left" ? "<" : ">";
    const display = `${f}${f}${c}${f}${f}`;

    centerRef.current = center;
    respondedRef.current = false;
    awaitingRef.current = true;
    trialRef.current = next;
    stimulusStartRef.current = performance.now();

    setTrial(next);
    setArrows(display);
    setFeedback(null);
    setLastRt(null);
    play("tick");

    timerRef.current = setTimeout(() => {
      if (!runningRef.current || respondedRef.current) return;
      // Timeout = miss
      play("error");
      respondedRef.current = true;
      awaitingRef.current = false;
      livesRef.current -= 1;
      setLives(livesRef.current);
      setFeedback("wrong");
      if (livesRef.current <= 0) {
        setTimeout(endGame, 400);
      } else {
        timerRef.current = setTimeout(showNextTrial, 500);
      }
    }, d.timeoutMs);
  }, [diffId, endGame, play]);

  const handleResponse = useCallback((dir: Direction) => {
    if (gameState !== "playing" || !runningRef.current || !awaitingRef.current || respondedRef.current) return;

    respondedRef.current = true;
    awaitingRef.current = false;
    clearTimer();

    const rt = Math.round(performance.now() - stimulusStartRef.current);
    const correct = dir === centerRef.current;

    if (correct) {
      play("success");
      scoreRef.current += 1;
      rtsRef.current.push(rt);
      setScore(scoreRef.current);
      setLastRt(rt);
      setAvgRt(Math.round(rtsRef.current.reduce((a, b) => a + b, 0) / rtsRef.current.length));
      setFeedback("correct");
      timerRef.current = setTimeout(showNextTrial, 400);
    } else {
      play("error");
      livesRef.current -= 1;
      setLives(livesRef.current);
      setFeedback("wrong");
      if (livesRef.current <= 0) {
        setTimeout(endGame, 400);
      } else {
        timerRef.current = setTimeout(showNextTrial, 500);
      }
    }
  }, [gameState, play, showNextTrial, endGame]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        e.preventDefault();
        handleResponse("left");
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        e.preventDefault();
        handleResponse("right");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleResponse]);

  const startGame = () => {
    play("click");
    clearTimer();
    trialRef.current = 0;
    livesRef.current = diff.lives;
    scoreRef.current = 0;
    rtsRef.current = [];
    respondedRef.current = false;
    awaitingRef.current = false;
    runningRef.current = true;

    setScore(0);
    setLives(diff.lives);
    setTrial(0);
    setArrows("");
    setAvgRt(0);
    setLastRt(null);
    setFeedback(null);
    setGameState("playing");

    timerRef.current = setTimeout(showNextTrial, 600);
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
      <StatBox label="Lives" value={gameState === "select" ? diff.lives : lives} />
      <StatBox label="Avg RT" value={avgRt > 0 ? `${avgRt}ms` : lastRt !== null ? `${lastRt}ms` : "-"} />
    </>
  );

  return (
    <GameDashboardLayout
      title="FLANKER"
      subtitle="ATTENTION CONTROL"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="CENTER ARROW ONLY"
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
              <ArrowLeftRight className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Flanker Test
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Respond to the center arrow only. Ignore flanking arrows — congruent or incongruent. Use ← → keys or buttons.
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
            <div className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Trial {trial}/{diff.trials} · Respond to center only
            </div>
            <motion.div
              key={arrows + String(trial)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-10 px-6 py-5 rounded-2xl border transition-colors ${
                feedback === "correct"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700"
                  : feedback === "wrong"
                    ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700"
                    : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
              }`}
            >
              <div className="flex items-center justify-center gap-1 md:gap-2 font-black text-4xl md:text-6xl select-none">
                {(arrows || "·····").split("").map((ch, i) => {
                  const isCenter = i === 2;
                  return (
                    <span
                      key={`${i}-${ch}`}
                      className={`inline-flex w-10 h-12 md:w-14 md:h-16 items-center justify-center rounded-xl ${
                        isCenter
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-110"
                          : "text-slate-300 dark:text-slate-600"
                      }`}
                    >
                      {ch === "<" ? "‹" : ch === ">" ? "›" : ch}
                    </span>
                  );
                })}
              </div>
              <p className="mt-3 text-center text-[9px] font-mono uppercase tracking-widest text-slate-400">
                Flankers dim · Center highlighted
              </p>
            </motion.div>
            <div className="flex gap-4 w-full max-w-sm">
              <button
                onClick={() => handleResponse("left")}
                className="flex-1 py-5 bg-white dark:bg-slate-800 border-2 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl font-black text-xl tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
              >
                <ChevronLeft className="w-6 h-6" />
                Left
              </button>
              <button
                onClick={() => handleResponse("right")}
                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xl tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2"
              >
                Right
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            <div className="h-6 mt-4">
              {lastRt !== null && (
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">{lastRt}ms</p>
              )}
            </div>
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
              Correct: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{score}</span>
            </div>
            {avgRt > 0 && (
              <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
                Avg RT: <span className="text-lg font-black text-slate-900 dark:text-white ml-2">{avgRt}ms</span>
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
