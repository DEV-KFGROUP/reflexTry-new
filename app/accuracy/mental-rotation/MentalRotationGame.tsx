"use client";

import { useState, useCallback, useEffect } from "react";
import { Brain, Play, Shield, Star, Zap, Flame, Box, Check, X, Trophy, RotateCcw } from "lucide-react";
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
  blocks: number;
  rotations: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "6 Blocks · 1 Axis",
    blocks: 6, rotations: 1,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "8 Blocks · 1-2 Axes",
    blocks: 8, rotations: 2,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "10 Blocks · 2 Axes",
    blocks: 10, rotations: 2,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "12 Blocks · 3 Axes",
    blocks: 12, rotations: 3,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "14 Blocks · Complex",
    blocks: 14, rotations: 4,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type Vec3 = [number, number, number];

function rotateVec3(v: Vec3, axis: "x"|"y"|"z", deg90: number): Vec3 {
  let [x, y, z] = v;
  for (let i = 0; i < deg90; i++) {
    if (axis === "x") {
      const ny = -z;
      const nz = y;
      y = ny; z = nz;
    } else if (axis === "y") {
      const nx = z;
      const nz = -x;
      x = nx; z = nz;
    } else if (axis === "z") {
      const nx = -y;
      const ny = x;
      x = nx; y = ny;
    }
  }
  return [x, y, z];
}

function mirrorVec3(v: Vec3): Vec3 {
  return [-v[0], v[1], v[2]];
}

const TILE_SIZE = 25; 
const ISO_COS = Math.cos(Math.PI / 6); 
const ISO_SIN = Math.sin(Math.PI / 6);

function projectIso(x: number, y: number, z: number) {
  const sx = (x - z) * TILE_SIZE * ISO_COS;
  const sy = (x + z) * TILE_SIZE * ISO_SIN - y * TILE_SIZE;
  return { sx, sy };
}

function generateBlocks(count: number): Vec3[] {
  const blocks: Vec3[] = [[0, 0, 0]];
  const dirs: Vec3[] = [
    [1,0,0], [-1,0,0],
    [0,1,0], [0,-1,0],
    [0,0,1], [0,0,-1]
  ];
  
  const hasBlock = (x:number, y:number, z:number) => 
    blocks.some(b => b[0]===x && b[1]===y && b[2]===z);

  let attempts = 0;
  while (blocks.length < count) {
    attempts++;
    if (attempts > 1000) {
      blocks.length = 1; 
      attempts = 0;
      continue;
    }
    
    const parent = blocks[Math.floor(Math.random() * blocks.length)];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    const nx = parent[0] + dir[0];
    const ny = parent[1] + dir[1];
    const nz = parent[2] + dir[2];
    
    if (Math.abs(nx) <= 3 && Math.abs(ny) <= 3 && Math.abs(nz) <= 3) {
      if (!hasBlock(nx, ny, nz)) {
        blocks.push([nx, ny, nz]);
        attempts = 0;
      }
    }
  }
  
  let minX=0, maxX=0, minY=0, maxY=0, minZ=0, maxZ=0;
  blocks.forEach(([x,y,z]) => {
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  });
  
  const cx = Math.round((minX + maxX)/2);
  const cy = Math.round((minY + maxY)/2);
  const cz = Math.round((minZ + maxZ)/2);
  
  return blocks.map(([x,y,z]) => [x-cx, y-cy, z-cz]);
}

