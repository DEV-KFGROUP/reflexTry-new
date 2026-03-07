"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Layers, Play, RotateCcw, Trophy, Clock } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

const EMOJIS = ["🍎", "🍊", "🍋", "🍇", "🍉", "🌸", "🔥", "⚡", "🌙", "🎯", "💎", "🎵", "🌊", "🍀", "🦋", "🎨", "🚀", "⭐"];

function generateCards(pairCount: number): { id: number; emoji: string; matched: boolean }[] {
    const selected = EMOJIS.slice(0, pairCount);
    const pairs = [...selected, ...selected];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    return shuffled.map((emoji, i) => ({ id: i, emoji, matched: false }));
}

export default function CardMatchGame() {
    const content = getToolContent("card-match", "Card Match");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [cards, setCards] = useState<{ id: number; emoji: string; matched: boolean }[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [locked, setLocked] = useState(false);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [pairCount, setPairCount] = useState(6);
    const [timer, setTimer] = useState(0);
    const [bestMoves, setBestMoves] = useState<number | null>(null);

    useEffect(() => {
        if (phase !== "playing") return;
        const t = setInterval(() => setTimer(s => s + 1), 1000);
        return () => clearInterval(t);
    }, [phase]);

    const startGame = useCallback(() => {
        const newCards = generateCards(pairCount);
        setCards(newCards);
        setFlipped([]);
        setLocked(false);
        setMoves(0);
        setMatches(0);
        setTimer(0);
        setPhase("playing");
        play("start");
    }, [pairCount, play]);

    const handleCardClick = useCallback((id: number) => {
        if (locked) return;
        if (flipped.includes(id)) return;
        if (cards[id].matched) return;

        play("click");
        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(m => m + 1);
            setLocked(true);
            const [first, second] = newFlipped;

            if (cards[first].emoji === cards[second].emoji) {
                // Match!
                play("success");
                const newMatches = matches + 1;
                setMatches(newMatches);
                setCards(prev => prev.map(c =>
                    c.id === first || c.id === second ? { ...c, matched: true } : c
                ));
                setFlipped([]);
                setLocked(false);

                if (newMatches === pairCount) {
                    play("levelUp");
                    const totalMoves = moves + 1;
                    setBestMoves(prev => prev === null ? totalMoves : Math.min(prev, totalMoves));
                    setTimeout(() => setPhase("result"), 600);
                }
            } else {
                // No match
                setTimeout(() => {
                    play("error");
                    setFlipped([]);
                    setLocked(false);
                }, 800);
            }
        }
    }, [locked, flipped, cards, matches, pairCount, moves, play]);

    const gridCols = pairCount <= 4 ? "grid-cols-4" : pairCount <= 6 ? "grid-cols-4" : "grid-cols-6";

    return (
        <GameBackground variant="memory" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-memory/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-memory via-white to-memory bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                            Card Match
                        </h1>
                        <p className="text-xl text-memory/80 font-medium tracking-wide mt-2 uppercase">Pairs Memory Game</p>
                    </div>

                    {phase === "idle" && (
                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {[4, 6, 8].map(count => (
                                <button
                                    key={count}
                                    onClick={() => setPairCount(count)}
                                    className={`px-6 py-2 rounded-lg font-bold border-2 transition-all duration-200 ${pairCount === count
                                        ? 'bg-memory/20 border-memory text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                                        : 'bg-black/20 border-white/10 text-gray-400 hover:border-memory/50 hover:text-white'}`}
                                >
                                    {count} Pairs
                                </button>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Game Area */}
                <motion.div
                    className="w-full max-w-3xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[420px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {/* HUD */}
                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Moves</div>
                                    <div className="text-4xl font-mono font-bold text-white">{moves}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Matches</div>
                                    <div className="text-4xl font-mono font-bold text-white">{matches}/{pairCount}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-memory uppercase tracking-widest font-bold mb-1">Time</div>
                                    <div className="text-4xl font-mono font-bold text-white">{timer}s</div>
                                </div>
                            </div>
                        )}

                        {/* Idle */}
                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Layers className="w-16 h-16 text-memory mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Card Match</h3>
                                <p className="text-gray-400 mb-6 max-w-md">Flip cards two at a time and find all matching pairs. Fewer moves = better score!</p>
                                <Button variant="memory" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {/* Playing */}
                        {phase === "playing" && (
                            <div className={`grid ${gridCols} gap-3 mt-20 w-full max-w-lg z-10`}>
                                {cards.map(card => {
                                    const isFlipped = flipped.includes(card.id) || card.matched;
                                    return (
                                        <motion.button
                                            key={card.id}
                                            onClick={() => handleCardClick(card.id)}
                                            whileTap={{ scale: 0.95 }}
                                            className={`aspect-square rounded-2xl text-3xl md:text-4xl font-bold flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${card.matched
                                                    ? 'bg-memory/20 border-memory/40 opacity-60'
                                                    : isFlipped
                                                        ? 'bg-white/10 border-memory/60'
                                                        : 'bg-black/40 border-white/10 hover:border-memory/30 hover:bg-black/30'
                                                }`}
                                        >
                                            <AnimatePresence mode="wait">
                                                {isFlipped ? (
                                                    <motion.span
                                                        key="emoji"
                                                        initial={{ rotateY: 90 }}
                                                        animate={{ rotateY: 0 }}
                                                        exit={{ rotateY: 90 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        {card.emoji}
                                                    </motion.span>
                                                ) : (
                                                    <motion.span
                                                        key="back"
                                                        initial={{ rotateY: -90 }}
                                                        animate={{ rotateY: 0 }}
                                                        exit={{ rotateY: -90 }}
                                                        transition={{ duration: 0.2 }}
                                                        className="text-memory/30"
                                                    >
                                                        ?
                                                    </motion.span>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    );
                                })}
                            </div>
                        )}

                        {/* Result */}
                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-memory/30"
                            >
                                <Trophy className="w-12 h-12 text-memory mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">All Pairs Found!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {moves} <span className="text-2xl text-memory">moves</span>
                                </div>
                                <p className="text-gray-400 mb-2">Time: <span className="text-white font-bold">{timer}s</span></p>
                                {bestMoves && <p className="text-gray-500 mb-6 text-sm">Best: {bestMoves} moves</p>}
                                <Button variant="memory" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Card Match Memory Game"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Trains visual and spatial memory.",
                        "Improves pattern recognition.",
                        "Enhances concentration and focus.",
                        "Develops strategic thinking.",
                        "Classic, engaging gameplay."
                    ]}
                    howToPlay={[
                        "Choose the number of pairs (4, 6, or 8).",
                        "Click 'Start' to begin.",
                        "Flip two cards at a time by clicking them.",
                        "If they match, they stay face up.",
                        "Find all pairs in as few moves as possible."
                    ]}
                />
            </div>
        </GameBackground>
    );
}
