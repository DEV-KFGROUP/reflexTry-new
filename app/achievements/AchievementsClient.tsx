"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Lock, Star, Target, Zap, Award, Sparkles, Medal } from "lucide-react";
import { Achievements, Achievement } from "@/utils/achievements";

const FloatingBackground = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-[-1] rounded-3xl">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-500/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
            
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[15%] left-[5%] opacity-20"
            >
                <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[20%] right-[5%] opacity-20"
            >
                <Medal className="w-40 h-40 text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, -15, 0], x: [0, 15, 0], rotate: [0, 45, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[40%] right-[15%] opacity-15"
            >
                <Star className="w-24 h-24 text-yellow-300 drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]" />
            </motion.div>

            <motion.div
                animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-[30%] left-[10%] opacity-15"
            >
                <Award className="w-28 h-28 text-orange-300 drop-shadow-[0_0_15px_rgba(253,186,116,0.8)]" />
            </motion.div>
        </div>
    );
};

export default function AchievementsClient() {
    const [unlocked, setUnlocked] = useState<Achievement[]>([]);
    const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);

    useEffect(() => {
        setUnlocked(Achievements.getUnlocked());
        setAllAchievements(Achievements.getAll());
    }, []);

    const unlockedIds = new Set(unlocked.map(a => a.id));
    const locked = allAchievements.filter(a => !unlockedIds.has(a.id));

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
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
                className="max-w-6xl mx-auto space-y-12 relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center space-y-4 mb-12 relative z-10">
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="inline-block relative mb-4"
                    >
                        <div className="absolute inset-0 bg-yellow-500/30 blur-2xl rounded-full" />
                        <div className="relative p-4 rounded-full bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md shadow-[0_0_30px_rgba(250,204,21,0.2)]">
                            <Trophy className="w-12 h-12 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                        </div>
                    </motion.div>
                    
                    <div className="inline-block relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-orange-500 blur-2xl opacity-30 animate-pulse" />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 dark:from-yellow-400 dark:via-orange-400 dark:to-orange-500 bg-clip-text text-transparent inline-flex items-center gap-3 relative z-10 drop-shadow-sm">
                            <Sparkles className="w-10 h-10 text-yellow-400" />
                            Achievements
                        </h1>
                    </div>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                        {unlocked.length} of {allAchievements.length} achievements unlocked
                    </p>
                </motion.div>

                {/* Main Glassmorphic Container */}
                <motion.div 
                    variants={itemVariants}
                    className="relative bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-3xl p-4 md:p-8 shadow-[0_0_50px_rgba(250,204,21,0.1)] z-10"
                >
                    <FloatingBackground />

                    {/* Quick info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 relative z-10">
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">High Scores</h3>
                            <p className="text-sm text-muted-foreground">Reach milestones</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Zap className="w-8 h-8 text-orange-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Daily Streaks</h3>
                            <p className="text-sm text-muted-foreground">Stay consistent</p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-center hover:bg-white/10 transition-colors">
                            <Target className="w-8 h-8 text-red-400 mx-auto mb-3 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]" />
                            <h3 className="text-base font-bold text-foreground mb-1">Skill Mastery</h3>
                            <p className="text-sm text-muted-foreground">Master tools</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-white/5 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 rounded-3xl p-8 mb-12 relative z-10 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-bold text-muted-foreground uppercase tracking-wider">Overall Progress</span>
                            <span className="text-2xl font-black text-foreground drop-shadow-md">
                                {allAchievements.length > 0 ? Math.round((unlocked.length / allAchievements.length) * 100) : 0}%
                            </span>
                        </div>
                        <div className="w-full bg-black/10 dark:bg-white/5 rounded-full h-4 overflow-hidden border border-black/5 dark:border-white/10 shadow-inner">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${allAchievements.length > 0 ? (unlocked.length / allAchievements.length) * 100 : 0}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 relative"
                            >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </motion.div>
                        </div>
                    </div>

                    {/* Unlocked Achievements */}
                    {unlocked.length > 0 && (
                        <div className="space-y-6 relative z-10 mb-16">
                            <div className="flex items-center gap-3 mb-6">
                                <Trophy className="w-8 h-8 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]" />
                                <h2 className="text-3xl font-black text-foreground">Unlocked</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {unlocked.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        variants={itemVariants}
                                        className="group bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-3xl p-6 hover:bg-yellow-500/20 transition-all duration-300 shadow-[0_0_30px_rgba(250,204,21,0.1)] hover:shadow-[0_0_40px_rgba(250,204,21,0.25)] relative overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        
                                        <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]">
                                            {achievement.icon}
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 drop-shadow-sm">{achievement.name}</h3>
                                        <p className="text-base text-muted-foreground mb-4 leading-relaxed">{achievement.description}</p>
                                        
                                        {achievement.unlockedAt && (
                                            <div className="mt-auto pt-4 border-t border-yellow-500/20">
                                                <p className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
                                                    Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Locked Achievements */}
                    {locked.length > 0 && (
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <Lock className="w-8 h-8 text-muted-foreground" />
                                <h2 className="text-3xl font-black text-foreground">Locked</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {locked.map((achievement, index) => (
                                    <motion.div
                                        key={achievement.id}
                                        variants={itemVariants}
                                        className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/5 dark:border-white/5 rounded-3xl p-6 opacity-60 hover:opacity-80 transition-opacity duration-300"
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="text-5xl grayscale opacity-50 drop-shadow-none">
                                                {achievement.icon}
                                            </div>
                                            <div className="bg-black/10 dark:bg-white/10 p-2 rounded-full">
                                                <Lock className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-muted-foreground mb-2">{achievement.name}</h3>
                                        <p className="text-base text-muted-foreground/70 leading-relaxed">{achievement.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}
