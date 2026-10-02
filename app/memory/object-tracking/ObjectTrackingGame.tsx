"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Brain, Play, RotateCcw, Shield, Star, Zap, Flame, Target, Trophy } from "lucide-react";
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
  dotCount: number;
  targetCount: number;
  speedMultiplier: number;
  moveDuration: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "6 Dots · Track 3 · Slow",
    dotCount: 6, targetCount: 3, speedMultiplier: 0.8, moveDuration: 4000,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "8 Dots · Track 4 · Medium",
    dotCount: 8, targetCount: 4, speedMultiplier: 1.2, moveDuration: 5000,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "10 Dots · Track 5 · Fast",
    dotCount: 10, targetCount: 5, speedMultiplier: 1.6, moveDuration: 6000,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "12 Dots · Track 6 · Very Fast",
    dotCount: 12, targetCount: 6, speedMultiplier: 2.2, moveDuration: 7000,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "15 Dots · Track 7 · Extreme",
    dotCount: 15, targetCount: 7, speedMultiplier: 3.0, moveDuration: 8000,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "memorize" | "moving" | "guess" | "result" | "gameover";

interface Dot {
  id: number;
  x: number; 
  y: number; 
  dx: number;
  dy: number;
  isTarget: boolean;
  isGuessed: boolean;
  isWrong: boolean;
}

