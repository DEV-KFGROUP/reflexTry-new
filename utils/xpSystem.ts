import { safeStorage } from "./safeStorage";
import { XP_REWARDS, getLevel, getXPProgress, getRank } from "./achievements";

export interface XPProgress {
    level: number;
    totalXP: number;
    currentLevelXP: number;
    nextLevelXP: number;
    /** Progress within current level normalized from 0 to 1. */
    progress: number;
    rank: {
        name: string;
        icon: string;
    };
    xpToNextLevel: number;
}

const XP_STORAGE_KEY = "reflexhub_total_xp";

function buildProgress(totalXP: number): XPProgress {
    const safeXP = Number.isFinite(totalXP) && totalXP > 0 ? Math.floor(totalXP) : 0;
    const level = getLevel(safeXP);
    const { currentLevelXP, nextLevelXP, progress } = getXPProgress(safeXP);
    const rank = getRank(level);

    return {
        level,
        totalXP: safeXP,
        currentLevelXP,
        nextLevelXP,
        progress: Math.min(1, Math.max(0, progress / 100)),
        rank,
        xpToNextLevel: Math.max(0, nextLevelXP - safeXP),
    };
}

export const XPSystem = {
    getTotalXP(): number {
        const raw = safeStorage.getItem(XP_STORAGE_KEY);
        if (!raw) return 0;
        const parsed = Number(raw);
        return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : 0;
    },

    getProgress(): XPProgress {
        return buildProgress(XPSystem.getTotalXP());
    },

    addXP(amount: number): XPProgress {
        if (!Number.isFinite(amount) || amount <= 0) {
            return XPSystem.getProgress();
        }

        const currentXP = XPSystem.getTotalXP();
        const previousLevel = getLevel(currentXP);
        const nextXP = currentXP + Math.floor(amount);
        safeStorage.setItem(XP_STORAGE_KEY, String(nextXP));

        const updated = buildProgress(nextXP);
        if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("xp_updated", { detail: updated }));
            if (updated.level > previousLevel) {
                window.dispatchEvent(new CustomEvent("level_up", { detail: updated }));
            }
        }
        return updated;
    },

    awardGameComplete(): XPProgress {
        return XPSystem.addXP(XP_REWARDS.gameComplete);
    },

    awardNewHighScore(): XPProgress {
        return XPSystem.addXP(XP_REWARDS.newHighScore);
    },

    awardDailyChallenge(): XPProgress {
        return XPSystem.addXP(XP_REWARDS.dailyChallengeComplete);
    },

    awardAchievement(bonus?: number): XPProgress {
        const amount =
            bonus === undefined ? XP_REWARDS.achievementUnlock : Math.max(0, bonus);
        return XPSystem.addXP(amount);
    },
};
