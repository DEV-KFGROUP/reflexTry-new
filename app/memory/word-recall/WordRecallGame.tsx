"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { BookOpen, Play, RotateCcw, Trophy, Brain, Clock } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const WORD_BANK = [
    "ocean", "bridge", "candle", "forest", "marble", "silver", "garden", "thunder",
    "puzzle", "crystal", "shadow", "beacon", "velvet", "copper", "breeze", "glacier",
    "lantern", "anchor", "ribbon", "temple", "coral", "mirror", "valley", "spark",
    "amber", "eclipse", "harbor", "summit", "mosaic", "whisper", "falcon", "prism",
    "aurora", "ember", "quartz", "river", "arrow", "tower", "cloud", "flame",
    "diamond", "meadow", "shield", "comet", "pearl", "castle", "phoenix", "orbit",
];

function pickRandomWords(count: number, exclude: string[] = []): string[] {
    const available = WORD_BANK.filter(w => !exclude.includes(w));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

export default function WordRecallGame() {
    const content = getToolContent("word-recall", "Word Recall");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "memorize" | "recall" | "result">("idle");
    const [level, setLevel] = useState(1);
    const [words, setWords] = useState<string[]>([]);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [input, setInput] = useState("");
    const [answers, setAnswers] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [bestLevel, setBestLevel] = useState(0);
    const [showTimer, setShowTimer] = useState(3);

    const wordCount = level + 2; // Level 1 = 3 words, Level 2 = 4, etc.

    const startGame = useCallback(() => {
        setLevel(1);
        setScore(0);
        startLevel(1);
        play("start");
    }, [play]);

    const startLevel = useCallback((lvl: number) => {
        const count = lvl + 2;
        const picked = pickRandomWords(count);
        setWords(picked);
        setCurrentWordIndex(0);
        setAnswers([]);
        setInput("");
        setPhase("memorize");
        setShowTimer(count + 1); // seconds to memorize
    }, []);

    // Memorize timer
    useEffect(() => {
        if (phase !== "memorize") return;
        if (showTimer <= 0) {
            setPhase("recall");
            return;
        }
        const t = setTimeout(() => setShowTimer(s => s - 1), 1000);
        return () => clearTimeout(t);
    }, [phase, showTimer]);

    // Word display during memorize
    useEffect(() => {
        if (phase !== "memorize") return;
        const interval = Math.max(1500, (words.length + 1) * 1000 / words.length);
        const t = setInterval(() => {
            setCurrentWordIndex(i => {
                if (i >= words.length - 1) return 0;
                return i + 1;
            });
        }, interval);
        return () => clearInterval(t);
    }, [phase, words]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = input.trim().toLowerCase();
        if (!trimmed) return;

        const newAnswers = [...answers, trimmed];
        setAnswers(newAnswers);
        setInput("");
        play("click");

        if (newAnswers.length >= words.length) {
            // Check results
            const correct = newAnswers.filter(a => words.includes(a));
            const unique = [...new Set(correct)];
            if (unique.length === words.length) {
                // Perfect — next level
                play("levelUp");
                setScore(s => s + words.length);
                const nextLvl = level + 1;
                setLevel(nextLvl);
                setTimeout(() => startLevel(nextLvl), 800);
            } else {
                // Game over
                play("error");
                setScore(s => s + unique.length);
                setBestLevel(l => Math.max(l, level));
                setPhase("result");
            }
        }
    };

    return (
        <GameBackground variant="memory" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-memory/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            Word Recall
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Verbal Memory Test</p>
                    </div>
                </motion.div>

                {/* Game Area */}
                <motion.div
                    className="w-full max-w-3xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[420px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {/* HUD */}
                        <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                            <div className="text-left">
                                <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Level</div>
                                <div className="text-4xl font-mono font-bold text-white">{level}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Words</div>
                                <div className="text-4xl font-mono font-bold text-white">{wordCount}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Score</div>
                                <div className="text-4xl font-mono font-bold text-white">{score}</div>
                            </div>
                        </div>

                        {/* Idle */}
                        {phase === "idle" && (
                            <motion.div className="text-center z-10 mt-12">
                                <BookOpen className="w-16 h-16 text-memory mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Word Recall Challenge</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Watch words flash on screen. Memorize them all, then type every word you remember.</p>
                                <Button variant="memory" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {/* Memorize phase */}
                        {phase === "memorize" && (
                            <motion.div
                                key="memorize"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center z-10 mt-16"
                            >
                                <div className="flex items-center justify-center gap-2 text-memory mb-6">
                                    <Clock className="w-5 h-5" />
                                    <span className="text-lg font-mono font-bold">{showTimer}s</span>
                                </div>
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentWordIndex}
                                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -20, scale: 0.8 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-6xl md:text-7xl font-black text-white mb-4"
                                    >
                                        {words[currentWordIndex]}
                                    </motion.div>
                                </AnimatePresence>
                                <p className="text-gray-500 text-sm">Memorize all {words.length} words!</p>
                            </motion.div>
                        )}

                        {/* Recall phase */}
                        {phase === "recall" && (
                            <motion.div
                                key="recall"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center z-10 mt-16 w-full max-w-md"
                            >
                                <Brain className="w-10 h-10 text-memory mx-auto mb-3" />
                                <h3 className="text-xl font-bold text-white mb-1">Type the words!</h3>
                                <p className="text-gray-400 mb-4 text-sm">{answers.length} / {words.length} entered</p>

                                {/* Entered words */}
                                <div className="flex flex-wrap gap-2 justify-center mb-4 min-h-[40px]">
                                    {answers.map((a, i) => (
                                        <span key={i} className={`px-3 py-1 rounded-full text-sm font-medium ${words.includes(a.toLowerCase()) ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                            {a}
                                        </span>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit} className="flex gap-3">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={e => setInput(e.target.value)}
                                        placeholder="Type a word..."
                                        autoFocus
                                        className="flex-1 bg-black/50 border border-memory/30 rounded-xl px-4 py-3 text-white text-lg font-mono focus:outline-none focus:border-memory/60 focus:ring-2 focus:ring-memory/20"
                                    />
                                    <Button variant="memory" type="submit" className="px-6">Submit</Button>
                                </form>
                            </motion.div>
                        )}

                        {/* Result */}
                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-memory/30"
                            >
                                <Trophy className="w-12 h-12 text-memory mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Game Over</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    Level {level}
                                </div>
                                <p className="text-gray-400 mb-2">Total Words Recalled: <span className="text-white font-bold">{score}</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best Level: {Math.max(bestLevel, level)}</p>
                                <Button variant="memory" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Word Recall Memory Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Strengthens verbal working memory.",
                        "Improves recall and retrieval speed.",
                        "Trains focus and concentration.",
                        "Boosts academic and professional performance.",
                        "Fun progressive difficulty."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin.",
                        "Watch words flash on screen one by one.",
                        "After the timer, type all the words you remember.",
                        "Get them all right to advance to the next level.",
                        "Each level adds more words to memorize."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
