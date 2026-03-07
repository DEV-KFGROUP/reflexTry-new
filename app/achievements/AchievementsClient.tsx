"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock } from "lucide-react";
import { Achievements, Achievement } from "@/utils/achievements";

export default function AchievementsClient() {
    const [unlocked, setUnlocked] = useState<Achievement[]>([]);
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        setUnlocked(Achievements.getUnlocked());
        setAllAchievements(Achievements.getAll());
    }, []);

    const unlockedIds = new Set(unlocked.map(a => a.id));
    const locked = allAchievements.filter(a => !unlockedIds.has(a.id));

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                    >
                        <Trophy className="w-12 h-12 text-yellow-500" />
                    </motion.div>
                    <h1 
                        className="text-4xl md:text-5xl font-bold"
                        style={{
                            background: 'linear-gradient(to right, #eab308, #f97316)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            color: '#eab308'
                        }}
                    >
                        Achievements
                    </h1>
                    <p className="text-gray-400 text-lg">
                        {unlocked.length} of {allAchievements.length} unlocked
                    </p>
                </div>

                {/* Quick info - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">⭐</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">High Scores</h3>
                        <p className="text-xs text-theme-secondary">Reach milestones</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🔥</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Daily Streaks</h3>
                        <p className="text-xs text-theme-secondary">Stay consistent</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎯</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Skill Mastery</h3>
                        <p className="text-xs text-theme-secondary">Master tools</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-bold text-white">
                            {Math.round((unlocked.length / allAchievements.length) * 100)}%
                        </span>
                    </div>
                    <div className="w-full bg-white/5 rounded-full h-3 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(unlocked.length / allAchievements.length) * 100}%` }}
                            transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
                        />
                    </div>
                </div>

                {/* Unlocked Achievements */}
                {unlocked.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Unlocked</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {unlocked.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/40 rounded-2xl p-6"
                                >
                                    <div className="text-5xl mb-3">{achievement.icon}</div>
                                    <h3 className="text-xl font-bold text-white mb-1">{achievement.name}</h3>
                                    <p className="text-sm text-gray-300 mb-3">{achievement.description}</p>
                                    {achievement.unlockedAt && (
                                        <p className="text-xs text-gray-400">
                                            Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Locked Achievements */}
                {locked.length > 0 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">Locked</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {locked.map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: (unlocked.length + index) * 0.1 }}
                                    className="bg-white/5 border border-white/10 rounded-2xl p-6 opacity-50"
                                >
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="text-5xl grayscale">{achievement.icon}</div>
                                        <Lock className="w-6 h-6 text-gray-500" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-500 mb-1">{achievement.name}</h3>
                                    <p className="text-sm text-gray-400">{achievement.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

