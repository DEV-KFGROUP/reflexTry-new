import { safeStorage } from "./safeStorage";
import { ScoreHistory, type ScoreHistoryEntry } from "./scoreHistory";
import { Storage, type Score } from "./storage";
import { TOOL_COUNT } from "@/config/tool-mapping";

export type AchievementCategory =
    | "reflex"
    | "memory"
    | "speed"
    | "gaming"
    | "accuracy"
    | "milestones";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum";

export type AchievementIconName =
    | "target"
    | "zap"
    | "flame"
    | "shield"
    | "brain"
    | "hash"
    | "book"
    | "layers"
    | "mouse"
    | "keyboard"
    | "calculator"
    | "grid"
    | "crosshair"
    | "activity"
    | "eye"
    | "star"
    | "compass"
    | "award"
    | "crown"
    | "trophy";

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    iconName: AchievementIconName;
    category: AchievementCategory;
    tier: AchievementTier;
    xpReward: number;
    targetLabel: string;
    recommendedHref: string;
    toolIds?: string[];
    unlockedAt?: number;
}

export interface AchievementProgress {
    achievement: Achievement;
    unlocked: boolean;
    unlockedAt?: number;
    /** Normalized progress from 0 to 1 toward the badge goal. */
    progressRatio: number;
    currentLabel: string;
}

export interface AchievementCheckMeta {
    accuracy?: number;
}

const ACHIEVEMENT_PREFIX = "reflexhub_achievement_";

