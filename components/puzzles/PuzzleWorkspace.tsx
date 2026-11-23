"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Copy,
    HelpCircle,
    Lightbulb,
    ListFilter,
    RotateCcw,
    Star,
    Trophy,
    Undo2,
    Volume2,
    VolumeX,
    X,
} from "lucide-react";
import {
    LEVEL_TIERS,
    TOTAL_LEVELS,
    formatTime,
    getTierForLevel,
    getTodayKey,
    isPuzzleSoundEnabled,
    loadPuzzleProgress,
    playPuzzleTone,
    setPuzzleSoundEnabled,
    type GameProgressData,
    type LevelTier,
} from "@/lib/puzzles/core";
import { PUZZLES_META, type PuzzleId } from "@/lib/puzzles/meta";
import { KEYBOARD_NAV_EVENTS } from "@/lib/keyboard-navigation";
import { ToolIcon } from "@/components/ToolIcon";

export interface PuzzleWorkspaceProps {
    gameId: PuzzleId;
    level: number;
    isDaily: boolean;
    onSelectLevel: (level: number) => void;
    onToggleDaily: (daily: boolean) => void;
    moves: number;
    elapsedSeconds: number;
    solved: boolean;
    starsEarned: number;
    statusNote?: string;
    canUndo?: boolean;
    onUndo?: () => void;
    onHint?: () => void;
    onReset: () => void;
    extraControls?: React.ReactNode;
    shareText?: string;
    children: React.ReactNode;
}

