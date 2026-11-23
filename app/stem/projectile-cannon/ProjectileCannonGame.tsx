"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Crosshair, RotateCcw, Wind, Trophy, CheckCircle2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

interface TrailPoint {
    x: number;
    y: number;
}

const GRAVITY_PRESETS = [
    { id: "earth", label: "Earth", g: 9.81 },
    { id: "mars", label: "Mars", g: 3.72 },
    { id: "moon", label: "Moon", g: 1.62 },
];

const TOTAL_ROUNDS = 5;

function makeRoundTarget(roundNum: number) {
    // Distance in meters from cannon (50m to 220m)
    const dist = 75 + ((roundNum * 37) % 135);
    const wind = roundNum === 1 ? 0 : ((roundNum * 5) % 15) - 7;
    return { targetX: dist, wind };
}

export default function ProjectileCannonGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [angleDeg, setAngleDeg] = useState<number>(45);
    const [velocity, setVelocity] = useState<number>(36);
    const [gravityIdx, setGravityIdx] = useState<number>(0);
    const [round, setRound] = useState<number>(1);
    const [targetX, setTargetX] = useState<number>(125);
    const [wind, setWind] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [shotsInRound, setShotsInRound] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>("Dial launch angle and muzzle speed, then fire!");
    const [finished, setFinished] = useState<boolean>(false);
    const [isFiring, setIsFiring] = useState<boolean>(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const simRef = useRef({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        t: 0,
        lastTs: 0,
        trail: [] as TrailPoint[],
        ghostTrail: [] as TrailPoint[],
        apex: null as TrailPoint | null,
    });

    const gravity = GRAVITY_PRESETS[gravityIdx].g;
    const rad = (angleDeg * Math.PI) / 180;
    const vx0 = velocity * Math.cos(rad);
    const vy0 = velocity * Math.sin(rad);
    const vacuumRange = (velocity * velocity * Math.sin(2 * rad)) / gravity;
    const vacuumHeight = (vy0 * vy0) / (2 * gravity);
    const vacuumFlight = (2 * vy0) / gravity;

    const resetCampaign = useCallback(() => {
        simRef.current = {
            active: false,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            t: 0,
            lastTs: 0,
            trail: [],
            ghostTrail: [],
            apex: null,
        };
        setRound(1);
        setTargetX(125);
        setWind(0);
        setScore(0);
        setShotsInRound(0);
        setFinished(false);
        setIsFiring(false);
        setFeedback("Dial launch angle and muzzle speed, then fire!");
    }, []);

    const fireCannon = () => {
        if (isFiring || finished) return;
        const st = simRef.current;
        if (st.trail.length > 0) {
            st.ghostTrail = [...st.trail];
        }
        st.active = true;
        st.x = 0;
        st.y = 0;
        st.vx = vx0;
        st.vy = vy0;
        st.t = 0;
        st.trail = [{ x: 0, y: 0 }];
        st.apex = { x: 0, y: 0 };
        st.lastTs = performance.now();
        setIsFiring(true);
        setShotsInRound((s) => s + 1);
        setFeedback("Projectile airborne...");
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const worldMaxX = 260; // meters
        const worldMaxY = 140; // meters

        const loop = (now: number) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            const width = Math.max(320, Math.floor(rect.width));
            const height = Math.max(300, Math.floor(rect.height));

            if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const padL = 44;
            const padR = 24;
            const padB = 42;
            const padT = 24;
            const plotW = width - padL - padR;
            const plotH = height - padT - padB;
            const toPxX = (mx: number) => padL + (mx / worldMaxX) * plotW;
            const toPxY = (my: number) => height - padB - (my / worldMaxY) * plotH;

            const st = simRef.current;
            if (st.active) {
                // Accelerated playback 1.5x for snappy classroom feel
                const dt = Math.min(0.04, Math.max(0.002, (now - st.lastTs) / 1000)) * 1.5;
                st.lastTs = now;
                st.t += dt;

                // Horizontal acceleration from wind drag
                const ax = wind * 0.25;
                st.vx += ax * dt;
                st.vy -= gravity * dt;
                st.x += st.vx * dt;
                st.y += st.vy * dt;

                if (!st.apex || st.y > st.apex.y) {
                    st.apex = { x: st.x, y: st.y };
                }
                st.trail.push({ x: st.x, y: Math.max(0, st.y) });

                if (st.y <= 0 && st.t > 0.08) {
                    st.y = 0;
                    st.active = false;
                    setIsFiring(false);

                    const err = Math.abs(st.x - targetX);
                    if (err <= 10) {
                        const bonus = Math.max(50, Math.round(250 - err * 12 - (shotsInRound - 1) * 25));
                        setScore((prev) => {
                            const nextTotal = prev + bonus;
                            if (round >= TOTAL_ROUNDS) {
                                setFinished(true);
                                setFeedback(`Direct hit (${st.x.toFixed(1)}m)! Campaign complete: ${nextTotal} pts.`);
                                ScoreHistory.save("projectile-cannon", nextTotal, "pts", GRAVITY_PRESETS[gravityIdx].id, {
                                    higherIsBetter: true,
                                    configuration: `5-round-${GRAVITY_PRESETS[gravityIdx].id}`,
                                });
                            } else {
                                const nextR = round + 1;
                                const nextCfg = makeRoundTarget(nextR);
                                setRound(nextR);
                                setTargetX(nextCfg.targetX);
                                setWind(nextCfg.wind);
                                setShotsInRound(0);
                                st.ghostTrail = [];
                                setFeedback(`Bullseye! +${bonus} pts. Target moved to ${nextCfg.targetX}m.`);
                            }
                            return nextTotal;
                        });
                    } else {
                        const dir = st.x < targetX ? "Short" : "Overshot";
                        setFeedback(`${dir} by ${err.toFixed(1)}m (landed at ${st.x.toFixed(1)}m). Adjust angle or speed!`);
                    }
                }
            }

            // Sky
            const sky = ctx.createLinearGradient(0, 0, 0, height);
            sky.addColorStop(0, "#F8FAFC");
            sky.addColorStop(1, "#E0F2FE");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, width, height);

            // Grid
            ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
            ctx.fillStyle = "#64748B";
            ctx.font = "10px monospace";
            for (let mx = 0; mx <= worldMaxX; mx += 50) {
                const px = toPxX(mx);
                ctx.beginPath();
                ctx.moveTo(px, padT);
                ctx.lineTo(px, height - padB);
                ctx.stroke();
                ctx.textAlign = "center";
                ctx.fillText(`${mx}m`, px, height - padB + 16);
            }
            for (let my = 0; my <= worldMaxY; my += 35) {
                const py = toPxY(my);
                ctx.beginPath();
                ctx.moveTo(padL, py);
                ctx.lineTo(width - padR, py);
                ctx.stroke();
                ctx.textAlign = "right";
                ctx.fillText(`${my}m`, padL - 6, py + 3);
            }

            // Ground
            ctx.fillStyle = "#16A34A";
            ctx.fillRect(0, height - padB, width, padB);

            // Target Bullseye Pad
            const txPx = toPxX(targetX);
            const tyPx = toPxY(0);
            ctx.fillStyle = "#EF4444";
            ctx.fillRect(txPx - 16, tyPx - 5, 32, 8);
            ctx.fillStyle = "#FFFFFF";
            ctx.fillRect(txPx - 6, tyPx - 5, 12, 8);
            ctx.fillStyle = "#0F172A";
            ctx.font = "bold 11px monospace";
            ctx.textAlign = "center";
            ctx.fillText(`${targetX}m`, txPx, tyPx - 12);

            // Ghost Trail (previous shot)
            if (st.ghostTrail.length > 1) {
                ctx.strokeStyle = "rgba(148, 163, 184, 0.55)";
                ctx.setLineDash([4, 4]);
                ctx.lineWidth = 2;
                ctx.beginPath();
                st.ghostTrail.forEach((p, idx) => {
                    if (idx === 0) ctx.moveTo(toPxX(p.x), toPxY(p.y));
                    else ctx.lineTo(toPxX(p.x), toPxY(p.y));
                });
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineWidth = 1;
            }

            // Active Trail
            if (st.trail.length > 1) {
                ctx.strokeStyle = "#2563EB";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                st.trail.forEach((p, idx) => {
                    if (idx === 0) ctx.moveTo(toPxX(p.x), toPxY(p.y));
                    else ctx.lineTo(toPxX(p.x), toPxY(p.y));
                });
                ctx.stroke();
                ctx.lineWidth = 1;
            }

            // Apex marker
            if (st.apex && st.apex.y > 4) {
                const ax = toPxX(st.apex.x);
                const ay = toPxY(st.apex.y);
                ctx.fillStyle = "#4F46E5";
                ctx.beginPath();
                ctx.arc(ax, ay, 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = "bold 10px monospace";
                ctx.textAlign = "center";
                ctx.fillText(`Apex ${st.apex.y.toFixed(1)}m`, ax, ay - 8);
            }

            // Cannon barrel + velocity preview vector
            const cx = toPxX(0);
            const cy = toPxY(0);
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(-rad);
            ctx.fillStyle = "#1E293B";
            ctx.fillRect(0, -6, 30, 12);
            // Velocity vector preview
            const vecLen = 30 + velocity * 0.9;
            ctx.strokeStyle = "#F59E0B";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(30, 0);
            ctx.lineTo(vecLen, 0);
            ctx.stroke();
            ctx.restore();

            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.arc(cx, cy, 10, 0, Math.PI * 2);
            ctx.fill();

            // Active Projectile Ball
            if (st.active || st.trail.length > 0) {
                const last = st.trail[st.trail.length - 1];
                ctx.fillStyle = "#0F172A";
                ctx.beginPath();
                ctx.arc(toPxX(last.x), toPxY(last.y), 5.5, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.lineWidth = 1;
            }

            rafRef.current = requestAnimationFrame(loop);
        };

        rafRef.current = requestAnimationFrame(loop);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [gravity, wind, targetX, rad, velocity, round, shotsInRound, gravityIdx]);

    return (
        <div className="w-full max-w-6xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/stem")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.stem.title", "STEM & Physics Lab")}</span>
                </Link>

                <div className="flex items-center gap-3 text-xs font-mono font-semibold tabular-nums">
                    <span className="px-3 py-1.5 rounded-lg bg-white border border-[#E6E3DB] text-[#3F3E39]">
                        Round {round}/{TOTAL_ROUNDS}
                    </span>
                    <span className="px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-800 inline-flex items-center gap-1.5">
                        <Trophy className="w-3.5 h-3.5" />
                        {score} pts
                    </span>
                </div>
            </div>

            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.projectile-cannon.title", "Projectile Cannon Physics")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        Adjust launch angle, muzzle velocity, and wind compensation to hit 5 sequential range targets.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] font-mono text-xs tabular-nums">
                    <Wind className="w-4 h-4 text-sky-600" />
                    <span>
                        Wind: <strong>{wind === 0 ? "Calm (0 m/s)" : wind > 0 ? `+${wind} m/s →` : `${wind} m/s ←`}</strong>
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Trajectory Stage */}
                <div className="lg:col-span-8 bg-white border border-[#E6E3DB] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="w-full h-[380px] sm:h-[430px] rounded-xl overflow-hidden border border-[#E6E3DB]">
                        <canvas ref={canvasRef} className="w-full h-full block" />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] px-4 py-3 text-sm">
                        <span className="font-medium text-[#161614] flex items-center gap-2">
                            {finished ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <Crosshair className="w-4 h-4 text-indigo-600" />}
                            {feedback}
                        </span>
                        {finished && (
                            <button
                                type="button"
                                onClick={resetCampaign}
                                className="px-3.5 py-1.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold transition-colors"
                            >
                                Play Again
                            </button>
                        )}
                    </div>
                </div>

                {/* Controls & Live Kinematics Deck */}
                <div className="lg:col-span-4 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-5">
                        {/* Gravity Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">Gravity Preset</label>
                            <div className="grid grid-cols-3 gap-2">
                                {GRAVITY_PRESETS.map((p, idx) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setGravityIdx(idx)}
                                        className={`py-2 px-2 rounded-xl border text-center transition-colors ${
                                            gravityIdx === idx
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                                                : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        <div className="text-xs font-semibold">{p.label}</div>
                                        <div className="text-[11px] font-mono text-[#78756C]">{p.g}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Launch Angle */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                <span>Launch Angle (θ)</span>
                                <span className="font-mono tabular-nums text-indigo-700">{angleDeg}°</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={80}
                                step={1}
                                value={angleDeg}
                                onChange={(e) => setAngleDeg(Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                        </div>

                        {/* Muzzle Velocity */}
                        <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                <span>Muzzle Velocity (v₀)</span>
                                <span className="font-mono tabular-nums text-indigo-700">{velocity} m/s</span>
                            </div>
                            <input
                                type="range"
                                min={15}
                                max={60}
                                step={1}
                                value={velocity}
                                onChange={(e) => setVelocity(Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                        </div>

                        {/* Live Equations */}
                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3.5 space-y-2 font-mono text-xs tabular-nums">
                            <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#78756C]">
                                Live Vector Components
                            </div>
                            <div className="flex justify-between text-[#3F3E39]">
                                <span>vₓ = v₀ cos(θ)</span>
                                <strong>{vx0.toFixed(1)} m/s</strong>
                            </div>
                            <div className="flex justify-between text-[#3F3E39]">
                                <span>vᵧ = v₀ sin(θ)</span>
                                <strong>{vy0.toFixed(1)} m/s</strong>
                            </div>
                            <div className="pt-2 border-t border-[#E6E3DB] flex justify-between text-indigo-700">
                                <span>Ideal Range (no wind)</span>
                                <strong>{vacuumRange.toFixed(1)} m</strong>
                            </div>
                            <div className="flex justify-between text-[#57554E]">
                                <span>Max Height / Flight</span>
                                <span>
                                    {vacuumHeight.toFixed(1)}m · {vacuumFlight.toFixed(1)}s
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={fireCannon}
                            disabled={isFiring || finished}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] disabled:opacity-60 text-[#FAF9F6] text-sm font-semibold transition-colors"
                        >
                            <Crosshair className="w-4 h-4" />
                            <span>{isFiring ? "In Flight..." : "Fire Cannon"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={resetCampaign}
                            className="px-3.5 py-3 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] transition-colors"
                            aria-label="Reset cannon campaign"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
