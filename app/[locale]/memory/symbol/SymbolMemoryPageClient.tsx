"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Anchor, Aperture, Archive, Award, Bell, Bird, Camera, Cloud, Code, Coins, Compass, Crown, Diamond, Feather, Flag, Flame, Gift, Heart, Image as ImageIcon, Key, Map, Moon, Music, Package, Pen, Phone, Star, Sun, Tag, Umbrella, Play, RotateCcw, Puzzle } from "lucide-react";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const ICONS = [Anchor, Aperture, Archive, Award, Bell, Bird, Camera, Cloud, Code, Coins, Compass, Crown, Diamond, Feather, Flag, Flame, Gift, Heart, ImageIcon, Key, Map, Moon, Music, Package, Pen, Phone, Star, Sun, Tag, Umbrella];

interface Card {
    id: number;
    iconIdx: number;
    isFlipped: boolean;
    isMatched: boolean;
}

export default function SymbolMemoryPageClient() {
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
    const { play } = useGameSound();

    const content = getToolContent("symbol-memory", "Symbol Pairs");

    const setupGame = () => {
        const pairsCount = 8;
        const selectedIcons: number[] = [];
        const usedIndices = new Set<number>();

        while (selectedIcons.length < pairsCount) {
            const r = Math.floor(Math.random() * ICONS.length);
            if (!usedIndices.has(r)) {
                usedIndices.add(r);
                selectedIcons.push(r);
            }
        }

        const gameCards = [...selectedIcons, ...selectedIcons]
            .sort(() => Math.random() - 0.5)
            .map((iconIdx, i) => ({
                id: i,
                iconIdx,
                isFlipped: false,
                isMatched: false
            }));

        setCards(gameCards);
        setMoves(0);
        setGameState("playing");
        setFlippedCards([]);
        play("start");
    };

    const handleCardClick = (idx: number) => {
        if (gameState !== "playing") return;
        if (cards[idx].isFlipped || cards[idx].isMatched) return;
        if (flippedCards.length >= 2) return;

        play("click");
        const newCards = [...cards];
        newCards[idx].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedCards, idx];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            checkForMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const checkForMatch = (idx1: number, idx2: number) => {
        const match = cards[idx1].iconIdx === cards[idx2].iconIdx;

        setTimeout(() => {
            const newCards = [...cards];
            if (match) {
                newCards[idx1].isMatched = true;
                newCards[idx2].isMatched = true;
                setCards(newCards);
                play("success");
                if (newCards.every(c => c.isMatched)) {
                    setGameState("gameover");
                    play("levelUp");
                }
            } else {
                newCards[idx1].isFlipped = false;
                newCards[idx2].isFlipped = false;
                setCards(newCards);
                play("error");
            }
            setFlippedCards([]);
        }, 800);
    };

    return (
        <GameBackground variant="memory" showParticles={true} showGrid={true} intensity="high" className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-memory/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            Symbol Pairs
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Match Arena</p>
                    </div>

                    {gameState === "playing" && (
                        <div className="flex justify-center gap-8 mt-8">
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Moves</div>
                                <div className="text-4xl font-bold text-white">{moves}</div>
                            </div>
                            <div className="text-center p-4 glass rounded-xl border-memory/30 min-w-[120px]">
                                <div className="text-sm text-muted-foreground uppercase tracking-widest mb-1">Matched</div>
                                <div className="text-4xl font-bold text-memory">{cards.filter(c => c.isMatched).length / 2}/{8}</div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <div className="relative w-full max-w-4xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-memory/10 via-reflex/5 to-transparent rounded-[3rem] blur-2xl -z-10" />

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
                                    <Puzzle className="w-24 h-24 text-memory mx-auto animate-pulse-game" />
                                    <h2 className="text-3xl font-bold text-white">Match the Symbol Pairs</h2>
                                    <p className="text-gray-400 max-w-md mx-auto">Flip cards and find matching pairs. Complete the board with the fewest moves!</p>
                                    <Button
                                        variant="memory"
                                        size="lg"
                                        onClick={setupGame}
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
                                    <div className="text-6xl md:text-7xl font-black text-white drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]">
                                        COMPLETE!
                                    </div>
                                    <div className="text-8xl font-black text-memory drop-shadow-[0_0_30px_rgba(236,72,153,0.8)]">
                                        {moves}
                                    </div>
                                    <p className="text-2xl text-gray-400">Moves Taken</p>
                                    <Button
                                        variant="memory"
                                        size="lg"
                                        onClick={setupGame}
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
                                    className="relative z-20"
                                >
                                    <div className="grid grid-cols-4 gap-3 md:gap-4">
                                        {cards.map((card, idx) => {
                                            const Icon = ICONS[card.iconIdx];
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 cursor-pointer"
                                                    style={{ perspective: 1000 }}
                                                    onClick={() => handleCardClick(idx)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <motion.div
                                                        className="w-full h-full relative"
                                                        animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                                        transition={{ duration: 0.4 }}
                                                        style={{ transformStyle: "preserve-3d" }}
                                                    >
                                                        {/* Front (hidden) */}
                                                        <div
                                                            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-memory/30 to-reflex/30 border-2 border-white/20 flex items-center justify-center shadow-lg"
                                                            style={{ backfaceVisibility: "hidden" }}
                                                        >
                                                            <div className="w-8 h-8 rounded-full bg-white/10" />
                                                        </div>

                                                        {/* Back (revealed) */}
                                                        <div
                                                            className={`absolute inset-0 rounded-2xl bg-white border-2 border-memory flex items-center justify-center shadow-lg ${card.isMatched ? "opacity-60" : ""}`}
                                                            style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
                                                        >
                                                            <Icon className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-memory" />
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <ToolContent
                    title="Symbol Pairs (Memory Match)"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    howToPlay={[
                        "Click a card to flip it over.",
                        "Click a second card to try and find its match.",
                        "If they match, they stay face up.",
                        "If they don't match, they flip back over.",
                        "Remember the position of every symbol you see.",
                        "Clear the entire board in as few moves as possible."
                    ]}
                    benefits={[
                        "Develops visual memory.",
                        "Improves concentration and focus.",
                        "Strengthens short-term recall skills.",
                        "Tests spatial association."
                    ]}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                />
            </div>
        </GameBackground>
    );
}
