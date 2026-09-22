"use client";

import { useState, useRef, useEffect } from "react";
import { Grid3X3, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain } from "lucide-react";
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
  size: number;
  reverse: boolean;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3×3 Grid · Ascending",
    size: 3, reverse: false,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "4×4 Grid · Ascending",
    size: 4, reverse: false,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "5×5 Grid · Ascending",
    size: 5, reverse: false,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "5×5 Grid · Descending",
    size: 5, reverse: true,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "7×7 Grid · Ascending",
    size: 7, reverse: false,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "gameover";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function formatTime(ms: number): string {
  if (ms <= 0) return "0.00s";
  return `${(ms / 1000).toFixed(2)}s`;
}

export default function SchulteTableGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");

  const [grid, setGrid] = useState<number[]>([]);
  const [target, setTarget] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const [finalTime, setFinalTime] = useState(0);
  const [clicked, setClicked] = useState<Set<number>>(new Set());
  const [wrongId, setWrongId] = useState<number | null>(null);

  const startTimeRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(1);
  const endTargetRef = useRef(1);

  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });

  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`schulte-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover" || finalTime <= 0) return;
    setHighScores(prev => {
      // Lower time is better; 0 means unset
      if (prev[diffId] === 0 || finalTime < prev[diffId]) {
        localStorage.setItem(`schulte-hs-${diffId}`, finalTime.toString());
        return { ...prev, [diffId]: finalTime };
      }
      return prev;
    });
  }, [gameState, finalTime, diffId]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const tick = () => {
    setElapsed(Math.round(performance.now() - startTimeRef.current));
    rafRef.current = requestAnimationFrame(tick);
  };

  const startGame = () => {
    play("click");
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const total = diff.size * diff.size;
    const numbers = shuffle(Array.from({ length: total }, (_, i) => i + 1));
    const startTarget = diff.reverse ? total : 1;
    const endTarget = diff.reverse ? 1 : total;

    targetRef.current = startTarget;
    endTargetRef.current = endTarget;

    setGrid(numbers);
    setTarget(startTarget);
    setElapsed(0);
    setFinalTime(0);
    setClicked(new Set());
    setWrongId(null);
    setGameState("playing");

    startTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(tick);
  };

  const handleCellClick = (num: number) => {
    if (gameState !== "playing") return;
    if (clicked.has(num)) return;

    if (num === targetRef.current) {
      play("tick");
      const nextClicked = new Set(clicked);
      nextClicked.add(num);
      setClicked(nextClicked);
      setWrongId(null);

      // Check if this was the last number
      if (targetRef.current === endTargetRef.current) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        const time = Math.round(performance.now() - startTimeRef.current);
        setElapsed(time);
        setFinalTime(time);
        play("success");
        setGameState("gameover");
        return;
      }

      const next = diff.reverse ? targetRef.current - 1 : targetRef.current + 1;
      targetRef.current = next;
      setTarget(next);
    } else {
      play("error");
      setWrongId(num);
      setTimeout(() => setWrongId(null), 300);
    }
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

  const displayTime = gameState === "gameover" ? finalTime : elapsed;
  const bestDisplay = highScores[diffId] > 0 ? formatTime(highScores[diffId]) : "-";

  const stats = (
    <>
      <StatBox label="Time" value={gameState === "select" ? "-" : formatTime(displayTime)} highlight={displayTime > 0} />
      <StatBox label="Best" value={bestDisplay} highlight={highScores[diffId] > 0} />
      <StatBox label="Target" value={gameState === "playing" ? target : diff.reverse ? `${diff.size * diff.size}→1` : `1→${diff.size * diff.size}`} />
      <StatBox label="Grid" value={`${diff.size}×${diff.size}`} />
    </>
  );

  const cellSize =
    diff.size <= 3 ? "text-3xl md:text-4xl" :
    diff.size <= 4 ? "text-2xl md:text-3xl" :
    diff.size <= 5 ? "text-xl md:text-2xl" :
    "text-sm md:text-lg";

  return (
    <GameDashboardLayout
      title="SCHULTE TABLE"
      subtitle="VISUAL SCANNING"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight={diff.reverse ? "COUNT DOWN" : "COUNT UP"}
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
              <Grid3X3 className="w-10 h-10 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Schulte Table Speed Test
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Click numbers in {diff.reverse ? "descending" : "ascending"} order as fast as possible. Expand your visual field and scanning speed.
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
            className="w-full flex flex-col items-center justify-center p-2 max-w-2xl"
          >
            <div className="mb-5 flex items-center gap-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                Next
              </span>
              <span className="inline-flex min-w-12 h-12 items-center justify-center rounded-2xl bg-indigo-600 text-white text-2xl font-black shadow-lg shadow-indigo-500/30">
                {target}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
                {formatTime(elapsed)}
              </span>
            </div>
            <div
              className="grid gap-1.5 md:gap-2 w-full max-w-lg p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800"
              style={{ gridTemplateColumns: `repeat(${diff.size}, minmax(0, 1fr))` }}
            >
              {grid.map((num) => {
                const isDone = clicked.has(num);
                const isWrong = wrongId === num;
                return (
                  <button
                    key={num}
                    onClick={() => handleCellClick(num)}
                    disabled={isDone}
                    className={`${cellSize} aspect-square rounded-xl font-black transition-all ${
                      isDone
                        ? "bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-300 dark:text-indigo-800"
                        : isWrong
                          ? "bg-rose-200 dark:bg-rose-900/50 text-rose-700 scale-95"
                          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:scale-105 active:scale-95"
                    }`}
                  >
                    {num}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[10px] font-mono uppercase tracking-widest text-slate-400">
              {clicked.size}/{diff.size * diff.size} cleared · {diff.reverse ? "Descending" : "Ascending"}
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
            <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
              Time: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{formatTime(finalTime)}</span>
            </div>
            {finalTime > 0 && (highScores[diffId] === 0 || finalTime <= highScores[diffId]) ? (
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
