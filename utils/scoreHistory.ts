import { safeStorage } from "./safeStorage";

export interface ScoreHistoryEntry {
    value: number;
    unit: string;
    difficulty?: string;
    timestamp: number;
    higherIsBetter?: boolean;
    inputMethod?: string;
    configuration?: string;
    duration?: number;
    accuracy?: number;
    eligible?: boolean;
    outcome?: string;
    version?: number;
}

export type ScoreHistoryMeta = Partial<
    Omit<ScoreHistoryEntry, "value" | "unit" | "difficulty" | "timestamp">
>;

export interface ScoreStats {
    best: number;
    average: number;
    count: number;
    trend: "improving" | "declining" | "stable";
    unit: string;
    difficulty?: string;
    inputMethod?: string;
    configuration?: string;
    higherIsBetter: boolean;
}

const HISTORY_PREFIX = "reflexhub_history_";
const MAX_HISTORY_ENTRIES = 100;

/**
 * Determine trend direction by comparing the first half and second half
 * of chronological score values.
 */
export function calculateTrend(
    values: number[],
    higherIsBetter = true
): "improving" | "declining" | "stable" {
    const clean = values.filter((v) => Number.isFinite(v));
    if (clean.length < 2) return "stable";

    const mid = Math.floor(clean.length / 2);
    const firstHalf = clean.slice(0, mid);
    const secondHalf = clean.slice(mid);

    const firstAvg = firstHalf.reduce((sum, n) => sum + n, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, n) => sum + n, 0) / secondHalf.length;

    const delta = secondAvg - firstAvg;
    const threshold = Math.max(0.01, Math.abs(firstAvg) * 0.03);
    if (Math.abs(delta) < threshold) return "stable";

    const improved = higherIsBetter ? delta > 0 : delta < 0;
    return improved ? "improving" : "declining";
}

export const ScoreHistory = {
    get(toolId: string): ScoreHistoryEntry[] {
        const raw = safeStorage.getItem(`${HISTORY_PREFIX}${toolId}`);
        if (!raw) return [];
        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(
                (entry): entry is ScoreHistoryEntry =>
                    entry !== null &&
                    typeof entry === "object" &&
                    typeof entry.value === "number" &&
                    Number.isFinite(entry.value) &&
                    typeof entry.unit === "string"
            );
        } catch {
            return [];
        }
    },

    save(
        toolId: string,
        value: number,
        unit: string,
        difficulty?: string,
        meta?: ScoreHistoryMeta
    ): boolean {
        if (!toolId || !Number.isFinite(value) || value < 0) return false;

        const existing = ScoreHistory.get(toolId);
        const entry: ScoreHistoryEntry = {
            value,
            unit,
            difficulty,
            timestamp: Date.now(),
            ...meta,
        };

        const bounded = [...existing, entry].slice(-MAX_HISTORY_ENTRIES);
        return safeStorage.setItem(
            `${HISTORY_PREFIX}${toolId}`,
            JSON.stringify(bounded)
        );
    },

    getAll(): Record<string, ScoreHistoryEntry[]> {
        const all: Record<string, ScoreHistoryEntry[]> = {};
        const keys = safeStorage.keys();
        for (const key of keys) {
            if (!key.startsWith(HISTORY_PREFIX)) continue;
            const toolId = key.slice(HISTORY_PREFIX.length);
            if (!toolId) continue;
            const entries = ScoreHistory.get(toolId);
            if (entries.length > 0) {
                all[toolId] = entries;
            }
        }
        return all;
    },

    getStats(toolId: string, configuration?: string): ScoreStats | null {
        const entries = ScoreHistory.get(toolId).filter((e) => e.eligible !== false);
        if (entries.length === 0) return null;

        const targetConfig =
            configuration !== undefined
                ? configuration
                : entries[entries.length - 1].configuration;

        const comparable = entries.filter((e) => e.configuration === targetConfig);
        if (comparable.length === 0) return null;

        const latest = comparable[comparable.length - 1];
        const higherIsBetter =
            latest.higherIsBetter !== undefined
                ? latest.higherIsBetter
                : latest.unit !== "ms";

        const values = comparable.map((e) => e.value);
        const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
        const average = values.reduce((sum, n) => sum + n, 0) / values.length;
        const trend = calculateTrend(values, higherIsBetter);

        return {
            best,
            average,
            count: comparable.length,
            trend,
            unit: latest.unit,
            difficulty: latest.difficulty,
            inputMethod: latest.inputMethod,
            configuration: targetConfig,
            higherIsBetter,
        };
    },

    clear(toolId: string): boolean {
        return safeStorage.removeItem(`${HISTORY_PREFIX}${toolId}`);
    },
};
