export interface DailyChallenge {
    id: string;
    date: string; // YYYY-MM-DD
    toolId: string;
    target: number;
    unit: string;
    description: string;
    reward: string;
}

export const DailyChallenge = {
    getToday: (): DailyChallenge | null => {
        if (typeof window === "undefined") return null;
        
        const today = new Date().toISOString().split("T")[0];
        const key = `reflexhub_daily_${today}`;
        const stored = localStorage.getItem(key);
        
        if (stored) {
            return JSON.parse(stored);
        }

        // Generate new challenge for today
        const tools = [
            { id: "sequence-memory", target: 8, unit: "pts", description: "Reach level 8" },
            { id: "reaction-time", target: 200, unit: "ms", description: "React in under 200ms" },
            { id: "typing-speed", target: 50, unit: "wpm", description: "Type 50 WPM" },
            { id: "cps-test", target: 10, unit: "cps", description: "Click 10 CPS" },
        ];

        const randomTool = tools[Math.floor(Math.random() * tools.length)];
        const challenge: DailyChallenge = {
            id: `daily_${today}`,
            date: today,
            toolId: randomTool.id,
            target: randomTool.target,
            unit: randomTool.unit,
            description: randomTool.description,
            reward: "🏆 Daily Challenge Badge",
        };

        localStorage.setItem(key, JSON.stringify(challenge));
        return challenge;
    },

    checkCompletion: (toolId: string, score: number, unit: string): boolean => {
        const challenge = DailyChallenge.getToday();
        if (!challenge || challenge.toolId !== toolId) return false;

        const isTime = unit === "ms";
        const completed = isTime 
            ? score <= challenge.target 
            : score >= challenge.target;

        if (completed) {
            const today = new Date().toISOString().split("T")[0];
            const key = `reflexhub_daily_completed_${today}`;
            localStorage.setItem(key, "true");
            return true;
        }

        return false;
    },

    isCompleted: (): boolean => {
        if (typeof window === "undefined") return false;
        const today = new Date().toISOString().split("T")[0];
        const key = `reflexhub_daily_completed_${today}`;
        return localStorage.getItem(key) === "true";
    },

    getStreak: (): number => {
        if (typeof window === "undefined") return 0;
        
        let streak = 0;
        const today = new Date();
        
        for (let i = 0; i < 365; i++) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const key = `reflexhub_daily_completed_${dateStr}`;
            
            if (localStorage.getItem(key) === "true") {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    },
};








