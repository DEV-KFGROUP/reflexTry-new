import { safeStorage } from "./safeStorage";
import { ScoreHistory } from "./scoreHistory";

export interface Score {
    value: number;
    unit: string; // 'ms', 'score', 'wpm'
    timestamp: number;
    playerName?: string;
}

export const Storage = {
    saveScore: (toolId: string, value: number, unit: string, playerName?: string) => {
        if (typeof window === 'undefined') return false;

        const key = `reflexhub_score_${toolId}`;
        const current = Storage.getScore(toolId);

        // Logic for "Better":
        // For time (ms), lower is better.
        // For score/wpm, higher is better.
        const isTime = unit === 'ms';
        const isBetter = isTime
            ? (current === null || value < current.value)
            : (current === null || value > current.value);

        if (isBetter) {
            // Get player name from parameter or localStorage
            const name = playerName || safeStorage.getItem("reflextry_player_name") || undefined;
            const newScore: Score = { value, unit, timestamp: Date.now(), playerName: name };
            safeStorage.setItem(key, JSON.stringify(newScore));
            return true; // New high score!
        }
        return false;
    },

    getScore: (toolId: string): Score | null => {
        if (typeof window === 'undefined') return null;
        const stats = ScoreHistory.getStats(toolId);
        if (stats) return { value: stats.best, unit: stats.unit, timestamp: stats.recent.at(-1)?.timestamp || 0 };
        const key = `reflexhub_score_${toolId}`;
        const str = safeStorage.getItem(key);
        try { return str ? JSON.parse(str) : null; } catch { return null; }
    }
};
