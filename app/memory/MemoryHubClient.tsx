"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain, Activity, Hash, Grid, Palette, Shapes, Shuffle,
  BookOpen, Layers, Sparkles
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

const MEMORY_TOOLS: ToolItem[] = [
  {
    title: "Chimp Test",
    desc: "Test your working memory against a chimpanzee. Memorize the number sequence.",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/chimp-test",
  },
  {
    title: "Verbal Memory",
    desc: "Keep track of how many words you've seen and distinguish them from new ones.",
    icon: BookOpen,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/verbal-memory",
  },
  {
    title: "N-Back",
    desc: "Match letters that appeared N steps earlier. Classic working memory continuous task.",
    icon: Layers,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/n-back",
  },
  {
    title: "Sequence Memory",
    desc: "Memorize and repeat an increasingly complex flashing button pattern.",
    icon: Activity,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/sequence",
  },
  {
    title: "Object Tracking",
    desc: "Track multiple moving targets among distractors and identify them when they stop.",
    icon: Sparkles,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/object-tracking",
  },
  {
    title: "Number Memory",
    desc: "Remember and repeat the longest digit strings you can hold in active memory.",
    icon: Hash,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/number",
  },
  {
    title: "Visual Memory",
    desc: "Retain spatial coordinates of highlighted blocks in expanding matrices.",
    icon: Grid,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/visual",
  },
  {
    title: "Color Matching",
    desc: "Verify semantic colors against text indicators under high speeds.",
    icon: Palette,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/color",
  },
  {
    title: "Shape Recognition",
    desc: "Identify shape details and geometry configurations within custom grids.",
    icon: Shapes,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/shape",
  },
  {
    title: "Symbol Matching",
    desc: "Scan and recall symbol configurations inside coordinate boxes.",
    icon: Shuffle,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/symbol",
  },
  {
    title: "Word Recall",
    desc: "Memorize and recall random lists of words to test linguistic retention.",
    icon: BookOpen,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/word-recall",
  },
  {
    title: "Card Match",
    desc: "Classic card-flipping pairs board match, testing visual-spatial memory.",
    icon: Layers,
    color: "text-purple-650",
    bg: "bg-purple-50/80",
    border: "border-purple-200/60",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.06)]",
    href: "/memory/card-match",
  },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Brain className="w-32 h-32 text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Grid className="w-40 h-40 text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function MemoryHubClient() {
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
                        <div className="absolute inset-0 bg-blue-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                            <Brain className="w-12 h-12 text-blue-400 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-blue-400 dark:via-indigo-400 dark:to-indigo-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-blue-400" />
                            {t("categoryHub.memory.heroTitle", "Memory Capacity & Training Games")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("categoryHub.memory.heroSubtitle", "Expand your working memory capacity and cognitive retention.")}
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        {t("categoryHub.memory.heroDesc", "Your working memory is the scratchpad of your brain. By actively challenging your ability to hold and process visual, spatial, and sequential information, you can physically strengthen the neural pathways responsible for focus and retention.")}
                    </p>
                </motion.div>

                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-blue-500" /> {t("categoryHub.memory.whatItCovers", "What This Arena Covers")}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("categoryHub.memory.whatItCoversDesc", "Working memory, spatial recall, and verbal recognition tests—including sequence patterns, digit span, visual grids, and the chimp test. Use them to measure how many items you can hold and update under time pressure.")}
                    </p>
                </motion.section>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(59,130,246,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Brain className="w-8 h-8 text-blue-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.memory.benefit1Title", "Working Memory")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.memory.benefit1Desc", "Hold more info")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Grid className="w-8 h-8 text-indigo-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(129,140,248,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.memory.benefit2Title", "Spatial Recall")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.memory.benefit2Desc", "Map your surroundings")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">💡</div>
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.memory.benefit3Title", "Sharper Focus")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.memory.benefit3Desc", "Eliminate brain fog")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {MEMORY_TOOLS.map((tool, index) => {
                            const shortSlug = tool.href.replace("/memory/", "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <motion.div
                                    key={tool.title}
                                    variants={itemVariants}
                                    className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.2)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Link
                                        href={getLocalizedHref(tool.href)}
                                        className="absolute inset-0 z-10"
                                        aria-label={`${localizedTitle} - ${localizedDesc}`}
                                    >
                                        <span className="sr-only">{localizedTitle} - {localizedDesc}</span>
                                    </Link>
                                    <tool.icon className={`w-12 h-12 text-blue-500 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{localizedTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{localizedDesc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <CategoryGuideSection category="memory" />
                </motion.div>
            </motion.div>
        </div>
    );
}
