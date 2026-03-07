"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Keyboard, Play, RotateCcw, Trophy } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const DATA_SAMPLES = [
    "The quick brown fox jumps over the lazy dog",
    "Sphinx of black quartz, judge my vow",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump",
    "Five quacking zephyrs jolt my wax bed",
    "Jaded zombies acted quaintly but kept driving their oxen forward",
];

export default function DataEntryClient() {
    const [target, setTarget] = useState(DATA_SAMPLES[0]);
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
    const { play } = useGameSound();

    const content = getToolContent("data-entry", "Data Entry");

    useEffect(() => {
        if (input.length === 1 && !startTime) setStartTime(Date.now());
        if (input === target && gameState === "playing") {
            const time = (Date.now() - startTime) / 1000 / 60; // minutes
            const words = target.split(" ").length;
            setWpm(Math.round(words / time));
            setGameState("finished");
            play("levelUp");
        }

        // Calculate accuracy
        if (input.length > 0) {
            let correct = 0;
            for (let i = 0; i < input.length; i++) {
                if (input[i] === target[i]) correct++;
            }
            setAccuracy(Math.round((correct / input.length) * 100));
        }
    }, [input, target, startTime, gameState, play]);

    const startGame = () => {
        setTarget(DATA_SAMPLES[Math.floor(Math.random() * DATA_SAMPLES.length)]);
        setInput("");
        setStartTime(0);
        setWpm(0);
        setAccuracy(100);
        setGameState("playing");
        play("start");
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (gameState !== "playing") return;
        const val = e.target.value;
        if (val.length > input.length) {
            play("click");
        }
        setInput(val);
    };

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
                            Data Entry
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">Accuracy Arena</p>
                    </div>

                    {gameState !== "idle" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">WPM</div>
                                <div className="text-4xl font-bold text-white">{wpm}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-accuracy/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-4xl font-bold text-accuracy">{accuracy}%</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-accuracy/10 via-speed/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <Keyboard className="w-24 h-24 text-accuracy mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Data Entry Speed Test</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Type the displayed text as quickly and accurately as possible to measure your data entry skills.</p>
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

                            {gameState === "playing" && (
                                <motion.div
                                    key="playing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="space-y-8 w-full max-w-2xl text-center relative z-20"
                                >
                                    <div className="p-6 bg-black/30 border border-accuracy/20 rounded-2xl text-xl font-mono text-left leading-relaxed">
                                        {target.split('').map((char, i) => {
                                            let color = "text-gray-500";
                                            if (i < input.length) {
                                                color = input[i] === char ? "text-accuracy" : "text-red-500";
                                            }
                                            return <span key={i} className={color}>{char}</span>;
                                        })}
                                    </div>

                                    <textarea
                                        value={input}
                                        onChange={handleInput}
                                        className="w-full p-6 bg-black/30 border-2 border-accuracy/30 rounded-2xl text-xl text-white focus:outline-none focus:border-accuracy font-mono resize-none"
                                        placeholder="Start typing..."
                                        autoFocus
                                        rows={3}
                                    />
                                </motion.div>
                            )}

                            {gameState === "finished" && (
                                <motion.div
                                    key="finished"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="text-center space-y-6 relative z-20"
                                >
                                    <Trophy className="w-20 h-20 text-accuracy mx-auto" />
                                    <div className="text-6xl md:text-7xl font-black text-accuracy drop-shadow-[0_0_30px_rgba(0,230,118,0.6)]">
                                        COMPLETE!
                                    </div>
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        <div className="bg-black/40 rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase mb-1">WPM</div>
                                            <div className="text-4xl font-bold text-white">{wpm}</div>
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
                    title="Data Entry"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Read the target text displayed on screen.",
                        "Type the text exactly as shown.",
                        "Watch your accuracy percentage in real-time.",
                        "Complete the text to see your WPM score."
                    ]}
                    benefits={[
                        "Improves typing speed and accuracy.",
                        "Enhances data entry efficiency.",
                        "Develops muscle memory for keyboard.",
                        "Trains attention to detail and precision."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
