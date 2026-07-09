"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Brain, Activity, Hash, Grid, Palette, Shapes, Shuffle, BookOpen, Layers } from "lucide-react";

const MEMORY_TOOLS = [
    {
        title: "Sequence Memory",
        desc: "Memorize the pattern of buttons displayed.",
        icon: Activity,
        color: "text-teal-500",
        href: "/memory/sequence",
    },
    {
        title: "Number Memory",
        desc: "Remember the longest number you can.",
        icon: Hash,
        color: "text-purple-500",
        href: "/memory/number",
    },
    {
        title: "Visual Memory",
        desc: "Memorize the grid tiles that light up.",
        icon: Grid,
        color: "text-amber-500",
        href: "/memory/visual",
    },
    {
        title: "Color Matching",
        desc: "Match colors to their names or similar shades.",
        icon: Palette,
        color: "text-rose-500",
        href: "/memory/color",
    },
    {
        title: "Shape Recognition",
        desc: "Identify matching shapes quickly.",
        icon: Shapes,
        color: "text-blue-400",
        href: "/memory/shape",
    },
    {
        title: "Symbol Matching",
        desc: "Find matching pairs of symbols.",
        icon: Shuffle,
        color: "text-pink-400",
        href: "/memory/symbol",
    },
    {
        title: "Word Recall",
        desc: "Memorize and recall lists of words.",
        icon: BookOpen,
        color: "text-emerald-400",
        href: "/memory/word-recall",
    },
    {
        title: "Card Match",
        desc: "Classic card-flipping pairs memory game.",
        icon: Layers,
        color: "text-amber-400",
        href: "/memory/card-match",
    },
];

export default function MemoryHubClient() {
    return (
        <div className="bg-background text-foreground py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                        suppressHydrationWarning
                    >
                        <Brain className="w-12 h-12 text-purple-500" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #9d00ff, #00f0ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#9d00ff'
                        }}
                        suppressHydrationWarning
                    >
                        Cognitive & Memory Lab
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-2">
                        Push your brain to the limit. Test your working memory, pattern recognition, and cognitive speed.
                    </p>
                    <p className="text-md text-theme-secondary max-w-3xl mx-auto">
                        Our memory training games are designed for students, professionals, and anyone looking to enhance their short-term and working memory. By practicing these tools regularly, you can improve focus, information retention, and overall cognitive health.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🧠</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Better Recall</h3>
                        <p className="text-xs text-theme-secondary">Improve memory retention</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Sharper Focus</h3>
                        <p className="text-xs text-theme-secondary">Enhanced concentration</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Track Records</h3>
                        <p className="text-xs text-theme-secondary">Monitor your progress</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {MEMORY_TOOLS.map((tool, index) => (
                        <motion.div
                            key={tool.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-white border border-theme/40 hover:border-theme/70 hover:bg-slate-50 transition hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-100/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                            <Link
                                href={tool.href}
                                className="absolute inset-0 z-10"
                                aria-label={`${tool.title} - ${tool.desc}`}
                            >
                                <span className="sr-only">{tool.title} - {tool.desc}</span>
                            </Link>
                            <tool.icon className={`w-10 h-10 ${tool.color} mb-4 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-xl font-bold text-theme-primary mb-2">{tool.title}</h3>
                            <p className="text-theme-secondary">{tool.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Description & FAQ for SEO/AEO */}
                <div className="max-w-4xl mx-auto mt-20">
                    <h2 className="text-3xl font-bold text-center mb-10 text-theme-primary">Frequently Asked Questions About Memory Training</h2>
                    <div className="space-y-8 text-left">
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">Why is memory training important?</h3>
                            <p className="text-theme-secondary mb-3">Memory training is essential for maintaining cognitive health and neuroplasticity. Our brain games are designed to challenge and strengthen your working memory, pattern recognition, and active recall abilities.</p>
                            <p className="text-theme-secondary">Whether you're a student looking to improve study habits or a professional wanting to stay sharp, regular practice helps improve focus, concentration, and mental agility in daily life.</p>
                        </div>
                        
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">What are the benefits of playing memory games?</h3>
                            <p className="text-theme-secondary mb-3">Engaging in daily cognitive exercises provides several scientifically-backed benefits:</p>
                            <ul className="list-disc pl-6 text-theme-secondary space-y-1">
                                <li>Improved short-term and working memory capacity</li>
                                <li>Enhanced concentration and prolonged focus during deep work</li>
                                <li>Better visual-spatial memory and pattern recognition</li>
                                <li>Faster information processing and recall speed</li>
                            </ul>
                        </div>

                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">How often should I practice memory exercises?</h3>
                            <p className="text-theme-secondary">For the best results, consistency is more important than duration. We recommend starting with 10-15 minutes of daily practice using games like Sequence Memory or Number Memory. Tracking your progress over a few weeks will reveal measurable improvements.</p>
                        </div>
                    </div>
                </div>

                {/* Related Categories Section - Internal Linking */}
                <div className="mt-12 pt-8 border-t border-theme">
                    <h3 className="text-2xl font-bold text-theme-primary mb-6 text-center">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/reflex" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-amber-500 text-2xl mb-2">⚡</div>
                            <div className="text-sm font-semibold text-theme-primary">Reflex Tests</div>
                        </Link>
                        <Link href="/speed" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-teal-500 text-2xl mb-2">⌨️</div>
                            <div className="text-sm font-semibold text-theme-primary">Speed Tests</div>
                        </Link>
                        <Link href="/accuracy" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-purple-500 text-2xl mb-2">🎯</div>
                            <div className="text-sm font-semibold text-theme-primary">Accuracy Tools</div>
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

