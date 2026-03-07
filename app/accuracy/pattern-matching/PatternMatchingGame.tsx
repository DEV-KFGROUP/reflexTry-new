"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Target, Trophy, Eye, Play, RotateCcw } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const PATTERNS = [
    { id: 1, pattern: "●●○●○", name: "dot-dash" },
    { id: 2, pattern: "○●○●●", name: "dash-dot" },
    { id: 3, pattern: "●●●○○", name: "three-two" },
    { id: 4, pattern: "○●●●○", name: "one-three-one" },
    { id: 5, pattern: "●○●○●", name: "alternating" },
    { id: 6, pattern: "○○●●●", name: "two-three" },
    { id: 7, pattern: "●○○●○", name: "complex-1" },
    { id: 8, pattern: "○●○○●", name: "complex-2" },
];

export default function PatternMatchingGame() {
    const content = getToolContent("pattern-matching", "Pattern Matching Accuracy Test");
    const [gameState, setGameState] = useState<"idle" | "showing" | "selecting" | "result">("idle");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [targetPattern, setTargetPattern] = useState<typeof PATTERNS[0] | null>(null);
    const [options, setOptions] = useState<(typeof PATTERNS[number])[]>([]);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [showTime, setShowTime] = useState(2000);
    const { play } = useGameSound();

    const generateRound = () => {
        const target = PATTERNS[Math.floor(Math.random() * PATTERNS.length)];
        const wrongOptions = PATTERNS.filter(p => p.id !== target.id)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3);
        const allOptions = [target, ...wrongOptions].sort(() => Math.random() - 0.5);

        setTargetPattern(target);
        setOptions(allOptions);
        setSelectedIndex(null);
        setGameState("showing");

        setTimeout(() => {
            setGameState("selecting");
        }, showTime);
    };

    const startGame = () => {
        setGameState("idle");
        setScore(0);
        setRound(0);
        setShowTime(2000);
        generateRound();
        play("start");
    };

    const handleSelect = (index: number) => {
        if (gameState !== "selecting") return;

        setSelectedIndex(index);
        const selected = options[index];
        const isCorrect = selected.id === targetPattern?.id;

        if (isCorrect) {
            play("success");
        } else {
            play("error");
        }

        setTimeout(() => {
            if (isCorrect) {
                setScore(s => s + 1);
                setRound(r => r + 1);

                if (round < 9) {
                    setShowTime(Math.max(1000, showTime - 100));
                    generateRound();
                } else {
                    setGameState("result");
                    play("levelUp");
                }
            } else {
                setGameState("result");
            }
        }, 500);
    };

    const accuracy = round > 0 ? Math.round((score / round) * 100) : 0;

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
                            Pattern Matching
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">Accuracy Test</p>
                    </div>

                    {(gameState === "showing" || gameState === "selecting") && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Round</div>
                                <div className="text-3xl font-bold text-white">{round + 1}/10</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-accuracy">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-3xl font-bold text-white">{accuracy}%</div>
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
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Eye className="w-24 h-24 text-accuracy mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Visual Pattern Recognition</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Memorize the pattern shown briefly, then select the exact match!</p>
                                    <Button
                                        variant="accuracy"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START GAME
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "showing" && targetPattern && (
                                <motion.div
                                    key="showing"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <p className="text-xl text-accuracy font-bold uppercase tracking-widest">Memorize this pattern</p>
                                    <div className="text-8xl md:text-9xl font-mono text-white drop-shadow-[0_0_30px_rgba(0,230,118,0.8)]">
                                        {targetPattern.pattern}
                                    </div>
                                    <div className="w-32 h-2 mx-auto bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-accuracy"
                                            initial={{ width: "100%" }}
                                            animate={{ width: "0%" }}
                                            transition={{ duration: showTime / 1000, ease: "linear" }}
                                        />
                                    </div>
                                </motion.div>
                            )}

                            {gameState === "selecting" && targetPattern && (
                                <motion.div
                                    key="selecting"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6 relative z-20 w-full"
                                >
                                    <p className="text-2xl font-bold text-accuracy">Select the pattern you saw:</p>
                                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                                        {options.map((option, index) => {
                                            const isSelected = selectedIndex === index;
                                            const isCorrect = option.id === targetPattern.id;
                                            const showResult = selectedIndex !== null;

                                            return (
                                                <motion.button
                                                    key={option.id}
                                                    onClick={() => handleSelect(index)}
                                                    disabled={selectedIndex !== null}
                                                    className={`p-8 rounded-2xl border-4 transition-all ${showResult
                                                            ? isCorrect
                                                                ? "bg-green-500/20 border-green-500"
                                                                : isSelected
                                                                    ? "bg-red-500/20 border-red-500"
                                                                    : "bg-white/5 border-white/10"
                                                            : "bg-white/5 border-white/10 hover:border-accuracy hover:bg-white/10"
                                                        }`}
                                                    whileHover={!showResult ? { scale: 1.02 } : {}}
                                                    whileTap={!showResult ? { scale: 0.98 } : {}}
                                                >
                                                    <div className="text-4xl md:text-5xl font-mono text-white mb-2">
                                                        {option.pattern}
                                                    </div>
                                                    {showResult && isCorrect && (
                                                        <p className="text-green-400 font-bold">✓ Correct</p>
                                                    )}
                                                    {showResult && isSelected && !isCorrect && (
                                                        <p className="text-red-400 font-bold">✗ Wrong</p>
                                                    )}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}

                            {gameState === "result" && (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Trophy className="w-20 h-20 text-yellow-500 mx-auto" />
                                    <div className="text-5xl md:text-6xl font-black text-white">GAME OVER!</div>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Final Score</div>
                                            <div className="text-4xl font-bold text-accuracy">{score}/10</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
                                            <div className="text-4xl font-bold text-white">{accuracy}%</div>
                                        </div>
                                    </div>
                                    <Button
                                        variant="accuracy"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-6 h-6 mr-3" />
                                        PLAY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Pattern Matching Accuracy Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A pattern will appear on screen for a brief moment.",
                        "Memorize the exact pattern shown (dots and dashes).",
                        "After the pattern disappears, four options will appear.",
                        "Select the pattern that exactly matches what you saw.",
                        "Complete 10 rounds successfully to finish.",
                        "Patterns get more complex and show for less time as you progress."
                    ]}
                    benefits={[
                        "Improves visual memory and pattern recognition.",
                        "Enhances attention to detail and visual accuracy.",
                        "Trains working memory under time pressure.",
                        "Develops rapid visual processing skills.",
                        "Helps with quality control and visual inspection tasks."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
