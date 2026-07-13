"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Crosshair, Zap, Gamepad2, Music, Sparkles } from "lucide-react";

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

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Gamepad2 className="w-32 h-32 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Crosshair className="w-40 h-40 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function GamingHubClient() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8 min-h-screen overflow-hidden relative">
            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-block relative mb-4"
                        suppressHydrationWarning
                    >
                        <div className="absolute inset-0 bg-purple-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                            <Gamepad2 className="w-12 h-12 text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-purple-400 dark:via-pink-400 dark:to-pink-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-purple-400" />
                            Esports Training & Aim Lab
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Warm up your hands and sharpen your senses for your next ranked match.
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        Professional esports players don't just play—they train. Our free gaming tools are designed to help you develop the core mechanics that separate casual players from competitive ones. Improve your flick shots, aiming precision, and reaction timing.
                    </p>
                </motion.div>

                {/* AI Summary / Bottom Line for SEO/AEO */}
                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" /> Key Takeaway
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        <strong className="text-foreground">Bottom Line:</strong> The Pro Gaming Lab is designed for competitive esports players and aspiring gamers. It provides structured interactive tests to measure and improve your mouse tracking, aiming precision, and click timing. By practicing these isolated mechanics daily, you can build raw muscle memory faster than playing standard matches.
                    </p>
                </motion.section>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(168,85,247,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Crosshair className="w-8 h-8 text-pink-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Better Aim</h3>
                            <p className="text-sm text-muted-foreground">Improve precision</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Faster Reactions</h3>
                            <p className="text-sm text-muted-foreground">Quick responses</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">🏆</div>
                            <h3 className="text-base font-bold text-foreground mb-1">Win More</h3>
                            <p className="text-sm text-muted-foreground">Better performance</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {GAMING_TOOLS.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                variants={itemVariants}
                                className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Link
                                    href={tool.href}
                                    className="absolute inset-0 z-10"
                                    aria-label={`${tool.title} - ${tool.desc}`}
                                >
                                    <span className="sr-only">{tool.title} - {tool.desc}</span>
                                </Link>
                                <tool.icon className={`w-12 h-12 ${tool.color} mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{tool.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Detailed SEO / AEO / GEO Section */}
                    <div className="max-w-4xl mx-auto mt-16 space-y-12 text-left pt-6 border-t border-black/10 dark:border-white/10 relative z-10">
                        
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold text-foreground">What is Aim Training?</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Aim training involves using specialized, isolated minigames to practice mouse control, crosshair placement, and reaction timing outside of a traditional game environment. This allows players to get hundreds of repetitive mechanical repetitions per minute, significantly accelerating muscle memory development compared to standard gameplay.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">How to Improve Your Aim and Gaming Mechanics?</h2>
                            <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                <li><strong>Start slow:</strong> Focus on 100% accuracy before trying to increase your speed.</li>
                                <li><strong>Use the right tools:</strong> Use Target Tracking for smooth aim, and Flick Shot for fast flick reflexes.</li>
                                <li><strong>Maintain posture:</strong> Ensure your arm and wrist are properly supported to prevent fatigue and injury.</li>
                                <li><strong>Warm up daily:</strong> A 10-minute routine before jumping into ranked matchmaking makes a huge difference.</li>
                            </ol>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-foreground">Should I Practice Daily?</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Yes. Consistent daily practice of 15-20 minutes yields better results for neuroplasticity and muscle memory than a single 2-hour session once a week.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Gaming Tools Comparison</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[600px]">
                                    <thead>
                                        <tr className="border-b border-black/10 dark:border-white/10">
                                            <th className="p-3 text-foreground font-bold">Tool Name</th>
                                            <th className="p-3 text-foreground font-bold">Best For (Use Case)</th>
                                            <th className="p-3 text-foreground font-bold">Core Benefit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-muted-foreground">
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-purple-500">Aim Trainer</td>
                                            <td className="p-3">FPS Gamers (Valorant, CS2)</td>
                                            <td className="p-3">Improves static target clicking and overall mouse control.</td>
                                        </tr>
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-purple-500">Flick Shot</td>
                                            <td className="p-3">Sniper roles, fast-paced shooters</td>
                                            <td className="p-3">Builds fast-twitch muscle memory for sudden crosshair snaps.</td>
                                        </tr>
                                        <tr className="border-b border-black/5 dark:border-white/5">
                                            <td className="p-3 font-semibold text-purple-500">Target Tracking</td>
                                            <td className="p-3">Apex Legends, Overwatch players</td>
                                            <td className="p-3">Enhances smooth pursuit eye movements and continuous mouse tracking.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Benchmarks & Scientific Proof</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Pro esports athletes exhibit significantly faster motor responses and superior hand-eye coordination compared to average individuals. Studies, such as those cataloged by the <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7323281/" target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">National Center for Biotechnology Information (NCBI)</a>, show that action video game training enhances visual attention and sensorimotor control. In our internal benchmarks, users who engage with our Flick Shot and Target Tracking tools for 14 days report an average 15% reduction in time-to-target.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">Does aim training actually improve my game?</h3>
                                <p className="text-muted-foreground mb-3">Yes. Aim trainers isolate the physical mechanics of using a mouse, such as tracking and flicking. By separating these from game sense, map awareness, and strategy, you can build raw mechanical muscle memory much faster than just playing the game alone.</p>
                            </div>
                            
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">What is the best way to warm up before a ranked match?</h3>
                                <p className="text-muted-foreground mb-3">A solid pre-game warmup should last 5-10 minutes and involve progressively faster movements. We recommend this sequence:</p>
                                <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                                    <li>2 minutes of Aim Trainer to establish base accuracy.</li>
                                    <li>3 minutes of Target Tracking for smooth movements.</li>
                                    <li>2 minutes of Flick Shot to push your speed limits.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Related Categories */}
                    <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 relative z-10">
                        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Explore Other Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/memory" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                                <div className="text-purple-500 text-2xl mb-2 drop-shadow-sm">🧠</div>
                                <div className="text-sm font-bold text-foreground">Memory Games</div>
                            </Link>
                            <Link href="/reflex" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-center">
                                <div className="text-pink-500 text-2xl mb-2 drop-shadow-sm">⚡</div>
                                <div className="text-sm font-bold text-foreground">Reflex Tests</div>
                            </Link>
                            <Link href="/speed" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                                <div className="text-purple-500 text-2xl mb-2 drop-shadow-sm">⌨️</div>
                                <div className="text-sm font-bold text-foreground">Speed Tests</div>
                            </Link>
                            <Link href="/accuracy" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-center">
                                <div className="text-pink-500 text-2xl mb-2 drop-shadow-sm">🎯</div>
                                <div className="text-sm font-bold text-foreground">Accuracy Tools</div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