export const ACHIEVEMENTS: Achievement[] = [
    // Reflex Arena
    {
        id: "quick_draw",
        name: "Quick Draw",
        description: "Record a reaction time under 250 ms in Reaction Time or Sound Reaction.",
        icon: "zap",
        iconName: "zap",
        category: "reflex",
        tier: "bronze",
        xpReward: 25,
        targetLabel: "< 250 ms",
        recommendedHref: "/reflex/reaction",
        toolIds: ["reaction-time", "sound-reaction"],
    },
    {
        id: "speedster",
        name: "Speedster",
        description: "Clock under 200 ms on any timed reflex benchmark or hit 8+ CPS in Click Speed.",
        icon: "flame",
        iconName: "flame",
        category: "reflex",
        tier: "silver",
        xpReward: 50,
        targetLabel: "< 200 ms or ≥ 8 CPS",
        recommendedHref: "/reflex/reaction",
        toolIds: ["reaction-time", "sound-reaction", "choice-reaction", "sequence-reaction", "cps-test"],
    },
    {
        id: "speed_demon",
        name: "Lightning Reflex",
        description: "Achieve an elite reaction time under 150 ms in Reaction Time or Sound Reaction.",
        icon: "zap",
        iconName: "zap",
        category: "reflex",
        tier: "gold",
        xpReward: 100,
        targetLabel: "< 150 ms",
        recommendedHref: "/reflex/reaction",
        toolIds: ["reaction-time", "sound-reaction"],
    },
    {
        id: "iron_discipline",
        name: "Impulse Control",
        description: "Score 80+ points in Go / No-Go or the Flanker attention task.",
        icon: "shield",
        iconName: "shield",
        category: "reflex",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 80 pts",
        recommendedHref: "/reflex/go-no-go",
        toolIds: ["go-no-go", "flanker"],
    },

    // Memory Arena
    {
        id: "digit_savant",
        name: "Digit Savant",
        description: "Recall 8 or more digits in a single Number Memory session.",
        icon: "hash",
        iconName: "hash",
        category: "memory",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 8 digits",
        recommendedHref: "/memory/number",
        toolIds: ["number-memory"],
    },
    {
        id: "memory_master",
        name: "Memory Master",
        description: "Reach 10+ in Sequence, Number, Visual, Word Recall, or Chimp Test.",
        icon: "brain",
        iconName: "brain",
        category: "memory",
        tier: "gold",
        xpReward: 100,
        targetLabel: "≥ 10 levels",
        recommendedHref: "/memory/sequence",
        toolIds: ["sequence-memory", "number-memory", "visual-memory", "word-recall", "chimp-test"],
    },
    {
        id: "word_hoarder",
        name: "Lexicon Keeper",
        description: "Track 30 or more words accurately in Verbal Memory.",
        icon: "book",
        iconName: "book",
        category: "memory",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 30 words",
        recommendedHref: "/memory/verbal-memory",
        toolIds: ["verbal-memory"],
    },
    {
        id: "dual_core",
        name: "Working Memory Pro",
        description: "Score 15+ points in N-Back or Object Tracking.",
        icon: "layers",
        iconName: "layers",
        category: "memory",
        tier: "gold",
        xpReward: 100,
        targetLabel: "≥ 15 pts",
        recommendedHref: "/memory/n-back",
        toolIds: ["n-back", "object-tracking"],
    },

    // Speed Arena
    {
        id: "rapid_clicker",
        name: "Rapid Clicker",
        description: "Sustain 7.0+ clicks per second in the CPS Click Speed test.",
        icon: "mouse",
        iconName: "mouse",
        category: "speed",
        tier: "bronze",
        xpReward: 25,
        targetLabel: "≥ 7.0 CPS",
        recommendedHref: "/speed/click",
        toolIds: ["cps-test"],
    },
    {
        id: "velocity_typist",
        name: "Velocity Typist",
        description: "Hit 65+ words per minute in Typing Speed or Data Entry.",
        icon: "keyboard",
        iconName: "keyboard",
        category: "speed",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 65 WPM",
        recommendedHref: "/speed/typing",
        toolIds: ["typing-speed", "data-entry"],
    },
    {
        id: "human_calculator",
        name: "Mental Calculator",
        description: "Score 20+ points in the Speed Math arithmetic sprint.",
        icon: "calculator",
        iconName: "calculator",
        category: "speed",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 20 pts",
        recommendedHref: "/speed/math",
        toolIds: ["math-speed", "speed-math"],
    },
    {
        id: "schulte_sprinter",
        name: "Grid Sprinter",
        description: "Complete a Schulte Table or Number Rush grid under 15 seconds.",
        icon: "grid",
        iconName: "grid",
        category: "speed",
        tier: "gold",
        xpReward: 100,
        targetLabel: "< 15.0 s",
        recommendedHref: "/speed/schulte-table",
        toolIds: ["schulte-table", "number-rush"],
    },

    // Gaming Arena
    {
        id: "sharpshooter",
        name: "Sharpshooter",
        description: "Score 25+ points in Aim Trainer or Flick Shot.",
        icon: "crosshair",
        iconName: "crosshair",
        category: "gaming",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 25 pts",
        recommendedHref: "/gaming/aim",
        toolIds: ["aim-trainer", "flick-shot"],
    },
    {
        id: "rhythm_locked",
        name: "Flow State",
        description: "Score 500+ in Rhythm Tap or hold 20+ seconds in Endless Dodge or Target Tracking.",
        icon: "activity",
        iconName: "activity",
        category: "gaming",
        tier: "gold",
        xpReward: 100,
        targetLabel: "≥ 20 s or ≥ 500 pts",
        recommendedHref: "/gaming/target-tracking",
        toolIds: ["rhythm-tap", "endless-dodge", "target-tracking"],
    },

    // Accuracy Arena
    {
        id: "precision_eye",
        name: "Precision Eye",
        description: "Score 85+ points in Angle Estimation, Color Match, or Precision Click.",
        icon: "eye",
        iconName: "eye",
        category: "accuracy",
        tier: "silver",
        xpReward: 50,
        targetLabel: "≥ 85 pts",
        recommendedHref: "/accuracy/precision-click",
        toolIds: ["angle-estimation", "color-match", "precision-click"],
    },
    {
        id: "perfect_score",
        name: "Flawless Run",
        description: "Complete an accuracy or color-switch benchmark with a 100% score.",
        icon: "star",
        iconName: "star",
        category: "accuracy",
        tier: "gold",
        xpReward: 100,
        targetLabel: "100% accuracy",
        recommendedHref: "/accuracy/image-recognition",
        toolIds: ["image-recognition", "color-switch"],
    },

    // Cross-Tool Milestones
    {
        id: "first_score",
        name: "First Benchmark",
        description: "Complete your first eligible session on any Reflextry tool.",
        icon: "target",
        iconName: "target",
        category: "milestones",
        tier: "bronze",
        xpReward: 25,
        targetLabel: "1 session",
        recommendedHref: "/reflex/reaction",
    },
    {
        id: "multi_arena",
        name: "Arena Explorer",
        description: "Record high scores across at least 5 different cognitive tools.",
        icon: "compass",
        iconName: "compass",
        category: "milestones",
        tier: "silver",
        xpReward: 50,
        targetLabel: "5 tools",
        recommendedHref: "/tools",
    },
    {
        id: "century_club",
        name: "Century Club",
        description: "Complete 100 total benchmark sessions across all arenas.",
        icon: "award",
        iconName: "award",
        category: "milestones",
        tier: "gold",
        xpReward: 100,
        targetLabel: "100 sessions",
        recommendedHref: "/tools",
    },
    {
        id: "all_tools",
        name: "Grand Master",
        description: `Record an eligible score across all ${TOOL_COUNT} published Reflextry tools.`,
        icon: "crown",
        iconName: "crown",
        category: "milestones",
        tier: "platinum",
        xpReward: 200,
        targetLabel: `${TOOL_COUNT} tools`,
        recommendedHref: "/tools",
    },
];

