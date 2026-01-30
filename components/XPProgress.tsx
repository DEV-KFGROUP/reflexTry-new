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
        // Initial load
        setProgress(XPSystem.getProgress());
        
        const handleUpdate = () => {
            setProgress(XPSystem.getProgress());
        };
        
        window.addEventListener('xp_updated', handleUpdate);
        window.addEventListener('level_up', handleUpdate); // also update on level up
        
        return () => {
            window.removeEventListener('xp_updated', handleUpdate);
            window.removeEventListener('level_up', handleUpdate);
        };
    }, []);

    // Render nothing on server, or a loading state. 
    // To match server render (which likely has no localStorage access and defaults to level 1),
    // we can either return null (if we want to hide it until loaded) or render a default state.
    // Given the hydration error shows server rendered "1" and client "3", server is rendering the component.
    // The issue is likely `XPSystem.getProgress()` returning default values on server and actual values on client.
    
    // Strategy: Render default (level 1) initially, then update in useEffect.
    // But since `useState(XPSystem.getProgress())` runs during render, it picks up localStorage immediately on client?
    // No, `useState` initializer runs during render. `XPSystem.getProgress()` accesses localStorage.
    // On server: `XPSystem.getProgress()` returns level 1 (localStorage undefined).
    // On client: `XPSystem.getProgress()` returns level 3 (from localStorage).
    // Mismatch!
    
    // Fix: Initialize with default/empty state, populate in useEffect.
    
    const displayProgress = progress || {
        level: 1,
        totalXP: 0,
        currentLevelXP: 0,
        nextLevelXP: 100,
        progress: 0,
        rank: { name: "Newbie", icon: "🌱" },
        xpToNextLevel: 100
    };

    // If not loaded yet (client-side only logic needed for correct level), 
    // we should render consistent initial UI. 
    // If we use `displayProgress` which defaults to level 1, it matches server.
    // Then `useEffect` sets `progress` to level 3, triggering re-render.
    
    if (showCompact) {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <div className="flex items-center gap-1">
                    <Trophy className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm font-bold text-white">Lv.{displayProgress.level}</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden relative">
                    <motion.div
                        className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${displayProgress.progress * 100}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <div>
                        <div className="text-sm text-gray-400">Level {displayProgress.level}</div>
                        <div className="text-xs text-gray-500">{displayProgress.rank.icon} {displayProgress.rank.name}</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-bold text-white">{displayProgress.totalXP.toLocaleString()} XP</div>
                    <div className="text-xs text-gray-400">{displayProgress.xpToNextLevel.toLocaleString()} to next level</div>
                </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden relative">
                <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${displayProgress.progress * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
                
                {/* Shine effect */}
                <motion.div 
                    className="absolute top-0 bottom-0 w-20 bg-white/30 skew-x-[-20deg]"
                    initial={{ left: "-100%" }}
                    animate={{ left: "200%" }}
                    transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                />
            </div>
        </div>
    );
}
