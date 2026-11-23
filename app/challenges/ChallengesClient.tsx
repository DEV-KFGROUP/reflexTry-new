"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Flame, Trophy, Target, ArrowRight, CheckCircle2 } from "lucide-react";
import { DailyChallenge } from "@/utils/dailyChallenge";
import { TOOL_MAPPING } from "@/config/tool-mapping";
import { useTranslation } from "@/lib/i18n/context";

export default function ChallengesClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [challenge, setChallenge] = useState<DailyChallenge | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        const todayChallenge = DailyChallenge.getToday();
        setChallenge(todayChallenge);
        setIsCompleted(DailyChallenge.isCompleted());
        setStreak(DailyChallenge.getStreak());
    }, []);

    if (!challenge) {
        return (
            <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
                <div className="max-w-4xl mx-auto space-y-8">
                    <header className="space-y-3 border-b border-[#D8D4C9] pb-8">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            Daily Routine
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614]">
                            {t("challenges.heroTitle", "Daily Challenge")}
                        </h1>
                        <p className="text-sm sm:text-base text-[#57554E] max-w-2xl leading-relaxed">
                            {t(
                                "challenges.heroSubtitle",
                                "Complete today's target benchmark to build your daily streak. Challenges reset at midnight in your local timezone."
                            )}
                        </p>
                    </header>
                    <div className="bg-white border border-[#E6E3DB] rounded-2xl p-8 text-center">
                        <p className="text-sm text-[#78756C]">Loading today&apos;s challenge...</p>
                    </div>
                </div>
            </div>
        );
    }

    const toolPath = TOOL_MAPPING[challenge.toolId] || `/${challenge.toolId}`;
    const formattedDate = new Date(`${challenge.date}T00:00:00`).toLocaleDateString(undefined, {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Editorial Header */}
                <header className="space-y-3 border-b border-[#D8D4C9] pb-8">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                        Daily Routine
                    </p>
                    <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614]">
                        {t("challenges.heroTitle", "Daily Challenge")}
                    </h1>
                    <p className="text-sm sm:text-base text-[#57554E] max-w-2xl leading-relaxed">
                        {t(
                            "challenges.heroSubtitle",
                            "Complete today's target benchmark to build your daily streak. Challenges reset at midnight in your local timezone."
                        )}
                    </p>
                </header>

                {/* Streak Banner */}
                {streak > 0 && (
                    <section className="bg-[#F3F1EB] border border-[#D8D4C9] rounded-2xl p-5 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-lg bg-white border border-[#E6E3DB] flex items-center justify-center shrink-0">
                                <Flame className="w-5 h-5 text-amber-700" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                    {t("challenges.streak", "Active Streak")}
                                </p>
                                <p className="text-sm text-[#3F3E39]">
                                    Keep completing daily goals to maintain your streak.
                                </p>
                            </div>
                        </div>
                        <div className="text-right font-mono tabular-nums shrink-0">
                            <span className="text-3xl font-bold text-[#161614]">{streak}</span>{" "}
                            <span className="text-xs font-semibold uppercase text-[#78756C]">
                                {t("challenges.days", "days")}
                            </span>
                        </div>
                    </section>
                )}

                {/* Today's Mission Card */}
                <section
                    className={`bg-white border rounded-2xl p-6 sm:p-8 space-y-6 ${
                        isCompleted ? "border-emerald-300" : "border-[#E6E3DB]"
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F0EDE6]">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs font-mono text-[#78756C]">
                                <Calendar className="w-3.5 h-3.5 text-[#57554E]" aria-hidden="true" />
                                <span>{formattedDate}</span>
                            </div>
                            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] capitalize">
                                {t(`tools.${challenge.toolId}.title`, challenge.toolId.replace(/-/g, " "))}
                            </h2>
                        </div>

                        {isCompleted ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 self-start sm:self-auto">
                                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                                <span>Completed</span>
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#57554E] self-start sm:self-auto">
                                <Target className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
                                <span>{t("challenges.todayChallenge", "Today's Goal")}</span>
                            </span>
                        )}
                    </div>

                    <p className="text-base text-[#3F3E39] leading-relaxed">
                        {challenge.description}
                    </p>

                    {/* Target & Reward Strip */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-5">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                {t("challenges.target", "Target Threshold")}
                            </p>
                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1.5">
                                {challenge.unit === "ms" ? "≤ " : "≥ "}
                                {challenge.target}{" "}
                                <span className="text-base font-medium text-[#78756C] uppercase">
                                    {challenge.unit}
                                </span>
                            </p>
                        </div>

                        <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-5 flex items-start gap-3">
                            <div className="w-9 h-9 rounded-lg bg-white border border-[#E6E3DB] flex items-center justify-center shrink-0 mt-0.5">
                                <Trophy className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                            </div>
                            <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                    {t("challenges.streakReward", "Completion Reward")}
                                </p>
                                <p className="text-sm font-semibold text-[#161614] mt-1.5">
                                    +100 XP &amp; Daily Streak Credit
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Primary CTA or Completion Message */}
                    {!isCompleted ? (
                        <Link
                            href={getLocalizedHref(toolPath)}
                            className="w-full min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2"
                        >
                            <span>{t("challenges.startChallenge", "Start Today's Challenge")}</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    ) : (
                        <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <p className="text-base font-semibold text-emerald-900">
                                    {t("challenges.completed", "Challenge Complete")}
                                </p>
                                <p className="text-sm text-emerald-800 mt-0.5">
                                    You&apos;ve earned today&apos;s XP reward. Check back tomorrow for the next benchmark.
                                </p>
                            </div>
                            <Link
                                href={getLocalizedHref("/statistics")}
                                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-900 hover:text-emerald-950 underline underline-offset-4 shrink-0"
                            >
                                <span>View statistics</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        </div>
                    )}
                </section>

                {/* Editorial Context */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                        How Daily Challenges Work
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-[#57554E] leading-relaxed">
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">Deterministic Daily Rotation</h3>
                            <p>
                                Each calendar day rotates across core Reflex, Memory, and Speed benchmarks so you practice multiple cognitive skills instead of repeating only one drill.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">Short, Consistent Practice</h3>
                            <p>
                                A focused 5-to-10 minute daily session provides cleaner session-to-session trend data on your Statistics page than occasional marathon sessions.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
