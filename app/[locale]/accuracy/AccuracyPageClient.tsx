"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Target, Keyboard, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Link } from "@/i18n/routing";

const DATA_SAMPLES = [
    "The quick brown fox jumps over the lazy dog",
    "Sphinx of black quartz, judge my vow",
    "Pack my box with five dozen liquor jugs",
    "How vexingly quick daft zebras jump",
];

const IMAGE_SAMPLES = [
    { id: "img_001", hint: "🐱", correct: "cat" },
    { id: "img_002", hint: "🌅", correct: "sunset" },
    { id: "img_003", hint: "🔷", correct: "geometric shapes" },
];

export default function AccuracyPageClient() {
    const [activeTab, setActiveTab] = useState<"image" | "data" | "pattern" | "precision">("image");

    return (
        <div className="bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <h1 
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#00f0ff'
                        }}
                        suppressHydrationWarning
                    >
                        Accuracy Testing Lab
                    </h1>
                    <p className="text-xl text-gray-400">
                        Precision is key. Choose your challenge.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Better Precision</h3>
                        <p className="text-xs text-theme-secondary">Fewer mistakes</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">👁️</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Sharper Focus</h3>
                        <p className="text-xs text-theme-secondary">Attention to detail</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">✅</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Track Errors</h3>
                        <p className="text-xs text-theme-secondary">Monitor accuracy</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-4">
                    <Button
                        variant={activeTab === "image" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("image")}
                    >
                        <Target className="w-5 h-5 mr-2" /> Image Recognition
                    </Button>
                    <Button
                        variant={activeTab === "data" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("data")}
                    >
                        <Keyboard className="w-5 h-5 mr-2" /> Data Entry
                    </Button>
                    <Button
                        variant={activeTab === "pattern" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("pattern")}
                    >
                        <Target className="w-5 h-5 mr-2" /> Pattern Matching
                    </Button>
                    <Button
                        variant={activeTab === "precision" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("precision")}
                    >
                        <Target className="w-5 h-5 mr-2" /> Precision Click
                    </Button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(0,0,0,0.2)]">
                    <AnimatePresence mode="wait">
                        {activeTab === "image" ? (
                            <ImageAccuracyTest key="image" />
                        ) : activeTab === "data" ? (
                            <DataEntryTest key="data" />
                        ) : activeTab === "pattern" ? (
                            <Link href="/accuracy/pattern-matching" className="block">
                                <div className="text-center space-y-4 p-12">
                                    <Target className="w-16 h-16 text-neon-teal mx-auto" />
                                    <h3 className="text-2xl font-bold">Pattern Matching Test</h3>
                                    <p className="text-gray-400">Test your visual accuracy by matching patterns with precision</p>
                                    <Button className="mt-4">Play Pattern Matching</Button>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/accuracy/precision-click" className="block">
                                <div className="text-center space-y-4 p-12">
                                    <Target className="w-16 h-16 text-neon-teal mx-auto" />
                                    <h3 className="text-2xl font-bold">Precision Clicking Test</h3>
                                    <p className="text-gray-400">Test your hand-eye coordination and precision clicking</p>
                                    <Button className="mt-4">Play Precision Click</Button>
                                </div>
                            </Link>
                        )}
                    </AnimatePresence>
                </div>

                {/* Related Categories Section - Internal Linking */}
                <div className="mt-12 pt-8 border-t border-theme">
                    <h3 className="text-2xl font-bold text-theme-primary mb-6 text-center">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/memory" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-electric-purple text-2xl mb-2">🧠</div>
                            <div className="text-sm font-semibold text-theme-primary">Memory Games</div>
                        </Link>
                        <Link href="/reflex" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-yellow text-2xl mb-2">⚡</div>
                            <div className="text-sm font-semibold text-theme-primary">Reflex Tests</div>
                        </Link>
                        <Link href="/speed" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-teal text-2xl mb-2">⌨️</div>
                            <div className="text-sm font-semibold text-theme-primary">Speed Tests</div>
                        </Link>
                        <Link href="/gaming" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-vibrant-coral text-2xl mb-2">🎮</div>
                            <div className="text-sm font-semibold text-theme-primary">Gaming Tools</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ImageAccuracyTest() {
    const [currentImage, setCurrentImage] = useState(IMAGE_SAMPLES[0]);
    const [input, setInput] = useState("");
    const [result, setResult] = useState<{ accuracy: number; message: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/accuracy/image-recognition", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageId: currentImage.id, userInput: input }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            // Handle error silently in production, show user-friendly message
            if (process.env.NODE_ENV === 'development') {
                console.error("Accuracy check error:", error);
            }
            setResult({
                accuracy: 0,
                message: "Unable to process request. Please try again.",
            });
        }
    };

    const nextImage = () => {
        const idx = Math.floor(Math.random() * IMAGE_SAMPLES.length);
        setCurrentImage(IMAGE_SAMPLES[idx]);
        setInput("");
        setResult(null);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 text-center">
            <h2 className="text-2xl font-bold text-white">Identify the Object</h2>

            <div className="w-64 h-64 mx-auto bg-black rounded-lg flex items-center justify-center text-9xl border-2 border-neon-teal shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                {currentImage.hint}
            </div>

            {!result ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type what you see..."
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-neon-teal focus:ring-1 focus:ring-neon-teal transition-all"
                        autoFocus
                    />
                    <Button type="submit" className="w-full">Check Accuracy</Button>
                </form>
            ) : (
                <div className="space-y-6">
                    <div className={`text-4xl font-bold ${result.accuracy === 100 ? "text-green-500" : "text-yellow-500"}`}>
                        {result.message}
                    </div>
                    <Button variant="secondary" onClick={nextImage}>
                        Next Image <RefreshCw className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            )}
        </motion.div>
    );
}

