import { safeStorage } from "./safeStorage";
import { ScoreHistory } from "./scoreHistory";

export interface Score {
    value: number;
    unit: string;
    timestamp: number;
    playerName?: string;
    difficulty?: string;
}

const SCORE_PREFIX = "reflexhub_score_";

export const Storage = {
    getScore(toolId: string): Score | null {
        const raw = safeStorage.getItem(`${SCORE_PREFIX}${toolId}`);
        if (raw) {
            try {
                const parsed = JSON.parse(raw) as Score;
                if (
                    parsed &&
                    typeof parsed.value === "number" &&
                    Number.isFinite(parsed.value) &&
                    typeof parsed.unit === "string"
                ) {
                    return parsed;
                }
            } catch {
                // Fall through to ScoreHistory lookup
            }
        }

        const stats = ScoreHistory.getStats(toolId);
        if (!stats) return null;

        const entries = ScoreHistory.get(toolId).filter(
            (e) => e.eligible !== false && e.configuration === stats.configuration
        );
        const bestEntry = entries.find((e) => e.value === stats.best) ?? entries[entries.length - 1];

        return {
            value: stats.best,
            unit: stats.unit,
            timestamp: bestEntry?.timestamp ?? Date.now(),
            difficulty: stats.difficulty,
        };
    },

    saveScore(
        toolId: string,
        value: number,
        unit: string,
        playerName?: string,
        difficulty?: string,
        higherIsBetter?: boolean
    ): boolean {
        if (!toolId || !Number.isFinite(value) || value < 0) return false;

        const existing = Storage.getScore(toolId);
        const isHigherBetter = higherIsBetter ?? unit !== "ms";
        const isNewBest =
            !existing ||
            (isHigherBetter ? value > existing.value : value < existing.value);

        if (!isNewBest) return false;

        const payload: Score = {
            value,
            unit,
            timestamp: Date.now(),
            playerName,
            difficulty,
        };

        const saved = safeStorage.setItem(
            `${SCORE_PREFIX}${toolId}`,
            JSON.stringify(payload)
        );
        if (saved && typeof window !== "undefined") {
            window.dispatchEvent(new Event("score_updated"));
        }
        return saved;
    },

    getAllScores(): Record<string, Score> {
        const scores: Record<string, Score> = {};
        const keys = safeStorage.keys();

        for (const key of keys) {
            if (key.startsWith(SCORE_PREFIX)) {
                const toolId = key.slice(SCORE_PREFIX.length);
                const score = Storage.getScore(toolId);
                if (score) scores[toolId] = score;
            }
        }

        const history = ScoreHistory.getAll();
        for (const toolId of Object.keys(history)) {
            if (!scores[toolId]) {
                const score = Storage.getScore(toolId);
                if (score) scores[toolId] = score;
            }
        }

        return scores;
    },
};
