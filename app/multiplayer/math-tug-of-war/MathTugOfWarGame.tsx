"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, Play, RotateCcw, Trophy } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type Tier = "kids" | "student" | "pro";

interface MathQuestion {
    prompt: string;
    answer: number;
    options: [number, number, number];
}

function makeQuestion(tier: Tier): MathQuestion {
    let a = 0;
    let b = 0;
    let answer = 0;
    let prompt = "";

    if (tier === "kids") {
        const add = Math.random() < 0.6;
        if (add) {
            a = 2 + Math.floor(Math.random() * 14);
            b = 2 + Math.floor(Math.random() * 14);
            answer = a + b;
            prompt = `${a} + ${b} = ?`;
        } else {
            a = 8 + Math.floor(Math.random() * 16);
            b = 1 + Math.floor(Math.random() * (a - 1));
            answer = a - b;
            prompt = `${a} − ${b} = ?`;
        }
    } else if (tier === "student") {
        const op = Math.floor(Math.random() * 3);
        if (op === 0) {
            a = 12 + Math.floor(Math.random() * 35);
            b = 11 + Math.floor(Math.random() * 35);
            answer = a + b;
            prompt = `${a} + ${b} = ?`;
        } else if (op === 1) {
            a = 3 + Math.floor(Math.random() * 10);
            b = 3 + Math.floor(Math.random() * 10);
            answer = a * b;
            prompt = `${a} × ${b} = ?`;
        } else {
            b = 2 + Math.floor(Math.random() * 9);
            answer = 3 + Math.floor(Math.random() * 11);
            a = b * answer;
            prompt = `${a} ÷ ${b} = ?`;
        }
    } else {
        const op = Math.floor(Math.random() * 3);
        if (op === 0) {
            a = 7 + Math.floor(Math.random() * 12);
            b = 6 + Math.floor(Math.random() * 12);
            answer = a * b;
            prompt = `${a} × ${b} = ?`;
        } else if (op === 1) {
            a = 45 + Math.floor(Math.random() * 90);
            b = 17 + Math.floor(Math.random() * 44);
            answer = a - b;
            prompt = `${a} − ${b} = ?`;
        } else {
            a = 4 + Math.floor(Math.random() * 9);
            b = 3 + Math.floor(Math.random() * 8);
            const c = 5 + Math.floor(Math.random() * 15);
            answer = a * b + c;
            prompt = `${a} × ${b} + ${c} = ?`;
        }
    }

    // Build 2 plausible distinct distractors
    const set = new Set<number>([answer]);
    const offsets = [-10, -4, -3, -2, -1, 1, 2, 3, 4, 10];
    while (set.size < 3) {
        const off = offsets[Math.floor(Math.random() * offsets.length)];
        const cand = Math.max(0, answer + off);
        if (cand !== answer) set.add(cand);
    }
    const arr = Array.from(set).sort(() => Math.random() - 0.5) as [number, number, number];
    return { prompt, answer, options: arr };
}

const WIN_OFFSET = 5;

