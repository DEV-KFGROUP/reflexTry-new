"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DailyChallenge } from "@/utils/dailyChallenge";
import { Flame } from "lucide-react";

interface StreakCounterProps {
    showCompact?: boolean;
    className?: string;
}

export function StreakCounter({ showCompact = false, className = "" }: StreakCounterProps) {
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        setStreak(DailyChallenge.getStreak());
        
        // Update streak when scores are updated
        const handleUpdate = () => {
            setStreak(DailyChallenge.getStreak());
        };
        
        window.addEventListener('score_updated', handleUpdate);
        return () => {
            window.removeEventListener('score_updated', handleUpdate);
        };
    }, []);

    if (streak === 0) return null;

    if (showCompact) {
        return (
            <div className={`flex items-center gap-1 ${className}`}>
                <motion.div
                    animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3
                    }}
                >
                    <Flame className="w-4 h-4 text-orange-500" />
                </motion.div>
                <span className="text-sm font-bold text-orange-500">{streak}</span>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-4 ${className}`}
        >
            <div className="flex items-center gap-3">
                <motion.div
                    animate={{ 
                        scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                        duration: 1.5,
                        repeat: Infinity
                    }}
                    className="relative"
                >
                    <Flame className="w-8 h-8 text-orange-500" />
                    {streak >= 7 && (
                        <motion.div
                            animate={{ 
                                opacity: [0.3, 0.8, 0.3],
                                scale: [1, 1.2, 1]
                            }}
                            transition={{ 
                                duration: 1,
                                repeat: Infinity
                            }}
                            className="absolute inset-0 bg-orange-500 rounded-full blur-xl"
                        />
                    )}
                </motion.div>
                <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Streak</div>
                    <div className="text-2xl font-bold text-orange-500">{streak} {streak === 1 ? 'day' : 'days'}</div>
                    {streak >= 7 && (
                        <div className="text-xs text-orange-400 mt-1">🔥 On Fire!</div>
                    )}
                    {streak >= 30 && (
                        <div className="text-xs text-yellow-400 mt-1">🌟 Legendary Streak!</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}


