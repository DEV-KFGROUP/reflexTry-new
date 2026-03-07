"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Crosshair, Play, RotateCcw, Trophy, Eye } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function PeripheralGame() {
    const content = getToolContent("peripheral-vision", "Peripheral Vision Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [targetPos, setTargetPos] = useState({ top: "50%", left: "50%" });
    const { play } = useGameSound();

    const moveTarget = () => {
        const top = Math.random() * 70 + 15;
        const left = Math.random() * 70 + 15;
        setTargetPos({ top: `${top}%`, left: `${left}%` });
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameState("playing");
        moveTarget();
        play("start");
    };

    const handleTargetClick = () => {
        setScore(s => s + 1);
        play("success");
        moveTarget();
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(t);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("gameover");
            play("levelUp");
        }
    }, [gameState, timeLeft, play]);

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
                            Peripheral Vision
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Side Vision Test</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-4xl font-bold text-reflex">{score}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="w-full h-[500px] rounded-[3rem] relative overflow-hidden cursor-crosshair backdrop-blur-xl border border-white/10 shadow-2xl bg-black/60">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {/* Center Fixation Point */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                            <Crosshair className="w-12 h-12 text-red-500 opacity-70 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        </div>

                        <AnimatePresence mode="wait">
                            {gameState === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                >
                                    <Eye className="w-20 h-20 text-reflex mb-6 animate-pulse-game" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Keep Eyes on the Center!</h2>
                                    <p className="text-gray-400 mb-6 max-w-sm text-center">Stare at the red crosshair and use your peripheral vision to spot the targets.</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START TEST
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "gameover" && (
                                <motion.div
                                    key="gameover"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm"
                                >
                                    <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                                    <div className="text-4xl font-bold text-white mb-2">FINISHED!</div>
                                    <div className="text-7xl font-black text-reflex drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] mb-4">{score}</div>
                                    <p className="text-xl text-gray-400 mb-6">Targets Hit</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-10 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-5 h-5 mr-3" />
                                        TRY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {gameState === "playing" && (
                            <motion.button
                                key={score}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute w-14 h-14 bg-reflex rounded-full shadow-[0_0_30px_rgba(168,85,247,0.8)] border-2 border-white/50 cursor-pointer hover:bg-white transition-colors z-20"
                                style={{ top: targetPos.top, left: targetPos.left }}
                                onClick={handleTargetClick}
                            />
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Peripheral Vision Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Stare at the red crosshair in the center of the screen.",
                        "DO NOT move your eyes from the center.",
                        "Use your side vision to spot the appearing cyan dots.",
                        "Click the dots as fast as you can.",
                        "Ideally, trust your mouse hand to snap to the target without looking directly at it."
                    ]}
                    benefits={[
                        "Expands functional field of view.",
                        "Crucial for FPS gamers (spotting enemies).",
                        "Important for driving safety.",
                        "Improves total visual awareness."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
