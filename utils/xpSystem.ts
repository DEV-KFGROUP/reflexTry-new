import { XP_REWARDS } from "./achievements";
import { getLevel, getXPProgress, getRank, LEVEL_THRESHOLDS } from "./achievements";

const XP_STORAGE_KEY = "reflextry_total_xp";
const LAST_LEVEL_STORAGE_KEY = "reflextry_last_level";

export interface XPProgress {
    totalXP: number;
    level: number;
    currentLevelXP: number;
    nextLevelXP: number;
    progress: number;
    rank: { name: string; icon: string };
    xpToNextLevel: number;
}

export const XPSystem = {
    /**
     * Add XP and return the new total
     */
    addXP: (amount: number, reason?: string): XPProgress => {
        if (typeof window === "undefined") {
            return XPSystem.getProgress();
        }
        
        const currentXP = XPSystem.getTotalXP();
        const oldLevel = getLevel(currentXP);
        const newXP = currentXP + amount;
        
        localStorage.setItem(XP_STORAGE_KEY, newXP.toString());
        
        const newLevel = getLevel(newXP);
        const progress = getXPProgress(newXP);
        const rank = getRank(newLevel);
        
        // Check if level up
        if (newLevel > oldLevel) {
            localStorage.setItem(LAST_LEVEL_STORAGE_KEY, newLevel.toString());
            // Dispatch level up event
            window.dispatchEvent(new CustomEvent('level_up', { 
                detail: { level: newLevel, oldLevel, reason } 
            }));
        }

        // Dispatch general XP update event
        window.dispatchEvent(new CustomEvent('xp_updated'));
        
        return {
            totalXP: newXP,
            level: newLevel,
            ...progress,
            rank,
            xpToNextLevel: progress.nextLevelXP - newXP,
        };
    },
    
    /**
     * Get total XP
     */
    getTotalXP: (): number => {
        if (typeof window === "undefined") return 0;
        const stored = localStorage.getItem(XP_STORAGE_KEY);
        return stored ? parseInt(stored, 10) : 0;
    },
    
    /**
     * Get current XP progress
     */
    getProgress: (): XPProgress => {
        const totalXP = XPSystem.getTotalXP();
        const level = getLevel(totalXP);
        const progress = getXPProgress(totalXP);
        const rank = getRank(level);
        
        return {
            totalXP,
            level,
            ...progress,
            rank,
            xpToNextLevel: progress.nextLevelXP - totalXP,
        };
    },
    
    /**
     * Award XP for completing a game
     */
    awardGameComplete: (): XPProgress => {
        return XPSystem.addXP(XP_REWARDS.gameComplete, "game_complete");
    },
    
    /**
     * Award XP for new high score
     */
    awardNewHighScore: (): XPProgress => {
        return XPSystem.addXP(XP_REWARDS.newHighScore, "new_high_score");
    },
    
    /**
     * Award XP for unlocking achievement
     */
    awardAchievement: (achievementXP: number): XPProgress => {
        return XPSystem.addXP(XP_REWARDS.achievementUnlock + achievementXP, "achievement");
    },
    
    /**
     * Award XP for daily challenge
     */
    awardDailyChallenge: (): XPProgress => {
        return XPSystem.addXP(XP_REWARDS.dailyChallengeComplete, "daily_challenge");
    },
    
    /**
     * Award XP for streak milestone
     */
    awardStreakMilestone: (streakDays: number): XPProgress => {
        // Bonus XP for milestone streaks (7, 14, 30, etc.)
        if (streakDays === 7 || streakDays === 14 || streakDays === 30 || streakDays === 60 || streakDays === 100) {
            return XPSystem.addXP(XP_REWARDS.streakMilestone, "streak_milestone");
        }
        return XPSystem.getProgress();
    },
    
    /**
     * Reset XP (for testing/admin)
     */
    reset: (): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(XP_STORAGE_KEY);
        localStorage.removeItem(LAST_LEVEL_STORAGE_KEY);
    },
};


