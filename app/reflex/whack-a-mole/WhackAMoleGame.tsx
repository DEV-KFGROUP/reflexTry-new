"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Play, RotateCcw, Trophy, Zap } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface Mole {
    id: number;
    hole: number;
    appearedAt: number;
}

const HOLES = 9;
const GAME_DURATION = 30;

export default function WhackAMoleGame() {
    const content = getToolContent("whack-a-mole", "Whack-a-Mole");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [score, setScore] = useState(0);
    const [misses, setMisses] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [moles, setMoles] = useState<Mole[]>([]);
    const [whacked, setWhacked] = useState<number[]>([]);
    const [bestScore, setBestScore] = useState(0);
    const moleIdRef = useRef(0);

    // Game timer
    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setPhase("result");
                    play("success");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(t);
    }, [phase, play]);

    // Spawn moles
    useEffect(() => {
        if (phase !== "playing") return;
        const spawnRate = Math.max(400, 1200 - score * 30);

        const t = setInterval(() => {
            const hole = Math.floor(Math.random() * HOLES);
            moleIdRef.current += 1;
            const newMole: Mole = { id: moleIdRef.current, hole, appearedAt: Date.now() };

            setMoles(prev => {
                const filtered = prev.filter(m => Date.now() - m.appearedAt < 1500);
                return [...filtered, newMole];
            });
        }, spawnRate);
        return () => clearInterval(t);
    }, [phase, score]);

    // Remove expired moles
    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => {
            setMoles(prev => {
                const now = Date.now();
                const expired = prev.filter(m => now - m.appearedAt >= 1500 && !whacked.includes(m.id));
                if (expired.length > 0) setMisses(m => m + expired.length);
                return prev.filter(m => now - m.appearedAt < 1500);
            });
        }, 200);
        return () => clearInterval(t);
    }, [phase, whacked]);

    const startGame = useCallback(() => {
        setScore(0);
        setMisses(0);
        setTimeLeft(GAME_DURATION);
        setMoles([]);
        setWhacked([]);
        moleIdRef.current = 0;
        setPhase("playing");
        play("start");
    }, [play]);

    const whackMole = useCallback((moleId: number) => {
        if (whacked.includes(moleId)) return;
        setWhacked(prev => [...prev, moleId]);
        setScore(s => s + 1);
        setMoles(prev => prev.filter(m => m.id !== moleId));
        play("click");
    }, [whacked, play]);

    useEffect(() => {
        if (phase === "result") {
            setBestScore(prev => Math.max(prev, score));
        }
    }, [phase, score]);

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
                            Whack-a-Mole
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Reaction Speed Test</p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full max-w-3xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[500px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Score</div>
                                    <div className="text-4xl font-mono font-bold text-white">{score}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{timeLeft}s</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-reflex uppercase tracking-widest font-bold mb-1">Missed</div>
                                    <div className="text-4xl font-mono font-bold text-red-400">{misses}</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <div className="text-6xl mb-4">🐹</div>
                                <h3 className="text-2xl font-bold text-white mb-2">Whack-a-Mole</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Tap the moles as fast as you can before they disappear! {GAME_DURATION}s challenge.</p>
                                <Button variant="reflex" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="grid grid-cols-3 gap-4 mt-20 w-full max-w-md z-10">
                                {Array.from({ length: HOLES }).map((_, holeIndex) => {
                                    const activeMole = moles.find(m => m.hole === holeIndex);
                                    return (
                                        <div
                                            key={holeIndex}
                                            className="aspect-square rounded-full bg-black/40 border-2 border-white/10 flex items-center justify-center relative overflow-hidden"
                                        >
                                            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-amber-900/30 to-transparent rounded-b-full" />
                                            <AnimatePresence>
                                                {activeMole && (
                                                    <motion.button
                                                        key={activeMole.id}
                                                        initial={{ y: 40, scale: 0.5 }}
                                                        animate={{ y: 0, scale: 1 }}
                                                        exit={{ y: 40, scale: 0.5, opacity: 0 }}
                                                        transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                                        onClick={() => whackMole(activeMole.id)}
                                                        className="text-5xl cursor-pointer active:scale-75 transition-transform z-10 hover:scale-110"
                                                    >
                                                        🐹
                                                    </motion.button>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-reflex/30"
                            >
                                <Trophy className="w-12 h-12 text-reflex mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Time&apos;s Up!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {score} <span className="text-2xl text-reflex">hits</span>
                                </div>
                                <p className="text-gray-400 mb-1">Missed: <span className="text-red-400 font-bold">{misses}</span></p>
                                <p className="text-gray-400 mb-2">Accuracy: <span className="text-white font-bold">{score + misses > 0 ? Math.round(score / (score + misses) * 100) : 0}%</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best: {bestScore} hits</p>
                                <Button variant="reflex" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Whack-a-Mole Game"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests reaction speed and reflexes.",
                        "Improves hand-eye coordination.",
                        "Trains peripheral vision.",
                        "Fun, addictive gameplay.",
                        "Progressive difficulty as you improve."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin the 30-second challenge.",
                        "Moles pop up from holes randomly.",
                        "Tap/click them before they disappear!",
                        "Moles appear faster as your score increases.",
                        "Try to get the highest score with fewest misses."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
