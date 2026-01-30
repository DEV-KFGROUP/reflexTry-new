"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useGameEngine } from "@/lib/gaming/engine";
import { SoundManager } from "@/utils/soundManager";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { Target, Play, RotateCcw, Trophy, Pause } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function AimTrainerClient() {
    const content = getToolContent("aim-trainer", "Aim Trainer");
    const engine = useGameEngine();
    const controls = useAnimation();
    const containerRef = useRef<HTMLDivElement>(null);
    const isPlaying = engine.gameState === 'PLAYING';
    const startTimeRef = useRef<number>(0);
    const requestRef = useRef<number>(0);

    // Timer Loop
    const animate = (time: number) => {
        if (engine.gameState === 'PLAYING') {
            const elapsed = time - startTimeRef.current;
            engine.updateTime(elapsed);
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        if (engine.gameState === 'PLAYING') {
            startTimeRef.current = performance.now() - engine.stats.timeElapsed;
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [engine.gameState]);

    // Clean up on unmount
    useEffect(() => {
        return () => engine.resetGame();
    }, []);

    // Game Loop for moving target
    useEffect(() => {
        if (isPlaying) {
            moveTarget();

            const loopMove = async () => {
                if (engine.gameState !== 'PLAYING') return;
                await moveTarget(0.8);
                if (engine.gameState === 'PLAYING') loopMove();
            };
            loopMove();
        } else {
            controls.stop();
        }
    }, [isPlaying, engine.gameState]);

    const moveTarget = async (duration?: number) => {
        if (!containerRef.current) return;
        const x = Math.random() * (containerRef.current.offsetWidth - 60);
        const y = Math.random() * (containerRef.current.offsetHeight - 60);

        await controls.start({
            x,
            y,
            transition: {
                duration: duration || Math.random() * 0.5 + 0.3,
                ease: duration ? "easeInOut" : "linear"
            }
        });
    };

    const handleHit = () => {
        if (!isPlaying) return;

        SoundManager.play("hit");
        engine.addScore(100);
        engine.registerHit();
        moveTarget(0.1);
    };

    const handleMiss = (e: React.MouseEvent) => {
        if (!isPlaying) return;
        if ((e.target as HTMLElement).classList.contains('target-ball')) return;

        SoundManager.play("miss");
        engine.addScore(-50);
        engine.registerMiss();
    };

    const startGame = () => {
        engine.startGame({ duration: 30000, mode: 'standard' });
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
                            Dynamic Aim Trainer
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Precision Training</p>
                    </div>

                    {(engine.gameState === 'PLAYING' || engine.gameState === 'PAUSED' || engine.gameState === 'COMPLETED') && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-reflex">{engine.stats.score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-3xl font-bold text-white">{Math.round(engine.stats.accuracy)}%</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-3xl font-bold text-white">{((engine.stats.timeElapsed) / 1000).toFixed(1)}s</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="w-full aspect-video relative rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-black/40">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none" />

                        <AnimatePresence mode="wait">
                            {engine.gameState === 'IDLE' && (
                                <motion.div
                                    key="idle"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                >
                                    <Target className="w-20 h-20 text-reflex mb-6 animate-pulse-game" />
                                    <h2 className="text-2xl font-bold text-white mb-4">Hit the Targets!</h2>
                                    <p className="text-gray-400 mb-6 max-w-sm text-center">Click the red target to score. Don&apos;t miss!</p>
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

                            {engine.gameState === 'COMPLETED' && (
                                <motion.div
                                    key="completed"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm"
                                >
                                    <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                                    <div className="text-4xl font-bold text-white mb-2">TEST COMPLETE!</div>
                                    <div className="grid grid-cols-2 gap-6 my-6">
                                        <div className="glass rounded-xl p-4 text-center">
                                            <div className="text-sm text-gray-400 uppercase mb-1">Score</div>
                                            <div className="text-4xl font-bold text-reflex">{engine.stats.score}</div>
                                        </div>
                                        <div className="glass rounded-xl p-4 text-center">
                                            <div className="text-sm text-gray-400 uppercase mb-1">Accuracy</div>
                                            <div className="text-4xl font-bold text-white">{Math.round(engine.stats.accuracy)}%</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="reflex" size="lg" onClick={engine.resetGame}>
                                            <RotateCcw className="w-5 h-5 mr-2" />
                                            Play Again
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {engine.gameState === 'PAUSED' && (
                                <motion.div
                                    key="paused"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                >
                                    <Pause className="w-16 h-16 text-white mb-4" />
                                    <div className="text-3xl font-bold text-white mb-6">PAUSED</div>
                                    <Button variant="reflex" size="lg" onClick={engine.resumeGame}>
                                        <Play className="w-5 h-5 mr-2 fill-current" />
                                        Resume
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Game Content */}
                        <div
                            ref={containerRef}
                            className={`w-full h-full cursor-crosshair relative transition-opacity duration-300 ${engine.gameState !== 'PLAYING' && engine.gameState !== 'PAUSED' ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}
                            onMouseDown={handleMiss}
                        >
                            {isPlaying && (
                                <motion.button
                                    animate={controls}
                                    initial={{ x: "50%", y: "50%" }}
                                    onMouseDown={handleHit}
                                    className="target-ball absolute w-14 h-14 rounded-full bg-red-500 border-4 border-white shadow-[0_0_30px_rgba(239,68,68,0.8)] cursor-pointer outline-none focus:outline-none"
                                    whileTap={{ scale: 0.9 }}
                                />
                            )}
                        </div>

                        {/* Pause button during gameplay */}
                        {engine.gameState === 'PLAYING' && (
                            <button
                                onClick={engine.pauseGame}
                                className="absolute top-4 right-4 z-30 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <Pause className="w-5 h-5 text-white" />
                            </button>
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Dynamic Aim Trainer"
                    description={content?.description || "Train your aim with moving targets. Improve your accuracy and reaction speed."}
                    howToUse={content?.howToUse || []}
                    howToImprove={content?.howToImprove || []}
                    howToPlay={[
                        "Click 'Start Game' to begin the 30-second test.",
                        "A red target will appear and move around the screen.",
                        "Click the target as quickly as possible.",
                        "Each hit gives you +100 points.",
                        "Missing the target (clicking the background) costs -50 points.",
                        "Try to maximize your score while maintaining high accuracy."
                    ]}
                    benefits={[
                        "Improves hand-eye coordination.",
                        "Enhances mouse precision and control.",
                        "Trains visual tracking of moving objects.",
                        "Develops quick decision-making skills.",
                        "Essential training for FPS gamers."
                    ]}
                    faqs={content?.faqs || []}
                    relatedTools={content?.relatedTools || []}
                />
            </div>
        </GameBackground>
    );
}
