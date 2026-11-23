"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Scale, RotateCcw, Timer, CheckCircle2, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type Mode = "sandbox" | "challenge";

const SLOTS = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
const WEIGHT_PALETTE = [1, 2, 3, 4, 5, 6, 8, 10];

interface ChallengeSpec {
    lockedLeft: Record<number, number>;
    targetTorque: number;
}

function generateChallenge(): ChallengeSpec {
    // Generate a left-side torque that is cleanly solvable with 1 or 2 right-side weights from palette
    const solvableTargets = [6, 8, 10, 12, 15, 16, 18, 20, 24, 30, 32, 36, 40, 48];
    const targetTorque = solvableTargets[Math.floor(Math.random() * solvableTargets.length)];

    // Find a nice left-side decomposition (1 or 2 weights)
    const pairs: { slot: number; w: number }[] = [];
    for (let slot = 1; slot <= 6; slot++) {
        for (const w of WEIGHT_PALETTE) {
            if (slot * w === targetTorque) {
                pairs.push({ slot: -slot, w });
            }
        }
    }
    if (pairs.length > 0 && Math.random() < 0.55) {
        const pick = pairs[Math.floor(Math.random() * pairs.length)];
        return { lockedLeft: { [pick.slot]: pick.w }, targetTorque };
    }
    // Two-weight left side
    for (let attempt = 0; attempt < 40; attempt++) {
        const s1 = 1 + Math.floor(Math.random() * 6);
        const s2 = 1 + Math.floor(Math.random() * 6);
        if (s1 === s2) continue;
        const w1 = WEIGHT_PALETTE[Math.floor(Math.random() * WEIGHT_PALETTE.length)];
        const rem = targetTorque - s1 * w1;
        if (rem > 0 && rem % s2 === 0 && WEIGHT_PALETTE.includes(rem / s2)) {
            return {
                lockedLeft: { [-s1]: w1, [-s2]: rem / s2 },
                targetTorque,
            };
        }
    }
    // Fallback single weight
    return { lockedLeft: { [-4]: 3 }, targetTorque: 12 };
}