function BlockRender({ blocks, className }: { blocks: Vec3[], className?: string }) {
  const sorted = [...blocks].sort((a, b) => {
    const da = a[0] + a[1] + a[2];
    const db = b[0] + b[1] + b[2];
    if (da !== db) return da - db;
    return a[1] - b[1]; 
  });

  return (
    <div className={`relative flex items-center justify-center ${className || ''}`}>
      <svg width="240" height="240" viewBox="-120 -120 240 240" className="overflow-visible">
        {sorted.map((v, i) => {
          const { sx, sy } = projectIso(v[0], v[1], v[2]);
          
          const t0 = { x: sx, y: sy - TILE_SIZE }; 
          const t1 = { x: sx + TILE_SIZE*ISO_COS, y: sy - TILE_SIZE + TILE_SIZE*ISO_SIN }; 
          const t2 = { x: sx, y: sy }; 
          const t3 = { x: sx - TILE_SIZE*ISO_COS, y: sy - TILE_SIZE + TILE_SIZE*ISO_SIN }; 

          const l0 = t2;
          const l1 = t3;
          const l2 = { x: sx - TILE_SIZE*ISO_COS, y: sy + TILE_SIZE*ISO_SIN };
          const l3 = { x: sx, y: sy + TILE_SIZE };

          const r0 = t2;
          const r1 = t1;
          const r2 = { x: sx + TILE_SIZE*ISO_COS, y: sy + TILE_SIZE*ISO_SIN };
          const r3 = { x: sx, y: sy + TILE_SIZE };

          return (
            <g key={i}>
              <polygon 
                points={`${t0.x},${t0.y} ${t1.x},${t1.y} ${t2.x},${t2.y} ${t3.x},${t3.y}`}
                fill="#93c5fd" stroke="#3b82f6" strokeWidth="1" strokeLinejoin="round"
              />
              <polygon 
                points={`${l0.x},${l0.y} ${l1.x},${l1.y} ${l2.x},${l2.y} ${l3.x},${l3.y}`}
                fill="#60a5fa" stroke="#2563eb" strokeWidth="1" strokeLinejoin="round"
              />
              <polygon 
                points={`${r0.x},${r0.y} ${r1.x},${r1.y} ${r2.x},${r2.y} ${r3.x},${r3.y}`}
                fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" strokeLinejoin="round"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}

type GameState = "select" | "playing" | "result" | "gameover";

export default function MentalRotationGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  
  const [originalObj, setOriginalObj] = useState<Vec3[]>([]);
  const [targetObj, setTargetObj] = useState<Vec3[]>([]);
  const [isSame, setIsSame] = useState<boolean>(true);
  const [lastGuessWasCorrect, setLastGuessWasCorrect] = useState<boolean>(false);
  const [highScores, setHighScores] = useState<Record<DiffId, number>>({
    beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0,
  });
  
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  useEffect(() => {
    const saved: Record<DiffId, number> = { beginner: 0, easy: 0, normal: 0, hard: 0, professional: 0 };
    DIFF_ORDER.forEach(k => {
      const v = localStorage.getItem(`mentalrot-hs-${k}`);
      if (v) saved[k] = parseInt(v, 10);
    });
    setHighScores(saved);
  }, []);

  useEffect(() => {
    if (gameState !== "gameover") return;
    setHighScores(prev => {
      if (score > prev[diffId]) {
        localStorage.setItem(`mentalrot-hs-${diffId}`, score.toString());
        return { ...prev, [diffId]: score };
      }
      return prev;
    });
  }, [gameState, score, diffId]);

  const generateLevel = useCallback((lvl: number, difficulty: DiffConfig) => {
    const extraBlocks = Math.floor(lvl / 3);
    const totalBlocks = Math.min(difficulty.blocks + extraBlocks, 20); 
    
    let base = generateBlocks(totalBlocks);
    
    const axes: ("x"|"y"|"z")[] = ["x", "y", "z"];
    const rotsBase = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotsBase; i++) {
      const axis = axes[Math.floor(Math.random() * 3)];
      base = base.map(v => rotateVec3(v, axis, 1));
    }
    setOriginalObj(base);
    
    const shouldBeSame = Math.random() > 0.5;
    setIsSame(shouldBeSame);
    
    let target = [...base];
    
    if (!shouldBeSame) {
      target = target.map(v => mirrorVec3(v));
    }
    
    const rotsTarget = difficulty.rotations + Math.floor(lvl / 5);
    for (let i = 0; i < rotsTarget; i++) {
      const axis = axes[Math.floor(Math.random() * 3)];
      const turns = Math.floor(Math.random() * 3) + 1; 
      target = target.map(v => rotateVec3(v, axis, turns));
    }
    
    setTargetObj(target);
  }, []);

  const startGame = () => {
    play("click");
    setLevel(1);
    setScore(0);
    setLives(3);
    setGameState("playing");
    generateLevel(1, diff);
  };

  const handleGuess = (guessSame: boolean) => {
    if (gameState !== "playing") return;
    
    const correct = guessSame === isSame;
    setLastGuessWasCorrect(correct);
    
    if (correct) {
      play("success");
      setScore(s => s + 1);
      setLevel(l => l + 1);
      
      setGameState("result");
      setTimeout(() => {
        generateLevel(level + 1, diff);
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
          generateLevel(level, diff); 
          setGameState("playing");
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
      <StatBox label="Best" value={highScores[diffId] > 0 ? highScores[diffId] : "-"} highlight={highScores[diffId] > 0} />
      <StatBox label="Level" value={gameState === "select" ? "-" : level} />
      <StatBox label="Lives" value={gameState === "select" ? "-" : lives} />
    </>
  );

  return (
    <GameDashboardLayout
      title="MENTAL ROTATION"
      subtitle="SPATIAL INTELLIGENCE"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="3D STRUCTURAL ANALYSIS"
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
              <Box className="w-10 h-10 text-indigo-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Mental Rotation Test
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Test your spatial intelligence by determining if two 3D structures are the same object rotated, or if they are mirrored differently.
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
            className="w-full h-full flex flex-col items-center justify-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full relative">
              
              {/* Object A */}
              <div className="flex flex-col items-center">
                <div className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-sm">Object A</div>
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
                  <BlockRender blocks={originalObj} />
                </div>
              </div>

              <div className="hidden md:flex text-slate-300 dark:text-slate-600 font-black text-4xl">?</div>

              {/* Object B */}
              <div className="flex flex-col items-center">
                <div className="text-slate-400 font-bold mb-4 uppercase tracking-widest text-sm">Object B</div>
                <div className="w-48 h-48 sm:w-64 sm:h-64 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-inner overflow-hidden">
                  <BlockRender blocks={targetObj} />
                </div>
              </div>

              {gameState === "result" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm z-10 rounded-3xl">
                  {lastGuessWasCorrect ? (
                    <motion.div initial={{scale:0.5}} animate={{scale:1}} className="text-emerald-500 flex flex-col items-center">
                      <Check className="w-24 h-24 mb-4" />
                      <span className="text-4xl font-black uppercase tracking-widest">Correct</span>
                      <span className="text-lg mt-2 text-slate-500 font-bold tracking-widest">It was {isSame ? 'SAME' : 'DIFFERENT'}</span>
                    </motion.div>
                  ) : (
                    <motion.div initial={{scale:0.5}} animate={{scale:1}} className="text-rose-500 flex flex-col items-center">
                      <X className="w-24 h-24 mb-4" />
                      <span className="text-4xl font-black uppercase tracking-widest">Wrong</span>
                      <span className="text-lg mt-2 text-slate-500 font-bold tracking-widest">It was {isSame ? 'SAME' : 'DIFFERENT'}</span>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-row items-center justify-center gap-4 mt-12 w-full max-w-md">
              <button
                onClick={() => handleGuess(true)}
                disabled={gameState !== "playing"}
                className="flex-1 bg-white dark:bg-slate-800 border-2 border-emerald-500 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 disabled:opacity-50 py-4 rounded-2xl font-black text-xl tracking-widest transition-all active:scale-95 shadow-sm"
              >
                SAME
              </button>
              <button
                onClick={() => handleGuess(false)}
                disabled={gameState !== "playing"}
                className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white py-4 rounded-2xl font-black text-xl tracking-widest transition-all active:scale-95 shadow-lg shadow-rose-500/30 border-2 border-rose-600 hover:border-rose-700"
              >
                DIFFERENT
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
