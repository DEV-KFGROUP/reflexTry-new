"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Play, RotateCcw, Brain } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function SequenceGame() {
    const content = getToolContent("sequence-memory", "Sequence Memory");
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const { play } = useGameSound();

    useEffect(() => {
        const saved = localStorage.getItem("sequence-highscore");
        if (saved) setHighScore(parseInt(saved));
    }, []);

    const colors = [
        "bg-memory shadow-[0_0_30px_rgba(236,72,153,0.3)] border-2 border-memory/50", // Pink
        "bg-reflex shadow-[0_0_30px_rgba(139,92,246,0.3)] border-2 border-reflex/50", // Violet
        "bg-speed shadow-[0_0_30px_rgba(6,182,212,0.3)] border-2 border-speed/50",   // Cyan
        "bg-wisdom shadow-[0_0_30px_rgba(245,158,11,0.3)] border-2 border-wisdom/50"  // Amber
    ];

    const activeColors = [
        "bg-white shadow-[0_0_60px_rgba(236,72,153,0.8)] border-white scale-105 brightness-150",
        "bg-white shadow-[0_0_60px_rgba(139,92,246,0.8)] border-white scale-105 brightness-150",
        "bg-white shadow-[0_0_60px_rgba(6,182,212,0.8)] border-white scale-105 brightness-150",
        "bg-white shadow-[0_0_60px_rgba(245,158,11,0.8)] border-white scale-105 brightness-150"
    ];

    const startGame = () => {
        setSequence([]);
        setUserSequence([]);
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        addToSequence([]);
        play("start");
    };

    const addToSequence = (currentSequence: number[]) => {
        const nextColor = Math.floor(Math.random() * 4);
        const newSequence = [...currentSequence, nextColor];
        setSequence(newSequence);
        setUserSequence([]);
        setIsShowingSequence(true);

        // Play sequence
        let i = 0;
        const interval = setInterval(() => {
            if (i >= newSequence.length) {
                clearInterval(interval);
                setIsShowingSequence(false);
                return;
            }
            activateButton(newSequence[i]);
            i++;
        }, 800);
    };

    const activateButton = (index: number) => {
        setActiveButton(index);
        play("tick");
        setTimeout(() => setActiveButton(null), 400);
    };

    const handleInput = (index: number) => {
        if (!isPlaying || isShowingSequence) return;

        activateButton(index);
        play("click");

        const newUserSeq = [...userSequence, index];
        setUserSequence(newUserSeq);

        const currentIndex = newUserSeq.length - 1;
        if (newUserSeq[currentIndex] !== sequence[currentIndex]) {
            setGameOver(true);
            setIsPlaying(false);
            play("error");
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem("sequence-highscore", score.toString());
            }
            return;
        }

        if (newUserSeq.length === sequence.length) {
            setScore(sequence.length);
            play("success");
            setTimeout(() => {
                play("levelUp");
                addToSequence(sequence);
            }, 1000);
        }
    };

    return (
        <GameBackground variant="default" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-memory/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            Sequence Arena
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Memory Test</p>
                    </div>

                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Level</div>
                            <div className="text-4xl font-bold text-white">{score + 1}</div>
                        </div>
                        <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Record</div>
                            <div className="text-4xl font-bold text-memory">{highScore}</div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-3xl aspect-square md:aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-memory/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full h-full rounded-[3rem] p-8 md:p-16 flex flex-col relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {!isPlaying && !gameOver ? (
                            <div className="w-full h-full flex flex-col items-center justify-center space-y-8 relative z-20">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <Brain className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Ready for Memory Calibration?</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Memorize the pattern and repeat it. The sequence gets longer with every correct round.</p>
                                    <Button
                                        variant="memory"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        INITIATE SEQUENCE
                                    </Button>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="w-full h-full grid grid-cols-2 gap-6 md:gap-8 relative z-20 p-4 md:p-12">
                                {colors.map((color, i) => (
                                    <motion.button
                                        key={i}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`
                                            rounded-3xl transition duration-200 cursor-pointer relative overflow-hidden
                                            ${activeButton === i ? activeColors[i] : color}
                                            disabled:cursor-not-allowed
                                        `}
                                        onClick={() => handleInput(i)}
                                        disabled={isShowingSequence}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                                        {activeButton === i && (
                                            <div className="absolute inset-0 bg-white/40 blur-xl scale-150 animate-pulse" />
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        )}

                        {gameOver && (
                            <motion.div
                                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                className="absolute inset-0 z-50 rounded-[3rem] bg-black/60 flex flex-col items-center justify-center text-center p-8"
                            >
                                <div className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                                    SYSTEM FAILURE
                                </div>
                                <div className="text-2xl text-gray-300 mb-8">
                                    Sequence Broken at Level <span className="text-memory font-bold">{score}</span>
                                </div>
                                <Button
                                    variant="memory"
                                    size="lg"
                                    onClick={startGame}
                                    className="text-xl px-12 py-6 rounded-2xl"
                                >
                                    <RotateCcw className="w-6 h-6 mr-3" />
                                    REBOOT SYSTEM
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Sequence Memory Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Enhances short-term memory capacity.",
                        "Improves pattern recognition skills.",
                        "Trains improved focus and concentration.",
                        "Helps in cognitive development and maintenance.",
                        "Fun and engaging way to exercise your brain."
                    ]}
                    howToPlay={[
                        "Watch the sequence of flashing lights carefully.",
                        "Wait for the buttons to stop flashing.",
                        "Repeat the sequence by clicking the buttons in the same order.",
                        "Complete the round to advance to the next level.",
                        "One mistake ends the game. How far can you go?"
                    ]}
                />
            </div>
        </GameBackground>
    );
}
