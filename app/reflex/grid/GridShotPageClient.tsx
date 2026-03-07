"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Target, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function GridShotPageClient() {
    const content = getToolContent("grid-shot", "Grid Shot");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [targetPos, setTargetPos] = useState({ top: "50%", left: "50%" });
    const { play } = useGameSound();

    const moveTarget = () => {
        const top = Math.random() * 70 + 15 + "%";
        const left = Math.random() * 70 + 15 + "%";
        setTargetPos({ top, left });
    };

    const handleHit = () => {
        if (!isPlaying) return;
        setScore(curr => curr + 1);
        play("success");
        moveTarget();
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setIsPlaying(true);
        setGameOver(false);
        moveTarget();
        play("start");
    };

    useEffect(() => {
        if (isPlaying && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && isPlaying) {
            setIsPlaying(false);
            setGameOver(true);
            play("levelUp");
        }
    }, [isPlaying, timeLeft, play]);

    return (
        <GameBackground variant="reflex" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-reflex/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-reflex via-white to-reflex bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            Grid Shot
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Aim Training</p>
                    </div>

                    {(isPlaying || gameOver) && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Hits</div>
                                <div className="text-4xl font-bold text-reflex">{score}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="w-full h-[500px] relative rounded-[3rem] overflow-hidden cursor-crosshair backdrop-blur-xl border border-white/10 shadow-2xl bg-black/40"
                    >
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        <AnimatePresence mode="wait">
                            {!isPlaying && !gameOver && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                >
                                    <Target className="w-20 h-20 text-reflex mb-6 animate-pulse-game" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Hit the Targets!</h2>
                                    <p className="text-gray-400 mb-6">Hit as many targets as possible in 30 seconds.</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START GAME
                                    </Button>
                                </motion.div>
                            )}

                            {gameOver && (
                                <motion.div
                                    key="gameover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm"
                                >
                                    <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                                    <div className="text-4xl font-bold text-white mb-2">GAME OVER!</div>
                                    <div className="text-7xl font-black text-reflex drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] mb-2">{score}</div>
                                    <p className="text-xl text-gray-400 mb-6">Targets Hit</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-10 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-5 h-5 mr-3" />
                                        PLAY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {isPlaying && (
                            <motion.button
                                key={score}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute w-16 h-16 bg-reflex rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)] border-3 border-white cursor-crosshair active:scale-95 z-20"
                                style={{ top: targetPos.top, left: targetPos.left }}
                                onMouseDown={handleHit}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.div>
                </div>

                <ToolContent
                    title="Grid Shot"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Click 'Start Game' to begin.",
                        "Targets will appear randomly on the screen.",
                        "Click each target as quickly as possible.",
                        "Each hit increases your score.",
                        "You have 30 seconds to hit as many targets as possible.",
                        "Try to beat your high score!"
                    ]}
                    benefits={[
                        "Improves hand-eye coordination.",
                        "Enhances reaction speed and accuracy.",
                        "Trains visual tracking abilities.",
                        "Develops rapid decision-making skills.",
                        "Useful for gaming and sports performance."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
