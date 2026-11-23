"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowDown,
    ArrowUp,
    Check,
    Link2,
    Lock,
    Unlock,
} from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone } from "@/lib/puzzles/core";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";
import {
    generateCrossclimb,
    isOneLetterDiff,
    type CrossclimbRung,
} from "@/lib/puzzles/generators/word-and-sum";

interface MiddleRowState {
    id: string;
    target: CrossclimbRung;
    entry: string;
    solved: boolean;
}

export function CrossclimbGame() {
    const session = usePuzzleSession("crossclimb");

    const puzzle = useMemo(
        () => generateCrossclimb(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [rows, setRows] = useState<MiddleRowState[]>(() =>
        puzzle.middleScrambled.map((rung, idx) => ({
            id: `mid-${idx}-${rung.word}`,
            target: rung,
            entry: "",
            solved: false,
        }))
    );
    const [topEntry, setTopEntry] = useState<string>("");
    const [bottomEntry, setBottomEntry] = useState<string>("");
    const [topSolved, setTopSolved] = useState<boolean>(false);
    const [bottomSolved, setBottomSolved] = useState<boolean>(false);
    const [feedback, setFeedback] = useState<string | null>(null);

    useEffect(() => {
        setRows(
            puzzle.middleScrambled.map((rung, idx) => ({
                id: `mid-${idx}-${rung.word}`,
                target: rung,
                entry: "",
                solved: false,
            }))
        );
        setTopEntry("");
        setBottomEntry("");
        setTopSolved(false);
        setBottomSolved(false);
        setFeedback(null);
    }, [puzzle, session.resetToken]);

    const allMiddleSolved = useMemo(() => rows.every((r) => r.solved), [rows]);

    // Check if adjacent middle rungs form a valid 1-letter-different ladder
    const middleTransitions = useMemo(() => {
        const res: boolean[] = [];
        for (let i = 0; i < rows.length - 1; i++) {
            res.push(
                rows[i].solved &&
                    rows[i + 1].solved &&
                    isOneLetterDiff(rows[i].target.word, rows[i + 1].target.word)
            );
        }
        return res;
    }, [rows]);

    const middleOrderedValid = useMemo(
        () => allMiddleSolved && middleTransitions.every(Boolean),
        [allMiddleSolved, middleTransitions]
    );

    // Match top & bottom rung to whichever orientation the player ordered the middle ladder!
    const { activeTop, activeBottom } = useMemo(() => {
        if (!middleOrderedValid || rows.length === 0) {
            return { activeTop: puzzle.top, activeBottom: puzzle.bottom };
        }
        const firstWord = rows[0].target.word;
        const lastWord = rows[rows.length - 1].target.word;
        if (
            isOneLetterDiff(puzzle.top.word, firstWord) &&
            isOneLetterDiff(puzzle.bottom.word, lastWord)
        ) {
            return { activeTop: puzzle.top, activeBottom: puzzle.bottom };
        }
        if (
            isOneLetterDiff(puzzle.bottom.word, firstWord) &&
            isOneLetterDiff(puzzle.top.word, lastWord)
        ) {
            return { activeTop: puzzle.bottom, activeBottom: puzzle.top };
        }
        return { activeTop: puzzle.top, activeBottom: puzzle.bottom };
    }, [middleOrderedValid, rows, puzzle.top, puzzle.bottom]);

    const phase: 1 | 2 | 3 = !allMiddleSolved ? 1 : !middleOrderedValid ? 2 : 3;

    const handleMiddleChange = (rowIdx: number, raw: string) => {
        if (session.solved) return;
        const clean = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, puzzle.wordLength);
        setRows((prev) =>
            prev.map((row, idx) => {
                if (idx !== rowIdx || row.solved) return row;
                const isExact = clean === row.target.word;
                if (isExact) {
                    session.setMoves((m) => m + 1);
                    playPuzzleTone("place");
                    setFeedback(`Solved "${clean}"!`);
                }
                return {
                    ...row,
                    entry: clean,
                    solved: isExact,
                };
            })
        );
    };

    const moveRow = (idx: number, delta: -1 | 1) => {
        if (session.solved || phase === 3) return;
        const targetIdx = idx + delta;
        if (targetIdx < 0 || targetIdx >= rows.length) return;
        setRows((prev) => {
            const copy = [...prev];
            const tmp = copy[idx];
            copy[idx] = copy[targetIdx];
            copy[targetIdx] = tmp;
            return copy;
        });
        session.setMoves((m) => m + 1);
        playPuzzleTone("tap");
    };

    const handleTopChange = (raw: string) => {
        if (session.solved || phase !== 3 || topSolved) return;
        const clean = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, puzzle.wordLength);
        setTopEntry(clean);
        if (clean === activeTop.word) {
            setTopSolved(true);
            session.setMoves((m) => m + 1);
            playPuzzleTone("place");
            if (bottomSolved) {
                session.markSolved();
            }
        }
    };

    const handleBottomChange = (raw: string) => {
        if (session.solved || phase !== 3 || bottomSolved) return;
        const clean = raw.toUpperCase().replace(/[^A-Z]/g, "").slice(0, puzzle.wordLength);
        setBottomEntry(clean);
        if (clean === activeBottom.word) {
            setBottomSolved(true);
            session.setMoves((m) => m + 1);
            playPuzzleTone("place");
            if (topSolved) {
                session.markSolved();
            }
        }
    };

    const handleHint = () => {
        if (session.solved) return;
        session.setHintsUsed((h) => h + 1);
        playPuzzleTone("hint");

        if (phase === 1) {
            // Reveal one unsolved middle word
            const idx = rows.findIndex((r) => !r.solved);
            if (idx !== -1) {
                const targetWord = rows[idx].target.word;
                setRows((prev) =>
                    prev.map((row, i) =>
                        i === idx ? { ...row, entry: targetWord, solved: true } : row
                    )
                );
                setFeedback(`Hint revealed middle rung "${targetWord}".`);
            }
            return;
        }

        if (phase === 2) {
            // Place the next out-of-order rung into its exact canonical solution position
            const targetOrder = puzzle.middleSolution.map((r) => r.word);
            const firstMismatch = rows.findIndex((r, i) => r.target.word !== targetOrder[i]);
            if (firstMismatch !== -1) {
                const neededWord = targetOrder[firstMismatch];
                const sourceIdx = rows.findIndex((r) => r.target.word === neededWord);
                if (sourceIdx !== -1) {
                    setRows((prev) => {
                        const copy = [...prev];
                        const tmp = copy[firstMismatch];
                        copy[firstMismatch] = copy[sourceIdx];
                        copy[sourceIdx] = tmp;
                        return copy;
                    });
                    setFeedback(`Hint positioned "${neededWord}" at rung ${firstMismatch + 1}.`);
                }
            }
            return;
        }

        // Phase 3: reveal Top or Bottom
        if (!topSolved) {
            setTopEntry(activeTop.word);
            setTopSolved(true);
            setFeedback(`Hint revealed top word "${activeTop.word}".`);
            if (bottomSolved) session.markSolved();
        } else if (!bottomSolved) {
            setBottomEntry(activeBottom.word);
            setBottomSolved(true);
            setFeedback(`Hint revealed bottom word "${activeBottom.word}".`);
            session.markSolved();
        }
    };

    const phaseLabel =
        phase === 1
            ? "Phase 1 of 3 · Solve all 5 middle word clues"
            : phase === 2
              ? "Phase 2 of 3 · Reorder rungs so every adjacent pair differs by 1 letter"
              : "Phase 3 of 3 · Top & Bottom unlocked! Complete both final words";

    const statusNote = feedback || phaseLabel;

    return (
        <PuzzleWorkspace
            gameId="crossclimb"
            level={session.level}
            isDaily={session.isDaily}
            onSelectLevel={session.selectLevel}
            onToggleDaily={session.toggleDaily}
            moves={session.moves}
            elapsedSeconds={session.elapsedSeconds}
            solved={session.solved}
            starsEarned={session.starsEarned}
            statusNote={statusNote}
            onHint={handleHint}
            onReset={session.resetSession}
        >
            <div className="w-full max-w-xl space-y-4">
                {/* 3-Step Phase Indicator */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                        { num: 1, title: "1. Solve Clues" },
                        { num: 2, title: "2. Order Ladder" },
                        { num: 3, title: "3. Top & Bottom" },
                    ].map((step) => {
                        const isDone = phase > step.num || session.solved;
                        const isCurrent = phase === step.num && !session.solved;
                        return (
                            <div
                                key={step.num}
                                className={`py-2 px-2 rounded-lg border text-xs font-bold ${
                                    isDone
                                        ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                                        : isCurrent
                                          ? "bg-orange-50 border-orange-300 text-orange-900"
                                          : "bg-[#FAF9F6] border-[#E6E3DB] text-slate-400"
                                }`}
                            >
                                {step.title}
                            </div>
                        );
                    })}
                </div>

                {/* TOP LOCKED / UNLOCKED RUNG */}
                <div
                    className={`rounded-xl border-2 p-3.5 transition-colors ${
                        topSolved
                            ? "border-emerald-300 bg-emerald-50/70"
                            : phase === 3
                              ? "border-orange-300 bg-orange-50/50"
                              : "border-[#E6E3DB] bg-[#F3F1EB]/80"
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#78756C]">
                                {phase === 3 ? (
                                    <Unlock className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
                                ) : (
                                    <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                )}
                                <span>Top Rung</span>
                            </div>
                            <p className="text-sm font-medium text-[#161614]">
                                {phase === 3
                                    ? activeTop.clue
                                    : "Order the 5 middle words into a 1-letter ladder to unlock."}
                            </p>
                        </div>
                        <input
                            type="text"
                            value={topSolved ? activeTop.word : topEntry}
                            onChange={(e) => handleTopChange(e.target.value)}
                            disabled={phase !== 3 || topSolved}
                            maxLength={puzzle.wordLength}
                            placeholder={phase === 3 ? "____" : "LOCK"}
                            aria-label="Top rung word"
                            className={`w-28 shrink-0 px-3 py-2 text-center font-mono text-base font-extrabold tracking-[0.25em] uppercase rounded-lg border-2 focus:outline-none ${
                                topSolved
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : phase === 3
                                      ? "bg-white text-[#161614] border-orange-400 focus:ring-2 focus:ring-orange-500"
                                      : "bg-[#E6E3DB] text-slate-400 border-[#D8D4C9] cursor-not-allowed"
                            }`}
                        />
                    </div>
                </div>

                {/* 5 MIDDLE LADDER RUNGS */}
                <div className="space-y-1.5">
                    {rows.map((row, idx) => {
                        const linkBelowOk =
                            idx < rows.length - 1 ? middleTransitions[idx] : false;
                        return (
                            <React.Fragment key={row.id}>
                                <div
                                    className={`rounded-xl border p-3 sm:px-4 transition-colors flex items-center justify-between gap-3 ${
                                        row.solved
                                            ? "bg-white border-emerald-200"
                                            : "bg-white border-[#E6E3DB]"
                                    }`}
                                >
                                    {/* Reorder Controls (active in Phase 1 & 2, locked once Phase 3 starts) */}
                                    <div className="flex flex-col gap-0.5 shrink-0">
                                        <button
                                            type="button"
                                            disabled={idx === 0 || phase === 3 || session.solved}
                                            onClick={() => moveRow(idx, -1)}
                                            aria-label={`Move rung ${idx + 1} up`}
                                            className="p-1 rounded border border-[#E6E3DB] bg-[#FAF9F6] text-[#57554E] hover:bg-[#F3F1EB] disabled:opacity-25"
                                        >
                                            <ArrowUp className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                        <button
                                            type="button"
                                            disabled={
                                                idx === rows.length - 1 ||
                                                phase === 3 ||
                                                session.solved
                                            }
                                            onClick={() => moveRow(idx, 1)}
                                            aria-label={`Move rung ${idx + 1} down`}
                                            className="p-1 rounded border border-[#E6E3DB] bg-[#FAF9F6] text-[#57554E] hover:bg-[#F3F1EB] disabled:opacity-25"
                                        >
                                            <ArrowDown className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {/* Clue */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-xs font-mono text-slate-400">
                                            Rung {idx + 1}
                                        </div>
                                        <p className="text-sm font-medium text-[#161614] leading-snug">
                                            {row.target.clue}
                                        </p>
                                    </div>

                                    {/* 4-Letter Entry */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        <input
                                            type="text"
                                            value={row.solved ? row.target.word : row.entry}
                                            onChange={(e) => handleMiddleChange(idx, e.target.value)}
                                            disabled={row.solved || session.solved}
                                            maxLength={puzzle.wordLength}
                                            placeholder="____"
                                            aria-label={`Middle rung ${idx + 1} answer`}
                                            className={`w-28 px-3 py-2 text-center font-mono text-base font-extrabold tracking-[0.25em] uppercase rounded-lg border-2 focus:outline-none ${
                                                row.solved
                                                    ? "bg-emerald-50 text-emerald-900 border-emerald-400"
                                                    : "bg-[#FAF9F6] text-[#161614] border-[#D8D4C9] focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
                                            }`}
                                        />
                                        {row.solved && (
                                            <Check
                                                className="w-4 h-4 text-emerald-600 shrink-0"
                                                aria-label="Solved"
                                            />
                                        )}
                                    </div>
                                </div>

                                {/* 1-Letter Diff Link Indicator between Rungs */}
                                {idx < rows.length - 1 && (
                                    <div className="flex items-center justify-center py-0.5">
                                        <div
                                            className={`inline-flex items-center gap-1.5 text-[11px] font-semibold ${
                                                linkBelowOk
                                                    ? "text-emerald-700"
                                                    : rows[idx].solved && rows[idx + 1].solved
                                                      ? "text-amber-700"
                                                      : "text-slate-300"
                                            }`}
                                        >
                                            <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
                                            <span>
                                                {linkBelowOk
                                                    ? "1-letter step verified"
                                                    : rows[idx].solved && rows[idx + 1].solved
                                                      ? "Needs 1-letter neighbor"
                                                      : "—"}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                {/* BOTTOM LOCKED / UNLOCKED RUNG */}
                <div
                    className={`rounded-xl border-2 p-3.5 transition-colors ${
                        bottomSolved
                            ? "border-emerald-300 bg-emerald-50/70"
                            : phase === 3
                              ? "border-orange-300 bg-orange-50/50"
                              : "border-[#E6E3DB] bg-[#F3F1EB]/80"
                    }`}
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-[#78756C]">
                                {phase === 3 ? (
                                    <Unlock className="w-3.5 h-3.5 text-orange-700" aria-hidden="true" />
                                ) : (
                                    <Lock className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
                                )}
                                <span>Bottom Rung</span>
                            </div>
                            <p className="text-sm font-medium text-[#161614]">
                                {phase === 3
                                    ? activeBottom.clue
                                    : "Order the 5 middle words into a 1-letter ladder to unlock."}
                            </p>
                        </div>
                        <input
                            type="text"
                            value={bottomSolved ? activeBottom.word : bottomEntry}
                            onChange={(e) => handleBottomChange(e.target.value)}
                            disabled={phase !== 3 || bottomSolved}
                            maxLength={puzzle.wordLength}
                            placeholder={phase === 3 ? "____" : "LOCK"}
                            aria-label="Bottom rung word"
                            className={`w-28 shrink-0 px-3 py-2 text-center font-mono text-base font-extrabold tracking-[0.25em] uppercase rounded-lg border-2 focus:outline-none ${
                                bottomSolved
                                    ? "bg-emerald-600 text-white border-emerald-700"
                                    : phase === 3
                                      ? "bg-white text-[#161614] border-orange-400 focus:ring-2 focus:ring-orange-500"
                                      : "bg-[#E6E3DB] text-slate-400 border-[#D8D4C9] cursor-not-allowed"
                            }`}
                        />
                    </div>
                </div>
            </div>
        </PuzzleWorkspace>
    );
}
