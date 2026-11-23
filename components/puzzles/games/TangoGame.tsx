"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AlertCircle, Lock, Moon, Sun } from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone } from "@/lib/puzzles/core";
import {
    generateTango,
    validateTangoBoard,
    type TangoToken,
} from "@/lib/puzzles/generators/logic-grid";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";

export default function TangoGame() {
    const session = usePuzzleSession("tango");
    const puzzle = useMemo(
        () => generateTango(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [board, setBoard] = useState<TangoToken[][]>(() =>
        puzzle.givens.map((row) => [...row])
    );
    const [history, setHistory] = useState<TangoToken[][][]>([]);
    const [hintCell, setHintCell] = useState<string | null>(null);

    useEffect(() => {
        setBoard(puzzle.givens.map((row) => [...row]));
        setHistory([]);
        setHintCell(null);
    }, [puzzle, session.resetToken]);

    const validation = useMemo(
        () => validateTangoBoard(board, puzzle.clues),
        [board, puzzle.clues]
    );

    useEffect(() => {
        if (validation.isSolved && !session.solved) {
            session.markSolved();
        }
    }, [validation.isSolved, session]);

    // Quick clue lookup by "r1,c1|r2,c2"
    const clueMap = useMemo(() => {
        const m = new Map<string, "=" | "×">();
        for (const cl of puzzle.clues) {
            m.set(`${cl.r1},${cl.c1}|${cl.r2},${cl.c2}`, cl.type);
        }
        return m;
    }, [puzzle.clues]);

    const handleCellClick = (r: number, c: number) => {
        if (session.solved) return;
        if (puzzle.givens[r][c] !== 0) return;

        const curr = board[r][c];
        const nextVal: TangoToken = curr === 0 ? 1 : curr === 1 ? 2 : 0;
        const next = board.map((row) => [...row]);
        next[r][c] = nextVal;

        setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
        setBoard(next);
        session.setMoves((m) => m + 1);
        setHintCell(null);
        playPuzzleTone(nextVal === 0 ? "tap" : "place");
    };

    const handleUndo = () => {
        if (history.length === 0 || session.solved) return;
        setBoard(history[history.length - 1]);
        setHistory((h) => h.slice(0, -1));
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        const next = board.map((row) => [...row]);
        // Correct first wrong cell or reveal first empty cell
        for (let r = 0; r < puzzle.size; r++) {
            for (let c = 0; c < puzzle.size; c++) {
                if (next[r][c] !== 0 && next[r][c] !== puzzle.solution[r][c]) {
                    next[r][c] = puzzle.solution[r][c];
                    setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
                    setBoard(next);
                    setHintCell(`${r},${c}`);
                    session.setHintsUsed((n) => n + 1);
                    playPuzzleTone("hint");
                    return;
                }
            }
        }
        for (let r = 0; r < puzzle.size; r++) {
            for (let c = 0; c < puzzle.size; c++) {
                if (next[r][c] === 0) {
                    next[r][c] = puzzle.solution[r][c];
                    setHistory((h) => [...h.slice(-40), board.map((row) => [...row])]);
                    setBoard(next);
                    setHintCell(`${r},${c}`);
                    session.setHintsUsed((n) => n + 1);
                    playPuzzleTone("hint");
                    return;
                }
            }
        }
    };

    const cellClass =
        puzzle.size === 6
            ? "w-12 h-12 sm:w-14 sm:h-14"
            : "w-10 h-10 sm:w-11 sm:h-11";

    const half = puzzle.size / 2;

    return (
        <PuzzleWorkspace
            gameId="tango"
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
            statusNote={`Target: ${half} Suns & ${half} Moons per row and column · Max 2 adjacent · = Same · × Opposite`}
        >
            <div className="relative p-2 bg-[#F3F1EB] border-2 border-slate-900 rounded-2xl select-none">
                <div
                    className="grid gap-1.5"
                    style={{
                        gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from({ length: puzzle.size }, (_, r) =>
                        Array.from({ length: puzzle.size }, (_, c) => {
                            const val = board[r]?.[c] ?? 0;
                            const isGiven = puzzle.givens[r][c] !== 0;
                            const key = `${r},${c}`;
                            const isError = validation.errorCells.has(key);
                            const isHint = hintCell === key;
                            const rightClue = clueMap.get(`${r},${c}|${r},${c + 1}`);
                            const bottomClue = clueMap.get(`${r},${c}|${r + 1},${c}`);

                            return (
                                <div key={key} className="relative">
                                    <button
                                        type="button"
                                        disabled={isGiven}
                                        onClick={() => handleCellClick(r, c)}
                                        aria-label={`Row ${r + 1} Column ${c + 1} ${val === 1 ? "Sun" : val === 2 ? "Moon" : "Empty"}${isGiven ? " locked" : ""}`}
                                        className={`${cellClass} rounded-xl border flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 ${
                                            isError
                                                ? "bg-rose-50 border-rose-500"
                                                : isGiven
                                                  ? "bg-slate-200/80 border-[#D8D4C9] cursor-default"
                                                  : "bg-white border-[#E6E3DB] hover:border-slate-400 active:scale-95"
                                        }`}
                                        style={{
                                            boxShadow: isHint ? "inset 0 0 0 2.5px #D97706" : undefined,
                                        }}
                                    >
                                        {val === 1 && (
                                            <Sun
                                                className="w-6 h-6 text-amber-500 fill-amber-400"
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {val === 2 && (
                                            <Moon
                                                className="w-5 h-5 text-indigo-700 fill-indigo-600"
                                                strokeWidth={2.2}
                                                aria-hidden="true"
                                            />
                                        )}
                                        {isGiven && (
                                            <Lock
                                                className="w-2.5 h-2.5 text-[#78756C] absolute top-1 right-1"
                                                aria-hidden="true"
                                            />
                                        )}
                                    </button>

                                    {/* Right Edge Clue (= or ×) */}
                                    {rightClue && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute top-1/2 -right-3 -translate-y-1/2 z-20 w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs"
                                        >
                                            {rightClue}
                                        </span>
                                    )}

                                    {/* Bottom Edge Clue (= or ×) */}
                                    {bottomClue && (
                                        <span
                                            aria-hidden="true"
                                            className="pointer-events-none absolute left-1/2 -bottom-3 -translate-x-1/2 z-20 w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] font-extrabold flex items-center justify-center shadow-xs"
                                        >
                                            {bottomClue}
                                        </span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {validation.messages.length > 0 && (
                <div
                    role="alert"
                    className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{validation.messages[0]}</span>
                </div>
            )}
        </PuzzleWorkspace>
    );
}
