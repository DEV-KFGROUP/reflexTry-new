"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Type, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const WORDS = [
    "accuracy", "precision", "reflex", "speed", "focus", "cognitive",
    "memory", "visual", "pattern", "logic", "reaction", "timing",
    "sequence", "number", "shape", "symbol", "color", "sound",
    "gaming", "training", "brain", "mental", "skill", "level"
];

export default function WordGame() {
    const content = getToolContent("word-accuracy", "Word Accuracy Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [score, setScore] = useState(0);
    const [currentWord, setCurrentWord] = useState("");
    const [input, setInput] = useState("");
    const [timeLeft, setTimeLeft] = useState(60);
    const [wordsTyped, setWordsTyped] = useState(0);
    const { play } = useGameSound();

    const generateWord = () => {
        const w = WORDS[Math.floor(Math.random() * WORDS.length)];
        setCurrentWord(w);
        setInput("");
    };

    const startGame = () => {
        setScore(0);
        setWordsTyped(0);
        setTimeLeft(60);
        setGameState("playing");
        generateWord();
        play("start");
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.toLowerCase().trim();
        setInput(val);

        if (val === currentWord) {
            setScore(s => s + 10 + Math.floor(currentWord.length / 2));
            setWordsTyped(w => w + 1);
            play("success");
            generateWord();
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

    const wpm = timeLeft < 60 ? Math.round((wordsTyped / (60 - timeLeft)) * 60) : 0;

    return (
        <GameBackground variant="speed" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-speed/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-speed via-white to-speed bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,229,255,0.5)]">
                            Word Accuracy
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Typing Challenge</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-3xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-speed">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Words</div>
                                <div className="text-3xl font-bold text-white">{wordsTyped}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">WPM</div>
                                <div className="text-3xl font-bold text-speed">{wpm}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-speed/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <Type className="w-24 h-24 text-speed mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Type Words Accurately</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Type the words exactly as they appear. Speed matters!</p>
                                    <Button
                                        variant="speed"
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
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
                                    <div className="text-5xl md:text-6xl font-black text-white">TIME'S UP!</div>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Score</div>
                                            <div className="text-4xl font-bold text-speed">{score}</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Words</div>
                                            <div className="text-4xl font-bold text-white">{wordsTyped}</div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="speed"
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
                                    className="space-y-8 text-center w-full max-w-md relative z-20"
                                >
                                    <motion.div
                                        key={currentWord}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-6xl md:text-7xl font-bold text-white tracking-wider drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]"
                                    >
                                        {currentWord}
                                    </motion.div>

                                    <input
                                        type="text"
                                        value={input}
                                        onChange={handleInput}
                                        className="w-full bg-white/10 border-b-4 border-speed/50 text-center text-4xl py-4 text-speed outline-none focus:border-speed transition-colors rounded-xl"
                                        autoFocus
                                        placeholder="type here..."
                                    />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Word Accuracy Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A target word appears on the screen.",
                        "Type the word correctly.",
                        "When correct, a new word appears automatically.",
                        "You maximize points by typing fast without backspacing."
                    ]}
                    benefits={[
                        "Trains precision typing.",
                        "Improves spelling reflexes.",
                        "Reinforces correct finger placement.",
                        "Ideal for correcting bad typing habits."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
