"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { XPSystem, XPProgress } from "@/utils/xpSystem";
import { Trophy } from "lucide-react";

interface XPProgressProps {
    showCompact?: boolean;
    className?: string;
}

export function XPProgressBar({ showCompact = false, className = "" }: XPProgressProps) {
    const [progress, setProgress] = useState<XPProgress | null>(null);

    useEffect(() => {
        setProgress(XPSystem.getProgress());

        const handleUpdate = () => {
            setProgress(XPSystem.getProgress());
        };

        window.addEventListener("xp_updated", handleUpdate);
        window.addEventListener("level_up", handleUpdate);

        return () => {
            window.removeEventListener("xp_updated", handleUpdate);
            window.removeEventListener("level_up", handleUpdate);
        };
    }, []);

    const displayProgress = progress || {
        level: 1,
        totalXP: 0,
        currentLevelXP: 0,
        nextLevelXP: 100,
        progress: 0,
        rank: { name: "Beginner", icon: "" },
        xpToNextLevel: 100,
    };

    const pct = Math.min(100, Math.max(0, displayProgress.progress * 100));

    if (showCompact) {
        return (
            <div className={`flex items-center gap-2.5 ${className}`}>
                <div className="flex items-center gap-1 shrink-0">
                    <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span className="text-xs font-mono font-bold text-[#161614] tabular-nums">
                        Lv.{displayProgress.level}
                    </span>
                </div>
                <div className="flex-1 bg-[#E6E3DB] rounded-full h-2 overflow-hidden">
                    <motion.div
                        className="h-full bg-[#1E40AF] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white border border-[#E6E3DB] rounded-2xl p-4 ${className}`}>
            <div className="flex items-center justify-between gap-4 mb-2.5">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                        <Trophy className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-[#161614] font-mono tabular-nums">
                            Level {displayProgress.level}
                        </div>
                        <div className="text-xs text-[#78756C]">{displayProgress.rank.name}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-[#161614] font-mono tabular-nums">
                        {displayProgress.totalXP.toLocaleString()} XP
                    </div>
                    <div className="text-xs text-[#78756C] font-mono tabular-nums">
                        {displayProgress.xpToNextLevel.toLocaleString()} XP to next level
                    </div>
                </div>
            </div>
            <div
                className="w-full bg-[#F3F1EB] rounded-full h-2.5 overflow-hidden border border-[#E6E3DB]"
                role="progressbar"
                aria-valuenow={Math.round(pct)}
                aria-valuemin={0}
                aria-valuemax={100}
            >
                <motion.div
                    className="h-full bg-[#1E40AF] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                />
            </div>
        </div>
    );
}
