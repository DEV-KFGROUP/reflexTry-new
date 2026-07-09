"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MousePointer2, Calculator, Keyboard, Grid3X3, Type, Zap, Hash, ArrowUpDown } from "lucide-react";

const SPEED_TOOLS = [
    {
        title: "Click Speed (CPS)",
        desc: "How many times can you click in 5 seconds?",
        icon: MousePointer2,
        color: "text-teal-500",
        href: "/speed/click",
    },
    {
        title: "Speed Math",
        desc: "Solve arithmetic problems against the clock.",
        icon: Calculator,
        color: "text-purple-500",
        href: "/speed/math",
    },
    {
        title: "Typing Test",
        desc: "Type a paragraph as fast as you can.",
        icon: Keyboard,
        color: "text-amber-500",
        href: "/speed/typing",
    },
    {
        title: "Grid Selection",
        desc: "Select the highlighted cells quickly.",
        icon: Grid3X3,
        color: "text-rose-500",
        href: "/speed/grid",
    },
    {
        title: "Word Accuracy",
        desc: "Type individual words appearing rapidly.",
        icon: Type,
        color: "text-blue-400",
        href: "/speed/words",
    },
    {
        title: "Number Rush",
        desc: "Find numbers 1→N in order, as fast as possible.",
        icon: Hash,
        color: "text-amber-400",
        href: "/speed/number-rush",
    },
    {
        title: "Quick Sort",
        desc: "Sort items into categories before time runs out.",
        icon: ArrowUpDown,
        color: "text-emerald-400",
        href: "/speed/quick-sort",
    },
];

export default function SpeedHubClient() {
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
                        <Zap className="w-12 h-12 text-amber-500" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #ccff00, #ff4d4d)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#ccff00'
                        }}
                        suppressHydrationWarning
                    >
                        Speed & Accuracy Lab
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-2">
                        Measure your raw speed. From clicking to typing to mental math, how fast are you?
                    </p>
                    <p className="text-md text-theme-secondary max-w-3xl mx-auto">
                        Speed is critical for productivity and gaming. Our speed tests are designed to measure your CPS (clicks per second), typing WPM, and mental calculation speed. Use these tools to establish a baseline, track your improvements, and train your fine motor skills.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Faster Productivity</h3>
                        <p className="text-xs text-theme-secondary">Type and work faster</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎮</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Better Gaming</h3>
                        <p className="text-xs text-theme-secondary">Click faster, react quicker</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">📈</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Track Progress</h3>
                        <p className="text-xs text-theme-secondary">See improvements over time</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SPEED_TOOLS.map((tool, index) => (
                        <motion.div
                            key={tool.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative p-6 rounded-2xl bg-white border border-theme/40 hover:border-theme/70 hover:bg-slate-50 transition hover:-translate-y-1"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
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
                    <h2 className="text-3xl font-bold text-center mb-10 text-theme-primary">Frequently Asked Questions About Speed Testing</h2>
                    <div className="space-y-8 text-left">
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">Why should I measure my clicking and typing speed?</h3>
                            <p className="text-theme-secondary mb-3">Speed is essential in today's fast-paced digital world. Whether you're typing reports for work, playing competitive video games, or simply navigating your computer, faster execution means better productivity and performance.</p>
                            <p className="text-theme-secondary">Our speed tests help you objectively measure your fine motor skills (CPS) and typing words per minute (WPM), providing a baseline to track improvements over time.</p>
                        </div>
                        
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">What are the benefits of speed training?</h3>
                            <p className="text-theme-secondary mb-3">Regular practice with speed tools offers several advantages:</p>
                            <ul className="list-disc pl-6 text-theme-secondary space-y-1">
                                <li>Higher Words Per Minute (WPM) for faster data entry and communication</li>
                                <li>Increased Clicks Per Second (CPS) for competitive gaming edges</li>
                                <li>Quicker mental calculation abilities for everyday problem-solving</li>
                                <li>Enhanced finger dexterity and reduced muscle fatigue through better technique</li>
                            </ul>
                        </div>

                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">How fast can I improve my CPS and WPM?</h3>
                            <p className="text-theme-secondary">With 10-15 minutes of focused daily practice on our Jitter Click or Typing tests, you can see noticeable improvements within just 2 weeks. Technique is often more important than raw effort—focus on accuracy first, and speed will naturally follow.</p>
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

