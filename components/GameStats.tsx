"use client";

import { motion } from "framer-motion";
import { Trophy, Target, TrendingUp, Zap } from "lucide-react";

interface GameStatsProps {
    currentScore?: number;
    highScore?: number;
    attempts?: number;
    averageScore?: number;
    unit?: string;
}

export function GameStats({ currentScore, highScore, attempts, averageScore, unit = "" }: GameStatsProps) {
    const stats = [
        {
            label: "Current",
            value: currentScore ?? "--",
            icon: Zap,
            color: "text-neon-teal",
            bgColor: "bg-neon-teal/10",
            borderColor: "border-neon-teal/30",
        },
        {
            label: "Best",
            value: highScore ?? "--",
            icon: Trophy,
            color: "text-neon-yellow",
            bgColor: "bg-neon-yellow/10",
            borderColor: "border-neon-yellow/30",
        },
        ...(attempts !== undefined
            ? [
                  {
                      label: "Attempts",
                      value: attempts,
                      icon: Target,
                      color: "text-electric-purple",
                      bgColor: "bg-electric-purple/10",
                      borderColor: "border-electric-purple/30",
                  },
              ]
            : []),
        ...(averageScore !== undefined
            ? [
                  {
                      label: "Average",
                      value: averageScore,
                      icon: TrendingUp,
                      color: "text-pink-500",
                      bgColor: "bg-pink-500/10",
                      borderColor: "border-pink-500/30",
                  },
              ]
            : []),
    ];

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {stats.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-4 min-w-[120px] hover:scale-105 transition-transform duration-300 shadow-lg`}
                >
                    <div className={`inline-flex p-2 rounded-lg ${stat.bgColor} mb-2`}>
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div className="text-xs text-gray-400 mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>
                        {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value} {unit}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}








