"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Zap, Timer, Activity, Move, Volume2, Eye, Palette, Sparkles, LayoutGrid, CircleDot
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { CategoryGuideSection } from "@/components/CategoryGuideSection";

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
    title: "Time Perception",
    desc: "Test your internal clock and time perception by holding a button for the exact requested time.",
    icon: Timer,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/time-perception",
  },
  {
    title: "Go / No-Go",
    desc: "Press on green Go trials and withhold on red No-Go to measure inhibitory control.",
    icon: CircleDot,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/go-no-go",
  },
  {
    title: "Flanker Task",
    desc: "Respond to the center arrow only while ignoring congruent or incongruent flankers.",
    icon: Move,
    color: "text-amber-650",
    bg: "bg-amber-50/80",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/flanker",
  },
  {
    title: "Choice Reaction",
    desc: "Click the lit colored box as fast as possible across multiple choice targets.",
    icon: LayoutGrid,
    color: "text-amber-500",
    bg: "bg-amber-50",
    border: "border-amber-200/60",
    glow: "shadow-[0_0_12px_rgba(245,158,11,0.06)]",
    href: "/reflex/choice-reaction",
  },
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
    const { t, getLocalizedHref } = useTranslation();

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
                            {t("categoryHub.reflex.heroTitle", "Reflex Training & Reaction Games")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("categoryHub.reflex.heroSubtitle", "Measure your visual and auditory reaction times down to the millisecond.")}
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        {t("categoryHub.reflex.heroDesc", "In professional sports, esports, and driving, reflex time is critical. Our reflex suite isolates different sensory pathways—visual, auditory, and directional—so you can pinpoint your fastest response times and train to lower your latency.")}
                    </p>
                </motion.div>

                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" /> {t("categoryHub.reflex.whatItCovers", "What This Arena Covers")}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("categoryHub.reflex.whatItCoversDesc", "Visual and auditory reaction tests timed in milliseconds—simple reaction, sound cues, grid clicks, peripheral targets, and multi-stimulus choices. Built to isolate stimulus-to-response latency for practice and warm-ups.")}
                    </p>
                </motion.section>

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
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.reflex.benefit1Title", "Visual Reflex")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.reflex.benefit1Desc", "React to colors")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Volume2 className="w-8 h-8 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.reflex.benefit2Title", "Audio Reflex")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.reflex.benefit2Desc", "React to sounds")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">🏎️</div>
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.reflex.benefit3Title", "Spatial Reflex")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.reflex.benefit3Desc", "React across screen")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {REFLEX_TOOLS.map((tool, index) => {
                            const shortSlug = tool.href.replace("/reflex/", "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <motion.div
                                    key={tool.title}
                                    variants={itemVariants}
                                    className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Link
                                        href={getLocalizedHref(tool.href)}
                                        className="absolute inset-0 z-10"
                                        aria-label={`${localizedTitle} - ${localizedDesc}`}
                                    >
                                        <span className="sr-only">{localizedTitle} - {localizedDesc}</span>
                                    </Link>
                                    <tool.icon className={`w-12 h-12 text-amber-500 dark:text-amber-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{localizedTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{localizedDesc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <CategoryGuideSection category="reflex" />
                </motion.div>
            </motion.div>
        </div>
    );
}