export default function TorqueBalanceGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [mode, setMode] = useState<Mode>("sandbox");
    const [selectedWeight, setSelectedWeight] = useState<number>(4);
    const [weights, setWeights] = useState<Record<number, number>>({ [-3]: 4, [2]: 6 });
    const [lockedSlots, setLockedSlots] = useState<number[]>([]);

    // Timed challenge state
    const [challengeRunning, setChallengeRunning] = useState(false);
    const [timeLeft, setTimeLeft] = useState(60);
    const [solvedCount, setSolvedCount] = useState(0);
    const [challengeEnded, setChallengeEnded] = useState(false);

    // Calculate left and right torques
    let leftTorque = 0;
    let rightTorque = 0;
    for (const [slotStr, mass] of Object.entries(weights)) {
        const slot = Number(slotStr);
        if (slot < 0) leftTorque += Math.abs(slot) * mass;
        if (slot > 0) rightTorque += slot * mass;
    }

    const netTorque = rightTorque - leftTorque;
    const isBalanced = leftTorque > 0 && leftTorque === rightTorque;
    const tiltDeg = Math.max(-18, Math.min(18, netTorque * 0.65));

    const startChallenge = useCallback(() => {
        const first = generateChallenge();
        setMode("challenge");
        setWeights(first.lockedLeft);
        setLockedSlots(Object.keys(first.lockedLeft).map(Number));
        setSolvedCount(0);
        setTimeLeft(60);
        setChallengeEnded(false);
        setChallengeRunning(true);
    }, []);

    // Timer tick
    useEffect(() => {
        if (!challengeRunning) return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setChallengeRunning(false);
                    setChallengeEnded(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [challengeRunning]);

    // Save score on challenge completion
    useEffect(() => {
        if (challengeEnded) {
            ScoreHistory.save("torque-balance", solvedCount, "puzzles", "60s-challenge", {
                higherIsBetter: true,
                configuration: "60s-timed",
            });
        }
    }, [challengeEnded, solvedCount]);

    // Auto-advance challenge when balanced
    useEffect(() => {
        if (!challengeRunning || !isBalanced) return;
        const timer = setTimeout(() => {
            setSolvedCount((c) => c + 1);
            const next = generateChallenge();
            setWeights(next.lockedLeft);
            setLockedSlots(Object.keys(next.lockedLeft).map(Number));
        }, 550);
        return () => clearTimeout(timer);
    }, [challengeRunning, isBalanced]);

    const handleSlotClick = (slot: number) => {
        if (mode === "challenge") {
            if (!challengeRunning) return;
            if (lockedSlots.includes(slot) || slot < 0) return;
        }
        setWeights((prev) => {
            const next = { ...prev };
            if (next[slot] === selectedWeight) {
                delete next[slot];
            } else {
                next[slot] = selectedWeight;
            }
            return next;
        });
    };

    const resetSandbox = () => {
        setChallengeRunning(false);
        setChallengeEnded(false);
        setLockedSlots([]);
        setWeights({ [-3]: 4 });
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-5">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/stem")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.stem.title", "STEM & Physics Lab")}</span>
                </Link>

                <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setMode("sandbox");
                            resetSandbox();
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                            mode === "sandbox" ? "bg-[#161614] text-[#FAF9F6]" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        Sandbox Lab
                    </button>
                    <button
                        type="button"
                        onClick={startChallenge}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                            mode === "challenge" ? "bg-[#161614] text-[#FAF9F6]" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        <Timer className="w-4 h-4" />
                        <span>60s Challenge</span>
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.torque-balance.title", "Seesaw Torque Balance")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        {mode === "sandbox"
                            ? "Click any meter mark along the beam to place or remove weights and explore rotational equilibrium."
                            : "Place weights on the right side (+1m to +6m) so right torque matches the locked left-side load."}
                    </p>
                </div>

                {mode === "challenge" ? (
                    <div className="flex items-center gap-5 font-mono tabular-nums">
                        <div className="text-right">
                            <div className="text-[11px] uppercase text-[#78756C]">Time Left</div>
                            <div className={`text-xl font-bold ${timeLeft <= 10 ? "text-rose-600" : "text-[#161614]"}`}>
                                {timeLeft}s
                            </div>
                        </div>
                        <div className="text-right pl-4 border-l border-[#E6E3DB]">
                            <div className="text-[11px] uppercase text-[#78756C]">Balanced</div>
                            <div className="text-xl font-bold text-emerald-700">{solvedCount}</div>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 font-mono text-sm font-bold tabular-nums">
                        <Scale className="w-4 h-4 text-indigo-600" />
                        <span className={isBalanced ? "text-emerald-700" : "text-[#3F3E39]"}>
                            {isBalanced ? "EQUILIBRIUM (τ_net = 0)" : `τ_net = ${netTorque > 0 ? `+${netTorque}` : netTorque} kg·m`}
                        </span>
                    </div>
                )}
            </div>

            {/* Two-Zone Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Visual Seesaw Stage */}
                <div className="lg:col-span-8 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-between gap-5">
                    <div className="relative h-[320px] sm:h-[360px] rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] flex flex-col items-center justify-center overflow-hidden px-4">
                        {/* Equilibrium Indicator Banner */}
                        <div
                            className={`absolute top-4 left-4 right-4 flex items-center justify-between text-xs font-mono font-semibold px-3.5 py-2 rounded-lg border ${
                                isBalanced
                                    ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                                    : "bg-white border-[#E6E3DB] text-[#3F3E39]"
                            }`}
                        >
                            <span>Left τ = {leftTorque} kg·m</span>
                            <span className="inline-flex items-center gap-1.5">
                                {isBalanced ? (
                                    <>
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                        BALANCED!
                                    </>
                                ) : (
                                    <>Tilt: {tiltDeg.toFixed(1)}°</>
                                )}
                            </span>
                            <span>Right τ = {rightTorque} kg·m</span>
                        </div>

                        {/* Seesaw Beam Assembly */}
                        <div className="relative w-full max-w-[600px] mt-10 flex flex-col items-center">
                            <div
                                className="w-full relative transition-transform duration-500 ease-out"
                                style={{ transform: `rotate(${tiltDeg}deg)` }}
                            >
                                {/* Weight slots row */}
                                <div className="grid grid-cols-13 items-end gap-0.5 mb-1">
                                    {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((slot) => {
                                        if (slot === 0) {
                                            return (
                                                <div key={0} className="flex flex-col items-center justify-end h-20">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 mb-1" />
                                                </div>
                                            );
                                        }
                                        const mass = weights[slot];
                                        const isLocked = lockedSlots.includes(slot);
                                        const isDisabled = mode === "challenge" && (slot < 0 || !challengeRunning);
                                        return (
                                            <button
                                                key={slot}
                                                type="button"
                                                disabled={isDisabled}
                                                onClick={() => handleSlotClick(slot)}
                                                className={`group h-20 flex flex-col items-center justify-end rounded-lg transition-colors ${
                                                    isDisabled ? "cursor-default" : "hover:bg-indigo-100/70 cursor-pointer"
                                                }`}
                                                title={`Slot ${slot > 0 ? `+${slot}m` : `${slot}m`}`}
                                            >
                                                {mass ? (
                                                    <div
                                                        className={`w-full max-w-[38px] rounded-t-lg border-2 flex items-center justify-center font-mono text-xs font-bold text-white shadow-xs transition-all ${
                                                            isLocked
                                                                ? "bg-slate-700 border-slate-900"
                                                                : slot < 0
                                                                ? "bg-indigo-600 border-indigo-800"
                                                                : "bg-blue-600 border-blue-800"
                                                        }`}
                                                        style={{ height: `${Math.min(68, 22 + mass * 4.5)}px` }}
                                                    >
                                                        {mass}
                                                    </div>
                                                ) : (
                                                    <div
                                                        className={`w-3 h-3 rounded-full border border-dashed mb-2 transition-colors ${
                                                            isDisabled
                                                                ? "border-[#D8D4C9]"
                                                                : "border-slate-400 group-hover:border-indigo-600 group-hover:bg-indigo-200"
                                                        }`}
                                                    />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Beam Bar */}
                                <div className="h-3.5 w-full rounded-full bg-slate-800 shadow-sm relative" />

                                {/* Meter Ticks */}
                                <div className="grid grid-cols-13 text-center mt-1.5 font-mono text-[10px] font-semibold text-[#78756C] tabular-nums">
                                    {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((slot) => (
                                        <span key={slot}>{slot === 0 ? "▲" : `${Math.abs(slot)}m`}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Fulcrum Stand */}
                            <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[42px] border-b-indigo-600 -mt-5" />
                            <div className="w-28 h-2.5 rounded-full bg-slate-300" />
                        </div>

                        {/* End Challenge Overlay */}
                        {challengeEnded && (
                            <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center gap-3 p-6 text-center">
                                <Sparkles className="w-8 h-8 text-indigo-600" />
                                <h2 className="text-2xl font-extrabold text-[#161614]">Challenge Complete!</h2>
                                <p className="text-sm text-[#57554E]">
                                    You balanced <strong className="text-indigo-700 font-mono">{solvedCount}</strong> torque levers in 60 seconds.
                                </p>
                                <button
                                    type="button"
                                    onClick={startChallenge}
                                    className="px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                                >
                                    Run Another 60s Sprint
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Quick Slot Buttons for Accessibility/Mobile */}
                    <div className="text-xs text-[#78756C] flex flex-wrap items-center justify-between gap-2">
                        <span>Click any slot on the lever to place the selected mass ({selectedWeight} kg), or click an existing weight of the same mass to remove it.</span>
                    </div>
                </div>

                {/* Weight Palette & Formula Deck */}
                <div className="lg:col-span-4 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Select Mass Block (kg)
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                                {WEIGHT_PALETTE.map((w) => (
                                    <button
                                        key={w}
                                        type="button"
                                        onClick={() => setSelectedWeight(w)}
                                        className={`py-2.5 rounded-xl border font-mono text-sm font-bold transition-colors ${
                                            selectedWeight === w
                                                ? "bg-[#161614] text-[#FAF9F6] border-[#161614] shadow-xs"
                                                : "bg-white text-[#161614] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        {w} kg
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Torque Equation Breakdown */}
                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4 space-y-2.5 font-mono text-xs tabular-nums">
                            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#78756C]">
                                Torque Equation: τ = Σ(m × d)
                            </div>
                            <div className="space-y-1">
                                <div className="text-indigo-800 font-semibold">Left (Counter-Clockwise):</div>
                                <div className="text-[#57554E] break-words">
                                    {SLOTS.filter((s) => s < 0 && weights[s]).length === 0
                                        ? "0 kg·m"
                                        : SLOTS.filter((s) => s < 0 && weights[s])
                                              .map((s) => `(${weights[s]}kg × ${Math.abs(s)}m)`)
                                              .join(" + ") + ` = ${leftTorque}`}
                                </div>
                            </div>
                            <div className="space-y-1 pt-2 border-t border-[#E6E3DB]">
                                <div className="text-blue-800 font-semibold">Right (Clockwise):</div>
                                <div className="text-[#57554E] break-words">
                                    {SLOTS.filter((s) => s > 0 && weights[s]).length === 0
                                        ? "0 kg·m"
                                        : SLOTS.filter((s) => s > 0 && weights[s])
                                              .map((s) => `(${weights[s]}kg × ${s}m)`)
                                              .join(" + ") + ` = ${rightTorque}`}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {mode === "sandbox" ? (
                            <button
                                type="button"
                                onClick={() => setWeights({})}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-sm font-semibold text-[#3F3E39] transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Clear All Weights</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => {
                                    setWeights((prev) => {
                                        const kept: Record<number, number> = {};
                                        lockedSlots.forEach((s) => {
                                            if (prev[s]) kept[s] = prev[s];
                                        });
                                        return kept;
                                    });
                                }}
                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-sm font-semibold text-[#3F3E39] transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Clear Right Side</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