export default function ObjectTrackingGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [dots, setDots] = useState<Dot[]>([]);
  const [guessesLeft, setGuessesLeft] = useState(0);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });
  
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];
  
  const requestRef = useRef<number | null>(null);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);
  const dotsRef = useRef<Dot[]>([]);
  const speedRef = useRef(1);

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`objecttrack-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`objecttrack-hs-${diffId}`, score.toString());
        return { ...prev, [diffId]: score };
      }
      return prev;
    });
  }, [gameState, score, diffId]);

  const clearAllTimers = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  };

  const initLevel = useCallback((lvl: number, difficulty: DiffConfig) => {
    const extraDots = Math.floor((lvl - 1) / 2);
    const extraTargets = Math.floor((lvl - 1) / 3);
    
    const dotCount = difficulty.dotCount + extraDots;
    const targetCount = difficulty.targetCount + extraTargets;
    
    const newDots: Dot[] = [];
    for (let i = 0; i < dotCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = difficulty.speedMultiplier * (0.8 + Math.random() * 0.4);
      newDots.push({
        id: i,
        x: 10 + Math.random() * 80,
        y: 10 + Math.random() * 80,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        isTarget: i < targetCount,
        isGuessed: false,
        isWrong: false,
      });
    }
    
    dotsRef.current = newDots;
    speedRef.current = difficulty.speedMultiplier + (lvl * 0.1);
    setDots([...newDots]);
    setGuessesLeft(targetCount);
    
    setGameState("memorize");
    play("tick");
    
    clearAllTimers();
    
    const t1 = setTimeout(() => {
      setGameState("moving");
      startMoving();
      
      const t2 = setTimeout(() => {
        stopMoving();
        setGameState("guess");
        play("tick");
      }, difficulty.moveDuration + (lvl * 200));
      timeoutRefs.current.push(t2);
    }, 2000); 
    timeoutRefs.current.push(t1);
  }, [play]);

  const startMoving = () => {
    let lastTime = performance.now();
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 16.66;
      lastTime = time;
      
      dotsRef.current = dotsRef.current.map(dot => {
        let { x, y, dx, dy } = dot;
        
        x += dx * deltaTime * 0.2 * speedRef.current;
        y += dy * deltaTime * 0.2 * speedRef.current;
        
        if (x <= 5 || x >= 95) dx *= -1;
        if (y <= 5 || y >= 95) dy *= -1;
        
        x = Math.max(5, Math.min(95, x));
        y = Math.max(5, Math.min(95, y));

        return { ...dot, x, y, dx, dy };
      });
      
      setDots([...dotsRef.current]);
      requestRef.current = requestAnimationFrame(animate);
    };
    requestRef.current = requestAnimationFrame(animate);
  };

  const stopMoving = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  useEffect(() => {
    return () => clearAllTimers();
  }, []);

  const startGame = () => {
    play("click");
    setLevel(1);
    setScore(0);
    clearAllTimers();
    initLevel(1, diff);
  };

  const handleDotClick = (id: number) => {
    if (gameState !== "guess") return;
    
    const newDots = [...dots];
    const clickedDot = newDots.find(d => d.id === id);
    if (!clickedDot || clickedDot.isGuessed || clickedDot.isWrong) return;

    if (clickedDot.isTarget) {
      play("click");
      clickedDot.isGuessed = true;
      setDots(newDots);
      
      const newGuessesLeft = guessesLeft - 1;
      setGuessesLeft(newGuessesLeft);
      
      if (newGuessesLeft === 0) {
        play("success");
        setGameState("result");
        setScore(score + 1);
        setTimeout(() => {
          setLevel(l => l + 1);
          initLevel(level + 1, diff);
        }, 1500);
      }
    } else {
      play("error");
      clickedDot.isWrong = true;
      newDots.forEach(d => {
        if (d.isTarget) d.isGuessed = true;
      });
      setDots(newDots);
      setGameState("gameover");
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

  const totalDots = gameState === "select" ? diff.dotCount : dots.length;
  const targetDots = gameState === "select" ? diff.targetCount : dots.filter(d => d.isTarget).length;

  const stats = (
    <>
      <StatBox label="Score" value={score} highlight={score > 0} />
      <StatBox label="Best" value={highScores[diffId] > 0 ? highScores[diffId] : "-"} highlight={highScores[diffId] > 0} />
      <StatBox label="Level" value={gameState === "select" ? "-" : level} />
      <StatBox label="Objects" value={`${targetDots}/${totalDots}`} />
    </>
  );

  return (
    <GameDashboardLayout
      title="MULTIPLE OBJECT TRACKING"
      subtitle="DYNAMIC VISUAL ATTENTION"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="TARGET IDENTIFICATION"
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
              <Target className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Multiple Object Tracking
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Multiple objects will appear. A few will flash as targets. Keep your eyes on the targets as they move rapidly, and identify them when they stop.
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

        {(gameState !== "select" && gameState !== "gameover") && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center"
          >
            <div className="mb-4 text-center">
              {gameState === "memorize" && <div className="text-amber-500 font-bold uppercase tracking-widest animate-pulse">Memorize Targets</div>}
              {gameState === "moving" && <div className="text-indigo-500 font-bold uppercase tracking-widest">Tracking Active</div>}
              {gameState === "guess" && <div className="text-emerald-500 font-bold uppercase tracking-widest">Select Targets ({guessesLeft} left)</div>}
              {gameState === "result" && <div className="text-emerald-500 font-bold uppercase tracking-widest">Tracking Successful</div>}
            </div>

            <div className="relative w-full max-w-[600px] aspect-square bg-slate-50 dark:bg-slate-900/50 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 shadow-inner">
              {dots.map((dot) => {
                let bgClass = "bg-slate-300 dark:bg-slate-700";
                let scale = 1;
                let zIndex = 1;

                if (gameState === "memorize" && dot.isTarget) {
                  bgClass = "bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]";
                  scale = 1.1;
                  zIndex = 10;
                } else if (gameState === "moving") {
                  bgClass = "bg-indigo-400 dark:bg-indigo-500";
                } else if ((gameState === "guess" || gameState === "result") && dot.isGuessed) {
                  bgClass = "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)]";
                  zIndex = 10;
                } else if ((gameState === "guess" || gameState === "result") && dot.isWrong) {
                  bgClass = "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]";
                  zIndex = 10;
                } else if (gameState === "guess" || gameState === "result") {
                  bgClass = "bg-slate-300 hover:bg-slate-400 dark:bg-slate-600 dark:hover:bg-slate-500 cursor-pointer";
                }

                return (
                  <motion.div
                    key={dot.id}
                    onClick={() => handleDotClick(dot.id)}
                    className={`absolute rounded-full w-[8%] h-[8%] -ml-[4%] -mt-[4%] flex items-center justify-center transition-colors duration-200 ${bgClass}`}
                    style={{
                      left: `${dot.x}%`,
                      top: `${dot.y}%`,
                      scale,
                      zIndex,
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {(dot.isGuessed || dot.isWrong) && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </motion.div>
                );
              })}
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
            <div className="text-slate-500 mb-2 text-sm uppercase tracking-widest">
              Final Score: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{score}</span>
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
