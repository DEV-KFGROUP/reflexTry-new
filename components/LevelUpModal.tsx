"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Trophy, Star, Crown, Sparkles } from "lucide-react";
import { SoundManager } from "@/utils/soundManager";
import { XPProgressBar } from "./XPProgress";

export function LevelUpModal() {
    const [levelData, setLevelData] = useState<{ level: number; oldLevel: number; reason?: string } | null>(null);

    useEffect(() => {
        const handleLevelUp = (e: CustomEvent) => {
            const data = e.detail;
            setLevelData(data);
            SoundManager.play("levelup");
            
            // Fire confetti
            const duration = 3000;
            const end = Date.now() + duration;

            const frame = () => {
                confetti({
                    particleCount: 2,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#00f0ff', '#9d00ff', '#facc15']
                });
                confetti({
                    particleCount: 2,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#00f0ff', '#9d00ff', '#facc15']
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            };

            frame();
        };

        window.addEventListener('level_up', handleLevelUp as EventListener);
        return () => window.removeEventListener('level_up', handleLevelUp as EventListener);
    }, []);

    if (!levelData) return null;

    return (
        <AnimatePresence onExitComplete={() => setLevelData(null)}>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                onClick={() => setLevelData(null)}
            >
                <motion.div
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 100 }}
                    className="relative bg-gradient-to-br from-[#1a1f3c] to-[#0f1123] border border-teal-500/30 p-8 rounded-3xl max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,240,255,0.3)] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay"></div>
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>

                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        className="relative mx-auto mb-6 w-24 h-24 flex items-center justify-center"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full animate-pulse blur-md"></div>
                        <div className="relative bg-[#0f1123] w-20 h-20 rounded-full flex items-center justify-center border-2 border-white/20">
                            <Crown className="w-10 h-10 text-yellow-400" />
                        </div>
                        <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            className="absolute -inset-2 border-t-2 border-r-2 border-teal-500/50 rounded-full"
                        ></motion.div>
                    </motion.div>

                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h2 className="text-3xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-2">
                            LEVEL UP!
                        </h2>
                        <div className="text-6xl font-black text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                            {levelData.level}
                        </div>
                        <p className="text-gray-400 mb-6 uppercase tracking-widest text-sm font-bold">
                            Level Reached
                        </p>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 mb-6">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Next Reward</span>
                                <span className="text-sm text-teal-500 font-bold">Locked <LockIcon className="inline w-3 h-3 ml-1" /></span>
                            </div>
                            <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden">
                                <div className="h-full bg-gray-700 w-full opacity-30"></div>
                            </div>
                        </div>

                        <button
                            onClick={() => setLevelData(null)}
                            className="w-full py-3 bg-gradient-to-r from-teal-500 to-purple-500 text-white font-bold rounded-xl hover:opacity-90 transition-opacity active:scale-95"
                        >
                            AWESOME!
                        </button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

function LockIcon({ className }: { className?: string }) {
    return (
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className={className}
        >
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    );
}

