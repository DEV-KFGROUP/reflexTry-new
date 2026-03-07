"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { MousePointer2, Calculator, Keyboard, Grid3X3, Type, Zap, Hash, ArrowUpDown } from "lucide-react";

const SPEED_TOOLS = [
    {
        title: "Click Speed (CPS)",
        desc: "How many times can you click in 5 seconds?",
        icon: MousePointer2,
        color: "text-neon-teal",
        href: "/speed/click",
    },
    {
        title: "Speed Math",
        desc: "Solve arithmetic problems against the clock.",
        icon: Calculator,
        color: "text-electric-purple",
        href: "/speed/math",
    },
    {
        title: "Typing Test",
        desc: "Type a paragraph as fast as you can.",
        icon: Keyboard,
        color: "text-neon-yellow",
        href: "/speed/typing",
    },
    {
        title: "Grid Selection",
        desc: "Select the highlighted cells quickly.",
        icon: Grid3X3,
        color: "text-vibrant-coral",
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
                        <Zap className="w-12 h-12 text-neon-yellow" />
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
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Measure your raw speed. From clicking to typing to mental math, how fast are you?
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
                            className="group relative p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all hover:-translate-y-1"
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
                            <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                            <p className="text-gray-400">{tool.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Detailed Description for SEO */}
                <div className="max-w-4xl mx-auto bg-theme-surface/30 border border-theme/30 rounded-2xl p-6">
                    <h2 className="text-2xl font-bold text-theme-primary mb-4">Why Test Your Speed?</h2>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Speed is essential in today's fast-paced digital world. Whether you're typing reports, playing competitive
                        games, or simply navigating your computer, faster speed means better productivity. Our speed tests help
                        you measure and improve your clicking speed, typing WPM, and mental calculation abilities.
                    </p>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        The average typing speed is around 40 WPM (words per minute), while professional typists often exceed
                        80 WPM. Gamers typically aim for 7+ clicks per second (CPS). With regular practice on our tools, you
                        can significantly boost your speed across all these metrics.
                    </p>
                    <h3 className="text-xl font-semibold text-theme-primary mb-3">Benefits of Speed Training</h3>
                    <ul className="text-theme-secondary space-y-2 mb-4">
                        <li>• Higher typing speed for increased work productivity</li>
                        <li>• Better click speed for gaming and computer tasks</li>
                        <li>• Faster mental math for quick calculations</li>
                        <li>• Improved hand-eye coordination and dexterity</li>
                        <li>• Trackable progress with personal best records</li>
                    </ul>
                    <p className="text-theme-secondary leading-relaxed">
                        Start with any test above to establish your baseline. Challenge yourself daily and watch your
                        speed improve over time. Many users report 20-50% improvements within the first month.
                    </p>
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
                        <Link href="/accuracy" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-electric-purple text-2xl mb-2">🎯</div>
                            <div className="text-sm font-semibold text-theme-primary">Accuracy Tools</div>
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

