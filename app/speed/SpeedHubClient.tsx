"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  MousePointer2, Calculator, Keyboard, Grid3X3, Type,
  Zap, Hash, ArrowUpDown, Sparkles
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
    title: "Schulte Table",
    desc: "Click shuffled numbers in order on a grid to train visual scanning speed.",
    icon: Grid3X3,
    color: "text-cyan-600",
    bg: "bg-cyan-50",
    border: "border-cyan-200/60",
    glow: "shadow-[0_0_12px_rgba(6,182,212,0.06)]",
    href: "/speed/schulte-table",
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
                            {t("categoryHub.speed.heroTitle", "Speed Tests & Velocity Benchmarks")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("categoryHub.speed.heroSubtitle", "Push your clicks per second (CPS), typing speed (WPM), and calculation agility.")}
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        {t("categoryHub.speed.heroDesc", "In highly competitive environments, milliseconds matter. Our speed training suite is designed to reduce the friction between your thoughts and physical actions, maximizing your Click-Per-Second (CPS) and WPM limits.")}
                    </p>
                </motion.div>

                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-red-500" /> {t("categoryHub.speed.whatItCovers", "What This Arena Covers")}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("categoryHub.speed.whatItCoversDesc", "Raw execution speed: clicks per second, typing WPM, mental math under time pressure, and fast grid clear tasks. Score what you can do per second—not just how quickly you notice a signal.")}
                    </p>
                </motion.section>

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
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.speed.benefit1Title", "Click Speed")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.speed.benefit1Desc", "Measure raw CPS")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Keyboard className="w-8 h-8 text-red-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.speed.benefit2Title", "Typing Speed")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.speed.benefit2Desc", "Benchmark WPM")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">⏱️</div>
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.speed.benefit3Title", "Mental Math")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.speed.benefit3Desc", "Rapid calculations")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {SPEED_TOOLS.map((tool, index) => {
                            const shortSlug = tool.href.replace("/speed/", "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <motion.div
                                    key={tool.title}
                                    variants={itemVariants}
                                    className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(239,68,68,0.2)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Link
                                        href={getLocalizedHref(tool.href)}
                                        className="absolute inset-0 z-10"
                                        aria-label={`${localizedTitle} - ${localizedDesc}`}
                                    >
                                        <span className="sr-only">{localizedTitle} - {localizedDesc}</span>
                                    </Link>
                                    <tool.icon className={`w-12 h-12 text-red-500 dark:text-red-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{localizedTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{localizedDesc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <CategoryGuideSection category="speed" />
                </motion.div>
            </motion.div>
        </div>
    );
}
