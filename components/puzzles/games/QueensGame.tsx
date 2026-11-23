"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, Crown, Sparkles, X } from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { REGION_PALETTE, playPuzzleTone } from "@/lib/puzzles/core";
import { generateQueens } from "@/lib/puzzles/generators/logic-grid";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";

type CellMark = 0 | 1 | 2; // 0 = empty, 1 = X, 2 = Queen

export default function QueensGame() {
    const session = usePuzzleSession("queens");
    const puzzle = useMemo(
        () => generateQueens(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [board, setBoard] = useState<CellMark[][]>(() =>
        Array.from({ length: puzzle.size }, () => new Array<CellMark>(puzzle.size).fill(0))
    );
    const [history, setHistory] = useState<CellMark[][][]>([]);
    const [autoX, setAutoX] = useState<boolean>(true);
    const [hintCell, setHintCell] = useState<string | null>(null);
    const paintingXRef = useRef<boolean>(false);

    useEffect(() => {
        setBoard(Array.from({ length: puzzle.size }, () => new Array<CellMark>(puzzle.size).fill(0)));
        setHistory([]);
        setHintCell(null);
    }, [puzzle, session.resetToken]);

    // Analyze conflicts & victory
    const analysis = useMemo(() => {
        const queens: [number, number][] = [];
        for (let r = 0; r < puzzle.size; r++) {
            for (let c = 0; c < puzzle.size; c++) {
                if (board[r]?.[c] === 2) queens.push([r, c]);
            }
        }

        const conflictSet = new Set<string>();
        const messages: string[] = [];

        for (let i = 0; i < queens.length; i++) {
            for (let j = i + 1; j < queens.length; j++) {
                const [r1, c1] = queens[i];
                const [r2, c2] = queens[j];
                const k1 = `${r1},${c1}`;
                const k2 = `${r2},${c2}`;
                if (r1 === r2) {
                    conflictSet.add(k1);
                    conflictSet.add(k2);
                    messages.push(`Row ${r1 + 1} has more than one Queen.`);
                }
                if (c1 === c2) {
                    conflictSet.add(k1);
                    conflictSet.add(k2);
                    messages.push(`Column ${c1 + 1} has more than one Queen.`);
                }
                if (puzzle.regions[r1][c1] === puzzle.regions[r2][c2]) {
                    conflictSet.add(k1);
                    conflictSet.add(k2);
                    messages.push("A colored region contains more than one Queen.");
                }
                if (Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1) {
                    conflictSet.add(k1);
                    conflictSet.add(k2);
                    messages.push("Two Queens cannot touch — not even diagonally.");
                }
            }
        }

        const isSolved = queens.length === puzzle.size && conflictSet.size === 0;
        return {
            queenCount: queens.length,
            conflictSet,
            messages: Array.from(new Set(messages)),
            isSolved,
        };
    }, [board, puzzle]);

    useEffect(() => {
        if (analysis.isSolved && !session.solved) {
            session.markSolved();
        }
    }, [analysis.isSolved, session]);

    const applyBoard = (next: CellMark[][], tone: "tap" | "place" | "error") => {
        setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
        setBoard(next);
        session.setMoves((m) => m + 1);
        setHintCell(null);
        playPuzzleTone(tone);
    };

    const handleCellClick = (r: number, c: number) => {
        if (session.solved) return;
        const curr = board[r][c];
        const nextVal: CellMark = curr === 0 ? 1 : curr === 1 ? 2 : 0;
        const next = board.map((row) => [...row]);
        next[r][c] = nextVal;

        // Auto-X conflicting cells when placing a Queen
        if (nextVal === 2 && autoX) {
            const reg = puzzle.regions[r][c];
            for (let rr = 0; rr < puzzle.size; rr++) {
                for (let cc = 0; cc < puzzle.size; cc++) {
                    if (rr === r && cc === c) continue;
                    if (next[rr][cc] !== 0) continue;
                    const sameLine = rr === r || cc === c;
                    const sameRegion = puzzle.regions[rr][cc] === reg;
                    const touching = Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1;
                    if (sameLine || sameRegion || touching) {
                        next[rr][cc] = 1;
                    }
                }
            }
        }

        applyBoard(next, nextVal === 2 ? "place" : "tap");
    };

    const handlePointerEnter = (r: number, c: number) => {
        if (!paintingXRef.current || session.solved) return;
        if (board[r][c] === 0) {
            setBoard((prev) => {
                const next = prev.map((row) => [...row]);
                next[r][c] = 1;
                return next;
            });
            playPuzzleTone("tap");
        }
    };

    const handleUndo = () => {
        if (history.length === 0 || session.solved) return;
        const prev = history[history.length - 1];
        setHistory((h) => h.slice(0, -1));
        setBoard(prev);
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        // First clear any wrongly placed queen, otherwise place a missing solution queen
        const solKeys = new Set(puzzle.solution.map(([r, c]) => `${r},${c}`));
        const next = board.map((row) => [...row]);
        for (let r = 0; r < puzzle.size; r++) {
            for (let c = 0; c < puzzle.size; c++) {
                if (next[r][c] === 2 && !solKeys.has(`${r},${c}`)) {
                    next[r][c] = 1;
                    setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
                    setBoard(next);
                    setHintCell(`${r},${c}`);
                    session.setHintsUsed((n) => n + 1);
                    playPuzzleTone("hint");
                    return;
                }
            }
        }
        for (const [r, c] of puzzle.solution) {
            if (next[r][c] !== 2) {
                next[r][c] = 2;
                setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
                setBoard(next);
                setHintCell(`${r},${c}`);
                session.setHintsUsed((n) => n + 1);
                playPuzzleTone("hint");
                return;
            }
        }
    };

    const cellPx = puzzle.size <= 6 ? "w-12 h-12 sm:w-14 sm:h-14" : puzzle.size <= 7 ? "w-11 h-11 sm:w-13 sm:h-13" : "w-9 h-9 sm:w-11 sm:h-11";

    return (
        <PuzzleWorkspace
            gameId="queens"
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
            statusNote={`Queens placed: ${analysis.queenCount} / ${puzzle.size} · ${puzzle.size}×${puzzle.size} board · Tap once for ×, twice for Queen`}
            extraControls={
                <button
                    type="button"
                    onClick={() => {
                        setAutoX((v) => !v);
                        playPuzzleTone("tap");
                    }}
                    aria-pressed={autoX}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                        autoX
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : "bg-white text-[#57554E] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Auto-X: {autoX ? "On" : "Off"}</span>
                </button>
            }
        >
            {/* Board Grid */}
            <div
                onPointerUp={() => {
                    paintingXRef.current = false;
                }}
                onPointerLeave={() => {
                    paintingXRef.current = false;
                }}
                className="select-none touch-none inline-grid rounded-xl overflow-hidden border-2 border-slate-900 shadow-xs"
                style={{
                    gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                }}
            >
                {Array.from({ length: puzzle.size }, (_, r) =>
                    Array.from({ length: puzzle.size }, (_, c) => {
                        const reg = puzzle.regions[r][c];
                        const palette = REGION_PALETTE[reg % REGION_PALETTE.length];
                        const val = board[r]?.[c] ?? 0;
                        const key = `${r},${c}`;
                        const isConflict = analysis.conflictSet.has(key);
                        const isHinted = hintCell === key;

                        const topDiff = r > 0 && puzzle.regions[r - 1][c] !== reg;
                        const leftDiff = c > 0 && puzzle.regions[r][c - 1] !== reg;

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => handleCellClick(r, c)}
                                onPointerDown={(e) => {
                                    if (e.buttons === 1 && val === 0) {
                                        paintingXRef.current = true;
                                    }
                                }}
                                onPointerEnter={() => handlePointerEnter(r, c)}
                                aria-label={`Row ${r + 1}, Column ${c + 1}, ${val === 2 ? "Queen" : val === 1 ? "Marked empty" : "Blank"}`}
                                className={`${cellPx} relative flex items-center justify-center transition-transform active:scale-95 focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-slate-900`}
                                style={{
                                    backgroundColor: isConflict ? "#FEE2E2" : palette.bg,
                                    borderTop: topDiff ? "2px solid #0F172A" : "1px solid rgba(15,23,42,0.16)",
                                    borderLeft: leftDiff ? "2px solid #0F172A" : "1px solid rgba(15,23,42,0.16)",
                                    boxShadow: isHinted ? "inset 0 0 0 3px #D97706" : undefined,
                                }}
                            >
                                {val === 1 && (
                                    <X className="w-4 h-4 text-slate-600/75" strokeWidth={2.5} aria-hidden="true" />
                                )}
                                {val === 2 && (
                                    <Crown
                                        className={`w-6 h-6 transition-transform ${
                                            isConflict
                                                ? "text-rose-700 fill-rose-500/30"
                                                : "text-[#161614] fill-amber-400"
                                        }`}
                                        strokeWidth={2}
                                        aria-hidden="true"
                                    />
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Live Non-Hue-Only Conflict Diagnostic */}
            {analysis.messages.length > 0 && (
                <div
                    role="alert"
                    className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{analysis.messages[0]}</span>
                </div>
            )}
        </PuzzleWorkspace>
    );
}
