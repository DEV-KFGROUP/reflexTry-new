"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
    TrendingUp,
    TrendingDown,
    Minus,
    Trophy,
    Activity,
    BarChart3,
    Download,
    Clock,
    ArrowRight,
    Play,
    Timer,
    CheckCircle2,
} from "lucide-react";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
} from "recharts";
import { ScoreHistory, ScoreHistoryEntry } from "@/utils/scoreHistory";
import { Storage } from "@/utils/storage";
import {
    DeepWorkLog,
    DEEP_WORK_EVENT,
    formatDurationHuman,
    type DeepWorkSession,
    type DeepWorkStats,
} from "@/utils/deepWork";
import { TOOL_MAPPING } from "@/config/tool-mapping";
import { Button } from "@/components/ui/Button";
import { ShareButton } from "@/components/ShareButton";
import { ToolIcon } from "@/components/ToolIcon";
import { useTranslation } from "@/lib/i18n/context";

export default function StatisticsClient() {
    const { t, getLocalizedHref } = useTranslation();
    const [history, setHistory] = useState<Record<string, ScoreHistoryEntry[]>>({});
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    const [deepWorkSessions, setDeepWorkSessions] = useState<DeepWorkSession[]>([]);
    const [deepWorkStats, setDeepWorkStats] = useState<DeepWorkStats>(() => ({
        totalSessions: 0,
        completedSessions: 0,
        totalSeconds: 0,
        todaySeconds: 0,
        averageMinutes: 0,
        longestMinutes: 0,
        dailySeries: [],
    }));

    const loadAllData = useCallback(() => {
        const loaded = ScoreHistory.getAll();
        setHistory(loaded);

        setDeepWorkSessions(DeepWorkLog.getSessions().slice().reverse());
        setDeepWorkStats(DeepWorkLog.getStats());

        setSelectedTool((current) => {
            if (current && loaded[current]?.length) return current;
            const toolEntries = Object.entries(loaded)
                .filter(([, entries]) => entries.length > 0)
                .sort((a, b) => {
                    const aLast = a[1][a[1].length - 1]?.timestamp ?? 0;
                    const bLast = b[1][b[1].length - 1]?.timestamp ?? 0;
                    return bLast - aLast;
                });
            return toolEntries.length > 0 ? toolEntries[0][0] : null;
        });
    }, []);

    useEffect(() => {
        loadAllData();
        window.addEventListener("score_updated", loadAllData);
        window.addEventListener(DEEP_WORK_EVENT, loadAllData);
        return () => {
            window.removeEventListener("score_updated", loadAllData);
            window.removeEventListener(DEEP_WORK_EVENT, loadAllData);
        };
    }, [loadAllData]);

    const tools = useMemo(
        () => Object.keys(history).filter((key) => history[key].length > 0),
        [history]
    );

    const totalGames = useMemo(
        () => Object.values(history).reduce((sum, entries) => sum + entries.length, 0),
        [history]
    );

    const totalPracticeSeconds = useMemo(() => {
        const benchmarkSeconds = Object.values(history)
            .flat()
            .reduce((sum, entry) => sum + (entry.duration || 0), 0);
        return benchmarkSeconds + deepWorkStats.totalSeconds;
    }, [history, deepWorkStats.totalSeconds]);

    const activeToolId =
        selectedTool && tools.includes(selectedTool) ? selectedTool : tools[0] ?? null;

    const activeStats = useMemo(() => {
        if (!activeToolId || !history[activeToolId]) return null;
        return ScoreHistory.getStats(activeToolId);
    }, [activeToolId, history]);

    const chartData = useMemo(() => {
        if (!activeToolId || !activeStats) return [];
        const entries = (history[activeToolId] || []).filter(
            (e) => e.eligible !== false && e.configuration === activeStats.configuration
        );
        return entries.slice(-30).map((entry, idx) => ({
            attempt: `#${idx + 1}`,
            value: Number(entry.value.toFixed(1)),
            dateLabel: new Date(entry.timestamp).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
            }),
            unit: entry.unit,
        }));
    }, [activeToolId, activeStats, history]);

    const hasExportableData = tools.length > 0 || deepWorkSessions.length > 0;

    const handleExport = () => {
        const data = {
            history,
            highScores: {} as Record<string, unknown>,
            deepWorkSessions,
            deepWorkSummary: {
                totalSessions: deepWorkStats.totalSessions,
                completedSessions: deepWorkStats.completedSessions,
                totalSeconds: deepWorkStats.totalSeconds,
            },
            exportedAt: new Date().toISOString(),
        };

        tools.forEach((toolId) => {
            const score = Storage.getScore(toolId);
            if (score) {
                data.highScores[toolId] = score;
            }
        });

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `reflextry-statistics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="bg-[#FAF9F6] text-[#161614] py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Editorial Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E6E3DB]">
                    <div className="space-y-2 max-w-2xl">
                        <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
                            Performance Analytics
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight text-[#161614]">
                            {t("statistics.heroTitle", "Your Statistics")}
                        </h1>
                        <p className="text-sm sm:text-base text-[#4A4842] leading-relaxed">
                            {t(
                                "statistics.heroSubtitle",
                                "Track your recorded sessions, deep work Pomodoro focus blocks, and comparable performance trends."
                            )}
                        </p>
                    </div>

                    {hasExportableData && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="self-start md:self-auto"
                        >
                            <Download className="w-4 h-4" aria-hidden="true" />
                            <span>{t("statistics.downloadData", "Export JSON")}</span>
                        </Button>
                    )}
                </header>

                {/* Primary 4-Column KPI Summary Strip */}
                <section
                    aria-label="Session summary"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                >
                    <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A675F]">
                                {t("statistics.totalSessions", "Benchmark Runs")}
                            </p>
                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums">
                                {totalGames.toLocaleString()}
                            </p>
                            <p className="text-xs text-[#6A675F] font-mono tabular-nums">
                                {tools.length} tools practiced
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0">
                            <Activity className="w-5 h-5 text-[#1E40AF]" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A675F]">
                                Deep Work Logged
                            </p>
                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums">
                                {formatDurationHuman(deepWorkStats.totalSeconds)}
                            </p>
                            <p className="text-xs text-[#6A675F] font-mono tabular-nums">
                                {deepWorkStats.totalSessions} focus{" "}
                                {deepWorkStats.totalSessions === 1 ? "session" : "sessions"}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0">
                            <Timer className="w-5 h-5 text-[#1E40AF]" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A675F]">
                                Today&apos;s Focus
                            </p>
                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums">
                                {formatDurationHuman(deepWorkStats.todaySeconds)}
                            </p>
                            <p className="text-xs text-[#6A675F] font-mono tabular-nums">
                                {deepWorkStats.completedSessions} full blocks completed
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0">
                            <Trophy className="w-5 h-5 text-[#B45309]" aria-hidden="true" />
                        </div>
                    </div>

                    <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-xs font-semibold uppercase tracking-wider text-[#6A675F]">
                                Total Practice Time
                            </p>
                            <p className="text-3xl font-mono font-bold text-[#161614] tabular-nums">
                                {formatDurationHuman(totalPracticeSeconds)}
                            </p>
                            <p className="text-xs text-[#6A675F]">
                                Benchmarks + deep work
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0">
                            <Clock className="w-5 h-5 text-[#047857]" aria-hidden="true" />
                        </div>
                    </div>
                </section>

                {/* Deep Work Pomodoro Analytics Section */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-[#E6E3DB]">
                        <div className="space-y-1">
                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1E40AF]">
                                Deep Work Log
                            </p>
                            <h2 className="font-serif text-2xl font-semibold text-[#161614] tracking-tight">
                                Pomodoro Focus Sessions
                            </h2>
                            <p className="text-sm text-[#4A4842]">
                                Start the timer in the top header on any page to track active deep work intervals automatically.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#4A4842] tabular-nums">
                            <span>Avg block: {deepWorkStats.averageMinutes} min</span>
                            <span aria-hidden="true">·</span>
                            <span>Longest: {deepWorkStats.longestMinutes} min</span>
                        </div>
                    </div>

                    {deepWorkSessions.length === 0 ? (
                        <div className="py-8 px-4 text-center bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl space-y-2">
                            <Timer className="w-6 h-6 text-[#6A675F] mx-auto" aria-hidden="true" />
                            <h3 className="text-sm font-semibold text-[#161614]">
                                No deep work sessions logged yet
                            </h3>
                            <p className="text-xs sm:text-sm text-[#57554E] max-w-md mx-auto">
                                Open the Pomodoro timer in the top header and click Start Deep Work. Your completed blocks and early-logged sessions will chart here automatically.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                            {/* 7-Day Focus Minutes Chart */}
                            <div className="lg:col-span-2 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-[#161614]">
                                        Last 7 Days (Minutes)
                                    </h3>
                                    <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                        {deepWorkStats.totalSessions} total
                                    </span>
                                </div>
                                <div className="w-full h-56">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={deepWorkStats.dailySeries}
                                            margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                                        >
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#E2E8F0"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="label"
                                                tick={{ fill: "#64748B", fontSize: 12 }}
                                                axisLine={{ stroke: "#CBD5E1" }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: "#64748B", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                allowDecimals={false}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#FFFFFF",
                                                    borderColor: "#E2E8F0",
                                                    borderRadius: "0.75rem",
                                                    fontSize: "12px",
                                                    color: "#0F172A",
                                                    boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                                                }}
                                                formatter={(value: unknown) => [
                                                    `${Number(value).toFixed(1)} min`,
                                                    "Deep Work",
                                                ]}
                                            />
                                            <Bar
                                                dataKey="minutes"
                                                fill="#2563EB"
                                                radius={[6, 6, 0, 0]}
                                                maxBarSize={36}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Deep Work Sessions Table */}
                            <div className="lg:col-span-3 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-[#161614]">
                                        Recent Focus Blocks
                                    </h3>
                                    <span className="text-xs text-[#78756C]">
                                        Showing latest {Math.min(8, deepWorkSessions.length)}
                                    </span>
                                </div>
                                <div className="overflow-x-auto border border-[#E6E3DB] rounded-xl">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-[#E6E3DB] bg-[#FAF9F6] text-[11px] font-semibold uppercase tracking-wider text-[#78756C]">
                                                <th className="py-2.5 px-3.5">Focus Block</th>
                                                <th className="py-2.5 px-3.5">Date</th>
                                                <th className="py-2.5 px-3.5 text-right">Duration</th>
                                                <th className="py-2.5 px-3.5 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#EFECE4] text-sm">
                                            {deepWorkSessions.slice(0, 8).map((session) => (
                                                <tr
                                                    key={session.id}
                                                    className="hover:bg-[#FAF9F6]/70 transition-colors"
                                                >
                                                    <td className="py-2.5 px-3.5">
                                                        <div className="font-semibold text-[#161614] truncate max-w-[200px]">
                                                            {session.label}
                                                        </div>
                                                        {session.pagesVisited.length > 0 && (
                                                            <div className="text-xs font-mono text-[#78756C] truncate max-w-[220px]">
                                                                {session.pagesVisited.slice(0, 2).join(", ")}
                                                                {session.pagesVisited.length > 2
                                                                    ? ` +${session.pagesVisited.length - 2}`
                                                                    : ""}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-xs font-mono text-[#78756C] whitespace-nowrap tabular-nums">
                                                        {new Date(session.endedAt).toLocaleDateString(
                                                            undefined,
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}{" "}
                                                        ·{" "}
                                                        {new Date(session.endedAt).toLocaleTimeString(
                                                            undefined,
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-right font-mono font-semibold text-[#161614] whitespace-nowrap tabular-nums">
                                                        {formatDurationHuman(session.durationSec)}
                                                    </td>
                                                    <td className="py-2.5 px-3.5 text-right whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-xs font-medium ${
                                                                session.completed
                                                                    ? "text-emerald-700"
                                                                    : "text-[#57554E]"
                                                            }`}
                                                        >
                                                            {session.completed && (
                                                                <CheckCircle2
                                                                    className="w-3.5 h-3.5"
                                                                    aria-hidden="true"
                                                                />
                                                            )}
                                                            <span>
                                                                {session.completed
                                                                    ? "Completed"
                                                                    : "Logged"}
                                                            </span>
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Benchmark Empty State OR Interactive Trend Chart + Tool Cards */}
                {tools.length === 0 ? (
                    <section className="bg-white border border-[#E6E3DB] rounded-2xl p-10 sm:p-14 text-center space-y-5">
                        <div className="w-12 h-12 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center mx-auto">
                            <BarChart3 className="w-6 h-6 text-[#6A675F]" aria-hidden="true" />
                        </div>
                        <div className="space-y-2 max-w-md mx-auto">
                            <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                                No benchmark scores recorded yet
                            </h2>
                            <p className="text-sm text-[#4A4842] leading-relaxed">
                                {t(
                                    "statistics.noData",
                                    "Complete any benchmark to save your local baseline. Your score history and trend charts will appear here automatically."
                                )}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                            <Link
                                href={getLocalizedHref("/reflex/reaction")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <Play className="w-4 h-4" aria-hidden="true" />
                                <span>Start Reaction Test</span>
                            </Link>
                            <Link
                                href={getLocalizedHref("/tools")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D8D4C9] hover:bg-[#F3F1EB] text-[#161614] text-sm font-semibold transition-colors"
                            >
                                <span>Browse All Tools</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                        </div>
                    </section>
                ) : (
                    <>
                        {/* Interactive Recharts Trend Panel */}
                        {activeToolId && activeStats && (
                            <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-[#E6E3DB]">
                                    <div className="flex items-start gap-4">
                                        <ToolIcon
                                            toolId={activeToolId}
                                            variant="3d-pedestal"
                                            size="md"
                                            interactive
                                        />
                                        <div className="space-y-1">
                                            <p className="text-xs font-mono font-semibold uppercase tracking-wider text-[#1E40AF]">
                                                Selected Benchmark Trend
                                            </p>
                                            <h2 className="font-serif text-2xl font-semibold text-[#161614] capitalize">
                                                {t(
                                                    `tools.${activeToolId}.title`,
                                                    activeToolId.replace(/-/g, " ")
                                                )}
                                            </h2>
                                            <p className="text-xs font-mono text-[#6A675F]">
                                                Setup: {activeStats.difficulty || "standard"} ·{" "}
                                                {activeStats.inputMethod || "browser"} · {activeStats.unit} (
                                                {activeStats.higherIsBetter
                                                    ? "higher is better"
                                                    : "lower is better"}
                                                )
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="px-4 py-2 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB]">
                                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6A675F]">
                                                Personal Best
                                            </div>
                                            <div className="text-lg font-mono font-bold text-[#1E40AF] tabular-nums">
                                                {activeStats.best.toLocaleString()} {activeStats.unit}
                                            </div>
                                        </div>
                                        <div className="px-4 py-2 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB]">
                                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#6A675F]">
                                                Average
                                            </div>
                                            <div className="text-lg font-mono font-bold text-[#161614] tabular-nums">
                                                {Math.round(activeStats.average).toLocaleString()}{" "}
                                                {activeStats.unit}
                                            </div>
                                        </div>
                                        <Link
                                            href={getLocalizedHref(
                                                TOOL_MAPPING[activeToolId] || "/tools"
                                            )}
                                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold transition-colors"
                                        >
                                            <span>Run Again</span>
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>

                                <div className="w-full h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart
                                            data={chartData}
                                            margin={{ top: 10, right: 16, left: 0, bottom: 4 }}
                                        >
                                            <defs>
                                                <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                                                    <stop
                                                        offset="5%"
                                                        stopColor="#2563EB"
                                                        stopOpacity={0.18}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="#2563EB"
                                                        stopOpacity={0.01}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#E2E8F0"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="attempt"
                                                tick={{ fill: "#64748B", fontSize: 12 }}
                                                axisLine={{ stroke: "#CBD5E1" }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fill: "#64748B", fontSize: 12 }}
                                                axisLine={false}
                                                tickLine={false}
                                                width={52}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#FFFFFF",
                                                    borderColor: "#E2E8F0",
                                                    borderRadius: "0.75rem",
                                                    fontSize: "12px",
                                                    color: "#0F172A",
                                                    boxShadow:
                                                        "0 10px 25px -5px rgba(15, 23, 42, 0.08)",
                                                }}
                                                formatter={(value: unknown) => [
                                                    `${Number(value).toLocaleString()} ${activeStats.unit}`,
                                                    "Score",
                                                ]}
                                                labelFormatter={(_, payload) => {
                                                    const first = payload?.[0]?.payload as
                                                        | { attempt?: string; dateLabel?: string }
                                                        | undefined;
                                                    return first
                                                        ? `Attempt ${first.attempt} · ${first.dateLabel}`
                                                        : "";
                                                }}
                                            />
                                            <ReferenceLine
                                                y={activeStats.best}
                                                stroke="#059669"
                                                strokeDasharray="4 4"
                                                label={{
                                                    value: `Best: ${activeStats.best}`,
                                                    position: "insideTopRight",
                                                    fill: "#047857",
                                                    fontSize: 11,
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#2563EB"
                                                strokeWidth={2.25}
                                                fill="url(#scoreFill)"
                                                dot={{ r: 3.5, fill: "#2563EB", strokeWidth: 0 }}
                                                activeDot={{
                                                    r: 5.5,
                                                    fill: "#1D4ED8",
                                                    stroke: "#FFFFFF",
                                                    strokeWidth: 2,
                                                }}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>

                                {chartData.length < 2 && (
                                    <p className="text-xs text-[#78756C]">
                                        Complete at least 2 comparable sessions on this setup to visualize a multi-point trend curve.
                                    </p>
                                )}
                            </section>
                        )}

                        {/* Tool Performance Selector Grid */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-serif text-xl font-semibold text-[#161614] tracking-tight">
                                    {t("statistics.scoreTrend", "Tool Performance")}
                                </h2>
                                <span className="text-xs text-[#6A675F]">
                                    Select a card to inspect its chart
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tools.map((toolId) => {
                                    const stats = ScoreHistory.getStats(toolId);
                                    if (!stats) return null;
                                    const isSelected = activeToolId === toolId;

                                    return (
                                        <button
                                            key={toolId}
                                            type="button"
                                            onClick={() => setSelectedTool(toolId)}
                                            aria-pressed={isSelected}
                                            className={`text-left p-5 rounded-2xl border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                                isSelected
                                                    ? "bg-[#F3F1EB]/70 border-[#1E40AF]"
                                                    : "bg-white border-[#E6E3DB] hover:border-[#D8D4C9]"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-2 pb-3 mb-3 border-b border-[#E6E3DB]">
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <ToolIcon toolId={toolId} variant="3d" size="sm" />
                                                    <div className="min-w-0">
                                                        <h3 className="text-base font-semibold text-[#161614] capitalize truncate">
                                                            {t(
                                                                `tools.${toolId}.title`,
                                                                toolId.replace(/-/g, " ")
                                                            )}
                                                        </h3>
                                                        <p className="text-xs font-mono text-[#6A675F] mt-0.5 truncate">
                                                            {stats.difficulty || "standard"} ·{" "}
                                                            {stats.inputMethod || "browser"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`inline-flex items-center gap-1 text-xs font-semibold capitalize shrink-0 ${
                                                        stats.trend === "improving"
                                                            ? "text-emerald-700"
                                                            : stats.trend === "declining"
                                                            ? "text-rose-700"
                                                            : "text-[#6A675F]"
                                                    }`}
                                                >
                                                    {stats.trend === "improving" ? (
                                                        <TrendingUp
                                                            className="w-3.5 h-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    ) : stats.trend === "declining" ? (
                                                        <TrendingDown
                                                            className="w-3.5 h-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Minus
                                                            className="w-3.5 h-3.5"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {stats.trend}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-3 gap-2 font-mono tabular-nums">
                                                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB]">
                                                    <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6A675F]">
                                                        Best
                                                    </div>
                                                    <div className="text-sm font-bold text-[#1E40AF] mt-0.5">
                                                        {stats.best.toLocaleString()} {stats.unit}
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB]">
                                                    <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6A675F]">
                                                        Avg
                                                    </div>
                                                    <div className="text-sm font-bold text-[#161614] mt-0.5">
                                                        {Math.round(stats.average).toLocaleString()}
                                                    </div>
                                                </div>
                                                <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB]">
                                                    <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-[#6A675F]">
                                                        Runs
                                                    </div>
                                                    <div className="text-sm font-bold text-[#161614] mt-0.5">
                                                        {stats.count}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </section>

                        {/* Share Bar */}
                        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div>
                                <h3 className="text-base font-semibold text-[#161614]">
                                    Share Your Progress
                                </h3>
                                <p className="text-sm text-[#4A4842]">
                                    {totalGames} recorded sessions across {tools.length} benchmarks
                                    {deepWorkStats.totalSeconds > 0
                                        ? ` and ${formatDurationHuman(deepWorkStats.totalSeconds)} of deep work`
                                        : ""}{" "}
                                    on this device.
                                </p>
                            </div>
                            <ShareButton
                                text={`I've completed ${totalGames} cognitive sessions${
                                    deepWorkStats.totalSeconds > 0
                                        ? ` and ${formatDurationHuman(deepWorkStats.totalSeconds)} of deep work`
                                        : ""
                                } on Reflextry!`}
                            />
                        </section>
                    </>
                )}

                {/* Editorial Context */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-5">
                    <h2 className="font-serif text-xl font-semibold text-[#161614] tracking-tight">
                        Interpreting Your Cognitive Statistics
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6 text-sm text-[#4A4842] leading-relaxed">
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">
                                Why Same-Setup Comparisons Matter
                            </h3>
                            <p>
                                Browser scores reflect your display refresh rate, mouse or touch input latency, and chosen difficulty level. Reflextry groups comparable sessions by configuration so your personal best and trend line never mix incompatible setups.
                            </p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-base font-semibold text-[#161614]">
                                Structured Deep Work Intervals
                            </h3>
                            <p>
                                Pairing focused 15–50 minute Pomodoro intervals with short recovery breaks prevents cognitive fatigue and produces cleaner reaction and working-memory baselines over time.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