export function PuzzleWorkspace({
    gameId,
    level,
    isDaily,
    onSelectLevel,
    onToggleDaily,
    moves,
    elapsedSeconds,
    solved,
    starsEarned,
    statusNote,
    canUndo = false,
    onUndo,
    onHint,
    onReset,
    extraControls,
    shareText,
    children,
}: PuzzleWorkspaceProps) {
    const meta = PUZZLES_META[gameId];
    const tier = getTierForLevel(level);

    const [soundOn, setSoundOn] = useState(true);
    const [showRules, setShowRules] = useState(false);
    const [showLevelPicker, setShowLevelPicker] = useState(false);
    const [pickerTier, setPickerTier] = useState<LevelTier["id"]>(tier.id);
    const [jumpInput, setJumpInput] = useState("");
    const [copied, setCopied] = useState(false);
    const [progress, setProgress] = useState<GameProgressData>(() => loadPuzzleProgress(gameId));

    useEffect(() => {
        setSoundOn(isPuzzleSoundEnabled());
    }, []);

    useEffect(() => {
        setProgress(loadPuzzleProgress(gameId));
    }, [gameId, solved, level, isDaily]);

    // Global 'R' shortcut: reset the active puzzle board in-place while preserving level/Daily mode
    useEffect(() => {
        const handleGlobalRestart = (event: Event) => {
            event.preventDefault();
            setShowLevelPicker(false);
            onReset();
            playPuzzleTone("tap");
        };
        window.addEventListener(KEYBOARD_NAV_EVENTS.TOOL_RESTART, handleGlobalRestart);
        return () => window.removeEventListener(KEYBOARD_NAV_EVENTS.TOOL_RESTART, handleGlobalRestart);
    }, [onReset]);

    const toggleSound = () => {
        const next = !soundOn;
        setSoundOn(next);
        setPuzzleSoundEnabled(next);
        if (next) playPuzzleTone("tap");
    };

    const handleCopyShare = async () => {
        const text =
            shareText ||
            `Reflextry ${meta.shortTitle} · ${isDaily ? `Daily (${getTodayKey()})` : `Level ${level}`}\n${"★".repeat(starsEarned)}${"☆".repeat(Math.max(0, 3 - starsEarned))} · ${formatTime(elapsedSeconds)} · ${moves} moves`;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            playPuzzleTone("tap");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Ignore clipboard errors in restricted frames
        }
    };

    const activeTierObj = LEVEL_TIERS.find((t) => t.id === pickerTier) || LEVEL_TIERS[0];
    const solvedSet = new Set(progress.solvedLevels);
    const todaySolved = progress.dailySolvedDates.includes(getTodayKey());

    const handleJumpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsed = parseInt(jumpInput, 10);
        if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= TOTAL_LEVELS) {
            onToggleDaily(false);
            onSelectLevel(parsed);
            setShowLevelPicker(false);
            setJumpInput("");
            playPuzzleTone("tap");
        }
    };

    return (
        <div className="space-y-5">
            {/* Top Navigation & Mode Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href="/puzzles"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78756C] hover:text-[#161614] transition-colors whitespace-nowrap"
                >
                    <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>All 9 Logic Puzzles</span>
                </Link>

                <div className="flex items-center gap-2">
                    <div
                        className="inline-flex items-center p-1 bg-[#F3F1EB] rounded-lg border border-[#E6E3DB]"
                        role="tablist"
                        aria-label="Puzzle mode"
                    >
                        <button
                            type="button"
                            role="tab"
                            aria-selected={!isDaily}
                            onClick={() => {
                                onToggleDaily(false);
                                playPuzzleTone("tap");
                            }}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                !isDaily
                                    ? "bg-white text-[#161614] shadow-xs"
                                    : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            1,200 Levels
                        </button>
                        <button
                            type="button"
                            role="tab"
                            aria-selected={isDaily}
                            onClick={() => {
                                onToggleDaily(true);
                                playPuzzleTone("tap");
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                isDaily
                                    ? "bg-white text-[#161614] shadow-xs"
                                    : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Daily</span>
                            {todaySolved && (
                                <Check className="w-3.5 h-3.5 text-emerald-700" aria-label="Completed today" />
                            )}
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={toggleSound}
                        aria-label={soundOn ? "Mute sound effects" : "Enable sound effects"}
                        title={soundOn ? "Mute sound" : "Enable sound"}
                        className="p-2 rounded-lg border border-[#E6E3DB] bg-white text-[#57554E] hover:text-[#161614] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
                    >
                        {soundOn ? (
                            <Volume2 className="w-4 h-4" aria-hidden="true" />
                        ) : (
                            <VolumeX className="w-4 h-4" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </div>

            {/* Main Studio Workspace Card (single-elevation architectural surface) */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">
                {/* Editorial Header & Live Tabular HUD */}
                <div className="px-5 sm:px-7 py-5 border-b border-[#F0EDE6] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                        <ToolIcon
                            toolId={gameId}
                            variant="3d-pedestal"
                            size="lg"
                            interactive
                            title={meta.shortTitle}
                            className="hidden sm:inline-flex mt-0.5"
                        />
                        <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#78756C] font-medium">
                                <span className="text-[#161614] font-semibold">{meta.groupLabel}</span>
                                <span aria-hidden="true">·</span>
                                <span className="text-[#57554E]">
                                    {isDaily ? `Daily ${getTodayKey()}` : `${tier.label} Tier`}
                                </span>
                                <span aria-hidden="true">·</span>
                                <span className="tabular-nums font-mono">
                                    {progress.solvedLevels.length.toLocaleString()} / {TOTAL_LEVELS.toLocaleString()} solved
                                </span>
                            </div>
                            <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-[-0.02em] text-[#161614]">
                                {meta.shortTitle}
                            </h1>
                            <p className="text-sm text-[#57554E] max-w-xl">{meta.tagline}</p>
                        </div>
                    </div>

                    {/* Level Selector & Live Metrics */}
                    <div className="flex flex-wrap items-center gap-3 sm:gap-5">
                        {!isDaily && (
                            <div className="flex items-center border border-[#E6E3DB] rounded-lg bg-[#FAF9F6]">
                                <button
                                    type="button"
                                    disabled={level <= 1}
                                    onClick={() => {
                                        onSelectLevel(Math.max(1, level - 1));
                                        playPuzzleTone("tap");
                                    }}
                                    aria-label="Previous level"
                                    className="p-2 text-[#57554E] hover:text-[#161614] disabled:opacity-35 transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPickerTier(tier.id);
                                        setShowLevelPicker(true);
                                    }}
                                    className="px-3 py-1.5 text-xs font-semibold text-[#161614] hover:text-[#1E40AF] transition-colors flex items-center gap-1.5 whitespace-nowrap tabular-nums cursor-pointer"
                                >
                                    <ListFilter className="w-3.5 h-3.5 text-[#78756C]" aria-hidden="true" />
                                    <span>Level {level}</span>
                                    {solvedSet.has(level) && (
                                        <Check className="w-3.5 h-3.5 text-emerald-700" aria-label="Solved" />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    disabled={level >= TOTAL_LEVELS}
                                    onClick={() => {
                                        onSelectLevel(Math.min(TOTAL_LEVELS, level + 1));
                                        playPuzzleTone("tap");
                                    }}
                                    aria-label="Next level"
                                    className="p-2 text-[#57554E] hover:text-[#161614] disabled:opacity-35 transition-colors cursor-pointer"
                                >
                                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                                </button>
                            </div>
                        )}

                        <div className="flex items-center gap-4 text-sm font-mono tabular-nums text-[#3F3E39]">
                            <div>
                                <span className="text-[#78756C] mr-1.5 font-sans text-xs">Time</span>
                                <span className="font-bold text-[#161614]">{formatTime(elapsedSeconds)}</span>
                            </div>
                            <span className="text-[#D8D4C9]" aria-hidden="true">/</span>
                            <div>
                                <span className="text-[#78756C] mr-1.5 font-sans text-xs">Moves</span>
                                <span className="font-bold text-[#161614]">{moves}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls Toolbar */}
                <div className="px-5 sm:px-7 py-3 bg-[#FAF9F6] border-b border-[#F0EDE6] flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                        {onUndo && (
                            <button
                                type="button"
                                onClick={onUndo}
                                disabled={!canUndo || solved}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3F3E39] bg-white border border-[#E6E3DB] rounded-lg hover:bg-[#F3F1EB] disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                <Undo2 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Undo</span>
                            </button>
                        )}
                        {onHint && (
                            <button
                                type="button"
                                onClick={onHint}
                                disabled={solved}
                                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 disabled:opacity-40 transition-colors whitespace-nowrap cursor-pointer"
                            >
                                <Lightbulb className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Hint</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                onReset();
                                playPuzzleTone("tap");
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#3F3E39] bg-white border border-[#E6E3DB] rounded-lg hover:bg-[#F3F1EB] transition-colors whitespace-nowrap cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Reset</span>
                        </button>
                        {extraControls}
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowRules((v) => !v)}
                        aria-expanded={showRules}
                        className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#57554E] hover:text-[#161614] transition-colors whitespace-nowrap cursor-pointer"
                    >
                        <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{showRules ? "Hide Rules" : "How to Play"}</span>
                    </button>
                </div>

                {/* Collapsible Inline Rules Panel */}
                {showRules && (
                    <div className="px-5 sm:px-7 py-4 bg-[#F3F1EB] border-b border-[#E6E3DB] text-sm text-[#3F3E39]">
                        <ul className="space-y-1.5 list-disc pl-5 max-w-3xl">
                            {meta.rules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Board Stage */}
                <div className="px-3 sm:px-7 py-5 sm:py-8 flex flex-col items-center w-full min-w-0">
                    {statusNote && !solved && (
                        <p className="mb-4 text-xs sm:text-sm font-medium text-[#57554E] text-center max-w-xl">
                            {statusNote}
                        </p>
                    )}

                    <div className="w-full min-w-0 max-w-full flex flex-col items-center">{children}</div>

                    {/* Victory Panel */}
                    {solved && (
                        <div className="mt-7 w-full max-w-lg border border-emerald-200 bg-emerald-50/70 rounded-xl p-5 sm:p-6 text-center space-y-4">
                            <div className="flex items-center justify-center gap-1.5">
                                {[1, 2, 3].map((s) => (
                                    <Star
                                        key={s}
                                        className={`w-6 h-6 ${
                                            s <= starsEarned
                                                ? "fill-amber-400 text-amber-500"
                                                : "text-[#D8D4C9]"
                                        }`}
                                        aria-hidden="true"
                                    />
                                ))}
                            </div>
                            <div className="space-y-1">
                                <div className="inline-flex items-center gap-1.5 text-emerald-900 font-serif font-medium text-xl">
                                    <Trophy className="w-5 h-5" aria-hidden="true" />
                                    <span>
                                        {isDaily
                                            ? "Daily Puzzle Complete"
                                            : `Level ${level} Cleared`}
                                    </span>
                                </div>
                                <p className="text-xs sm:text-sm text-[#57554E] font-mono tabular-nums">
                                    Time {formatTime(elapsedSeconds)} · {moves} moves · {starsEarned}/3 stars
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                                {!isDaily && level < TOTAL_LEVELS && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onSelectLevel(level + 1);
                                            playPuzzleTone("tap");
                                        }}
                                        className="px-4 py-2 text-sm font-semibold text-[#FAF9F6] bg-[#161614] hover:bg-[#2C2B27] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        Next Level ({level + 1})
                                    </button>
                                )}
                                {isDaily && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onToggleDaily(false);
                                            playPuzzleTone("tap");
                                        }}
                                        className="px-4 py-2 text-sm font-semibold text-[#FAF9F6] bg-[#161614] hover:bg-[#2C2B27] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                    >
                                        Play 1,200 Levels
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleCopyShare}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#161614] bg-white border border-[#D8D4C9] hover:bg-[#FAF9F6] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                                            <span>Copied Result</span>
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" aria-hidden="true" />
                                            <span>Share Score</span>
                                        </>
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={onReset}
                                    className="px-3.5 py-2 text-sm font-semibold text-[#57554E] hover:text-[#161614] transition-colors whitespace-nowrap cursor-pointer"
                                >
                                    Replay
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 1,200-Level Browser Modal */}
            {showLevelPicker && (
                <div
                    className="fixed inset-0 z-50 bg-[#161614]/45 backdrop-blur-xs flex items-center justify-center p-4"
                    role="dialog"
                    aria-modal="true"
                    aria-label={`Select ${meta.shortTitle} level`}
                >
                    <div className="bg-white border border-[#E6E3DB] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
                        <div className="px-5 py-4 border-b border-[#E6E3DB] flex items-center justify-between gap-3">
                            <div>
                                <h2 className="font-serif text-xl font-medium text-[#161614]">
                                    {meta.shortTitle} · 1,200 Levels
                                </h2>
                                <p className="text-xs text-[#78756C] tabular-nums">
                                    {progress.solvedLevels.length.toLocaleString()} completed across 5 Mensa tiers
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowLevelPicker(false)}
                                aria-label="Close level selector"
                                className="p-2 rounded-lg text-[#78756C] hover:text-[#161614] hover:bg-[#F3F1EB] transition-colors cursor-pointer"
                            >
                                <X className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>

                        {/* Tier Tabs & Direct Jump */}
                        <div className="px-5 py-3 bg-[#FAF9F6] border-b border-[#E6E3DB] flex flex-wrap items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1">
                                {LEVEL_TIERS.map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setPickerTier(t.id)}
                                        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                                            pickerTier === t.id
                                                ? "bg-[#161614] text-[#FAF9F6]"
                                                : "text-[#57554E] hover:bg-[#F3F1EB]"
                                        }`}
                                    >
                                        {t.label} ({t.start}–{t.end})
                                    </button>
                                ))}
                            </div>

                            <form onSubmit={handleJumpSubmit} className="flex items-center gap-1.5">
                                <input
                                    type="number"
                                    min={1}
                                    max={TOTAL_LEVELS}
                                    value={jumpInput}
                                    onChange={(e) => setJumpInput(e.target.value)}
                                    placeholder="Go to #"
                                    className="w-24 px-2.5 py-1.5 text-xs border border-[#D8D4C9] rounded-md bg-white text-[#161614] tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-xs font-semibold text-[#FAF9F6] bg-[#161614] hover:bg-[#2C2B27] rounded-md transition-colors cursor-pointer"
                                >
                                    Go
                                </button>
                            </form>
                        </div>

                        {/* Level Grid for Selected Tier */}
                        <div className="p-5 overflow-y-auto grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
                            {Array.from(
                                { length: activeTierObj.end - activeTierObj.start + 1 },
                                (_, i) => activeTierObj.start + i
                            ).map((lvl) => {
                                const isDone = solvedSet.has(lvl);
                                const isCurrent = !isDaily && lvl === level;
                                return (
                                    <button
                                        key={lvl}
                                        type="button"
                                        onClick={() => {
                                            onToggleDaily(false);
                                            onSelectLevel(lvl);
                                            setShowLevelPicker(false);
                                            playPuzzleTone("tap");
                                        }}
                                        className={`h-10 rounded-lg text-xs font-bold tabular-nums border transition-colors flex items-center justify-center gap-0.5 cursor-pointer ${
                                            isCurrent
                                                ? "bg-[#161614] text-[#FAF9F6] border-[#161614]"
                                                : isDone
                                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                                  : "bg-white text-[#3F3E39] border-[#E6E3DB] hover:border-[#161614] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        <span>{lvl}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
