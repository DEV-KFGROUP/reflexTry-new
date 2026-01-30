"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { useTranslations } from "next-intl";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";
import { Play, RotateCcw, ArrowRight, Hash } from "lucide-react";

export default function NumberMemoryPageClient() {
    const t = useTranslations('NumberMemory');
    const [level, setLevel] = useState(1);
    const [number, setNumber] = useState("");
    const [userInput, setUserInput] = useState("");
    const [gameState, setGameState] = useState<"idle" | "memorize" | "input" | "result">("idle");
    const { play } = useGameSound();

    const content = getToolContent("number-memory", "Number Memory");

    const generateNumber = (length: number) => {
        let num = "";
        for (let i = 0; i < length; i++) {
            num += Math.floor(Math.random() * 10);
        }
        return num;
    };

    const startGame = () => {
        play("start");
        setLevel(1);
        startLevel(1);
    };

    const startLevel = (lvl: number) => {
        const num = generateNumber(lvl);
        setNumber(num);
        setGameState("memorize");
        setUserInput("");
        play("tick");

        const duration = 2000 + (lvl * 500);

        setTimeout(() => {
            setGameState("input");
        }, duration);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setGameState("result");
        if (userInput === number) {
            play("success");
        } else {
            play("error");
        }
    };

    const nextLevel = () => {
        play("levelUp");
        setLevel(l => l + 1);
        startLevel(level + 1);
    };

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
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,0,118,0.5)]">
                            Number Memory
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Memory Arena</p>
                    </div>

                    {gameState !== "idle" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Level</div>
                                <div className="text-4xl font-bold text-white">{level}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Digits</div>
                                <div className="text-4xl font-bold text-memory">{level}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-memory/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full min-h-[450px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
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
                                    <Hash className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Memory Protocol</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">The average person can remember 7 numbers at once. Can you beat that?</p>
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

                            {gameState === "memorize" && (
                                <motion.div
                                    key="memorize"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <div className="text-7xl md:text-8xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_30px_rgba(245,0,118,0.6)]">
                                        {number}
                                    </div>
                                    <p className="text-memory/60 uppercase tracking-widest text-sm animate-pulse">Memorize...</p>
                                    <motion.div
                                        className="h-2 bg-memory rounded-full w-full max-w-md mx-auto"
                                        initial={{ scaleX: 1 }}
                                        animate={{ scaleX: 0 }}
                                        transition={{ duration: (2000 + (level * 500)) / 1000, ease: "linear" }}
                                        style={{ transformOrigin: "left" }}
                                    />
                                </motion.div>
                            )}

                            {gameState === "input" && (
                                <motion.form
                                    key="input"
                                    onSubmit={handleSubmit}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8 w-full max-w-lg text-center relative z-20"
                                >
                                    <label className="text-2xl text-gray-300 block">What was the number?</label>
                                    <input
                                        type="text"
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        value={userInput}
                                        onChange={(e) => {
                                            setUserInput(e.target.value);
                                            play("click");
                                        }}
                                        className="w-full text-center text-5xl bg-black/30 border-2 border-memory/30 rounded-2xl py-6 px-4 focus:border-memory focus:outline-none text-white tracking-widest font-mono"
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        variant="memory"
                                        size="lg"
                                        className="w-full text-xl py-6 rounded-2xl"
                                    >
                                        SUBMIT ANSWER
                                    </Button>
                                </motion.form>
                            )}

                            {gameState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    {userInput === number ? (
                                        <>
                                            <div className="text-6xl md:text-7xl font-black text-accuracy drop-shadow-[0_0_30px_rgba(0,230,118,0.6)]">
                                                CORRECT!
                                            </div>
                                            <p className="text-gray-400 text-xl">Level {level} Complete</p>
                                            <Button
                                                onClick={nextLevel}
                                                variant="memory"
                                                size="lg"
                                                className="text-xl px-12 py-6 rounded-2xl"
                                            >
                                                <ArrowRight className="w-6 h-6 mr-3" />
                                                NEXT LEVEL
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="text-6xl md:text-7xl font-black text-red-500 drop-shadow-[0_0_30px_rgba(255,0,0,0.5)]">
                                                GAME OVER
                                            </div>
                                            <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                                <div className="bg-black/40 rounded-xl p-4">
                                                    <div className="text-sm text-gray-400 uppercase mb-1">Correct</div>
                                                    <div className="text-3xl text-white font-mono">{number}</div>
                                                </div>
                                                <div className="bg-black/40 rounded-xl p-4">
                                                    <div className="text-sm text-gray-400 uppercase mb-1">Your Answer</div>
                                                    <div className="text-3xl text-red-400 font-mono line-through">{userInput}</div>
                                                </div>
                                            </div>
                                            <div className="text-2xl text-memory font-bold">Level Reached: {level}</div>
                                            <Button
                                                onClick={startGame}
                                                variant="memory"
                                                size="lg"
                                                className="text-xl px-12 py-6 rounded-2xl"
                                            >
                                                <RotateCcw className="w-6 h-6 mr-3" />
                                                TRY AGAIN
                                            </Button>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Number Memory"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A number will appear on the screen.",
                        "Memorize it before the progress bar runs out.",
                        "Type the number into the input field.",
                        "Click Submit to check your answer.",
                        "Each level adds one more digit."
                    ]}
                    benefits={[
                        "Increases digit span capacity.",
                        "Strengthens short-term recall.",
                        "Improves focus under time pressure.",
                        "Helps with remembering phone numbers and codes."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
