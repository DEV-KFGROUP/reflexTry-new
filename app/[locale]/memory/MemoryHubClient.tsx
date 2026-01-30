"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Brain, Activity, Hash, Grid, Palette, Shapes, Shuffle } from "lucide-react";

const MEMORY_TOOLS = [
    {
        title: "Sequence Memory",
        desc: "Memorize the pattern of buttons displayed.",
        icon: Activity,
        color: "text-neon-teal",
        href: "/memory/sequence",
    },
    {
        title: "Number Memory",
        desc: "Remember the longest number you can.",
        icon: Hash,
        color: "text-electric-purple",
        href: "/memory/number",
    },
    {
        title: "Visual Memory",
        desc: "Memorize the grid tiles that light up.",
        icon: Grid,
        color: "text-neon-yellow",
        href: "/memory/visual",
    },
    {
        title: "Color Matching",
        desc: "Match colors to their names or similar shades.",
        icon: Palette,
        color: "text-vibrant-coral",
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
                        <Brain className="w-12 h-12 text-electric-purple" />
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
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Push your brain to the limit. Test your working memory, pattern recognition, and cognitive speed.
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
                    <h2 className="text-2xl font-bold text-theme-primary mb-4">Why Train Your Memory?</h2>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Memory training is essential for cognitive health. Our brain games are designed to challenge and strengthen 
                        your working memory, pattern recognition, and recall abilities. Regular practice can help improve focus, 
                        concentration, and mental agility in daily life.
                    </p>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Whether you're a student looking to improve study habits, a professional wanting to stay sharp, or 
                        simply someone who enjoys mental challenges, our memory games offer something for everyone. Each game 
                        targets different aspects of memory function, from visual-spatial memory to numerical recall.
                    </p>
                    <h3 className="text-xl font-semibold text-theme-primary mb-3">Benefits of Memory Training</h3>
                    <ul className="text-theme-secondary space-y-2 mb-4">
                        <li>• Improved short-term and working memory capacity</li>
                        <li>• Enhanced concentration and focus during tasks</li>
                        <li>• Better pattern recognition and problem-solving skills</li>
                        <li>• Faster information processing and recall speed</li>
                        <li>• Stronger neural connections through regular practice</li>
                    </ul>
                    <p className="text-theme-secondary leading-relaxed">
                        Start with any game above and track your progress over time. Consistent practice, even just 10-15 minutes 
                        daily, can lead to measurable improvements in memory performance.
                    </p>
                </div>

                {/* Related Categories Section - Internal Linking */}
                <div className="mt-12 pt-8 border-t border-theme">
                    <h3 className="text-2xl font-bold text-theme-primary mb-6 text-center">Explore Other Categories</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link href="/reflex" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-yellow text-2xl mb-2">⚡</div>
                            <div className="text-sm font-semibold text-theme-primary">Reflex Tests</div>
                        </Link>
                        <Link href="/speed" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-neon-teal/50 transition-all text-center">
                            <div className="text-neon-teal text-2xl mb-2">⌨️</div>
                            <div className="text-sm font-semibold text-theme-primary">Speed Tests</div>
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

