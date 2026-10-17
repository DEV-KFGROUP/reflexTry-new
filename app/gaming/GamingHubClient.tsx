"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Crosshair, Zap, Gamepad2, Music, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { CategoryGuideSection } from "@/components/CategoryGuideSection";

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
                            {t("categoryHub.gaming.heroTitle", "Esports Warmup & Aim Arena")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("categoryHub.gaming.heroSubtitle", "Calibrate mouse flick shots, target tracking, and combat reflexes for competitive games.")}
                    </p>
                    <p className="text-md text-muted-foreground/80 max-w-3xl mx-auto">
                        {t("categoryHub.gaming.heroDesc", "Built specifically for gamers in Counter-Strike, Valorant, Apex Legends, and Overwatch to warm up mechanical muscle memory before jumping into ranked games.")}
                    </p>
                </motion.div>

                <motion.section variants={itemVariants} className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 p-6 rounded-3xl mb-8 relative z-10 max-w-4xl mx-auto">
                    <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" /> {t("categoryHub.gaming.whatItCovers", "What This Arena Covers")}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t("categoryHub.gaming.whatItCoversDesc", "Flick shot aim, continuous target tracking, split-second combat reflexes, and dodging obstacle streams.")}
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
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.gaming.benefit1Title", "Flick Shots")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.gaming.benefit1Desc", "Target acquisition")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-purple-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.gaming.benefit2Title", "Tracking")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.gaming.benefit2Desc", "Smooth target follow")}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-2xl mb-2 drop-shadow-md">🏆</div>
                            <h3 className="text-base font-bold text-foreground mb-1">
                                {t("categoryHub.gaming.benefit3Title", "Combat Reflex")}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t("categoryHub.gaming.benefit3Desc", "Rapid decision making")}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {GAMING_TOOLS.map((tool, index) => {
                            const shortSlug = tool.href.replace("/gaming/", "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <motion.div
                                    key={tool.title}
                                    variants={itemVariants}
                                    className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(168,85,247,0.2)] overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Link
                                        href={getLocalizedHref(tool.href)}
                                        className="absolute inset-0 z-10"
                                        aria-label={`${localizedTitle} - ${localizedDesc}`}
                                    >
                                        <span className="sr-only">{localizedTitle} - {localizedDesc}</span>
                                    </Link>
                                    <tool.icon className={`w-12 h-12 ${tool.color} mb-4 group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_currentColor]`} />
                                    <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{localizedTitle}</h3>
                                    <p className="text-muted-foreground leading-relaxed">{localizedDesc}</p>
                                </motion.div>
                            );
                        })}
                    </div>

                    <CategoryGuideSection category="gaming" />
                </motion.div>
            </motion.div>
        </div>
    );
}
