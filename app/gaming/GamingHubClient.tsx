"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Crosshair, Zap, Gamepad2, Music } from "lucide-react";

const GAMING_TOOLS = [
    {
        title: "Aim Trainer",
        desc: "Track moving targets to improve your FPS tracking.",
        icon: Crosshair,
        color: "text-red-500",
        href: "/gaming/aim",
    },
    {
        title: "RPG Reflex",
        desc: "Block enemy attacks in this gamified reaction test.",
        icon: Zap,
        color: "text-yellow-400",
        href: "/gaming/reaction",
    },
    {
        title: "Target Tracking",
        desc: "Infinite smooth tracking accuracy test.",
        icon: Crosshair, // We can reuse Crosshair
        color: "text-cyan-400",
        href: "/gaming/target-tracking",
    },
    {
        title: "Endless Dodge",
        desc: "Survive a bullet-hell reaction test.",
        icon: Zap, // Reuse Zap
        color: "text-red-500",
        href: "/gaming/endless-dodge",
    },
    {
        title: "Stroop Drop",
        desc: "Infinite falling words cognitive test.",
        icon: Crosshair,
        color: "text-blue-500",
        href: "/gaming/stroop-drop",
    },
    {
        title: "Flick Shot",
        desc: "Snap to targets before they vanish.",
        icon: Crosshair,
        color: "text-amber-400",
        href: "/gaming/flick-shot",
    },
    {
        title: "Rhythm Tap",
        desc: "Hit falling notes with perfect timing.",
        icon: Music,
        color: "text-emerald-400",
        href: "/gaming/rhythm-tap",
    },
];

export default function GamingHubClient() {
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
                        <Gamepad2 className="w-12 h-12 text-purple-500" />
                    </motion.div>
                    <h1
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #9d00ff, #ec4899)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#9d00ff'
                        }}
                        suppressHydrationWarning
                    >
                        Pro Gaming Lab
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-2">
                        Warm up your hands and sharpen your senses for your next ranked match.
                    </p>
                    <p className="text-md text-theme-secondary max-w-3xl mx-auto">
                        Professional esports players don't just play—they train. Our free gaming tools are designed to help you develop the core mechanics that separate casual players from competitive ones. Improve your flick shots, aiming precision, and reaction timing.
                    </p>
                </div>

                {/* Quick benefits - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Better Aim</h3>
                        <p className="text-xs text-theme-secondary">Improve precision</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">⚡</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Faster Reactions</h3>
                        <p className="text-xs text-theme-secondary">Quick responses</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Win More</h3>
                        <p className="text-xs text-theme-secondary">Better performance</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {GAMING_TOOLS.map((tool, index) => (
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
                    <h2 className="text-3xl font-bold text-center mb-10 text-theme-primary">Frequently Asked Questions About Aim & Gaming Training</h2>
                    <div className="space-y-8 text-left">
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">Does aim training actually improve my game?</h3>
                            <p className="text-theme-secondary mb-3">Yes. Aim trainers isolate the physical mechanics of using a mouse, such as tracking and flicking. By separating these from game sense, map awareness, and strategy, you can build raw mechanical muscle memory much faster than just playing the game alone.</p>
                            <p className="text-theme-secondary">Our Aim Trainer and Flick Shot tools are specifically designed to replicate the mouse movements required in popular tactical shooters like CS2, Valorant, and Apex Legends.</p>
                        </div>
                        
                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">What is the best way to warm up before a ranked match?</h3>
                            <p className="text-theme-secondary mb-3">A solid pre-game warmup should last 5-10 minutes and involve progressively faster movements. We recommend this sequence:</p>
                            <ul className="list-disc pl-6 text-theme-secondary space-y-1">
                                <li>2 minutes of Grid Click to establish base accuracy and coordinate hand-eye movement.</li>
                                <li>3 minutes of Aim Trainer to practice tracking and steady movements.</li>
                                <li>2 minutes of Flick Shot to push your speed limits and wake up your reflexes.</li>
                            </ul>
                        </div>

                        <div className="bg-theme-surface border border-theme-muted p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-theme-primary mb-3">How does CPS (Clicks Per Second) affect gaming?</h3>
                            <p className="text-theme-secondary">A higher CPS rate allows you to attack faster in PvP games like Minecraft, or register actions quicker in MOBAs like League of Legends. Training your CPS builds finger endurance, reducing fatigue during long gaming sessions while maintaining high performance.</p>
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
                        <Link href="/accuracy" className="p-4 rounded-xl bg-theme-surface border border-theme hover:border-teal-500/50 transition text-center">
                            <div className="text-purple-500 text-2xl mb-2">🎯</div>
                            <div className="text-sm font-semibold text-theme-primary">Accuracy Tools</div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

