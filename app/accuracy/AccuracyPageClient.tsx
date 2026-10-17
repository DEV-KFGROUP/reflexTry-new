"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Target, Keyboard, CheckCircle, XCircle, Crosshair,
  Palette, Eye, Brain, Sparkles
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

const ACCURACY_TOOLS: ToolItem[] = [
  {
    title: "Image Recognition",
    desc: "Scan and identify heavily blurred, rotated, and distorted emojis.",
    icon: Eye,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/image-recognition",
  },
  {
    title: "Color Blindness Test",
    desc: "Find the hidden number or shape in the Ishihara color plates.",
    icon: Eye,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/color-blindness",
  },
  {
    title: "Mental Rotation",
    desc: "Determine if 3D shapes are identical or mirrored under rotation.",
    icon: Brain,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/mental-rotation",
  },
  {
    title: "Data Entry Accuracy",
    desc: "Type complex cryptographic keys and code fragments with absolute precision.",
    icon: Keyboard,
    color: "text-emerald-655",
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/data",
  },
  {
    title: "Pattern Matching",
    desc: "Match long spatial sequences of symbols amidst highly confusing decoy sets.",
    icon: Brain,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/pattern-matching",
  },
  {
    title: "Precision Clicking",
    desc: "Aim and snap-click tiny targets that drift and vibrate across boundaries.",
    icon: Target,
    color: "text-emerald-655",
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/precision-click",
  },
  {
    title: "Angle Estimation",
    desc: "Observe visual geometry elements and estimate angles under rotated baselines.",
    icon: Crosshair,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/angle-estimation",
  },
  {
    title: "Color Match",
    desc: "Recall flashed target colors and replicate them precisely using RGB sliders.",
    icon: Palette,
    color: "text-emerald-655",
    bg: "bg-emerald-50/80",
    border: "border-emerald-200/60",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.06)]",
    href: "/accuracy/color-match",
  },
];

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Target className="w-32 h-32 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Crosshair className="w-40 h-40 text-teal-400 drop-shadow-[0_0_15px_rgba(20,184,166,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function AccuracyPageClient() {
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
                        <div className="absolute inset-0 bg-emerald-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                            <Target className="w-12 h-12 text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-emerald-400 dark:via-teal-400 dark:to-teal-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-emerald-400" />
                            {t("categoryHub.accuracy.heroTitle", "Aim & Precision Training")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("categoryHub.accuracy.heroSubtitle", "Refine your micro-target accuracy, hand-eye coordination, and visual estimation.")}
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        {t("categoryHub.accuracy.heroDesc", "Speed is nothing without control. The accuracy training suite forces you to prioritize exactness over raw velocity, helping you eliminate errors, reduce backspaces, and build a foundation of reliable muscle memory.")}
                    </p>
                </motion.div>

                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-emerald-500" /> {t("categoryHub.accuracy.whatItCovers", "What This Arena Covers")}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("categoryHub.accuracy.whatItCoversDesc", "Precision over pace: color matching, angle estimation, pattern matching, mental rotation, and pixel-level clicking. Slow down to remove errors, then add speed once the motion is clean.")}
                    </p>
                </motion.section>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(16,185,129,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick benefits */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Target className="w-8 h-8 text-emerald-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.accuracy.benefit1Title", "Precision Aim")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.accuracy.benefit1Desc", "Micro-target clicks")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Eye className="w-8 h-8 text-teal-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.accuracy.benefit2Title", "Spatial Angles")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.accuracy.benefit2Desc", "Angle estimation")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">🎯</div>
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.accuracy.benefit3Title", "Visual Match")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.accuracy.benefit3Desc", "Pattern recognition")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {ACCURACY_TOOLS.map((tool, index) => {
                            const shortSlug = tool.href.replace("/accuracy/", "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <motion.div
                                    key={tool.title}
                                    variants={itemVariants}
                                    className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(16,185,129,0.2)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Link
                                        href={getLocalizedHref(tool.href)}
                                        className="absolute inset-0 z-10"
                                        aria-label={`${localizedTitle} - ${localizedDesc}`}
                                    >
                                        <span className="sr-only">{localizedTitle} - {localizedDesc}</span>
                                    </Link>
                                    <tool.icon className={`w-12 h-12 text-emerald-500 dark:text-emerald-400 mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{localizedTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{localizedDesc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <CategoryGuideSection category="accuracy" />
                </motion.div>
            </motion.div>
        </div>
    );
}