interface EvaluationContext {
    history: Record<string, ScoreHistoryEntry[]>;
    storedScores: Record<string, Score>;
    totalSessions: number;
    uniqueTools: number;
    latestAttempt?: {
        toolId: string;
        score: number;
        unit: string;
        accuracy?: number;
    };
}

function buildContext(latestAttempt?: EvaluationContext["latestAttempt"]): EvaluationContext {
    const history = ScoreHistory.getAll();
    const storedScores = Storage.getAllScores();

    let totalSessions = 0;
    const toolSet = new Set<string>();

    for (const [toolId, entries] of Object.entries(history)) {
        const eligibleEntries = entries.filter((e) => e.eligible !== false);
        if (eligibleEntries.length > 0) {
            totalSessions += eligibleEntries.length;
            toolSet.add(toolId);
        }
    }

    for (const toolId of Object.keys(storedScores)) {
        if (!toolSet.has(toolId)) {
            toolSet.add(toolId);
            totalSessions += 1;
        }
    }

    if (latestAttempt) {
        toolSet.add(latestAttempt.toolId);
        if (totalSessions === 0) totalSessions = 1;
    }

    return {
        history,
        storedScores,
        totalSessions,
        uniqueTools: toolSet.size,
        latestAttempt,
    };
}

function getBestForTools(
    ctx: EvaluationContext,
    toolIds: string[],
    options: { higherIsBetter: boolean; unitFilter?: string }
): number | null {
    const values: number[] = [];

    for (const toolId of toolIds) {
        const entries = (ctx.history[toolId] || []).filter((e) => e.eligible !== false);
        for (const entry of entries) {
            if (options.unitFilter && entry.unit !== options.unitFilter) continue;
            if (!options.higherIsBetter && entry.value <= 0) continue;
            values.push(entry.value);
        }

        const stored = ctx.storedScores[toolId];
        if (stored && Number.isFinite(stored.value)) {
            const unitOk = !options.unitFilter || stored.unit === options.unitFilter;
            const positiveOk = options.higherIsBetter || stored.value > 0;
            if (unitOk && positiveOk) {
                values.push(stored.value);
            }
        }
    }

    if (ctx.latestAttempt && toolIds.includes(ctx.latestAttempt.toolId)) {
        const unitOk = !options.unitFilter || ctx.latestAttempt.unit === options.unitFilter;
        const positiveOk = options.higherIsBetter || ctx.latestAttempt.score > 0;
        if (unitOk && positiveOk) {
            values.push(ctx.latestAttempt.score);
        }
    }

    if (values.length === 0) return null;
    return options.higherIsBetter ? Math.max(...values) : Math.min(...values);
}

function hasPerfectRun(ctx: EvaluationContext): { bestPct: number | null; qualified: boolean } {
    let bestPct: number | null = null;

    const consider = (val: number) => {
        if (!Number.isFinite(val)) return;
        const clamped = Math.min(100, Math.max(0, val));
        bestPct = bestPct === null ? clamped : Math.max(bestPct, clamped);
    };

    for (const entries of Object.values(ctx.history)) {
        for (const entry of entries) {
            if (entry.eligible === false) continue;
            if (entry.unit === "%") consider(entry.value);
            if (typeof entry.accuracy === "number") consider(entry.accuracy);
        }
    }

    for (const score of Object.values(ctx.storedScores)) {
        if (score.unit === "%") consider(score.value);
    }

    if (ctx.latestAttempt) {
        if (ctx.latestAttempt.unit === "%") consider(ctx.latestAttempt.score);
        if (typeof ctx.latestAttempt.accuracy === "number") consider(ctx.latestAttempt.accuracy);
    }

    return { bestPct, qualified: bestPct !== null && bestPct >= 100 };
}

