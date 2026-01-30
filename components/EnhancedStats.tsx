"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Trophy, Target, BarChart3 } from "lucide-react";
import { ScoreHistory } from "@/utils/scoreHistory";
import { Storage } from "@/utils/storage";

interface EnhancedStatsProps {
    toolId: string;
    currentScore: number;
    unit: string;
    className?: string;
}

// Average scores (for comparison - in a real app, these would come from analytics/API)
const GLOBAL_AVERAGES: Record<string, number> = {
    "reaction-time": 250,
    "sequence-memory": 8,
    "cps-test": 7.5,
    "typing-speed": 40,
    "speed-math": 25,
};

const TOP_10_PERCENT: Record<string, number> = {
    "reaction-time": 180,
    "sequence-memory": 15,
    "cps-test": 12,
    "typing-speed": 80,
    "speed-math": 45,
};

export function EnhancedStats({ toolId, currentScore, unit, className = "" }: EnhancedStatsProps) {
    const stats = useMemo(() => {
        const history = ScoreHistory.get(toolId);
        const highScore = Storage.getScore(toolId);
        const isTime = unit === "ms";
        
        if (history.length === 0) {
            return null;
        }
        
        const values = history.map(h => h.value);
        const best = isTime ? Math.min(...values) : Math.max(...values);
        const worst = isTime ? Math.max(...values) : Math.min(...values);
        const average = values.reduce((a, b) => a + b, 0) / values.length;
        
        // Session stats (last 10 games)
        const sessionValues = values.slice(-10);
        const sessionBest = isTime ? Math.min(...sessionValues) : Math.max(...sessionValues);
        const sessionAverage = sessionValues.reduce((a, b) => a + b, 0) / sessionValues.length;
        
        // Improvement calculation
        const previousBest = highScore?.value || currentScore;
        const improvement = isTime 
            ? previousBest - currentScore 
            : currentScore - previousBest;
        const improvementPercent = previousBest > 0 
            ? (Math.abs(improvement) / previousBest) * 100 
            : 0;
        
        // Global comparison
        const globalAvg = GLOBAL_AVERAGES[toolId] || average;
        const top10Percent = TOP_10_PERCENT[toolId];
        const vsGlobal = isTime 
            ? globalAvg - currentScore 
            : currentScore - globalAvg;
        const vsTop10 = top10Percent ? (isTime ? top10Percent - currentScore : currentScore - top10Percent) : null;
        
        // Percentile estimate (simplified)
        const betterThanCount = values.filter(v => 
            isTime ? v > currentScore : v < currentScore
        ).length;
        const percentile = values.length > 0 
            ? Math.round((betterThanCount / values.length) * 100) 
            : 50;
        
        return {
            best,
            worst,
            average,
            sessionBest,
            sessionAverage,
            improvement,
            improvementPercent,
            vsGlobal,
            vsTop10,
            percentile,
            attempts: history.length,
        };
    }, [toolId, currentScore, unit]);

    if (!stats) return null;

    const isTime = unit === "ms";
    const isBetter = stats.improvement > 0;
    const formatValue = (val: number) => {
        if (isTime) return `${Math.round(val)}ms`;
        return `${Math.round(val * 100) / 100}${unit}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}
        >
            {/* Personal Best */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <div className="text-xs text-gray-400 uppercase">Personal Best</div>
                </div>
                <div className="text-2xl font-bold text-white">{formatValue(stats.best)}</div>
                {stats.improvement !== 0 && (
                    <div className={`text-xs mt-1 flex items-center gap-1 ${isBetter ? 'text-green-400' : 'text-gray-500'}`}>
                        {isBetter ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {isBetter ? '+' : ''}{formatValue(Math.abs(stats.improvement))} ({Math.round(stats.improvementPercent)}%)
                    </div>
                )}
            </div>

            {/* Session Average */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4 text-blue-400" />
                    <div className="text-xs text-gray-400 uppercase">Session Avg</div>
                </div>
                <div className="text-2xl font-bold text-white">{formatValue(stats.sessionAverage)}</div>
                <div className="text-xs text-gray-500 mt-1">Last 10 games</div>
            </div>

            {/* Global Comparison */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-purple-400" />
                    <div className="text-xs text-gray-400 uppercase">vs Global</div>
                </div>
                <div className={`text-2xl font-bold ${stats.vsGlobal > 0 ? 'text-green-400' : stats.vsGlobal < 0 ? 'text-red-400' : 'text-white'}`}>
                    {stats.vsGlobal > 0 ? '+' : ''}{formatValue(Math.abs(stats.vsGlobal))}
                </div>
                <div className="text-xs text-gray-500 mt-1">Better than {stats.percentile}%</div>
            </div>

            {/* Total Attempts */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase mb-2">Total Attempts</div>
                <div className="text-2xl font-bold text-white">{stats.attempts}</div>
            </div>

            {/* Best vs Worst */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase mb-2">Range</div>
                <div className="text-lg font-bold text-white">
                    {formatValue(stats.best)} - {formatValue(stats.worst)}
                </div>
            </div>

            {/* Overall Average */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="text-xs text-gray-400 uppercase mb-2">Overall Average</div>
                <div className="text-2xl font-bold text-white">{formatValue(stats.average)}</div>
            </div>
        </motion.div>
    );
}


