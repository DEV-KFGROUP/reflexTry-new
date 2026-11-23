"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
    AlertTriangle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    Lock,
    Sparkles,
    Target,
} from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone, SUMBREAK_TILE_STYLES } from "@/lib/puzzles/core";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";
import {
    generateSumbreak,
    getBestSumbreakHint,
    hasValidSumbreakMove,
    slideSumbreakGrid,
    spawnSumbreakTile,
    type SumbreakDir,
} from "@/lib/puzzles/generators/word-and-sum";

interface SumbreakSnapshot {
    grid: number[][];
    score: number;
    stepCount: number;
}

function getMaxTile(grid: number[][]): number {
    let maxVal = 0;
    for (const row of grid) {
        for (const v of row) {
            if (v > maxVal) maxVal = v;
        }
    }
    return maxVal;
}

const DIR_LABELS: Record<SumbreakDir, string> = {
    up: "Slide Up",
    down: "Slide Down",
    left: "Slide Left",
    right: "Slide Right",
};

export function SumbreakGame() {
    const session = usePuzzleSession("sumbreak");

    const puzzle = useMemo(
        () => generateSumbreak(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [grid, setGrid] = useState<number[][]>(() =>
        puzzle.initialGrid.map((r) => [...r])
    );
    const [score, setScore] = useState<number>(0);
    const [stepCount, setStepCount] = useState<number>(0);
    const [history, setHistory] = useState<SumbreakSnapshot[]>([]);
    const [mergedSet, setMergedSet] = useState<Set<string>>(() => new Set());
    const [spawnedKey, setSpawnedKey] = useState<string | null>(null);
    const [hintDir, setHintDir] = useState<SumbreakDir | null>(null);

    const touchStartRef = useRef<{ x: number; y: number } | null>(null);

    useEffect(() => {
        setGrid(puzzle.initialGrid.map((r) => [...r]));
        setScore(0);
        setStepCount(0);
        setHistory([]);
        setMergedSet(new Set());
        setSpawnedKey(null);
        setHintDir(null);
    }, [puzzle, session.resetToken]);

    const maxTile = useMemo(() => getMaxTile(grid), [grid]);
    const isStuck = useMemo(
        () => !session.solved && !hasValidSumbreakMove(grid),
        [grid, session.solved]
    );

    const performSlide = useCallback(
        (dir: SumbreakDir) => {
            if (session.solved) return;
            const res = slideSumbreakGrid(grid, dir);
            if (!res.moved) {
                playPuzzleTone("error");
                return;
            }

            const nextStep = stepCount + 1;
            const nextScore = score + res.gained;
            const spawned = spawnSumbreakTile(
                res.nextGrid,
                puzzle.spawnSeed + nextStep * 7919
            );

            setHistory((prev) => [
                ...prev.slice(-29),
                {
                    grid: grid.map((r) => [...r]),
                    score,
                    stepCount,
                },
            ]);
            setGrid(spawned.grid);
            setScore(nextScore);
            setStepCount(nextStep);
            setMergedSet(new Set(res.mergedCoords));
            setSpawnedKey(spawned.spawnedKey);
            setHintDir(null);
            session.setMoves((m) => m + 1);

            if (res.gained > 0) {
                playPuzzleTone("place");
            } else {
                playPuzzleTone("tap");
            }

            const reachedMax = getMaxTile(spawned.grid);
            if (reachedMax >= puzzle.targetTile) {
                const stars =
                    nextStep <= puzzle.parMoves && session.hintsUsed === 0
                        ? 3
                        : nextStep <= Math.round(puzzle.parMoves * 1.35)
                          ? 2
                          : 1;
                session.markSolved(stars);
            }
        },
        [grid, score, stepCount, puzzle, session]
    );

    // Keyboard controls (Arrows + WASD)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (session.solved) return;
            const target = e.target as HTMLElement | null;
            if (
                target &&
                (target.tagName === "INPUT" ||
                    target.tagName === "TEXTAREA" ||
                    target.isContentEditable)
            ) {
                return;
            }
            const map: Record<string, SumbreakDir> = {
                ArrowUp: "up",
                w: "up",
                W: "up",
                ArrowDown: "down",
                s: "down",
                S: "down",
                ArrowLeft: "left",
                a: "left",
                A: "left",
                ArrowRight: "right",
                d: "right",
                D: "right",
            };
            const dir = map[e.key];
            if (dir) {
                e.preventDefault();
                performSlide(dir);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [performSlide, session.solved]);

    const handleUndo = () => {
        if (history.length === 0 || session.solved) return;
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setGrid(prev.grid);
        setScore(prev.score);
        setStepCount(prev.stepCount);
        setMergedSet(new Set());
        setSpawnedKey(null);
        setHintDir(null);
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        const best = getBestSumbreakHint(grid);
        if (best) {
            setHintDir(best);
            session.setHintsUsed((h) => h + 1);
            playPuzzleTone("hint");
        }
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        const touch = e.touches[0];
        if (!touch) return;
        touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (!touchStartRef.current) return;
        const touch = e.changedTouches[0];
        if (!touch) return;
        const dx = touch.clientX - touchStartRef.current.x;
        const dy = touch.clientY - touchStartRef.current.y;
        touchStartRef.current = null;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 24) return;
        if (Math.abs(dx) > Math.abs(dy)) {
            performSlide(dx > 0 ? "right" : "left");
        } else {
            performSlide(dy > 0 ? "down" : "up");
        }
    };

    const progressPct = Math.min(
        100,
        Math.round((Math.log2(Math.max(2, maxTile)) / Math.log2(puzzle.targetTile)) * 100)
    );

    const statusNote = hintDir
        ? `Tactical Hint: ${DIR_LABELS[hintDir]} to maximize open lanes and merges.`
        : `Reach tile ${puzzle.targetTile} within ${puzzle.parMoves} par moves. Use Arrow keys, WASD, or swipe.`;

    return (
        <PuzzleWorkspace
            gameId="sumbreak"
            level={session.level}
            isDaily={session.isDaily}
            onSelectLevel={session.selectLevel}
            onToggleDaily={session.toggleDaily}
            moves={session.moves}
            elapsedSeconds={session.elapsedSeconds}
            solved={session.solved}
            starsEarned={session.starsEarned}
            statusNote={statusNote}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={session.resetSession}
        >
            <div
                data-capture-keys={!session.solved ? "s" : undefined}
                className="w-full max-w-md space-y-5"
            >
                {/* Target & Score Telemetry Bar */}
                <div className="grid grid-cols-3 gap-2.5">
                    <div className="rounded-xl border border-rose-200 bg-rose-50/70 px-3.5 py-2.5">
                        <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
                            <Target className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Target</span>
                        </div>
                        <div className="text-xl font-extrabold text-[#161614] font-mono tabular-nums mt-0.5">
                            {puzzle.targetTile}
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] px-3.5 py-2.5">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#78756C]">
                            Highest Tile
                        </div>
                        <div className="text-xl font-extrabold text-[#161614] font-mono tabular-nums mt-0.5">
                            {maxTile}
                        </div>
                    </div>
                    <div className="rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] px-3.5 py-2.5">
                        <div className="text-[11px] font-semibold uppercase tracking-wide text-[#78756C]">
                            Par / Score
                        </div>
                        <div className="text-sm font-bold text-[#161614] font-mono tabular-nums mt-1.5">
                            {stepCount}/{puzzle.parMoves} · {score}
                        </div>
                    </div>
                </div>

                {/* Target Progress Hairline */}
                <div className="h-1.5 w-full rounded-full bg-[#F3F1EB] overflow-hidden">
                    <div
                        className="h-full bg-rose-600 transition-all duration-200"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>

                {/* Main Merge Board */}
                <div
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                    className="bg-slate-200/85 border border-[#D8D4C9] rounded-2xl p-2.5 sm:p-3 touch-none select-none"
                    role="application"
                    aria-label="Sumbreak number merge board"
                >
                    <div
                        className="grid gap-2 sm:gap-2.5"
                        style={{
                            gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                        }}
                    >
                        {grid.map((row, r) =>
                            row.map((val, c) => {
                                const key = `${r},${c}`;
                                const isBlocker = val === -1;
                                const isMerged = mergedSet.has(key);
                                const isSpawned = spawnedKey === key;
                                const style =
                                    val > 0
                                        ? SUMBREAK_TILE_STYLES[val] ||
                                          SUMBREAK_TILE_STYLES[4096]
                                        : null;

                                return (
                                    <div
                                        key={key}
                                        className={`aspect-square rounded-xl flex items-center justify-center font-mono font-extrabold tabular-nums transition-transform duration-150 ${
                                            isBlocker
                                                ? "bg-slate-800 border-2 border-slate-900 text-slate-400"
                                                : val === 0
                                                  ? "bg-white/75 border border-[#E6E3DB]/80"
                                                  : "border-2 shadow-xs"
                                        } ${
                                            isMerged
                                                ? "scale-105 ring-2 ring-rose-500/60"
                                                : isSpawned
                                                  ? "scale-95"
                                                  : ""
                                        } ${
                                            puzzle.size === 5
                                                ? val >= 1024
                                                    ? "text-base sm:text-lg"
                                                    : "text-lg sm:text-xl"
                                                : val >= 1024
                                                  ? "text-xl sm:text-2xl"
                                                  : "text-2xl sm:text-3xl"
                                        }`}
                                        style={
                                            style
                                                ? {
                                                      backgroundColor: style.bg,
                                                      color: style.text,
                                                      borderColor: style.border,
                                                  }
                                                : undefined
                                        }
                                    >
                                        {isBlocker ? (
                                            <Lock className="w-5 h-5 text-slate-400" aria-label="Stone blocker" />
                                        ) : val > 0 ? (
                                            val
                                        ) : null}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Stuck Board Diagnostic */}
                {isStuck && (
                    <div className="rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-rose-800">
                            <AlertTriangle className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>No valid merges remain. Undo a few moves or retry this board.</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleUndo}
                            disabled={history.length === 0}
                            className="px-3 py-1.5 text-xs font-bold text-white bg-rose-700 hover:bg-rose-800 rounded-lg disabled:opacity-40 whitespace-nowrap"
                        >
                            Undo Move
                        </button>
                    </div>
                )}

                {/* Tactile On-Screen Directional Pad (Desktop & Mobile Friendly) */}
                <div className="flex flex-col items-center gap-1.5 pt-1">
                    <button
                        type="button"
                        onClick={() => performSlide("up")}
                        disabled={session.solved}
                        aria-label="Slide Up"
                        className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                            hintDir === "up"
                                ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/50"
                                : "bg-white border-[#D8D4C9] text-[#3F3E39] hover:bg-[#FAF9F6]"
                        }`}
                    >
                        <ArrowUp className="w-5 h-5" aria-hidden="true" />
                    </button>
                    <div className="flex items-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => performSlide("left")}
                            disabled={session.solved}
                            aria-label="Slide Left"
                            className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                                hintDir === "left"
                                    ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/50"
                                    : "bg-white border-[#D8D4C9] text-[#3F3E39] hover:bg-[#FAF9F6]"
                            }`}
                        >
                            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => performSlide("down")}
                            disabled={session.solved}
                            aria-label="Slide Down"
                            className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                                hintDir === "down"
                                    ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/50"
                                    : "bg-white border-[#D8D4C9] text-[#3F3E39] hover:bg-[#FAF9F6]"
                            }`}
                        >
                            <ArrowDown className="w-5 h-5" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => performSlide("right")}
                            disabled={session.solved}
                            aria-label="Slide Right"
                            className={`w-12 h-11 rounded-lg border flex items-center justify-center transition-colors ${
                                hintDir === "right"
                                    ? "bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-400/50"
                                    : "bg-white border-[#D8D4C9] text-[#3F3E39] hover:bg-[#FAF9F6]"
                            }`}
                        >
                            <ArrowRight className="w-5 h-5" aria-hidden="true" />
                        </button>
                    </div>
                    {hintDir && (
                        <div className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 mt-1">
                            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Recommended: {DIR_LABELS[hintDir]}</span>
                        </div>
                    )}
                </div>
            </div>
        </PuzzleWorkspace>
    );
}
