"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowBigDown, ArrowBigLeft, ArrowBigRight, ArrowBigUp, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function DirectionGame() {
    const content = getToolContent("directional-reflex", "Directional Reflex Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [direction, setDirection] = useState<"up" | "down" | "left" | "right">("up");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const { play } = useGameSound();

    // Prevent scrolling with arrows
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                handleInput(e.key.replace("Arrow", "").toLowerCase());
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [gameState, direction]);

    const newDirection = () => {
        const dirs = ["up", "down", "left", "right"] as const;
        const next = dirs[Math.floor(Math.random() * 4)];
        setDirection(next);
    };

    const startGame = () => {
        play("start");
        setScore(0);
        setTimeLeft(30);
        setGameState("playing");
        newDirection();
    };

    const handleInput = (dir: string) => {
        if (gameState !== "playing") return;
        if (dir === direction) {
            play("success");
            setScore(s => s + 1);
            newDirection();
        } else {
            play("error");
            setScore(s => Math.max(0, s - 1));
        }
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const t = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
            return () => clearInterval(t);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("gameover");
            play("levelUp");
        }
    }, [gameState, timeLeft]);

    const getIcon = () => {
        const iconClass = "w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]";
        switch (direction) {
            case "up": return <ArrowBigUp className={`${iconClass} animate-bounce`} />;
            case "down": return <ArrowBigDown className={`${iconClass} animate-bounce`} />;
            case "left": return <ArrowBigLeft className={`${iconClass} animate-pulse`} />;
            case "right": return <ArrowBigRight className={`${iconClass} animate-pulse`} />;
        }
    };

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
                            Directional Reflex
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Reflex Arena</p>
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

                    <div className="hud-frame w-full min-h-[500px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {gameState === "idle" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 relative z-20"
                            >
                                <div className="flex justify-center gap-4">
                                    <ArrowBigUp className="w-16 h-16 text-reflex" />
                                    <ArrowBigRight className="w-16 h-16 text-reflex" />
                                    <ArrowBigDown className="w-16 h-16 text-reflex" />
                                    <ArrowBigLeft className="w-16 h-16 text-reflex" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">Press the Correct Arrow Key</h2>
                                <p className="text-gray-400 max-w-md mx-auto">Match the arrow on screen as fast as you can. Score as many points in 30 seconds!</p>
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

                        {gameState === "gameover" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 relative z-20"
                            >
                                <div className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(168,85,247,0.6)]">
                                    TIME'S UP!
                                </div>
                                <div className="text-8xl font-black text-reflex drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]">
                                    {score}
                                </div>
                                <p className="text-2xl text-gray-400">Points Scored</p>
                                <Button
                                    variant="reflex"
                                    size="lg"
                                    onClick={startGame}
                                    className="text-xl px-12 py-6 rounded-2xl"
                                >
                                    <RotateCcw className="w-6 h-6 mr-3" />
                                    TRY AGAIN
                                </Button>
                            </motion.div>
                        )}

                        {gameState === "playing" && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="space-y-12 text-center relative z-20"
                            >
                                <div className="bg-black/40 p-12 rounded-full border-4 border-reflex/30">
                                    {getIcon()}
                                </div>

                                {/* Mobile Controls */}
                                <div className="grid grid-cols-3 gap-3 max-w-[280px] mx-auto md:hidden">
                                    <div />
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={() => handleInput("up")}
                                        aria-label="Move Up"
                                        className="rounded-xl"
                                    >
                                        <ArrowBigUp className="w-8 h-8" />
                                    </Button>
                                    <div />
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={() => handleInput("left")}
                                        aria-label="Move Left"
                                        className="rounded-xl"
                                    >
                                        <ArrowBigLeft className="w-8 h-8" />
                                    </Button>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={() => handleInput("down")}
                                        aria-label="Move Down"
                                        className="rounded-xl"
                                    >
                                        <ArrowBigDown className="w-8 h-8" />
                                    </Button>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={() => handleInput("right")}
                                        aria-label="Move Right"
                                        className="rounded-xl"
                                    >
                                        <ArrowBigRight className="w-8 h-8" />
                                    </Button>
                                </div>

                                <p className="hidden md:block text-gray-400 text-lg">Use Arrow Keys on your keyboard</p>
                            </motion.div>
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Directional Reflex Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Arrows appear on screen (Up, Down, Left, Right).",
                        "Press the corresponding Arrow Key on your keyboard.",
                        "Mobile users can use the on-screen buttons.",
                        "Score as many points as possible in 30 seconds."
                    ]}
                    benefits={[
                        "Improves choice reaction time.",
                        "Strengthens hand-eye coordination.",
                        "Train's WASD/Arrow key muscle memory.",
                        "Enhances cognitive processing speed."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