function DataEntryTest() {
    const [target, setTarget] = useState(DATA_SAMPLES[0]);
    const [input, setInput] = useState("");
    const [startTime, setStartTime] = useState(0);
    const [wpm, setWpm] = useState(0);
    const [completed, setCompleted] = useState(false);

    useEffect(() => {
        if (input.length === 1 && !startTime) setStartTime(Date.now());
        if (input === target && !completed) {
            const time = (Date.now() - startTime) / 1000 / 60; // minutes
            const words = target.split(" ").length;
            setWpm(Math.round(words / time));
            setCompleted(true);
        }
    }, [input, target, startTime, completed]);

    const reset = () => {
        setTarget(DATA_SAMPLES[Math.floor(Math.random() * DATA_SAMPLES.length)]);
        setInput("");
        setStartTime(0);
        setCompleted(false);
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 text-center">
            <h2 className="text-2xl font-bold text-white">Speed Typing Test</h2>

            <div className="p-6 bg-white/5 rounded-xl border border-white/10 text-xl font-mono text-gray-300">
                {target.split('').map((char, i) => {
                    let color = "text-gray-400";
                    if (i < input.length) {
                        color = input[i] === char ? "text-neon-teal" : "text-red-500";
                    }
                    return <span key={i} className={color}>{char}</span>;
                })}
            </div>

            {!completed ? (
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-4 bg-transparent border-b-2 border-white/20 text-xl text-white focus:outline-none focus:border-neon-teal transition-colors font-mono text-center"
                    placeholder="Start typing..."
                    autoFocus
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-neon-teal">{wpm}</div>
                            <div className="text-sm text-gray-400">WPM</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-green-500">100%</div>
                            <div className="text-sm text-gray-400">Accuracy</div>
                        </div>
                    </div>
                    <Button onClick={reset}><RefreshCw className="w-4 h-4 mr-2" /> Try Again</Button>
                </div>
            )}
        </motion.div>
    );
}

