"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    CheckCircle2,
    Eye,
    Lock,
    Send,
    Sparkles,
    XCircle,
} from "lucide-react";
import { PuzzleWorkspace } from "@/components/puzzles/PuzzleWorkspace";
import { playPuzzleTone } from "@/lib/puzzles/core";
import { usePuzzleSession } from "@/lib/puzzles/usePuzzleSession";
import {
    checkPinpointGuess,
    generatePinpoint,
} from "@/lib/puzzles/generators/word-and-sum";

export function PinpointGame() {
    const session = usePuzzleSession("pinpoint");

    const puzzle = useMemo(
        () => generatePinpoint(session.level, session.isDaily),
        [session.level, session.isDaily]
    );

    const [revealedCount, setRevealedCount] = useState<number>(1);
    const [guessInput, setGuessInput] = useState<string>("");
    const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
    const [failedOut, setFailedOut] = useState<boolean>(false);
    const [hintLevel, setHintLevel] = useState<0 | 1 | 2>(0);
    const [feedback, setFeedback] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        setRevealedCount(1);
        setGuessInput("");
        setWrongGuesses([]);
        setFailedOut(false);
        setHintLevel(0);
        setFeedback(null);
    }, [puzzle, session.resetToken]);

    const handleSubmitGuess = (e: React.FormEvent) => {
        e.preventDefault();
        if (session.solved || failedOut) return;
        const trimmed = guessInput.trim();
        if (!trimmed) return;

        session.setMoves((m) => m + 1);
        const isCorrect = checkPinpointGuess(trimmed, puzzle);
        setGuessInput("");

        if (isCorrect) {
            const stars = revealedCount <= 2 ? 3 : revealedCount <= 4 ? 2 : 1;
            setRevealedCount(5);
            setFeedback(null);
            session.markSolved(stars);
            return;
        }

        playPuzzleTone("error");
        const nextWrong = [...wrongGuesses, trimmed];
        setWrongGuesses(nextWrong);

        if (revealedCount < 5) {
            setRevealedCount((c) => Math.min(5, c + 1));
            setFeedback(`"${trimmed}" isn't it — Clue ${revealedCount + 1} unlocked.`);
        } else if (nextWrong.length >= 5) {
            setFailedOut(true);
            setFeedback(null);
        } else {
            setFeedback(
                `"${trimmed}" isn't the connection. ${5 - nextWrong.length} final guess${5 - nextWrong.length === 1 ? "" : "es"} left.`
            );
        }
        inputRef.current?.focus();
    };

    const handleRevealNext = () => {
        if (session.solved || failedOut || revealedCount >= 5) return;
        setRevealedCount((c) => Math.min(5, c + 1));
        session.setMoves((m) => m + 1);
        setFeedback(`Clue ${revealedCount + 1} revealed.`);
        playPuzzleTone("tap");
        inputRef.current?.focus();
    };

    const handleHint = () => {
        if (session.solved || failedOut) return;
        if (hintLevel === 0) {
            setHintLevel(1);
            setFeedback(`Hint: Domain is "${puzzle.domain}".`);
        } else {
            setHintLevel(2);
            const primaryWord = puzzle.acceptedAnswers[1] || puzzle.category;
            setFeedback(
                `Hint: Domain is "${puzzle.domain}" · Starts with "${primaryWord[0].toUpperCase()}..."`
            );
        }
        session.setHintsUsed((h) => h + 1);
        playPuzzleTone("hint");
    };

    const statusNote =
        feedback ||
        `Guess the shared category using as few clues as possible (Clue ${revealedCount} of 5 shown).`;

    return (
        <PuzzleWorkspace
            gameId="pinpoint"
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
            <div className="w-full max-w-lg space-y-5">
                {/* 5 Progressive Clue Cards */}
                <div className="space-y-2.5">
                    {puzzle.clues.map((clue, idx) => {
                        const isRevealed = idx < revealedCount || session.solved || failedOut;
                        return (
                            <div
                                key={`${idx}-${clue}`}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                                    isRevealed
                                        ? "bg-white border-purple-200 shadow-2xs"
                                        : "bg-[#FAF9F6] border-[#E6E3DB]"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center tabular-nums ${
                                            isRevealed
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-[#E6E3DB] text-[#78756C]"
                                        }`}
                                    >
                                        {idx + 1}
                                    </span>
                                    {isRevealed ? (
                                        <span className="text-base sm:text-lg font-extrabold text-[#161614] tracking-tight">
                                            {clue}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-400">
                                            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                                            <span>Clue {idx + 1} hidden</span>
                                        </span>
                                    )}
                                </div>
                                {isRevealed && idx === revealedCount - 1 && !session.solved && !failedOut && (
                                    <span className="text-[11px] font-semibold uppercase tracking-wide text-purple-700">
                                        Latest
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Hint Callout */}
                {hintLevel > 0 && !session.solved && !failedOut && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50/80 px-4 py-2.5 text-xs font-semibold text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 shrink-0 text-amber-700" aria-hidden="true" />
                        <span>
                            Domain: {puzzle.domain}
                            {hintLevel === 2
                                ? ` · Keyword starts with "${(puzzle.acceptedAnswers[1] || puzzle.category)[0].toUpperCase()}"`
                                : ""}
                        </span>
                    </div>
                )}

                {/* Guess Form */}
                {!session.solved && !failedOut && (
                    <form onSubmit={handleSubmitGuess} className="space-y-2.5">
                        <div className="flex gap-2 w-full min-w-0">
                            <input
                                ref={inputRef}
                                type="text"
                                value={guessInput}
                                onChange={(e) => setGuessInput(e.target.value)}
                                placeholder="Type the shared category (e.g. Palindromes, Words before Light)..."
                                aria-label="Category guess"
                                className="flex-1 min-w-0 w-full px-3.5 sm:px-4 py-3 text-sm font-medium text-[#161614] bg-white border border-[#D8D4C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                            />
                            <button
                                type="submit"
                                disabled={!guessInput.trim()}
                                className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-3 text-sm font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-xl disabled:opacity-40 transition-colors whitespace-nowrap shrink-0"
                            >
                                <Send className="w-4 h-4" aria-hidden="true" />
                                <span>Guess</span>
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <span className="text-[#78756C] tabular-nums">
                                {5 - wrongGuesses.length} guesses left · {revealedCount}/5 clues open
                            </span>
                            {revealedCount < 5 && (
                                <button
                                    type="button"
                                    onClick={handleRevealNext}
                                    className="inline-flex items-center gap-1.5 font-semibold text-purple-700 hover:text-purple-900"
                                >
                                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Reveal Clue {revealedCount + 1}</span>
                                </button>
                            )}
                        </div>
                    </form>
                )}

                {/* Previous Wrong Guesses */}
                {wrongGuesses.length > 0 && !session.solved && (
                    <div className="space-y-1.5">
                        <div className="text-xs font-semibold text-[#78756C]">
                            Previous Guesses
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {wrongGuesses.map((g, i) => (
                                <span
                                    key={`${i}-${g}`}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-800"
                                >
                                    <XCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>{g}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Category Reveal Card (on Win or Out of Guesses) */}
                {(session.solved || failedOut) && (
                    <div
                        className={`rounded-xl border p-4 space-y-2 ${
                            session.solved
                                ? "border-emerald-200 bg-emerald-50/70"
                                : "border-rose-200 bg-rose-50/70"
                        }`}
                    >
                        <div className="flex items-center gap-2 text-sm font-extrabold text-[#161614]">
                            {session.solved ? (
                                <CheckCircle2
                                    className="w-4 h-4 text-emerald-700"
                                    aria-hidden="true"
                                />
                            ) : (
                                <XCircle
                                    className="w-4 h-4 text-rose-700"
                                    aria-hidden="true"
                                />
                            )}
                            <span>Category: {puzzle.category}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#3F3E39]">
                            {puzzle.explanation}
                        </p>
                        {failedOut && (
                            <div className="pt-2 flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={session.resetSession}
                                    className="px-3.5 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
                                >
                                    Try Again
                                </button>
                                {!session.isDaily && session.level < 1200 && (
                                    <button
                                        type="button"
                                        onClick={() => session.selectLevel(session.level + 1)}
                                        className="px-3.5 py-1.5 text-xs font-bold text-[#3F3E39] bg-white border border-[#D8D4C9] hover:bg-[#FAF9F6] rounded-lg"
                                    >
                                        Skip to Level {session.level + 1}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </PuzzleWorkspace>
    );
}
