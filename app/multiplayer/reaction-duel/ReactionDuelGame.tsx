"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Zap, RotateCcw, Trophy, AlertTriangle, Play } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type DuelPhase = "idle" | "waiting" | "go" | "roundResult" | "matchOver";

interface RoundLog {
    round: number;
    winner: 1 | 2;
    reason: "reflex" | "falseStart";
    ms?: number;
}

const TARGET_WINS = 3;

export default function ReactionDuelGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [phase, setPhase] = useState<DuelPhase>("idle");
    const [p1Score, setP1Score] = useState(0);
    const [p2Score, setP2Score] = useState(0);
    const [roundNum, setRoundNum] = useState(1);
    const [headline, setHeadline] = useState("First to 3 rounds wins the match.");
    const [subline, setSubline] = useState("Player 1 presses A (or taps Left). Player 2 presses L (or taps Right).");
    const [logs, setLogs] = useState<RoundLog[]>([]);

    const phaseRef = useRef<DuelPhase>("idle");
    const goTimestampRef = useRef<number>(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const p1ScoreRef = useRef(0);
    const p2ScoreRef = useRef(0);
    const roundNumRef = useRef(1);

    const clearTimer = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    const startRound = useCallback(() => {
        clearTimer();
        setPhase("waiting");
        phaseRef.current = "waiting";
        setHeadline("WAIT FOR GREEN...");
        setSubline("Do not jump early! False start awards the round to your opponent.");

        const delay = 1500 + Math.random() * 2800;
        timeoutRef.current = setTimeout(() => {
            goTimestampRef.current = performance.now();
            setPhase("go");
            phaseRef.current = "go";
            setHeadline("STRIKE NOW!");
            setSubline("Player 1: A  ·  Player 2: L");
        }, delay);
    }, []);

    const resetMatch = useCallback(() => {
        clearTimer();
        p1ScoreRef.current = 0;
        p2ScoreRef.current = 0;
        roundNumRef.current = 1;
        setP1Score(0);
        setP2Score(0);
        setRoundNum(1);
        setLogs([]);
        setPhase("idle");
        phaseRef.current = "idle";
        setHeadline("First to 3 rounds wins the match.");
        setSubline("Player 1 presses A (or taps Left). Player 2 presses L (or taps Right).");
    }, []);

    const awardRound = useCallback((winner: 1 | 2, reason: "reflex" | "falseStart", ms?: number) => {
        clearTimer();
        if (winner === 1) {
            p1ScoreRef.current += 1;
            setP1Score(p1ScoreRef.current);
        } else {
            p2ScoreRef.current += 1;
            setP2Score(p2ScoreRef.current);
        }

        const currRound = roundNumRef.current;
        setLogs((prev) => [{ round: currRound, winner, reason, ms }, ...prev]);

        if (reason === "reflex" && ms !== undefined) {
            ScoreHistory.save("reaction-duel-2p", ms, "ms", `p${winner}-win`, {
                higherIsBetter: false,
                configuration: "best-of-5",
            });
        }

        const p1Won = p1ScoreRef.current >= TARGET_WINS;
        const p2Won = p2ScoreRef.current >= TARGET_WINS;

        if (p1Won || p2Won) {
            setPhase("matchOver");
            phaseRef.current = "matchOver";
            const champ = p1Won ? "Player 1" : "Player 2";
            setHeadline(`${champ} Wins the Match (${p1ScoreRef.current}–${p2ScoreRef.current})!`);
            setSubline(
                reason === "falseStart"
                    ? `Final round decided by false start.`
                    : `Winning final strike: ${ms} ms.`
            );
        } else {
            setPhase("roundResult");
            phaseRef.current = "roundResult";
            roundNumRef.current += 1;
            setRoundNum(roundNumRef.current);
            if (reason === "falseStart") {
                const jumper = winner === 1 ? "Player 2" : "Player 1";
                setHeadline(`${jumper} False Start! Point to Player ${winner}`);
                setSubline("Press Space or click Next Round to continue.");
            } else {
                setHeadline(`Player ${winner} Wins Round ${currRound} in ${ms} ms!`);
                setSubline("Press Space or click Next Round when both players are ready.");
            }
        }
    }, []);

    const handleTrigger = useCallback(
        (player: 1 | 2) => {
            const curr = phaseRef.current;
            if (curr === "waiting") {
                awardRound(player === 1 ? 2 : 1, "falseStart");
            } else if (curr === "go") {
                const rt = Math.max(1, Math.round(performance.now() - goTimestampRef.current));
                awardRound(player, "reflex", rt);
            }
        },
        [awardRound]
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            const k = e.key.toLowerCase();
            if (k === "a") {
                handleTrigger(1);
            } else if (k === "l") {
                handleTrigger(2);
            } else if (e.code === "Space" && (phaseRef.current === "idle" || phaseRef.current === "roundResult")) {
                e.preventDefault();
                startRound();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
            clearTimer();
        };
    }, [handleTrigger, startRound]);

    const signalBg =
        phase === "go"
            ? "bg-emerald-600 text-white border-emerald-700"
            : phase === "waiting"
            ? "bg-amber-500 text-white border-amber-600"
            : "bg-slate-900 text-white border-slate-800";

    return (
        <div className="w-full max-w-6xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/multiplayer")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.multiplayer.title", "2-Player Battle Arena")}</span>
                </Link>

                <button
                    type="button"
                    onClick={resetMatch}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-xs font-semibold text-[#3F3E39] transition-colors"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Match</span>
                </button>
            </div>

            {/* Scoreboard Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 grid grid-cols-3 items-center gap-4">
                <div className="text-left">
                    <div className="text-xs font-mono font-semibold uppercase text-blue-700">Player 1 · Key [A]</div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-[#161614] mt-0.5">
                        {p1Score} <span className="text-sm font-normal text-slate-400">/ {TARGET_WINS}</span>
                    </div>
                </div>

                <div className="text-center">
                    <h1 className="text-lg sm:text-xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.reaction-duel-2p.title", "2-Player Reaction Duel")}
                    </h1>
                    <div className="text-xs font-mono text-[#78756C] mt-0.5">Round {Math.min(roundNum, 5)} · Best of 5</div>
                </div>

                <div className="text-right">
                    <div className="text-xs font-mono font-semibold uppercase text-orange-700">Player 2 · Key [L]</div>
                    <div className="text-3xl sm:text-4xl font-extrabold font-mono tabular-nums text-[#161614] mt-0.5">
                        {p2Score} <span className="text-sm font-normal text-slate-400">/ {TARGET_WINS}</span>
                    </div>
                </div>
            </div>

            {/* Central Signal Bar */}
            <div className={`rounded-2xl border p-6 text-center transition-colors ${signalBg}`}>
                <div className="flex items-center justify-center gap-2 text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {phase === "matchOver" ? (
                        <Trophy className="w-7 h-7 text-amber-300" />
                    ) : phase === "go" ? (
                        <Zap className="w-7 h-7 text-white" />
                    ) : phase === "waiting" ? (
                        <AlertTriangle className="w-7 h-7 text-white" />
                    ) : null}
                    <span>{headline}</span>
                </div>
                <p className="text-sm opacity-90 mt-1.5">{subline}</p>

                {(phase === "idle" || phase === "roundResult" || phase === "matchOver") && (
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={phase === "matchOver" ? resetMatch : startRound}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors shadow-xs"
                        >
                            {phase === "matchOver" ? <RotateCcw className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            <span>
                                {phase === "idle"
                                    ? "Start Round 1"
                                    : phase === "roundResult"
                                    ? `Start Round ${roundNum}`
                                    : "Play Rematch"}
                            </span>
                        </button>
                    </div>
                )}
            </div>

            {/* Split-Screen Touch / Click Strike Pads */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    type="button"
                    onPointerDown={() => handleTrigger(1)}
                    className={`h-52 sm:h-64 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 select-none transition-all active:scale-[0.99] ${
                        phase === "go"
                            ? "bg-blue-600 border-blue-700 text-white shadow-md"
                            : "bg-white border-blue-200 hover:border-blue-400 text-[#161614]"
                    }`}
                >
                    <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-75">Player 1 Zone</span>
                    <span className="text-5xl font-black font-mono">A</span>
                    <span className="text-sm font-semibold opacity-80">Press A or Tap Left Pad</span>
                </button>

                <button
                    type="button"
                    onPointerDown={() => handleTrigger(2)}
                    className={`h-52 sm:h-64 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 select-none transition-all active:scale-[0.99] ${
                        phase === "go"
                            ? "bg-orange-600 border-orange-700 text-white shadow-md"
                            : "bg-white border-orange-200 hover:border-orange-400 text-[#161614]"
                    }`}
                >
                    <span className="text-xs font-mono font-bold uppercase tracking-widest opacity-75">Player 2 Zone</span>
                    <span className="text-5xl font-black font-mono">L</span>
                    <span className="text-sm font-semibold opacity-80">Press L or Tap Right Pad</span>
                </button>
            </div>

            {/* Round Split History */}
            {logs.length > 0 && (
                <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5">
                    <h2 className="text-sm font-bold text-[#161614] uppercase tracking-wider mb-3">Match Round Splits</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 font-mono text-xs tabular-nums">
                        {logs.map((l) => (
                            <div
                                key={l.round}
                                className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] px-3.5 py-2.5 flex items-center justify-between"
                            >
                                <span className="text-[#78756C]">Round {l.round}</span>
                                <span className={l.winner === 1 ? "font-bold text-blue-700" : "font-bold text-orange-700"}>
                                    P{l.winner} {l.reason === "falseStart" ? "(False Start)" : `· ${l.ms} ms`}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
