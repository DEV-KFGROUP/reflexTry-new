"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    Trophy,
    Lock,
    CheckCircle2,
    ArrowRight,
    Zap,
    RotateCcw,
} from "lucide-react";
import {
    Achievements,
    type AchievementCategory,
    type AchievementProgress,
    type AchievementTier,
} from "@/utils/achievements";
import { ScoreHistory } from "@/utils/scoreHistory";
import { XPSystem, type XPProgress } from "@/utils/xpSystem";
import { AchievementIcon } from "@/components/AchievementIcon";
import { useTranslation } from "@/lib/i18n/context";

type CategoryFilter = "all" | AchievementCategory;
type StatusFilter = "all" | "unlocked" | "locked";

const CATEGORY_TABS: { id: CategoryFilter; label: string }[] = [
    { id: "all", label: "All Arenas" },
    { id: "reflex", label: "Reflex" },
    { id: "memory", label: "Memory" },
    { id: "speed", label: "Speed" },
    { id: "gaming", label: "Gaming" },
    { id: "accuracy", label: "Accuracy" },
    { id: "milestones", label: "Milestones" },
];

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
    reflex: "Reflex",
    memory: "Memory",
    speed: "Speed",
    gaming: "Gaming",
    accuracy: "Accuracy",
    milestones: "Milestone",
};

const TIER_STYLES: Record<
    AchievementTier,
    { label: string; emblem: string; accentText: string; barColor: string; unlockedBorder: string }
> = {
    bronze: {
        label: "Bronze",
        emblem: "bg-amber-50 border-amber-200 text-amber-700",
        accentText: "text-amber-700",
        barColor: "bg-amber-600",
        unlockedBorder: "border-amber-200",
    },
    silver: {
        label: "Silver",
        emblem: "bg-[#F3F1EB] border-[#D8D4C9] text-[#3F3E39]",
        accentText: "text-[#3F3E39]",
        barColor: "bg-slate-700",
        unlockedBorder: "border-[#D8D4C9]",
    },
    gold: {
        label: "Gold",
        emblem: "bg-yellow-50 border-yellow-300 text-amber-700",
        accentText: "text-amber-700",
        barColor: "bg-amber-500",
        unlockedBorder: "border-yellow-300",
    },
    platinum: {
        label: "Platinum",
        emblem: "bg-blue-50 border-blue-200 text-blue-700",
        accentText: "text-blue-700",
        barColor: "bg-blue-600",
        unlockedBorder: "border-blue-300",
    },
};

