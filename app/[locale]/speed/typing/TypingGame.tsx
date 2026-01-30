"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Play, RotateCcw, Keyboard, Trophy, Zap, Clock } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const PARAGRAPHS = [
    "The quick brown fox jumps over the lazy dog. This is a classic sentence used to test typing speed and accuracy because it contains every letter of the alphabet.",
    "Typing is a skill that can be improved with daily practice. Focus on accuracy first, and speed will naturally follow as your muscle memory improves.",
    "In a world dominated by technology, efficient keyboard skills are more important than ever. Whether you are coding, writing emails, or gaming, fast fingers save time.",
    "Reaction time and typing speed are closely linked. The ability to process visual information and translate it into finger movements is key to high WPM scores."
];

export default function TypingGame() {
    const content = getToolContent("typing-speed", "Typing Speed Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "finished">("idle");
    const [text, setText] = useState("");
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const { play } = useGameSound();

    const startGame = () => {
        const randText = PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];
        setText(randText);
        setInput("");
        setGameState("playing");
        setStartTime(Date.now());
        setWpm(0);
        setAccuracy(100);
        play("start");
        setTimeout(() => inputRef.current?.focus(), 100);
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const val = e.target.value;
        const currentLength = input.length;
        const char = val.slice(-1);

        // Play sound on keypress (only for new chars)
        if (val.length > currentLength) {
            play("click");
        }

        setInput(val);

        if (startTime === 0) setStartTime(Date.now()); // Fallback start

        // Calc stats live
        const chars = val.length;
        const words = chars / 5;
        const mins = (Date.now() - startTime) / 60000;
        if (mins > 0) setWpm(Math.round(words / mins));

        // Accuracy
        let errors = 0;
        for (let i = 0; i < val.length; i++) {
            if (val[i] !== text[i]) errors++;
        }
        setAccuracy(Math.max(0, Math.round(((chars - errors) / chars) * 100)));

        // Finish check
        if (val === text) {
            setGameState("finished");
            play("success");
            setTimeout(() => play("levelUp"), 500);
        }
    };

    return (
        <GameBackground variant="speed" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-6 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-speed/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-speed via-white to-speed bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            Typing Arena
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Speed Test</p>
                    </div>

                    {gameState !== "idle" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">WPM</div>
                                <div className="text-4xl font-bold text-white">{wpm}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
                                <div className="text-4xl font-bold text-speed">{accuracy}%</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-5xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-speed/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div className="hud-frame w-full min-h-[500px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden text-left">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {gameState === "idle" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6 relative z-20"
                            >
                                <Keyboard className="w-24 h-24 text-speed mx-auto animate-pulse-game" />
                                <h2 className="text-3xl font-bold text-white">Initialize Typing Protocol</h2>
                                <p className="text-gray-400 max-w-md mx-auto">Type the paragraph exactly as shown. Speed and accuracy determine your score.</p>
                                <Button
                                    variant="speed"
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
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full relative z-20 space-y-8"
                            >
                                <div className="relative bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-inner min-h-[200px] flex items-center">
                                    <div className="pointer-events-none select-none font-mono text-xl md:text-2xl leading-relaxed break-words w-full">
                                        {text.split('').map((char, i) => {
                                            let className = "text-gray-600";
                                            if (i < input.length) {
                                                className = input[i] === char
                                                    ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                                    : "text-red-400 border-b-2 border-red-500 bg-red-500/10";
                                            } else if (i === input.length) {
                                                className = "text-speed bg-speed/20 border-b-2 border-speed animate-pulse";
                                            }
                                            return (
                                                <span key={i} className={className}>
                                                    {char === ' ' ? '\u00A0' : char}
                                                </span>
                                            );
                                        })}
                                    </div>
                                    <textarea
                                        ref={inputRef}
                                        value={input}
                                        onChange={handleInput}
                                        className="absolute inset-0 opacity-0 cursor-text resize-none w-full h-full font-mono text-lg"
                                        autoFocus
                                        spellCheck={false}
                                    />
                                </div>
                                <p className="text-center text-speed/50 text-sm animate-pulse tracking-widest uppercase">Keystrokes Detected...</p>
                            </motion.div>
                        )}

                        {gameState === "finished" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-8 relative z-20"
                            >
                                <div className="text-6xl md:text-8xl font-black text-white mb-4 drop-shadow-[0_0_30px_rgba(6,182,212,0.6)]">
                                    TEST COMPLETE
                                </div>

                                <div className="grid grid-cols-2 gap-8 max-w-lg mx-auto">
                                    <div className="bg-black/40 rounded-2xl p-6 border border-speed/30">
                                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Speed</div>
                                        <div className="text-5xl font-bold text-white">{wpm} <span className="text-xl text-speed">WPM</span></div>
                                    </div>
                                    <div className="bg-black/40 rounded-2xl p-6 border border-reflex/30">
                                        <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Accuracy</div>
                                        <div className="text-5xl font-bold text-white">{accuracy}<span className="text-xl text-reflex">%</span></div>
                                    </div>
                                </div>

                                <Button
                                    variant="speed"
                                    size="lg"
                                    onClick={startGame}
                                    className="text-xl px-12 py-6 rounded-2xl"
                                >
                                    <RotateCcw className="w-6 h-6 mr-3" />
                                    RETEST SPEED
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </div>

                <ToolContent
                    title="Typing Speed Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Improves typing speed (WPM).",
                        "Enhances keyboard accuracy.",
                        "Builds muscle memory for common words.",
                        "Essential skill for productivity and coding."
                    ]}
                    howToPlay={[
                        "Click 'Start Test' to engage the protocol.",
                        "Type the text accurately as it appears.",
                        "Correct characters glow white.",
                        "Errors light up red - correct them if you wish.",
                        "Complete the text to see your final stats."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
