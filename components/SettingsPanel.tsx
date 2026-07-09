"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Volume2, VolumeX, TrendingUp, Download, Upload, User } from "lucide-react";
import { Button } from "./ui/Button";
import { usePreferences } from "@/hooks/usePreferences";
import { toast } from "@/utils/toast";

export function SettingsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { preferences, updatePreference } = usePreferences();

    const handleExport = () => {
        if (typeof window === "undefined") return;
        
        const scores: Record<string, any> = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("reflexhub_score_")) {
                scores[key] = localStorage.getItem(key);
            }
        }

        const data = {
            scores,
            preferences,
            exportedAt: new Date().toISOString(),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reflextry-backup-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        toast.success("Data exported successfully!");
    };

    const handleImport = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target?.result as string);
                    
                    if (data.scores) {
                        Object.entries(data.scores).forEach(([key, value]) => {
                            localStorage.setItem(key, value as string);
                        });
                    }
                    
                    if (data.preferences) {
                        Object.entries(data.preferences).forEach(([key, value]) => {
                            const prefKey = key as keyof typeof preferences;
                            if (prefKey in preferences) {
                                updatePreference(prefKey, value as typeof preferences[typeof prefKey]);
                            }
                        });
                    }
                    
                    toast.success("Data imported successfully!");
                    window.dispatchEvent(new Event("score_updated"));
                } catch (error) {
                    toast.error("Failed to import data. Invalid file format.");
                }
            };
            reader.readAsText(file);
        };
        input.click();
    };

    return (
        <>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 rounded-full w-14 h-14 p-0 shadow-lg"
                aria-label="Open settings"
            >
                <Settings className="w-6 h-6 text-theme-primary" aria-hidden="true" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background border-l border-theme z-50 overflow-y-auto shadow-2xl"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-purple-500 bg-clip-text text-transparent">
                                        Settings
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close settings"
                                    >
                                        <X className="w-5 h-5 text-theme-primary" aria-hidden="true" />
                                    </Button>
                                </div>


                                {/* Sound */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                                        {preferences.soundEnabled ? (
                                            <Volume2 className="w-5 h-5 text-theme-primary" />
                                        ) : (
                                            <VolumeX className="w-5 h-5 text-theme-primary" />
                                        )}
                                        Sound Effects
                                    </h3>
                                    <Button
                                        variant={preferences.soundEnabled ? "primary" : "outline"}
                                        onClick={() => updatePreference("soundEnabled", !preferences.soundEnabled)}
                                        className="w-full"
                                    >
                                        {preferences.soundEnabled ? "Enabled" : "Disabled"}
                                    </Button>
                                </div>

                                {/* Difficulty */}
                                <div className="space-y-3">
                                    <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                                        <TrendingUp className="w-5 h-5 text-theme-primary" />
                                        Difficulty
                                    </h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(["easy", "medium", "hard"] as const).map((difficulty) => (
                                            <Button
                                                key={difficulty}
                                                variant={preferences.difficulty === difficulty ? "primary" : "outline"}
                                                onClick={() => updatePreference("difficulty", difficulty)}
                                                className="capitalize"
                                            >
                                                {difficulty}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Player Name */}
                                <div className="space-y-3 pt-4 border-t border-theme">
                                    <h3 className="text-lg font-semibold text-theme-primary flex items-center gap-2">
                                        <User className="w-5 h-5 text-theme-primary" />
                                        Player Name
                                    </h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            id="playerName"
                                            defaultValue={typeof window !== "undefined" ? localStorage.getItem("reflextry_player_name") || "" : ""}
                                            onBlur={(e) => {
                                                const name = e.target.value.trim();
                                                if (name) {
                                                    localStorage.setItem("reflextry_player_name", name);
                                                    toast.success("Player name saved!");
                                                }
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.currentTarget.blur();
                                                }
                                            }}
                                            placeholder="Enter your name"
                                            maxLength={20}
                                            className="flex-1 px-4 py-2 bg-theme-surface border border-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 text-theme-primary placeholder-theme-muted"
                                        />
                                    </div>
                                    <p className="text-xs text-theme-muted">
                                        Your name will appear on the leaderboard
                                    </p>
                                </div>

                                {/* Data Management */}
                                <div className="space-y-3 pt-4 border-t border-theme">
                                    <h3 className="text-lg font-semibold text-theme-primary">Data Management</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleExport}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4 text-theme-primary" />
                                            Export
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleImport}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4 text-theme-primary" />
                                            Import
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

