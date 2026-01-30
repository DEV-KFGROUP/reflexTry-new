export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: "first_score",
        name: "First Steps",
        description: "Complete your first game",
        icon: "🎯",
    },
    {
        id: "perfect_score",
        name: "Perfect",
        description: "Achieve a perfect score",
        icon: "⭐",
    },
    {
        id: "speed_demon",
        name: "Speed Demon",
        description: "Reaction time under 150ms",
        icon: "⚡",
    },
    {
        id: "memory_master",
        name: "Memory Master",
        description: "Reach level 10 in any memory game",
        icon: "🧠",
    },
    {
        id: "century_club",
        name: "Century Club",
        description: "Play 100 games total",
        icon: "💯",
    },
    {
        id: "all_tools",
        name: "Explorer",
        description: "Try all available tools",
        icon: "🗺️",
    },
];

export const Achievements = {
    check: (toolId: string, score: number, unit: string) => {
        if (typeof window === "undefined") return [];
        
        const unlocked: Achievement[] = [];
        const current = Achievements.getUnlocked();

        // First score achievement
        if (!current.find(a => a.id === "first_score")) {
            unlocked.push({ ...ACHIEVEMENTS.find(a => a.id === "first_score")!, unlockedAt: Date.now() });
        }

        // Speed demon (for reaction time)
        if (toolId.includes("reaction") && unit === "ms" && score < 150 && !current.find(a => a.id === "speed_demon")) {
            unlocked.push({ ...ACHIEVEMENTS.find(a => a.id === "speed_demon")!, unlockedAt: Date.now() });
        }

        // Memory master
        if (toolId.includes("memory") && score >= 10 && !current.find(a => a.id === "memory_master")) {
            unlocked.push({ ...ACHIEVEMENTS.find(a => a.id === "memory_master")!, unlockedAt: Date.now() });
        }

        // Save unlocked achievements
        unlocked.forEach(achievement => {
            Achievements.unlock(achievement.id);
        });

        return unlocked;
    },

    unlock: (id: string) => {
        if (typeof window === "undefined") return;
        const key = `reflexhub_achievement_${id}`;
        localStorage.setItem(key, JSON.stringify({ unlockedAt: Date.now() }));
    },

    getUnlocked: (): Achievement[] => {
        if (typeof window === "undefined") return [];
        
        return ACHIEVEMENTS.filter(achievement => {
            const key = `reflexhub_achievement_${achievement.id}`;
            return localStorage.getItem(key) !== null;
        }).map(achievement => {
            const key = `reflexhub_achievement_${achievement.id}`;
            const data = localStorage.getItem(key);
            return {
                ...achievement,
                unlockedAt: data ? JSON.parse(data).unlockedAt : undefined,
            };
        });
    },

    getAll: () => ACHIEVEMENTS,
};

// XP System Constants
export const XP_REWARDS = {
    gameComplete: 10,
    newHighScore: 25,
    achievementUnlock: 50,
    dailyChallengeComplete: 100,
    streakMilestone: 200,
};

// Level thresholds (XP required for each level)
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    450,    // Level 4
    700,    // Level 5
    1000,   // Level 6
    1350,   // Level 7
    1750,   // Level 8
    2200,   // Level 9
    2700,   // Level 10
    3250,   // Level 11
    3850,   // Level 12
    4500,   // Level 13
    5200,   // Level 14
    5950,   // Level 15
    6750,   // Level 16
    7600,   // Level 17
    8500,   // Level 18
    9450,   // Level 19
    10450,  // Level 20
];

// Ranks based on level
const RANKS = [
    { name: "Beginner", icon: "🌱", minLevel: 1, maxLevel: 5 },
    { name: "Novice", icon: "⭐", minLevel: 6, maxLevel: 10 },
    { name: "Intermediate", icon: "🔥", minLevel: 11, maxLevel: 15 },
    { name: "Advanced", icon: "💎", minLevel: 16, maxLevel: 20 },
    { name: "Expert", icon: "👑", minLevel: 21, maxLevel: Infinity },
];

/**
 * Get level from total XP
 */
export function getLevel(totalXP: number): number {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
        if (totalXP >= LEVEL_THRESHOLDS[i]) {
            return i + 1;
        }
    }
    return 1;
}

/**
 * Get XP progress for current level
 */
export function getXPProgress(totalXP: number): {
    currentLevelXP: number;
    nextLevelXP: number;
    progress: number;
} {
    const level = getLevel(totalXP);
    const currentLevelXP = LEVEL_THRESHOLDS[level - 1] || 0;
    const nextLevelXP = LEVEL_THRESHOLDS[level] || LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1] + 1000;
    const xpInLevel = totalXP - currentLevelXP;
    const xpNeededForLevel = nextLevelXP - currentLevelXP;
    const progress = xpNeededForLevel > 0 ? (xpInLevel / xpNeededForLevel) * 100 : 100;

    return {
        currentLevelXP,
        nextLevelXP,
        progress: Math.min(100, Math.max(0, progress)),
    };
}

/**
 * Get rank based on level
 */
export function getRank(level: number): { name: string; icon: string } {
    for (const rank of RANKS) {
        if (level >= rank.minLevel && level <= rank.maxLevel) {
            return { name: rank.name, icon: rank.icon };
        }
    }
    return RANKS[RANKS.length - 1];
}








