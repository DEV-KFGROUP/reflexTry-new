"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trophy, Activity, BarChart3, Download, Sparkles, Target, LineChart } from "lucide-react";
import { ScoreHistory, ScoreHistoryEntry } from "@/utils/scoreHistory";
import { Storage } from "@/utils/storage";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n/context";

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <BarChart3 className="w-32 h-32 text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Activity className="w-40 h-40 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 15, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[15%] opacity-15"
            >
                <TrendingUp className="w-24 h-24 text-green-400 drop-shadow-[0_0_15px_rgba(34,197,94,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[30%] left-[10%] opacity-15"
            >
                <LineChart className="w-28 h-28 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function StatisticsClient() {
    const { t } = useTranslation();
    const [history, setHistory] = useState<Record<string, ScoreHistoryEntry[]>>({});
    const [selectedTool, setSelectedTool] = useState<string | null>(null);

    useEffect(() => {
        setHistory(ScoreHistory.getAll());
    }, []);

    const tools = Object.keys(history).filter(key => history[key].length > 0);
    const totalGames = Object.values(history).reduce((sum, entries) => sum + entries.length, 0);
    const totalTools = tools.length;

    const handleExport = () => {
        const data = {
            history,
            highScores: {} as Record<string, any>,
            exportedAt: new Date().toISOString(),
        };

        // Get all high scores
        tools.forEach(toolId => {
            const score = Storage.getScore(toolId);
            if (score) {
                data.highScores[toolId] = score;
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reflextry-statistics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
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
                    >
                        <div className="absolute inset-0 bg-teal-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                            <BarChart3 className="w-12 h-12 text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-blue-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-teal-400 dark:via-blue-400 dark:to-blue-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm">
                            <Sparkles className="w-10 h-10 text-teal-400" />
                            {t("statistics.heroTitle", "Your Statistics")}
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {t("statistics.heroSubtitle", "Track your progress, view performance trends, and analyze your improvement across all tools.")}
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(45,212,191,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick info - Clean card layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <TrendingUp className="w-8 h-8 text-teal-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">{t("statistics.scoreTrend", "Track Trends")}</h3>
                            <p className="text-sm text-muted-foreground">See improvements</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <LineChart className="w-8 h-8 text-blue-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">View Charts</h3>
                            <p className="text-sm text-muted-foreground">Visual progress</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Download className="w-8 h-8 text-purple-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">{t("statistics.downloadData", "Export Data")}</h3>
                            <p className="text-sm text-muted-foreground">Save your stats</p>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-teal-500/10 to-transparent border border-teal-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(45,212,191,0.1)] hover:shadow-[0_0_40px_rgba(45,212,191,0.2)] transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="bg-teal-500/20 p-3 rounded-2xl border border-teal-500/30">
                                    <Activity className="w-8 h-8 text-teal-500 dark:text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{t("statistics.totalSessions", "Total Games")}</h3>
                            </div>
                            <p className="text-6xl font-black text-teal-600 dark:text-teal-400 drop-shadow-md relative z-10">{totalGames}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(250,204,21,0.1)] hover:shadow-[0_0_40px_rgba(250,204,21,0.2)] transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="bg-yellow-500/20 p-3 rounded-2xl border border-yellow-500/30">
                                    <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{t("statistics.selectTest", "Tools Used")}</h3>
                            </div>
                            <p className="text-6xl font-black text-yellow-600 dark:text-yellow-400 drop-shadow-md relative z-10">{totalTools}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-3xl p-8 shadow-[0_0_30px_rgba(34,197,94,0.1)] hover:shadow-[0_0_40px_rgba(34,197,94,0.2)] transition-all duration-300 relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <div className="bg-green-500/20 p-3 rounded-2xl border border-green-500/30">
                                    <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                </div>
                                <h3 className="text-2xl font-bold text-foreground">{t("statistics.averageScore", "Average Score")}</h3>
                            </div>
                            <p className="text-6xl font-black text-green-600 dark:text-green-400 drop-shadow-md relative z-10">
                                {totalGames > 0 
                                    ? Math.round(
                                        Object.values(history).flat()
                                            .reduce((sum, entry) => sum + entry.value, 0) / totalGames
                                    )
                                    : 0
                                }
                            </p>
                        </motion.div>
                    </div>

                    {/* Tool Statistics */}
                    <div className="space-y-8 relative z-10">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <Target className="w-8 h-8 text-teal-500 dark:text-teal-400" />
                                <h2 className="text-3xl font-black text-foreground">{t("statistics.scoreTrend", "Tool Performance")}</h2>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={handleExport} 
                                className="flex items-center gap-2 rounded-full border-teal-500/50 text-teal-600 dark:text-teal-400 hover:bg-teal-500/10 hover:border-teal-400 transition-all shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                            >
                                <Download className="w-4 h-4" />
                                {t("statistics.downloadData", "Export Data")}
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {tools.map((toolId) => {
                                const stats = ScoreHistory.getStats(toolId);
                                if (!stats) return null;

                                return (
                                    <motion.div
                                        key={toolId}
                                        variants={itemVariants}
                                        className="group bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 rounded-3xl p-6 cursor-pointer hover:border-teal-500/50 hover:bg-teal-500/5 transition-all duration-300 shadow-lg hover:shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                                        onClick={() => setSelectedTool(selectedTool === toolId ? null : toolId)}
                                    >
                                        <h3 className="text-xl font-bold text-foreground mb-6 capitalize border-b border-black/10 dark:border-white/10 pb-4 group-hover:border-teal-500/30 transition-colors">
                                            {t(`tools.${toolId}.title`, toolId.replace(/-/g, " "))}
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center bg-black/5 dark:bg-black/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                                                <span className="text-muted-foreground font-medium">{t("statistics.totalSessions", "Games Played")}:</span>
                                                <span className="text-foreground font-black text-lg">{stats.count}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-teal-500/10 p-3 rounded-xl border border-teal-500/20">
                                                <span className="text-teal-700 dark:text-teal-400 font-bold">{t("statistics.bestPerformance", "Best Score")}:</span>
                                                <span className="text-teal-600 dark:text-teal-400 font-black text-lg drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]">
                                                    {stats.best.toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center bg-black/5 dark:bg-black/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                                                <span className="text-muted-foreground font-medium">{t("statistics.averageScore", "Average")}:</span>
                                                <span className="text-foreground font-bold text-lg">
                                                    {Math.round(stats.average).toLocaleString()}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center bg-black/5 dark:bg-black/20 p-3 rounded-xl border border-black/5 dark:border-white/5">
                                                <span className="text-muted-foreground font-medium">{t("statistics.scoreTrend", "Trend")}:</span>
                                                <span className={`font-black text-lg uppercase tracking-wider ${
                                                    stats.trend === "improving" ? "text-green-600 dark:text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.3)]" :
                                                    stats.trend === "declining" ? "text-red-600 dark:text-red-400" :
                                                    "text-muted-foreground"
                                                }`}>
                                                    {stats.trend}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {tools.length === 0 && (
                            <div className="text-center py-16 bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 backdrop-blur-sm">
                                <BarChart3 className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                                <p className="text-muted-foreground text-lg">{t("statistics.noData", "No statistics yet. Start playing games to see your progress!")}</p>
                            </div>
                        )}
                    </div>

                    {/* Share Section */}
                    {tools.length > 0 && (
                        <div className="mt-12 bg-gradient-to-r from-teal-500/10 to-blue-500/10 border border-teal-500/20 rounded-3xl p-8 text-center relative z-10 shadow-[0_0_30px_rgba(45,212,191,0.15)]">
                            <h3 className="text-2xl font-black text-foreground mb-6">Share Your Progress</h3>
                            <div className="inline-block hover:scale-105 transition-transform duration-300">
                                <ShareButton 
                                    text={`I've played ${totalGames} games across ${totalTools} tools on Reflextry!`}
                                />
                            </div>
                        </div>
                    )}

                    {/* SEO & Content Block */}
                    <div className="w-full mt-16 p-8 md:p-10 bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl shadow-lg relative z-10">
                        <h2 className="text-2xl md:text-3xl font-black text-foreground mb-6">Deep Dive into Cognitive Statistics</h2>
                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <p>
                                At Reflextry, we believe that you can't improve what you don't measure. The <strong>Statistics & Progress</strong> dashboard is your personal cognitive telemetry center, designed to track your latency, working memory retention, and motor-skill accuracy over time.
                            </p>
                            
                            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Why Tracking Matters</h3>
                            <p>
                                Whether you're an esports athlete looking to optimize your flick-shot reaction times or a student aiming to improve focus and short-term memory, establishing a <strong>personal baseline</strong> is critical. By logging your scores daily, you can visualize whether your cognitive agility is trending upward, or if factors like fatigue and lack of sleep are impacting your latency.
                            </p>
                            
                            <h3 className="text-xl font-bold text-foreground mt-8 mb-4">Interpreting Your Averages</h3>
                            <p>
                                We calculate your average performance by aggregating your historical data points. It's completely normal to experience variance (standard deviation) in your scores based on time of day, hardware changes, or physical condition. We recommend focusing on the long-term <strong>Trend</strong> indicator rather than stressing over a single suboptimal session.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
