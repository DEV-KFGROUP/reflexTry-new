"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X, Volume2, VolumeX, TrendingUp, Download, Upload, User, Keyboard } from "lucide-react";
import { Button } from "./ui/Button";
import { usePreferences } from "@/hooks/usePreferences";
import { toast } from "@/utils/toast";
import { KEYBOARD_NAV_EVENTS } from "@/lib/keyboard-navigation";

export function SettingsPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const { preferences, updatePreference } = usePreferences();

    useEffect(() => {
        const onToggle = () => setIsOpen((prev) => !prev);
        const onClose = () => setIsOpen(false);
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        window.addEventListener(KEYBOARD_NAV_EVENTS.SETTINGS_TOGGLE, onToggle);
        window.addEventListener(KEYBOARD_NAV_EVENTS.SETTINGS_CLOSE, onClose);
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener(KEYBOARD_NAV_EVENTS.SETTINGS_TOGGLE, onToggle);
            window.removeEventListener(KEYBOARD_NAV_EVENTS.SETTINGS_CLOSE, onClose);
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

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
                className="fixed bottom-6 right-6 z-40 rounded-full w-12 h-12 p-0 bg-white border border-[#DCD8CE] shadow-md hover:bg-[#F3F1EC]"
                aria-label="Open settings"
                title="Settings (S)"
            >
                <Settings className="w-5 h-5 text-[#161614]" aria-hidden="true" />
            </Button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-[#161614]/35 backdrop-blur-xs z-50"
                        />
                        <motion.div
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="settings-panel-title"
                            data-testid="settings-panel-dialog"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 28, stiffness: 240 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#FAF9F6] border-l border-[#E6E3DB] z-50 overflow-y-auto shadow-2xl text-[#161614]"
                        >
                            <div className="p-6 space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-[#E6E3DB]">
                                    <h2
                                        id="settings-panel-title"
                                        className="font-serif text-2xl font-medium text-[#161614] tracking-tight"
                                    >
                                        Settings
                                    </h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close settings"
                                    >
                                        <X className="w-5 h-5 text-[#161614]" aria-hidden="true" />
                                    </Button>
                                </div>

                                {/* Sound */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                        {preferences.soundEnabled ? (
                                            <Volume2 className="w-4 h-4 text-[#57554E]" />
                                        ) : (
                                            <VolumeX className="w-4 h-4 text-[#57554E]" />
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
                                <div className="space-y-3 pt-4 border-t border-[#E6E3DB]">
                                    <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-[#57554E]" />
                                        Default Difficulty
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
                                <div className="space-y-3 pt-4 border-t border-[#E6E3DB]">
                                    <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                        <User className="w-4 h-4 text-[#57554E]" />
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
                                            className="flex-1 px-3.5 py-2.5 bg-white border border-[#DCD8CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] text-sm text-[#161614] placeholder:text-[#78756C]"
                                        />
                                    </div>
                                    <p className="text-xs text-[#78756C]">
                                        Displayed on your local leaderboard entries.
                                    </p>
                                </div>

                                {/* Data Management */}
                                <div className="space-y-3 pt-4 border-t border-[#E6E3DB]">
                                    <h3 className="text-sm font-semibold text-[#161614]">Local Data Backup</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={handleExport}
                                            className="flex items-center gap-2"
                                        >
                                            <Download className="w-4 h-4 text-[#57554E]" />
                                            Export
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={handleImport}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="w-4 h-4 text-[#57554E]" />
                                            Import
                                        </Button>
                                    </div>
                                </div>

                                {/* Keyboard Shortcuts */}
                                <div className="space-y-3 pt-4 border-t border-[#E6E3DB]">
                                    <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                        <Keyboard className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                        Tool Shortcuts
                                    </h3>
                                    <dl className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <dt className="text-[#57554E]">Restart active tool</dt>
                                            <dd>
                                                <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[#DCD8CE] bg-white px-1.5 font-mono text-xs font-semibold text-[#161614]">
                                                    R
                                                </kbd>
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-[#57554E]">Toggle settings panel</dt>
                                            <dd>
                                                <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[#DCD8CE] bg-white px-1.5 font-mono text-xs font-semibold text-[#161614]">
                                                    S
                                                </kbd>
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-[#57554E]">Return to category hub</dt>
                                            <dd>
                                                <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[#DCD8CE] bg-white px-1.5 font-mono text-xs font-semibold text-[#161614]">
                                                    H
                                                </kbd>
                                            </dd>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <dt className="text-[#57554E]">Close settings</dt>
                                            <dd>
                                                <kbd className="inline-flex h-6 min-w-6 items-center justify-center rounded border border-[#DCD8CE] bg-white px-1.5 font-mono text-xs font-semibold text-[#161614]">
                                                    Esc
                                                </kbd>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

