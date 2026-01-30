export interface ScoreHistoryEntry {
    toolId: string;
    value: number;
    unit: string;
    timestamp: number;
    difficulty?: string;
}

export const ScoreHistory = {
    save: (toolId: string, value: number, unit: string, difficulty?: string) => {
        if (typeof window === "undefined") return;

        const entry: ScoreHistoryEntry = {
            toolId,
            value,
            unit,
            timestamp: Date.now(),
            difficulty,
        };

        const key = `reflexhub_history_${toolId}`;
        const history = ScoreHistory.get(toolId);
        const updated = [...history, entry].slice(-100); // Keep last 100 entries
        localStorage.setItem(key, JSON.stringify(updated));
    },

    get: (toolId: string): ScoreHistoryEntry[] => {
        if (typeof window === "undefined") return [];
        const key = `reflexhub_history_${toolId}`;
        const str = localStorage.getItem(key);
        return str ? JSON.parse(str) : [];
    },

    getAll: (): Record<string, ScoreHistoryEntry[]> => {
        if (typeof window === "undefined") return {};
        const history: Record<string, ScoreHistoryEntry[]> = {};
        
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key?.startsWith("reflexhub_history_")) {
                const toolId = key.replace("reflexhub_history_", "");
                history[toolId] = ScoreHistory.get(toolId);
            }
        }
        
        return history;
    },

    clear: (toolId?: string) => {
        if (typeof window === "undefined") return;
        
        if (toolId) {
            localStorage.removeItem(`reflexhub_history_${toolId}`);
        } else {
            // Clear all history
            const keys: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith("reflexhub_history_")) {
                    keys.push(key);
                }
            }
            keys.forEach(key => localStorage.removeItem(key));
        }
    },

    getStats: (toolId: string) => {
        const history = ScoreHistory.get(toolId);
        if (history.length === 0) return null;

        const values = history.map(h => h.value);
        const isTime = history[0]?.unit === "ms";
        
        return {
            count: history.length,
            best: isTime ? Math.min(...values) : Math.max(...values),
            worst: isTime ? Math.max(...values) : Math.min(...values),
            average: values.reduce((a, b) => a + b, 0) / values.length,
            recent: history.slice(-10),
            trend: calculateTrend(values),
        };
    },
};

function calculateTrend(values: number[]): "improving" | "declining" | "stable" {
    if (values.length < 5) return "stable";
    
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const diff = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (Math.abs(diff) < 5) return "stable";
    return diff > 0 ? "improving" : "declining";
}








