"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Timer, Activity, Move, Volume2, Eye, Palette, Sparkles
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

const REFLEX_TOOLS: ToolItem[] = [
  {
    title: "Reaction Time",
    desc: "Test raw visual reflex click response speeds under classic light cues.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/reaction",
  },
  {
    title: "Sound Reflex",
    desc: "Measure auditory reflex triggers and milliseconds latency via sound pulses.",
    icon: Volume2,
    color: "text-amber-600",
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/sound",
  },
  {
    title: "Directional Reflex",
    desc: "Test cognitive direction translation using directional arrow cues.",
    icon: Move,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/direction",
  },
  {
    title: "Peripheral Vision",
    desc: "React to shapes spawning in peripheral fields away from center anchors.",
    icon: Eye,
    color: "text-amber-650",
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/peripheral",
  },
  {
    title: "Grid Shot",
    desc: "Click transient targets scattered in standard aim matrix layouts.",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/grid",
  },
  {
    title: "Multi-Stimulus",
    desc: "Selective attention test reacting only to targets, avoiding decoy symbols.",
    icon: Zap,
    color: "text-amber-650",
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/multi-stimulus",
  },
  {
    title: "Sequence Reaction",
    desc: "Click rapid sequence points in specified incremental patterns.",
    icon: Activity,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/sequence-reaction",
  },
  {
    title: "Whack-a-Mole",
    desc: "Test fine motor click accuracy by striking moles before they vanish.",
    icon: Zap,
    color: "text-amber-650",
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/whack-a-mole",
  },
  {
    title: "Color Switch",
    desc: "Ignore word meaning and strike only the literal ink colors shown.",
    icon: Palette,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/color-switch",
  },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Zap className="w-32 h-32 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Timer className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function ReflexHubClient() {
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
                        <div className="absolute inset-0 bg-amber-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Zap className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-amber-400 dark:via-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-amber-400" />
                            Reflex Testing
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Measure your visual and auditory reaction times down to the millisecond.
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        In professional sports, esports, and driving, reflex time is critical. Our reflex suite isolates different sensory pathways—visual, auditory, and directional—so you can pinpoint your fastest response times and train to lower your latency.
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(245,158,11,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-amber-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Visual Reflex</h3>
                            <p className="text-sm text-muted-foreground">React to colors</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Volume2 className="w-8 h-8 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Audio Reflex</h3>
                            <p className="text-sm text-muted-foreground">React to sounds</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">🏎️</div>
                            <h3 className="text-base font-bold text-foreground mb-1">Stay Sharp</h3>
                            <p className="text-sm text-muted-foreground">Improve focus</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {REFLEX_TOOLS.map((tool, index) => (
                            <motion.div
                                key={tool.title}
                                variants={itemVariants}
                                className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Link
                                    href={tool.href}
                                    className="absolute inset-0 z-10"
                                    aria-label={`${tool.title} - ${tool.desc}`}
                                >
                                    <span className="sr-only">{tool.title} - {tool.desc}</span>
                                </Link>
                                <tool.icon className={`w-12 h-12 text-amber-500 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{tool.title}</h3>
                                <p className="text-muted-foreground leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        ))}
                    </div>

                    {/* SEO Blocks */}
                    <div className="max-w-4xl mx-auto mt-16 text-left space-y-4 pt-6 border-t border-black/10 dark:border-white/10 relative z-10">
                        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                            ★ The Science of Reflex Testing
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            <strong>Definition:</strong> Reflex testing measures the total elapsed time between the presentation of a sensory stimulus and the subsequent motor response.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed font-sans">
                            <strong>The bottom line:</strong> Average human reaction time is around 250 milliseconds for visual cues and 170 milliseconds for audio cues. Through active repetition and neurological adaptation, elite athletes and gamers can bring their visual reaction times below 150 milliseconds.
                        </p>
                    </div>

                    {/* Detailed Description & FAQ */}
                    <div className="max-w-4xl mx-auto mt-16 relative z-10">
                        <h2 className="text-3xl font-bold text-center mb-10 text-foreground">Frequently Asked Questions About Reflexes</h2>
                        <div className="space-y-6 text-left">
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">Can you train your reaction time?</h3>
                                <p className="text-muted-foreground">While your raw genetic reaction time has a hard limit, you can definitely train your brain to approach that limit consistently. Our tools help strip away hesitation and decision-fatigue, training your nervous system to fire instantly upon receiving a specific cue.</p>
                            </div>
                            
                            <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
                                <h3 className="text-xl font-bold text-foreground mb-3">Why is audio reaction time faster than visual?</h3>
                                <p className="text-muted-foreground">It takes less time for an auditory stimulus to reach the brain than a visual one. The auditory cortex processes sound significantly faster than the visual cortex processes complex visual information. This is why a runner reacts to a starting pistol rather than a flashing light.</p>
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
                            <Link href="/speed" className="p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all text-center">
                                <div className="text-red-500 text-2xl mb-2 drop-shadow-sm">⌨️</div>
                                <div className="text-sm font-bold text-foreground">Speed Tests</div>
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
