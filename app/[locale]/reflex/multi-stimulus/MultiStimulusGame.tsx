"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Target, Zap, Trophy, Play, RotateCcw } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const COLORS = [
    { name: "red", bg: "bg-red-500", border: "border-red-300", text: "text-red-200" },
    { name: "green", bg: "bg-green-500", border: "border-green-300", text: "text-green-200" },
    { name: "blue", bg: "bg-blue-500", border: "border-blue-300", text: "text-blue-200" },
    { name: "yellow", bg: "bg-yellow-500", border: "border-yellow-300", text: "text-yellow-200" },
];

const INSTRUCTIONS = [
    { text: "Click the GREEN one", target: "green" },
    { text: "Click the RED one", target: "red" },
    { text: "Click the BLUE one", target: "blue" },
    { text: "Click the YELLOW one", target: "yellow" },
    { text: "Click the one that's DIFFERENT", target: "different" },
];

export default function MultiStimulusGame() {
    const content = getToolContent("multi-stimulus", "Multi-Stimulus Reaction Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "result">("idle");
    const [score, setScore] = useState(0);
    const [round, setRound] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [currentStimulus, setCurrentStimulus] = useState<{
        colors: typeof COLORS;
        target: number;
        instruction: string;
    } | null>(null);
    const [startTime, setStartTime] = useState(0);
    const [errors, setErrors] = useState(0);
    const { play } = useGameSound();

    const generateStimulus = () => {
        const shuffled = [...COLORS].sort(() => Math.random() - 0.5);
        const instruction = INSTRUCTIONS[Math.floor(Math.random() * INSTRUCTIONS.length)];
        let target = 0;

        if (instruction.target === "different") {
            const baseColor = shuffled[0];
            shuffled[0] = baseColor;
            shuffled[1] = baseColor;
            shuffled[2] = baseColor;
            shuffled[3] = COLORS.find(c => c.name !== baseColor.name)!;
            target = 3;
        } else {
            target = shuffled.findIndex(c => c.name === instruction.target);
        }

        setCurrentStimulus({ colors: shuffled, target, instruction: instruction.text });
        setStartTime(Date.now());
    };

    const startGame = () => {
        setGameState("playing");
        setScore(0);
        setRound(0);
        setReactionTimes([]);
        setErrors(0);
        generateStimulus();
        play("start");
    };

    const handleClick = (index: number) => {
        if (!currentStimulus || gameState !== "playing") return;

        const reactionTime = Date.now() - startTime;

        if (index === currentStimulus.target) {
            setScore(s => s + 1);
            setRound(r => r + 1);
            setReactionTimes(prev => [...prev, reactionTime]);
            play("success");

            if (round < 9) {
                setTimeout(generateStimulus, 500);
            } else {
                setGameState("result");
                play("levelUp");
            }
        } else {
            setErrors(e => e + 1);
            play("error");
            if (errors >= 2) {
                setGameState("result");
            } else {
                setTimeout(generateStimulus, 1000);
            }
        }
    };

    const avgReactionTime = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
        : 0;

    const bestReactionTime = reactionTimes.length > 0
        ? Math.min(...reactionTimes)
        : 0;

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
                            Multi-Stimulus
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Selective Attention Test</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Round</div>
                                <div className="text-3xl font-bold text-white">{round + 1}/10</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-reflex">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Errors</div>
                                <div className="text-3xl font-bold text-red-400">{errors}/3</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-reflex/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <Target className="w-24 h-24 text-reflex mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Selective Attention Challenge</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Follow the instruction and click the correct color as fast as possible!</p>
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-12 py-8 rounded-2xl"
                                    >
                                        <Play className="w-6 h-6 mr-3 fill-current" />
                                        START GAME
                                    </Button>
                                </motion.div>
                            )}

                            {gameState === "playing" && currentStimulus && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-8 relative z-20"
                                >
                                    <motion.p
                                        key={round}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-3xl font-bold text-reflex"
                                    >
                                        {currentStimulus.instruction}
                                    </motion.p>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        {currentStimulus.colors.map((color, index) => (
                                            <motion.button
                                                key={index}
                                                onClick={() => handleClick(index)}
                                                className={`h-32 md:h-40 rounded-2xl border-4 ${color.bg} ${color.border} shadow-lg`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            />
                                        ))}
                                    </div>
                                    {avgReactionTime > 0 && (
                                        <p className="text-gray-400">Avg Reaction: {avgReactionTime}ms</p>
                                    )}
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
                                            <div className="text-4xl font-bold text-reflex">{score}/10</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
                                            <div className="text-4xl font-bold text-white">{Math.round((score / (score + errors)) * 100) || 0}%</div>
                                        </div>
                                        {avgReactionTime > 0 && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Avg Time</div>
                                                <div className="text-4xl font-bold text-white">{avgReactionTime}ms</div>
                                            </div>
                                        )}
                                        {bestReactionTime > 0 && (
                                            <div className="glass rounded-xl p-4">
                                                <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Best Time</div>
                                                <div className="text-4xl font-bold text-green-400">{bestReactionTime}ms</div>
                                            </div>
                                        )}
                                    </div>
                                    <Button
                                        variant="reflex"
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
                    title="Multi-Stimulus Reaction Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Click 'Start Game' to begin.",
                        "Four colored boxes will appear on screen.",
                        "Read the instruction (e.g., 'Click the GREEN one').",
                        "Quickly identify and click the correct box.",
                        "Complete 10 rounds successfully to finish.",
                        "Your reaction time is measured for each round."
                    ]}
                    benefits={[
                        "Improves selective attention and decision-making speed.",
                        "Enhances ability to filter distractions.",
                        "Trains cognitive processing under pressure.",
                        "Develops rapid pattern recognition.",
                        "Useful for gaming, driving, and quick decision tasks."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
