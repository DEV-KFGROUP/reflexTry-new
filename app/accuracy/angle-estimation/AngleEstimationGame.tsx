"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Crosshair, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const TOTAL_ROUNDS = 10;

function randomAngle() {
    return Math.floor(Math.random() * 341) + 10; // 10-350
}

export default function AngleEstimationGame() {
    const content = getToolContent("angle-estimation", "Angle Estimation");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [round, setRound] = useState(0);
    const [targetAngle, setTargetAngle] = useState(90);
    const [userAngle, setUserAngle] = useState(90);
    const [scores, setScores] = useState<number[]>([]);
    const [feedback, setFeedback] = useState<{ diff: number; points: number } | null>(null);
    const [bestAvg, setBestAvg] = useState<number | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const drawAngle = useCallback((angle: number, color: string, ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) => {
        const rad = (angle - 90) * (Math.PI / 180);
        const endX = cx + radius * Math.cos(rad);
        const endY = cy + radius * Math.sin(rad);

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + radius, cy); // Base line (0°)
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();

        // Arc
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.3, 0, (angle - 90) * (Math.PI / 180), angle < 0);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || phase !== "playing") return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const size = canvas.width;
        const cx = size / 2;
        const cy = size / 2;
        const radius = size * 0.38;

        ctx.clearRect(0, 0, size, size);

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();

        // Target angle
        drawAngle(targetAngle, "#06b6d4", ctx, cx, cy, radius);

        // Angle label
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.font = "14px monospace";
        ctx.fillText(`${targetAngle}°`, cx + radius * 0.35, cy - 10);
    }, [targetAngle, phase, drawAngle]);

    const startGame = useCallback(() => {
        setRound(0);
        setScores([]);
        setFeedback(null);
        const angle = randomAngle();
        setTargetAngle(angle);
        setUserAngle(90);
        setPhase("playing");
        play("start");
    }, [play]);

    const submitAnswer = useCallback(() => {
        const diff = Math.abs(userAngle - targetAngle);
        const points = Math.max(0, 100 - diff * 2);
        const newScores = [...scores, points];
        setScores(newScores);
        setFeedback({ diff, points });
        play(diff <= 5 ? "success" : diff <= 15 ? "click" : "error");

        const nextRound = round + 1;
        setRound(nextRound);

        if (nextRound >= TOTAL_ROUNDS) {
            setTimeout(() => {
                const avg = Math.round(newScores.reduce((a, b) => a + b, 0) / newScores.length);
                setBestAvg(prev => prev === null ? avg : Math.max(prev, avg));
                setPhase("result");
            }, 1200);
        } else {
            setTimeout(() => {
                setFeedback(null);
                setTargetAngle(randomAngle());
                setUserAngle(90);
            }, 1200);
        }
    }, [userAngle, targetAngle, scores, round, play]);

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
                            Angle Estimation
                        </h1>
                        <p className="text-xl text-accuracy/80 font-medium tracking-wide mt-2 uppercase">Visual Precision Test</p>
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
                                <Crosshair className="w-16 h-16 text-accuracy mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Angle Estimation</h3>
                                <p className="text-gray-400 mb-6 max-w-md">See an angle on screen, then guess its degree value. The closer your guess, the higher your score!</p>
                                <Button variant="accuracy" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="text-center z-10 mt-16 w-full">
                                <canvas
                                    ref={canvasRef}
                                    width={280}
                                    height={280}
                                    className="mx-auto mb-4"
                                />

                                {feedback ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4"
                                    >
                                        <p className={`text-2xl font-bold ${feedback.points >= 80 ? 'text-green-400' : feedback.points >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                                            {feedback.points >= 80 ? '🎯 Excellent!' : feedback.points >= 50 ? '👍 Good!' : '😬 Off target'}
                                        </p>
                                        <p className="text-gray-400 text-sm">Off by {feedback.diff}° — {feedback.points} points</p>
                                    </motion.div>
                                ) : (
                                    <>
                                        <p className="text-gray-400 text-sm mb-2">Your guess:</p>
                                        <div className="text-5xl font-mono font-bold text-white mb-4">{userAngle}°</div>
                                        <input
                                            type="range"
                                            min={0}
                                            max={360}
                                            value={userAngle}
                                            onChange={e => setUserAngle(Number(e.target.value))}
                                            className="w-full max-w-xs mx-auto mb-4 accent-accuracy"
                                        />
                                        <div className="flex justify-center">
                                            <Button variant="accuracy" onClick={submitAnswer} className="px-8">
                                                Submit Guess
                                            </Button>
                                        </div>
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
                    title="Angle Estimation Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests spatial estimation accuracy.",
                        "Improves geometric intuition.",
                        "Trains visual precision.",
                        "Enhances mathematical reasoning.",
                        "Progressive scoring system."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin 10 rounds.",
                        "An angle appears on the canvas.",
                        "Use the slider to guess the angle in degrees.",
                        "Click 'Submit Guess' to see your accuracy.",
                        "Closer guesses earn more points (max 100)."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
