"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Eye, Play, Shield, Star, Zap, Flame, Brain, SkipForward, Trophy, RotateCcw } from "lucide-react";
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
  colorContrast: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "High contrast · Very distinct",
    colorContrast: 1.0,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "Standard contrast · Typical Ishihara",
    colorContrast: 0.8,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "Medium contrast · Subtler hues",
    colorContrast: 0.6,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "Low contrast · Difficult",
    colorContrast: 0.4,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "Extreme · Minimal contrast",
    colorContrast: 0.2,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "result" | "gameover";

const RED_GREEN_PALETTES = {
  bg: [[120, 160, 80], [140, 180, 90], [160, 190, 100], [180, 200, 110]], 
  fg: [[220, 100, 80], [240, 120, 90], [200, 80, 70], [250, 140, 100]] 
};

export default function ColorBlindnessGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [currentNumber, setCurrentNumber] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>("");
  const [lives, setLives] = useState(3);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });
  
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isGenerating = useRef(false);

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`colorblind-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`colorblind-hs-${diffId}`, score.toString());
        return { ...prev, [diffId]: score };
      }
      return prev;
    });
  }, [gameState, score, diffId]);

  const generatePlate = useCallback((num: number, contrast: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    isGenerating.current = true;
    
    const size = 400;
    canvas.width = size;
    canvas.height = size;
    
    ctx.clearRect(0, 0, size, size);
    
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = size;
    maskCanvas.height = size;
    const mctx = maskCanvas.getContext('2d', { willReadFrequently: true });
    if (!mctx) return;
    
    mctx.fillStyle = 'black';
    mctx.fillRect(0, 0, size, size);
    mctx.fillStyle = 'white';
    mctx.font = 'bold 220px Arial';
    mctx.textAlign = 'center';
    mctx.textBaseline = 'middle';
    mctx.fillText(num.toString(), size / 2, size / 2);
    
    const maskData = mctx.getImageData(0, 0, size, size).data;
    
    const circles: {x: number, y: number, r: number}[] = [];
    const minR = 3;
    const maxR = 12;
    const centerX = size / 2;
    const centerY = size / 2;
    const plateRadius = size / 2 - 10;
    
    const cellSize = maxR * 2 + 2;
    const gridCols = Math.ceil(size / cellSize);
    const spatialGrid: {x: number, y: number, r: number}[][] = Array.from({ length: gridCols * gridCols }, () => []);
    
    for (let i = 0; i < 5000; i++) {
      const r = minR + Math.random() * (maxR - minR);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * (plateRadius - r);
      
      const x = centerX + Math.cos(angle) * dist;
      const y = centerY + Math.sin(angle) * dist;
      
      let overlaps = false;
      const gx = Math.floor(x / cellSize);
      const gy = Math.floor(y / cellSize);
      
      for (let nx = Math.max(0, gx - 1); nx <= Math.min(gridCols - 1, gx + 1); nx++) {
        for (let ny = Math.max(0, gy - 1); ny <= Math.min(gridCols - 1, gy + 1); ny++) {
          const cell = spatialGrid[ny * gridCols + nx];
          for (const c of cell) {
            const dx = c.x - x;
            const dy = c.y - y;
            if (dx * dx + dy * dy < (c.r + r + 1) * (c.r + r + 1)) {
              overlaps = true;
              break;
            }
          }
          if (overlaps) break;
        }
        if (overlaps) break;
      }
      
      if (!overlaps) {
        const c = {x, y, r};
        circles.push(c);
        spatialGrid[gy * gridCols + gx].push(c);
      }
    }
    
    circles.forEach(c => {
      const ix = Math.floor(c.x);
      const iy = Math.floor(c.y);
      const idx = (iy * size + ix) * 4;
      const isForeground = maskData[idx] > 128; 
      
      const palette = isForeground ? RED_GREEN_PALETTES.fg : RED_GREEN_PALETTES.bg;
      let baseColor = palette[Math.floor(Math.random() * palette.length)];
      
      if (contrast < 1.0) {
        const neutral = [180, 170, 90];
        const blendFactor = 1.0 - contrast;
        baseColor = [
          Math.round(baseColor[0] * (1 - blendFactor) + neutral[0] * blendFactor),
          Math.round(baseColor[1] * (1 - blendFactor) + neutral[1] * blendFactor),
          Math.round(baseColor[2] * (1 - blendFactor) + neutral[2] * blendFactor),
        ];
      }
      
      const jitter = (Math.random() - 0.5) * 20;
      const r = Math.max(0, Math.min(255, baseColor[0] + jitter));
      const g = Math.max(0, Math.min(255, baseColor[1] + jitter));
      const b = Math.max(0, Math.min(255, baseColor[2] + jitter));
      
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();
    });
    
    isGenerating.current = false;
  }, []);

  const startGame = () => {
    play("click");
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameState("playing");
    setInputValue("");
    
    const initialNum = Math.floor(Math.random() * 89) + 10; 
    setCurrentNumber(initialNum);
    
    setTimeout(() => {
      generatePlate(initialNum, diff.colorContrast);
    }, 50);
  };

  const handleInput = (val: string) => {
    if (gameState !== "playing" || isGenerating.current) return;
    
    if (val === 'del') {
      setInputValue(prev => prev.slice(0, -1));
      play("click");
      return;
    }
    
    if (val === 'enter' || val === 'skip') {
      submitGuess(val === 'skip');
      return;
    }
    
    if (inputValue.length < 2) {
      setInputValue(prev => prev + val);
      play("tick");
    }
  };

  const submitGuess = (skipped: boolean) => {
    const guess = parseInt(inputValue, 10);
    
    if (guess === currentNumber && !skipped) {
      play("success");
      setScore(s => s + 1);
      setLevel(l => l + 1);
      
      setGameState("result");
      setTimeout(() => {
        const nextNum = Math.floor(Math.random() * 89) + 10;
        setCurrentNumber(nextNum);
        setInputValue("");
        const progressiveContrast = Math.max(0.1, diff.colorContrast - (level * 0.02));
        generatePlate(nextNum, progressiveContrast);
        setGameState("playing");
      }, 1000);
    } else {
      play("error");
      const newLives = lives - 1;
      setLives(newLives);
      
      if (newLives <= 0) {
        setGameState("gameover");
      } else {
        setGameState("result");
        setTimeout(() => {
          const nextNum = Math.floor(Math.random() * 89) + 10;
          setCurrentNumber(nextNum);
          setInputValue("");
          generatePlate(nextNum, diff.colorContrast); 
          setGameState("playing");
        }, 1500);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing" || isGenerating.current) return;
      if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
      } else if (e.key === 'Backspace') {
        handleInput('del');
      } else if (e.key === 'Enter') {
        handleInput('enter');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, inputValue]);

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
      <StatBox label="Level" value={gameState === "select" ? "-" : level} />
      <StatBox label="Lives" value={gameState === "select" ? "-" : lives} />
    </>
  );

  return (
    <GameDashboardLayout
      title="COLOR BLINDNESS"
      subtitle="ISHIHARA VISUAL ACUITY"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="PERCEPTION DIAGNOSTIC"
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
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mb-6">
              <Eye className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Color Perception
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Test your color vision by identifying the numbers hidden within the procedural Ishihara plates.
            </p>
            <button
              onClick={startGame}
              className="w-full sm:w-auto px-12 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:shadow-rose-500/20 flex items-center justify-center gap-3"
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
            className="w-full h-full flex flex-col items-center justify-center p-2"
          >
            {/* Canvas Container */}
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center mb-8">
              <canvas 
                ref={canvasRef} 
                className="w-full h-full object-contain rounded-full bg-[#f8f9fa] shadow-[inset_0_4px_20px_rgba(0,0,0,0.05)] border-4 border-white dark:border-slate-800"
                style={{ opacity: gameState === 'playing' ? 1 : 0.5 }}
              />
              
              {gameState === "result" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-8xl font-black text-slate-900/80 dark:text-white/80 drop-shadow-2xl">{currentNumber}</span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="w-full max-w-[280px] flex flex-col gap-3">
              <div className="w-full bg-slate-50 dark:bg-slate-900 rounded-xl h-14 flex items-center justify-center text-2xl font-black font-mono text-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-800 tracking-widest">
                {inputValue || <span className="text-slate-300 dark:text-slate-700 font-sans text-sm tracking-widest uppercase font-bold">Input</span>}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <button
                    key={num}
                    onClick={() => handleInput(num.toString())}
                    disabled={gameState !== "playing"}
                    className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 h-12 rounded-xl text-xl font-black text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => handleInput('del')}
                  disabled={gameState !== "playing" || inputValue.length === 0}
                  className="bg-rose-50 dark:bg-rose-900/20 border-2 border-rose-200 dark:border-rose-800 h-12 rounded-xl text-xs uppercase tracking-widest font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition-all disabled:opacity-50"
                >
                  Del
                </button>
                <button
                  onClick={() => handleInput('0')}
                  disabled={gameState !== "playing"}
                  className="bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 h-12 rounded-xl text-xl font-black text-slate-700 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500 active:scale-95 transition-all disabled:opacity-50"
                >
                  0
                </button>
                <button
                  onClick={() => handleInput('enter')}
                  disabled={gameState !== "playing" || inputValue.length === 0}
                  className="bg-emerald-500 border-2 border-emerald-600 h-12 rounded-xl text-xs uppercase tracking-widest font-black text-white hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50"
                >
                  Enter
                </button>
              </div>
              
              <button
                onClick={() => handleInput('skip')}
                disabled={gameState !== "playing"}
                className="mt-2 py-3 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold text-[10px] uppercase tracking-widest transition-colors disabled:opacity-50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-xl"
              >
                <SkipForward className="w-3 h-3" />
                Nothing Visible (Skip)
              </button>
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
