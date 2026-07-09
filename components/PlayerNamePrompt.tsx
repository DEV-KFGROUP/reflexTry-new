"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Trophy } from "lucide-react";
import { Button } from "./ui/Button";
import { toast } from "@/utils/toast";

interface PlayerNamePromptProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
    score: number;
    toolName: string;
}

export function PlayerNamePrompt({ isOpen, onClose, onSave, score, toolName }: PlayerNamePromptProps) {
    const [playerName, setPlayerName] = useState("");
    const [savedName, setSavedName] = useState("");

    useEffect(() => {
        if (isOpen && typeof window !== "undefined") {
            // Load saved player name
            const saved = localStorage.getItem("reflextry_player_name");
            if (saved) {
                setSavedName(saved);
                setPlayerName(saved);
            }
        }
    }, [isOpen]);

    const handleSave = () => {
        const name = playerName.trim() || "Anonymous";
        
        if (typeof window !== "undefined") {
            localStorage.setItem("reflextry_player_name", name);
        }
        
        onSave(name);
        toast.success(`Score saved as ${name}!`);
        onClose();
    };

    const handleSkip = () => {
        onSave(savedName || "Anonymous");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-background border-2 border-teal-500/40 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                >
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-yellow-500/20">
                                <Trophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-theme-primary">Great Score!</h3>
                                <p className="text-sm text-theme-secondary">
                                    {score} on {toolName}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-theme-secondary hover:text-theme-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label htmlFor="playerName" className="block text-sm font-medium text-theme-primary mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Enter your name for the leaderboard
                            </label>
                            <input
                                id="playerName"
                                type="text"
                                value={playerName}
                                onChange={(e) => setPlayerName(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSave();
                                    }
                                }}
                                placeholder="Your name"
                                maxLength={20}
                                className="w-full px-4 py-3 bg-theme-surface border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-theme-primary placeholder-theme-muted"
                                autoFocus
                            />
                            {savedName && (
                                <p className="text-xs text-theme-muted mt-2">
                                    Previously saved as: <span className="text-teal-500">{savedName}</span>
                                </p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={handleSkip}
                                className="flex-1"
                            >
                                Skip
                            </Button>
                            <Button
                                onClick={handleSave}
                                className="flex-1"
                            >
                                Save Score
                            </Button>
                        </div>

                        <p className="text-xs text-theme-muted text-center">
                            Your name will appear on the leaderboard
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

