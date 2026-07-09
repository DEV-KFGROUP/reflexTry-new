"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameEngine } from "@/lib/gaming/engine";
import { SoundManager } from "@/utils/soundManager";
import { Button } from "@/components/ui/Button";
import { GameBackground } from "@/components/GameBackground";
import { Play, RotateCcw, Trophy, Brain } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";

type ColorName = "Red" | "Blue" | "Green" | "Yellow";
const COLORS: Record<ColorName, string> = {
    Red: "#EF4444",
    Blue: "#3B82F6",
    Green: "#10B981",
    Yellow: "#EAB308"
};
const COLOR_NAMES = Object.keys(COLORS) as ColorName[];

interface FallingWord {
    id: number;
    text: ColorName;
    colorData: { name: ColorName, hex: string };
    y: number;
    speed: number;
}

export default function StroopDropClient() {
    const engine = useGameEngine();
    const isPlaying = engine.gameState === 'PLAYING';
    const containerRef = useRef<HTMLDivElement>(null);
    const requestRef = useRef<number>(0);
    const lastTimeRef = useRef<number>(0);

    // Game State
    const wordsRef = useRef<FallingWord[]>([]);
    const [renderWords, setRenderWords] = useState<FallingWord[]>([]);
    const difficultyMultiplierRef = useRef<number>(1);
    const nextSpawnTimeRef = useRef<number>(0);
    const wordIdRef = useRef<number>(0);

    const spawnWord = (currentTime: number) => {
        const text = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
        // 50% chance the color matches the text or doesn't
        let colorName: ColorName;
        if (Math.random() > 0.5) {
            colorName = text;
        } else {
            colorName = COLOR_NAMES[Math.floor(Math.random() * COLOR_NAMES.length)];
        }

        const baseSpeed = 50 + (Math.random() * 30);
        const speed = baseSpeed * difficultyMultiplierRef.current;

        wordsRef.current.push({
            id: wordIdRef.current++,
            text,
            colorData: { name: colorName, hex: COLORS[colorName] },
            y: -50,
            speed
        });
    };

    const gameOver = () => {
        SoundManager.play("miss");
        engine.endGame();
    };

    const handleColorClick = (clickedColor: ColorName) => {
        if (!isPlaying) return;
        if (wordsRef.current.length === 0) return;

        // Target the lowest word
        const targetWord = wordsRef.current[0];

        if (targetWord.colorData.name === clickedColor) {
            SoundManager.play("hit");
            engine.addScore(1); // 1 point per word
            wordsRef.current.shift(); // remove the word
            setRenderWords([...wordsRef.current]);

            // speed up game slightly with every correct hit to force pure endless scaling
            difficultyMultiplierRef.current += 0.05;
        } else {
            gameOver();
        }
    };

    const updateLoop = useCallback((time: number) => {
        if (engine.gameState !== 'PLAYING') return;

        if (!lastTimeRef.current) lastTimeRef.current = time;
        const deltaTimeMillis = time - lastTimeRef.current;
        const deltaTime = deltaTimeMillis / 1000;
        lastTimeRef.current = time;

        if (!containerRef.current) return;
        const { height } = containerRef.current.getBoundingClientRect();

        // Check if lowest word hit bottom
        if (wordsRef.current.length > 0) {
            const lowestWord = wordsRef.current[0];
            if (lowestWord.y > height - 100) { // accounting for button panel area
                gameOver();
                return;
            }
        }

        // Spawn logic - spawn if the last word has fallen far enough, or periodically
        const lastWord = wordsRef.current[wordsRef.current.length - 1];
        if (!lastWord || lastWord.y > 150) {
            if (time > nextSpawnTimeRef.current) {
                spawnWord(time);
                // The faster the difficulty, the shorter the forced spawn wait
                const spawnInterval = Math.max(400, 2000 / difficultyMultiplierRef.current);
                nextSpawnTimeRef.current = time + spawnInterval;
            }
        }

        // Drop words
        wordsRef.current.forEach(w => {
            w.y += w.speed * deltaTime;
        });

        setRenderWords([...wordsRef.current]);

        requestRef.current = requestAnimationFrame(updateLoop);
    }, [engine]);

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateLoop);
        } else {
            cancelAnimationFrame(requestRef.current);
        }
        return () => cancelAnimationFrame(requestRef.current);
    }, [isPlaying, updateLoop]);

    // Setup global keyboard listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isPlaying) return;
            switch (e.key.toLowerCase()) {
                case 'r': handleColorClick('Red'); break;
                case 'b': handleColorClick('Blue'); break;
                case 'g': handleColorClick('Green'); break;
                case 'y': handleColorClick('Yellow'); break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying]);

    const startGame = () => {
        wordsRef.current = [];
        setRenderWords([]);
        difficultyMultiplierRef.current = 1;
        wordIdRef.current = 0;
        nextSpawnTimeRef.current = 0;
        lastTimeRef.current = 0;
        engine.startGame({ duration: 0, mode: 'zen' });
    };

    return (
        <GameBackground variant="memory" showParticles={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-white to-blue-400 bg-clip-text text-transparent">
                            Stroop Drop
                        </h1>
                        <p className="text-xl text-blue-400/80 font-medium tracking-wide mt-2 uppercase">Infinite Cognitive Reflection</p>
                    </div>

                    <div className="flex justify-center gap-6 mt-8">
                        <div className="text-center p-4 glass rounded-xl border-blue-500/30 min-w-[200px]">
                            <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Words Cleared</div>
                            <div className="text-4xl font-mono font-bold text-white">
                                {engine.stats.score}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

                    <div
                        ref={containerRef}
                        className={`w-full h-[600px] relative rounded-[2rem] overflow-hidden backdrop-blur-xl border border-white/10 shadow-2xl bg-black/60 flex flex-col`}
                    >
                        {/* Play Area */}
                        <div className="flex-1 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {!isPlaying && engine.gameState !== 'COMPLETED' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/60 backdrop-blur-sm"
                                    >
                                        <Brain className="w-20 h-20 text-blue-500 mb-6 animate-pulse" />
                                        <h2 className="text-3xl font-bold text-white mb-4">Read the Color, Not the Word</h2>
                                        <p className="text-gray-400 mb-8 max-w-sm text-center">Words will fall from the top of the screen. Select the button matching the <span className="text-white font-bold">font color</span>. If you click the wrong color or let a word drop too low, you lose.</p>
                                        <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white text-xl px-12 py-8 rounded-2xl">
                                            <Play className="w-6 h-6 mr-3 fill-current" />
                                            BEGIN DROPPING
                                        </Button>
                                    </motion.div>
                                )}

                                {engine.gameState === 'COMPLETED' && (
                                    <motion.div
                                        key="completed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-black/80 backdrop-blur-sm"
                                    >
                                        <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                                        <div className="text-4xl font-bold text-white mb-2">MISTAKE MADE</div>
                                        <div className="my-8 text-center text-gray-300 text-lg">
                                            You correctly cleared <span className="font-mono text-3xl font-bold text-blue-400 mx-2">{engine.stats.score}</span> words.
                                        </div>
                                        <Button onClick={startGame} className="bg-blue-500 hover:bg-blue-600 text-white text-lg px-8 py-6 rounded-xl">
                                            <RotateCcw className="w-5 h-5 mr-2" />
                                            TRY AGAIN
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Render Words */}
                            {isPlaying && renderWords.map(w => (
                                <div
                                    key={w.id}
                                    className="absolute w-full text-center transition-none font-black tracking-widest text-4xl uppercase select-none drop-shadow-2xl"
                                    style={{
                                        top: w.y,
                                        color: w.colorData.hex,
                                        textShadow: '0px 0px 10px rgba(0,0,0,0.8)'
                                    }}
                                >
                                    {w.text}
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="h-28 w-full bg-black/80 border-t border-white/10 flex items-center justify-between px-6 gap-4 z-10 p-4">
                            {COLOR_NAMES.map(c => (
                                <button
                                    key={c}
                                    disabled={!isPlaying}
                                    onClick={() => handleColorClick(c)}
                                    className={`flex-1 h-full rounded-xl transition font-bold text-xl md:text-2xl text-white shadow-xl
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        hover:scale-105 active:scale-95`}
                                    style={{
                                        backgroundColor: COLORS[c],
                                    }}
                                >
                                    {c} <span className="opacity-50 text-sm ml-1 hidden md:inline">[{c.charAt(0)}]</span>
                                </button>
                            ))}
                        </div>

                    </div>
                </div>

                <ToolContent
                    title="Infinite Stroop Drop"
                    description="A fast-paced cognitive reflection test. Can you overcome your brain's automatic reading response?"
                    howToUse={[
                        { title: "Press Start. Words will begin falling." },
                        { title: "Look at the lowest word." },
                        { title: "Identify the FONT COLOR of the word." },
                        { title: "Click the matching colored button at the bottom (or press R, B, G, Y)." },
                        { title: "One mistake equals Game Over." }
                    ]}
                    howToImprove={[
                        { title: "Focus Technique", description: "Try looking slightly away from the word and focusing on the blur color instead of the sharp text." },
                        { title: "Hotkeys", description: "Use keyboard bindings to bypass mouse travel time." },
                        { title: "Relaxation", description: "Stay relaxed; overthinking triggers the reading reflex." }
                    ]}
                    howToPlay={[
                        "Identify FONT COLOR.",
                        "Press corresponding button.",
                        "Score += 1."
                    ]}
                    benefits={[
                        "Trains Cognitive Inhibition.",
                        "Strengthens the Anterior Cingulate Cortex.",
                        "Reduces impulsive decision making."
                    ]}
                    faqs={[
                        { question: "Why is it so hard?", answer: "Your brain processes reading much faster than color identification. The conflict between the two pathways creates the Stroop effect." },
                        { question: "Is there an end?", answer: "No, the speed scales infinitely until you drop a word or make an error." }
                    ]}
                    relatedTools={[]}
                />
            </div>
        </GameBackground>
    );
}
