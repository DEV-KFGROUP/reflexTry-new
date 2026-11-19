import { safeStorage } from './safeStorage';

export interface ScoreHistoryEntry {
    toolId: string;
    value: number;
    unit: string;
    timestamp: number;
    difficulty?: string;
    higherIsBetter?: boolean;
    inputMethod?: string;
    configuration?: string;
    duration?: number;
    accuracy?: number;
    eligible?: boolean;
    outcome?: 'completed' | 'failed';
    version?: number;
}

type ResultDetails = Partial<Omit<ScoreHistoryEntry, 'toolId' | 'value' | 'unit' | 'timestamp' | 'difficulty'>>;

export const ScoreHistory = {
    save(toolId: string, value: number, unit: string, difficulty?: string, details: ResultDetails = {}) {
        if (typeof window === 'undefined' || !Number.isFinite(value)) return false;
        const entry: ScoreHistoryEntry = { ...details, toolId, value, unit, timestamp: Date.now(), difficulty };
        return safeStorage.setItem(`reflexhub_history_${toolId}`, JSON.stringify([...ScoreHistory.get(toolId), entry].slice(-100)));
    },
    get(toolId: string): ScoreHistoryEntry[] {
        try {
            const parsed: unknown = JSON.parse(safeStorage.getItem(`reflexhub_history_${toolId}`) || '[]');
            return Array.isArray(parsed) ? parsed.filter(e => e && Number.isFinite(e.value) && typeof e.unit === 'string') : [];
        } catch { return []; }
    },
    getAll(): Record<string, ScoreHistoryEntry[]> {
        const history: Record<string, ScoreHistoryEntry[]> = {};
        try {
            if (typeof window === 'undefined') return history;
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key?.startsWith('reflexhub_history_')) {
                    const toolId = key.slice('reflexhub_history_'.length);
                    history[toolId] = ScoreHistory.get(toolId);
                }
            }
        } catch { /* Storage can be unavailable. */ }
        return history;
    },
    clear(toolId?: string) {
        if (toolId) safeStorage.removeItem(`reflexhub_history_${toolId}`);
        else Object.keys(ScoreHistory.getAll()).forEach(id => safeStorage.removeItem(`reflexhub_history_${id}`));
    },
    getStats(toolId: string, configuration?: string) {
        const all = ScoreHistory.get(toolId).filter(e => e.eligible !== false);
        const latest = all.at(-1);
        if (!latest) return null;
        const group = configuration ?? latest.configuration;
        const history = all.filter(e => group ? e.configuration === group : e.difficulty === latest.difficulty && e.unit === latest.unit);
        if (!history.length) return null;
        const values = history.map(e => e.value);
        const basis = history.at(-1)!;
        const higherIsBetter = basis.higherIsBetter ?? basis.unit !== 'ms';
        return {
            count: history.length,
            best: higherIsBetter ? Math.max(...values) : Math.min(...values),
            worst: higherIsBetter ? Math.min(...values) : Math.max(...values),
            average: values.reduce((a, b) => a + b, 0) / values.length,
            recent: history.slice(-10),
            trend: calculateTrend(values, higherIsBetter),
            configuration: group,
            difficulty: basis.difficulty,
            inputMethod: basis.inputMethod,
            unit: basis.unit,
        };
    },
};

export function calculateTrend(values: number[], higherIsBetter = true): 'improving' | 'declining' | 'stable' {
    if (values.length < 5) return 'stable';
    const middle = Math.floor(values.length / 2);
    const avg = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const first = avg(values.slice(0, middle));
    const second = avg(values.slice(middle));
    const diff = ((second - first) / Math.max(Math.abs(first), 0.001)) * 100;
    if (Math.abs(diff) < 5) return 'stable';
    return (higherIsBetter ? diff > 0 : diff < 0) ? 'improving' : 'declining';
}
