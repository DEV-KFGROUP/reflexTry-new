"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Compass, Eraser, Sparkles } from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone, REGION_PALETTE } from "@/lib/puzzles/core";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";
import {
    generateWend,
    type WendWordPlacement,
} from "@/lib/puzzles/generators/word-and-sum";

interface FoundWordEntry {
    word: string;
    path: [number, number][];
    colorIndex: number;
}

function cellKey(r: number, c: number): string {
    return `${r},${c}`;
}

function areAdjacent8(a: [number, number], b: [number, number]): boolean {
    const dr = Math.abs(a[0] - b[0]);
    const dc = Math.abs(a[1] - b[1]);
    return dr <= 1 && dc <= 1 && (dr !== 0 || dc !== 0);
}

export function WendGame() {
    const session = usePuzzleSession("wend");

    const puzzle = useMemo(
        () => generateWend(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [foundWords, setFoundWords] = useState<FoundWordEntry[]>([]);
    const [activePath, setActivePath] = useState<[number, number][]>([]);
    const [hintedWordIdx, setHintedWordIdx] = useState<number | null>(null);
    const [hintStage, setHintStage] = useState<0 | 1 | 2>(0); // 1 = start cell, 2 = full path highlight
    const [feedback, setFeedback] = useState<string | null>(null);

    const isDraggingRef = useRef(false);

    useEffect(() => {
        setFoundWords([]);
        setActivePath([]);
        setHintedWordIdx(null);
        setHintStage(0);
        setFeedback(null);
    }, [puzzle, session.resetToken]);

    // Map every claimed cell to its FoundWordEntry
    const claimedMap = useMemo(() => {
        const map = new Map<string, FoundWordEntry>();
        for (const fw of foundWords) {
            for (const [r, c] of fw.path) {
                map.set(cellKey(r, c), fw);
            }
        }
        return map;
    }, [foundWords]);

    const totalLetters = puzzle.rows * puzzle.cols;
    const usedLetters = claimedMap.size;

    const currentWordText = useMemo(
        () => activePath.map(([r, c]) => puzzle.grid[r][c]).join(""),
        [activePath, puzzle.grid]
    );

    const remainingTargets = useMemo(() => {
        const foundNames = new Set(foundWords.map((f) => f.word));
        return puzzle.words.filter((w) => !foundNames.has(w.word));
    }, [puzzle.words, foundWords]);

    const trySubmitPath = useCallback(
        (path: [number, number][], silentOnMiss: boolean) => {
            if (path.length < 3 || session.solved) {
                if (!silentOnMiss && path.length > 0) {
                    setFeedback("Trace at least 3 connected letters.");
                    playPuzzleTone("error");
                }
                return false;
            }
            const spelled = path.map(([r, c]) => puzzle.grid[r][c]).join("");

            // Match against an unfound target word whose exact path OR spelled letters on unclaimed cells match
            // To guarantee the board remains 100% partitionable without stranding letters, require exact coordinate set or exact word match when no other word needs those cells.
            let matchedTarget: WendWordPlacement | undefined = remainingTargets.find(
                (t) =>
                    t.word === spelled &&
                    t.path.length === path.length &&
                    t.path.every(([tr, tc], idx) => tr === path[idx][0] && tc === path[idx][1])
            );

            // Also accept reversed exact path (e.g. palindromes) or identical coordinate set spelling the word
            if (!matchedTarget) {
                const pathKeys = new Set(path.map(([r, c]) => cellKey(r, c)));
                matchedTarget = remainingTargets.find(
                    (t) =>
                        t.word === spelled &&
                        t.path.length === path.length &&
                        t.path.every(([tr, tc]) => pathKeys.has(cellKey(tr, tc)))
                );
            }

            if (matchedTarget) {
                const nextFound: FoundWordEntry[] = [
                    ...foundWords,
                    {
                        word: matchedTarget.word,
                        path: path.map(([r, c]) => [r, c]),
                        colorIndex: matchedTarget.colorIndex,
                    },
                ];
                setFoundWords(nextFound);
                setActivePath([]);
                setHintedWordIdx(null);
                setHintStage(0);
                setFeedback(`Locked "${matchedTarget.word}"!`);
                session.setMoves((m) => m + 1);
                playPuzzleTone("place");

                if (nextFound.length === puzzle.words.length) {
                    session.markSolved();
                }
                return true;
            }

            if (!silentOnMiss) {
                const isWordButWrongPath = remainingTargets.some((t) => t.word === spelled);
                setFeedback(
                    isWordButWrongPath
                        ? `"${spelled}" is in the theme, but uses a different letter weave so no tiles are stranded.`
                        : `"${spelled}" is not one of the remaining theme weave words.`
                );
                playPuzzleTone("error");
                setActivePath([]);
            }
            return false;
        },
        [foundWords, puzzle.grid, puzzle.words.length, remainingTargets, session]
    );

    const handleCellPointerDown = (r: number, c: number) => {
        if (session.solved) return;
        const key = cellKey(r, c);
        if (claimedMap.has(key)) return;

        isDraggingRef.current = true;
        setFeedback(null);

        // Support click-by-click chaining as well as dragging:
        // If clicking the last cell in activePath, submit; if clicking adjacent to last, append; otherwise start fresh.
        if (activePath.length > 0) {
            const last = activePath[activePath.length - 1];
            const existingIdx = activePath.findIndex(([pr, pc]) => pr === r && pc === c);
            if (existingIdx === activePath.length - 1 && activePath.length >= 3) {
                isDraggingRef.current = false;
                trySubmitPath(activePath, false);
                return;
            }
            if (existingIdx !== -1) {
                // Backtrack to clicked cell
                setActivePath(activePath.slice(0, existingIdx + 1));
                playPuzzleTone("tap");
                return;
            }
            if (areAdjacent8(last, [r, c])) {
                const nextPath: [number, number][] = [...activePath, [r, c]];
                setActivePath(nextPath);
                playPuzzleTone("tap");
                return;
            }
        }

        setActivePath([[r, c]]);
        playPuzzleTone("tap");
    };

    const handleCellPointerEnter = (r: number, c: number) => {
        if (!isDraggingRef.current || session.solved) return;
        const key = cellKey(r, c);
        if (claimedMap.has(key)) return;

        setActivePath((prev) => {
            if (prev.length === 0) return [[r, c]];
            const last = prev[prev.length - 1];
            if (last[0] === r && last[1] === c) return prev;
            // Dragging back onto the previous tile smoothly backtracks
            if (
                prev.length >= 2 &&
                prev[prev.length - 2][0] === r &&
                prev[prev.length - 2][1] === c
            ) {
                playPuzzleTone("tap");
                return prev.slice(0, -1);
            }
            // Ignore already visited tiles
            if (prev.some(([pr, pc]) => pr === r && pc === c)) return prev;
            if (!areAdjacent8(last, [r, c])) return prev;
            playPuzzleTone("tap");
            return [...prev, [r, c]];
        });
    };

    useEffect(() => {
        const handlePointerUp = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            if (activePath.length >= 3) {
                // Auto-lock immediately if dragged path spells an exact remaining word
                trySubmitPath(activePath, true);
            }
        };
        window.addEventListener("pointerup", handlePointerUp);
        return () => window.removeEventListener("pointerup", handlePointerUp);
    }, [activePath, trySubmitPath]);

    const handleUndo = () => {
        if (session.solved) return;
        if (activePath.length > 0) {
            setActivePath([]);
            playPuzzleTone("tap");
            return;
        }
        if (foundWords.length > 0) {
            setFoundWords((prev) => prev.slice(0, -1));
            setFeedback("Removed last locked word.");
            playPuzzleTone("tap");
        }
    };

    const handleHint = () => {
        if (session.solved || remainingTargets.length === 0) return;
        const targetWord = remainingTargets[0];
        const targetIdx = puzzle.words.findIndex((w) => w.word === targetWord.word);
        if (hintedWordIdx === targetIdx && hintStage === 1) {
            setHintStage(2);
            setFeedback(
                `Hint: Trace the highlighted ${targetWord.word.length}-letter weave starting with "${targetWord.word[0]}".`
            );
        } else {
            setHintedWordIdx(targetIdx);
            setHintStage(1);
            setFeedback(
                `Hint: Look for a ${targetWord.word.length}-letter "${puzzle.theme}" word starting at the amber ring.`
            );
        }
        session.setHintsUsed((h) => h + 1);
        playPuzzleTone("hint");
    };

    const hintedPlacement =
        hintedWordIdx !== null ? puzzle.words[hintedWordIdx] ?? null : null;
    const hintedPathSet = useMemo(() => {
        const set = new Set<string>();
        if (!hintedPlacement || hintStage === 0) return set;
        if (hintStage === 1) {
            set.add(cellKey(hintedPlacement.path[0][0], hintedPlacement.path[0][1]));
        } else {
            for (const [r, c] of hintedPlacement.path) {
                set.add(cellKey(r, c));
            }
        }
        return set;
    }, [hintedPlacement, hintStage]);

    const activePathIndexMap = useMemo(() => {
        const m = new Map<string, number>();
        activePath.forEach(([r, c], i) => m.set(cellKey(r, c), i));
        return m;
    }, [activePath]);

    const buildPolylinePoints = (path: [number, number][]) =>
        path
            .map(([r, c]) => {
                const x = ((c + 0.5) / puzzle.cols) * 100;
                const y = ((r + 0.5) / puzzle.rows) * 100;
                return `${x},${y}`;
            })
            .join(" ");

    const statusNote =
        feedback ||
        `Weave ${puzzle.words.length} hidden "${puzzle.theme}" words so every single letter is used once.`;

    return (
        <PuzzleWorkspace
            gameId="wend"
            level={session.level}
            isDaily={session.isDaily}
            onSelectLevel={session.selectLevel}
            onToggleDaily={session.toggleDaily}
            moves={session.moves}
            elapsedSeconds={session.elapsedSeconds}
            solved={session.solved}
            starsEarned={session.starsEarned}
            statusNote={statusNote}
            canUndo={activePath.length > 0 || foundWords.length > 0}
            onUndo={handleUndo}
            onHint={handleHint}
            onReset={session.resetSession}
        >
            <div className="w-full max-w-lg space-y-5">
                {/* Theme & Coverage Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-200 bg-blue-50/70 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Compass className="w-4 h-4 text-blue-700" aria-hidden="true" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-700">
                            Theme
                        </span>
                        <span className="text-sm font-extrabold text-[#161614]">
                            {puzzle.theme}
                        </span>
                    </div>
                    <div className="text-xs font-mono font-bold text-[#3F3E39] tabular-nums">
                        {foundWords.length}/{puzzle.words.length} words · {usedLetters}/{totalLetters} letters
                    </div>
                </div>

                {/* Live Traced Word Preview & Submit Controls */}
                <div className="flex items-center justify-between gap-2 min-h-[44px] px-4 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6]">
                    <div className="font-mono text-lg font-extrabold tracking-[0.22em] text-[#161614] uppercase">
                        {currentWordText || (
                            <span className="text-xs font-sans font-medium tracking-normal text-slate-400 normal-case">
                                Drag or tap adjacent letters to weave a word...
                            </span>
                        )}
                    </div>
                    {activePath.length > 0 && (
                        <div className="flex items-center gap-1.5">
                            <button
                                type="button"
                                onClick={() => setActivePath([])}
                                aria-label="Clear selection"
                                className="p-2 rounded-lg border border-[#E6E3DB] bg-white text-[#57554E] hover:text-[#161614]"
                            >
                                <Eraser className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => trySubmitPath(activePath, false)}
                                disabled={activePath.length < 3}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 disabled:opacity-40 whitespace-nowrap"
                            >
                                <Check className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Submit</span>
                            </button>
                        </div>
                    )}
                </div>

                {/* Interactive Letter Weave Board */}
                <div className="relative mx-auto w-full max-w-[420px] select-none touch-none bg-[#F3F1EB] border border-[#D8D4C9] rounded-2xl p-3">
                    {/* Connecting SVG Path Layer (board geometry, not UI icon) */}
                    <svg
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                        className="pointer-events-none absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)] z-0"
                        aria-hidden="true"
                    >
                        {foundWords.map((fw) => {
                            const palette = REGION_PALETTE[fw.colorIndex % REGION_PALETTE.length];
                            return (
                                <polyline
                                    key={fw.word}
                                    points={buildPolylinePoints(fw.path)}
                                    fill="none"
                                    stroke={palette.stroke}
                                    strokeWidth="2.4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeOpacity="0.45"
                                />
                            );
                        })}
                        {activePath.length >= 2 && (
                            <polyline
                                points={buildPolylinePoints(activePath)}
                                fill="none"
                                stroke="#1D4ED8"
                                strokeWidth="2.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        )}
                    </svg>

                    <div
                        className="relative z-10 grid gap-2"
                        style={{
                            gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`,
                        }}
                    >
                        {puzzle.grid.map((row, r) =>
                            row.map((letter, c) => {
                                const key = cellKey(r, c);
                                const claimed = claimedMap.get(key);
                                const activeIdx = activePathIndexMap.get(key);
                                const isActive = activeIdx !== undefined;
                                const isHinted = hintedPathSet.has(key);
                                const palette = claimed
                                    ? REGION_PALETTE[claimed.colorIndex % REGION_PALETTE.length]
                                    : null;

                                return (
                                    <button
                                        key={key}
                                        type="button"
                                        onPointerDown={() => handleCellPointerDown(r, c)}
                                        onPointerEnter={() => handleCellPointerEnter(r, c)}
                                        aria-label={`Row ${r + 1} Column ${c + 1} Letter ${letter}`}
                                        className={`aspect-square rounded-xl font-extrabold text-lg sm:text-xl flex items-center justify-center border-2 transition-all ${
                                            isActive
                                                ? "bg-blue-600 text-white border-blue-800 scale-105 shadow-sm"
                                                : claimed
                                                  ? "text-[#161614] cursor-default"
                                                  : isHinted
                                                    ? "bg-amber-50 text-[#161614] border-amber-500 ring-2 ring-amber-400/50"
                                                    : "bg-white text-[#161614] border-[#E6E3DB] hover:border-blue-400"
                                        }`}
                                        style={
                                            claimed && palette
                                                ? {
                                                      backgroundColor: palette.bg,
                                                      borderColor: palette.stroke,
                                                  }
                                                : undefined
                                        }
                                    >
                                        {letter}
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Word Slot Ledger (shows length of remaining words + solved words) */}
                <div className="space-y-2">
                    <div className="text-xs font-semibold text-[#78756C] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
                        <span>Target Word Lengths</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {puzzle.words.map((target) => {
                            const found = foundWords.find((f) => f.word === target.word);
                            const palette =
                                REGION_PALETTE[target.colorIndex % REGION_PALETTE.length];
                            return (
                                <div
                                    key={target.word}
                                    className="rounded-lg border px-3 py-2 text-xs font-mono font-bold flex items-center justify-between"
                                    style={
                                        found
                                            ? {
                                                  backgroundColor: palette.bg,
                                                  borderColor: palette.stroke,
                                                  color: "#0F172A",
                                              }
                                            : {
                                                  backgroundColor: "#F8FAFC",
                                                  borderColor: "#E2E8F0",
                                                  color: "#64748B",
                                              }
                                    }
                                >
                                    <span>
                                        {found
                                            ? target.word
                                            : `${"• ".repeat(target.word.length).trim()}`}
                                    </span>
                                    <span className="text-[11px] opacity-75">
                                        {target.word.length}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </PuzzleWorkspace>
    );
}
