"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Target, Trophy, MousePointer2, Play, RotateCcw } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface TargetItem {
    id: number;
    x: number;
    y: number;
    size: number;
    appearedAt: number;
}

export default function PrecisionClickGame() {
    const content = getToolContent("precision-click", "Precision Clicking Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "result">("idle");
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [targets, setTargets] = useState<TargetItem[]>([]);
    const [timeLeft, setTimeLeft] = useState(30);
    const [targetSize, setTargetSize] = useState(60);
    const containerRef = useRef<HTMLDivElement>(null);
    const { play } = useGameSound();

    const generateTarget = (): TargetItem => {
        if (!containerRef.current) {
            return { id: Date.now(), x: 50, y: 50, size: targetSize, appearedAt: Date.now() };
        }

        const container = containerRef.current;
        const padding = targetSize;
        const x = Math.random() * (container.clientWidth - padding * 2) + padding;
        const y = Math.random() * (container.clientHeight - padding * 2) + padding;

        return {
            id: Date.now(),
            x,
            y,
            size: targetSize,
            appearedAt: Date.now()
        };
    };

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setMisses(0);
        setTimeLeft(30);
        setTargetSize(60);
        setTargets([]);
        play("start");

        setTimeout(() => {
            setTargets([generateTarget()]);
        }, 500);
    };

    const handleTargetClick = (targetId: number) => {
        if (gameState !== "playing") return;

        const target = targets.find(t => t.id === targetId);
        if (target) {
            setScore(s => s + 1);
            play("success");
            setTargets(prev => prev.filter(t => t.id !== targetId));

            setTimeout(() => {
                if (gameState === "playing") {
                    const newTarget = generateTarget();
                    setTargets(prev => [...prev, newTarget]);

                    if (score > 0 && score % 5 === 0) {
                        setTargetSize(prev => Math.max(30, prev - 5));
                    }
                }
            }, 300);
        }
    };

    const handleMiss = () => {
        if (gameState !== "playing") return;
        setMisses(m => m + 1);
        play("error");
    };

    useEffect(() => {
        if (gameState === "playing" && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft(t => {
                    if (t <= 1) {
                        setGameState("result");
                        play("levelUp");
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [gameState, timeLeft, play]);

    useEffect(() => {
        if (gameState === "playing") {
            const checkInterval = setInterval(() => {
                setTargets(prev => {
                    const now = Date.now();
                    return prev.filter(t => {
                        if (now - t.appearedAt > 2000) {
                            setMisses(m => m + 1);
                            return false;
                        }
                        return true;
                    });
                });
            }, 100);
            return () => clearInterval(checkInterval);
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState === "playing" && targets.length < 3) {
            const generateInterval = setInterval(() => {
                if (targets.length < 3) {
                    setTargets(prev => [...prev, generateTarget()]);
                }
            }, 1500);
            return () => clearInterval(generateInterval);
        }
    }, [gameState, targets.length, targetSize]);

    const accuracy = score + misses > 0 ? Math.round((score / (score + misses)) * 100) : 0;
    const clicksPerSecond = (30 - timeLeft) > 0 ? score / (30 - timeLeft) : 0;

    return (
        <GameBackground variant="accuracy" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-accuracy/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-accuracy via-white to-accuracy bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,230,118,0.5)]">
                            Precision Click
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">Accuracy Arena</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-3xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-accuracy">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Misses</div>
                                <div className="text-3xl font-bold text-red-400">{misses}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-3xl font-bold text-white">{accuracy}%</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-accuracy/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <MousePointer2 className="w-24 h-24 text-accuracy mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Hand-Eye Coordination</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Click the targets as they appear. They get smaller as you progress!</p>
                                    <Button
                                        variant="accuracy"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START GAME
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "playing" && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="w-full h-full relative z-20"
                                >
                                    <div
                                        ref={containerRef}
                                        onClick={handleMiss}
                                        className="relative w-full h-[400px] bg-black/20 rounded-2xl overflow-hidden cursor-crosshair"
                                    >
                                        {targets.map((target) => (
                                            <motion.div
                                                key={target.id}
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0, opacity: 0 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleTargetClick(target.id);
                                                }}
                                                className="absolute cursor-pointer"
                                                style={{
                                                    left: `${target.x}px`,
                                                    top: `${target.y}px`,
                                                    width: `${target.size}px`,
                                                    height: `${target.size}px`,
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <div className="w-full h-full rounded-full bg-gradient-to-br from-accuracy to-speed border-4 border-white shadow-[0_0_20px_rgba(0,230,118,0.5)] flex items-center justify-center">
                                                    <Target className="w-1/2 h-1/2 text-white" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <p className="text-center text-gray-400 mt-4">
                                        Target Size: {targetSize}px | Clicks/sec: {clicksPerSecond.toFixed(1)}
                                    </p>
                                </motion.div>
                            )}

                            {gameState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
                                    <div className="text-5xl md:text-6xl font-black text-white">TIME'S UP!</div>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Final Score</div>
                                            <div className="text-4xl font-bold text-accuracy">{score}</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
                                            <div className="text-4xl font-bold text-white">{accuracy}%</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Clicks/sec</div>
                                            <div className="text-4xl font-bold text-white">{clicksPerSecond.toFixed(2)}</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Misses</div>
                                            <div className="text-4xl font-bold text-red-400">{misses}</div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="accuracy"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-6 h-6 mr-3" />
                                        PLAY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Precision Clicking Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Click 'Start Game' to begin the 30-second test.",
                        "Small targets will appear randomly on screen.",
                        "Click each target accurately before it disappears.",
                        "Targets get smaller as your score increases.",
                        "Avoid clicking outside targets (counts as a miss).",
                        "Try to achieve the highest accuracy percentage."
                    ]}
                    benefits={[
                        "Improves hand-eye coordination and mouse control.",
                        "Enhances precision clicking accuracy.",
                        "Develops visual tracking and target acquisition skills.",
                        "Useful for gaming, design work, and data entry.",
                        "Trains fine motor control and precision."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
