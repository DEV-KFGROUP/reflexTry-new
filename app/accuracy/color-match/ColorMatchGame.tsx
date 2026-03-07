"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Palette, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const TOTAL_ROUNDS = 10;

function randomColor(): [number, number, number] {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
    ];
}

function colorDiff(c1: [number, number, number], c2: [number, number, number]): number {
    return Math.sqrt(
        Math.pow(c1[0] - c2[0], 2) +
        Math.pow(c1[1] - c2[1], 2) +
        Math.pow(c1[2] - c2[2], 2)
    );
}

function toHex(c: [number, number, number]): string {
    return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

export default function ColorMatchGame() {
    const content = getToolContent("color-match", "Color Match");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [round, setRound] = useState(0);
    const [target, setTarget] = useState<[number, number, number]>([128, 128, 128]);
    const [userColor, setUserColor] = useState<[number, number, number]>([128, 128, 128]);
    const [scores, setScores] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<{ diff: number; points: number } | null>(null);
    const [bestAvg, setBestAvg] = useState<number | null>(null);

    const startGame = useCallback(() => {
        setRound(0);
        setScores([]);
        setFeedback(null);
        setTarget(randomColor());
        setUserColor([128, 128, 128]);
        setPhase("playing");
        play("start");
    }, [play]);

    const submitAnswer = useCallback(() => {
        const diff = Math.round(colorDiff(target, userColor));
        const maxDiff = 441; // sqrt(255^2 * 3)
        const points = Math.max(0, Math.round(100 * (1 - diff / maxDiff)));
        const newScores = [...scores, points];
        setScores(newScores);
        setFeedback({ diff, points });
        play(points >= 80 ? "success" : points >= 50 ? "click" : "error");

        const nextRound = round + 1;
        setRound(nextRound);

        if (nextRound >= TOTAL_ROUNDS) {
            setTimeout(() => {
                const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
                setBestAvg(prev => prev === null ? avg : Math.max(prev, avg));
                setPhase("result");
            }, 1500);
        } else {
            setTimeout(() => {
                setFeedback(null);
                setTarget(randomColor());
                setUserColor([128, 128, 128]);
            }, 1500);
        }
    }, [target, userColor, scores, round, play]);

    const avgScore = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

    return (
        <GameBackground variant="accuracy" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-accuracy/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-accuracy via-white to-accuracy bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                            Color Match
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">RGB Color Accuracy</p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full max-w-3xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[520px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-accuracy uppercase tracking-widest font-bold mb-1">Round</div>
                                    <div className="text-4xl font-mono font-bold text-white">{Math.min(round + 1, TOTAL_ROUNDS)}/{TOTAL_ROUNDS}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-accuracy uppercase tracking-widest font-bold mb-1">Avg Score</div>
                                    <div className="text-4xl font-mono font-bold text-white">{avgScore}</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Palette className="w-16 h-16 text-accuracy mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Color Match</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Match the target color by adjusting RGB sliders. The closer you get, the more points you earn!</p>
                                <Button variant="accuracy" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="text-center z-10 mt-16 w-full max-w-md">
                                {/* Color comparison */}
                                <div className="flex gap-4 mb-6 justify-center">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Target</p>
                                        <div
                                            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-white/20 shadow-lg"
                                            style={{ backgroundColor: toHex(target) }}
                                        />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your Color</p>
                                        <div
                                            className="w-28 h-28 md:w-36 md:h-36 rounded-2xl border-2 border-white/20 shadow-lg"
                                            style={{ backgroundColor: toHex(userColor) }}
                                        />
                                    </div>
                                </div>

                                {feedback ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4"
                                    >
                                        <p className={`text-2xl font-bold ${feedback.points >= 80 ? 'text-green-400' : feedback.points >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {feedback.points >= 80 ? '🎨 Perfect eye!' : feedback.points >= 50 ? '👍 Close!' : '😬 Keep trying'}
                                        </p>
                                        <p className="text-gray-400 text-sm">{feedback.points} points</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* RGB Sliders */}
                                        <div className="space-y-3 mb-6">
                                            {[
                                                { label: "R", idx: 0, color: "accent-red-500" },
                                                { label: "G", idx: 1, color: "accent-green-500" },
                                                { label: "B", idx: 2, color: "accent-blue-500" },
                                            ].map(({ label, idx, color }) => (
                                                <div key={label} className="flex items-center gap-3">
                                                    <span className="text-sm font-bold text-gray-400 w-6">{label}</span>
                                                    <input
                                                        type="range"
                                                        min={0}
                                                        max={255}
                                                        value={userColor[idx]}
                                                        onChange={e => {
                                                            const newColor = [...userColor] as [number, number, number];
                                                            newColor[idx] = Number(e.target.value);
                                                            setUserColor(newColor);
                                                        }}
                                                        className={`flex-1 ${color}`}
                                                    />
                                                    <span className="text-sm font-mono text-gray-400 w-8">{userColor[idx]}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <Button variant="accuracy" onClick={submitAnswer} className="px-8">
                                            Submit Color
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-accuracy/30"
                            >
                                <Trophy className="w-12 h-12 text-accuracy mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Complete!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {avgScore} <span className="text-2xl text-accuracy">avg pts</span>
                                </div>
                                {bestAvg && <p className="text-gray-500 mb-6 text-sm">Best Average: {bestAvg} pts</p>}
                                <Button variant="accuracy" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Color Match Accuracy Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests color perception accuracy.",
                        "Trains fine-tuned visual discrimination.",
                        "Enhances color mixing intuition.",
                        "Useful for designers and artists.",
                        "Progressive scoring system."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin 10 rounds.",
                        "A target color appears on the left.",
                        "Adjust the R, G, B sliders to match it.",
                        "Click 'Submit Color' to see your accuracy.",
                        "Closer matches earn more points (max 100)."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
