"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Play, RotateCcw, Palette } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

// Stroop effect game
const COLORS = [
    { name: "RED", value: "text-red-500", hex: "#ef4444", bg: "bg-red-500" },
    { name: "BLUE", value: "text-blue-500", hex: "#3b82f6", bg: "bg-blue-500" },
    { name: "GREEN", value: "text-green-500", hex: "#22c55e", bg: "bg-green-500" },
    { name: "YELLOW", value: "text-yellow-500", hex: "#eab308", bg: "bg-yellow-500" },
    { name: "PURPLE", value: "text-purple-500", hex: "#a855f7", bg: "bg-purple-500" },
];

export default function ColorMemoryPageClient() {
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [currentWord, setCurrentWord] = useState(COLORS[0]);
    const [inkColor, setInkColor] = useState(COLORS[0]);
    const { play } = useGameSound();

    const content = getToolContent("color-memory", "Color Matching (Stroop Test)");

    const nextRound = () => {
        const word = COLORS[Math.floor(Math.random() * COLORS.length)];
        const ink = COLORS[Math.floor(Math.random() * COLORS.length)];
        setCurrentWord(word);
        setInkColor(ink);
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setGameState("playing");
        nextRound();
        play("start");
    };

    const handleAnswer = (selectedColorHex: string) => {
        if (gameState !== "playing") return;

        if (selectedColorHex === inkColor.hex) {
            setScore(s => s + 100);
            play("success");
        } else {
            setScore(s => Math.max(0, s - 50));
            play("error");
        }
        nextRound();
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
                            Color Matching
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Stroop Test</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
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
                                    <Palette className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Select the INK COLOR</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">A color word will appear in a different ink. Tap the button matching the INK color, not the word!</p>
                                    <Button
                                        variant="memory"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START TEST
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
                                        TRY AGAIN
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "playing" && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-12 w-full flex flex-col items-center relative z-20"
                                >
                                    <motion.div
                                        key={`${currentWord.name}-${inkColor.name}`}
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className={`text-8xl md:text-9xl font-black tracking-tighter ${inkColor.value} drop-shadow-[0_0_30px_currentColor]`}
                                    >
                                        {currentWord.name}
                                    </motion.div>

                                    <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                                        {COLORS.map((c) => (
                                            <motion.button
                                                key={c.name}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl ${c.bg} text-white font-bold text-sm shadow-lg hover:shadow-[0_0_30px_${c.hex}]`}
                                                onClick={() => handleAnswer(c.hex)}
                                            >
                                                {c.name}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Color Matching (Stroop Test)"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A color word (e.g., 'RED') will appear on screen.",
                        "The text will be colored in a specific ink (e.g., Blue).",
                        "Your goal is to click the button matching the INK COLOR.",
                        "Ignore the word itself.",
                        "Score points for correct answers within the time limit."
                    ]}
                    benefits={[
                        "Enhances selective attention.",
                        "Improves cognitive flexibility.",
                        "Trains processing speed.",
                        "Strengthens the ability to inhibit impulse responses."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
