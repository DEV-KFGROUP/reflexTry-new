"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Flame, Trophy, Target, ArrowRight } from "lucide-react";
import { DailyChallenge } from "@/utils/dailyChallenge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { TOOL_MAPPING } from "@/config/tool-mapping";

export default function ChallengesClient() {
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const todayChallenge = DailyChallenge.getToday();
        setChallenge(todayChallenge);
        setIsCompleted(DailyChallenge.isCompleted());
        setStreak(DailyChallenge.getStreak());
    }, []);

    if (!challenge) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center text-gray-400">
                    <p>Loading challenge...</p>
                </div>
            </div>
        );
    }

    const toolPath = TOOL_MAPPING[challenge.toolId] || `/${challenge.toolId}`;

    return (
        <div className="bg-background py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-4"
                    >
                        <Calendar className="w-12 h-12 text-teal-500" />
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
                        Daily Challenge
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Complete today's challenge to earn rewards!
                    </p>
                </div>

                {/* Quick info - Clean card layout */}
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🎁</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Earn Rewards</h3>
                        <p className="text-xs text-theme-secondary">Complete daily goals</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🔥</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Build Streaks</h3>
                        <p className="text-xs text-theme-secondary">Stay consistent</p>
                    </div>
                    <div className="p-4 rounded-xl bg-theme-surface/50 border border-theme/30 text-center">
                        <div className="text-2xl mb-2">🏆</div>
                        <h3 className="text-sm font-semibold text-theme-primary mb-1">Unlock Badges</h3>
                        <p className="text-xs text-theme-secondary">Achieve milestones</p>
                    </div>
                </div>

                {/* Streak */}
                {streak > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 rounded-2xl p-6 text-center"
                    >
                        <div className="flex items-center justify-center gap-3 mb-2">
                            <Flame className="w-8 h-8 text-orange-500" />
                            <h2 className="text-3xl font-bold text-white">{streak}</h2>
                        </div>
                        <p className="text-gray-300">Day Streak!</p>
                    </motion.div>
                )}

                {/* Challenge Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white/5 border-2 rounded-2xl p-8 ${isCompleted
                            ? "border-green-500/40 bg-green-500/10"
                            : "border-white/10"
                        }`}
                >
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Target className="w-6 h-6 text-teal-500" />
                                <h2 className="text-2xl font-bold text-white">Today's Challenge</h2>
                            </div>
                            <p className="text-gray-400">
                                {new Date(challenge.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                        {isCompleted && (
                            <div className="text-4xl">✅</div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-2 capitalize">
                                {challenge.toolId.replace(/-/g, " ")}
                            </h3>
                            <p className="text-gray-300 text-lg mb-4">{challenge.description}</p>
                            <div className="bg-white/5 rounded-xl p-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-bold text-teal-500">
                                        {challenge.target}
                                    </span>
                                    <span className="text-gray-400 uppercase">{challenge.unit}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Trophy className="w-5 h-5 text-yellow-500" />
                                <span className="font-bold text-yellow-400">Reward:</span>
                            </div>
                            <p className="text-white">{challenge.reward}</p>
                        </div>

                        {!isCompleted && (
                            <Link
                                href={toolPath}
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg rounded-full font-bold transition duration-200 cursor-pointer bg-teal-500 text-black hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] border-none w-full"
                            >
                                Start Challenge <ArrowRight className="w-5 h-5" />
                            </Link>
                        )}

                        {isCompleted && (
                            <div className="text-center py-4">
                                <p className="text-green-400 font-bold text-lg">Challenge Completed! 🎉</p>
                                <p className="text-gray-400 text-sm mt-2">
                                    Come back tomorrow for a new challenge!
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

