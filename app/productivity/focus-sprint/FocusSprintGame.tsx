"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Zap, Play, RotateCcw, CheckCircle2, Activity, FastForward } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type Stage = "setup" | "preCheck" | "sprint" | "postCheck" | "summary";
type TrialState = "ready" | "waiting" | "go" | "tooSoon";

const PRESETS = [
    { label: "1m Demo", seconds: 60 },
    { label: "10m Quick", seconds: 600 },
    { label: "15m Study", seconds: 900 },
    { label: "25m Pomodoro", seconds: 1500 },
];

const CHECK_TRIALS = 3;

export default function FocusSprintGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [durationSec, setDurationSec] = useState<number>(60);
    const [taskGoal, setTaskGoal] = useState<string>("Deep study or focused work block");
    const [stage, setStage] = useState<Stage>("setup");

    // Reaction mini-check state (used for preCheck & postCheck)
    const [trialState, setTrialState] = useState<TrialState>("ready");
    const [currentTrials, setCurrentTrials] = useState<number[]>([]);
    const [preAvgMs, setPreAvgMs] = useState<number>(0);
    const [postAvgMs, setPostAvgMs] = useState<number>(0);

    // Wall-clock sprint state
    const [remainingSec, setRemainingSec] = useState<number>(60);
    const [actualSprintSec, setActualSprintSec] = useState<number>(0);

    const sprintEndAtRef = useRef<number>(0);
    const sprintStartAtRef = useRef<number>(0);
    const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const goAtRef = useRef<number>(0);

    const clearWaitTimer = () => {
        if (waitTimerRef.current) {
            clearTimeout(waitTimerRef.current);
            waitTimerRef.current = null;
        }
    };

    const startNextTrial = useCallback(() => {
        clearWaitTimer();
        setTrialState("waiting");
        const delay = 1100 + Math.random() * 1900;
        waitTimerRef.current = setTimeout(() => {
            goAtRef.current = performance.now();
            setTrialState("go");
        }, delay);
    }, []);

    const beginFlow = () => {
        setCurrentTrials([]);
        setPreAvgMs(0);
        setPostAvgMs(0);
        setStage("preCheck");
        startNextTrial();
    };

    const startSprintClock = useCallback((sec: number) => {
        const now = Date.now();
        sprintStartAtRef.current = now;
        sprintEndAtRef.current = now + sec * 1000;
        setRemainingSec(sec);
        setStage("sprint");
    }, []);

    // Real wall-clock Pomodoro ticker (immune to background tab throttling)
    useEffect(() => {
        if (stage !== "sprint") return;
        const interval = setInterval(() => {
            const now = Date.now();
            const rem = Math.max(0, Math.ceil((sprintEndAtRef.current - now) / 1000));
            setRemainingSec(rem);
            if (now >= sprintEndAtRef.current) {
                clearInterval(interval);
                setActualSprintSec(Math.round((now - sprintStartAtRef.current) / 1000));
                setCurrentTrials([]);
                setStage("postCheck");
                startNextTrial();
            }
        }, 250);
        return () => clearInterval(interval);
    }, [stage, startNextTrial]);

    useEffect(() => {
        return () => clearWaitTimer();
    }, []);

    const handleReactionPadClick = () => {
        if (trialState === "waiting") {
            clearWaitTimer();
            setTrialState("tooSoon");
            setTimeout(() => startNextTrial(), 900);
            return;
        }
        if (trialState === "go") {
            const rt = Math.max(80, Math.round(performance.now() - goAtRef.current));
            const next = [...currentTrials, rt];
            setCurrentTrials(next);

            if (next.length >= CHECK_TRIALS) {
                const avg = Math.round(next.reduce((a, b) => a + b, 0) / next.length);
                if (stage === "preCheck") {
                    setPreAvgMs(avg);
                    startSprintClock(durationSec);
                } else if (stage === "postCheck") {
                    setPostAvgMs(avg);
                    setStage("summary");
                    ScoreHistory.save("focus-sprint", avg, "ms", `${Math.round(durationSec / 60)}m`, {
                        higherIsBetter: false,
                        configuration: `sprint-${durationSec}s`,
                    });
                }
            } else {
                startNextTrial();
            }
        }
    };

    const completeSprintEarly = () => {
        const elapsed = Math.max(5, Math.round((Date.now() - sprintStartAtRef.current) / 1000));
        setActualSprintSec(elapsed);
        setCurrentTrials([]);
        setStage("postCheck");
        startNextTrial();
    };

    const formatClock = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    };

    const deltaMs = postAvgMs - preAvgMs;

    return (
        <div className="w-full max-w-5xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/productivity")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.productivity.title", "Student & Work Suite")}</span>
                </Link>

                {/* Step Progress Indicator */}
                <div className="flex items-center gap-2 text-xs font-mono">
                    {(
                        [
                            { id: "preCheck", label: "1. Pre-Check" },
                            { id: "sprint", label: "2. Focus Sprint" },
                            { id: "postCheck", label: "3. Post-Check" },
                            { id: "summary", label: "4. Fatigue Delta" },
                        ] as { id: Stage; label: string }[]
                    ).map((step) => (
                        <span
                            key={step.id}
                            className={`px-2.5 py-1 rounded-lg border ${
                                stage === step.id
                                    ? "bg-teal-600 text-white border-teal-600 font-semibold"
                                    : "bg-white text-[#78756C] border-[#E6E3DB]"
                            }`}
                        >
                            {step.label}
                        </span>
                    ))}
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.focus-sprint.title", "Focus Sprint & Fatigue Tracker")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        Measure your alertness in milliseconds before and after a distraction-free Pomodoro sprint.
                    </p>
                </div>
                {preAvgMs > 0 && (
                    <div className="text-right font-mono tabular-nums">
                        <div className="text-[11px] uppercase text-[#78756C]">Pre-Sprint Baseline</div>
                        <div className="text-lg font-bold text-teal-700">{preAvgMs} ms</div>
                    </div>
                )}
            </div>

            {/* Stage Card */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8">
                {stage === "setup" && (
                    <div className="max-w-xl mx-auto space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Sprint Duration
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                {PRESETS.map((p) => (
                                    <button
                                        key={p.seconds}
                                        type="button"
                                        onClick={() => setDurationSec(p.seconds)}
                                        className={`py-3 px-3 rounded-xl border text-sm font-semibold transition-colors ${
                                            durationSec === p.seconds
                                                ? "bg-teal-600 text-white border-teal-600"
                                                : "bg-white text-[#3F3E39] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Single-Task Focus Goal
                            </label>
                            <input
                                type="text"
                                value={taskGoal}
                                onChange={(e) => setTaskGoal(e.target.value)}
                                placeholder="e.g., Finish Physics Chapter 4 problems"
                                className="w-full rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] px-4 py-3 text-sm text-[#161614] focus:bg-white focus:border-teal-500 focus:outline-none"
                            />
                        </div>

                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4 text-xs text-[#57554E] space-y-1">
                            <div className="font-semibold text-[#161614]">How This Protocol Works:</div>
                            <p>1. Complete 3 quick visual reaction clicks to log your fresh baseline.</p>
                            <p>2. Stay focused on your goal until the wall-clock sprint finishes.</p>
                            <p>3. Run 3 post-sprint reaction clicks to quantify your cognitive fatigue delta in ms.</p>
                        </div>

                        <button
                            type="button"
                            onClick={beginFlow}
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            <span>Start Pre-Sprint Baseline Check</span>
                        </button>
                    </div>
                )}

                {(stage === "preCheck" || stage === "postCheck") && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-xs font-mono text-[#57554E]">
                            <span>
                                {stage === "preCheck" ? "PRE-SPRINT ALERTNESS CHECK" : "POST-SPRINT FATIGUE CHECK"}
                            </span>
                            <span>
                                Trial {Math.min(currentTrials.length + 1, CHECK_TRIALS)} of {CHECK_TRIALS}
                            </span>
                        </div>

                        <button
                            type="button"
                            onPointerDown={handleReactionPadClick}
                            className={`w-full h-72 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 text-white transition-colors select-none cursor-pointer ${
                                trialState === "go"
                                    ? "bg-emerald-600 border-emerald-700"
                                    : trialState === "tooSoon"
                                    ? "bg-rose-600 border-rose-700"
                                    : "bg-slate-900 border-slate-800"
                            }`}
                        >
                            <Zap className="w-10 h-10" />
                            <span className="text-3xl font-extrabold tracking-tight">
                                {trialState === "go"
                                    ? "CLICK NOW!"
                                    : trialState === "tooSoon"
                                    ? "Too Early — Wait for Green"
                                    : "Wait for Green..."}
                            </span>
                            {currentTrials.length > 0 && (
                                <span className="text-xs font-mono opacity-85">
                                    Logged: {currentTrials.map((ms) => `${ms}ms`).join(" · ")}
                                </span>
                            )}
                        </button>
                    </div>
                )}

                {stage === "sprint" && (
                    <div className="text-center space-y-6 py-6 max-w-lg mx-auto">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
                            <Clock className="w-4 h-4" />
                            <span>Deep Focus Active · Wall-Clock Synced</span>
                        </div>

                        <div className="text-6xl sm:text-7xl font-black font-mono tabular-nums text-[#161614] tracking-tight">
                            {formatClock(remainingSec)}
                        </div>

                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                            <div className="text-[11px] uppercase font-semibold text-[#78756C]">Current Focus Goal</div>
                            <div className="text-base font-bold text-[#161614] mt-1">{taskGoal || "Deep Work Sprint"}</div>
                        </div>

                        <div className="h-2.5 rounded-full bg-[#F3F1EB] overflow-hidden border border-[#E6E3DB]">
                            <div
                                className="h-full bg-teal-600 transition-all duration-300"
                                style={{ width: `${Math.min(100, ((durationSec - remainingSec) / durationSec) * 100)}%` }}
                            />
                        </div>

                        <div className="flex items-center justify-center gap-3 pt-2">
                            <button
                                type="button"
                                onClick={completeSprintEarly}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-xs font-semibold text-[#3F3E39] transition-colors"
                            >
                                <FastForward className="w-3.5 h-3.5" />
                                <span>Finish Sprint & Run Post-Check</span>
                            </button>
                        </div>
                    </div>
                )}

                {stage === "summary" && (
                    <div className="max-w-xl mx-auto text-center space-y-6 py-4">
                        <Activity className="w-10 h-10 text-teal-600 mx-auto" />
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#161614]">Focus Fatigue Report</h2>
                            <p className="text-sm text-[#57554E] mt-1">
                                Focused for {Math.max(1, Math.round(actualSprintSec / 60))} minute(s) on:{" "}
                                <strong className="text-[#161614]">{taskGoal}</strong>
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                <div className="text-[11px] uppercase text-[#78756C]">Pre-Sprint</div>
                                <div className="text-2xl font-bold text-[#161614]">{preAvgMs} ms</div>
                            </div>
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                <div className="text-[11px] uppercase text-[#78756C]">Post-Sprint</div>
                                <div className="text-2xl font-bold text-[#161614]">{postAvgMs} ms</div>
                            </div>
                            <div
                                className={`rounded-xl border p-4 ${
                                    deltaMs <= 10
                                        ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                        : "bg-amber-50 border-amber-300 text-amber-800"
                                }`}
                            >
                                <div className="text-[11px] uppercase">Fatigue Delta</div>
                                <div className="text-2xl font-extrabold">
                                    {deltaMs > 0 ? `+${deltaMs}` : deltaMs} ms
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4 text-sm text-[#3F3E39] flex items-start gap-2.5 text-left">
                            <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                            <span>
                                {deltaMs <= 0
                                    ? "Your reaction latency sharpened during the sprint—you hit strong cognitive warm-up and flow."
                                    : deltaMs <= 20
                                    ? "Minimal cognitive fatigue detected. Take a 3–5 minute movement break before starting another block."
                                    : "Measurable reaction slowing detected (+20ms+). Step away from the screen for 10 minutes and hydrate to restore peak alertness."}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => setStage("setup")}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" />
                            <span>Plan Next Focus Sprint</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
