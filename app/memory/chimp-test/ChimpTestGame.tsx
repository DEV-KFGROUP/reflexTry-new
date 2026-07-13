"use client";

import { useState, useCallback, useRef } from "react";
import { Brain, Play, RotateCcw, Heart, Trophy, Shield, Star, Zap, Flame } from "lucide-react";
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
  rows: number;
  cols: number;
  startingNumbers: number;
  lives: number;
  hideAfterClick: number;
  autoHideMs: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "4x4 Grid · 3 Numbers · 5 Lives",
    rows: 4, cols: 4, startingNumbers: 3, lives: 5, hideAfterClick: 2, autoHideMs: 0,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "5x6 Grid · 4 Numbers · 3 Lives",
    rows: 5, cols: 6, startingNumbers: 4, lives: 3, hideAfterClick: 1, autoHideMs: 0,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "5x8 Grid · 4 Numbers · 3 Lives",
    rows: 5, cols: 8, startingNumbers: 4, lives: 3, hideAfterClick: 1, autoHideMs: 0,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "6x8 Grid · Auto hide (3s)",
    rows: 6, cols: 8, startingNumbers: 5, lives: 1, hideAfterClick: 1, autoHideMs: 3000,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "8x8 Grid · Auto hide (1s)",
    rows: 8, cols: 8, startingNumbers: 5, lives: 1, hideAfterClick: 1, autoHideMs: 1000,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "gameover" | "level_complete";

interface CellData {
  id: number;
  number: number | null;
  isRevealed: boolean;
  isClicked: boolean;
  isWrong: boolean;
}

export default function ChimpTestGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [grid, setGrid] = useState<CellData[]>([]);
  const [numbersShown, setNumbersShown] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [score, setScore] = useState(0);
  
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateGrid = useCallback((currentLevel: number, d: DiffConfig) => {
    const numTargets = d.startingNumbers + currentLevel - 1;
    const totalCells = d.rows * d.cols;
    
    const newGrid: CellData[] = Array(totalCells).fill(null).map((_, i) => ({
      id: i,
      number: null,
      isRevealed: true,
      isClicked: false,
      isWrong: false
    }));

    const positions = new Set<number>();
    while (positions.size < numTargets) {
      positions.add(Math.floor(Math.random() * totalCells));
    }

    let num = 1;
    positions.forEach(pos => {
      newGrid[pos].number = num++;
    });

    setGrid(newGrid);
    setNumbersShown(true);
    setCurrentStep(1);

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    if (d.autoHideMs > 0) {
      hideTimerRef.current = setTimeout(() => {
        setNumbersShown(false);
      }, d.autoHideMs);
    }
  }, []);

  const startGame = () => {
    play("click");
    setGameState("playing");
    setLevel(1);
    setLives(diff.lives);
    setScore(0);
    generateGrid(1, diff);
  };

  const nextLevel = () => {
    play("success");
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setScore(nextLvl - 1);
    generateGrid(nextLvl, diff);
    setGameState("playing");
  };

  const handleCellClick = (cellIndex: number) => {
    if (gameState !== "playing") return;

    const cell = grid[cellIndex];
    if (cell.number === null || cell.isClicked) return;

    if (cell.number === currentStep) {
      play("tick");
      
      const newGrid = [...grid];
      newGrid[cellIndex].isClicked = true;
      
      if (currentStep >= diff.hideAfterClick) {
        setNumbersShown(false);
      }

      setGrid(newGrid);

      const targetCount = diff.startingNumbers + level - 1;
      if (currentStep === targetCount) {
        if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
        setGameState("level_complete");
        setTimeout(nextLevel, 1000);
      } else {
        setCurrentStep(currentStep + 1);
      }
    } else {
      play("error");
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      
      const newGrid = [...grid];
      newGrid[cellIndex].isWrong = true;
      
      newGrid.forEach(c => c.isRevealed = true);
      setNumbersShown(true);
      setGrid(newGrid);

      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setTimeout(() => setGameState("gameover"), 1500);
      } else {
        setTimeout(() => {
          generateGrid(level, diff);
        }, 1500);
      }
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

  const stats = (
    <>
      <StatBox label="Score" value={score} highlight={score > 0} />
      <StatBox label="Level" value={gameState === "select" ? "-" : level} />
      <StatBox label="Lives" value={gameState === "select" ? diff.lives : lives} />
      <StatBox label="Status" value={gameState === "select" ? "IDLE" : gameState === "playing" ? "ACTIVE" : "ENDED"} />
    </>
  );

  return (
    <GameDashboardLayout
      title="CHIMP TEST"
      subtitle="WORKING MEMORY CALIBRATION"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="SEQUENCE MEMORIZATION"
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
              <Brain className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Sequence Memory
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Click the squares in numerical order. Depending on the difficulty, numbers will hide after you begin clicking, forcing you to memorize their positions.
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

        {(gameState === "playing" || gameState === "level_complete") && (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex items-center justify-center p-4"
          >
            <div 
              className="grid gap-2 sm:gap-3 w-full max-w-2xl aspect-[4/3] sm:aspect-video"
              style={{
                gridTemplateColumns: `repeat(${diff.cols}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${diff.rows}, minmax(0, 1fr))`
              }}
            >
              {grid.map((cell) => {
                const isVisible = cell.number !== null && !cell.isClicked;
                const showNumber = isVisible && (numbersShown || cell.isRevealed);
                
                return (
                  <button
                    key={cell.id}
                    disabled={!isVisible || gameState !== "playing"}
                    onClick={() => handleCellClick(cell.id)}
                    className={`
                      relative w-full h-full rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center font-bold text-xl sm:text-3xl
                      ${!isVisible ? "opacity-0 invisible" : "opacity-100 visible cursor-pointer"}
                      ${showNumber ? "bg-white dark:bg-slate-800 border-2 border-slate-800 dark:border-slate-300 text-slate-900 dark:text-white" : "bg-white border-2 border-white"}
                      ${cell.isWrong ? "bg-red-500 border-red-600 text-white" : ""}
                      ${gameState === "playing" && !showNumber && !cell.isWrong ? "bg-slate-800 dark:bg-white border-slate-800 dark:border-white hover:scale-105 shadow-md" : ""}
                    `}
                    style={{
                       boxShadow: (!showNumber && !cell.isWrong && isVisible) ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" : "none"
                    }}
                  >
                    {showNumber ? cell.number : ""}
                  </button>
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
            <div className="text-slate-500 mb-8 text-sm uppercase tracking-widest">
              Final Score: <span className="text-xl font-black text-slate-900 dark:text-white ml-2">{score}</span>
            </div>
            
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
