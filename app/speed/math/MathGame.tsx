"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Calculator, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

export default function MathGame() {
    const content = getToolContent("speed-math", "Speed Math Test");
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const [timeLeft, setTimeLeft] = useState(60);
    const [score, setScore] = useState(0);
    const [problem, setProblem] = useState("");
    const [answer, setAnswer] = useState(0);
    const [userAnswer, setUserAnswer] = useState("");
    const { play } = useGameSound();

    const generateProblem = () => {
        const ops = ["+", "-", "*"];
        const op = ops[Math.floor(Math.random() * 3)];
        let a = Math.floor(Math.random() * 10) + 1;
        let b = Math.floor(Math.random() * 10) + 1;

        if (score > 10) {
            a = Math.floor(Math.random() * 20) + 1;
            b = Math.floor(Math.random() * 20) + 1;
        }

        if (op === "*") {
            a = Math.floor(Math.random() * 12) + 1;
            b = Math.floor(Math.random() * 12) + 1;
        }

        setProblem(`${a} ${op} ${b}`);
        // eslint-disable-next-line no-eval
        setAnswer(eval(`${a} ${op} ${b}`));
        setUserAnswer("");
    };

    const startGame = () => {
        setScore(0);
        setTimeLeft(60);
        setGameState("playing");
        generateProblem();
        play("start");
    };

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        const num = parseInt(userAnswer);
        if (!isNaN(num) && num === answer) {
            setScore(s => s + 1);
            play("success");
            generateProblem();
        } else {
            play("error");
            setUserAnswer("");
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
                            Speed Math
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Mental Calculation</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Time</div>
                                <div className="text-4xl font-bold text-white">{timeLeft}s</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-speed/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Correct</div>
                                <div className="text-4xl font-bold text-speed">{score}</div>
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
                                    <Calculator className="w-24 h-24 text-speed mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Solve Math Problems Fast!</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Solve as many arithmetic problems as you can in 60 seconds.</p>
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
                                    <div className="text-8xl font-black text-speed drop-shadow-[0_0_30px_rgba(0,229,255,0.8)]">
                                        {score}
                                    </div>
                                    <p className="text-2xl text-gray-400">Correct Answers</p>
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
                                    className="text-center space-y-8 w-full max-w-md relative z-20"
                                >
                                    <motion.div
                                        key={problem}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-7xl md:text-8xl font-bold text-white font-mono tracking-wider drop-shadow-[0_0_20px_rgba(0,229,255,0.5)]"
                                    >
                                        {problem}
                                    </motion.div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <input
                                            type="number"
                                            value={userAnswer}
                                            onChange={(e) => setUserAnswer(e.target.value)}
                                            className="w-full bg-white/10 border-b-4 border-speed/50 text-center text-5xl py-4 text-white outline-none focus:border-speed transition-colors font-mono rounded-xl"
                                            autoFocus
                                            placeholder="?"
                                        />
                                        <Button type="submit" variant="speed" size="lg" className="w-full text-xl py-6">
                                            SUBMIT
                                        </Button>
                                    </form>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Speed Math Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "A math problem (+, -, *) will appear.",
                        "Calculate the answer mentally.",
                        "Type the answer and press Enter.",
                        "Solve as many as possible within 60 seconds.",
                        "Correct answers increase your score."
                    ]}
                    benefits={[
                        "Increases mental math calculation speed.",
                        "Improves numerical fluency.",
                        "Keeps the brain active and sharp.",
                        "Useful practice for standardized tests and daily estimation."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
