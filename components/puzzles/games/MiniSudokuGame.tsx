"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, Eraser, Pencil } from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone } from "@/lib/puzzles/core";
import { generateMiniSudoku } from "@/lib/puzzles/generators/logic-grid";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";

interface SudokuStateSnapshot {
    board: number[][];
    notes: Record<string, number[]>;
}

export default function MiniSudokuGame() {
    const session = usePuzzleSession("mini-sudoku");
    const puzzle = useMemo(
        () => generateMiniSudoku(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [board, setBoard] = useState<number[][]>(() => puzzle.givens.map((r) => [...r]));
    const [notes, setNotes] = useState<Record<string, number[]>>({});
    const [history, setHistory] = useState<SudokuStateSnapshot[]>([]);
    const [selected, setSelected] = useState<[number, number] | null>(null);
    const [notesMode, setNotesMode] = useState<boolean>(false);
    const [hintCell, setHintCell] = useState<string | null>(null);

    useEffect(() => {
        setBoard(puzzle.givens.map((r) => [...r]));
        setNotes({});
        setHistory([]);
        setSelected(null);
        setHintCell(null);
    }, [puzzle, session.resetToken]);

    // Real-time conflict detection
    const { conflicts, filledCount } = useMemo(() => {
        const bad = new Set<string>();
        let filled = 0;
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                const v = board[r]?.[c] ?? 0;
                if (v === 0) continue;
                filled++;
                for (let i = 0; i < 6; i++) {
                    if (i !== c && board[r][i] === v) {
                        bad.add(`${r},${c}`);
                        bad.add(`${r},${i}`);
                    }
                    if (i !== r && board[i][c] === v) {
                        bad.add(`${r},${c}`);
                        bad.add(`${i},${c}`);
                    }
                }
                const br = Math.floor(r / 2) * 2;
                const bc = Math.floor(c / 3) * 3;
                for (let dr = 0; dr < 2; dr++) {
                    for (let dc = 0; dc < 3; dc++) {
                        const nr = br + dr;
                        const nc = bc + dc;
                        if ((nr !== r || nc !== c) && board[nr][nc] === v) {
                            bad.add(`${r},${c}`);
                            bad.add(`${nr},${nc}`);
                        }
                    }
                }
            }
        }
        return { conflicts: bad, filledCount: filled };
    }, [board]);

    useEffect(() => {
        if (!session.solved && filledCount === 36 && conflicts.size === 0) {
            session.markSolved();
        }
    }, [filledCount, conflicts.size, session]);

    const enterDigit = useCallback(
        (digit: number) => {
            if (!selected || session.solved) return;
            const [r, c] = selected;
            if (puzzle.givens[r][c] !== 0) return;

            const snapshot: SudokuStateSnapshot = {
                board: board.map((row) => [...row]),
                notes: Object.fromEntries(Object.entries(notes).map(([k, v]) => [k, [...v]])),
            };

            const key = `${r},${c}`;
            if (notesMode && digit > 0) {
                const nextNotes = { ...notes };
                const currList = nextNotes[key] ? [...nextNotes[key]] : [];
                const idx = currList.indexOf(digit);
                if (idx >= 0) currList.splice(idx, 1);
                else currList.push(digit);
                nextNotes[key] = currList.sort((a, b) => a - b);
                setHistory((h) => [...h.slice(-40), snapshot]);
                setNotes(nextNotes);
                playPuzzleTone("tap");
                return;
            }

            const nextBoard = board.map((row) => [...row]);
            nextBoard[r][c] = digit;
            const nextNotes = { ...notes };
            delete nextNotes[key];

            setHistory((h) => [...h.slice(-40), snapshot]);
            setBoard(nextBoard);
            setNotes(nextNotes);
            session.setMoves((m) => m + 1);
            setHintCell(null);
            playPuzzleTone(digit === 0 ? "tap" : "place");
        },
        [selected, session, puzzle.givens, board, notes, notesMode]
    );

    // Keyboard controls (1-6, Backspace/Delete, Arrows, N for Notes)
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (session.solved) return;
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.key >= "1" && e.key <= "6") {
                e.preventDefault();
                enterDigit(Number(e.key));
            } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
                e.preventDefault();
                enterDigit(0);
            } else if (e.key === "n" || e.key === "N") {
                e.preventDefault();
                setNotesMode((v) => !v);
            } else if (selected && ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
                e.preventDefault();
                const [r, c] = selected;
                const dr = e.key === "ArrowUp" ? -1 : e.key === "ArrowDown" ? 1 : 0;
                const dc = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
                setSelected([(r + dr + 6) % 6, (c + dc + 6) % 6]);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [enterDigit, selected, session.solved]);

    const handleUndo = () => {
        if (history.length === 0 || session.solved) return;
        const last = history[history.length - 1];
        setBoard(last.board);
        setNotes(last.notes);
        setHistory((h) => h.slice(0, -1));
        playPuzzleTone("tap");
    };

    const handleHint = () => {
        if (session.solved) return;
        const target =
            selected && board[selected[0]][selected[1]] !== puzzle.solution[selected[0]][selected[1]]
                ? selected
                : (() => {
                      for (let r = 0; r < 6; r++) {
                          for (let c = 0; c < 6; c++) {
                              if (board[r][c] !== puzzle.solution[r][c]) return [r, c] as [number, number];
                          }
                      }
                      return null;
                  })();

        if (!target) return;
        const [r, c] = target;
        const nextBoard = board.map((row) => [...row]);
        nextBoard[r][c] = puzzle.solution[r][c];
        setHistory((h) => [
            ...h.slice(-40),
            { board: board.map((row) => [...row]), notes: { ...notes } },
        ]);
        setBoard(nextBoard);
        setSelected([r, c]);
        setHintCell(`${r},${c}`);
        session.setHintsUsed((n) => n + 1);
        playPuzzleTone("hint");
    };

    const selectedDigit = selected ? board[selected[0]][selected[1]] : 0;

    return (
        <PuzzleWorkspace
            gameId="mini-sudoku"
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
            statusNote={`6×6 Shaded Regions · Filled: ${filledCount}/36 · Keyboard 1–6 & Arrows supported`}
            extraControls={
                <button
                    type="button"
                    onClick={() => {
                        setNotesMode((v) => !v);
                        playPuzzleTone("tap");
                    }}
                    aria-pressed={notesMode}
                    className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap ${
                        notesMode
                            ? "bg-violet-50 text-violet-800 border-violet-300"
                            : "bg-white text-[#57554E] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                    }`}
                >
                    <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Notes: {notesMode ? "On" : "Off"}</span>
                </button>
            }
        >
            {/* 6x6 Mini Sudoku Grid */}
            <div
                className="w-full max-w-[336px] aspect-square grid grid-cols-6 rounded-xl overflow-hidden border-2 border-slate-900 select-none shadow-xs"
                role="grid"
                aria-label="6 by 6 Mini Sudoku grid"
            >
                {Array.from({ length: 6 }, (_, r) =>
                    Array.from({ length: 6 }, (_, c) => {
                        const val = board[r][c];
                        const isGiven = puzzle.givens[r][c] !== 0;
                        const key = `${r},${c}`;
                        const cellNotes = notes[key] || [];
                        const isSelected = selected?.[0] === r && selected?.[1] === c;
                        const isSamePeer =
                            selected !== null &&
                            (selected[0] === r ||
                                selected[1] === c ||
                                (Math.floor(selected[0] / 2) === Math.floor(r / 2) &&
                                    Math.floor(selected[1] / 3) === Math.floor(c / 3)));
                        const isSameDigit = selectedDigit > 0 && val === selectedDigit;
                        const isConflict = conflicts.has(key);
                        const isHint = hintCell === key;

                        // Checkerboard shaded 2x3 regions
                        const boxShade = (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 1;
                        const thickTop = r === 2 || r === 4;
                        const thickLeft = c === 3;

                        let bg = boxShade ? "#F1F5F9" : "#FFFFFF";
                        if (isSamePeer) bg = boxShade ? "#E8EEF8" : "#F5F3FF";
                        if (isSameDigit) bg = "#DDD6FE";
                        if (isSelected) bg = "#C4B5FD";
                        if (isConflict) bg = "#FEE2E2";

                        return (
                            <button
                                key={key}
                                type="button"
                                onClick={() => {
                                    setSelected([r, c]);
                                    playPuzzleTone("tap");
                                }}
                                aria-label={`Row ${r + 1} Column ${c + 1} ${val ? `value ${val}` : "empty"}`}
                                className="w-full aspect-square relative flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-violet-700"
                                style={{
                                    backgroundColor: bg,
                                    borderTop: thickTop ? "2px solid #0F172A" : "1px solid #CBD5E1",
                                    borderLeft: thickLeft ? "2px solid #0F172A" : "1px solid #CBD5E1",
                                    boxShadow: isHint ? "inset 0 0 0 2.5px #D97706" : undefined,
                                }}
                            >
                                {val > 0 ? (
                                    <span
                                        className={`text-xl sm:text-2xl tabular-nums ${
                                            isConflict
                                                ? "font-extrabold text-rose-700"
                                                : isGiven
                                                  ? "font-extrabold text-[#161614]"
                                                  : "font-bold text-violet-700"
                                        }`}
                                    >
                                        {val}
                                    </span>
                                ) : (
                                    cellNotes.length > 0 && (
                                        <div className="grid grid-cols-3 gap-x-1 text-[10px] leading-tight font-semibold text-[#78756C] tabular-nums">
                                            {[1, 2, 3, 4, 5, 6].map((n) => (
                                                <span key={n} className="w-2.5 text-center">
                                                    {cellNotes.includes(n) ? n : ""}
                                                </span>
                                            ))}
                                        </div>
                                    )
                                )}
                            </button>
                        );
                    })
                )}
            </div>

            {/* Number Keypad */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                        key={num}
                        type="button"
                        disabled={!selected || session.solved}
                        onClick={() => enterDigit(num)}
                        className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl border border-[#E6E3DB] bg-white hover:bg-violet-50 hover:border-violet-300 text-lg font-extrabold text-[#161614] tabular-nums transition-colors disabled:opacity-40"
                    >
                        {num}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={!selected || session.solved}
                    onClick={() => enterDigit(0)}
                    aria-label="Erase cell"
                    className="h-11 sm:h-12 px-3.5 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#3F3E39] text-xs font-semibold inline-flex items-center gap-1.5 transition-colors disabled:opacity-40"
                >
                    <Eraser className="w-4 h-4" aria-hidden="true" />
                    <span>Clear</span>
                </button>
            </div>

            {conflicts.size > 0 && (
                <div
                    role="alert"
                    className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm font-medium"
                >
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>Duplicate digit detected in a highlighted row, column, or 2×3 shaded box.</span>
                </div>
            )}
        </PuzzleWorkspace>
    );
}