export default function MathTugOfWarGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [tier, setTier] = useState<Tier>("student");
    const [phase, setPhase] = useState<"idle" | "playing" | "finished">("idle");
    const [ropePos, setRopePos] = useState(0); // -5 (P1 wins) to +5 (P2 wins)
    const [question, setQuestion] = useState<MathQuestion>(() => makeQuestion("student"));
    const [p1Solved, setP1Solved] = useState(0);
    const [p2Solved, setP2Solved] = useState(0);
    const [p1Locked, setP1Locked] = useState(false);
    const [p2Locked, setP2Locked] = useState(false);
    const [statusMsg, setStatusMsg] = useState("Choose difficulty tier and start the pull!");

    const phaseRef = useRef(phase);
    const ropeRef = useRef(ropePos);
    const qRef = useRef(question);
    const p1LockRef = useRef(p1Locked);
    const p2LockRef = useRef(p2Locked);
    const tierRef = useRef(tier);

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);
    useEffect(() => {
        ropeRef.current = ropePos;
    }, [ropePos]);
    useEffect(() => {
        qRef.current = question;
    }, [question]);
    useEffect(() => {
        p1LockRef.current = p1Locked;
    }, [p1Locked]);
    useEffect(() => {
        p2LockRef.current = p2Locked;
    }, [p2Locked]);
    useEffect(() => {
        tierRef.current = tier;
    }, [tier]);

    const startMatch = useCallback(
        (selectedTier: Tier = tier) => {
            setTier(selectedTier);
            tierRef.current = selectedTier;
            const firstQ = makeQuestion(selectedTier);
            setQuestion(firstQ);
            qRef.current = firstQ;
            setRopePos(0);
            ropeRef.current = 0;
            setP1Solved(0);
            setP2Solved(0);
            setP1Locked(false);
            setP2Locked(false);
            p1LockRef.current = false;
            p2LockRef.current = false;
            setPhase("playing");
            phaseRef.current = "playing";
            setStatusMsg("Race to pull the flag 5 steps to your side!");
        },
        [tier]
    );

    const submitChoice = useCallback((player: 1 | 2, optionIdx: number) => {
        if (phaseRef.current !== "playing") return;
        if (player === 1 && p1LockRef.current) return;
        if (player === 2 && p2LockRef.current) return;

        const chosen = qRef.current.options[optionIdx];
        if (chosen === qRef.current.answer) {
            const nextPos = ropeRef.current + (player === 1 ? -1 : 1);
            ropeRef.current = nextPos;
            setRopePos(nextPos);
            if (player === 1) setP1Solved((s) => s + 1);
            else setP2Solved((s) => s + 1);

            if (Math.abs(nextPos) >= WIN_OFFSET) {
                setPhase("finished");
                phaseRef.current = "finished";
                const winner = nextPos <= -WIN_OFFSET ? 1 : 2;
                setStatusMsg(`Player ${winner} pulled the rope across the line!`);
                ScoreHistory.save("math-tug-of-war", WIN_OFFSET, "pulls", tierRef.current, {
                    higherIsBetter: true,
                    configuration: `p${winner}-${tierRef.current}`,
                });
            } else {
                const nextQ = makeQuestion(tierRef.current);
                setQuestion(nextQ);
                qRef.current = nextQ;
                setStatusMsg(`Player ${player} scored! Rope pulled ${player === 1 ? "Left ←" : "Right →"}`);
            }
        } else {
            // Brief lockout penalty on wrong answer
            if (player === 1) {
                setP1Locked(true);
                p1LockRef.current = true;
                setTimeout(() => {
                    setP1Locked(false);
                    p1LockRef.current = false;
                }, 650);
            } else {
                setP2Locked(true);
                p2LockRef.current = true;
                setTimeout(() => {
                    setP2Locked(false);
                    p2LockRef.current = false;
                }, 650);
            }
            setStatusMsg(`Player ${player} missed — 0.6s cooldown!`);
        }
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.repeat || phaseRef.current !== "playing") return;
            if (e.key === "1") submitChoice(1, 0);
            else if (e.key === "2") submitChoice(1, 1);
            else if (e.key === "3") submitChoice(1, 2);
            else if (e.key === "8") submitChoice(2, 0);
            else if (e.key === "9") submitChoice(2, 1);
            else if (e.key === "0") submitChoice(2, 2);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [submitChoice]);

    const markerPercent = 50 + (ropePos / WIN_OFFSET) * 44;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-5">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/multiplayer")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.multiplayer.title", "2-Player Battle Arena")}</span>
                </Link>

                <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                    {(
                        [
                            { id: "kids", label: "Kids (+/−)" },
                            { id: "student", label: "Student (×/÷)" },
                            { id: "pro", label: "Pro (Mixed)" },
                        ] as { id: Tier; label: string }[]
                    ).map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => startMatch(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                tier === item.id ? "bg-orange-600 text-white" : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header & Tug-of-War Rope Visualizer */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                            {t("tools.math-tug-of-war.title", "Math Tug-of-War")}
                        </h1>
                        <p className="text-sm text-[#57554E] mt-0.5">{statusMsg}</p>
                    </div>
                    <div className="flex items-center gap-4 font-mono text-sm tabular-nums">
                        <span className="font-bold text-blue-700">P1 Solved: {p1Solved}</span>
                        <span className="text-slate-300">|</span>
                        <span className="font-bold text-orange-700">P2 Solved: {p2Solved}</span>
                    </div>
                </div>

                {/* Animated Tug Rope Track */}
                <div className="relative py-5">
                    <div className="flex justify-between text-[11px] font-mono font-bold uppercase mb-2">
                        <span className="text-blue-700">← P1 Win Zone (-5)</span>
                        <span className="text-slate-400">Center (0)</span>
                        <span className="text-orange-700">P2 Win Zone (+5) →</span>
                    </div>

                    <div className="relative h-10 rounded-full bg-[#F3F1EB] border border-[#E6E3DB] overflow-hidden flex items-center">
                        <div className="absolute left-0 top-0 bottom-0 w-[8%] bg-blue-100 border-r border-blue-300" />
                        <div className="absolute right-0 top-0 bottom-0 w-[8%] bg-orange-100 border-l border-orange-300" />
                        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-300" />

                        {/* Rope line */}
                        <div className="w-full h-2.5 bg-amber-700/80 border-y border-amber-900/40" />

                        {/* Moving Flag Knot */}
                        <div
                            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-300 ease-out"
                            style={{ left: `${markerPercent}%` }}
                        >
                            <div className="w-9 h-9 rounded-full bg-slate-900 border-4 border-white shadow-md flex items-center justify-center text-white font-mono text-xs font-bold">
                                {ropePos > 0 ? `+${ropePos}` : ropePos}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Central Shared Equation */}
                <div className="rounded-2xl bg-slate-900 text-white py-6 px-4 text-center">
                    {phase === "idle" ? (
                        <div className="space-y-3">
                            <Calculator className="w-8 h-8 text-orange-400 mx-auto" />
                            <div className="text-xl font-bold">Ready for Head-to-Head Arithmetic?</div>
                            <p className="text-xs text-slate-300">
                                Player 1 uses keys [1] [2] [3] (or Left buttons). Player 2 uses keys [8] [9] [0] (or Right buttons).
                            </p>
                            <button
                                type="button"
                                onClick={() => startMatch(tier)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <Play className="w-4 h-4" />
                                <span>Start Match</span>
                            </button>
                        </div>
                    ) : phase === "finished" ? (
                        <div className="space-y-3">
                            <Trophy className="w-9 h-9 text-amber-400 mx-auto" />
                            <div className="text-2xl font-extrabold">
                                {ropePos <= -WIN_OFFSET ? "Player 1 Wins!" : "Player 2 Wins!"}
                            </div>
                            <button
                                type="button"
                                onClick={() => startMatch(tier)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Play Rematch</span>
                            </button>
                        </div>
                    ) : (
                        <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight tabular-nums">
                            {question.prompt}
                        </div>
                    )}
                </div>
            </div>

            {/* Split-Screen Answer Decks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Player 1 */}
                <div
                    className={`bg-white border-2 rounded-2xl p-5 space-y-3 transition-opacity ${
                        p1Locked ? "border-rose-300 opacity-60" : "border-blue-200"
                    }`}
                >
                    <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-blue-700">
                        <span>Player 1 Controls</span>
                        <span>Keys [1] [2] [3]</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {question.options.map((opt, idx) => (
                            <button
                                key={`p1-${idx}`}
                                type="button"
                                disabled={phase !== "playing" || p1Locked}
                                onClick={() => submitChoice(1, idx)}
                                className="py-5 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white border border-blue-200 text-[#161614] font-mono text-2xl font-extrabold transition-colors disabled:opacity-50 relative"
                            >
                                <span className="absolute top-1.5 left-2 text-[10px] font-semibold opacity-60">[{idx + 1}]</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Player 2 */}
                <div
                    className={`bg-white border-2 rounded-2xl p-5 space-y-3 transition-opacity ${
                        p2Locked ? "border-rose-300 opacity-60" : "border-orange-200"
                    }`}
                >
                    <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-orange-700">
                        <span>Player 2 Controls</span>
                        <span>Keys [8] [9] [0]</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {question.options.map((opt, idx) => (
                            <button
                                key={`p2-${idx}`}
                                type="button"
                                disabled={phase !== "playing" || p2Locked}
                                onClick={() => submitChoice(2, idx)}
                                className="py-5 rounded-xl bg-orange-50 hover:bg-orange-600 hover:text-white border border-orange-200 text-[#161614] font-mono text-2xl font-extrabold transition-colors disabled:opacity-50 relative"
                            >
                                <span className="absolute top-1.5 left-2 text-[10px] font-semibold opacity-60">
                                    [{idx === 0 ? "8" : idx === 1 ? "9" : "0"}]
                                </span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
