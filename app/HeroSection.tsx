"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, RotateCcw } from "lucide-react";
import { TOOL_COUNT } from "@/config/tool-mapping";
import { useTranslation } from "@/lib/i18n/context";
import { ToolIcon } from "@/components/ToolIcon";

type QuickPhase = "idle" | "waiting" | "ready" | "early" | "result";

const QUICK_LAUNCH_TOOLS = [
    {
        id: "queens",
        label: "Queens",
        meta: "Daily Logic",
        href: "/puzzles/queens",
    },
    {
        id: "sequence",
        label: "Sequence Memory",
        meta: "Working Span",
        href: "/memory/sequence",
    },
    {
        id: "typing",
        label: "Typing Speed",
        meta: "WPM Benchmark",
        href: "/speed/typing",
    },
    {
        id: "aim",
        label: "Aim Trainer",
        meta: "Mouse Control",
        href: "/gaming/aim",
    },
] as const;

export function HeroSection() {
    const { t, getLocalizedHref } = useTranslation();

    const [phase, setPhase] = useState<QuickPhase>("idle");
    const [lastMs, setLastMs] = useState<number | null>(null);
    const [attempts, setAttempts] = useState<number[]>([]);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const readyAtRef = useRef<number>(0);

    const clearPendingTimer = useCallback(() => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => clearPendingTimer();
    }, [clearPendingTimer]);

    const startRound = useCallback(() => {
        clearPendingTimer();
        setPhase("waiting");
        const delayMs = 1350 + Math.floor(Math.random() * 1850);
        timerRef.current = setTimeout(() => {
            readyAtRef.current = performance.now();
            setPhase("ready");
            timerRef.current = null;
        }, delayMs);
    }, [clearPendingTimer]);

    const handlePadInteract = useCallback(() => {
        if (phase === "idle" || phase === "result" || phase === "early") {
            startRound();
            return;
        }
        if (phase === "waiting") {
            clearPendingTimer();
            setPhase("early");
            return;
        }
        if (phase === "ready") {
            const elapsed = Math.max(1, Math.round(performance.now() - readyAtRef.current));
            setLastMs(elapsed);
            setAttempts((prev) => [elapsed, ...prev].slice(0, 5));
            setPhase("result");
        }
    }, [phase, startRound, clearPendingTimer]);

    const resetSession = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            clearPendingTimer();
            setPhase("idle");
            setLastMs(null);
            setAttempts([]);
        },
        [clearPendingTimer]
    );

    const averageMs =
        attempts.length > 0
            ? Math.round(attempts.reduce((sum, n) => sum + n, 0) / attempts.length)
            : null;
    const bestMs = attempts.length > 0 ? Math.min(...attempts) : null;

    const padStyles: Record<QuickPhase, string> = {
        idle: "bg-[#FAF9F6] hover:bg-[#F3F1EB] border-[#E6E3DB] text-[#161614]",
        waiting: "bg-[#FFFBEB] border-amber-300 text-amber-950",
        ready: "bg-emerald-600 hover:bg-emerald-700 border-emerald-700 text-white",
        early: "bg-rose-50 border-rose-300 text-rose-900",
        result: "bg-[#FAF9F6] hover:bg-[#F3F1EB] border-[#E6E3DB] text-[#161614]",
    };

    return (
        <section className="relative bg-[#FAF9F6] border-b border-[#E6E3DB]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-14 sm:pt-14 sm:pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
                    {/* Left Editorial Column */}
                    <div className="lg:col-span-5 flex flex-col justify-center items-start text-left gap-6 min-w-0">
                        <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#78756C]">
                            {t("home.heroBadge", "Independent Cognitive & Puzzle Lab")}
                        </p>

                        <h1 className="font-serif text-4xl sm:text-5xl lg:text-[3.35rem] font-medium tracking-[-0.02em] text-[#161614] leading-[1.06] [text-wrap:balance]">
                            {t("home.heroTitle", "Test Your")}{" "}
                            <em className="italic font-normal text-[#1E40AF]">
                                {t("home.heroTitleHighlight", "Reaction Time")}
                            </em>{" "}
                            &amp; {t("nav.reflex", "Reflexes")}
                        </h1>

                        <p className="text-[#57554E] text-base sm:text-[17px] leading-relaxed max-w-lg">
                            <strong className="font-semibold text-[#161614]">
                                {TOOL_COUNT} free browser tools
                            </strong>{" "}
                            for reaction time, working memory, typing speed, and aim—plus 9 daily logic puzzles with 10,800+ handcrafted levels.
                        </p>

                        {/* Disciplined Primary + Secondary Action Hierarchy */}
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                            <Link
                                href={getLocalizedHref("/reflex/reaction")}
                                className="inline-flex items-center gap-2 min-h-[48px] px-6 py-3 rounded-lg text-sm font-semibold bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 whitespace-nowrap touch-manipulation"
                            >
                                <span>{t("home.startTesting", "Test Reaction Time")}</span>
                                <ArrowRight className="w-4 h-4" aria-hidden="true" />
                            </Link>
                            <Link
                                href={getLocalizedHref("/puzzles")}
                                className="inline-flex items-center gap-2 min-h-[48px] px-5 py-3 rounded-lg text-sm font-semibold border border-[#D8D4C9] bg-white text-[#161614] hover:bg-[#F3F1EC] hover:border-[#161614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 whitespace-nowrap touch-manipulation"
                            >
                                <span>9 Logic Puzzles</span>
                            </Link>
                            <Link
                                href={getLocalizedHref("/tools")}
                                className="inline-flex items-center gap-1.5 min-h-[44px] px-2 py-2 text-sm font-medium text-[#57554E] hover:text-[#161614] underline underline-offset-4 decoration-[#D8D4C9] hover:decoration-[#161614] transition-colors whitespace-nowrap touch-manipulation"
                            >
                                <span>Browse all {TOOL_COUNT} tools</span>
                            </Link>
                        </div>

                        {/* Unboxed Hairline-Divided Key Figures */}
                        <dl className="w-full pt-5 mt-1 border-t border-[#E6E3DB] grid grid-cols-3 gap-3 sm:gap-4">
                            {[
                                { val: "ms", label: t("home.statReaction", "Honest timing") },
                                { val: String(TOOL_COUNT), label: t("home.statTools", "Interactive tools") },
                                { val: "10,800+", label: "Logic levels" },
                            ].map((stat, idx) => (
                                <div
                                    key={stat.label}
                                    className={idx > 0 ? "border-l border-[#E6E3DB] pl-3 sm:pl-4 min-w-0" : "min-w-0"}
                                >
                                    <dt className="text-xs text-[#78756C] leading-snug">
                                        {stat.label}
                                    </dt>
                                    <dd className="text-base sm:text-xl font-mono font-semibold text-[#161614] tabular-nums mt-0.5">
                                        {stat.val}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Right Interactive Reaction Bench & Quick Launch */}
                    <div className="lg:col-span-7 w-full min-w-0 flex">
                        <div className="w-full bg-white border border-[#E6E3DB] rounded-2xl flex flex-col justify-between overflow-hidden">
                            {/* Top Bench Header */}
                            <div className="px-5 sm:px-6 py-4 border-b border-[#F0EDE6] flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-xs text-[#57554E]">
                                    <span className="font-semibold text-[#161614]">
                                        Quick Reaction Check
                                    </span>
                                    <span aria-hidden="true">·</span>
                                    <span>Browser millisecond timer</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs font-mono tabular-nums text-[#78756C]">
                                    <span>
                                        Best{" "}
                                        <strong className="text-[#161614]">
                                            {bestMs !== null ? `${bestMs} ms` : "—"}
                                        </strong>
                                    </span>
                                    <span aria-hidden="true">/</span>
                                    <span>
                                        Avg{" "}
                                        <strong className="text-[#161614]">
                                            {averageMs !== null ? `${averageMs} ms` : "—"}
                                        </strong>
                                    </span>
                                    {attempts.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={resetSession}
                                            aria-label="Reset quick reaction trials"
                                            className="inline-flex items-center gap-1 text-[#57554E] hover:text-[#161614] transition-colors cursor-pointer"
                                        >
                                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Interactive Millisecond Pad */}
                            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center">
                                <button
                                    type="button"
                                    onPointerDown={handlePadInteract}
                                    data-testid="hero-quick-reaction-pad"
                                    className={`w-full min-h-[210px] sm:min-h-[240px] rounded-xl border px-5 py-7 flex flex-col items-center justify-center text-center gap-2 transition-colors cursor-pointer select-none touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 ${padStyles[phase]}`}
                                >
                                    {phase === "idle" && (
                                        <>
                                            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                                                Click or tap to measure your reflex
                                            </span>
                                            <span className="text-sm text-[#57554E] max-w-md">
                                                Wait for the surface to turn green, then respond as fast as you can.
                                            </span>
                                        </>
                                    )}

                                    {phase === "waiting" && (
                                        <>
                                            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                                                Wait for green...
                                            </span>
                                            <span className="text-sm text-amber-800">
                                                Hold steady—tapping early resets the trial.
                                            </span>
                                        </>
                                    )}

                                    {phase === "ready" && (
                                        <>
                                            <span className="font-serif text-3xl sm:text-4xl font-semibold tracking-tight">
                                                Tap now
                                            </span>
                                            <span className="text-sm text-emerald-100">
                                                Click anywhere on this surface
                                            </span>
                                        </>
                                    )}

                                    {phase === "early" && (
                                        <>
                                            <span className="font-serif text-2xl sm:text-3xl font-medium tracking-tight">
                                                Too early
                                            </span>
                                            <span className="text-sm text-rose-700">
                                                Tap again to restart the countdown.
                                            </span>
                                        </>
                                    )}

                                    {phase === "result" && lastMs !== null && (
                                        <>
                                            <span className="font-mono text-4xl sm:text-5xl font-bold tabular-nums tracking-tight text-[#161614]">
                                                {lastMs}{" "}
                                                <span className="text-xl sm:text-2xl font-medium text-[#78756C]">
                                                    ms
                                                </span>
                                            </span>
                                            <span className="text-sm text-[#57554E]">
                                                Tap anywhere to run another trial
                                                {attempts.length > 0 ? ` (${attempts.length}/5 recent)` : ""}
                                            </span>
                                        </>
                                    )}
                                </button>

                                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#78756C]">
                                    <span className="font-mono tabular-nums">
                                        {attempts.length > 0
                                            ? `Recent: ${attempts.map((ms) => `${ms}ms`).join(" · ")}`
                                            : "Measured locally with high-resolution performance.now()"}
                                    </span>
                                    <Link
                                        href={getLocalizedHref("/reflex/reaction")}
                                        className="inline-flex items-center gap-1 font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors whitespace-nowrap"
                                    >
                                        <span>Open full 5-round benchmark</span>
                                        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>

                            {/* Hairline-Divided Quick Launch Strip */}
                            <div className="border-t border-[#E6E3DB] grid grid-cols-2 bg-[#FAF9F6]/60">
                                {QUICK_LAUNCH_TOOLS.map((tool, index) => (
                                    <Link
                                        key={tool.id}
                                        href={getLocalizedHref(tool.href)}
                                        className={`group p-3.5 sm:px-4 sm:py-3.5 flex items-center gap-3 hover:bg-white transition-colors min-w-0 ${
                                            index % 2 === 1 ? "border-l border-[#E6E3DB]" : ""
                                        } ${index >= 2 ? "border-t border-[#E6E3DB]" : ""}`}
                                    >
                                        <ToolIcon
                                            toolId={tool.id}
                                            variant="3d"
                                            size="sm"
                                            title={tool.label}
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-[#161614] group-hover:text-[#1E40AF] truncate transition-colors">
                                                {tool.label}
                                            </p>
                                            <p className="text-[11px] text-[#78756C] truncate">
                                                {tool.meta}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
