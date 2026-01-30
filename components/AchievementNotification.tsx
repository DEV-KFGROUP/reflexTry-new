"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";
import { Achievement } from "@/utils/achievements";
import { useEffect, useState } from "react";

interface AchievementNotificationProps {
    achievement: Achievement;
    onClose: () => void;
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed top-20 right-6 z-50 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-sm border-2 border-yellow-500/40 rounded-2xl p-6 shadow-2xl max-w-sm"
        >
            <div className="flex items-start gap-4">
                <div className="text-5xl">{achievement.icon}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <h3 className="text-lg font-bold text-theme-primary">Achievement Unlocked!</h3>
                    </div>
                    <h4 className="text-xl font-bold text-yellow-400 mb-1">{achievement.name}</h4>
                    <p className="text-sm text-theme-secondary">{achievement.description}</p>
                </div>
                <button
                    onClick={onClose}
                    className="text-theme-secondary hover:text-theme-primary transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
}

export function AchievementNotificationManager() {
    const [notifications, setNotifications] = useState<Achievement[]>([]);

    useEffect(() => {
        const handleAchievementUnlock = (event: CustomEvent<Achievement[]>) => {
            setNotifications(prev => [...prev, ...event.detail]);
        };

        window.addEventListener("achievement_unlocked", handleAchievementUnlock as EventListener);
        return () => {
            window.removeEventListener("achievement_unlocked", handleAchievementUnlock as EventListener);
        };
    }, []);

    return (
        <div className="fixed top-20 right-6 z-50 space-y-4">
            <AnimatePresence>
                {notifications.map((achievement, index) => (
                    <AchievementNotification
                        key={`${achievement.id}-${index}`}
                        achievement={achievement}
                        onClose={() => setNotifications(prev => prev.filter((_, i) => i !== index))}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
}

