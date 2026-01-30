"use client";

import { useState, useEffect } from "react";
import { toast } from "@/utils/toast";

export interface UserPreferences {
    soundEnabled: boolean;
    difficulty: "easy" | "medium" | "hard";
    language: string;
    animationsEnabled: boolean;
}

const DEFAULT_PREFERENCES: UserPreferences = {
    soundEnabled: true,
    difficulty: "medium",
    language: "en",
    animationsEnabled: true,
};

export function usePreferences() {
    const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (typeof window === "undefined") return;

        // Always apply dark theme
        const root = document.documentElement;
        root.classList.remove("light");
        root.classList.add("dark");
        
        // Load preferences from localStorage
        const stored = localStorage.getItem("reflextry_preferences");
        let loadedPrefs = DEFAULT_PREFERENCES;
        
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                // Remove theme from parsed preferences if it exists
                const { theme, ...rest } = parsed as any;
                loadedPrefs = { ...DEFAULT_PREFERENCES, ...rest };
                setPreferences(loadedPrefs);
            } catch (e) {
                console.error("Failed to load preferences:", e);
            }
        }
        
        setIsLoaded(true);
    }, []);


    const updatePreference = <K extends keyof UserPreferences>(
        key: K,
        value: UserPreferences[K]
    ) => {
        const newPreferences = { ...preferences, [key]: value };
        setPreferences(newPreferences);
        
        if (typeof window !== "undefined") {
            localStorage.setItem("reflextry_preferences", JSON.stringify(newPreferences));
        }

        const keyNames: Record<string, string> = {
            soundEnabled: "Sound",
            difficulty: "Difficulty",
            language: "Language",
            animationsEnabled: "Animations",
        };
        
        toast.success(`${keyNames[key] || key} updated`);
    };

    return {
        preferences,
        updatePreference,
        isLoaded,
    };
}

