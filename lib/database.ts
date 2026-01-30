// Database abstraction layer
// For now, using localStorage as fallback
// In production, replace with Supabase, Firebase, or your preferred database

export interface LeaderboardEntry {
    id: string;
    toolId: string;
    score: number;
    unit: string;
    userId?: string;
    username?: string;
    timestamp: number;
    difficulty?: string;
}

export interface User {
    id: string;
    email?: string;
    username?: string;
    createdAt: number;
    preferences?: Record<string, any>;
}

class Database {
    private useLocalStorage = true; // Set to false when real DB is connected

    // Leaderboard methods
    async getLeaderboard(toolId: string, limit: number = 100): Promise<LeaderboardEntry[]> {
        if (this.useLocalStorage) {
            return this.getLocalLeaderboard(toolId, limit);
        }
        // TODO: Implement real database call
        return [];
    }

    async saveScore(entry: Omit<LeaderboardEntry, "id" | "timestamp">): Promise<void> {
        if (this.useLocalStorage) {
            this.saveLocalScore(entry);
            return;
        }
        // TODO: Implement real database call
    }

    // User methods
    async getUser(userId: string): Promise<User | null> {
        if (this.useLocalStorage) {
            return this.getLocalUser(userId);
        }
        // TODO: Implement real database call
        return null;
    }

    async createUser(user: Omit<User, "id" | "createdAt">): Promise<User> {
        if (this.useLocalStorage) {
            return this.createLocalUser(user);
        }
        // TODO: Implement real database call
        throw new Error("Not implemented");
    }

    // Local storage fallbacks
    private getLocalLeaderboard(toolId: string, limit: number): LeaderboardEntry[] {
        if (typeof window === "undefined") return [];
        
        const key = `reflexhub_leaderboard_${toolId}`;
        const stored = localStorage.getItem(key);
        if (!stored) return [];

        const entries: LeaderboardEntry[] = JSON.parse(stored);
        return entries
            .sort((a, b) => {
                const isTime = a.unit === "ms";
                return isTime ? a.score - b.score : b.score - a.score;
            })
            .slice(0, limit);
    }

    private saveLocalScore(entry: Omit<LeaderboardEntry, "id" | "timestamp">): void {
        if (typeof window === "undefined") return;

        const key = `reflexhub_leaderboard_${entry.toolId}`;
        const existing = this.getLocalLeaderboard(entry.toolId, 1000);
        
        const newEntry: LeaderboardEntry = {
            ...entry,
            id: `local_${Date.now()}_${Math.random()}`,
            timestamp: Date.now(),
        };

        existing.push(newEntry);
        localStorage.setItem(key, JSON.stringify(existing.slice(-1000))); // Keep last 1000
    }

    private getLocalUser(userId: string): User | null {
        if (typeof window === "undefined") return null;
        const key = `reflexhub_user_${userId}`;
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : null;
    }

    private createLocalUser(user: Omit<User, "id" | "createdAt">): User {
        const newUser: User = {
            ...user,
            id: `local_${Date.now()}_${Math.random()}`,
            createdAt: Date.now(),
        };
        
        if (typeof window !== "undefined") {
            const key = `reflexhub_user_${newUser.id}`;
            localStorage.setItem(key, JSON.stringify(newUser));
        }
        
        return newUser;
    }
}

export const db = new Database();








