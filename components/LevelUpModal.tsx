"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Crown, Lock } from "lucide-react";
import { SoundManager } from "@/utils/soundManager";

export function LevelUpModal() {
    const [levelData, setLevelData] = useState<{ level: number; oldLevel: number; reason?: string } | null>(null);

    useEffect(() => {
        const handleLevelUp = (e: CustomEvent) => {
            const data = e.detail;
            setLevelData(data);
            SoundManager.play("levelup");

            const duration = 2000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ["#161614", "#1E40AF", "#D97706"],
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ["#161614", "#1E40AF", "#D97706"],
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        };

        window.addEventListener("level_up", handleLevelUp as EventListener);
        return () => window.removeEventListener("level_up", handleLevelUp as EventListener);
    }, []);

    if (!levelData) return null;

    return (
        <AnimatePresence onExitComplete={() => setLevelData(null)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-[#161614]/50 backdrop-blur-xs p-4"
                onClick={() => setLevelData(null)}
            >
                <motion.div
                    initial={{ scale: 0.94, y: 16 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.94, y: 16 }}
                    transition={{ duration: 0.2 }}
                    className="relative bg-white border border-[#E6E3DB] p-8 rounded-2xl max-w-sm w-full text-center shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-[#FAF9F6] border border-[#E6E3DB] flex items-center justify-center">
                        <Crown className="w-8 h-8 text-[#161614]" aria-hidden="true" />
                    </div>

                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] mb-1">
                        Milestone Reached
                    </p>
                    <h2 className="font-serif text-3xl font-medium text-[#161614] tracking-tight mb-2">
                        Level {levelData.level}
                    </h2>
                    <p className="text-sm text-[#57554E] mb-6">
                        Your training sessions unlocked the next rank tier.
                    </p>

                    <div className="bg-[#FAF9F6] rounded-xl p-4 border border-[#E6E3DB] mb-6 text-left">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-[#57554E] font-medium">Next Milestone</span>
                            <span className="inline-flex items-center gap-1 text-[#161614] font-semibold font-mono tabular-nums">
                                <Lock className="w-3 h-3 text-[#78756C]" aria-hidden="true" />
                                Level {levelData.level + 1}
                            </span>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setLevelData(null)}
                        className="w-full min-h-[48px] py-3 bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                        Continue Training
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