export default function AchievementsClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [items, setItems] = useState<AchievementProgress[]>(() =>
        Achievements.getAll().map((achievement) => ({
            achievement,
            unlocked: false,
            progressRatio: 0,
            currentLabel: "Not started",
        }))
    );
    const [xpProgress, setXpProgress] = useState<XPProgress | null>(null);
    const [totalSessions, setTotalSessions] = useState(0);
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [mounted, setMounted] = useState(false);

    const refreshData = useCallback(() => {
        // Retroactively unlock any badges already satisfied by saved high scores
        const newlySynced = Achievements.syncFromScores();
        if (newlySynced.length > 0) {
            const bonusXP = newlySynced.reduce((sum, b) => sum + (b.xpReward || 50), 0);
            XPSystem.awardAchievement(bonusXP);
        }

        setItems(Achievements.evaluateProgress());
        setXpProgress(XPSystem.getProgress());

        const history = ScoreHistory.getAll();
        const sessions = Object.values(history).reduce(
            (sum, entries) => sum + entries.filter((e) => e.eligible !== false).length,
            0
        );
        setTotalSessions(sessions);
    }, []);

    useEffect(() => {
        setMounted(true);
        refreshData();

        window.addEventListener("score_updated", refreshData);
        window.addEventListener("achievement_unlocked", refreshData);
        window.addEventListener("xp_updated", refreshData);
        return () => {
            window.removeEventListener("score_updated", refreshData);
            window.removeEventListener("achievement_unlocked", refreshData);
            window.removeEventListener("xp_updated", refreshData);
        };
    }, [refreshData]);

    const unlockedCount = useMemo(() => items.filter((i) => i.unlocked).length, [items]);
    const totalCount = items.length;
    const completionPct = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

    const earnedBadgeXP = useMemo(
        () =>
            items
                .filter((i) => i.unlocked)
                .reduce((sum, i) => sum + i.achievement.xpReward, 0),
        [items]
    );

    const arenasUnlocked = useMemo(() => {
        const set = new Set(
            items
                .filter((i) => i.unlocked && i.achievement.category !== "milestones")
                .map((i) => i.achievement.category)
        );
        return set.size;
    }, [items]);

    const categoryCounts = useMemo(() => {
        const counts: Record<CategoryFilter, { unlocked: number; total: number }> = {
            all: { unlocked: unlockedCount, total: totalCount },
            reflex: { unlocked: 0, total: 0 },
            memory: { unlocked: 0, total: 0 },
            speed: { unlocked: 0, total: 0 },
            gaming: { unlocked: 0, total: 0 },
            accuracy: { unlocked: 0, total: 0 },
            milestones: { unlocked: 0, total: 0 },
        };
        for (const item of items) {
            counts[item.achievement.category].total += 1;
            if (item.unlocked) counts[item.achievement.category].unlocked += 1;
        }
        return counts;
    }, [items, unlockedCount, totalCount]);

    const filteredItems = useMemo(() => {
        return items
            .filter((item) => {
                if (categoryFilter !== "all" && item.achievement.category !== categoryFilter) {
                    return false;
                }
                if (statusFilter === "unlocked" && !item.unlocked) return false;
                if (statusFilter === "locked" && item.unlocked) return false;
                return true;
            })
            .sort((a, b) => {
                // Earned badges first, then closest to unlocking
                if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
                return b.progressRatio - a.progressRatio;
            });
    }, [items, categoryFilter, statusFilter]);

    return (
        <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Editorial Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#D8D4C9] pb-8">
                    <div className="space-y-3 max-w-2xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            Performance Badges &amp; Milestones
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                            {t("achievements.heroTitle", "Achievements")}
                        </h1>
                        <p className="text-sm sm:text-base text-[#57554E] leading-relaxed">
                            Earn badges automatically as your personal bests cross target thresholds across Reflex, Memory, Speed, Gaming, and Accuracy benchmarks.
                        </p>
                    </div>
                    <Link
                        href={getLocalizedHref("/reflex/reaction")}
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold whitespace-nowrap shrink-0 transition-colors w-fit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2"
                    >
                        <Zap className="w-4 h-4" aria-hidden="true" />
                        <span>Run Benchmark</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                </header>

                {/* Unified KPI Strip & Completion Bar (Single Elevation, Hairline Dividers) */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E3DB]">
                        <div className="p-5 sm:p-6">
                            <p className="text-xs font-medium text-[#78756C]">
                                {t("achievements.totalUnlocked", "Badges Earned")}
                            </p>
                            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1">
                                {unlockedCount}
                                <span className="text-base font-medium text-[#78756C]">
                                    {" "}
                                    / {totalCount}
                                </span>
                            </p>
                            <p className="text-xs text-[#78756C] font-mono tabular-nums mt-1">
                                {completionPct}% collection complete
                            </p>
                        </div>

                        <div className="p-5 sm:p-6 border-l border-[#E6E3DB] lg:border-l-0">
                            <p className="text-xs font-medium text-[#78756C]">Badge XP Earned</p>
                            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1">
                                +{earnedBadgeXP}
                                <span className="text-sm font-semibold text-[#1E40AF] ml-1">XP</span>
                            </p>
                            <p className="text-xs text-[#78756C] mt-1">
                                {mounted && xpProgress
                                    ? `Level ${xpProgress.level} · ${xpProgress.rank.name}`
                                    : "Level 1 · Beginner"}
                            </p>
                        </div>

                        <div className="p-5 sm:p-6">
                            <p className="text-xs font-medium text-[#78756C]">Arenas Qualified</p>
                            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1">
                                {arenasUnlocked}
                                <span className="text-base font-medium text-[#78756C]"> / 5</span>
                            </p>
                            <p className="text-xs text-[#78756C] mt-1">
                                Reflex · Memory · Speed · Gaming · Accuracy
                            </p>
                        </div>

                        <div className="p-5 sm:p-6 border-l border-[#E6E3DB] lg:border-l-0">
                            <p className="text-xs font-medium text-[#78756C]">Eligible Sessions</p>
                            <p className="text-2xl sm:text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1">
                                {totalSessions}
                            </p>
                            <p className="text-xs text-[#78756C] mt-1">
                                Synced locally on this device
                            </p>
                        </div>
                    </div>

                    <div className="px-5 sm:px-6 py-4 bg-[#FAF9F6] border-t border-[#E6E3DB] flex items-center gap-4">
                        <span className="text-xs font-mono font-semibold text-[#3F3E39] whitespace-nowrap shrink-0 tabular-nums">
                            {completionPct}%
                        </span>
                        <div
                            className="flex-1 h-2 rounded-full bg-[#E6E3DB] overflow-hidden"
                            role="progressbar"
                            aria-label="Overall achievement completion"
                            aria-valuenow={completionPct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className="h-full bg-[#161614] rounded-full transition-all duration-300"
                                style={{ width: `${completionPct}%` }}
                            />
                        </div>
                        <span className="text-xs font-mono text-[#78756C] whitespace-nowrap shrink-0 tabular-nums">
                            {totalCount - unlockedCount} remaining
                        </span>
                    </div>
                </section>

                {/* Filter Controls Bar */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    {/* Arena Category Tabs */}
                    <div
                        className="flex items-center gap-1 p-1 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl overflow-x-auto"
                        role="tablist"
                        aria-label="Filter badges by arena"
                    >
                        {CATEGORY_TABS.map((tab) => {
                            const active = categoryFilter === tab.id;
                            const stat = categoryCounts[tab.id];
                            return (
                                <button
                                    key={tab.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => setCategoryFilter(tab.id)}
                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        active
                                            ? "bg-[#161614] text-[#FAF9F6]"
                                            : "text-[#57554E] hover:text-[#161614]"
                                    }`}
                                >
                                    {tab.label}{" "}
                                    <span className="font-mono opacity-75 tabular-nums ml-0.5">
                                        {stat.unlocked}/{stat.total}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Status Filter Segmented Control */}
                    <div
                        className="inline-flex items-center gap-1 p-1 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl w-fit shrink-0"
                        role="group"
                        aria-label="Filter badges by status"
                    >
                        {(
                            [
                                { id: "all", label: "All" },
                                { id: "unlocked", label: `Earned (${unlockedCount})` },
                                { id: "locked", label: `Locked (${totalCount - unlockedCount})` },
                            ] as const
                        ).map((opt) => {
                            const active = statusFilter === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => setStatusFilter(opt.id)}
                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        active
                                            ? "bg-[#161614] text-[#FAF9F6]"
                                            : "text-[#57554E] hover:text-[#161614]"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Badges Grid */}
                {filteredItems.length === 0 ? (
                    <section className="bg-white border border-[#E6E3DB] rounded-2xl p-10 text-center space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] flex items-center justify-center mx-auto">
                            <Trophy className="w-5 h-5 text-[#78756C]" aria-hidden="true" />
                        </div>
                        <div className="space-y-1 max-w-md mx-auto">
                            <h2 className="font-serif text-xl font-medium text-[#161614]">
                                {statusFilter === "unlocked"
                                    ? "No badges earned in this view yet"
                                    : "No badges match this filter"}
                            </h2>
                            <p className="text-sm text-[#57554E]">
                                {statusFilter === "unlocked"
                                    ? "Complete an eligible test session to start unlocking high-score badges automatically."
                                    : "Switch back to all badges to see available targets across every arena."}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                            <Link
                                href={getLocalizedHref("/reflex/reaction")}
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <Zap className="w-4 h-4" aria-hidden="true" />
                                <span>Start Reaction Test</span>
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setCategoryFilter("all");
                                    setStatusFilter("all");
                                }}
                                className="cursor-pointer inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] text-sm font-semibold transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                                <span>Reset filters</span>
                            </button>
                        </div>
                    </section>
                ) : (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        {filteredItems.map((item) => {
                            const { achievement, unlocked, unlockedAt, progressRatio, currentLabel } =
                                item;
                            const tier = TIER_STYLES[achievement.tier];
                            const pct = Math.round(progressRatio * 100);

                            return (
                                <article
                                    key={achievement.id}
                                    className="border-r border-b border-[#E6E3DB] p-6 flex flex-col justify-between gap-5 hover:bg-[#FAF9F6]/60 transition-colors"
                                >
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div
                                                className={`w-10 h-10 rounded-lg border flex items-center justify-center shrink-0 ${
                                                    unlocked
                                                        ? "bg-[#161614] border-[#161614] text-[#FAF9F6]"
                                                        : "bg-[#FAF9F6] border-[#E6E3DB] text-[#78756C]"
                                                }`}
                                            >
                                                <AchievementIcon
                                                    name={achievement.iconName}
                                                    className="w-4 h-4"
                                                />
                                            </div>

                                            <div className="flex flex-col items-end gap-1 text-right">
                                                <div className="flex items-center gap-1.5 text-[11px] font-mono font-semibold text-[#78756C] tabular-nums">
                                                    <span className={unlocked ? "text-[#161614]" : "text-[#78756C]"}>
                                                        {tier.label}
                                                    </span>
                                                    <span aria-hidden="true">·</span>
                                                    <span>{CATEGORY_LABELS[achievement.category]}</span>
                                                    <span aria-hidden="true">·</span>
                                                    <span>+{achievement.xpReward} XP</span>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                        unlocked ? "text-emerald-700" : "text-[#78756C]"
                                                    }`}
                                                >
                                                    {unlocked ? (
                                                        <>
                                                            <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                            <span>Earned</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                                                            <span>Locked</span>
                                                        </>
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div>
                                            <h2 className="text-base font-semibold tracking-tight text-[#161614]">
                                                {achievement.name}
                                            </h2>
                                            <p className="text-sm text-[#57554E] mt-1 leading-relaxed">
                                                {achievement.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t border-[#F0EDE6]">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center justify-between gap-2 text-xs font-mono tabular-nums">
                                                <span className="text-[#57554E] truncate">
                                                    {currentLabel}
                                                </span>
                                                <span className="text-[#78756C] shrink-0">
                                                    Goal: {achievement.targetLabel}
                                                </span>
                                            </div>
                                            <div
                                                className="w-full h-1.5 rounded-full bg-[#F0EDE6] overflow-hidden"
                                                role="progressbar"
                                                aria-label={`${achievement.name} progress`}
                                                aria-valuenow={pct}
                                                aria-valuemin={0}
                                                aria-valuemax={100}
                                            >
                                                <div
                                                    className={`h-full rounded-full transition-all duration-300 ${
                                                        unlocked ? "bg-emerald-700" : "bg-[#161614]"
                                                    }`}
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between gap-2">
                                            {unlocked ? (
                                                <p className="text-xs font-mono text-[#78756C] tabular-nums">
                                                    {unlockedAt
                                                        ? `Unlocked ${new Date(unlockedAt).toLocaleDateString()}`
                                                        : "Unlocked"}
                                                </p>
                                            ) : (
                                                <p className="text-xs font-mono text-[#78756C] tabular-nums">
                                                    {pct}% to target
                                                </p>
                                            )}

                                            <Link
                                                href={getLocalizedHref(achievement.recommendedHref)}
                                                className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors whitespace-nowrap shrink-0"
                                            >
                                                <span>{unlocked ? "Practice again" : "Attempt tool"}</span>
                                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </section>
                )}

                {/* Explainer Section */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                        How Badges Work
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 text-sm text-[#57554E] leading-relaxed">
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-[#161614]">
                                Automatic High-Score Unlocks
                            </h3>
                            <p>
                                Every eligible benchmark updates your progress toward matching badges—like earning Speedster under 200 ms or Memory Master at level 10—and triggers an instant notification.
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-[#161614]">
                                Tiered XP Rewards
                            </h3>
                            <p>
                                Bronze (+25 XP), Silver (+50 XP), Gold (+100 XP), and Platinum (+200 XP) badges feed directly into your Reflextry level and rank progression.
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-[#161614]">
                                Local &amp; Permanent
                            </h3>
                            <p>
                                Your badge unlocks stay saved locally in your browser alongside your personal bests and history without requiring an account.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
