"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Palette, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const COLORS = [
    { name: "Red", bg: "bg-red-500", hex: "#ef4444" },
    { name: "Blue", bg: "bg-blue-500", hex: "#3b82f6" },
    { name: "Green", bg: "bg-green-500", hex: "#22c55e" },
    { name: "Yellow", bg: "bg-yellow-400", hex: "#facc15" },
    { name: "Purple", bg: "bg-purple-500", hex: "#a855f7" },
    { name: "Orange", bg: "bg-orange-500", hex: "#f97316" },
];

const ROUNDS = 20;

function getRandomColor(exclude?: number) {
    let idx = Math.floor(Math.random() * COLORS.length);
    while (idx === exclude) idx = Math.floor(Math.random() * COLORS.length);
    return idx;
}

export default function ColorSwitchGame() {
    const content = getToolContent("color-switch", "Color Switch");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [round, setRound] = useState(0);
    const [targetColorIdx, setTargetColorIdx] = useState(0);
    const [displayColorIdx, setDisplayColorIdx] = useState(0);
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    const [roundStart, setRoundStart] = useState(0);
    const [bestAccuracy, setBestAccuracy] = useState(0);
    const [showFeedback, setShowFeedback] = useState<"correct" | "wrong" | null>(null);

    const nextRound = useCallback(() => {
        const target = getRandomColor();
        // Stroop-like: display text may show a DIFFERENT color name
        const display = Math.random() < 0.5 ? target : getRandomColor(target);
        setTargetColorIdx(target);
        setDisplayColorIdx(display);
        setRoundStart(Date.now());
        setShowFeedback(null);
    }, []);

    const startGame = useCallback(() => {
        setRound(0);
        setCorrect(0);
        setWrong(0);
        setTotalTime(0);
        setPhase("playing");
        play("start");
        nextRound();
    }, [play, nextRound]);

    const handleAnswer = useCallback((colorIdx: number) => {
        if (phase !== "playing") return;
        const reactionTime = Date.now() - roundStart;
        setTotalTime(t => t + reactionTime);

        const isCorrect = colorIdx === targetColorIdx;
        if (isCorrect) {
            setCorrect(c => c + 1);
            play("click");
            setShowFeedback("correct");
        } else {
            setWrong(w => w + 1);
            play("error");
            setShowFeedback("wrong");
        }

        const nextRoundNum = round + 1;
        setRound(nextRoundNum);

        if (nextRoundNum >= ROUNDS) {
            play("success");
            setTimeout(() => setPhase("result"), 400);
        } else {
            setTimeout(() => nextRound(), 300);
        }
    }, [phase, roundStart, targetColorIdx, round, play, nextRound]);

    useEffect(() => {
        if (phase === "result") {
            const accuracy = Math.round((correct / ROUNDS) * 100);
            setBestAccuracy(prev => Math.max(prev, accuracy));
        }
    }, [phase, correct]);

    const avgTime = round > 0 ? Math.round(totalTime / round) : 0;

    return (
        <GameBackground variant="reflex" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-reflex/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-reflex via-white to-reflex bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                            Color Switch
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Color Reaction Test</p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full max-w-3xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[480px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Round</div>
                                    <div className="text-4xl font-mono font-bold text-white">{round}/{ROUNDS}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Correct</div>
                                    <div className="text-4xl font-mono font-bold text-green-400">{correct}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Avg Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{avgTime}<span className="text-lg text-gray-500">ms</span></div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Palette className="w-16 h-16 text-reflex mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Color Switch</h3>
                                <p className="text-gray-400 mb-6 max-w-md">A color word appears in a <strong>different ink color</strong>. Click the button matching the <strong>INK COLOR</strong>, not the word!</p>
                                <Button variant="reflex" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="text-center z-10 mt-16">
                                {/* The word showing one color name, but displayed in a different color */}
                                <motion.div
                                    key={round}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="mb-8"
                                >
                                    <p className="text-sm text-gray-500 mb-2">What COLOR is this text?</p>
                                    <div
                                        className="text-6xl md:text-8xl font-black select-none"
                                        style={{ color: COLORS[targetColorIdx].hex }}
                                    >
                                        {COLORS[displayColorIdx].name}
                                    </div>
                                    {showFeedback && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mt-2 text-lg font-bold ${showFeedback === "correct" ? "text-green-400" : "text-red-400"}`}
                                        >
                                            {showFeedback === "correct" ? "✓ Correct!" : "✗ Wrong!"}
                                        </motion.div>
                                    )}
                                </motion.div>

                                {/* Color buttons */}
                                <div className="flex flex-wrap gap-3 justify-center max-w-md mx-auto">
                                    {COLORS.map((color, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`${color.bg} w-16 h-16 md:w-20 md:h-20 rounded-2xl text-white font-bold text-xs md:text-sm shadow-lg hover:scale-110 active:scale-95 transition-transform border-2 border-white/20`}
                                        >
                                            {color.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-reflex/30"
                            >
                                <Trophy className="w-12 h-12 text-reflex mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Complete!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {Math.round((correct / ROUNDS) * 100)}%
                                </div>
                                <p className="text-gray-400 mb-1">Correct: <span className="text-green-400 font-bold">{correct}</span> / {ROUNDS}</p>
                                <p className="text-gray-400 mb-2">Avg Reaction: <span className="text-white font-bold">{avgTime}ms</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best Accuracy: {bestAccuracy}%</p>
                                <Button variant="reflex" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Color Switch Reflex Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Trains selective attention.",
                        "Tests cognitive inhibition (Stroop effect).",
                        "Improves color reaction speed.",
                        "Enhances decision-making under pressure.",
                        "Fun, competitive challenge."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin 20 rounds.",
                        "A color word appears in a different ink color.",
                        "Click the button matching the INK COLOR of the text.",
                        "Ignore what the word says — focus on the color!",
                        "Aim for high accuracy and fast reactions."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
