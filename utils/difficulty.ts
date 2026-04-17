// Difficulty settings utilities

export type Difficulty = "easy" | "medium" | "hard";

export interface DifficultyMultipliers {
    timeMultiplier: number; // For time-based games (higher = more time)
    scoreMultiplier: number; // For score-based games (higher = more points)
    speedMultiplier: number; // For speed games (higher = faster)
    complexityMultiplier: number; // For complexity (higher = harder)
}

export const DIFFICULTY_MULTIPLIERS: Record<Difficulty, DifficultyMultipliers> = {
    easy: {
        timeMultiplier: 1.5, // 50% more time
        scoreMultiplier: 1.2, // 20% bonus points
        speedMultiplier: 0.8, // 20% slower
        complexityMultiplier: 0.7, // 30% less complex
    },
    medium: {
        timeMultiplier: 1.0, // Normal
        scoreMultiplier: 1.0, // Normal
        speedMultiplier: 1.0, // Normal
        complexityMultiplier: 1.0, // Normal
    },
    hard: {
        timeMultiplier: 0.7, // 30% less time
        scoreMultiplier: 0.8, // 20% penalty
        speedMultiplier: 1.3, // 30% faster
        complexityMultiplier: 1.5, // 50% more complex
    },
};

export function getDifficultyMultipliers(difficulty: Difficulty = "medium"): DifficultyMultipliers {
    return DIFFICULTY_MULTIPLIERS[difficulty];
}

// Helper to get current difficulty from preferences
export function useDifficulty(): Difficulty {
    if (typeof window === "undefined") return "medium";
    
    try {
        const stored = localStorage.getItem("reflextry_preferences");
        if (stored) {
            const parsed = JSON.parse(stored);
            return parsed.difficulty || "medium";
        }
    } catch (e) {
        // Ignore
    }
    
    return "medium";
}








