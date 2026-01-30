"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Sparkles } from "lucide-react";
import { Storage, Score } from "@/utils/storage";

interface HighScoreProps {
    toolId: string;
    unit?: string;
}

export function HighScore({ toolId, unit = "pts" }: HighScoreProps) {
    const [score, setScore] = useState<Score | null>(null);
    const [isNewRecord, setIsNewRecord] = useState(false);

    useEffect(() => {
        setScore(Storage.getScore(toolId));

        // Listen for storage events (if updated in another tab or component)
        const handleStorage = () => {
            const newScore = Storage.getScore(toolId);
            if (newScore && (!score || newScore.value > score.value)) {
                setIsNewRecord(true);
                setTimeout(() => setIsNewRecord(false), 3000);
            }
            setScore(newScore);
        };
        window.addEventListener('storage', handleStorage);
        // Custom event for same-tab updates
        window.addEventListener('score_updated', handleStorage);

        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('score_updated', handleStorage);
        };
    }, [toolId, score]);

    if (!score) return null;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 via-yellow-500/15 to-yellow-500/20 backdrop-blur-sm px-5 py-2.5 rounded-full border-2 border-yellow-500/40 shadow-lg shadow-yellow-500/20 ${isNewRecord ? 'animate-pulse' : ''}`}
        >
            {isNewRecord && (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -left-2"
                >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                </motion.div>
            )}
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-bold uppercase tracking-wider text-yellow-400">Best:</span>
            <span className="font-mono font-bold text-theme-primary text-lg">
                {score.value.toLocaleString()} <span className="text-xs text-yellow-400/70">{score.unit}</span>
            </span>
        </motion.div>
    );
}
