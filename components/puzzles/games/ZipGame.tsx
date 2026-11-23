"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone } from "@/lib/puzzles/core";
import { generateZip } from "@/lib/puzzles/generators/logic-grid";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";

export default function ZipGame() {
    const session = usePuzzleSession("zip");
    const puzzle = useMemo(
        () => generateZip(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const startCell = puzzle.solutionPath[0];
    const [path, setPath] = useState<[number, number][]>([startCell]);
    const [isDrawing, setIsDrawing] = useState(false);
    const boardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        setPath([puzzle.solutionPath[0]]);
        setIsDrawing(false);
    }, [puzzle, session.resetToken]);

    const wallSet = useMemo(() => {
        const s = new Set<string>();
        for (const w of puzzle.walls) {
            s.add(`${w.r1},${w.c1}|${w.r2},${w.c2}`);
            s.add(`${w.r2},${w.c2}|${w.r1},${w.c1}`);
        }
        return s;
    }, [puzzle.walls]);

    const pathIndexMap = useMemo(() => {
        const m = new Map<string, number>();
        path.forEach(([r, c], idx) => m.set(`${r},${c}`, idx));
        return m;
    }, [path]);

    // Highest checkpoint validly visited in order so far
    const highestCheckpointReached = useMemo(() => {
        let highest = 1;
        for (const [r, c] of path) {
            const cp = puzzle.checkpoints[`${r},${c}`];
            if (cp === highest + 1) {
                highest = cp;
            }
        }
        return highest;
    }, [path, puzzle.checkpoints]);

    const totalCells = puzzle.size * puzzle.size;

    // Check victory
    useEffect(() => {
        if (session.solved) return;
        if (path.length !== totalCells) return;
        const [lastR, lastC] = path[path.length - 1];
        if (
            highestCheckpointReached === puzzle.maxCheckpoint &&
            puzzle.checkpoints[`${lastR},${lastC}`] === puzzle.maxCheckpoint
        ) {
            session.markSolved();
        }
    }, [path, totalCells, highestCheckpointReached, puzzle.maxCheckpoint, puzzle.checkpoints, session]);

    const tryMoveTo = (r: number, c: number) => {
        if (session.solved) return;
        const key = `${r},${c}`;
        const existingIdx = pathIndexMap.get(key);

        // Allow backtracking cleanly to any previously visited cell in the trail
        if (existingIdx !== undefined) {
            if (existingIdx < path.length - 1) {
                setPath((prev) => prev.slice(0, existingIdx + 1));
                playPuzzleTone("tap");
            }
            return;
        }

        const [tr, tc] = path[path.length - 1];
        const manhattan = Math.abs(tr - r) + Math.abs(tc - c);
        if (manhattan !== 1) return;
        if (wallSet.has(`${tr},${tc}|${r},${c}`)) {
            playPuzzleTone("error");
            return;
        }

        // Enforce checkpoint ascending order: cannot step onto a future checkpoint out of order
        const cp = puzzle.checkpoints[key];
        if (cp !== undefined && cp !== highestCheckpointReached + 1) {
            playPuzzleTone("error");
            return;
        }

        setPath((prev) => [...prev, [r, c]]);
        session.setMoves((m) => m + 1);
        playPuzzleTone(cp ? "merge" : "place");
    };

    const handleUndo = () => {
        if (path.length <= 1 || session.solved) return;
        setPath((prev) => prev.slice(0, -1));
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        // Find longest valid prefix matching solutionPath, then advance 2 steps
        let matchLen = 0;
        while (
            matchLen < path.length &&
            matchLen < puzzle.solutionPath.length &&
            path[matchLen][0] === puzzle.solutionPath[matchLen][0] &&
            path[matchLen][1] === puzzle.solutionPath[matchLen][1]
        ) {
            matchLen++;
        }
        const targetLen = Math.min(puzzle.solutionPath.length, Math.max(1, matchLen) + 2);
        setPath(puzzle.solutionPath.slice(0, targetLen));
        session.setHintsUsed((n) => n + 1);
        playPuzzleTone("hint");
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (!isDrawing || !boardRef.current) return;
        const rect = boardRef.current.getBoundingClientRect();
        const relX = e.clientX - rect.left;
        const relY = e.clientY - rect.top;
        if (relX < 0 || relY < 0 || relX >= rect.width || relY >= rect.height) return;
        const c = Math.floor((relX / rect.width) * puzzle.size);
        const r = Math.floor((relY / rect.height) * puzzle.size);
        if (r >= 0 && r < puzzle.size && c >= 0 && c < puzzle.size) {
            tryMoveTo(r, c);
        }
    };

    const boardPx = puzzle.size <= 5 ? 320 : puzzle.size === 6 ? 348 : 378;
    const cellSize = boardPx / puzzle.size;

    const svgPoints = path
        .map(([r, c]) => `${c * cellSize + cellSize / 2},${r * cellSize + cellSize / 2}`)
        .join(" ");

    return (
        <PuzzleWorkspace
            gameId="zip"
            level={session.level}
            isDaily={session.isDaily}
            onSelectLevel={session.selectLevel}
            onToggleDaily={session.toggleDaily}
            moves={session.moves}
            elapsedSeconds={session.elapsedSeconds}
            solved={session.solved}
            starsEarned={session.starsEarned}
            canUndo={path.length > 1}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={session.resetSession}
            statusNote={`Cells filled: ${path.length} / ${totalCells} · Next checkpoint: ${Math.min(puzzle.maxCheckpoint, highestCheckpointReached + 1)} / ${puzzle.maxCheckpoint}`}
        >
            <div
                ref={boardRef}
                onPointerDown={(e) => {
                    setIsDrawing(true);
                    handlePointerMove(e);
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={() => setIsDrawing(false)}
                onPointerLeave={() => setIsDrawing(false)}
                className="relative w-full aspect-square select-none touch-none rounded-2xl overflow-hidden border-2 border-slate-900 bg-white shadow-xs"
                style={{ maxWidth: boardPx }}
            >
                {/* Continuous SVG Ribbon Overlay */}
                <svg
                    viewBox={`0 0 ${boardPx} ${boardPx}`}
                    className="pointer-events-none absolute inset-0 z-10 w-full h-full"
                    aria-hidden="true"
                >
                    {path.length > 1 && (
                        <polyline
                            points={svgPoints}
                            fill="none"
                            stroke="#059669"
                            strokeWidth={Math.max(18, cellSize * 0.42)}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            opacity={0.88}
                        />
                    )}
                    {path.length === 1 && (
                        <circle
                            cx={path[0][1] * cellSize + cellSize / 2}
                            cy={path[0][0] * cellSize + cellSize / 2}
                            r={cellSize * 0.24}
                            fill="#059669"
                            opacity={0.35}
                        />
                    )}
                </svg>

                {/* Interactive Cell Matrix */}
                <div
                    className="grid w-full h-full relative z-20"
                    style={{
                        gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                        gridTemplateRows: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from({ length: puzzle.size }, (_, r) =>
                        Array.from({ length: puzzle.size }, (_, c) => {
                            const key = `${r},${c}`;
                            const cp = puzzle.checkpoints[key];
                            const visitedIdx = pathIndexMap.get(key);
                            const isVisited = visitedIdx !== undefined;
                            const isHead = visitedIdx === path.length - 1;

                            const wallTop = wallSet.has(`${r},${c}|${r - 1},${c}`);
                            const wallBottom = wallSet.has(`${r},${c}|${r + 1},${c}`);
                            const wallLeft = wallSet.has(`${r},${c}|${r},${c - 1}`);
                            const wallRight = wallSet.has(`${r},${c}|${r},${c + 1}`);

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => tryMoveTo(r, c)}
                                    aria-label={`Row ${r + 1} Column ${c + 1}${cp ? ` Checkpoint ${cp}` : ""}${isVisited ? " visited" : ""}`}
                                    className="relative flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-700"
                                    style={{
                                        borderTop: wallTop ? "4px solid #0F172A" : "1px solid #E2E8F0",
                                        borderBottom: wallBottom ? "4px solid #0F172A" : "none",
                                        borderLeft: wallLeft ? "4px solid #0F172A" : "1px solid #E2E8F0",
                                        borderRight: wallRight ? "4px solid #0F172A" : "none",
                                        backgroundColor: isVisited ? "rgba(5, 150, 105, 0.08)" : "transparent",
                                    }}
                                >
                                    {cp !== undefined && (
                                        <span
                                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-extrabold tabular-nums transition-transform ${
                                                isHead
                                                    ? "bg-slate-950 text-white scale-110 ring-2 ring-white"
                                                    : isVisited
                                                      ? "bg-slate-900 text-white"
                                                      : "bg-slate-800 text-white shadow-xs"
                                            }`}
                                        >
                                            {cp}
                                        </span>
                                    )}
                                    {cp === undefined && isHead && (
                                        <span className="w-3.5 h-3.5 rounded-full bg-white ring-2 ring-emerald-800" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </PuzzleWorkspace>
    );
}
