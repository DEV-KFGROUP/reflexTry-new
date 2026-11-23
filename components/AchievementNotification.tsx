"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Trophy, X } from "lucide-react";
import type { Achievement } from "@/utils/achievements";
import { AchievementIcon } from "./AchievementIcon";
import { SoundManager } from "@/utils/soundManager";

interface AchievementNotificationProps {
    achievement: Achievement;
    onClose: () => void;
}

const TIER_EMBLEM_STYLES: Record<string, string> = {
    bronze: "bg-amber-50 border-amber-200 text-amber-700",
    silver: "bg-[#F3F1EB] border-[#D8D4C9] text-[#3F3E39]",
    gold: "bg-yellow-50 border-yellow-300 text-amber-700",
    platinum: "bg-blue-50 border-blue-200 text-blue-700",
};

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 6000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const emblemClass =
        TIER_EMBLEM_STYLES[achievement.tier] || "bg-blue-50 border-blue-200 text-blue-700";

    return (
        <motion.div
            initial={{ x: 320, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 320, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="w-full max-w-sm bg-white border border-[#E6E3DB] rounded-2xl p-4 shadow-lg text-[#161614]"
        >
            <div className="flex items-start gap-3.5">
                <div
                    className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 ${emblemClass}`}
                >
                    <AchievementIcon name={achievement.iconName || achievement.icon} className="w-5 h-5" />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-[#1E40AF]">
                        <Trophy className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                        <span>Badge Unlocked</span>
                        <span aria-hidden="true">·</span>
                        <span className="tabular-nums">+{achievement.xpReward || 50} XP</span>
                    </div>
                    <h4 className="font-serif text-sm font-semibold text-[#161614] mt-1 truncate">
                        {achievement.name}
                    </h4>
                    <p className="text-xs text-[#57554E] mt-0.5 leading-relaxed">
                        {achievement.description}
                    </p>
                    <Link
                        href="/achievements"
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] mt-2 transition-colors"
                    >
                        <span>View all badges</span>
                        <ArrowRight className="w-3 h-3" aria-hidden="true" />
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Dismiss badge notification"
                    className="p-1 rounded-lg text-[#78756C] hover:text-[#161614] hover:bg-[#F3F1EB] transition-colors cursor-pointer shrink-0"
                >
                    <X className="w-4 h-4" aria-hidden="true" />
                </button>
            </div>
        </motion.div>
    );
}

export function AchievementNotificationManager() {
    const [notifications, setNotifications] = useState<Achievement[]>([]);

    useEffect(() => {
        const handleAchievementUnlock = (event: CustomEvent<Achievement[]>) => {
            if (!Array.isArray(event.detail) || event.detail.length === 0) return;
            SoundManager.play("success");
            setNotifications((prev) => [...prev, ...event.detail]);
        };

        window.addEventListener("achievement_unlocked", handleAchievementUnlock as EventListener);
        return () => {
            window.removeEventListener(
                "achievement_unlocked",
                handleAchievementUnlock as EventListener
            );
        };
    }, []);

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 sm:right-6 z-[55] space-y-3 w-[calc(100vw-2rem)] max-w-sm pointer-events-none">
            <AnimatePresence>
                {notifications.map((achievement, index) => (
                    <div key={`${achievement.id}-${achievement.unlockedAt ?? index}`} className="pointer-events-auto">
                        <AchievementNotification
                            achievement={achievement}
                            onClose={() =>
                                setNotifications((prev) => prev.filter((_, i) => i !== index))
                            }
                        />
                    </div>
                ))}
            </AnimatePresence>
        </div>
    );
}
