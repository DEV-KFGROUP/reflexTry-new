"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MousePointer2, Calculator, Keyboard, Grid3X3, Type,
  Zap, Hash, ArrowUpDown, Sparkles
} from "lucide-react";

interface ToolItem {
  title: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  glow: string;
  href: string;
}

const SPEED_TOOLS: ToolItem[] = [
  {
    title: "Click Speed (CPS)",
    desc: "Calibrate your clicks-per-second click latency threshold.",
    icon: MousePointer2,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/click",
  },
  {
    title: "Speed Math",
    desc: "Calculate arithmetic equations against a shrinking timer.",
    icon: Calculator,
    color: "text-cyan-655",
    bg: "bg-cyan-50/80",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/math",
  },
  {
    title: "Typing Test",
    desc: "Verify your typing speed words-per-minute accuracy index.",
    icon: Keyboard,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/typing",
  },
  {
    title: "Grid Selection",
    desc: "Identify and sweep highlighted boxes from standard arrays.",
    icon: Grid3X3,
    color: "text-cyan-655",
    bg: "bg-cyan-50/80",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/grid",
  },
  {
    title: "Word Accuracy",
    desc: "Type fast-spawning terms with precision vocabulary trackers.",
    icon: Type,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/words",
  },
  {
    title: "Number Rush",
    desc: "Visual sweep calibration to locate numbers 1 to N rapidly.",
    icon: Hash,
    color: "text-cyan-655",
    bg: "bg-cyan-50/80",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/number-rush",
  },
  {
    title: "Quick Sort",
    desc: "Sort categorized items into buckets under speed ramps.",
    icon: ArrowUpDown,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/quick-sort",
  },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Zap className="w-32 h-32 text-red-400 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <MousePointer2 className="w-40 h-40 text-orange-400 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function SpeedHubClient() {
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
                        <div className="absolute inset-0 bg-red-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                            <Zap className="w-12 h-12 text-red-400 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-red-400 dark:via-orange-400 dark:to-orange-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-red-400" />
                            Speed & Latency
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Push your biological limits and minimize your physical response times.
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        In highly competitive environments, milliseconds matter. Our speed training suite is designed to reduce the friction between your thoughts and physical actions, maximizing your Click-Per-Second (CPS) and WPM limits.
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(239,68,68,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <MousePointer2 className="w-8 h-8 text-orange-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Max CPS</h3>
                            <p className="text-sm text-muted-foreground">Faster click rates</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Keyboard className="w-8 h-8 text-red-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">High WPM</h3>
                            <p className="text-sm text-muted-foreground">Faster typing</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">⏱️</div>
                            <h3 className="text-base font-bold text-foreground mb-1">Lower Latency</h3>
                            <p className="text-sm text-muted-foreground">Reduce delay</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {SPEED_TOOLS.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                variants={itemVariants}
                                className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Link
                                    href={tool.href}
                                    className="absolute inset-0 z-10"
                                    aria-label={`${tool.title} - ${tool.desc}`}
                                >
                                    <span className="sr-only">{tool.title} - {tool.desc}</span>
                                </Link>
                                <tool.icon className={`w-12 h-12 text-red-500 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{tool.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* SEO Blocks */}
                    <div className="max-w-4xl mx-auto mt-16 text-left space-y-4 pt-6 border-t border-black/10 dark:border-white/10 relative z-10">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            ★ The Science of Speed Training
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            <strong>Definition:</strong> Speed training focuses on optimizing motor neuron firing rates and reducing the cognitive friction required to execute a physical action after perceiving a stimulus.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            <strong>The bottom line:</strong> High CPS (Clicks Per Second) and fast typing speeds rely on muscle endurance and myelin sheath development in the nervous system. Regular speed training forces biological adaptations that make rapid movements feel effortless and subconscious.
                        </p>
                    </div>

                    {/* Detailed Description & FAQ */}
                    <div className="max-w-4xl mx-auto mt-16 relative z-10">
                        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Frequently Asked Questions About Speed Training</h2>
                        <div className="space-y-6 text-left">
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">How can I increase my CPS?</h3>
                                <p className="text-muted-foreground">Increasing your Clicks Per Second requires developing specific twitch muscle fibers in your fingers and forearms. Techniques like jitter clicking and butterfly clicking can yield immediate boosts, but long-term improvement requires consistent, daily endurance training to build stamina and prevent fatigue.</p>
                            </div>
                            
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">Why is my WPM (Words Per Minute) stuck?</h3>
                                <p className="text-muted-foreground">Plateaus in typing speed are usually caused by a lack of accuracy, not a lack of finger speed. If you are constantly backspacing, your WPM will drop significantly. Our Typing Test and Word Accuracy tools emphasize precision first, which naturally translates to higher raw speeds over time.</p>
                            </div>
                        </div>
                    </div>

                    {/* Related Categories */}
                    <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 relative z-10">
                        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">Explore Other Categories</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link href="/gaming" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all text-center">
                                <div className="text-purple-500 text-2xl mb-2 drop-shadow-sm">🎮</div>
                                <div className="text-sm font-bold text-foreground">Gaming Lab</div>
                            </Link>
                            <Link href="/memory" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-center">
                                <div className="text-blue-500 text-2xl mb-2 drop-shadow-sm">🧠</div>
                                <div className="text-sm font-bold text-foreground">Memory Games</div>
                            </Link>
                            <Link href="/reflex" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-center">
                                <div className="text-pink-500 text-2xl mb-2 drop-shadow-sm">⚡</div>
                                <div className="text-sm font-bold text-foreground">Reflex Tests</div>
                            </Link>
                            <Link href="/accuracy" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5 transition-all text-center">
                                <div className="text-teal-500 text-2xl mb-2 drop-shadow-sm">🎯</div>
                                <div className="text-sm font-bold text-foreground">Accuracy Tools</div>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
