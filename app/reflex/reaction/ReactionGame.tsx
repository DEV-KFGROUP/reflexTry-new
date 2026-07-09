"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { RotateCcw, Zap, Timer, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function ReactionGame() {
    const content = getToolContent("reaction-time", "Reaction Time Test");
    const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "early" | "result">("idle");
    const [startTime, setStartTime] = useState(0);
    const [reactionTime, setReactionTime] = useState(0);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const { play } = useGameSound();

    const startWaiting = () => {
        setGameState("waiting");
        const delay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds
        play("hover"); // Subtle sound for start

        const id = setTimeout(() => {
            setGameState("ready");
            setStartTime(Date.now());
            play("start"); // Flash sound
        }, delay);
        setTimeoutId(id);
    };

    const handleClick = () => {
        if (gameState === "idle" || gameState === "result") {
            startWaiting();
            play("click");
        } else if (gameState === "waiting") {
            setGameState("early");
            if (timeoutId) clearTimeout(timeoutId);
            play("error");
        } else if (gameState === "ready") {
            const time = Date.now() - startTime;
            setReactionTime(time);
            setGameState("result");
            play("success");
        } else if (gameState === "early") {
            startWaiting();
            play("click");
        }
    };

    // determine background color
    let bgColor = "bg-primary/20"; // standard
    let message = "Click anywhere to start";

    switch (gameState) {
        case "waiting":
            bgColor = "bg-red-500/20";
            message = "Wait for green...";
            break;
        case "ready":
            bgColor = "bg-green-500";
            message = "CLICK!";
            break;
        case "result":
            bgColor = "bg-reflex/20";
            message = `${reactionTime} ms`;
            break;
        case "early":
            bgColor = "bg-yellow-500/20";
            message = "Too soon! Click to try again.";
            break;
    }

    return (
        <GameBackground variant="reflex" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Enhanced Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-reflex/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-reflex via-white to-reflex bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                            Reflex Arena
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Reaction Test</p>
                    </div>
                </motion.div>

                {/* Enhanced Game Area */}
                <motion.div
                    className="w-full max-w-5xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <motion.div
                        className={`
                            hud-frame w-full h-[500px] rounded-[3rem] flex flex-col items-center justify-center 
                            cursor-pointer transition duration-200 select-none shadow-2xl relative overflow-hidden
                            ${bgColor}
                            ${gameState === "ready" ? "shadow-[0_0_100px_rgba(34,197,94,0.6)]" : ""}
                        `}
                        onMouseDown={handleClick}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        {/* Animated background pattern */}
                        <div className="absolute inset-0 opacity-10 pointer-events-none">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent)]" />
                            <div className="scanlines absolute inset-0" />
                        </div>

                        <motion.div
                            key={gameState}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.3 }}
                            className="relative z-10 text-center px-8"
                        >
                            <div className={`text-6xl md:text-8xl font-black drop-shadow-2xl mb-8 ${gameState === "ready" ? "text-white" : "text-white/90"}`}>
                                {message}
                            </div>

                            {gameState === "result" && (
                                <motion.div className="space-y-6">
                                    <div className="text-4xl font-bold text-white/90">
                                        {reactionTime < 200 ? "⚡ GODLIKE REFLEXES!" : reactionTime < 250 ? "🔥 SUPERHUMAN!" : "👍 EXCELLENT"}
                                    </div>
                                    <div className="text-xl text-white/70">Click to Deploy Again</div>
                                </motion.div>
                            )}

                            {gameState === "idle" && (
                                <motion.div className="text-xl text-reflex/80 font-bold uppercase tracking-widest animate-pulse">
                                    Wait for the GREEN LIGHT...
                                </motion.div>
                            )}

                            {gameState === "waiting" && (
                                <motion.div className="text-xl text-red-500 font-bold uppercase tracking-widest">
                                    STEADY...
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>

                    {/* Stats display */}
                    {gameState === "result" && (
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="flex justify-center mt-8 gap-4"
                        >
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-center min-w-[150px]">
                                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Your Time</div>
                                <div className="text-3xl font-bold text-white">{reactionTime}ms</div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>

                <ToolContent
                    title="Reaction Time Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Measures visual-motor reaction speed.",
                        "Critical for gamers (FPS, MOBA).",
                        "Important for driving and sports.",
                        "Tracks cognitive processing speed.",
                        "Fun competitive challenge."
                    ]}
                    howToPlay={[
                        "Click the large area to start.",
                        "Wait for the red box to turn GREEN.",
                        "Click immediately as soon as you see green.",
                        "See your reaction time in milliseconds.",
                        "Try 5 times to get an average."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
