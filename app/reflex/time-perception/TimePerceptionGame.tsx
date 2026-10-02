"use client";

import { useState, useRef, useEffect } from "react";
import { Clock, Play, RotateCcw, Shield, Star, Zap, Flame, Brain, Trophy } from "lucide-react";
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
  minTarget: number;
  maxTarget: number;
  marginMs: number;
  showPulse: boolean;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "3-5s Targets · Margin ±800ms",
    minTarget: 3, maxTarget: 5, marginMs: 800, showPulse: true,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "3-7s Targets · Margin ±500ms",
    minTarget: 3, maxTarget: 7, marginMs: 500, showPulse: true,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "5-10s Targets · Margin ±300ms",
    minTarget: 5, maxTarget: 10, marginMs: 300, showPulse: true,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "5-15s Targets · Margin ±150ms",
    minTarget: 5, maxTarget: 15, marginMs: 150, showPulse: false,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "10-25s Targets · Margin ±50ms",
    minTarget: 10, maxTarget: 25, marginMs: 50, showPulse: false,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "holding" | "result" | "gameover";

const ROUNDS = 3;

export default function TimePerceptionGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  
  const [round, setRound] = useState(1);
  const [targetTime, setTargetTime] = useState(3);
  const [scores, setScores] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<number | null>(null);
  const [isHolding, setIsHolding] = useState(false);
  const [failed, setFailed] = useState(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });
  
  const startTimeRef = useRef<number>(0);
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`timeperception-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover" || scores.length === 0) return;
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    setHighScores(prev => {
      // Lower average error is better; 0 means unset
      if (prev[diffId] === 0 || avg < prev[diffId]) {
        localStorage.setItem(`timeperception-hs-${diffId}`, avg.toString());
        return { ...prev, [diffId]: avg };
      }
      return prev;
    });
  }, [gameState, scores, diffId]);

  const getNewTarget = () => {
    return Math.floor(Math.random() * (diff.maxTarget - diff.minTarget + 1)) + diff.minTarget;
  };

  const startGame = () => {
    play("click");
    setGameState("playing");
    setRound(1);
    setScores([]);
    setFailed(false);
    setTargetTime(getNewTarget());
    setIsHolding(false);
  };

  const nextRound = () => {
    play("click");
    if (round >= ROUNDS || failed) {
      setGameState("gameover");
    } else {
      setRound(r => r + 1);
      setTargetTime(getNewTarget());
      setGameState("playing");
    }
  };

  const handlePointerDown = (e: React.SyntheticEvent) => {
    if (e.type === "mousedown" && (e as React.MouseEvent).button !== 0) return;
    if (gameState !== "playing") return;
    
    e.preventDefault();
    play("tick");
    setIsHolding(true);
    setGameState("holding");
    startTimeRef.current = performance.now();
  };

  const handlePointerUp = (e: React.SyntheticEvent) => {
    if (e.type === "mouseup" && (e as React.MouseEvent).button !== 0) return;
    if (gameState !== "holding") return;
    
    e.preventDefault();
    setIsHolding(false);
    
    const endTime = performance.now();
    const elapsedTimeMs = endTime - startTimeRef.current;
    
    const targetTimeMs = targetTime * 1000;
    const difference = elapsedTimeMs - targetTimeMs; // positive means too slow, negative means too fast
    const absDiff = Math.abs(difference);
    
    setLastResult(difference);
    setScores(prev => [...prev, absDiff]);
    
    if (absDiff <= diff.marginMs) {
      play("success");
    } else {
      play("error");
      setFailed(true);
    }

    setGameState("result");
  };

  const calculateAverage = () => {
    if (scores.length === 0) return 0;
    const sum = scores.reduce((a, b) => a + b, 0);
    return Math.round(sum / scores.length);
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

  const avgScore = calculateAverage();

  const stats = (
    <>
      <StatBox label="Round" value={gameState === "select" ? "-" : `${round}/${ROUNDS}`} />
      <StatBox label="Average Err" value={gameState === "select" || scores.length === 0 ? "-" : `${avgScore}ms`} highlight={scores.length > 0 && avgScore <= diff.marginMs} />
      <StatBox label="Best Err" value={highScores[diffId] > 0 ? `${highScores[diffId]}ms` : "-"} highlight={highScores[diffId] > 0} />
      <StatBox label="Target Margin" value={`±${diff.marginMs}ms`} />
    </>
  );

  return (
    <GameDashboardLayout
      title="TIME PERCEPTION"
      subtitle="INTERNAL CLOCK CALIBRATION"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="DURATION ESTIMATION"
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
              <Clock className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Time Perception Test
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Test your internal biological clock. Release the button exactly when you think the target time has elapsed.
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

        {(gameState === "playing" || gameState === "holding") && (
          <motion.div
            key="game"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center justify-center"
          >
            <div className="text-slate-500 font-bold tracking-widest uppercase mb-4 text-sm">Target Time</div>
            <div className="text-7xl font-black text-slate-900 dark:text-white mb-12 tabular-nums">
              {targetTime}.0<span className="text-4xl text-slate-400">s</span>
            </div>

            <button
              onMouseDown={handlePointerDown}
              onMouseUp={handlePointerUp}
              onMouseLeave={handlePointerUp}
              onTouchStart={handlePointerDown}
              onTouchEnd={handlePointerUp}
              onTouchCancel={handlePointerUp}
              className={`
                relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-300 touch-none select-none
                ${isHolding 
                  ? "bg-indigo-600 shadow-[0_0_40px_rgba(79,70,229,0.4)] scale-95" 
                  : "bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:bg-indigo-400 hover:scale-105"
                }
              `}
            >
              {isHolding && diff.showPulse && (
                <>
                  <span className="absolute w-full h-full rounded-full bg-indigo-400 opacity-50 animate-ping" style={{ animationDuration: '1s' }}></span>
                </>
              )}
              <span className="text-white font-black uppercase tracking-widest text-lg relative z-10">
                {isHolding ? "Release" : "Hold"}
              </span>
            </button>
          </motion.div>
        )}

        {gameState === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center justify-center text-center max-w-lg"
          >
            <div className="text-slate-500 font-bold tracking-widest uppercase mb-2 text-sm">Target</div>
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-8">{targetTime}.0s</div>

            <div className="text-slate-500 font-bold tracking-widest uppercase mb-2 text-sm">You were</div>
            <div className={`text-6xl font-black mb-4 tabular-nums ${
              lastResult && Math.abs(lastResult) <= diff.marginMs 
                ? "text-emerald-500" 
                : "text-rose-500"
            }`}>
              {lastResult && lastResult > 0 ? "+" : ""}
              {Math.round(lastResult || 0)}<span className="text-3xl text-slate-400 ml-1">ms</span>
            </div>

            <div className="text-slate-500 font-medium mb-12">
              {lastResult && Math.abs(lastResult) <= diff.marginMs 
                ? `Well done! Margin was ±${diff.marginMs}ms` 
                : `Failed. You missed the ±${diff.marginMs}ms margin`}
            </div>

            <button
              onClick={nextRound}
              className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-indigo-500/20"
            >
              {failed || round >= ROUNDS ? "View Results" : "Next Round"}
            </button>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div
            key="gameover"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
              <Trophy className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">
              Calibration Complete
            </h2>
            
            {failed ? (
              <div className="text-rose-500 mb-2 font-bold uppercase tracking-widest text-sm">Calibration Failed</div>
            ) : (
              <div className="text-slate-500 mb-2 uppercase tracking-widest text-sm">
                Average Error: <span className="text-2xl font-black text-emerald-500 ml-2">{avgScore}ms</span>
              </div>
            )}
            {scores.length > 0 && avgScore === highScores[diffId] ? (
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
