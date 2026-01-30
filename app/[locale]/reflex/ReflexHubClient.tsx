"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { Zap, Timer, Activity, Move, Volume2, Eye } from "lucide-react";

const REFLEX_TOOLS = [
    {
        title: "Reaction Time",
        desc: "Classic traffic light reaction test.",
        icon: Zap,
        color: "text-neon-yellow",
        href: "/reflex/reaction",
    },
    {
        title: "Sound Reflex",
        desc: "Test your auditory reaction speed.",
        icon: Volume2,
        color: "text-blue-400",
        href: "/reflex/sound",
    },
    {
        title: "Directional Reflex",
        desc: "Respond to Arrow Keys rapidly.",
        icon: Move,
        color: "text-electric-purple",
        href: "/reflex/direction",
    },
    {
        title: "Peripheral Vision",
        desc: "Detect targets in your peripheral view.",
        icon: Eye,
        color: "text-green-400",
        href: "/reflex/peripheral",
    },
    {
        title: "Grid Shot",
        desc: "Aim training warmup game.",
        icon: Activity,
        color: "text-vibrant-coral",
        href: "/reflex/grid",
    },
    {
        title: "Multi-Stimulus",
        desc: "Selective attention and decision-making test.",
        icon: Zap,
        color: "text-orange-400",
        href: "/reflex/multi-stimulus",
    },
    {
        title: "Sequence Reaction",
        desc: "Memory and reaction speed combined.",
        icon: Activity,
        color: "text-pink-400",
        href: "/reflex/sequence-reaction",
    },
];

export default function ReflexHubClient() {
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
                        <Timer className="w-12 h-12 text-neon-teal" />
                    </motion.div>
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
                        Reflex & Reaction Lab
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Measure your raw reaction speeds across visual, auditory, and cognitive stimuli.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Faster Reactions</h3>
                        <p className="text-xs text-theme-secondary">Improve response time</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎮</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Gaming Edge</h3>
                        <p className="text-xs text-theme-secondary">Better performance</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">👁️</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Visual Awareness</h3>
                        <p className="text-xs text-theme-secondary">Sharper perception</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {REFLEX_TOOLS.map((tool, index) => (
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
                    <h2 className="text-2xl font-bold text-theme-primary mb-4">Why Test Your Reflexes?</h2>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Reaction time is a crucial cognitive skill that affects everything from driving safety to gaming performance. 
                        Our reflex tests measure how quickly your brain processes stimuli and sends signals to your muscles. The 
                        average human reaction time is around 250 milliseconds, but with practice, you can significantly improve.
                    </p>
                    <p className="text-theme-secondary mb-4 leading-relaxed">
                        Whether you're an esports athlete looking to gain a competitive edge, a driver wanting to stay alert, or 
                        anyone interested in brain health, regular reflex training offers measurable benefits. Our tests cover 
                        visual, auditory, and directional reflexes to provide a comprehensive assessment.
                    </p>
                    <h3 className="text-xl font-semibold text-theme-primary mb-3">Benefits of Reflex Training</h3>
                    <ul className="text-theme-secondary space-y-2 mb-4">
                        <li>• Faster reaction times in gaming and sports</li>
                        <li>• Improved alertness and situational awareness</li>
                        <li>• Better hand-eye coordination</li>
                        <li>• Enhanced processing speed for quick decisions</li>
                        <li>• Useful benchmark for tracking cognitive health</li>
                    </ul>
                    <p className="text-theme-secondary leading-relaxed">
                        Try each test above to discover your baseline and track improvements over time. Most people see 
                        noticeable gains within 2-4 weeks of regular practice.
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

