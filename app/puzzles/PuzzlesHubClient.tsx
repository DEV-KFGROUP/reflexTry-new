"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowUpRight,
    Calendar,
    Check,
    Trophy,
} from "lucide-react";
import {
    getTodayKey,
    loadPuzzleProgress,
    TOTAL_LEVELS,
} from "@/lib/puzzles/core";
import {
    PUZZLE_LIST,
    type PuzzleGroup,
} from "@/lib/puzzles/meta";
import { ToolIcon } from "@/components/ToolIcon";

interface GameStatSnapshot {
    solvedCount: number;
    dailyDone: boolean;
    lastLevel: number;
}

export function PuzzlesHubClient() {
    const [activeGroup, setActiveGroup] = useState<"all" | PuzzleGroup>("all");
    const [stats, setStats] = useState<Record<string, GameStatSnapshot>>({});

    useEffect(() => {
        const today = getTodayKey();
        const next: Record<string, GameStatSnapshot> = {};
        for (const p of PUZZLE_LIST) {
            const data = loadPuzzleProgress(p.id);
            next[p.id] = {
                solvedCount: data.solvedLevels.length,
                dailyDone: data.dailySolvedDates.includes(today),
                lastLevel: data.lastLevel,
            };
        }
        setStats(next);
    }, []);

    const totalSolved = Object.values(stats).reduce(
        (acc, s) => acc + s.solvedCount,
        0
    );
    const dailySolvedCount = Object.values(stats).filter((s) => s.dailyDone).length;
    const totalAvailable = PUZZLE_LIST.length * TOTAL_LEVELS;

    const filtered =
        activeGroup === "all"
            ? PUZZLE_LIST
            : PUZZLE_LIST.filter((p) => p.group === activeGroup);

    const filterTabs: { id: "all" | PuzzleGroup; label: string }[] = [
        { id: "all", label: "All 9 Puzzles" },
        { id: "logic", label: "Logic Grids (3)" },
        { id: "spatial", label: "Spatial & Number (3)" },
        { id: "word", label: "Word & Trivia (3)" },
    ];

    return (
        <div className="space-y-10">
            {/* Editorial Header + Live Suite Metrics */}
            <header className="border-b border-[#D8D4C9] pb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                <div className="flex items-start gap-4 sm:gap-5 max-w-2xl">
                    <ToolIcon
                        toolId="puzzles"
                        variant="3d-pedestal"
                        size="xl"
                        interactive
                        title="Daily Logic & Word Puzzles"
                        className="hidden sm:inline-flex mt-1"
                    />
                    <div className="space-y-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            Mensa-Grade Logic Suite · 10,800+ Deterministic Levels
                        </p>
                        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                            Daily Logic &amp; Word Puzzles
                        </h1>
                        <p className="text-base text-[#57554E] leading-relaxed">
                            Nine high-performance brain games engineered with 1,200 tiered levels each
                            (Warmup through Mensa), daily challenges, verified unique solutions, and zero
                            latency.
                        </p>
                    </div>
                </div>

                {/* Live Suite Progress Metrics */}
                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="rounded-xl border border-[#E6E3DB] bg-white px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78756C]">
                            <Trophy className="w-3.5 h-3.5 text-[#57554E]" aria-hidden="true" />
                            <span>Levels Cleared</span>
                        </div>
                        <div className="text-xl font-bold text-[#161614] font-mono tabular-nums mt-1">
                            {totalSolved.toLocaleString()}{" "}
                            <span className="text-xs font-medium text-[#78756C]">
                                / {totalAvailable.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#E6E3DB] bg-white px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#78756C]">
                            <Calendar className="w-3.5 h-3.5 text-[#57554E]" aria-hidden="true" />
                            <span>Daily Suite</span>
                        </div>
                        <div className="text-xl font-bold text-[#161614] font-mono tabular-nums mt-1">
                            {dailySolvedCount}{" "}
                            <span className="text-xs font-medium text-[#78756C]">/ 9 today</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div
                    className="inline-flex flex-wrap items-center gap-1 p-1 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl"
                    role="tablist"
                    aria-label="Filter puzzle categories"
                >
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={activeGroup === tab.id}
                            onClick={() => setActiveGroup(tab.id)}
                            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                                activeGroup === tab.id
                                    ? "bg-[#161614] text-[#FAF9F6]"
                                    : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <p className="text-xs font-mono text-[#78756C] tabular-nums">
                    5 Tiers per game · Warmup · Club · Scholar · Master · Mensa
                </p>
            </div>

            {/* Ruled Architectural Puzzle Catalog Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                {filtered.map((puzzle) => {
                    const stat = stats[puzzle.id];
                    const solvedCount = stat?.solvedCount ?? 0;
                    const pct = Math.min(
                        100,
                        Math.round((solvedCount / TOTAL_LEVELS) * 100)
                    );

                    return (
                        <Link
                            key={puzzle.id}
                            href={puzzle.path}
                            className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-6 flex flex-col justify-between gap-6 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-3">
                                    <ToolIcon
                                        toolId={puzzle.id}
                                        variant="3d"
                                        size="lg"
                                        title={puzzle.shortTitle}
                                    />
                                    <div className="text-right">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C]">
                                            {puzzle.groupLabel} · 1,200 Levels
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between gap-2">
                                        <h2 className="font-serif text-xl font-medium text-[#161614] group-hover:text-[#1E40AF] transition-colors">
                                            {puzzle.shortTitle}
                                        </h2>
                                        {stat?.dailyDone && (
                                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                                <span>Daily</span>
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-[#57554E] leading-relaxed">
                                        {puzzle.tagline}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-[#F0EDE6]">
                                <div className="flex items-center justify-between text-[11px] font-mono text-[#78756C] tabular-nums">
                                    <span>
                                        {solvedCount.toLocaleString()} / {TOTAL_LEVELS.toLocaleString()} solved
                                    </span>
                                    <span>
                                        {stat && stat.lastLevel > 1
                                            ? `Resume Lvl ${stat.lastLevel}`
                                            : "Level 1"}
                                    </span>
                                </div>
                                <div className="h-1 w-full rounded-full bg-[#F0EDE6] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-[#161614] transition-all"
                                        style={{
                                            width: `${Math.max(pct, solvedCount > 0 ? 3 : 0)}%`,
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between text-xs font-medium text-[#78756C] group-hover:text-[#1E40AF] pt-1 transition-colors">
                                    <span>Play {puzzle.shortTitle}</span>
                                    <ArrowUpRight
                                        className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </section>
        </div>
    );
}
