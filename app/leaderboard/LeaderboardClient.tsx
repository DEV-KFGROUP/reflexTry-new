"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, ArrowRight, Globe, TrendingUp, HelpCircle, Activity, Sparkles } from "lucide-react";
import { Storage, Score } from "@/utils/storage";
import Link from "next/link";
import { db, LeaderboardEntry } from "@/lib/database";
import { ShareButton } from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n/context";

const TOOLS = [
    { id: "sequence-memory", label: "Sequence Memory", category: "memory", path: "/memory/sequence", icon: "🧠" },
    { id: "number-memory", label: "Number Memory", category: "memory", path: "/memory/number", icon: "🔢" },
    { id: "reaction-time", label: "Reaction Time", category: "reflex", path: "/reflex/reaction", icon: "⚡" },
    { id: "typing-speed", label: "Typing Speed", category: "speed", path: "/speed/typing", icon: "⌨️" },
    { id: "cps-test", label: "Click Speed", category: "speed", path: "/speed/click", icon: "🖱️" },
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
                <Trophy className="w-32 h-32 text-amber-400 drop-shadow-[0_0_15px_rgba(245,158,11,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Globe className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function LeaderboardClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [scores, setScores] = useState<Record<string, Score | null>>({});
    const [globalLeaderboards, setGlobalLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
    const [viewMode, setViewMode] = useState<"local" | "global">("local");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadedScores: Record<string, Score | null> = {};
        TOOLS.forEach(tool => {
            loadedScores[tool.id] = Storage.getScore(tool.id);
        });
        setScores(loadedScores);

        // Load global leaderboards
        const loadGlobal = async () => {
            const leaderboards: Record<string, LeaderboardEntry[]> = {};
            for (const tool of TOOLS) {
                leaderboards[tool.id] = await db.getLeaderboard(tool.id, 10);
            }
            setGlobalLeaderboards(leaderboards);
            setIsLoaded(true);
        };
        loadGlobal();
    }, []);

    const getScoreColor = (score: Score | null, unit: string) => {
        if (!score) return "text-muted-foreground";
        return "text-amber-500";
    };

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
                            <Trophy className="w-12 h-12 text-amber-400 drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 
                            className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-amber-400 dark:via-yellow-400 dark:to-yellow-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm"
                            suppressHydrationWarning
                        >
                            <Sparkles className="w-10 h-10 text-amber-400" />
                            {t("leaderboard.heroTitle", "Global Leaderboard")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("leaderboard.heroSubtitle", "Compete against players worldwide and track your progress across all Reflextry challenges. Establish your baseline and reach for the top tier.")}
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
                            <div className="text-3xl mb-2 drop-shadow-md">🏆</div>
                            <h3 className="text-base font-bold text-foreground mb-1">{t("leaderboard.personalBests", "Personal Bests")}</h3>
                            <p className="text-sm text-muted-foreground">{t("leaderboard.personalBestsDesc", "Your top scores locally")}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-3xl mb-2 drop-shadow-md">🌍</div>
                            <h3 className="text-base font-bold text-foreground mb-1">{t("leaderboard.globalRankings", "Global Rankings")}</h3>
                            <p className="text-sm text-muted-foreground">{t("leaderboard.globalRankingsDesc", "Compare worldwide")}</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <div className="text-3xl mb-2 drop-shadow-md">📊</div>
                            <h3 className="text-base font-bold text-foreground mb-1">{t("leaderboard.trackProgress", "Track Progress")}</h3>
                            <p className="text-sm text-muted-foreground">{t("leaderboard.trackProgressDesc", "See your improvements")}</p>
                        </div>
                    </div>

                    {/* View Mode Toggle - 3D Pill buttons */}
                    <div className="flex items-center justify-center gap-4 mb-12 relative z-10">
                        <div className="flex p-1 bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-full shadow-inner">
                            <button
                                onClick={() => setViewMode("local")}
                                className={`relative px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${viewMode === "local" ? "text-amber-500 bg-white/10 shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                {t("leaderboard.myScores", "My Scores")}
                            </button>
                            <button
                                onClick={() => setViewMode("global")}
                                className={`relative flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 ${viewMode === "global" ? "text-indigo-400 bg-white/10 shadow-[0_0_15px_rgba(99,102,241,0.2)] border border-indigo-500/30" : "text-muted-foreground hover:text-foreground"}`}
                            >
                                <Globe className="w-4 h-4" /> {t("leaderboard.global", "Global")}
                            </button>
                        </div>
                    </div>

                    {/* Content Area */}
                    <AnimatePresence mode="wait">
                        {viewMode === "local" ? (
                            <motion.div
                                key="local"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
                            >
                                {TOOLS.map((tool, index) => {
                                    const score = scores[tool.id];
                                    return (
                                        <motion.div
                                            key={tool.id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="group relative p-6 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] flex flex-col justify-between min-h-[220px]"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />

                                            <div className="space-y-4 h-full flex flex-col relative z-10">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wide flex items-center gap-2 group-hover:text-amber-500 transition-colors">
                                                        <span>{tool.icon}</span> {t(`tools.${tool.id}.title`, tool.label)}
                                                    </h3>
                                                </div>

                                                {score ? (
                                                    <div className="flex-1 flex flex-col justify-center space-y-1 my-4">
                                                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{t("leaderboard.personalBests", "Personal Best")}</p>
                                                        <p className={`text-3xl font-mono font-black ${getScoreColor(score, score.unit)} drop-shadow-sm`}>
                                                            {score.value.toLocaleString()} <span className="text-base text-muted-foreground">{score.unit}</span>
                                                        </p>
                                                        {score.playerName && (
                                                            <p className="text-[10px] font-mono text-amber-500 mt-1 uppercase tracking-wide">
                                                                P: {score.playerName}
                                                            </p>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex-1 flex flex-col justify-center items-center py-6">
                                                        <Activity className="w-8 h-8 text-muted-foreground mb-2 opacity-50" />
                                                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide opacity-50">{t("leaderboard.noScoresYet", "No Telemetry")}</p>
                                                    </div>
                                                )}

                                                <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between mt-auto">
                                                    {score ? (
                                                        <p className="text-[10px] font-mono text-muted-foreground">
                                                            {new Date(score.timestamp).toLocaleDateString()}
                                                        </p>
                                                    ) : (
                                                        <span />
                                                    )}
                                                    <Link
                                                        href={getLocalizedHref(tool.path)}
                                                        className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-foreground bg-white/5 border border-black/10 dark:border-white/10 hover:border-amber-500 hover:text-amber-400 hover:bg-amber-500/10 transition-all z-10"
                                                    >
                                                        {t("leaderboard.testNow", "PLAY")} <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="global"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="w-full space-y-8 max-w-4xl mx-auto relative z-10"
                            >
                                {TOOLS.map((tool) => {
                                    const entries = globalLeaderboards[tool.id] || [];
                                    return (
                                        <div key={tool.id} className="relative p-6 md:p-8 rounded-3xl bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 shadow-lg overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50" />
                                            
                                            <h3 className="text-lg font-bold text-foreground uppercase tracking-widest mb-6 flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                                                    <TrendingUp className="w-4 h-4" />
                                                </div>
                                                {tool.icon} {t(`tools.${tool.id}.title`, tool.label)}
                                            </h3>
                                            
                                            {!isLoaded ? (
                                                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                                                    <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Syncing Telemetry...</p>
                                                </div>
                                            ) : entries.length > 0 ? (
                                                <div className="space-y-3 relative z-10">
                                                    {entries.slice(0, 10).map((entry, index) => (
                                                        <div
                                                            key={entry.id}
                                                            className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/5 dark:bg-white/5 rounded-2xl border border-black/10 dark:border-white/10 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] transition-all duration-300"
                                                        >
                                                            <div className="flex items-center gap-4">
                                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-black text-sm
                                                                    ${index === 0 ? "bg-amber-500/20 text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] border border-amber-500/30" :
                                                                    index === 1 ? "bg-slate-400/20 text-slate-300 shadow-[0_0_15px_rgba(148,163,184,0.2)] border border-slate-400/30" :
                                                                    index === 2 ? "bg-orange-500/20 text-orange-500 shadow-[0_0_15px_rgba(234,88,12,0.2)] border border-orange-500/30" :
                                                                    "bg-white/5 border border-black/10 dark:border-white/10 text-muted-foreground"
                                                                    }`}>
                                                                    #{index + 1}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold text-foreground group-hover:text-indigo-400 transition-colors">
                                                                        {entry.username || "Anonymous"}
                                                                    </p>
                                                                    <p className="text-[10px] font-mono text-muted-foreground mt-0.5">
                                                                        {new Date(entry.timestamp).toLocaleDateString()}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="text-left sm:text-right mt-3 sm:mt-0 pl-14 sm:pl-0">
                                                                <p className="text-xl font-mono font-black text-indigo-400 drop-shadow-sm">
                                                                    {entry.score.toLocaleString()}
                                                                </p>
                                                                <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{entry.unit}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 bg-white/5 rounded-2xl border border-black/10 dark:border-white/10">
                                                    <Trophy className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                                                    <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide opacity-50">
                                                        {t("leaderboard.noScoresYet", "No global records yet. Set the baseline!")}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Footer Notes & Share */}
                    <div className="w-full max-w-4xl mx-auto bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-lg relative mt-16 text-center z-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                            <HelpCircle className="w-6 h-6 text-muted-foreground" />
                        </div>

                        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide leading-relaxed max-w-2xl mx-auto mb-8">
                            {viewMode === "local"
                                ? "[LOCAL] SCORES ARE STORED ON THIS DEVICE AND BROWSER ONLY. CLEARING YOUR BROWSER CACHE OR COOKIES WILL RESET THESE RECORDS."
                                : "[GLOBAL] THE LEADERBOARD SHOWS TOP TELEMETRY FROM ALL ACTIVE USERS. SCORES ARE AUTOMATICALLY SUBMITTED UPON TASK COMPLETION."
                            }
                        </p>
                        
                        <ShareButton text="Check out my high scores on Reflextry!" />
                    </div>
                    {/* SEO & Content Block */}
                    <div className="w-full max-w-4xl mx-auto bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-10 shadow-lg relative mt-8 z-10">
                        <h2 className="text-2xl font-black text-foreground mb-4">How the Reflextry Leaderboard Works</h2>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The Reflextry Leaderboard tracks the elite cognitive performances across our platform. Whether you're grinding the <strong>Reaction Time Test</strong> to hit sub-150ms latency, or proving your spatial memory in the <strong>Chimp Test</strong>, this is where the top 1% of players are immortalized.
                            </p>
                            <h3 className="text-xl font-bold text-foreground mt-6 mb-2">Local vs. Global Rankings</h3>
                            <p>
                                We offer two distinct tracking modes. The <strong>Local Leaderboard</strong> acts as your personal cognitive telemetry dashboard, securely saving your high scores locally so you can benchmark your own progress over time. The <strong>Global Leaderboard</strong> connects to our cloud infrastructure, displaying the absolute highest authenticated scores from users worldwide.
                            </p>
                            <h3 className="text-xl font-bold text-foreground mt-6 mb-2">Fair Play & Latency</h3>
                            <p>
                                Because hardware (like a 240Hz monitor vs a 60Hz phone screen) heavily impacts raw reaction scores, we employ statistical filtering algorithms to eliminate impossible scores (like 1ms bot clicks). This ensures the global rankings remain an accurate representation of peak human capability.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
