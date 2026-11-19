import { safeStorage } from './safeStorage';

export interface DailyChallenge {
    id: string;
    date: string;
    toolId: string;
    target: number;
    unit: string;
    description: string;
    reward: string;
}

/** Challenges reset at midnight in the player's local timezone. */
export function localDay(date = new Date()): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export const DailyChallenge = {
    getToday(): DailyChallenge | null {
        if (typeof window === 'undefined') return null;
        const today = localDay();
        const tools = [
            { id: 'sequence-memory', target: 8, unit: 'pts', description: 'Complete 8 sequence stages' },
            { id: 'reaction-time', target: 200, unit: 'ms', description: 'Average under 200ms' },
            { id: 'typing-speed', target: 50, unit: 'wpm', description: 'Type 50 correct WPM' },
            { id: 'cps-test', target: 10, unit: 'cps', description: 'Click 10 CPS' },
        ];
        const seed = [...today].reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);
        const tool = tools[seed % tools.length];
        return { id: `daily_v2_${today}`, date: today, toolId: tool.id, target: tool.target, unit: tool.unit, description: tool.description, reward: '🏆 Daily Challenge Badge' };
    },
    checkCompletion(toolId: string, score: number, unit: string): boolean {
        const challenge = DailyChallenge.getToday();
        if (!challenge || challenge.toolId !== toolId || challenge.unit !== unit || !Number.isFinite(score) || score <= 0) return false;
        const completed = unit === 'ms' ? score <= challenge.target : score >= challenge.target;
        if (!completed || DailyChallenge.isCompleted()) return false;
        return safeStorage.setItem(`reflexhub_daily_completed_${localDay()}`, 'true');
    },
    isCompleted(): boolean {
        return safeStorage.getItem(`reflexhub_daily_completed_${localDay()}`) === 'true';
    },
    getStreak(): number {
        let streak = 0;
        const date = new Date();
        // Yesterday's streak is still active until today's opportunity ends.
        if (!DailyChallenge.isCompleted()) date.setDate(date.getDate() - 1);
        for (let i = 0; i < 365; i++) {
            if (safeStorage.getItem(`reflexhub_daily_completed_${localDay(date)}`) !== 'true') break;
            streak++;
            date.setDate(date.getDate() - 1);
        }
        return streak;
    },
};
