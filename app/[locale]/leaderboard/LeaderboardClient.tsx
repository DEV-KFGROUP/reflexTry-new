"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, ArrowRight, Globe, TrendingUp } from "lucide-react";
import { Storage, Score } from "@/utils/storage";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { db, LeaderboardEntry } from "@/lib/database";
import { ShareButton } from "@/components/ShareButton";

const TOOLS = [
    { id: "sequence-memory", label: "Sequence Memory", category: "memory", path: "/memory/sequence" },
    { id: "number-memory", label: "Number Memory", category: "memory", path: "/memory/number" },
    { id: "reaction-time", label: "Reaction Time", category: "reflex", path: "/reflex/reaction" },
    { id: "typing-speed", label: "Typing Speed", category: "speed", path: "/speed/typing" },
    { id: "cps-test", label: "Click Speed", category: "speed", path: "/speed/click" },
];

export default function LeaderboardClient() {
    const t = useTranslations('Leaderboard');
    const [scores, setScores] = useState<Record<string, Score | null>>({});
    const [globalLeaderboards, setGlobalLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
    const [viewMode, setViewMode] = useState<"local" | "global">("local");

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
        };
        loadGlobal();
    }, []);

    const getScoreColor = (score: Score | null, unit: string) => {
        if (!score) return "text-theme-muted";
        return "text-neon-yellow";
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Quick info - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Personal Bests</h3>
                        <p className="text-xs text-theme-secondary">Your top scores</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🌍</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Global Rankings</h3>
                        <p className="text-xs text-theme-secondary">Compare worldwide</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">📊</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Track Progress</h3>
                        <p className="text-xs text-theme-secondary">See improvements</p>
                    </div>
                </div>

            <div className="text-center mb-12 space-y-4">
                <div className="inline-block p-3 rounded-full bg-yellow-500/10 mb-4">
                    <Trophy className="w-10 h-10 text-yellow-500" />
                </div>
                <h1 
                    className="text-4xl font-bold"
                    style={{
                        background: 'linear-gradient(to right, #00f0ff, #9d00ff)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        color: '#00f0ff'
                    }}
                >
                    {t('title')}
                </h1>
                <p className="text-theme-secondary max-w-2xl mx-auto">
                    {t('subtitle')}
                </p>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                        variant={viewMode === "local" ? "primary" : "outline"}
                        onClick={() => setViewMode("local")}
                    >
                        My Scores
                    </Button>
                    <Button
                        variant={viewMode === "global" ? "primary" : "outline"}
                        onClick={() => setViewMode("global")}
                    >
                        <Globe className="w-4 h-4 mr-2" />
                        Global Leaderboard
                    </Button>
                </div>
            </div>

            {viewMode === "local" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TOOLS.map((tool) => {
                        const score = scores[tool.id];
                        return (
                            <motion.div
                                key={tool.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-theme-surface border border-theme rounded-2xl p-6 hover:border-neon-teal/50 transition-all shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-theme-primary mb-4">{tool.label}</h3>
                                {score ? (
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm text-theme-secondary mb-1">Your Best</p>
                                            <p className={`text-3xl font-bold ${getScoreColor(score, score.unit)}`}>
                                                {score.value.toLocaleString()} <span className="text-lg text-theme-secondary">{score.unit}</span>
                                            </p>
                                            {score.playerName && (
                                                <p className="text-sm text-neon-teal mt-2">
                                                    Player: {score.playerName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="pt-4 border-t border-theme">
                                            <p className="text-xs text-theme-muted mb-2">
                                                Achieved: {new Date(score.timestamp).toLocaleDateString()}
                                            </p>
                                            <Link 
                                                href={tool.path}
                                                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-full font-bold transition-all duration-300 cursor-pointer border-2 border-neon-teal text-neon-teal hover:bg-neon-teal/10 w-full"
                                            >
                                                {t('play')} <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <p className="text-theme-muted mb-4">No score yet</p>
                                        <Link 
                                            href={tool.path}
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-base rounded-full font-bold transition-all duration-300 cursor-pointer border-2 border-neon-teal text-neon-teal hover:bg-neon-teal/10 w-full"
                                        >
                                            {t('play')} <ArrowRight className="w-4 h-4" />
                                        </Link>
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="space-y-8">
                    {TOOLS.map((tool) => {
                        const entries = globalLeaderboards[tool.id] || [];
                        return (
                            <div key={tool.id} className="bg-theme-surface border border-theme rounded-2xl p-6 shadow-lg">
                                <h3 className="text-2xl font-bold text-theme-primary mb-6 flex items-center gap-2">
                                    <TrendingUp className="w-6 h-6 text-neon-teal" />
                                    {tool.label}
                                </h3>
                                {entries.length > 0 ? (
                                    <div className="space-y-2">
                                        {entries.slice(0, 10).map((entry, index) => (
                                            <div
                                                key={entry.id}
                                                className="flex items-center justify-between p-4 bg-theme-surface rounded-lg border border-theme"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                                        index === 0 ? "bg-yellow-500 text-black" :
                                                        index === 1 ? "bg-gray-400 text-black" :
                                                        index === 2 ? "bg-orange-600 text-white" :
                                                        "bg-theme-surface border border-theme text-theme-primary"
                                                    }`}>
                                                        {index + 1}
                                                    </div>
                                                    <div>
                                                        <p className="text-theme-primary font-medium">
                                                            {entry.username || "Anonymous"}
                                                        </p>
                                                        <p className="text-xs text-theme-secondary">
                                                            {new Date(entry.timestamp).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xl font-bold text-neon-teal">
                                                        {entry.score.toLocaleString()}
                                                    </p>
                                                    <p className="text-xs text-theme-secondary uppercase">{entry.unit}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-theme-secondary text-center py-8">
                                        No global scores yet. Be the first!
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <div className="mt-12 text-center space-y-4">
                <p className="text-theme-muted text-sm">
                    {viewMode === "local" 
                        ? "* Scores are stored locally on this device and browser. Clearing cookies/cache will reset them."
                        : "* Global leaderboard shows top scores from all users. Your scores are automatically submitted when you play."
                    }
                </p>
                <ShareButton text="Check out my scores on Reflextry!" />
            </div>
        </div>
    );
}
