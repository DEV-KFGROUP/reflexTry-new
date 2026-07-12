"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Flame, Trophy, Target, ArrowRight, Sparkles, Gift } from "lucide-react";
import { DailyChallenge } from "@/utils/dailyChallenge";
import Link from "next/link";
import { TOOL_MAPPING } from "@/config/tool-mapping";

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Target className="w-32 h-32 text-teal-400 drop-shadow-[0_0_15px_rgba(45,212,191,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Trophy className="w-40 h-40 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 15, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[15%] opacity-15"
            >
                <Flame className="w-24 h-24 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[30%] left-[10%] opacity-15"
            >
                <Calendar className="w-28 h-28 text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />
            </motion.div>
        </div>
    );
};

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
                <div className="text-center text-muted-foreground">
                    <p>Loading challenge...</p>
                </div>
            </div>
        );
    }

    const toolPath = TOOL_MAPPING[challenge.toolId] || `/${challenge.toolId}`;

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
                className="max-w-4xl mx-auto space-y-12 relative z-10"
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
                            <Calendar className="w-12 h-12 text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-white dark:to-white/50 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm">
                            <Sparkles className="w-10 h-10 text-teal-400" />
                            Daily Challenge
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        Complete today's challenge to earn rewards, build your streak, and unlock new badges!
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(45,212,191,0.15)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick info - Clean card layout */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Gift className="w-8 h-8 text-purple-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Earn Rewards</h3>
                            <p className="text-sm text-muted-foreground">Complete daily goals</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Build Streaks</h3>
                            <p className="text-sm text-muted-foreground">Stay consistent</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Unlock Badges</h3>
                            <p className="text-sm text-muted-foreground">Achieve milestones</p>
                        </div>
                    </div>

                    {/* Streak */}
                    {streak > 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-500/40 rounded-2xl p-6 text-center mb-8 relative overflow-hidden group shadow-[0_0_30px_rgba(251,146,60,0.2)]"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            <div className="flex items-center justify-center gap-3 mb-2 relative z-10">
                                <Flame className="w-8 h-8 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)] animate-pulse" />
                                <h2 className="text-4xl font-black text-foreground drop-shadow-md">{streak}</h2>
                            </div>
                            <p className="text-muted-foreground font-bold text-lg relative z-10">Day Streak!</p>
                        </motion.div>
                    )}

                    {/* Challenge Card */}
                    <div
                        className={`relative bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl p-6 lg:p-10 shadow-xl overflow-hidden transition-all duration-500 ${isCompleted
                                ? "ring-2 ring-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.2)]"
                                : ""
                            }`}
                    >
                        {isCompleted && (
                            <div className="absolute inset-0 bg-green-500/5 pointer-events-none" />
                        )}

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 relative z-10">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Target className="w-8 h-8 text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" />
                                    <h2 className="text-3xl font-black text-foreground">Today's Mission</h2>
                                </div>
                                <p className="text-muted-foreground text-lg font-medium">
                                    {new Date(challenge.date).toLocaleDateString("en-US", {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </p>
                            </div>
                            {isCompleted && (
                                <motion.div 
                                    initial={{ scale: 0, rotate: -180 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="mt-4 sm:mt-0 bg-green-500/20 text-green-400 p-4 rounded-full border border-green-500/30 shadow-[0_0_20px_rgba(34,197,94,0.4)]"
                                >
                                    <Target className="w-8 h-8" />
                                </motion.div>
                            )}
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="bg-black/5 dark:bg-black/20 rounded-2xl p-6 border border-black/10 dark:border-white/5">
                                <h3 className="text-2xl font-bold text-foreground mb-3 capitalize flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-purple-400" />
                                    {challenge.toolId.replace(/-/g, " ")}
                                </h3>
                                <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                                    {challenge.description}
                                </p>
                                <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-xl p-6 border border-teal-500/20">
                                    <div className="flex flex-col sm:flex-row items-baseline gap-3">
                                        <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Goal:</span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-black text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.5)]">
                                                {challenge.target}
                                            </span>
                                            <span className="text-foreground/80 font-bold uppercase tracking-wider">{challenge.unit}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 shadow-inner">
                                <div className="flex items-center gap-3 mb-2">
                                    <Trophy className="w-6 h-6 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                    <span className="font-bold text-yellow-500 dark:text-yellow-400 text-lg">Reward Pending:</span>
                                </div>
                                <p className="text-foreground font-medium text-lg ml-9">{challenge.reward}</p>
                            </div>

                            {!isCompleted && (
                                <Link
                                    href={toolPath}
                                    className="group relative flex items-center justify-center gap-3 px-8 py-5 text-lg rounded-2xl font-bold transition-all duration-300 w-full overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 opacity-90 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-purple-400 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 -z-10" />
                                    
                                    <span className="relative z-10 text-white drop-shadow-md">Start Challenge</span>
                                    <ArrowRight className="w-6 h-6 relative z-10 text-white group-hover:translate-x-2 transition-transform duration-300" />
                                </Link>
                            )}

                            {isCompleted && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-8 bg-green-500/10 rounded-2xl border border-green-500/20"
                                >
                                    <p className="text-green-500 dark:text-green-400 font-black text-2xl mb-2 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]">Mission Accomplished! 🎉</p>
                                    <p className="text-muted-foreground font-medium text-lg">
                                        You've earned today's reward. Come back tomorrow for a new challenge!
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
