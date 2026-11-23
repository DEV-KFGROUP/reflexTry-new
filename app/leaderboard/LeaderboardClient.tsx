"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
    Trophy,
    ArrowRight,
    Globe,
    User,
    Activity,
    Brain,
    Hash,
    Zap,
    Keyboard,
    MousePointer2,
    Info,
} from "lucide-react";
import { Storage, Score } from "@/utils/storage";
import { db, LeaderboardEntry } from "@/lib/database";
import { ShareButton } from "@/components/ShareButton";
import { useTranslation } from "@/lib/i18n/context";

const TOOLS = [
    { id: "reaction-time", label: "Reaction Time", category: "Reflex", path: "/reflex/reaction", icon: Zap },
    { id: "sequence-memory", label: "Sequence Memory", category: "Memory", path: "/memory/sequence", icon: Brain },
    { id: "number-memory", label: "Number Memory", category: "Memory", path: "/memory/number", icon: Hash },
    { id: "typing-speed", label: "Typing Speed", category: "Speed", path: "/speed/typing", icon: Keyboard },
    { id: "cps-test", label: "Click Speed", category: "Speed", path: "/speed/click", icon: MousePointer2 },
];

export default function LeaderboardClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [scores, setScores] = useState<Record<string, Score | null>>({});
    const [globalLeaderboards, setGlobalLeaderboards] = useState<Record<string, LeaderboardEntry[]>>({});
    const [viewMode, setViewMode] = useState<"local" | "global">("local");
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadedScores: Record<string, Score | null> = {};
        TOOLS.forEach((tool) => {
            loadedScores[tool.id] = Storage.getScore(tool.id);
        });
        setScores(loadedScores);

        const loadGlobal = async () => {
            const leaderboards: Record<string, LeaderboardEntry[]> = {};
            for (const tool of TOOLS) {
                leaderboards[tool.id] = await db.getLeaderboard(tool.id, 10);
            }
            setGlobalLeaderboards(leaderboards);
            setIsLoaded(true);
        };
        loadGlobal();
    }, []);

    return (
        <div className="bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-10">
                {/* Editorial Header + View Mode Switch */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D8D4C9]">
                    <div className="space-y-3 max-w-2xl">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            Benchmarks &amp; Rankings
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614]">
                            {t("leaderboard.heroTitle", "Leaderboard")}
                        </h1>
                        <p className="text-sm sm:text-base text-[#57554E] leading-relaxed">
                            {t(
                                "leaderboard.heroSubtitle",
                                "Compare your personal records saved on this device alongside community rankings across core Reflextry benchmarks."
                            )}
                        </p>
                    </div>

                    {/* Segmented Mode Tabs */}
                    <div
                        role="tablist"
                        aria-label="Leaderboard view mode"
                        className="inline-flex p-1 bg-[#F3F1EB] rounded-xl border border-[#E6E3DB] self-start md:self-auto"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "local"}
                            onClick={() => setViewMode("local")}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === "local"
                                    ? "bg-[#161614] text-[#FAF9F6]"
                                    : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            <User className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t("leaderboard.myScores", "My Scores")}</span>
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={viewMode === "global"}
                            onClick={() => setViewMode("global")}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                                viewMode === "global"
                                    ? "bg-[#161614] text-[#FAF9F6]"
                                    : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>{t("leaderboard.global", "Global")}</span>
                        </button>
                    </div>
                </header>

                {/* Local Personal Bests */}
                {viewMode === "local" ? (
                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        {TOOLS.map((tool) => {
                            const score = scores[tool.id];
                            const ToolIcon = tool.icon;
                            return (
                                <div
                                    key={tool.id}
                                    className="border-r border-b border-[#E6E3DB] p-6 flex flex-col justify-between min-h-[210px] hover:bg-[#FAF9F6]/60 transition-colors"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-[#FAF9F6] border border-[#E6E3DB] flex items-center justify-center shrink-0">
                                                <ToolIcon className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-semibold text-[#161614]">
                                                    {t(`tools.${tool.id}.title`, tool.label)}
                                                </h2>
                                                <p className="text-xs text-[#78756C]">{tool.category}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {score ? (
                                        <div className="py-5">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                                {t("leaderboard.personalBests", "Personal Best")}
                                            </p>
                                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums mt-1">
                                                {score.value.toLocaleString()}{" "}
                                                <span className="text-sm font-medium text-[#78756C]">
                                                    {score.unit}
                                                </span>
                                            </p>
                                            {score.playerName && (
                                                <p className="text-xs text-[#78756C] mt-1">
                                                    Player: <span className="font-medium text-[#3F3E39]">{score.playerName}</span>
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-6 flex items-center gap-2.5 text-[#78756C]">
                                            <Activity className="w-4 h-4" aria-hidden="true" />
                                            <span className="text-sm">
                                                {t("leaderboard.noScoresYet", "No recorded score yet")}
                                            </span>
                                        </div>
                                    )}

                                    <div className="pt-4 border-t border-[#F0EDE6] flex items-center justify-between gap-2">
                                        <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                            {score ? new Date(score.timestamp).toLocaleDateString() : "—"}
                                        </span>
                                        <Link
                                            href={getLocalizedHref(tool.path)}
                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors"
                                        >
                                            <span>{t("leaderboard.testNow", "Play benchmark")}</span>
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                ) : (
                    /* Global Rankings */
                    <section className="space-y-6">
                        {TOOLS.map((tool) => {
                            const entries = globalLeaderboards[tool.id] || [];
                            const ToolIcon = tool.icon;
                            return (
                                <div
                                    key={tool.id}
                                    className="bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden"
                                >
                                    <div className="px-6 py-4 border-b border-[#E6E3DB] flex items-center justify-between gap-4 bg-[#FAF9F6]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-white border border-[#E6E3DB] flex items-center justify-center shrink-0">
                                                <ToolIcon className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                            </div>
                                            <div>
                                                <h2 className="text-base font-semibold text-[#161614]">
                                                    {t(`tools.${tool.id}.title`, tool.label)}
                                                </h2>
                                                <p className="text-xs text-[#78756C]">Top 10 recorded entries</p>
                                            </div>
                                        </div>
                                        <Link
                                            href={getLocalizedHref(tool.path)}
                                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors"
                                        >
                                            <span>Play</span>
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>

                                    {!isLoaded ? (
                                        <div className="py-10 text-center text-sm text-[#78756C]">
                                            Loading rankings...
                                        </div>
                                    ) : entries.length > 0 ? (
                                        <div className="divide-y divide-[#F0EDE6]">
                                            {entries.slice(0, 10).map((entry, index) => (
                                                <div
                                                    key={entry.id}
                                                    className="px-6 py-3.5 flex items-center justify-between gap-4 hover:bg-[#FAF9F6] transition-colors"
                                                >
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <span
                                                            className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs tabular-nums shrink-0 ${
                                                                index === 0
                                                                    ? "bg-[#161614] text-[#FAF9F6]"
                                                                    : "text-[#57554E] bg-[#FAF9F6] border border-[#E6E3DB]"
                                                            }`}
                                                        >
                                                            #{index + 1}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-semibold text-[#161614] truncate">
                                                                {entry.username || "Anonymous"}
                                                            </p>
                                                            <p className="text-xs font-mono text-[#78756C] tabular-nums">
                                                                {new Date(entry.timestamp).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right font-mono tabular-nums shrink-0">
                                                        <span className="text-base font-bold text-[#161614]">
                                                            {entry.score.toLocaleString()}
                                                        </span>{" "}
                                                        <span className="text-xs text-[#78756C]">{entry.unit}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="py-10 px-6 text-center space-y-2">
                                            <Trophy className="w-6 h-6 text-[#D8D4C9] mx-auto" aria-hidden="true" />
                                            <p className="text-sm text-[#78756C]">
                                                {t("leaderboard.noScoresYet", "No global entries recorded yet.")}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </section>
                )}

                {/* Storage Disclosure & Share */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-3 max-w-2xl">
                        <Info className="w-4 h-4 text-[#57554E] shrink-0 mt-0.5" aria-hidden="true" />
                        <p className="text-xs sm:text-sm text-[#57554E] leading-relaxed">
                            {viewMode === "local"
                                ? "Local scores are stored directly in your browser on this device. Clearing site data will reset local records."
                                : "Global rankings display submitted benchmark entries. Hardware refresh rate and input devices affect raw millisecond results."}
                        </p>
                    </div>
                    <div className="shrink-0">
                        <ShareButton text="Check out my benchmark scores on Reflextry!" />
                    </div>
                </section>

                {/* Editorial Context */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
                    <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                        How the Reflextry Leaderboard Works
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-[#57554E] leading-relaxed">
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">Local vs. Global Rankings</h3>
                            <p>
                                Your Local view serves as a private benchmark log saved in your browser so you can track personal records without creating an account. Global view shows submitted community records for the core benchmarks.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">Fair Play &amp; Hardware Context</h3>
                            <p>
                                Monitor refresh rate (60Hz vs. 240Hz), mouse polling rate, and touchscreen latency measurably affect reaction speed. Always compare your own results using the same device and setup.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
