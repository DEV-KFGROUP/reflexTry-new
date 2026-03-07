"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Zap, Trophy, Play, RotateCcw } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const COLORS = [
    { name: "red", bg: "bg-red-500", light: "bg-red-400", shadow: "shadow-[0_0_30px_rgba(239,68,68,0.6)]" },
    { name: "green", bg: "bg-green-500", light: "bg-green-400", shadow: "shadow-[0_0_30px_rgba(34,197,94,0.6)]" },
    { name: "blue", bg: "bg-blue-500", light: "bg-blue-400", shadow: "shadow-[0_0_30px_rgba(59,130,246,0.6)]" },
    { name: "yellow", bg: "bg-yellow-500", light: "bg-yellow-400", shadow: "shadow-[0_0_30px_rgba(234,179,8,0.6)]" },
];

export default function SequenceReactionGame() {
    const content = getToolContent("sequence-reaction", "Sequence Reaction Test");
    const [gameState, setGameState] = useState<"idle" | "showing" | "playing" | "result">("idle");
    const [score, setScore] = useState(0);
    const [sequence, setSequence] = useState<number[]>([]);
    const [userSequence, setUserSequence] = useState<number[]>([]);
    const [round, setRound] = useState(1);
    const [startTime, setStartTime] = useState(0);
    const [reactionTimes, setReactionTimes] = useState<number[]>([]);
    const [currentShowingIndex, setCurrentShowingIndex] = useState(0);
    const { play } = useGameSound();

    const generateSequence = (length: number) => {
        const seq = [];
        for (let i = 0; i < length; i++) {
            seq.push(Math.floor(Math.random() * 4));
        }
        return seq;
    };

    const startGame = () => {
        setGameState("idle");
        setScore(0);
        setRound(1);
        setReactionTimes([]);
        const newSeq = generateSequence(3);
        setSequence(newSeq);
        setUserSequence([]);
        play("start");
        showSequence(newSeq);
    };

    const showSequence = (seq: number[]) => {
        setGameState("showing");
        setCurrentShowingIndex(0);

        let index = 0;
        const showNext = () => {
            if (index < seq.length) {
                setCurrentShowingIndex(index);
                setTimeout(() => {
                    index++;
                    if (index < seq.length) {
                        showNext();
                    } else {
                        setCurrentShowingIndex(-1);
                        setTimeout(() => {
                            setGameState("playing");
                            setStartTime(Date.now());
                        }, 500);
                    }
                }, 800);
            }
        };

        showNext();
    };

    const handleClick = (colorIndex: number) => {
        if (gameState !== "playing") return;

        const reactionTime = Date.now() - startTime;
        const newUserSeq = [...userSequence, colorIndex];
        setUserSequence(newUserSeq);

        if (colorIndex === sequence[userSequence.length]) {
            play("success");
            if (newUserSeq.length === sequence.length) {
                setReactionTimes(prev => [...prev, reactionTime]);
                setScore(s => s + sequence.length * 10);
                setRound(r => r + 1);

                if (round < 10) {
                    play("levelUp");
                    const newSeq = generateSequence(3 + Math.floor(round / 2));
                    setSequence(newSeq);
                    setUserSequence([]);
                    setTimeout(() => showSequence(newSeq), 1000);
                } else {
                    setGameState("result");
                    play("levelUp");
                }
            }
        } else {
            play("error");
            setGameState("result");
        }
    };

    const avgReactionTime = reactionTimes.length > 0
        ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
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
                            Sequence Reaction
                        </h1>
                        <p className="text-xl text-reflex/80 font-medium tracking-wide mt-2 uppercase">Memory + Speed</p>
                    </div>

                    {(gameState === "showing" || gameState === "playing") && (
                        <div className="flex justify-center gap-6 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Round</div>
                                <div className="text-3xl font-bold text-white">{round}/10</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Score</div>
                                <div className="text-3xl font-bold text-reflex">{score}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-reflex/30 min-w-[100px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Length</div>
                                <div className="text-3xl font-bold text-white">{sequence.length}</div>
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
                                    <Zap className="w-20 h-20 text-reflex mx-auto animate-pulse-game" />
                                    <h2 className="text-2xl font-bold text-white">Watch & Repeat</h2>
                                    <ul className="text-left text-gray-300 space-y-2 max-w-sm">
                                        <li>• Watch the sequence of colored lights</li>
                                        <li>• Click them in the same order</li>
                                        <li>• Sequences get longer each round</li>
                                        <li>• Complete 10 rounds to finish</li>
                                    </ul>
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

                            {(gameState === "showing" || gameState === "playing") && (
                                <motion.div
                                    key="game"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative z-20 space-y-6"
                                >
                                    <div className="grid grid-cols-2 gap-6 max-w-md mx-auto">
                                        {COLORS.map((color, index) => {
                                            const isActive = gameState === "showing" &&
                                                currentShowingIndex >= 0 &&
                                                sequence[currentShowingIndex] === index;
                                            const isUserClick = gameState === "playing" &&
                                                userSequence.length > 0 &&
                                                userSequence[userSequence.length - 1] === index;

                                            return (
                                                <motion.button
                                                    key={index}
                                                    onClick={() => handleClick(index)}
                                                    disabled={gameState === "showing"}
                                                    className={`h-28 md:h-36 rounded-2xl border-4 transition-all ${isActive || isUserClick
                                                            ? `${color.light} border-white ${color.shadow} scale-105`
                                                            : `${color.bg} border-transparent opacity-80`
                                                        }`}
                                                    animate={isActive ? {
                                                        scale: [1, 1.1, 1],
                                                    } : {}}
                                                    whileHover={gameState === "playing" ? { scale: 1.05, opacity: 1 } : {}}
                                                    whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
                                                />
                                            );
                                        })}
                                    </div>

                                    {gameState === "playing" && (
                                        <div className="text-center text-gray-400">
                                            Click the sequence: {userSequence.length}/{sequence.length}
                                        </div>
                                    )}

                                    {gameState === "showing" && (
                                        <div className="text-center text-reflex font-bold text-xl animate-pulse">
                                            Watch the sequence...
                                        </div>
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
                                    <div className="text-4xl font-bold text-white">GAME OVER!</div>
                                    <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto">
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Score</div>
                                            <div className="text-3xl font-bold text-reflex">{score}</div>
                                        </div>
                                        <div className="glass rounded-xl p-4">
                                            <div className="text-sm text-gray-400 uppercase tracking-widest mb-1">Rounds</div>
                                            <div className="text-3xl font-bold text-white">{round - 1}/10</div>
                                        </div>
                                    </div>
                                    {avgReactionTime > 0 && (
                                        <div className="text-lg text-gray-400">
                                            Avg Reaction: <span className="text-white font-bold">{avgReactionTime}ms</span>
                                        </div>
                                    )}
                                    <Button
                                        variant="reflex"
                                        size="lg"
                                        onClick={startGame}
                                        className="text-xl px-10 py-6 rounded-2xl"
                                    >
                                        <RotateCcw className="w-5 h-5 mr-3" />
                                        PLAY AGAIN
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Sequence Reaction Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Watch as colored lights flash in a sequence.",
                        "Memorize the order of the colors.",
                        "Click the colors in the same order as quickly as possible.",
                        "Sequences get longer as you progress.",
                        "Your reaction time is measured for each sequence.",
                        "Complete multiple rounds to improve your score."
                    ]}
                    benefits={[
                        "Combines memory training with reaction speed.",
                        "Improves working memory capacity.",
                        "Enhances sequential processing abilities.",
                        "Develops multitasking skills.",
                        "Useful for activities requiring both memory and speed."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
