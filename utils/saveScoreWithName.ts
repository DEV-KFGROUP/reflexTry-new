// Helper function to save scores with player name to leaderboard
import { Storage } from "./storage";
import { db } from "@/lib/database";
import { ScoreHistory } from "./scoreHistory";
import { Achievements } from "./achievements";
import { DailyChallenge } from "./dailyChallenge";
import { toast } from "./toast";

export interface SaveScoreOptions {
    toolId: string;
    toolName: string;
    score: number;
    unit: string;
    showPrompt?: boolean;
    playerName?: string;
}

/**
 * Saves a score and shows player name prompt if it's a new high score
 * Returns true if it's a new high score, false otherwise
 */
export async function saveScoreWithName(options: SaveScoreOptions): Promise<{
    isNewHigh: boolean;
    showPrompt: boolean;
}> {
    const { toolId, toolName, score, unit, showPrompt = true, playerName } = options;

    // Save to history
    ScoreHistory.save(toolId, score, unit);

    // Check achievements
    const unlocked = Achievements.check(toolId, score, unit);
    if (unlocked.length > 0) {
        window.dispatchEvent(new CustomEvent("achievement_unlocked", { detail: unlocked }));
    }

    // Check daily challenge
    if (DailyChallenge.checkCompletion(toolId, score, unit)) {
        toast.success("🎉 Daily Challenge Completed!");
    }

    // Check if it's a new high score
    const isNewHigh = Storage.saveScore(toolId, score, unit, playerName);

    if (isNewHigh) {
        // Get player name
        const name = playerName || 
            (typeof window !== "undefined" ? localStorage.getItem("reflextry_player_name") : null) ||
            "Anonymous";

        // Save to global leaderboard
        await db.saveScore({
            toolId,
            score,
            unit,
            username: name,
        });

        // Dispatch score update event
        window.dispatchEvent(new Event("score_updated"));

        return {
            isNewHigh: true,
            showPrompt: showPrompt, // Always show prompt for new high scores so user can set/update name
        };
    }

    return {
        isNewHigh: false,
        showPrompt: false,
    };
}

