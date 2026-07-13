"use client";

import { useState, useRef, useEffect } from "react";
import { BookA, Play, RotateCcw, Trophy, Shield, Star, Zap, Flame, Brain } from "lucide-react";
import { useGameSound } from "@/hooks/useGameSound";
import { WORD_DICTIONARY } from "./dictionary";
import { GameDashboardLayout } from "@/components/dashboard/GameDashboardLayout";
import { DashboardDifficultyCard } from "@/components/dashboard/DashboardDifficultyCard";
import { StatBox } from "@/components/dashboard/StatBox";
import { motion, AnimatePresence } from "framer-motion";

type DiffId = "beginner" | "easy" | "normal" | "hard" | "professional";

interface DiffConfig {
  id: DiffId;
  label: string;
  description: string;
  wordBankSize: number;
  lives: number;
  timeLimitMs: number;
  icon: React.ElementType;
  iconColorClass: string;
  iconBgClass: string;
}

const DIFFICULTIES: Record<DiffId, DiffConfig> = {
  beginner: {
    id: "beginner", label: "Beginner", description: "50 Words · 5 Lives",
    wordBankSize: 50, lives: 5, timeLimitMs: 0,
    icon: Shield, iconColorClass: "text-emerald-600", iconBgClass: "bg-emerald-100",
  },
  easy: {
    id: "easy", label: "Easy", description: "100 Words · 3 Lives",
    wordBankSize: 100, lives: 3, timeLimitMs: 0,
    icon: Star, iconColorClass: "text-sky-600", iconBgClass: "bg-sky-100",
  },
  normal: {
    id: "normal", label: "Normal", description: "300 Words · 3 Lives",
    wordBankSize: 300, lives: 3, timeLimitMs: 0,
    icon: Zap, iconColorClass: "text-indigo-600", iconBgClass: "bg-indigo-100",
  },
  hard: {
    id: "hard", label: "Hard", description: "500 Words · 1 Life",
    wordBankSize: 500, lives: 1, timeLimitMs: 0,
    icon: Flame, iconColorClass: "text-orange-600", iconBgClass: "bg-orange-100",
  },
  professional: {
    id: "professional", label: "Professional", description: "1000 Words · 3s Limit",
    wordBankSize: 1000, lives: 1, timeLimitMs: 3000,
    icon: Brain, iconColorClass: "text-rose-600", iconBgClass: "bg-rose-100",
  },
};

const DIFF_ORDER: DiffId[] = ["beginner", "easy", "normal", "hard", "professional"];

type GameState = "select" | "playing" | "gameover";

export default function VerbalMemoryGame() {
  const [gameState, setGameState] = useState<GameState>("select");
  const [diffId, setDiffId] = useState<DiffId>("normal");
  
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [currentWord, setCurrentWord] = useState("");
  const [seenWords, setSeenWords] = useState<Set<string>>(new Set());
  
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  const { play, isMuted, toggleMute } = useGameSound();
  const diff = DIFFICULTIES[diffId];

  const getNextWord = (currentSeen: Set<string>) => {
    const workingDictSize = Math.min(diff.wordBankSize, WORD_DICTIONARY.length);
    const showSeen = currentSeen.size > 0 && Math.random() > 0.5;

    if (showSeen) {
      const seenArray = Array.from(currentSeen);
      const randomIndex = Math.floor(Math.random() * seenArray.length);
      return seenArray[randomIndex];
    } else {
      let newWord = "";
      do {
        const randomIndex = Math.floor(Math.random() * workingDictSize);
        newWord = WORD_DICTIONARY[randomIndex];
      } while (currentSeen.has(newWord) && currentSeen.size < workingDictSize);
      return newWord;
    }
  };

  const startTimer = () => {
    if (diff.timeLimitMs > 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeLeft(diff.timeLimitMs);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 100) {
            handleTimeout();
            return 0;
          }
          return prev - 100;
        });
      }, 100);
    }
  };

  const stopTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };

  useEffect(() => {
    return () => stopTimer();
  }, []);

  const handleTimeout = () => {
    stopTimer();
    play("error");
    const newLives = lives - 1;
    setLives(newLives);
    
    if (newLives <= 0) {
      setGameState("gameover");
    } else {
      const newSeen = new Set(seenWords);
      newSeen.add(currentWord);
      setSeenWords(newSeen);
      setCurrentWord(getNextWord(newSeen));
      startTimer();
    }
  };

  const startGame = () => {
    play("click");
    setGameState("playing");
    setScore(0);
    setLives(diff.lives);
    const newSeen = new Set<string>();
    setSeenWords(newSeen);
    setCurrentWord(getNextWord(newSeen));
    startTimer();
  };

  const handleChoice = (isSeen: boolean) => {
    if (gameState !== "playing") return;
    
    stopTimer();
    const wordWasSeen = seenWords.has(currentWord);
    const isCorrect = isSeen === wordWasSeen;

    if (isCorrect) {
      play("tick");
      setScore(s => s + 1);
      
      const newSeen = new Set(seenWords);
      newSeen.add(currentWord);
      setSeenWords(newSeen);
      setCurrentWord(getNextWord(newSeen));
      startTimer();
    } else {
      play("error");
      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setGameState("gameover");
      } else {
        const newSeen = new Set(seenWords);
        newSeen.add(currentWord);
        setSeenWords(newSeen);
        setCurrentWord(getNextWord(newSeen));
        startTimer();
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
      <StatBox label="Seen Words" value={gameState === "select" ? "-" : seenWords.size} />
      <StatBox label="Lives" value={gameState === "select" ? diff.lives : lives} />
      <StatBox label="Time Left" value={diff.timeLimitMs > 0 ? (gameState === "playing" ? `${(timeLeft / 1000).toFixed(1)}s` : "-") : "∞"} />
    </>
  );

  return (
    <GameDashboardLayout
      title="VERBAL MEMORY"
      subtitle="LEXICAL RECOGNITION"
      difficultySelector={difficultySelector}
      stats={stats}
      arenaHeaderLeft={`ARENA // ${diff.label.toUpperCase()}`}
      arenaHeaderRight="IDENTIFY NOVEL STIMULI"
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
              <BookA className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider mb-4">
              Lexical Memory
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Test your verbal memory. Keep track of which words you've seen and which are new.
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
            <div className="w-full mb-12 flex flex-col items-center">
              <div className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight break-all text-center leading-tight">
                {currentWord}
              </div>
            </div>
            
            <div className="flex flex-row w-full gap-4">
              <button
                onClick={() => handleChoice(true)}
                className="flex-1 py-5 bg-white dark:bg-slate-800 border-2 border-indigo-500 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-2xl font-black text-xl tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-sm"
              >
                Seen
              </button>
              <button
                onClick={() => handleChoice(false)}
                className="flex-1 py-5 bg-indigo-600 hover:bg-indigo-700 border-2 border-indigo-600 hover:border-indigo-700 text-white rounded-2xl font-black text-xl tracking-widest uppercase transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/30"
              >
                New
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
