"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Crosshair, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface Target {
    id: number;
    x: number;
    y: number;
    size: number;
    createdAt: number;
    lifetime: number;
}

const GAME_DURATION = 30;

export default function FlickShotGame() {
    const content = getToolContent("flick-shot", "Flick Shot");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [targets, setTargets] = useState<Target[]>([]);
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [bestScore, setBestScore] = useState(0);
    const targetIdRef = useRef(0);
    const areaRef = useRef<HTMLDivElement>(null);

    // Timer
    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setPhase("result");
                    play("success");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [phase, play]);

    // Spawn targets
    useEffect(() => {
        if (phase !== "playing") return;
        const spawnRate = Math.max(300, 800 - score * 15);
        const lifetime = Math.max(600, 1500 - score * 30);

        const spawn = () => {
            targetIdRef.current += 1;
            const size = Math.max(24, 50 - score);
            setTargets(prev => [
                ...prev.filter(t => Date.now() - t.createdAt < t.lifetime),
                {
                    id: targetIdRef.current,
                    x: 5 + Math.random() * 85,
                    y: 5 + Math.random() * 85,
                    size,
                    createdAt: Date.now(),
                    lifetime,
                },
            ]);
        };

        spawn();
        const t = setInterval(spawn, spawnRate);
        return () => clearInterval(t);
    }, [phase, score]);

    // Remove expired
    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => {
            setTargets(prev => {
                const now = Date.now();
                const expired = prev.filter(t => now - t.createdAt >= t.lifetime);
                if (expired.length > 0) setMisses(m => m + expired.length);
                return prev.filter(t => now - t.createdAt < t.lifetime);
            });
        }, 100);
        return () => clearInterval(t);
    }, [phase]);

    const startGame = useCallback(() => {
        setScore(0);
        setMisses(0);
        setTimeLeft(GAME_DURATION);
        setTargets([]);
        targetIdRef.current = 0;
        setPhase("playing");
        play("start");
    }, [play]);

    const hitTarget = useCallback((id: number) => {
        setTargets(prev => prev.filter(t => t.id !== id));
        setScore(s => s + 1);
        play("click");
    }, [play]);

    const handleMiss = useCallback(() => {
        // Click on empty area counts as miss
        if (phase === "playing") {
            setMisses(m => m + 1);
        }
    }, [phase]);

    useEffect(() => {
        if (phase === "result") {
            setBestScore(prev => Math.max(prev, score));
        }
    }, [phase, score]);

    return (
        <GameBackground variant="gaming" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-wisdom/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-wisdom via-white to-wisdom bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                            Flick Shot
                        </h1>
                        <p className="text-xl text-wisdom/80 font-medium tracking-wide mt-2 uppercase">Quick Aim Trainer</p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full max-w-4xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[520px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Hits</div>
                                    <div className="text-4xl font-mono font-bold text-white">{score}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{timeLeft}s</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Accuracy</div>
                                    <div className="text-4xl font-mono font-bold text-white">{score + misses > 0 ? Math.round(score / (score + misses) * 100) : 100}%</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Crosshair className="w-16 h-16 text-wisdom mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Flick Shot</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Targets appear briefly at random positions. Snap to them quickly! Targets get smaller and faster as you score.</p>
                                <Button variant="game" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div
                                ref={areaRef}
                                onClick={handleMiss}
                                className="relative w-full h-[400px] mt-16 z-10 cursor-crosshair"
                            >
                                <AnimatePresence>
                                    {targets.map(target => (
                                        <motion.button
                                            key={target.id}
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                            onClick={(e) => { e.stopPropagation(); hitTarget(target.id); }}
                                            className="absolute rounded-full bg-gradient-to-br from-red-500 to-red-700 border-2 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:from-red-400 hover:to-red-600 active:scale-90 transition-transform cursor-crosshair"
                                            style={{
                                                left: `${target.x}%`,
                                                top: `${target.y}%`,
                                                width: target.size,
                                                height: target.size,
                                                transform: 'translate(-50%, -50%)',
                                            }}
                                        >
                                            <div className="absolute inset-1 rounded-full border border-red-300/30" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                            </div>
                                        </motion.button>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-wisdom/30"
                            >
                                <Trophy className="w-12 h-12 text-wisdom mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Time&apos;s Up!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {score} <span className="text-2xl text-wisdom">hits</span>
                                </div>
                                <p className="text-gray-400 mb-2">Accuracy: <span className="text-white font-bold">{score + misses > 0 ? Math.round(score / (score + misses) * 100) : 0}%</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best: {bestScore} hits</p>
                                <Button variant="game" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Flick Shot Aim Trainer"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Trains flick aim for FPS games.",
                        "Improves snap-targeting speed.",
                        "Progressive difficulty curve.",
                        "Tests precision under pressure.",
                        "Great for competitive gamers."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin the 30-second challenge.",
                        "Red targets appear at random positions.",
                        "Click them before they disappear!",
                        "Targets get smaller and faster as you score.",
                        "Missed clicks count against your accuracy."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
