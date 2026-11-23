"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle } from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { REGION_PALETTE, playPuzzleTone } from "@/lib/puzzles/core";
import { generatePatches } from "@/lib/puzzles/generators/logic-grid";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";

interface PlacedPatch {
    id: number;
    r1: number;
    c1: number;
    r2: number;
    c2: number;
    colorIndex: number;
}

export default function PatchesGame() {
    const session = usePuzzleSession("patches");
    const puzzle = useMemo(
        () => generatePatches(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [patches, setPatches] = useState<PlacedPatch[]>([]);
    const [history, setHistory] = useState<PlacedPatch[][]>([]);
    const [dragStart, setDragStart] = useState<[number, number] | null>(null);
    const [dragEnd, setDragEnd] = useState<[number, number] | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const nextIdRef = useRef(1);

    useEffect(() => {
        setPatches([]);
        setHistory([]);
        setDragStart(null);
        setDragEnd(null);
        setFeedback(null);
    }, [puzzle, session.resetToken]);

    const patchAtCell = useMemo(() => {
        const m = new Map<string, PlacedPatch>();
        for (const p of patches) {
            for (let r = p.r1; r <= p.r2; r++) {
                for (let c = p.c1; c <= p.c2; c++) {
                    m.set(`${r},${c}`, p);
                }
            }
        }
        return m;
    }, [patches]);

    // Check victory: every cell covered & every patch valid (1 clue matching area)
    useEffect(() => {
        if (session.solved) return;
        const total = puzzle.size * puzzle.size;
        if (patchAtCell.size !== total) return;
        if (patches.length !== Object.keys(puzzle.clues).length) return;
        session.markSolved();
    }, [patchAtCell.size, patches.length, puzzle.size, puzzle.clues, session]);

    const previewRect = useMemo(() => {
        if (!dragStart || !dragEnd) return null;
        return {
            r1: Math.min(dragStart[0], dragEnd[0]),
            c1: Math.min(dragStart[1], dragEnd[1]),
            r2: Math.max(dragStart[0], dragEnd[0]),
            c2: Math.max(dragStart[1], dragEnd[1]),
        };
    }, [dragStart, dragEnd]);

    const commitDrag = () => {
        if (!previewRect || session.solved) {
            setDragStart(null);
            setDragEnd(null);
            return;
        }
        const { r1, c1, r2, c2 } = previewRect;
        const area = (r2 - r1 + 1) * (c2 - c1 + 1);

        // Single click on an existing patch removes it cleanly
        if (r1 === r2 && c1 === c2) {
            const existing = patchAtCell.get(`${r1},${c1}`);
            if (existing) {
                setHistory((h) => [...h.slice(-30), patches]);
                setPatches((prev) => prev.filter((p) => p.id !== existing.id));
                setFeedback(null);
                playPuzzleTone("tap");
            }
            setDragStart(null);
            setDragEnd(null);
            return;
        }

        // Gather clues inside this rectangle
        const insideClues: number[] = [];
        for (let r = r1; r <= r2; r++) {
            for (let c = c1; c <= c2; c++) {
                const v = puzzle.clues[`${r},${c}`];
                if (v !== undefined) insideClues.push(v);
            }
        }

        if (insideClues.length === 0) {
            setFeedback("Every patch must cover one numbered area clue.");
            playPuzzleTone("error");
            setDragStart(null);
            setDragEnd(null);
            return;
        }
        if (insideClues.length > 1) {
            setFeedback("A patch can only contain one numbered clue.");
            playPuzzleTone("error");
            setDragStart(null);
            setDragEnd(null);
            return;
        }
        if (insideClues[0] !== area) {
            setFeedback(`Area is ${area}, but the clue requires exactly ${insideClues[0]} squares.`);
            playPuzzleTone("error");
            setDragStart(null);
            setDragEnd(null);
            return;
        }

        // Remove any overlapping old patches so editing feels effortless
        const filtered = patches.filter(
            (p) => p.r2 < r1 || p.r1 > r2 || p.c2 < c1 || p.c1 > c2
        );
        const newPatch: PlacedPatch = {
            id: nextIdRef.current++,
            r1,
            c1,
            r2,
            c2,
            colorIndex: (filtered.length + r1 + c1) % REGION_PALETTE.length,
        };

        setHistory((h) => [...h.slice(-30), patches]);
        setPatches([...filtered, newPatch]);
        session.setMoves((m) => m + 1);
        setFeedback(null);
        playPuzzleTone("place");
        setDragStart(null);
        setDragEnd(null);
    };

    const handleUndo = () => {
        if (history.length === 0 || session.solved) return;
        setPatches(history[history.length - 1]);
        setHistory((h) => h.slice(0, -1));
        setFeedback(null);
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        // Find a solution rect not yet identically placed
        for (const sol of puzzle.solutionRects) {
            const exists = patches.some(
                (p) => p.r1 === sol.r1 && p.c1 === sol.c1 && p.r2 === sol.r2 && p.c2 === sol.c2
            );
            if (!exists) {
                const filtered = patches.filter(
                    (p) => p.r2 < sol.r1 || p.r1 > sol.r2 || p.c2 < sol.c1 || p.c1 > sol.c2
                );
                setHistory((h) => [...h.slice(-30), patches]);
                setPatches([
                    ...filtered,
                    {
                        id: nextIdRef.current++,
                        r1: sol.r1,
                        c1: sol.c1,
                        r2: sol.r2,
                        c2: sol.c2,
                        colorIndex: sol.colorIndex,
                    },
                ]);
                session.setHintsUsed((n) => n + 1);
                setFeedback(null);
                playPuzzleTone("hint");
                return;
            }
        }
    };

    const cellPx =
        puzzle.size <= 5
            ? "w-13 h-13 sm:w-15 sm:h-15"
            : puzzle.size <= 6
              ? "w-12 h-12 sm:w-14 sm:h-14"
              : puzzle.size <= 7
                ? "w-10 h-10 sm:w-12 sm:h-12"
                : "w-9 h-9 sm:w-11 sm:h-11";

    const previewArea = previewRect
        ? (previewRect.r2 - previewRect.r1 + 1) * (previewRect.c2 - previewRect.c1 + 1)
        : 0;

    return (
        <PuzzleWorkspace
            gameId="patches"
            level={session.level}
            isDaily={session.isDaily}
            onSelectLevel={session.selectLevel}
            onToggleDaily={session.toggleDaily}
            moves={session.moves}
            elapsedSeconds={session.elapsedSeconds}
            solved={session.solved}
            starsEarned={session.starsEarned}
            canUndo={history.length > 0}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={session.resetSession}
            statusNote={
                previewRect
                    ? `Drawing ${previewRect.c2 - previewRect.c1 + 1} × ${previewRect.r2 - previewRect.r1 + 1} rectangle (Area ${previewArea})`
                    : `Patches completed: ${patches.length} / ${puzzle.solutionRects.length} · Drag to draw a patch · Click a patch to remove`
            }
        >
            <div
                onPointerUp={commitDrag}
                onPointerLeave={() => {
                    if (dragStart) commitDrag();
                }}
                className="select-none touch-none inline-grid rounded-xl overflow-hidden border-2 border-slate-900 bg-white shadow-xs"
                style={{
                    gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                }}
            >
                {Array.from({ length: puzzle.size }, (_, r) =>
                    Array.from({ length: puzzle.size }, (_, c) => {
                        const key = `${r},${c}`;
                        const clue = puzzle.clues[key];
                        const patch = patchAtCell.get(key);
                        const inPreview =
                            previewRect !== null &&
                            r >= previewRect.r1 &&
                            r <= previewRect.r2 &&
                            c >= previewRect.c1 &&
                            c <= previewRect.c2;

                        const palette = patch ? REGION_PALETTE[patch.colorIndex % REGION_PALETTE.length] : null;

                        const borderTop =
                            patch && patch.r1 === r && r > 0
                                ? "2px solid #0F172A"
                                : patchAtCell.get(`${r - 1},${c}`)?.id !== patch?.id && patchAtCell.get(`${r - 1},${c}`)
                                  ? "2px solid #0F172A"
                                  : "1px solid #CBD5E1";

                        const borderLeft =
                            patch && patch.c1 === c && c > 0
                                ? "2px solid #0F172A"
                                : patchAtCell.get(`${r},${c - 1}`)?.id !== patch?.id && patchAtCell.get(`${r},${c - 1}`)
                                  ? "2px solid #0F172A"
                                  : "1px solid #CBD5E1";

                        return (
                            <div
                                key={key}
                                onPointerDown={() => {
                                    if (session.solved) return;
                                    setDragStart([r, c]);
                                    setDragEnd([r, c]);
                                    setFeedback(null);
                                }}
                                onPointerEnter={() => {
                                    if (dragStart) setDragEnd([r, c]);
                                }}
                                className={`${cellPx} flex items-center justify-center cursor-crosshair transition-colors`}
                                style={{
                                    backgroundColor: inPreview
                                        ? "#99F6E4"
                                        : palette
                                          ? palette.bg
                                          : "#FFFFFF",
                                    borderTop,
                                    borderLeft,
                                }}
                            >
                                {clue !== undefined && (
                                    <span className="text-base sm:text-lg font-extrabold text-[#161614] tabular-nums">
                                        {clue}
                                    </span>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {feedback && (
                <div
                    role="alert"
                    className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm font-medium"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{feedback}</span>
                </div>
            )}
        </PuzzleWorkspace>
    );
}
