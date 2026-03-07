"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Trophy, Activity, BarChart3, Download } from "lucide-react";
import { ScoreHistory, ScoreHistoryEntry } from "@/utils/scoreHistory";
import { Storage } from "@/utils/storage";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ShareButton";

export default function StatisticsClient() {
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

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Quick info - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">📈</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Track Trends</h3>
                        <p className="text-xs text-theme-secondary">See improvements</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">View Charts</h3>
                        <p className="text-xs text-theme-secondary">Visual progress</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">💾</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Export Data</h3>
                        <p className="text-xs text-theme-secondary">Save your stats</p>
                    </div>
                </div>

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                    >
                        <BarChart3 className="w-12 h-12 text-neon-teal" />
                    </motion.div>
                    <h1 
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#00f0ff'
                        }}
                    >
                        Your Statistics
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Track your progress and improvement across all tools
                    </p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Activity className="w-8 h-8 text-neon-teal" />
                            <h3 className="text-xl font-bold text-white">Total Games</h3>
                        </div>
                        <p className="text-4xl font-bold text-neon-teal">{totalGames}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            <h3 className="text-xl font-bold text-white">Tools Used</h3>
                        </div>
                        <p className="text-4xl font-bold text-yellow-500">{totalTools}</p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-6"
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-8 h-8 text-green-500" />
                            <h3 className="text-xl font-bold text-white">Average Score</h3>
                        </div>
                        <p className="text-4xl font-bold text-green-500">
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
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white">Tool Performance</h2>
                        <Button variant="outline" onClick={handleExport} className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export Data
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tools.map((toolId) => {
                            const stats = ScoreHistory.getStats(toolId);
                            if (!stats) return null;

                            return (
                                <motion.div
                                    key={toolId}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 cursor-pointer hover:border-white/20 transition-colors"
                                    onClick={() => setSelectedTool(selectedTool === toolId ? null : toolId)}
                                >
                                    <h3 className="text-lg font-bold text-white mb-4 capitalize">
                                        {toolId.replace(/-/g, " ")}
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Games Played:</span>
                                            <span className="text-white font-bold">{stats.count}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Best Score:</span>
                                            <span className="text-neon-teal font-bold">
                                                {stats.best.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Average:</span>
                                            <span className="text-white font-bold">
                                                {Math.round(stats.average).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Trend:</span>
                                            <span className={`font-bold ${
                                                stats.trend === "improving" ? "text-green-500" :
                                                stats.trend === "declining" ? "text-red-500" :
                                                "text-gray-400"
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
                        <div className="text-center py-12 text-gray-400">
                            <p>No statistics yet. Start playing games to see your progress!</p>
                        </div>
                    )}
                </div>

                {/* Share Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                    <h3 className="text-xl font-bold text-white mb-4">Share Your Progress</h3>
                    <ShareButton 
                        text={`I've played ${totalGames} games across ${totalTools} tools on Reflextry!`}
                    />
                </div>
            </div>
        </div>
    );
}

