"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Hash, Play, RotateCcw, Trophy, Clock } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface NumberTile {
    value: number;
    x: number;
    y: number;
    found: boolean;
}

function generateTiles(count: number): NumberTile[] {
    const tiles: NumberTile[] = [];
    const usedPositions: { x: number; y: number }[] = [];

    for (let i = 1; i <= count; i++) {
        let x: number, y: number;
        let attempts = 0;
        do {
            x = 10 + Math.random() * 75;
            y = 10 + Math.random() * 75;
            attempts++;
        } while (
            attempts < 50 &&
            usedPositions.some(p => Math.abs(p.x - x) < 12 && Math.abs(p.y - y) < 12)
        );
        usedPositions.push({ x, y });
        tiles.push({ value: i, x, y, found: false });
    }
    return tiles;
}

export default function NumberRushGame() {
    const content = getToolContent("number-rush", "Number Rush");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [tiles, setTiles] = useState<NumberTile[]>([]);
    const [nextNumber, setNextNumber] = useState(1);
    const [totalNumbers, setTotalNumbers] = useState(15);
    const [timer, setTimer] = useState(0);
    const [bestTime, setBestTime] = useState<number | null>(null);
    const [lastClickCorrect, setLastClickCorrect] = useState<boolean | null>(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => setTimer(Date.now() - startTimeRef.current), 50);
        return () => clearInterval(t);
    }, [phase]);

    const startGame = useCallback(() => {
        const newTiles = generateTiles(totalNumbers);
        setTiles(newTiles);
        setNextNumber(1);
        startTimeRef.current = Date.now();
        setTimer(0);
        setLastClickCorrect(null);
        setPhase("playing");
        play("start");
    }, [totalNumbers, play]);

    const handleTileClick = useCallback((value: number) => {
        if (value !== nextNumber) {
            play("error");
            setLastClickCorrect(false);
            return;
        }

        play("click");
        setLastClickCorrect(true);
        setTiles(prev => prev.map(t => t.value === value ? { ...t, found: true } : t));

        if (value === totalNumbers) {
            const finalTime = Date.now() - startTimeRef.current;
            setTimer(finalTime);
            setBestTime(prev => prev === null ? finalTime : Math.min(prev, finalTime));
            play("success");
            setPhase("result");
        } else {
            setNextNumber(value + 1);
        }
    }, [nextNumber, totalNumbers, play]);

    const formatTime = (ms: number) => {
        const s = ms / 1000;
        return s.toFixed(2);
    };

    return (
        <GameBackground variant="speed" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-speed/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-speed via-white to-speed bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                            Number Rush
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Speed Scanning Test</p>
                    </div>

                    {phase === "idle" && (
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {[10, 15, 25].map(count => (
                                <button
                                    key={count}
                                    onClick={() => setTotalNumbers(count)}
                                    className={`px-6 py-2 rounded-lg font-bold border-2 transition-all duration-200 ${totalNumbers === count
                                        ? 'bg-speed/20 border-speed text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                        : 'bg-black/20 border-white/10 text-gray-400 hover:border-speed/50 hover:text-white'}`}
                                >
                                    {count} Numbers
                                </button>
                            ))}
                        </div>
                    )}
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
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Find</div>
                                    <div className="text-5xl font-mono font-bold text-speed">{nextNumber}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Progress</div>
                                    <div className="text-4xl font-mono font-bold text-white">{nextNumber - 1}/{totalNumbers}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{formatTime(timer)}s</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Hash className="w-16 h-16 text-speed mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Number Rush</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Find and click numbers from 1 to {totalNumbers} in order, as fast as possible!</p>
                                <Button variant="speed" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="relative w-full h-[380px] mt-16 z-10">
                                {tiles.map(tile => (
                                    <motion.button
                                        key={tile.value}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: tile.found ? 0 : 1,
                                            opacity: tile.found ? 0 : 1,
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        onClick={() => handleTileClick(tile.value)}
                                        className={`absolute w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-bold text-lg md:text-xl cursor-pointer border-2 transition-colors ${tile.found
                                                ? 'bg-speed/20 border-speed/40 text-speed/40'
                                                : tile.value === nextNumber
                                                    ? 'bg-speed/10 border-speed/40 text-white hover:bg-speed/20 hover:scale-110'
                                                    : 'bg-black/40 border-white/10 text-gray-300 hover:border-speed/30 hover:bg-black/30'
                                            }`}
                                        style={{ left: `${tile.x}%`, top: `${tile.y}%` }}
                                    >
                                        {tile.value}
                                    </motion.button>
                                ))}

                                <AnimatePresence>
                                    {lastClickCorrect === false && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                                        >
                                            <span className="text-red-400 text-xl font-bold bg-black/60 px-4 py-2 rounded-xl">Wrong! Find {nextNumber}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-speed/30"
                            >
                                <Trophy className="w-12 h-12 text-speed mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Complete!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {formatTime(timer)}<span className="text-2xl text-speed">s</span>
                                </div>
                                {bestTime && <p className="text-gray-500 mb-6 text-sm">Best: {formatTime(bestTime)}s</p>}
                                <Button variant="speed" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Number Rush Speed Test"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests visual scanning speed.",
                        "Improves number processing ability.",
                        "Trains spatial awareness.",
                        "Enhances focus under pressure.",
                        "Fast-paced addictive gameplay."
                    ]}
                    howToPlay={[
                        "Choose how many numbers (10, 15, or 25).",
                        "Click 'Start' to begin.",
                        "Find and click numbers in order: 1, 2, 3...",
                        "Numbers are scattered randomly on screen.",
                        "Complete the sequence as fast as possible!"
                    ]}
                />
            </div>
        </GameBackground>
    );
}
