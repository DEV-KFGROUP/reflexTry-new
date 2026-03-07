"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Shield, Sword, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";

export default function RPGReactionClient() {
    const content = getToolContent("rpg-reaction", "RPG Reaction Test");
    const [gameState, setGameState] = useState<"idle" | "waiting" | "attack" | "blocked" | "hit" | "tooEarly">("idle");
    const [reactionTime, setReactionTime] = useState(0);
    const [startTime, setStartTime] = useState(0);
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [totalReactionTime, setTotalReactionTime] = useState(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { play } = useGameSound();

    const startRound = () => {
        setGameState("waiting");
        const delay = Math.random() * 2000 + 1500;

        timeoutRef.current = setTimeout(() => {
            setGameState("attack");
            setStartTime(Date.now());
        }, delay);
    };

    const startGame = () => {
        setScore(0);
        setRound(0);
        setTotalReactionTime(0);
        play("start");
        startRound();
    };

    const handleBlock = () => {
        if (gameState === "attack") {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setTotalReactionTime(prev => prev + time);
            setRound(r => r + 1);

            // Score based on reaction time
            const bonus = time < 200 ? 150 : time < 300 ? 100 : time < 400 ? 75 : 50;
            setScore(s => s + bonus);
            setGameState("blocked");
            play("success");
        } else if (gameState === "waiting") {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            setGameState("tooEarly");
            play("error");
        }
    };

    const averageTime = round > 0 ? Math.round(totalReactionTime / round) : 0;

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
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-red-500/20 to-yellow-500/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">
                            Hero&apos;s Reflex
                        </h1>
                        <p className="text-xl text-yellow-400/80 font-medium tracking-wide mt-2 uppercase">Block the Attack!</p>
                    </div>

                    {(gameState !== "idle") && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-yellow-500/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Round</div>
                                <div className="text-3xl font-bold text-white">{round}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-yellow-500/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-yellow-400">{score}</div>
                            </div>
                            {averageTime > 0 && (
                                <div className="text-center p-4 glass rounded-xl border-yellow-500/30 min-w-[100px]">
                                    <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Avg</div>
                                    <div className="text-3xl font-bold text-white">{averageTime}ms</div>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-red-500/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div
                        className="w-full h-[450px] rounded-[3rem] relative overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl cursor-pointer active:scale-[0.99] transition-transform bg-gradient-to-br from-gray-900 to-gray-950"
                        onMouseDown={handleBlock}
                    >
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {/* Decorative background */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-800/50 to-gray-950 -z-10" />

                        <AnimatePresence mode="wait">
                            {gameState === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20"
                                >
                                    <Shield className="w-20 h-20 text-blue-400 mb-6 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Defend Against Attacks!</h2>
                                    <p className="text-gray-400 mb-6 max-w-sm text-center">Click to block when the sword appears. Don&apos;t click too early!</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        ENTER ARENA
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "waiting" && (
                                <motion.div
                                    key="waiting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center z-20"
                                >
                                    <div className="text-gray-500 text-3xl font-bold animate-pulse">
                                        Wait for it...
                                    </div>
                                </motion.div>
                            )}

                            {gameState === "attack" && (
                                <motion.div
                                    key="attack"
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1.2, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex items-center justify-center z-20"
                                >
                                    <Sword className="w-48 h-48 text-red-500 drop-shadow-[0_0_50px_rgba(239,68,68,0.8)] animate-pulse" />
                                </motion.div>
                            )}

                            {gameState === "blocked" && (
                                <motion.div
                                    key="blocked"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4"
                                >
                                    <Shield className="w-24 h-24 text-blue-400 drop-shadow-[0_0_40px_rgba(96,165,250,0.8)]" />
                                    <div className="text-4xl font-bold text-white">BLOCKED!</div>
                                    <div className="text-5xl font-black text-blue-400 drop-shadow-[0_0_20px_rgba(96,165,250,0.5)]">{reactionTime}ms</div>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={(e) => { e.stopPropagation(); startRound(); }}
                                        className="mt-4"
                                    >
                                        NEXT ROUND
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "tooEarly" && (
                                <motion.div
                                    key="tooEarly"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 space-y-4 bg-red-900/20"
                                >
                                    <div className="text-4xl font-bold text-red-400">TOO EARLY!</div>
                                    <p className="text-gray-400">Wait for the attack to appear</p>
                                    <div className="flex gap-4 mt-4">
                                        <Button
                                            variant="reflex"
                                            onClick={(e) => { e.stopPropagation(); startRound(); }}
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Try Again
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Hero's Reflex"
                    description={content?.description || "Test your defensive reflexes in this RPG-style reaction game."}
                    howToUse={content?.howToUse || []}
                    howToImprove={content?.howToImprove || []}
                    howToPlay={[
                        "Click 'Enter Arena' to start the game.",
                        "Wait for the sword to appear on screen.",
                        "Click anywhere to block when you see the attack.",
                        "Don't click too early or you'll fail!",
                        "Faster blocks earn more points.",
                        "Try to maintain a low average reaction time."
                    ]}
                    benefits={[
                        "Improves defensive reaction time.",
                        "Enhances timing and anticipation.",
                        "Trains impulse control (waiting for the right moment).",
                        "Fun RPG-themed reflex training.",
                        "Useful for gaming scenarios requiring quick blocks."
                    ]}
                    faqs={content?.faqs || []}
                    relatedTools={content?.relatedTools || []}
                />
            </div>
        </GameBackground>
    );
}
