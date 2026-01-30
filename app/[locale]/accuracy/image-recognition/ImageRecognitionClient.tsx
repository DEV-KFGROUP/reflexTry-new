"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Eye, Play, RotateCcw, Trophy, ArrowRight } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const IMAGE_SAMPLES = [
    { id: "img_001", hint: "🐱", correct: "cat" },
    { id: "img_002", hint: "🌅", correct: "sunset" },
    { id: "img_003", hint: "🔷", correct: "diamond" },
    { id: "img_004", hint: "🚗", correct: "car" },
    { id: "img_005", hint: "🌳", correct: "tree" },
    { id: "img_006", hint: "🏠", correct: "house" },
    { id: "img_007", hint: "⭐", correct: "star" },
    { id: "img_008", hint: "🌙", correct: "moon" },
];

export default function ImageRecognitionClient() {
    const [currentImage, setCurrentImage] = useState(IMAGE_SAMPLES[0]);
    const [input, setInput] = useState("");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [gameState, setGameState] = useState<"idle" | "playing" | "result" | "gameover">("idle");
    const [lastResult, setLastResult] = useState<boolean | null>(null);
    const { play } = useGameSound();

    const content = getToolContent("image-recognition", "Image Recognition");

    const startGame = () => {
        setScore(0);
        setRound(0);
        setGameState("playing");
        setInput("");
        nextImage();
        play("start");
    };

    const nextImage = () => {
        const idx = Math.floor(Math.random() * IMAGE_SAMPLES.length);
        setCurrentImage(IMAGE_SAMPLES[idx]);
        setInput("");
        setLastResult(null);
        setGameState("playing");
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (gameState !== "playing") return;

        const isCorrect = input.toLowerCase().includes(currentImage.correct.toLowerCase());
        setLastResult(isCorrect);
        setRound(r => r + 1);

        if (isCorrect) {
            setScore(s => s + 100);
            play("success");
        } else {
            play("error");
        }

        setGameState("result");

        // Auto-advance after 10 rounds
        if (round >= 9) {
            setTimeout(() => {
                setGameState("gameover");
                play("levelUp");
            }, 1500);
        }
    };

    const accuracy = round > 0 ? Math.round((score / (round * 100)) * 100) : 0;

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
                            Image Recognition
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">Accuracy Arena</p>
                    </div>

                    {gameState !== "idle" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-4xl font-bold text-white">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Round</div>
                                <div className="text-4xl font-bold text-accuracy">{round}/10</div>
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
                                    className="text-center space-y-8 relative z-20"
                                >
                                    <Eye className="w-24 h-24 text-accuracy mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Identify the Object</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Look at the image and type what you see. Test your visual recognition skills!</p>
                                    <Button
                                        variant="accuracy"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START TEST
                                    </Button>
                                </motion.div>
                            )}

                            {(gameState === "playing" || gameState === "result") && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8 w-full flex flex-col items-center relative z-20"
                                >
                                    <motion.div
                                        key={currentImage.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="w-48 h-48 bg-black/30 rounded-3xl flex items-center justify-center text-9xl border-2 border-accuracy/30 shadow-[0_0_40px_rgba(0,230,118,0.2)]"
                                    >
                                        {currentImage.hint}
                                    </motion.div>

                                    {gameState === "playing" ? (
                                        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
                                            <input
                                                type="text"
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="Type what you see..."
                                                className="w-full px-6 py-4 bg-black/30 border-2 border-accuracy/30 rounded-2xl text-xl text-white text-center focus:outline-none focus:border-accuracy"
                                                autoFocus
                                            />
                                            <Button type="submit" variant="accuracy" size="lg" className="w-full text-xl py-6 rounded-2xl">
                                                SUBMIT ANSWER
                                            </Button>
                                        </form>
                                    ) : (
                                        <motion.div
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            className="text-center space-y-4"
                                        >
                                            <div className={`text-4xl font-bold ${lastResult ? "text-accuracy" : "text-red-500"}`}>
                                                {lastResult ? "CORRECT!" : "INCORRECT"}
                                            </div>
                                            {!lastResult && (
                                                <div className="text-gray-400">
                                                    The answer was: <span className="text-white font-bold capitalize">{currentImage.correct}</span>
                                                </div>
                                            )}
                                            {round < 10 && (
                                                <Button variant="accuracy" size="lg" onClick={nextImage} className="mt-4">
                                                    <ArrowRight className="w-5 h-5 mr-2" />
                                                    Next Image
                                                </Button>
                                            )}
                                        </motion.div>
                                    )}
                                </motion.div>
                            )}

                            {gameState === "gameover" && (
                                <motion.div
                                    key="gameover"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Trophy className="w-20 h-20 text-accuracy mx-auto" />
                                    <div className="text-6xl md:text-7xl font-black text-accuracy drop-shadow-[0_0_30px_rgba(0,230,118,0.6)]">
                                        TEST COMPLETE!
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        <div className="bg-black/40 rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase mb-1">Score</div>
                                            <div className="text-4xl font-bold text-white">{score}</div>
                                        </div>
                                        <div className="bg-black/40 rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase mb-1">Accuracy</div>
                                            <div className="text-4xl font-bold text-accuracy">{accuracy}%</div>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={startGame}
                                        variant="accuracy"
                                        size="lg"
                                        className="text-xl px-12 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-6 h-6 mr-3" />
                                        TRY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Image Recognition"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Look at the displayed image or symbol carefully.",
                        "Type what you see or identify in the input field.",
                        "Click 'Submit Answer' to check your response.",
                        "Continue through 10 rounds to test your skills."
                    ]}
                    benefits={[
                        "Enhances visual processing and pattern recognition.",
                        "Improves attention to detail and observation skills.",
                        "Develops rapid identification capabilities.",
                        "Trains cognitive flexibility and visual memory."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
