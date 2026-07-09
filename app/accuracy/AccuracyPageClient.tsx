"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Target, Keyboard, CheckCircle, XCircle, RefreshCw, Crosshair, Palette } from "lucide-react";
import Link from "next/link";

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
    const [activeTab, setActiveTab] = useState<"image" | "data" | "pattern" | "precision" | "angle" | "colormatch">("image");

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
                    <p className="text-xl text-gray-400 mb-2">
                        Precision is key. Choose your challenge.
                    </p>
                    <p className="text-md text-theme-secondary max-w-3xl mx-auto">
                        Accuracy is about control and precise execution. Our accuracy training tools—from pattern matching and angle estimation to precision clicking—are designed to hone your hand-eye coordination, visual discrimination, and fine motor control.
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
                    <Button
                        variant={activeTab === "angle" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("angle")}
                    >
                        <Crosshair className="w-5 h-5 mr-2" /> Angle Estimation
                    </Button>
                    <Button
                        variant={activeTab === "colormatch" ? "primary" : "ghost"}
                        onClick={() => setActiveTab("colormatch")}
                    >
                        <Palette className="w-5 h-5 mr-2" /> Color Match
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
                                    <Target className="w-16 h-16 text-teal-500 mx-auto" />
                                    <h3 className="text-2xl font-bold">Pattern Matching Test</h3>
                                    <p className="text-gray-400">Test your visual accuracy by matching patterns with precision</p>
                                    <Button className="mt-4">Play Pattern Matching</Button>
                                </div>
                            </Link>
                        ) : activeTab === "precision" ? (
                            <Link href="/accuracy/precision-click" className="block">
                                <div className="text-center space-y-4 p-12">
                                    <Target className="w-16 h-16 text-teal-500 mx-auto" />
                                    <h3 className="text-2xl font-bold">Precision Clicking Test</h3>
                                    <p className="text-gray-400">Test your hand-eye coordination and precision clicking</p>
                                    <Button className="mt-4">Play Precision Click</Button>
                                </div>
                            </Link>
                        ) : activeTab === "angle" ? (
                            <Link href="/accuracy/angle-estimation" className="block">
                                <div className="text-center space-y-4 p-12">
                                    <Crosshair className="w-16 h-16 text-teal-500 mx-auto" />
                                    <h3 className="text-2xl font-bold">Angle Estimation</h3>
                                    <p className="text-gray-400">Guess the angle and test your geometric intuition</p>
                                    <Button className="mt-4">Play Angle Estimation</Button>
                                </div>
                            </Link>
                        ) : (
                            <Link href="/accuracy/color-match" className="block">
                                <div className="text-center space-y-4 p-12">
                                    <Palette className="w-16 h-16 text-teal-500 mx-auto" />
                                    <h3 className="text-2xl font-bold">Color Match</h3>
                                    <p className="text-gray-400">Match the target color using RGB sliders</p>
                                    <Button className="mt-4">Play Color Match</Button>
                                </div>
                            </Link>
                        )}
                    </AnimatePresence>
                </div>

                {/* Detailed Description & FAQ for SEO/AEO */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-theme-primary">Frequently Asked Questions About Accuracy Training</h2>
                    <div className="space-y-8 text-left">
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">Why is accuracy testing important?</h3>
                            <p className="text-theme-secondary mb-3">While speed determines how fast you can act, accuracy determines how effectively you can perform a task without errors. In gaming, professional work, and everyday tasks, high accuracy reduces the time spent correcting mistakes.</p>
                            <p className="text-theme-secondary">Our accuracy tests isolate and train specific skills like spatial awareness, visual discrimination, and precision mouse control.</p>
                        </div>
                        
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">What are the benefits of precision and accuracy training?</h3>
                            <p className="text-theme-secondary mb-3">Engaging in precision tasks provides several tangible benefits:</p>
                            <ul className="list-disc pl-6 text-theme-secondary space-y-1">
                                <li>Better hand-eye coordination and fine motor skills</li>
                                <li>Improved aiming precision for FPS and tactical games (Aim training)</li>
                                <li>Enhanced visual-spatial intelligence (Angle Estimation, Pattern Matching)</li>
                                <li>Fewer data entry and typing errors in professional work</li>
                            </ul>
                        </div>

                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">How can I improve my hand-eye coordination?</h3>
                            <p className="text-theme-secondary">Improving hand-eye coordination requires deliberate, focused practice. Start with our Precision Click or Pattern Matching tools. Initially, focus entirely on hitting the exact target rather than speed. Once your accuracy consistently reaches 95-100%, you can gradually increase your speed.</p>
                        </div>
                    </div>
                </div>
                {/* Related Categories Section - Internal Linking */}
                <div className="mt-12 pt-8 border-t border-theme">
                    <h3 className="text-2xl font-bold text-theme-primary mb-6 text-center">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/memory" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-purple-500 text-2xl mb-2">🧠</div>
                            <div className="text-sm font-semibold text-theme-primary">Memory Games</div>
                        </Link>
                        <Link href="/reflex" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-amber-500 text-2xl mb-2">⚡</div>
                            <div className="text-sm font-semibold text-theme-primary">Reflex Tests</div>
                        </Link>
                        <Link href="/speed" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-teal-500 text-2xl mb-2">⌨️</div>
                            <div className="text-sm font-semibold text-theme-primary">Speed Tests</div>
                        </Link>
                        <Link href="/gaming" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-rose-500 text-2xl mb-2">🎮</div>
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

            <div className="w-64 h-64 mx-auto bg-black rounded-lg flex items-center justify-center text-9xl border-2 border-teal-500 shadow-[0_0_30px_rgba(0,240,255,0.3)]">
                {currentImage.hint}
            </div>

            {!result ? (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type what you see..."
                        className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
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
                        color = input[i] === char ? "text-teal-500" : "text-red-500";
                    }
                    return <span key={i} className={color}>{char}</span>;
                })}
            </div>

            {!completed ? (
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="w-full p-4 bg-transparent border-b-2 border-white/20 text-xl text-white focus:outline-none focus:border-teal-500 transition-colors font-mono text-center"
                    placeholder="Start typing..."
                    autoFocus
                />
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold text-teal-500">{wpm}</div>
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

