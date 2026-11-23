"use client";

import { useCallback, useEffect, useState } from "react";
import {
    loadPuzzleProgress,
    playPuzzleTone,
    recordPuzzleSolve,
    saveLastLevel,
} from "@/lib/puzzles/core";
import type { PuzzleId } from "@/lib/puzzles/meta";

export function usePuzzleSession(gameId: PuzzleId) {
    const [level, setLevelState] = useState<number>(1);
    const [isDaily, setIsDailyState] = useState<boolean>(false);
    const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
    const [moves, setMoves] = useState<number>(0);
    const [hintsUsed, setHintsUsed] = useState<number>(0);
    const [solved, setSolved] = useState<boolean>(false);
    const [starsEarned, setStarsEarned] = useState<number>(3);
    const [resetToken, setResetToken] = useState<number>(0);

    // Load last played level once on mount
    useEffect(() => {
        const progress = loadPuzzleProgress(gameId);
        if (progress.lastLevel >= 1) {
            setLevelState(progress.lastLevel);
        }
    }, [gameId]);

    // Tick active puzzle timer cleanly
    useEffect(() => {
        if (solved) return;
        const id = window.setInterval(() => {
            setElapsedSeconds((s) => s + 1);
        }, 1000);
        return () => window.clearInterval(id);
    }, [solved, level, isDaily, resetToken]);

    const selectLevel = useCallback(
        (nextLevel: number) => {
            setLevelState(nextLevel);
            saveLastLevel(gameId, nextLevel);
            setElapsedSeconds(0);
            setMoves(0);
            setHintsUsed(0);
            setSolved(false);
            setStarsEarned(3);
        },
        [gameId]
    );

    const toggleDaily = useCallback((daily: boolean) => {
        setIsDailyState(daily);
        setElapsedSeconds(0);
        setMoves(0);
        setHintsUsed(0);
        setSolved(false);
        setStarsEarned(3);
    }, []);

    const resetSession = useCallback(() => {
        setElapsedSeconds(0);
        setMoves(0);
        setHintsUsed(0);
        setSolved(false);
        setStarsEarned(3);
        setResetToken((n) => n + 1);
    }, []);

    const markSolved = useCallback(
        (customStars?: number) => {
            if (solved) return;
            const computedStars =
                customStars !== undefined
                    ? Math.max(1, Math.min(3, customStars))
                    : hintsUsed === 0
                      ? 3
                      : hintsUsed <= 2
                        ? 2
                        : 1;
            setSolved(true);
            setStarsEarned(computedStars);
            recordPuzzleSolve(gameId, level, isDaily, elapsedSeconds, computedStars);
            playPuzzleTone("win");
        },
        [solved, hintsUsed, gameId, level, isDaily, elapsedSeconds]
    );

    return {
        level,
        isDaily,
        elapsedSeconds,
        moves,
        setMoves,
        hintsUsed,
        setHintsUsed,
        solved,
        starsEarned,
        resetToken,
        selectLevel,
        toggleDaily,
        resetSession,
        markSolved,
    };
}
