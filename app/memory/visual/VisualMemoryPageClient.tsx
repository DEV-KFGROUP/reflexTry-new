"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Play, RotateCcw, Brain, Heart, AlertTriangle } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function VisualMemoryPageClient() {
    const content = getToolContent("visual-memory", "Visual Memory");
    const [level, setLevel] = useState(1);
    const [gridSize, setGridSize] = useState(3);
    const [pattern, setPattern] = useState<number[]>([]);
    const [userPattern, setUserPattern] = useState<number[]>([]);
    const [gameState, setGameState] = useState<"idle" | "memorize" | "input" | "result">("idle");
    const [lives, setLives] = useState(3);
    const { play } = useGameSound();

    const generateLevel = (lvl: number) => {
        // Simple difficulty scaling
        const size = lvl < 3 ? 3 : lvl < 6 ? 4 : lvl < 9 ? 5 : 6;
        const tilesCount = size + Math.floor(lvl / 2);

        setGridSize(size);

        const newPattern: number[] = [];
        while (newPattern.length < tilesCount) {
            const r = Math.floor(Math.random() * (size * size));
            if (!newPattern.includes(r)) newPattern.push(r);
        }
        setPattern(newPattern);
        setUserPattern([]);
        setGameState("memorize");
        play("start");

        setTimeout(() => {
            setGameState("input");
            play("tick");
        }, 1000 + (tilesCount * 300)); // Time to memorize
    };

    const startGame = () => {
        setLevel(1);
        setLives(3);
        generateLevel(1);
    };

    const handleTileClick = (idx: number) => {
        if (gameState !== "input") return;

        // If already clicked
        if (userPattern.includes(idx)) return;

        if (pattern.includes(idx)) {
            // Correct click
            play("click");
            const newUserPattern = [...userPattern, idx];
            setUserPattern(newUserPattern);

            if (newUserPattern.length === pattern.length) {
                // All found
                play("success");
                setTimeout(() => {
                    play("levelUp");
                    setLevel(l => l + 1);
                    generateLevel(level + 1);
                }, 500);
            }
        } else {
            // Wrong click
            play("error");
            setLives(l => l - 1);

            if (lives <= 1) {
                setGameState("result");
            }
        }
    };

    return (
        <GameBackground variant="memory" showParticles={true} showGrid={true} className="min-h-screen pb-12">
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
                            Visual Arena
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Spatial Memory Test</p>
                    </div>

                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Level</div>
                            <div className="text-4xl font-bold text-white">{level}</div>
                        </div>
                        <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Lives</div>
                            <div className="flex justify-center gap-1 mt-2">
                                {[...Array(3)].map((_, i) => (
                                    <Heart
                                        key={i}
                                        className={`w-6 h-6 ${i < lives ? "fill-red-500 text-red-500" : "fill-transparent text-gray-700"}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-3xl aspect-square md:aspect-video flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-memory/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full h-full rounded-[3rem] p-8 md:p-12 flex flex-col relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        <div className="relative z-20 w-full h-full flex items-center justify-center">
                            {gameState === "idle" && (
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-center space-y-6"
                                >
                                    <Brain className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Retain Visual Patterns</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Memorize the highlighted tiles. Replicate the pattern when the grid clears.</p>
                                    <Button
                                        variant="memory"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        INITIATE SCAN
                                    </Button>
                                </motion.div>
                            )}

                            {(gameState === "memorize" || gameState === "input") && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid gap-3 bg-black/40 p-4 rounded-2xl border border-white/5 backdrop-blur-md"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
                                    }}
                                >
                                    {Array.from({ length: gridSize * gridSize }).map((_, i) => {
                                        const isActive = pattern.includes(i);
                                        const isUserCorrect = userPattern.includes(i);
                                        const isMissed = gameState === "input" && !isUserCorrect && isActive && lives < 3; // Optional hint logic could go here

                                        let bgClass = "bg-white/5 border border-white/5"; // default empty tile

                                        if (gameState === "memorize" && isActive) {
                                            bgClass = "bg-white shadow-[0_0_20px_white]";
                                        } else if (gameState === "input") {
                                            if (isUserCorrect) {
                                                bgClass = "bg-memory shadow-[0_0_20px_var(--color-memory)] border-memory";
                                            } else if (userPattern.includes(i) && !isActive) {
                                                // Wrong click feedback (momentary, usually handled by checking pattern before setting state)
                                                // logic in handleTileClick handles "wrong click" sound/lives, but visual feedback requires state tracking or simple animation
                                            }
                                        }

                                        return (
                                            <motion.div
                                                key={i}
                                                onClick={() => handleTileClick(i)}
                                                className={`
                                                    w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl cursor-pointer 
                                                    transition-all duration-200 relative overflow-hidden
                                                    ${bgClass}
                                                    hover:bg-white/10
                                                `}
                                                whileTap={{ scale: 0.9 }}
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                {/* Scanline effect for tiles */}
                                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20 opacity-50 pointer-events-none" />
                                            </motion.div>
                                        );
                                    })}
                                </motion.div>
                            )}

                            {gameState === "result" && (
                                <motion.div
                                    initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                                    animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
                                    className="absolute inset-0 z-50 rounded-[3rem] bg-black/60 flex flex-col items-center justify-center text-center p-8"
                                >
                                    <div className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                                        SYSTEM FAILURE
                                    </div>
                                    <div className="text-2xl text-gray-300 mb-8">
                                        Pattern Lost at Level <span className="text-memory font-bold">{level}</span>
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
                </div>

                <ToolContent
                    title="Visual Memory"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Improves spatial memory capacity.",
                        "Enhances pattern recognition speeds.",
                        "Trains observation skills.",
                        "Useful for navigation and remembering locations.",
                        "Fun cognitive workout."
                    ]}
                    howToPlay={[
                        "A grid of tiles will flash white.",
                        "Memorize the pattern of the white tiles.",
                        "When they reset, click the tiles that were highlighted.",
                        "Complete the pattern to advance to harder levels.",
                        "You have 3 lives. Good luck!"
                    ]}
                />
            </div>
        </GameBackground>
    );
}
