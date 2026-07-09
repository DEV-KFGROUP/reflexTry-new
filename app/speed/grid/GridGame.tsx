"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Grid3X3, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function GridSpeedGame() {
    const content = getToolContent("grid-selection", "Grid Selection Speed");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [timeLeft, setTimeLeft] = useState(30);
    const [score, setScore] = useState(0);
    const [grid, setGrid] = useState<boolean[]>([]);
    const { play } = useGameSound();

    const generateLevel = () => {
        const size = 5;
        const total = size * size;
        const targetCount = 5 + Math.floor(Math.random() * 5);

        const newGrid = new Array(total).fill(false);
        let placed = 0;

        while (placed < targetCount) {
            const idx = Math.floor(Math.random() * total);
            if (!newGrid[idx]) {
                newGrid[idx] = true;
                placed++;
            }
        }
        setGrid(newGrid);
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(30);
        setGameState("playing");
        generateLevel();
        play("start");
    };

    const handleCellClick = (isTarget: boolean, index: number) => {
        if (gameState !== "playing") return;

        if (isTarget) {
            setScore(s => s + 10);
            play("success");
            const newGrid = [...grid];
            newGrid[index] = false;
            setGrid(newGrid);

            if (!newGrid.some(x => x)) {
                setScore(s => s + 50);
                play("levelUp");
                generateLevel();
            }
        } else {
            setScore(s => Math.max(0, s - 20));
            play("error");
        }
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && gameState === "playing") {
            setGameState("gameover");
            play("levelUp");
        }
    }, [gameState, timeLeft, play]);

    return (
        <GameBackground variant="speed" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-speed/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-speed via-white to-speed bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                            Grid Selection
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Speed Arena</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-4xl font-bold text-speed">{score}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-speed/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full min-h-[500px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        <AnimatePresence mode="wait">
                            {gameState === "idle" && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Grid3X3 className="w-24 h-24 text-speed mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Click All Highlighted Cells</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Find and click all the lit cells as fast as possible!</p>
                                    <Button
                                        variant="speed"
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
                                    key="gameover"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
                                    <div className="text-5xl md:text-6xl font-black text-white">TIME'S UP!</div>
                                    <div className="text-8xl font-black text-speed drop-shadow-[0_0_30px_rgba(0,229,255,0.8)]">
                                        {score}
                                    </div>
                                    <p className="text-2xl text-gray-400">Points Scored</p>
                                    <Button
                                        variant="speed"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-6 h-6 mr-3" />
                                        PLAY AGAIN
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "playing" && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative z-20"
                                >
                                    <div className="grid grid-cols-5 gap-3">
                                        {grid.map((isTarget, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ scale: 1 }}
                                                whileTap={{ scale: 0.9 }}
                                                whileHover={{ scale: 1.05 }}
                                                onClick={() => handleCellClick(isTarget, i)}
                                                className={`w-14 h-14 sm:w-18 sm:h-18 md:w-20 md:h-20 rounded-xl cursor-pointer transition duration-100 
                                                    ${isTarget
                                                        ? "bg-speed hover:bg-speed/80 shadow-[0_0_20px_rgba(0,229,255,0.6)] border-2 border-white/30"
                                                        : "bg-white/5 hover:bg-white/10 border border-white/10"
                                                    }
                                                `}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Grid Selection Speed"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A grid of cells will appear.",
                        "Click all the LIGHT UP (colored) cells.",
                        "Ignore the empty cells.",
                        "Clear the board to proceed to the next wave.",
                        "Be careful not to misclick!"
                    ]}
                    benefits={[
                        "Enhances visual search speed.",
                        "Improves precise mouse control.",
                        "Trains peripheral awareness.",
                        "Boosts reaction time to visual stimuli."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
