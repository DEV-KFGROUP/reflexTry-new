"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { ArrowUpDown, Play, RotateCcw, Trophy, Clock } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface SortItem {
    id: number;
    label: string;
    category: string;
    emoji: string;
}

const CATEGORIES_DATA: Record<string, { items: { label: string; emoji: string }[], color: string }> = {
    "Fruit": {
        items: [
            { label: "Apple", emoji: "🍎" }, { label: "Banana", emoji: "🍌" }, { label: "Cherry", emoji: "🍒" },
            { label: "Grapes", emoji: "🍇" }, { label: "Orange", emoji: "🍊" }, { label: "Mango", emoji: "🥭" },
        ],
        color: "bg-green-500/20 border-green-500/40"
    },
    "Animal": {
        items: [
            { label: "Dog", emoji: "🐕" }, { label: "Cat", emoji: "🐈" }, { label: "Bird", emoji: "🐦" },
            { label: "Fish", emoji: "🐟" }, { label: "Horse", emoji: "🐴" }, { label: "Rabbit", emoji: "🐇" },
        ],
        color: "bg-amber-500/20 border-amber-500/40"
    },
    "Vehicle": {
        items: [
            { label: "Car", emoji: "🚗" }, { label: "Train", emoji: "🚂" }, { label: "Plane", emoji: "✈️" },
            { label: "Boat", emoji: "⛵" }, { label: "Bus", emoji: "🚌" }, { label: "Bike", emoji: "🚲" },
        ],
        color: "bg-blue-500/20 border-blue-500/40"
    },
    "Sport": {
        items: [
            { label: "Soccer", emoji: "⚽" }, { label: "Tennis", emoji: "🎾" }, { label: "Basketball", emoji: "🏀" },
            { label: "Golf", emoji: "⛳" }, { label: "Swimming", emoji: "🏊" }, { label: "Baseball", emoji: "⚾" },
        ],
        color: "bg-purple-500/20 border-purple-500/40"
    },
};

function generateRound(): { items: SortItem[], categories: string[] } {
    const allCategoryNames = Object.keys(CATEGORIES_DATA);
    const shuffled = [...allCategoryNames].sort(() => Math.random() - 0.5);
    const selectedCategories = shuffled.slice(0, 3);

    let id = 0;
    const items: SortItem[] = [];
    selectedCategories.forEach(cat => {
        const catItems = [...CATEGORIES_DATA[cat].items].sort(() => Math.random() - 0.5).slice(0, 3);
        catItems.forEach(item => {
            items.push({ id: id++, label: item.label, category: cat, emoji: item.emoji });
        });
    });

    return { items: items.sort(() => Math.random() - 0.5), categories: selectedCategories };
}

const GAME_TIME = 45;

export default function QuickSortGame() {
    const content = getToolContent("quick-sort", "Quick Sort");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [items, setItems] = useState<SortItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [currentItem, setCurrentItem] = useState<SortItem | null>(null);
    const [sorted, setSorted] = useState(0);
    const [errors, setErrors] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_TIME);
    const [bestScore, setBestScore] = useState(0);
    const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

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

    const nextItem = useCallback((itemList: SortItem[]) => {
        const remaining = itemList.filter(i => !i.id.toString().startsWith("done-"));
        if (remaining.length === 0) {
            // Generate new round
            const { items: newItems, categories: newCats } = generateRound();
            setItems(newItems);
            setCategories(newCats);
            setCurrentItem(newItems[0]);
        } else {
            setCurrentItem(remaining[0]);
        }
    }, []);

    const startGame = useCallback(() => {
        const { items: newItems, categories: newCats } = generateRound();
        setItems(newItems);
        setCategories(newCats);
        setCurrentItem(newItems[0]);
        setSorted(0);
        setErrors(0);
        setTimeLeft(GAME_TIME);
        setFeedback(null);
        setPhase("playing");
        play("start");
    }, [play]);

    const handleSort = useCallback((category: string) => {
        if (!currentItem || phase !== "playing") return;

        if (currentItem.category === category) {
            play("click");
            setSorted(s => s + 1);
            setFeedback("correct");
            const updatedItems = items.filter(i => i.id !== currentItem.id);
            setItems(updatedItems);
            setTimeout(() => {
                setFeedback(null);
                nextItem(updatedItems);
            }, 200);
        } else {
            play("error");
            setErrors(e => e + 1);
            setFeedback("wrong");
            setTimeout(() => setFeedback(null), 300);
        }
    }, [currentItem, phase, items, play, nextItem]);

    useEffect(() => {
        if (phase === "result") {
            setBestScore(prev => Math.max(prev, sorted));
        }
    }, [phase, sorted]);

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
                            Quick Sort
                        </h1>
                        <p className="text-xl text-speed/80 font-medium tracking-wide mt-2 uppercase">Category Speed Sort</p>
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
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Sorted</div>
                                    <div className="text-4xl font-mono font-bold text-white">{sorted}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{timeLeft}s</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-speed uppercase tracking-widest font-bold mb-1">Errors</div>
                                    <div className="text-4xl font-mono font-bold text-red-400">{errors}</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <ArrowUpDown className="w-16 h-16 text-speed mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Quick Sort</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Sort items into the correct category as fast as you can! {GAME_TIME}s to sort as many as possible.</p>
                                <Button variant="speed" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && currentItem && (
                            <div className="text-center z-10 mt-16 w-full">
                                {/* Current item to sort */}
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentItem.id}
                                        initial={{ opacity: 0, y: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="mb-8"
                                    >
                                        <span className="text-5xl mb-2 block">{currentItem.emoji}</span>
                                        <span className="text-3xl font-bold text-white">{currentItem.label}</span>
                                    </motion.div>
                                </AnimatePresence>

                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`mb-3 text-lg font-bold ${feedback === "correct" ? "text-green-400" : "text-red-400"}`}
                                    >
                                        {feedback === "correct" ? "✓ Correct!" : "✗ Wrong!"}
                                    </motion.div>
                                )}

                                {/* Category bins */}
                                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => handleSort(cat)}
                                            className={`${CATEGORIES_DATA[cat].color} rounded-2xl p-6 border-2 cursor-pointer hover:scale-105 active:scale-95 transition-transform`}
                                        >
                                            <span className="text-white font-bold text-lg">{cat}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-speed/30"
                            >
                                <Trophy className="w-12 h-12 text-speed mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Time&apos;s Up!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {sorted} <span className="text-2xl text-speed">sorted</span>
                                </div>
                                <p className="text-gray-400 mb-1">Errors: <span className="text-red-400 font-bold">{errors}</span></p>
                                <p className="text-gray-400 mb-2">Accuracy: <span className="text-white font-bold">{sorted + errors > 0 ? Math.round(sorted / (sorted + errors) * 100) : 0}%</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best: {bestScore} sorted</p>
                                <Button variant="speed" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Quick Sort Speed Game"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests rapid categorization speed.",
                        "Improves decision-making under pressure.",
                        "Trains cognitive processing speed.",
                        "Enhances pattern recognition.",
                        "Fun, competitive gameplay."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin the 45-second challenge.",
                        "An item appears with its emoji and name.",
                        "Click the correct category bin to sort it.",
                        "Sort as many items as possible before time runs out.",
                        "Wrong answers count as errors — aim for accuracy!"
                    ]}
                />
            </div>
        </GameBackground>
    );
}
