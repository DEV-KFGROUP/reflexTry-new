"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { MousePointer, Play, RotateCcw, Clock, Trophy, Zap, AlertTriangle, Target } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function ClickGame() {
    const content = getToolContent("click-speed", "CPS Test");
    const [isPlaying, setIsPlaying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [score, setScore] = useState(0);
    const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
    const [gameMode, setGameMode] = useState<"standard" | "jitter" | "butterfly">("standard");
    const [testDuration, setTestDuration] = useState(5);
    const clickAreaRef = useRef<HTMLDivElement>(null);
    const { play } = useGameSound();

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 0.1) {
                        setIsPlaying(false);
                        play("success");
                        return 0;
                    }
                    return t - 0.1;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying, timeLeft, play]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(testDuration);
        setIsPlaying(true);
        setClicks([]);
        play("start");
    };

    const handleClick = (e: React.MouseEvent) => {
        if (!isPlaying) return;

        setScore((s) => s + 1);
        play("click"); // Crisp mechanical click

        // Visual feedback logic
        if (clickAreaRef.current) {
            const rect = clickAreaRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            setClicks(prev => [...prev, { id: Date.now(), x, y }].slice(-10)); // Keep last 10 clicks
        }
    };

    // Calculate CPS
    const cps = (score / (testDuration - timeLeft)).toFixed(1);
    const finalExceededTime = timeLeft <= 0;

    return (
        <GameBackground variant="speed" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-speed/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-speed via-white to-speed bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            Speed Arena
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">CPS Test</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mt-8">
                        {[1, 5, 10, 30].map(duration => (
                            <button
                                key={duration}
                                onClick={() => setTestDuration(duration)}
                                className={`
                                    px-6 py-2 rounded-lg font-bold border-2 transition duration-200
                                    ${testDuration === duration
                                        ? 'bg-speed/20 border-speed text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-black/20 border-white/10 text-gray-400 hover:border-speed/50 hover:text-white'}
                                `}
                            >
                                {duration}s
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* Game Area */}
                <motion.div
                    className="w-full max-w-5xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-speed/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full h-[500px] rounded-[3rem] p-8 md:p-12 flex flex-col relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {/* Stats HUD */}
                        <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                            <div className="text-left">
                                <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Time Left</div>
                                <div className="text-5xl font-mono font-bold text-white tabular-nums">
                                    {Math.max(0, timeLeft).toFixed(1)}<span className="text-lg text-gray-500 ml-2">s</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">CPS</div>
                                <div className="text-5xl font-mono font-bold text-white tabular-nums">
                                    {isFinite(Number(cps)) ? cps : "0.0"}
                                </div>
                            </div>
                        </div>

                        {/* Interactive Area */}
                        <div
                            ref={clickAreaRef}
                            onMouseDown={handleClick}
                            className={`
                                flex-1 w-full mt-24 rounded-3xl relative
                                flex items-center justify-center
                                transition duration-200 select-none
                                ${isPlaying
                                    ? 'cursor-pointer active:scale-[0.99] active:bg-white/5 bg-transparent'
                                    : 'bg-black/40'}
                            `}
                        >
                            {!isPlaying && !finalExceededTime && (
                                <motion.div className="text-center z-10">
                                    <MousePointer className="w-16 h-16 text-speed mx-auto mb-4 animate-bounce" />
                                    <h3 className="text-2xl font-bold text-white mb-6">Ready to Click?</h3>
                                    <Button
                                        variant="speed"
                                        size="lg"
                                        onClick={(e) => { e.stopPropagation(); startGame(); }}
                                        className="text-xl px-12 py-6 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START MISSION
                                    </Button>
                                </motion.div>
                            )}

                            {finalExceededTime && !isPlaying && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-speed/30"
                                >
                                    <h2 className="text-4xl font-bold text-white mb-2">MISSION COMPLETE</h2>
                                    <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-6">
                                        {(score / testDuration).toFixed(2)} <span className="text-2xl text-speed">CPS</span>
                                    </div>
                                    <div className="text-xl text-gray-400 mb-8">
                                        Total Clicks: <span className="text-white font-bold">{score}</span>
                                    </div>
                                    <div className="flex gap-4 justify-center">
                                        <Button
                                            variant="speed"
                                            onClick={(e) => { e.stopPropagation(); startGame(); }}
                                            className="px-8"
                                        >
                                            <RotateCcw className="w-4 h-4 mr-2" />
                                            Replay
                                        </Button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Click Particles */}
                            <AnimatePresence>
                                {clicks.map((click) => (
                                    <motion.div
                                        key={click.id}
                                        initial={{ scale: 0, opacity: 1 }}
                                        animate={{ scale: 2, opacity: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="absolute w-4 h-4 rounded-full border-2 border-speed pointer-events-none"
                                        style={{ left: click.x, top: click.y }}
                                    />
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </motion.div>

                <ToolContent
                    title="CPS Speed Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Measures pure clicking speed.",
                        "Essential for Minecraft PvP & FPS games.",
                        "Tests finger stamina and dexterity.",
                        "Tracks improvement over time.",
                        "Fun competitive challenge."
                    ]}
                    howToPlay={[
                        "Choose your test duration (1s, 5s, 10s).",
                        "Click 'Start Mission' or tap the area.",
                        "Click as fast as you can until time runs out.",
                        "Try different clicking methods (Jitter, Butterfly).",
                        "Check your CPS score at the end."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
