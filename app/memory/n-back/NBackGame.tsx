"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Layers, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain } from "lucide-react";
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
  n: number;
  trials: number;
  lives: number;
  intervalMs: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "1-Back · 20 Trials · 5 Lives",
    n: 1, trials: 20, lives: 5, intervalMs: 1500,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "1-Back · 30 Trials · 3 Lives",
    n: 1, trials: 30, lives: 3, intervalMs: 1500,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "2-Back · 30 Trials · 3 Lives",
    n: 2, trials: 30, lives: 3, intervalMs: 1500,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "2-Back · 40 Trials · 2 Lives",
    n: 2, trials: 40, lives: 2, intervalMs: 1000,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "3-Back · 40 Trials · 1 Life",
    n: 3, trials: 40, lives: 1, intervalMs: 1000,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];
const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];

type GameState = "select" | "playing" | "gameover";

export default function NBackGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [trial, setTrial] = useState(0);
  const [currentLetter, setCurrentLetter] = useState("");
  const [accuracy, setAccuracy] = useState(0);
  const [feedback, setFeedback] = useState<"hit" | "miss" | "false" | null>(null);

  const sequenceRef = useRef<string[]>([]);
  const trialRef = useRef(0);
  const respondedRef = useRef(false);
  const isMatchRef = useRef(false);
  const hitsRef = useRef(0);
  const targetsRef = useRef(0);
  const responsesRef = useRef(0);
  const correctRef = useRef(0);
  const livesRef = useRef(3);
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
      const v = localStorage.getItem(`nback-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`nback-hs-${diffId}`, score.toString());
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
    const total = responsesRef.current;
    setAccuracy(total > 0 ? Math.round((correctRef.current / total) * 100) : 0);
    setScore(hitsRef.current);
    setGameState("gameover");
  }, []);

  const loseLife = useCallback(() => {
    livesRef.current -= 1;
    setLives(livesRef.current);
    if (livesRef.current <= 0) {
      endGame();
      return true;
    }
    return false;
  }, [endGame]);

  const advanceTrial = useCallback(() => {
    if (!runningRef.current) return;

    // Missed a true match
    if (!respondedRef.current && isMatchRef.current && trialRef.current >= DIFFICULTIES[diffId].n) {
      play("error");
      setFeedback("miss");
      responsesRef.current += 1;
      if (loseLife()) return;
    }

    const d = DIFFICULTIES[diffId];
    const next = trialRef.current + 1;

    if (next > d.trials) {
      endGame();
      return;
    }

    let letter: string;
    const seq = sequenceRef.current;
    const canMatch = seq.length >= d.n;
    // ~30% chance of match when possible
    if (canMatch && Math.random() < 0.3) {
      letter = seq[seq.length - d.n];
    } else {
      do {
        letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      } while (canMatch && letter === seq[seq.length - d.n] && Math.random() < 0.7);
    }

    seq.push(letter);
    const isMatch = canMatch && letter === seq[seq.length - 1 - d.n];
    isMatchRef.current = isMatch;
    if (isMatch) targetsRef.current += 1;

    respondedRef.current = false;
    trialRef.current = next;
    setTrial(next);
    setCurrentLetter(letter);
    setFeedback(null);
    play("tick");

    timerRef.current = setTimeout(() => {
      advanceTrial();
    }, d.intervalMs);
  }, [diffId, endGame, loseLife, play]);

  const handleMatch = useCallback(() => {
    if (gameState !== "playing" || !runningRef.current || respondedRef.current) return;
    if (trialRef.current <= DIFFICULTIES[diffId].n) return;

    respondedRef.current = true;
    responsesRef.current += 1;

    if (isMatchRef.current) {
      play("success");
      hitsRef.current += 1;
      correctRef.current += 1;
      setScore(hitsRef.current);
      setFeedback("hit");
    } else {
      play("error");
      setFeedback("false");
      if (loseLife()) return;
    }
  }, [gameState, diffId, play, loseLife]);

  useEffect(() => {
    if (gameState !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        handleMatch();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState, handleMatch]);

  const startGame = () => {
    play("click");
    clearTimer();
    sequenceRef.current = [];
    trialRef.current = 0;
    respondedRef.current = false;
    isMatchRef.current = false;
    hitsRef.current = 0;
    targetsRef.current = 0;
    responsesRef.current = 0;
    correctRef.current = 0;
    livesRef.current = diff.lives;
    runningRef.current = true;

    setScore(0);
    setLives(diff.lives);
    setTrial(0);
    setAccuracy(0);
    setFeedback(null);
    setCurrentLetter("");
    setGameState("playing");

    timerRef.current = setTimeout(() => advanceTrial(), 600);
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
      <StatBox label="Trial" value={gameState === "playing" ? `${trial}/${diff.trials}` : `${diff.n}-Back`} />
    </>
  );

  return (
    <GameDashboardLayout
      title="N-BACK"
      subtitle="WORKING MEMORY"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight={`${diff.n}-BACK MATCH`}
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
              <Layers className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              N-Back Challenge
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Letters appear one at a time. Press Match (or Space) when the current letter matches the one {diff.n} step{diff.n > 1 ? "s" : ""} back.
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
            <div className="w-full max-w-xs mb-6">
              <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-slate-400 mb-2">
                <span>{diff.n}-Back</span>
                <span>{trial}/{diff.trials}</span>
              </div>
              <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (trial / diff.trials) * 100)}%` }}
                />
              </div>
            </div>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
              Press Space or Match when it repeats
            </p>
            <motion.div
              key={currentLetter + String(trial)}
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className={`relative w-44 h-44 md:w-52 md:h-52 rounded-[1.75rem] flex items-center justify-center mb-10 border ${
                feedback === "hit"
                  ? "bg-emerald-50 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700 shadow-[0_0_40px_rgba(16,185,129,0.25)]"
                  : feedback === "miss" || feedback === "false"
                    ? "bg-rose-50 dark:bg-rose-900/30 border-rose-300 dark:border-rose-700 shadow-[0_0_40px_rgba(244,63,94,0.25)]"
                    : "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border-slate-200 dark:border-slate-700 shadow-[0_12px_40px_rgba(15,23,42,0.08)]"
              }`}
            >
              <span className="absolute top-3 left-4 text-[8px] font-mono text-slate-400 tracking-widest">STIM</span>
              <span className="text-7xl md:text-8xl font-black text-slate-900 dark:text-white tracking-tight tabular-nums">
                {currentLetter || "·"}
              </span>
            </motion.div>
            <button
              onClick={handleMatch}
              disabled={trial <= diff.n}
              className="w-full max-w-xs py-5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xl tracking-widest uppercase transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-indigo-500/30"
            >
              Match
            </button>
            <div className="h-6 mt-4">
              {feedback === "hit" && (
                <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest">Hit!</p>
              )}
              {feedback === "false" && (
                <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">False Alarm</p>
              )}
              {feedback === "miss" && (
                <p className="text-rose-500 text-xs font-bold uppercase tracking-widest">Missed Match</p>
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
              Hits: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{score}</span>
            </div>
            <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
              Accuracy: <span className="text-lg font-black text-slate-900 dark:text-white ml-2">{accuracy}%</span>
            </div>
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
