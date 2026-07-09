"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Circle, Square, Triangle, Hexagon, Star, Play, RotateCcw, Shapes } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const SHAPES = [
    { id: "circle", icon: Circle, color: "text-pink-500" },
    { id: "square", icon: Square, color: "text-blue-500" },
    { id: "triangle", icon: Triangle, color: "text-green-500" },
    { id: "hexagon", icon: Hexagon, color: "text-yellow-500" },
    { id: "star", icon: Star, color: "text-purple-500" },
];

export default function ShapeMemoryPageClient() {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [targetShape, setTargetShape] = useState<number>(0);
    const [grid, setGrid] = useState<number[]>([]);
    const { play } = useGameSound();

    const content = getToolContent("shape-memory", "Shape Rush");

    const generateGrid = () => {
        const target = Math.floor(Math.random() * SHAPES.length);
        setTargetShape(target);

        const newGrid = Array.from({ length: 25 }, () => Math.floor(Math.random() * SHAPES.length));

        let count = 0;
        const targetCount = Math.floor(Math.random() * 3) + 3;
        while (count < targetCount) {
            const r = Math.floor(Math.random() * 25);
            if (newGrid[r] !== target) {
                newGrid[r] = target;
                count++;
            }
        }
        setGrid(newGrid);
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setGameState("playing");
        generateGrid();
        play("start");
    };

    const handleShapeClick = (idx: number, shapeIdx: number) => {
        if (gameState !== "playing") return;

        if (shapeIdx === targetShape) {
            setScore(s => s + 50);
            play("success");
            const newGrid = [...grid];
            let replacement = Math.floor(Math.random() * SHAPES.length);
            while (replacement === targetShape) replacement = Math.floor(Math.random() * SHAPES.length);

            newGrid[idx] = replacement;
            setGrid(newGrid);

            if (!newGrid.includes(targetShape)) {
                setScore(s => s + 200);
                play("levelUp");
                generateGrid();
            }

        } else {
            setScore(s => Math.max(0, s - 100));
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

    const TargetIcon = SHAPES[targetShape].icon;
    const targetColor = SHAPES[targetShape].color;

    return (
        <GameBackground variant="memory" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-memory/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            Shape Rush
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Pattern Arena</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[140px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Target</div>
                                <TargetIcon className={`w-10 h-10 mx-auto ${targetColor} animate-pulse`} />
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-4xl font-bold text-memory">{score}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-memory/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <Shapes className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Find All Target Shapes</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Click all instances of the target shape before time runs out!</p>
                                    <Button
                                        variant="memory"
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
                                    <div className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]">
                                        TIME'S UP!
                                    </div>
                                    <div className="text-8xl font-black text-memory drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
                                        {score}
                                    </div>
                                    <p className="text-2xl text-gray-400">Points Scored</p>
                                    <Button
                                        variant="memory"
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
                                    className="w-full max-w-lg relative z-20"
                                >
                                    <div className="grid grid-cols-5 gap-3">
                                        {grid.map((shapeIdx, i) => {
                                            const Icon = SHAPES[shapeIdx].icon;
                                            const color = SHAPES[shapeIdx].color;
                                            return (
                                                <motion.button
                                                    key={i}
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.8 }}
                                                    className={`aspect-square rounded-2xl bg-white/5 border-2 border-white/10 hover:bg-white/10 flex items-center justify-center transition
                                                        ${shapeIdx === targetShape ? "hover:border-memory hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]" : "hover:border-red-500/50"}
                                                    `}
                                                    onClick={() => handleShapeClick(i, shapeIdx)}
                                                >
                                                    <Icon className={`w-8 h-8 md:w-10 md:h-10 ${color}`} />
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Shape Rush"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A specific 'Target Shape' is shown at the top of the screen.",
                        "A grid full of mixed shapes will appear.",
                        "Quickly find and click ALL instances of the target shape.",
                        "When you clear them, the grid refreshes with a new target.",
                        "Avoid clicking wrong shapes to prevent score penalties."
                    ]}
                    benefits={[
                        "Improves visual processing speed.",
                        "Trains selective attention.",
                        "Enhances pattern recognition in cluttered environments.",
                        "Develops rapid decision-making skills."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
