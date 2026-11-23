"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Calculator, RotateCcw, Trophy, CornerDownLeft, Delete } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type EntryMode = "invoices" | "integers" | "skus";

function generateEntry(mode: EntryMode): string {
    if (mode === "invoices") {
        const dollars = 12 + Math.floor(Math.random() * 9400);
        const cents = Math.floor(Math.random() * 100)
            .toString()
            .padStart(2, "0");
        return `${dollars}.${cents}`;
    }
    if (mode === "integers") {
        const len = 4 + Math.floor(Math.random() * 3);
        let out = String(1 + Math.floor(Math.random() * 9));
        for (let i = 1; i < len; i++) out += String(Math.floor(Math.random() * 10));
        return out;
    }
    const left = (100 + Math.floor(Math.random() * 899)).toString();
    const right = (100 + Math.floor(Math.random() * 899)).toString();
    return `${left}-${right}`;
}

export default function TenKeyGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [mode, setMode] = useState<EntryMode>("invoices");
    const [duration, setDuration] = useState<30 | 60>(30);
    const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
    const [timeLeft, setTimeLeft] = useState<number>(30);
    const [queue, setQueue] = useState<string[]>(() =>
        Array.from({ length: 6 }, () => generateEntry("invoices"))
    );
    const [typed, setTyped] = useState("");
    const [correctChars, setCorrectChars] = useState(0);
    const [totalChars, setTotalChars] = useState(0);
    const [entriesDone, setEntriesDone] = useState(0);
    const [lastPressed, setLastPressed] = useState<string | null>(null);

    const startTsRef = useRef<number>(0);
    const correctRef = useRef(0);
    const totalRef = useRef(0);
    const durationRef = useRef<30 | 60>(30);
    const modeRef = useRef<EntryMode>("invoices");

    useEffect(() => {
        durationRef.current = duration;
    }, [duration]);
    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    const resetSession = useCallback(
        (nextMode: EntryMode = mode, nextDur: 30 | 60 = duration) => {
            setMode(nextMode);
            setDuration(nextDur);
            setPhase("idle");
            setTimeLeft(nextDur);
            setQueue(Array.from({ length: 6 }, () => generateEntry(nextMode)));
            setTyped("");
            setCorrectChars(0);
            setTotalChars(0);
            setEntriesDone(0);
            correctRef.current = 0;
            totalRef.current = 0;
        },
        [mode, duration]
    );

    // Countdown timer
    useEffect(() => {
        if (phase !== "running") return;
        const interval = setInterval(() => {
            const elapsedSec = (performance.now() - startTsRef.current) / 1000;
            const rem = Math.max(0, Math.ceil(durationRef.current - elapsedSec));
            setTimeLeft(rem);
            if (elapsedSec >= durationRef.current) {
                clearInterval(interval);
                setPhase("done");
                const netKph = Math.round((correctRef.current / durationRef.current) * 3600);
                const acc = totalRef.current > 0 ? Math.round((correctRef.current / totalRef.current) * 100) : 100;
                ScoreHistory.save("ten-key", netKph, "KPH", modeRef.current, {
                    higherIsBetter: true,
                    accuracy: acc,
                    configuration: `${durationRef.current}s-${modeRef.current}`,
                });
            }
        }, 100);
        return () => clearInterval(interval);
    }, [phase]);

    const handleKeyInput = useCallback(
        (key: string) => {
            if (phase === "done") return;

            if (phase === "idle") {
                startTsRef.current = performance.now();
                setPhase("running");
            }

            setLastPressed(key);
            setTimeout(() => setLastPressed(null), 130);

            if (key === "Backspace") {
                setTyped((prev) => prev.slice(0, -1));
                return;
            }

            if (key === "Enter" || key === " ") {
                const target = queue[0];
                if (!typed.length) return;
                let matched = 0;
                const maxLen = Math.max(target.length, typed.length);
                for (let i = 0; i < target.length; i++) {
                    if (typed[i] === target[i]) matched++;
                }
                correctRef.current += matched;
                totalRef.current += maxLen;
                setCorrectChars(correctRef.current);
                setTotalChars(totalRef.current);
                setEntriesDone((e) => e + 1);
                setTyped("");
                setQueue((prev) => [...prev.slice(1), generateEntry(modeRef.current)]);
                return;
            }

            if (/^[0-9.\-]$/.test(key)) {
                setTyped((prev) => (prev.length < 14 ? prev + key : prev));
            }
        },
        [phase, queue, typed]
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (/^[0-9.\-]$/.test(e.key) || e.key === "Backspace" || e.key === "Enter") {
                e.preventDefault();
                handleKeyInput(e.key);
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [handleKeyInput]);

    const elapsedSec = phase === "idle" ? 0 : Math.max(1, duration - timeLeft);
    const liveKph =
        phase === "done"
            ? Math.round((correctChars / duration) * 3600)
            : phase === "running"
            ? Math.round((correctChars / elapsedSec) * 3600)
            : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    const currentTarget = queue[0] || "";

    const PAD_KEYS = [
        ["7", "8", "9", "Backspace"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "."],
        ["0", "Enter"],
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/productivity")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.productivity.title", "Student & Work Suite")}</span>
                </Link>

                <div className="flex flex-wrap items-center gap-2">
                    <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                        {(
                            [
                                { id: "invoices", label: "Invoices ($)" },
                                { id: "integers", label: "Integers" },
                                { id: "skus", label: "SKUs (xxx-xxx)" },
                            ] as { id: EntryMode; label: string }[]
                        ).map((m) => (
                            <button
                                key={m.id}
                                type="button"
                                onClick={() => resetSession(m.id, duration)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                    mode === m.id ? "bg-teal-600 text-white" : "text-[#57554E] hover:text-[#161614]"
                                }`}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>

                    <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                        {([30, 60] as (30 | 60)[]).map((d) => (
                            <button
                                key={d}
                                type="button"
                                onClick={() => resetSession(mode, d)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-colors ${
                                    duration === d ? "bg-slate-900 text-white" : "text-[#57554E] hover:text-[#161614]"
                                }`}
                            >
                                {d}s
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Header & Live Metrics */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.ten-key.title", "10-Key Numpad Speed Test")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        Type each numeric entry using your keyboard numpad or the interactive pad, then press Enter.
                    </p>
                </div>

                <div className="flex items-center gap-5 font-mono tabular-nums">
                    <div className="text-right">
                        <div className="text-[11px] uppercase text-[#78756C]">Time</div>
                        <div className={`text-xl font-bold ${timeLeft <= 5 && phase === "running" ? "text-rose-600" : "text-[#161614]"}`}>
                            {timeLeft}s
                        </div>
                    </div>
                    <div className="text-right pl-4 border-l border-[#E6E3DB]">
                        <div className="text-[11px] uppercase text-[#78756C]">Net KPH</div>
                        <div className="text-xl font-bold text-teal-700">{liveKph.toLocaleString()}</div>
                    </div>
                    <div className="text-right pl-4 border-l border-[#E6E3DB]">
                        <div className="text-[11px] uppercase text-[#78756C]">Accuracy</div>
                        <div className="text-xl font-bold text-[#161614]">{accuracy}%</div>
                    </div>
                </div>
            </div>

            {/* Two-Zone Numpad Bench */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Ledger Queue & Active Entry */}
                <div className="lg:col-span-7 bg-white border border-[#E6E3DB] rounded-2xl p-6 flex flex-col justify-between gap-5">
                    {phase === "done" ? (
                        <div className="my-auto text-center space-y-5 py-6">
                            <Trophy className="w-10 h-10 text-teal-600 mx-auto" />
                            <div>
                                <h2 className="text-2xl font-extrabold text-[#161614]">10-Key Benchmark Complete</h2>
                                <p className="text-sm text-[#57554E] mt-1">
                                    Completed {entriesDone} entries in {duration} seconds.
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
                                <div className="rounded-xl bg-teal-50 border border-teal-300 p-4">
                                    <div className="text-[11px] uppercase text-teal-800">Net KPH</div>
                                    <div className="text-2xl font-extrabold text-teal-700">{liveKph.toLocaleString()}</div>
                                </div>
                                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                    <div className="text-[11px] uppercase text-[#78756C]">Accuracy</div>
                                    <div className="text-2xl font-bold text-[#161614]">{accuracy}%</div>
                                </div>
                                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                    <div className="text-[11px] uppercase text-[#78756C]">Entries</div>
                                    <div className="text-2xl font-bold text-[#161614]">{entriesDone}</div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => resetSession(mode, duration)}
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Run Again</span>
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-mono uppercase text-[#78756C]">
                                    <span>Active Entry</span>
                                    <span>{phase === "idle" ? "Start typing any digit to begin timer" : `${entriesDone} logged`}</span>
                                </div>

                                {/* Target Display with char-by-char live diff */}
                                <div className="rounded-2xl bg-slate-900 text-white p-6 text-center font-mono text-4xl sm:text-5xl font-black tracking-wider tabular-nums">
                                    {currentTarget.split("").map((ch, idx) => {
                                        const typedCh = typed[idx];
                                        const color =
                                            typedCh === undefined
                                                ? "text-slate-400"
                                                : typedCh === ch
                                                ? "text-emerald-400"
                                                : "text-rose-400 underline";
                                        return (
                                            <span key={idx} className={color}>
                                                {ch}
                                            </span>
                                        );
                                    })}
                                </div>

                                {/* Typed Echo Bar */}
                                <div className="rounded-xl bg-[#FAF9F6] border-2 border-teal-500/40 px-4 py-3 flex items-center justify-between font-mono text-2xl font-bold text-[#161614] min-h-[58px]">
                                    <span>{typed || <span className="text-slate-400 text-base font-normal">Type digits & press Enter...</span>}</span>
                                    <span className="text-xs font-sans font-semibold text-teal-700">ENTER ↵</span>
                                </div>

                                {/* Upcoming Queue */}
                                <div className="space-y-1.5 pt-2">
                                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                        Upcoming Queue
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 font-mono text-xs tabular-nums">
                                        {queue.slice(1).map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="rounded-lg bg-[#FAF9F6] border border-[#E6E3DB] px-2.5 py-2 text-center text-[#57554E] truncate"
                                            >
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-[#EFECE4] text-xs text-[#78756C]">
                                <span className="inline-flex items-center gap-1.5">
                                    <Calculator className="w-4 h-4 text-teal-600" />
                                    Keep middle finger anchored on 5 for touch 10-key fluency.
                                </span>
                                <button
                                    type="button"
                                    onClick={() => resetSession(mode, duration)}
                                    className="font-semibold text-[#3F3E39] hover:text-[#161614] inline-flex items-center gap-1"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Reset
                                </button>
                            </div>
                        </>
                    )}
                </div>

                {/* Interactive Visual 10-Key Pad */}
                <div className="lg:col-span-5 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-center">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#78756C] mb-3 text-center">
                        Interactive 10-Key Numpad
                    </div>
                    <div className="space-y-2.5">
                        {PAD_KEYS.map((row, rIdx) => (
                            <div key={rIdx} className="grid grid-cols-4 gap-2.5">
                                {row.map((k) => {
                                    const active = lastPressed === k;
                                    const isEnter = k === "Enter";
                                    const isZero = k === "0";
                                    const isBack = k === "Backspace";
                                    const spanClass = isZero || isEnter ? "col-span-2" : "";
                                    return (
                                        <button
                                            key={k}
                                            type="button"
                                            onClick={() => handleKeyInput(k)}
                                            className={`${spanClass} h-14 rounded-xl border font-mono text-lg font-bold transition-all flex items-center justify-center gap-1.5 select-none ${
                                                active
                                                    ? "bg-teal-600 text-white border-teal-600 scale-[0.98]"
                                                    : isEnter
                                                    ? "bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] border-blue-600"
                                                    : k === "5"
                                                    ? "bg-teal-50 hover:bg-teal-100 text-teal-900 border-teal-300 underline decoration-2"
                                                    : "bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] border-[#E6E3DB]"
                                            }`}
                                        >
                                            {isBack ? (
                                                <Delete className="w-5 h-5" />
                                            ) : isEnter ? (
                                                <>
                                                    <CornerDownLeft className="w-4 h-4" />
                                                    <span className="text-sm">ENTER</span>
                                                </>
                                            ) : (
                                                k
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
