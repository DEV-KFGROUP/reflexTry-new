"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Timer,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2,
    ArrowRight,
    ChevronDown,
} from "lucide-react";
import {
    DeepWorkLog,
    DEEP_WORK_EVENT,
    FOCUS_PRESETS,
    createDefaultTimerState,
    formatClock,
    formatDurationHuman,
    getModeDurationSec,
    type DeepWorkMode,
    type DeepWorkTimerState,
} from "@/utils/deepWork";
import { SoundManager } from "@/utils/soundManager";
import { toast } from "@/utils/toast";
import { useTranslation } from "@/lib/i18n/context";

const MODE_OPTIONS: { id: DeepWorkMode; label: string; shortLabel: string }[] = [
    { id: "focus", label: "Deep Work", shortLabel: "Focus" },
    { id: "shortBreak", label: "Short Break", shortLabel: "Break" },
    { id: "longBreak", label: "Long Break", shortLabel: "Long" },
];

export function PomodoroTimer() {
    const pathname = usePathname();
    const { getLocalizedHref } = useTranslation();

    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [timer, setTimer] = useState<DeepWorkTimerState>(createDefaultTimerState);
    const [nowMs, setNowMs] = useState<number>(() => Date.now());
    const [todayStats, setTodayStats] = useState({ todaySeconds: 0, totalSessions: 0 });

    const containerRef = useRef<HTMLDivElement>(null);
    const completionLockRef = useRef(false);

    const refreshSummary = useCallback(() => {
        const stats = DeepWorkLog.getStats();
        setTodayStats({
            todaySeconds: stats.todaySeconds,
            totalSessions: stats.totalSessions,
        });
    }, []);

    // Hydrate persisted timer state on mount so sessions survive navigation & reloads
    useEffect(() => {
        setMounted(true);
        const loaded = DeepWorkLog.loadTimerState();
        setTimer(loaded);
        setNowMs(Date.now());
        refreshSummary();

        const onDeepWorkUpdate = () => refreshSummary();
        window.addEventListener(DEEP_WORK_EVENT, onDeepWorkUpdate);
        return () => window.removeEventListener(DEEP_WORK_EVENT, onDeepWorkUpdate);
    }, [refreshSummary]);

    // Close popover on outside click or Escape
    useEffect(() => {
        if (!open) return;
        const handleOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        };
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", handleOutside);
        document.addEventListener("keydown", handleKey);
        return () => {
            document.removeEventListener("mousedown", handleOutside);
            document.removeEventListener("keydown", handleKey);
        };
    }, [open]);

    // Track visited pages during an active deep work session
    useEffect(() => {
        if (!mounted || !pathname) return;
        setTimer((prev) => {
            if (prev.mode !== "focus" || prev.status !== "running") return prev;
            if (prev.pagesVisited.includes(pathname)) return prev;
            const next: DeepWorkTimerState = {
                ...prev,
                pagesVisited: [...prev.pagesVisited, pathname].slice(-12),
            };
            DeepWorkLog.saveTimerState(next);
            return next;
        });
    }, [pathname, mounted]);

    const persistState = useCallback((next: DeepWorkTimerState) => {
        setTimer(next);
        DeepWorkLog.saveTimerState(next);
    }, []);

    const computeElapsedFocusSec = useCallback(
        (state: DeepWorkTimerState, referenceMs: number): number => {
            if (state.mode !== "focus") return 0;
            const runningDelta =
                state.status === "running" && state.segmentStartedAtMs
                    ? Math.max(0, (referenceMs - state.segmentStartedAtMs) / 1000)
                    : 0;
            return Math.min(
                state.focusMinutes * 60,
                Math.floor(state.accumulatedActiveSec + runningDelta)
            );
        },
        []
    );

    const handleCompleteBlock = useCallback(
        (state: DeepWorkTimerState, finishedAtMs: number) => {
            if (completionLockRef.current) return;
            completionLockRef.current = true;

            if (state.mode === "focus") {
                const targetSec = state.focusMinutes * 60;
                const logged = DeepWorkLog.logSession({
                    startedAt: state.sessionStartedAtMs ?? finishedAtMs - targetSec * 1000,
                    endedAt: finishedAtMs,
                    durationSec: targetSec,
                    targetSec,
                    completed: true,
                    mode: "focus",
                    label: state.label,
                    pagesVisited: state.pagesVisited,
                });
                SoundManager.play("complete");
                if (logged) {
                    toast.success(
                        `Deep work complete: ${formatDurationHuman(logged.durationSec)} logged to Statistics.`
                    );
                }

                const nextCycles = state.completedCycles + 1;
                const nextMode: DeepWorkMode = nextCycles % 4 === 0 ? "longBreak" : "shortBreak";
                const nextDuration = getModeDurationSec(
                    nextMode,
                    state.focusMinutes,
                    state.shortBreakMinutes,
                    state.longBreakMinutes
                );

                persistState({
                    ...state,
                    mode: nextMode,
                    status: "idle",
                    remainingSec: nextDuration,
                    endTimeMs: null,
                    accumulatedActiveSec: 0,
                    segmentStartedAtMs: null,
                    sessionStartedAtMs: null,
                    pagesVisited: [],
                    completedCycles: nextCycles,
                });
            } else {
                SoundManager.play("tick");
                toast.info("Break finished. Ready for your next deep work block.");
                const nextDuration = getModeDurationSec(
                    "focus",
                    state.focusMinutes,
                    state.shortBreakMinutes,
                    state.longBreakMinutes
                );
                persistState({
                    ...state,
                    mode: "focus",
                    status: "idle",
                    remainingSec: nextDuration,
                    endTimeMs: null,
                    accumulatedActiveSec: 0,
                    segmentStartedAtMs: null,
                    sessionStartedAtMs: null,
                    pagesVisited: [],
                });
            }

            refreshSummary();
            setTimeout(() => {
                completionLockRef.current = false;
            }, 250);
        },
        [persistState, refreshSummary]
    );

    // Drift-free 1-second tick loop while running
    useEffect(() => {
        if (!mounted || timer.status !== "running" || !timer.endTimeMs) return;

        const checkTick = () => {
            const current = Date.now();
            setNowMs(current);
            if (timer.endTimeMs && current >= timer.endTimeMs) {
                handleCompleteBlock(timer, timer.endTimeMs);
            }
        };

        checkTick();
        const intervalId = window.setInterval(checkTick, 500);
        return () => window.clearInterval(intervalId);
    }, [mounted, timer, handleCompleteBlock]);

    const totalModeSec = getModeDurationSec(
        timer.mode,
        timer.focusMinutes,
        timer.shortBreakMinutes,
        timer.longBreakMinutes
    );

    const liveRemainingSec =
        mounted && timer.status === "running" && timer.endTimeMs
            ? Math.max(0, (timer.endTimeMs - nowMs) / 1000)
            : timer.remainingSec;

    const progressPct =
        totalModeSec > 0
            ? Math.min(100, Math.max(0, ((totalModeSec - liveRemainingSec) / totalModeSec) * 100))
            : 0;

    const elapsedFocusSec = mounted ? computeElapsedFocusSec(timer, nowMs) : 0;

    const handleStartOrPause = () => {
        const now = Date.now();
        setNowMs(now);

        if (timer.status === "running") {
            const remaining = timer.endTimeMs
                ? Math.max(0, Math.ceil((timer.endTimeMs - now) / 1000))
                : timer.remainingSec;
            const runningDelta =
                timer.mode === "focus" && timer.segmentStartedAtMs
                    ? Math.max(0, (now - timer.segmentStartedAtMs) / 1000)
                    : 0;

            persistState({
                ...timer,
                status: "paused",
                remainingSec: remaining,
                endTimeMs: null,
                accumulatedActiveSec: timer.accumulatedActiveSec + runningDelta,
                segmentStartedAtMs: null,
            });
            return;
        }

        const baseRemaining =
            timer.remainingSec > 0
                ? timer.remainingSec
                : getModeDurationSec(
                      timer.mode,
                      timer.focusMinutes,
                      timer.shortBreakMinutes,
                      timer.longBreakMinutes
                  );

        const initialPages =
            timer.mode === "focus" && pathname
                ? Array.from(new Set([...timer.pagesVisited, pathname]))
                : timer.pagesVisited;

        SoundManager.play("start");
        persistState({
            ...timer,
            status: "running",
            remainingSec: baseRemaining,
            endTimeMs: now + baseRemaining * 1000,
            segmentStartedAtMs: timer.mode === "focus" ? now : null,
            sessionStartedAtMs:
                timer.mode === "focus" ? timer.sessionStartedAtMs ?? now : null,
            pagesVisited: initialPages,
        });
    };

    const handleReset = () => {
        const resetSec = getModeDurationSec(
            timer.mode,
            timer.focusMinutes,
            timer.shortBreakMinutes,
            timer.longBreakMinutes
        );
        persistState({
            ...timer,
            status: "idle",
            remainingSec: resetSec,
            endTimeMs: null,
            accumulatedActiveSec: 0,
            segmentStartedAtMs: null,
            sessionStartedAtMs: null,
            pagesVisited: [],
        });
    };

    const handleFinishAndLog = () => {
        const now = Date.now();
        const elapsed = computeElapsedFocusSec(timer, now);
        if (elapsed < 10) {
            toast.info("Run at least 10 seconds of deep work before logging.");
            return;
        }

        const logged = DeepWorkLog.logSession({
            startedAt: timer.sessionStartedAtMs ?? now - elapsed * 1000,
            endedAt: now,
            durationSec: elapsed,
            targetSec: timer.focusMinutes * 60,
            completed: elapsed >= timer.focusMinutes * 60,
            mode: "focus",
            label: timer.label,
            pagesVisited: timer.pagesVisited,
        });

        if (logged) {
            SoundManager.play("success");
            toast.success(
                `Logged ${formatDurationHuman(logged.durationSec)} of deep work to Statistics.`
            );
        }

        const resetSec = getModeDurationSec(
            "focus",
            timer.focusMinutes,
            timer.shortBreakMinutes,
            timer.longBreakMinutes
        );
        persistState({
            ...timer,
            mode: "focus",
            status: "idle",
            remainingSec: resetSec,
            endTimeMs: null,
            accumulatedActiveSec: 0,
            segmentStartedAtMs: null,
            sessionStartedAtMs: null,
            pagesVisited: [],
        });
        refreshSummary();
    };

    const handleSwitchMode = (nextMode: DeepWorkMode) => {
        const nextSec = getModeDurationSec(
            nextMode,
            timer.focusMinutes,
            timer.shortBreakMinutes,
            timer.longBreakMinutes
        );
        persistState({
            ...timer,
            mode: nextMode,
            status: "idle",
            remainingSec: nextSec,
            endTimeMs: null,
            accumulatedActiveSec: 0,
            segmentStartedAtMs: null,
            sessionStartedAtMs: null,
            pagesVisited: [],
        });
    };

    const handleSelectPreset = (minutes: number) => {
        persistState({
            ...timer,
            mode: "focus",
            focusMinutes: minutes,
            status: "idle",
            remainingSec: minutes * 60,
            endTimeMs: null,
            accumulatedActiveSec: 0,
            segmentStartedAtMs: null,
            sessionStartedAtMs: null,
            pagesVisited: [],
        });
    };

    const isRunning = mounted && timer.status === "running";
    const isPaused = mounted && timer.status === "paused";
    const isBreak = timer.mode !== "focus";

    const triggerClasses = isRunning
        ? isBreak
            ? "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100/80"
            : "bg-[#161614] border-[#161614] text-[#FAF9F6] hover:bg-[#2C2B27]"
        : isPaused
        ? "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/80"
        : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:text-[#161614] hover:bg-[#F3F1EC]";

    return (
        <div ref={containerRef} className="relative shrink-0">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                aria-expanded={open}
                aria-haspopup="dialog"
                aria-label={`Deep work Pomodoro timer, ${formatClock(liveRemainingSec)} remaining`}
                className={`cursor-pointer inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-2 rounded-lg border text-xs font-mono font-semibold whitespace-nowrap shrink-0 tabular-nums transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${triggerClasses}`}
            >
                <Timer className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{formatClock(liveRemainingSec)}</span>
                {isRunning && (
                    <span
                        className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isBreak ? "bg-emerald-600" : "bg-[#FAF9F6]"
                        }`}
                        aria-hidden="true"
                    />
                )}
                <ChevronDown
                    className={`hidden sm:block w-3.5 h-3.5 opacity-60 transition-transform ${
                        open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                />
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Deep Work Pomodoro Timer"
                    className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] sm:w-[340px] bg-white border border-[#E6E3DB] rounded-2xl shadow-xl p-4 sm:p-5 z-50 text-[#161614] space-y-4"
                >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#F0EDE6]">
                        <div>
                            <p className="font-serif text-base font-medium text-[#161614] leading-tight">
                                Deep Work Timer
                            </p>
                            <p className="text-xs text-[#57554E] mt-0.5">
                                {isRunning
                                    ? isBreak
                                        ? "Break active across pages"
                                        : "Session tracking across pages"
                                    : isPaused
                                    ? "Paused · resume or log elapsed time"
                                    : "Pomodoro block · auto-logs to Statistics"}
                            </p>
                        </div>
                        <span className="text-xs font-mono text-[#78756C] tabular-nums whitespace-nowrap shrink-0 pt-0.5">
                            Cycle {(timer.completedCycles % 4) + 1}/4
                        </span>
                    </div>

                    {/* Mode Segmented Switcher */}
                    <div
                        className="grid grid-cols-3 gap-1 p-1 bg-[#F3F1EB] border border-[#E6E3DB] rounded-xl"
                        role="tablist"
                        aria-label="Timer mode"
                    >
                        {MODE_OPTIONS.map((opt) => {
                            const active = timer.mode === opt.id;
                            return (
                                <button
                                    key={opt.id}
                                    type="button"
                                    role="tab"
                                    aria-selected={active}
                                    onClick={() => handleSwitchMode(opt.id)}
                                    className={`cursor-pointer min-h-[42px] py-2 px-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors touch-manipulation ${
                                        active
                                            ? "bg-white text-[#161614] shadow-xs"
                                            : "text-[#57554E] hover:text-[#161614]"
                                    }`}
                                >
                                    {opt.shortLabel}
                                </button>
                            );
                        })}
                    </div>

                    {/* Countdown Display + Progress Track */}
                    <div className="bg-[#FAF9F6] border border-[#E6E3DB] rounded-xl p-4 text-center space-y-3">
                        <div className="text-4xl font-mono font-semibold tracking-tight text-[#161614] tabular-nums">
                            {formatClock(liveRemainingSec)}
                        </div>
                        <div
                            className="w-full h-1.5 rounded-full bg-[#E6E3DB] overflow-hidden"
                            role="progressbar"
                            aria-valuenow={Math.round(progressPct)}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        >
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${
                                    isBreak ? "bg-emerald-600" : "bg-[#1E40AF]"
                                }`}
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>

                        {/* Focus Duration Presets */}
                        {timer.mode === "focus" && timer.status === "idle" && (
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-0.5">
                                {FOCUS_PRESETS.map((mins) => {
                                    const active = timer.focusMinutes === mins;
                                    return (
                                        <button
                                            key={mins}
                                            type="button"
                                            onClick={() => handleSelectPreset(mins)}
                                            className={`cursor-pointer min-h-[40px] min-w-[48px] px-3 py-1.5 rounded-lg text-xs font-mono font-semibold tabular-nums transition-colors touch-manipulation ${
                                                active
                                                    ? "bg-[#161614] text-[#FAF9F6]"
                                                    : "bg-white border border-[#E6E3DB] text-[#57554E] hover:text-[#161614] hover:border-[#161614]"
                                            }`}
                                        >
                                            {mins}m
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Session Label Input (Focus Mode) */}
                    {timer.mode === "focus" && (
                        <div className="space-y-1.5">
                            <label
                                htmlFor="deep-work-label"
                                className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]"
                            >
                                Session focus
                            </label>
                            <input
                                id="deep-work-label"
                                type="text"
                                value={timer.label}
                                maxLength={48}
                                onChange={(e) =>
                                    persistState({ ...timer, label: e.target.value })
                                }
                                placeholder="e.g., Memory Drill, Reaction Warmup"
                                className="w-full min-h-[44px] px-3 py-2 text-base sm:text-xs rounded-lg border border-[#DCD8CE] bg-white text-[#161614] placeholder:text-[#78756C] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                            />
                        </div>
                    )}

                    {/* Primary Controls */}
                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={handleStartOrPause}
                            className={`cursor-pointer flex-1 min-h-[46px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm sm:text-xs font-semibold transition-colors touch-manipulation ${
                                isRunning
                                    ? "bg-[#3F3E39] hover:bg-[#161614] text-[#FAF9F6]"
                                    : isBreak
                                    ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                                    : "bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6]"
                            }`}
                        >
                            {isRunning ? (
                                <>
                                    <Pause className="w-4 h-4" aria-hidden="true" />
                                    <span>Pause</span>
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" aria-hidden="true" />
                                    <span>
                                        {isPaused
                                            ? "Resume"
                                            : isBreak
                                            ? "Start Break"
                                            : "Start Deep Work"}
                                    </span>
                                </>
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={handleReset}
                            aria-label="Reset timer"
                            title="Reset timer"
                            className="cursor-pointer min-w-[46px] min-h-[46px] inline-flex items-center justify-center p-2.5 rounded-xl border border-[#E6E3DB] bg-white text-[#57554E] hover:text-[#161614] hover:bg-[#F3F1EB] transition-colors touch-manipulation"
                        >
                            <RotateCcw className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>

                    {/* Log Early Option when active Focus elapsed >= 10s */}
                    {timer.mode === "focus" && elapsedFocusSec >= 10 && (
                        <button
                            type="button"
                            onClick={handleFinishAndLog}
                            className="cursor-pointer w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-xs font-semibold transition-colors font-mono tabular-nums touch-manipulation"
                        >
                            <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>Finish &amp; log {formatDurationHuman(elapsedFocusSec)}</span>
                        </button>
                    )}

                    {/* Today's Progress Footer */}
                    <div className="pt-2.5 border-t border-[#F0EDE6] flex items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-[#57554E] tabular-nums">
                            Today: {formatDurationHuman(todayStats.todaySeconds)} ·{" "}
                            {todayStats.totalSessions} logged
                        </span>
                        <Link
                            href={getLocalizedHref("/statistics")}
                            onClick={() => setOpen(false)}
                            className="inline-flex items-center gap-1 min-h-[40px] px-2.5 py-1.5 -mr-2 rounded-lg font-semibold text-[#1E40AF] hover:text-[#161614] hover:bg-[#F3F1EB] whitespace-nowrap shrink-0 transition-colors touch-manipulation"
                        >
                            <span>Statistics</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
