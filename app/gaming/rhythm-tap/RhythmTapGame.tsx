"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";
import { Music, Play, RotateCcw, Trophy } from "lucide-react";
import { GameBackground } from "@/components/GameBackground";
import { useGameSound } from "@/hooks/useGameSound";

interface Note {
    id: number;
    lane: number;
    y: number;
    hit: boolean;
    judged: boolean;
    judgment?: "perfect" | "good" | "miss";
}

const LANES = 4;
const LANE_COLORS = ["bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500"];
const LANE_KEYS = ["D", "F", "J", "K"];
const BPM = 120;
const BEAT_INTERVAL = 60000 / BPM;
const GAME_BEATS = 32;
const HIT_ZONE_Y = 85; // percent from top
const PERFECT_THRESHOLD = 5;
const GOOD_THRESHOLD = 12;

export default function RhythmTapGame() {
    const content = getToolContent("rhythm-tap", "Rhythm Tap");
    const { play } = useGameSound();

    const [phase, setPhase] = useState<"idle" | "playing" | "result">("idle");
    const [notes, setNotes] = useState<Note[]>([]);
    const [score, setScore] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [perfects, setPerfects] = useState(0);
    const [goods, setGoods] = useState(0);
    const [misses, setMisses] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [flashLane, setFlashLane] = useState<number | null>(null);
    const noteIdRef = useRef(0);
    const animFrameRef = useRef<number>(0);
    const startTimeRef = useRef(0);
    const beatIndexRef = useRef(0);

    const startGame = useCallback(() => {
        setScore(0);
        setCombo(0);
        setMaxCombo(0);
        setPerfects(0);
        setGoods(0);
        setMisses(0);
        setNotes([]);
        noteIdRef.current = 0;
        beatIndexRef.current = 0;
        startTimeRef.current = Date.now();
        setPhase("playing");
        play("start");
    }, [play]);

    // Spawn notes on beats
    useEffect(() => {
        if (phase !== "playing") return;

        const t = setInterval(() => {
            if (beatIndexRef.current >= GAME_BEATS) {
                clearInterval(t);
                return;
            }
            beatIndexRef.current += 1;

            // Randomly spawn 1-2 notes per beat
            const count = Math.random() < 0.3 ? 2 : 1;
            const lanes = new Set<number>();
            while (lanes.size < count) lanes.add(Math.floor(Math.random() * LANES));

            const newNotes: Note[] = [];
            lanes.forEach(lane => {
                noteIdRef.current += 1;
                newNotes.push({ id: noteIdRef.current, lane, y: -5, hit: false, judged: false });
            });

            setNotes(prev => [...prev, ...newNotes]);
        }, BEAT_INTERVAL);

        return () => clearInterval(t);
    }, [phase]);

    // Animate notes falling
    useEffect(() => {
        if (phase !== "playing") return;

        const animate = () => {
            setNotes(prev => {
                const updated = prev.map(n => {
                    if (n.hit || n.judged) return n;
                    return { ...n, y: n.y + 0.8 };
                });

                // Check for missed notes
                const judged = updated.map(n => {
                    if (!n.judged && !n.hit && n.y > HIT_ZONE_Y + GOOD_THRESHOLD) {
                        return { ...n, judged: true, judgment: "miss" as const };
                    }
                    return n;
                });

                // Count new misses
                const newMisses = judged.filter(n => n.judgment === "miss" && !prev.find(p => p.id === n.id && p.judged));
                if (newMisses.length > 0) {
                    setMisses(m => m + newMisses.length);
                    setCombo(0);
                }

                // Remove notes that are way past
                const cleaned = judged.filter(n => n.y < 120);

                // Check if game is over
                if (beatIndexRef.current >= GAME_BEATS && cleaned.filter(n => !n.judged && !n.hit).length === 0) {
                    setTimeout(() => {
                        setPhase("result");
                        play("success");
                    }, 500);
                }

                return cleaned;
            });

            animFrameRef.current = requestAnimationFrame(animate);
        };

        animFrameRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animFrameRef.current);
    }, [phase, play]);

    const hitLane = useCallback((lane: number) => {
        if (phase !== "playing") return;

        setFlashLane(lane);
        setTimeout(() => setFlashLane(null), 100);

        setNotes(prev => {
            const hittable = prev
                .filter(n => n.lane === lane && !n.hit && !n.judged)
                .sort((a, b) => Math.abs(a.y - HIT_ZONE_Y) - Math.abs(b.y - HIT_ZONE_Y));

            if (hittable.length === 0) return prev;

            const closest = hittable[0];
            const dist = Math.abs(closest.y - HIT_ZONE_Y);

            if (dist <= PERFECT_THRESHOLD) {
                play("click");
                setScore(s => s + 100);
                setPerfects(p => p + 1);
                setCombo(c => { const nc = c + 1; setMaxCombo(mc => Math.max(mc, nc)); return nc; });
                return prev.map(n => n.id === closest.id ? { ...n, hit: true, judged: true, judgment: "perfect" as const } : n);
            } else if (dist <= GOOD_THRESHOLD) {
                play("click");
                setScore(s => s + 50);
                setGoods(g => g + 1);
                setCombo(c => { const nc = c + 1; setMaxCombo(mc => Math.max(mc, nc)); return nc; });
                return prev.map(n => n.id === closest.id ? { ...n, hit: true, judged: true, judgment: "good" as const } : n);
            }

            return prev;
        });
    }, [phase, play]);

    // Keyboard controls
    useEffect(() => {
        if (phase !== "playing") return;
        const handler = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const idx = ["d", "f", "j", "k"].indexOf(key);
            if (idx !== -1) hitLane(idx);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [phase, hitLane]);

    useEffect(() => {
        if (phase === "result") {
            setBestScore(prev => Math.max(prev, score));
        }
    }, [phase, score]);

    return (
        <GameBackground variant="gaming" showParticles={true} showGrid={true} className="min-h-screen pb-12">
            <div className="pt-24 px-4 flex flex-col items-center max-w-7xl mx-auto space-y-12">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full relative z-10"
                >
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-wisdom/20 blur-3xl rounded-full" />
                        <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-wisdom via-white to-wisdom bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                            Rhythm Tap
                        </h1>
                        <p className="text-xl text-wisdom/80 font-medium tracking-wide mt-2 uppercase">Timing Precision Game</p>
                    </div>
                </motion.div>

                <motion.div
                    className="w-full max-w-xl relative"
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                >
                    <div className="hud-frame w-full min-h-[550px] rounded-[3rem] p-8 md:p-12 flex flex-col items-center justify-center relative z-10 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden">
                        <div className="scanlines absolute inset-0 opacity-10 pointer-events-none rounded-[3rem]" />

                        {phase !== "idle" && (
                            <div className="absolute top-8 left-0 right-0 px-12 flex justify-between items-start pointer-events-none z-20">
                                <div className="text-left">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Score</div>
                                    <div className="text-3xl font-mono font-bold text-white">{score}</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Combo</div>
                                    <div className="text-3xl font-mono font-bold text-yellow-400">{combo}x</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-wisdom uppercase tracking-widest font-bold mb-1">Perfect</div>
                                    <div className="text-3xl font-mono font-bold text-green-400">{perfects}</div>
                                </div>
                            </div>
                        )}

                        {phase === "idle" && (
                            <motion.div className="text-center z-10">
                                <Music className="w-16 h-16 text-wisdom mx-auto mb-4 animate-bounce" />
                                <h3 className="text-2xl font-bold text-white mb-2">Rhythm Tap</h3>
                                <p className="text-gray-400 mb-3 max-w-md">Notes fall down 4 lanes. Tap them when they reach the hit zone!</p>
                                <p className="text-gray-500 mb-6 text-sm">Use <strong>D F J K</strong> keys or tap the lanes</p>
                                <Button variant="game" size="lg" onClick={startGame} className="text-xl px-12 py-6 rounded-2xl">
                                    <Play className="w-6 h-6 mr-3 fill-current" /> START
                                </Button>
                            </motion.div>
                        )}

                        {phase === "playing" && (
                            <div className="relative w-full h-[420px] mt-14 z-10 overflow-hidden rounded-2xl">
                                {/* Lanes */}
                                <div className="absolute inset-0 flex gap-1">
                                    {Array.from({ length: LANES }).map((_, i) => (
                                        <div
                                            key={i}
                                            onClick={() => hitLane(i)}
                                            className={`flex-1 border-x border-white/5 cursor-pointer transition-colors ${flashLane === i ? 'bg-white/10' : ''}`}
                                        />
                                    ))}
                                </div>

                                {/* Hit zone line */}
                                <div
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-wisdom to-transparent"
                                    style={{ top: `${HIT_ZONE_Y}%` }}
                                />

                                {/* Hit zone buttons */}
                                <div className="absolute left-0 right-0 flex gap-1" style={{ top: `${HIT_ZONE_Y - 3}%` }}>
                                    {Array.from({ length: LANES }).map((_, i) => (
                                        <div key={i} className="flex-1 flex items-center justify-center">
                                            <div className={`w-12 h-8 rounded-lg border-2 border-white/20 flex items-center justify-center text-xs font-bold text-gray-500 ${flashLane === i ? 'bg-white/20 text-white' : ''}`}>
                                                {LANE_KEYS[i]}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Notes */}
                                <AnimatePresence>
                                    {notes.filter(n => !n.hit).map(note => (
                                        <motion.div
                                            key={note.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: note.judged ? 0.3 : 1 }}
                                            exit={{ scale: 1.5, opacity: 0 }}
                                            className={`absolute w-[22%] h-6 rounded-lg ${note.judged ? 'bg-red-500/30' : LANE_COLORS[note.lane]} shadow-lg`}
                                            style={{
                                                left: `${note.lane * 25 + 1.5}%`,
                                                top: `${note.y}%`,
                                            }}
                                        />
                                    ))}
                                </AnimatePresence>

                                {/* Hit judgments */}
                                <AnimatePresence>
                                    {notes.filter(n => n.hit && n.judgment).map(note => (
                                        <motion.div
                                            key={`j-${note.id}`}
                                            initial={{ opacity: 1, y: 0 }}
                                            animate={{ opacity: 0, y: -30 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.5 }}
                                            className="absolute text-center"
                                            style={{ left: `${note.lane * 25 + 5}%`, top: `${HIT_ZONE_Y - 8}%` }}
                                        >
                                            <span className={`text-sm font-bold ${note.judgment === "perfect" ? "text-green-400" : "text-yellow-400"}`}>
                                                {note.judgment === "perfect" ? "PERFECT" : "GOOD"}
                                            </span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {phase === "result" && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center z-30 bg-black/80 backdrop-blur-md p-12 rounded-3xl border border-wisdom/30"
                            >
                                <Trophy className="w-12 h-12 text-wisdom mx-auto mb-3" />
                                <h2 className="text-3xl font-bold text-white mb-2">Song Complete!</h2>
                                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 my-4">
                                    {score}
                                </div>
                                <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                    <div><span className="text-green-400 font-bold text-lg">{perfects}</span><br /><span className="text-gray-500 text-xs">Perfect</span></div>
                                    <div><span className="text-yellow-400 font-bold text-lg">{goods}</span><br /><span className="text-gray-500 text-xs">Good</span></div>
                                    <div><span className="text-red-400 font-bold text-lg">{misses}</span><br /><span className="text-gray-500 text-xs">Miss</span></div>
                                </div>
                                <p className="text-gray-400 mb-2">Max Combo: <span className="text-wisdom font-bold">{maxCombo}x</span></p>
                                <p className="text-gray-500 mb-6 text-sm">Best Score: {bestScore}</p>
                                <Button variant="game" onClick={startGame} className="px-8">
                                    <RotateCcw className="w-4 h-4 mr-2" /> Play Again
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <ToolContent
                    title="Rhythm Tap Game"
                    description={content.description}
                    howToUse={content.howToUse}
                    howToImprove={content.howToImprove}
                    faqs={content.faqs}
                    relatedTools={content.relatedTools}
                    benefits={[
                        "Tests timing precision and rhythm.",
                        "Improves hand-eye coordination.",
                        "Trains sustained attention.",
                        "Builds combo-based skill progression.",
                        "Engaging rhythm gameplay."
                    ]}
                    howToPlay={[
                        "Click 'Start' to begin.",
                        "Notes fall down 4 lanes toward a hit zone.",
                        "Press D, F, J, K (or tap the lanes) when notes reach the line.",
                        "Time your taps for 'Perfect' or 'Good' judgments.",
                        "Build combos for higher scores!"
                    ]}
                />
            </div>
        </GameBackground>
    );
}
