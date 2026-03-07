"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Volume2, Play, RotateCcw } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function SoundReactionGame() {
    const content = getToolContent("sound-reaction", "Audio Reaction Test");
    const [gameState, setGameState] = useState<"idle" | "waiting" | "ready" | "early" | "result">("idle");
    const [startTime, setStartTime] = useState(0);
    const [time, setTime] = useState(0);
    const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
    const { play } = useGameSound();

    const playBeep = () => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
    };

    const startWaiting = () => {
        setGameState("waiting");
        play("hover");
        const delay = Math.floor(Math.random() * 3000) + 2000;
        const id = setTimeout(() => {
            setGameState("ready");
            setStartTime(Date.now());
            playBeep();
        }, delay);
        setTimeoutId(id);
    };

    const handleAction = () => {
        if (gameState === "idle") {
            startWaiting();
            play("click");
        } else if (gameState === "waiting") {
            setGameState("early");
            if (timeoutId) clearTimeout(timeoutId);
            play("error");
        } else if (gameState === "ready") {
            const diff = Date.now() - startTime;
            setTime(diff);
            setGameState("result");
            play("success");
        } else if (gameState === "early" || gameState === "result") {
            startWaiting();
            play("click");
        }
    };

    let bgColor = "bg-black/40";
    let message = "Click anywhere to start";
    let subMessage = "Listen for the beep sound";

    if (gameState === "waiting") {
        bgColor = "bg-red-500/30";
        message = "Wait for the beep...";
        subMessage = "Do NOT click yet!";
    } else if (gameState === "ready") {
        bgColor = "bg-green-500";
        message = "CLICK NOW!";
        subMessage = "";
    } else if (gameState === "early") {
        bgColor = "bg-yellow-500/30";
        message = "Too soon!";
        subMessage = "Click to try again";
    } else if (gameState === "result") {
        bgColor = "bg-reflex/20";
        message = `${time} ms`;
        subMessage = "Click to try again";
    }

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
                            Audio Reaction
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Sound Reflex Test</p>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <motion.div
                        className={`hud-frame w-full min-h-[500px] rounded-[3rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 select-none shadow-2xl relative overflow-hidden ${bgColor} ${gameState === "ready" ? "shadow-[0_0_100px_rgba(34,197,94,0.6)]" : ""}`}
                        onClick={handleAction}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                    >
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        <motion.div
                            key={gameState}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="relative z-10 text-center px-8"
                        >
                            {gameState === "idle" && (
                                <Volume2 className="w-24 h-24 text-reflex mx-auto mb-8 animate-bounce" />
                            )}

                            <div className={`text-6xl md:text-8xl font-black drop-shadow-2xl mb-4 ${gameState === "ready" ? "text-white" : "text-white/90"}`}>
                                {message}
                            </div>

                            {subMessage && (
                                <div className={`text-xl ${gameState === "waiting" ? "text-red-300" : "text-white/60"} font-medium`}>
                                    {subMessage}
                                </div>
                            )}

                            {gameState === "result" && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-8"
                                >
                                    <div className="text-3xl font-bold text-white/80 mb-2">
                                        {time < 150 ? "⚡ SUPERHUMAN!" : time < 200 ? "🔥 LIGHTNING FAST!" : time < 250 ? "👍 GREAT!" : "Keep practicing!"}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                <ToolContent
                    title="Audio Reaction Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Click to start the test.",
                        "Wait for the BEEP sound.",
                        "Click immediately when you hear the sound.",
                        "Comparing visual vs audio reaction times can be insightful."
                    ]}
                    benefits={[
                        "Measures auditory processing speed.",
                        "Critical for competitive gaming (hearing footsteps).",
                        "Tests nervous system efficiency.",
                        "Highlights the difference between senses."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