function lowerIsBetterRatio(best: number | null, target: number, baseline: number): number {
    if (best === null) return 0;
    if (best <= target) return 1;
    if (best >= baseline) return 0.08;
    return Math.min(0.99, Math.max(0.08, (baseline - best) / (baseline - target)));
}

function higherIsBetterRatio(best: number | null, target: number): number {
    if (best === null || best <= 0) return 0;
    return Math.min(1, Math.max(0, best / target));
}

function evaluateSingle(
    achievement: Achievement,
    ctx: EvaluationContext
): { qualified: boolean; progressRatio: number; currentLabel: string } {
    switch (achievement.id) {
        case "quick_draw": {
            const best = getBestForTools(ctx, ["reaction-time", "sound-reaction"], {
                higherIsBetter: false,
                unitFilter: "ms",
            });
            return {
                qualified: best !== null && best < 250,
                progressRatio: lowerIsBetterRatio(best, 250, 500),
                currentLabel: best !== null ? `Best: ${Math.round(best)} ms` : "No reaction score yet",
            };
        }
        case "speedster": {
            const bestMs = getBestForTools(
                ctx,
                ["reaction-time", "sound-reaction", "choice-reaction", "sequence-reaction"],
                { higherIsBetter: false, unitFilter: "ms" }
            );
            const bestCps = getBestForTools(ctx, ["cps-test"], {
                higherIsBetter: true,
                unitFilter: "cps",
            });
            const msRatio = lowerIsBetterRatio(bestMs, 200, 420);
            const cpsRatio = higherIsBetterRatio(bestCps, 8);
            const qualified = (bestMs !== null && bestMs < 200) || (bestCps !== null && bestCps >= 8);
            let currentLabel = "No qualifying score yet";
            if (bestMs !== null && (msRatio >= cpsRatio || bestCps === null)) {
                currentLabel = `Best: ${Math.round(bestMs)} ms`;
            } else if (bestCps !== null) {
                currentLabel = `Best: ${bestCps.toFixed(1)} CPS`;
            }
            return {
                qualified,
                progressRatio: Math.max(msRatio, cpsRatio),
                currentLabel,
            };
        }
        case "speed_demon": {
            const best = getBestForTools(ctx, ["reaction-time", "sound-reaction"], {
                higherIsBetter: false,
                unitFilter: "ms",
            });
            return {
                qualified: best !== null && best < 150,
                progressRatio: lowerIsBetterRatio(best, 150, 350),
                currentLabel: best !== null ? `Best: ${Math.round(best)} ms` : "No reaction score yet",
            };
        }
        case "iron_discipline": {
            const best = getBestForTools(ctx, ["go-no-go", "flanker"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 80,
                progressRatio: higherIsBetterRatio(best, 80),
                currentLabel: best !== null ? `Best: ${Math.round(best)} pts` : "Not attempted yet",
            };
        }
        case "digit_savant": {
            const best = getBestForTools(ctx, ["number-memory"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 8,
                progressRatio: higherIsBetterRatio(best, 8),
                currentLabel: best !== null ? `Best: ${Math.round(best)} digits` : "Not attempted yet",
            };
        }
        case "memory_master": {
            const best = getBestForTools(
                ctx,
                ["sequence-memory", "number-memory", "visual-memory", "word-recall", "chimp-test"],
                { higherIsBetter: true }
            );
            return {
                qualified: best !== null && best >= 10,
                progressRatio: higherIsBetterRatio(best, 10),
                currentLabel: best !== null ? `Best: ${Math.round(best)} / 10` : "No memory score yet",
            };
        }
        case "word_hoarder": {
            const best = getBestForTools(ctx, ["verbal-memory"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 30,
                progressRatio: higherIsBetterRatio(best, 30),
                currentLabel: best !== null ? `Best: ${Math.round(best)} words` : "Not attempted yet",
            };
        }
        case "dual_core": {
            const best = getBestForTools(ctx, ["n-back", "object-tracking"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 15,
                progressRatio: higherIsBetterRatio(best, 15),
                currentLabel: best !== null ? `Best: ${Math.round(best)} pts` : "Not attempted yet",
            };
        }
        case "rapid_clicker": {
            const best = getBestForTools(ctx, ["cps-test"], { higherIsBetter: true, unitFilter: "cps" });
            return {
                qualified: best !== null && best >= 7,
                progressRatio: higherIsBetterRatio(best, 7),
                currentLabel: best !== null ? `Best: ${best.toFixed(1)} CPS` : "Not attempted yet",
            };
        }
        case "velocity_typist": {
            const best = getBestForTools(ctx, ["typing-speed", "data-entry"], {
                higherIsBetter: true,
                unitFilter: "wpm",
            });
            return {
                qualified: best !== null && best >= 65,
                progressRatio: higherIsBetterRatio(best, 65),
                currentLabel: best !== null ? `Best: ${Math.round(best)} WPM` : "Not attempted yet",
            };
        }
        case "human_calculator": {
            const best = getBestForTools(ctx, ["math-speed", "speed-math"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 20,
                progressRatio: higherIsBetterRatio(best, 20),
                currentLabel: best !== null ? `Best: ${Math.round(best)} pts` : "Not attempted yet",
            };
        }
        case "schulte_sprinter": {
            const best = getBestForTools(ctx, ["schulte-table", "number-rush"], {
                higherIsBetter: false,
                unitFilter: "ms",
            });
            return {
                qualified: best !== null && best < 15000,
                progressRatio: lowerIsBetterRatio(best, 15000, 45000),
                currentLabel:
                    best !== null ? `Best: ${(best / 1000).toFixed(1)} s` : "Not attempted yet",
            };
        }
        case "sharpshooter": {
            const best = getBestForTools(ctx, ["aim-trainer", "flick-shot"], { higherIsBetter: true });
            return {
                qualified: best !== null && best >= 25,
                progressRatio: higherIsBetterRatio(best, 25),
                currentLabel: best !== null ? `Best: ${Math.round(best)} pts` : "Not attempted yet",
            };
        }
        case "rhythm_locked": {
            const bestPts = getBestForTools(ctx, ["rhythm-tap"], { higherIsBetter: true });
            const bestSec = getBestForTools(ctx, ["endless-dodge", "target-tracking"], {
                higherIsBetter: true,
                unitFilter: "s",
            });
            const ptsRatio = higherIsBetterRatio(bestPts, 500);
            const secRatio = higherIsBetterRatio(bestSec, 20);
            const qualified =
                (bestPts !== null && bestPts >= 500) || (bestSec !== null && bestSec >= 20);
            let currentLabel = "Not attempted yet";
            if (bestSec !== null && (secRatio >= ptsRatio || bestPts === null)) {
                currentLabel = `Best: ${bestSec.toFixed(1)} s`;
            } else if (bestPts !== null) {
                currentLabel = `Best: ${Math.round(bestPts)} pts`;
            }
            return {
                qualified,
                progressRatio: Math.max(ptsRatio, secRatio),
                currentLabel,
            };
        }
        case "precision_eye": {
            const best = getBestForTools(ctx, ["angle-estimation", "color-match", "precision-click"], {
                higherIsBetter: true,
            });
            return {
                qualified: best !== null && best >= 85,
                progressRatio: higherIsBetterRatio(best, 85),
                currentLabel: best !== null ? `Best: ${Math.round(best)} pts` : "Not attempted yet",
            };
        }
        case "perfect_score": {
            const { bestPct, qualified } = hasPerfectRun(ctx);
            return {
                qualified,
                progressRatio: higherIsBetterRatio(bestPct, 100),
                currentLabel:
                    bestPct !== null ? `Best: ${Math.round(bestPct)}%` : "No accuracy run yet",
            };
        }
        case "first_score": {
            return {
                qualified: ctx.totalSessions >= 1,
                progressRatio: ctx.totalSessions >= 1 ? 1 : 0,
                currentLabel: `${Math.min(1, ctx.totalSessions)} / 1 session`,
            };
        }
        case "multi_arena": {
            return {
                qualified: ctx.uniqueTools >= 5,
                progressRatio: higherIsBetterRatio(ctx.uniqueTools, 5),
                currentLabel: `${ctx.uniqueTools} / 5 tools`,
            };
        }
        case "century_club": {
            return {
                qualified: ctx.totalSessions >= 100,
                progressRatio: higherIsBetterRatio(ctx.totalSessions, 100),
                currentLabel: `${ctx.totalSessions} / 100 sessions`,
            };
        }
        case "all_tools": {
            return {
                qualified: ctx.uniqueTools >= TOOL_COUNT,
                progressRatio: higherIsBetterRatio(ctx.uniqueTools, TOOL_COUNT),
                currentLabel: `${ctx.uniqueTools} / ${TOOL_COUNT} tools`,
            };
        }
        default:
            return { qualified: false, progressRatio: 0, currentLabel: "Not started" };
    }
}

function readUnlockedTimestamp(id: string): number | undefined {
    const raw = safeStorage.getItem(`${ACHIEVEMENT_PREFIX}${id}`);
    if (raw === null) return undefined;
    try {
        const parsed = JSON.parse(raw) as { unlockedAt?: unknown };
        if (typeof parsed?.unlockedAt === "number" && Number.isFinite(parsed.unlockedAt)) {
            return parsed.unlockedAt;
        }
    } catch {
        // Ignore malformed timestamp
    }
    return Date.now();
}

export const Achievements = {
    check: (
        toolId: string,
        score: number,
        unit: string,
        meta?: AchievementCheckMeta
    ): Achievement[] => {
        if (typeof window === "undefined") return [];

        const ctx = buildContext({
            toolId,
            score,
            unit,
            accuracy: meta?.accuracy,
        });
        const unlockedIds = new Set(Achievements.getUnlocked().map((a) => a.id));
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            if (unlockedIds.has(achievement.id)) continue;
            const { qualified } = evaluateSingle(achievement, ctx);
            if (qualified) {
                const unlockedAt = Date.now();
                Achievements.unlock(achievement.id, unlockedAt);
                newlyUnlocked.push({ ...achievement, unlockedAt });
            }
        }

        return newlyUnlocked;
    },

    /** Retroactively sync badges against all saved local high scores and score history. */
    syncFromScores: (): Achievement[] => {
        if (typeof window === "undefined") return [];

        const ctx = buildContext();
        const unlockedIds = new Set(Achievements.getUnlocked().map((a) => a.id));
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            if (unlockedIds.has(achievement.id)) continue;
            const { qualified } = evaluateSingle(achievement, ctx);
            if (qualified) {
                const unlockedAt = Date.now();
                Achievements.unlock(achievement.id, unlockedAt);
                newlyUnlocked.push({ ...achievement, unlockedAt });
            }
        }

        return newlyUnlocked;
    },

    evaluateProgress: (): AchievementProgress[] => {
        if (typeof window === "undefined") {
            return ACHIEVEMENTS.map((achievement) => ({
                achievement,
                unlocked: false,
                progressRatio: 0,
                currentLabel: "Not started",
            }));
        }

        const ctx = buildContext();
        return ACHIEVEMENTS.map((achievement) => {
            const savedAt = readUnlockedTimestamp(achievement.id);
            const isStored = safeStorage.getItem(`${ACHIEVEMENT_PREFIX}${achievement.id}`) !== null;
            const evalResult = evaluateSingle(achievement, ctx);
            const unlocked = isStored || evalResult.qualified;

            return {
                achievement: unlocked
                    ? { ...achievement, unlockedAt: savedAt }
                    : achievement,
                unlocked,
                unlockedAt: savedAt,
                progressRatio: unlocked ? 1 : evalResult.progressRatio,
                currentLabel: evalResult.currentLabel,
            };
        });
    },

    unlock: (id: string, timestamp = Date.now()) => {
        if (typeof window === "undefined") return;
        safeStorage.setItem(
            `${ACHIEVEMENT_PREFIX}${id}`,
            JSON.stringify({ unlockedAt: timestamp })
        );
    },

    getUnlocked: (): Achievement[] => {
        if (typeof window === "undefined") return [];

        return ACHIEVEMENTS.filter(
            (achievement) => safeStorage.getItem(`${ACHIEVEMENT_PREFIX}${achievement.id}`) !== null
        ).map((achievement) => ({
            ...achievement,
            unlockedAt: readUnlockedTimestamp(achievement.id),
        }));
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
    { name: "Beginner", icon: "seed", minLevel: 1, maxLevel: 5 },
    { name: "Novice", icon: "star", minLevel: 6, maxLevel: 10 },
    { name: "Intermediate", icon: "flame", minLevel: 11, maxLevel: 15 },
    { name: "Advanced", icon: "diamond", minLevel: 16, maxLevel: 20 },
    { name: "Expert", icon: "crown", minLevel: 21, maxLevel: Infinity },
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
