"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Play, RotateCcw, Orbit, ArrowDown, Wind, CheckCircle2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type PlanetKey = "earth" | "moon" | "mars" | "jupiter";
type Mode = "freefall" | "orbit";

interface PlanetData {
    key: PlanetKey;
    name: string;
    g: number; // m/s^2
    atmDensity: number; // relative air drag
    color: string;
    surfaceColor: string;
    skyTop: string;
    skyBottom: string;
    gmSim: number; // scaled GM for 2D orbit sim
    radiusPx: number;
}

const PLANETS: Record<PlanetKey, PlanetData> = {
    earth: {
        key: "earth",
        name: "Earth",
        g: 9.81,
        atmDensity: 1.0,
        color: "#2563EB",
        surfaceColor: "#15803D",
        skyTop: "#EFF6FF",
        skyBottom: "#DBEAFE",
        gmSim: 260000,
        radiusPx: 54,
    },
    moon: {
        key: "moon",
        name: "Moon",
        g: 1.62,
        atmDensity: 0.0,
        color: "#64748B",
        surfaceColor: "#94A3B8",
        skyTop: "#F8FAFC",
        skyBottom: "#E2E8F0",
        gmSim: 130000,
        radiusPx: 44,
    },
    mars: {
        key: "mars",
        name: "Mars",
        g: 3.72,
        atmDensity: 0.12,
        color: "#EA580C",
        surfaceColor: "#C2410C",
        skyTop: "#FFF7ED",
        skyBottom: "#FFEDD5",
        gmSim: 180000,
        radiusPx: 48,
    },
    jupiter: {
        key: "jupiter",
        name: "Jupiter",
        g: 24.79,
        atmDensity: 2.2,
        color: "#D97706",
        surfaceColor: "#B45309",
        skyTop: "#FEFCE8",
        skyBottom: "#FEF08A",
        gmSim: 420000,
        radiusPx: 66,
    },
};

interface DropObject {
    id: string;
    label: string;
    massKg: number;
    dragCoeff: number; // effective k/m
    radius: number;
    fill: string;
}

const OBJECTS: DropObject[] = [
    { id: "steel", label: "Steel Sphere (10 kg)", massKg: 10, dragCoeff: 0.0025, radius: 13, fill: "#334155" },
    { id: "basketball", label: "Basketball (0.6 kg)", massKg: 0.6, dragCoeff: 0.032, radius: 16, fill: "#EA580C" },
    { id: "feather", label: "Feather (0.01 kg)", massKg: 0.01, dragCoeff: 0.24, radius: 11, fill: "#4F46E5" },
];

export default function GravityLabGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [mode, setMode] = useState<Mode>("freefall");
    const [planetKey, setPlanetKey] = useState<PlanetKey>("earth");
    const [airDrag, setAirDrag] = useState<boolean>(true);
    const [dropHeight, setDropHeight] = useState<number>(60); // meters
    const [leftObjIdx, setLeftObjIdx] = useState<number>(0);
    const [rightObjIdx, setRightObjIdx] = useState<number>(2);

    // Free-fall live telemetry
    const [isDropping, setIsDropping] = useState<boolean>(false);
    const [fallTime, setFallTime] = useState<number>(0);
    const [leftTelemetry, setLeftTelemetry] = useState({ y: 0, v: 0, landedAt: null as number | null });
    const [rightTelemetry, setRightTelemetry] = useState({ y: 0, v: 0, landedAt: null as number | null });

    // Orbit Challenge controls
    const [launchSpeed, setLaunchSpeed] = useState<number>(48);
    const [launchAltitude, setLaunchAltitude] = useState<number>(85);
    const [orbitStatus, setOrbitStatus] = useState<"idle" | "flying" | "success" | "crashed" | "escaped">("idle");
    const [orbitSweepDeg, setOrbitSweepDeg] = useState<number>(0);
    const [orbitsCompleted, setOrbitsCompleted] = useState<number>(0);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const planet = PLANETS[planetKey];
    const leftObj = OBJECTS[leftObjIdx];
    const rightObj = OBJECTS[rightObjIdx];

    // Physics mutable state refs for animation loop
    const fallStateRef = useRef({
        running: false,
        t: 0,
        leftY: 0,
        leftV: 0,
        leftLanded: null as number | null,
        rightY: 0,
        rightV: 0,
        rightLanded: null as number | null,
        lastTs: 0,
    });

    const orbitStateRef = useRef({
        running: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        prevAngle: 0,
        accumAngle: 0,
        trail: [] as { x: number; y: number }[],
        lastTs: 0,
    });

    const resetFreefall = useCallback(() => {
        fallStateRef.current = {
            running: false,
            t: 0,
            leftY: 0,
            leftV: 0,
            leftLanded: null,
            rightY: 0,
            rightV: 0,
            rightLanded: null,
            lastTs: 0,
        };
        setIsDropping(false);
        setFallTime(0);
        setLeftTelemetry({ y: 0, v: 0, landedAt: null });
        setRightTelemetry({ y: 0, v: 0, landedAt: null });
    }, []);

    const resetOrbit = useCallback(() => {
        orbitStateRef.current = {
            running: false,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            prevAngle: 0,
            accumAngle: 0,
            trail: [],
            lastTs: 0,
        };
        setOrbitStatus("idle");
        setOrbitSweepDeg(0);
    }, []);

    const startDrop = () => {
        resetFreefall();
        fallStateRef.current.running = true;
        fallStateRef.current.lastTs = performance.now();
        setIsDropping(true);
    };

    const launchSatellite = () => {
        const rStart = planet.radiusPx + launchAltitude;
        const speedPx = launchSpeed * 4.4;
        orbitStateRef.current = {
            running: true,
            x: 0,
            y: -rStart,
            vx: speedPx,
            vy: 0,
            prevAngle: -Math.PI / 2,
            accumAngle: 0,
            trail: [{ x: 0, y: -rStart }],
            lastTs: performance.now(),
        };
        setOrbitStatus("flying");
        setOrbitSweepDeg(0);
    };

    // Ideal circular orbital speed for current planet & altitude (in slider units)
    const idealOrbitSpeed = Math.sqrt(planet.gmSim / (planet.radiusPx + launchAltitude)) / 4.4;
    const vacuumFallTime = Math.sqrt((2 * dropHeight) / planet.g);
    const vacuumImpactV = planet.g * vacuumFallTime;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = (now: number) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const rect = canvas.getBoundingClientRect();
            const width = Math.max(320, Math.floor(rect.width));
            const height = Math.max(320, Math.floor(rect.height));

            if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
                canvas.width = width * dpr;
                canvas.height = height * dpr;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            if (mode === "freefall") {
                const st = fallStateRef.current;
                if (st.running) {
                    const dt = Math.min(0.05, Math.max(0.001, (now - st.lastTs) / 1000));
                    st.lastTs = now;
                    st.t += dt;

                    const effectiveAtm = airDrag ? planet.atmDensity : 0;

                    if (st.leftLanded === null) {
                        const dragA = effectiveAtm * leftObj.dragCoeff * st.leftV * st.leftV;
                        const acc = Math.max(0, planet.g - dragA);
                        st.leftV += acc * dt;
                        st.leftY += st.leftV * dt;
                        if (st.leftY >= dropHeight) {
                            st.leftY = dropHeight;
                            st.leftLanded = st.t;
                        }
                    }

                    if (st.rightLanded === null) {
                        const dragA = effectiveAtm * rightObj.dragCoeff * st.rightV * st.rightV;
                        const acc = Math.max(0, planet.g - dragA);
                        st.rightV += acc * dt;
                        st.rightY += st.rightV * dt;
                        if (st.rightY >= dropHeight) {
                            st.rightY = dropHeight;
                            st.rightLanded = st.t;
                        }
                    }

                    setFallTime(st.t);
                    setLeftTelemetry({ y: st.leftY, v: st.leftV, landedAt: st.leftLanded });
                    setRightTelemetry({ y: st.rightY, v: st.rightV, landedAt: st.rightLanded });

                    if (st.leftLanded !== null && st.rightLanded !== null) {
                        st.running = false;
                        setIsDropping(false);
                    }
                }

                // Draw sky gradient
                const grad = ctx.createLinearGradient(0, 0, 0, height);
                grad.addColorStop(0, planet.skyTop);
                grad.addColorStop(1, planet.skyBottom);
                ctx.fillStyle = grad;
                ctx.fillRect(0, 0, width, height);

                const topPad = 46;
                const groundY = height - 48;
                const dropSpanPx = groundY - topPad;

                // Height ruler grid
                ctx.strokeStyle = "rgba(15, 23, 42, 0.08)";
                ctx.fillStyle = "#64748B";
                ctx.font = "11px monospace";
                ctx.textAlign = "left";
                const ticks = 5;
                for (let i = 0; i <= ticks; i++) {
                    const frac = i / ticks;
                    const yPx = topPad + frac * dropSpanPx;
                    ctx.beginPath();
                    ctx.moveTo(48, yPx);
                    ctx.lineTo(width - 20, yPx);
                    ctx.stroke();
                    const metersRem = Math.round(dropHeight * (1 - frac));
                    ctx.fillText(`${metersRem}m`, 10, yPx + 4);
                }

                // Ground strip
                ctx.fillStyle = planet.surfaceColor;
                ctx.fillRect(0, groundY, width, height - groundY);
                ctx.fillStyle = "rgba(255,255,255,0.85)";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(`${planet.name.toUpperCase()} SURFACE (g = ${planet.g} m/s²)`, width / 2, groundY + 28);

                // Helper to draw object
                const drawFallingItem = (obj: DropObject, yMeters: number, v: number, xPos: number, landed: number | null) => {
                    const yPx = topPad + (Math.min(yMeters, dropHeight) / dropHeight) * (dropSpanPx - obj.radius);

                    // Release line
                    ctx.strokeStyle = "rgba(37, 99, 235, 0.25)";
                    ctx.setLineDash([4, 4]);
                    ctx.beginPath();
                    ctx.moveTo(xPos, topPad);
                    ctx.lineTo(xPos, yPx);
                    ctx.stroke();
                    ctx.setLineDash([]);

                    // Velocity vector arrow
                    if (v > 0.5 && landed === null) {
                        const arrowLen = Math.min(60, v * 1.4);
                        ctx.strokeStyle = "#2563EB";
                        ctx.lineWidth = 2;
                        ctx.beginPath();
                        ctx.moveTo(xPos, yPx + obj.radius + 2);
                        ctx.lineTo(xPos, yPx + obj.radius + arrowLen);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(xPos - 4, yPx + obj.radius + arrowLen - 6);
                        ctx.lineTo(xPos, yPx + obj.radius + arrowLen);
                        ctx.lineTo(xPos + 4, yPx + obj.radius + arrowLen - 6);
                        ctx.stroke();
                        ctx.lineWidth = 1;
                    }

                    // Body
                    ctx.fillStyle = obj.fill;
                    ctx.beginPath();
                    if (obj.id === "feather") {
                        ctx.ellipse(xPos, yPx, obj.radius * 1.35, obj.radius * 0.55, -0.3, 0, Math.PI * 2);
                    } else {
                        ctx.arc(xPos, yPx, obj.radius, 0, Math.PI * 2);
                    }
                    ctx.fill();
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.lineWidth = 1;

                    // Label above start
                    ctx.fillStyle = "#0F172A";
                    ctx.font = "600 12px sans-serif";
                    ctx.textAlign = "center";
                    ctx.fillText(obj.label, xPos, 24);

                    if (landed !== null) {
                        ctx.fillStyle = "#0F172A";
                        ctx.font = "bold 12px monospace";
                        ctx.fillText(`t = ${landed.toFixed(2)}s`, xPos, yPx - obj.radius - 10);
                    }
                };

                drawFallingItem(leftObj, st.leftY, st.leftV, width * 0.36, st.leftLanded);
                drawFallingItem(rightObj, st.rightY, st.rightV, width * 0.70, st.rightLanded);
            } else {
                // ORBIT MODE
                const st = orbitStateRef.current;
                const cx = width / 2;
                const cy = height / 2;

                if (st.running) {
                    const dt = Math.min(0.032, Math.max(0.002, (now - st.lastTs) / 1000));
                    st.lastTs = now;
                    // Sub-step integration (RK2 / midpoint) for crisp orbital stability
                    const substeps = 6;
                    const h = dt / substeps;
                    for (let i = 0; i < substeps; i++) {
                        const rSq = st.x * st.x + st.y * st.y;
                        const r = Math.sqrt(rSq);
                        if (r <= planet.radiusPx + 5) {
                            st.running = false;
                            setOrbitStatus("crashed");
                            break;
                        }
                        if (r > Math.max(width, height) * 0.75) {
                            st.running = false;
                            setOrbitStatus("escaped");
                            break;
                        }
                        const aMag = planet.gmSim / rSq;
                        const ax = (-aMag * st.x) / r;
                        const ay = (-aMag * st.y) / r;
                        st.vx += ax * h;
                        st.vy += ay * h;
                        st.x += st.vx * h;
                        st.y += st.vy * h;

                        const angle = Math.atan2(st.y, st.x);
                        let delta = angle - st.prevAngle;
                        if (delta > Math.PI) delta -= Math.PI * 2;
                        if (delta < -Math.PI) delta += Math.PI * 2;
                        st.accumAngle += Math.abs(delta);
                        st.prevAngle = angle;
                    }

                    st.trail.push({ x: st.x, y: st.y });
                    if (st.trail.length > 420) st.trail.shift();

                    const deg = Math.min(360, Math.round((st.accumAngle * 180) / Math.PI));
                    setOrbitSweepDeg(deg);

                    if (st.running && st.accumAngle >= Math.PI * 2) {
                        st.running = false;
                        setOrbitStatus("success");
                        setOrbitsCompleted((prev) => {
                            const next = prev + 1;
                            ScoreHistory.save("gravity-lab", next, "orbits", planetKey, {
                                higherIsBetter: true,
                                configuration: `${planetKey}-${launchAltitude}km`,
                            });
                            return next;
                        });
                    }
                }

                // Space background (deep slate-navy for high contrast on orbital lines)
                ctx.fillStyle = "#0F172A";
                ctx.fillRect(0, 0, width, height);

                // Polar grid rings
                ctx.strokeStyle = "rgba(148, 163, 184, 0.14)";
                for (let r = planet.radiusPx + 40; r < Math.max(width, height) * 0.65; r += 40) {
                    ctx.beginPath();
                    ctx.arc(cx, cy, r, 0, Math.PI * 2);
                    ctx.stroke();
                }

                // Target circular reference dashed ring
                const targetR = planet.radiusPx + launchAltitude;
                ctx.strokeStyle = "rgba(56, 189, 248, 0.35)";
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.arc(cx, cy, targetR, 0, Math.PI * 2);
                ctx.stroke();
                ctx.setLineDash([]);

                // Planet sphere
                const pGrad = ctx.createRadialGradient(
                    cx - planet.radiusPx * 0.3,
                    cy - planet.radiusPx * 0.3,
                    planet.radiusPx * 0.15,
                    cx,
                    cy,
                    planet.radiusPx
                );
                pGrad.addColorStop(0, "#FFFFFF");
                pGrad.addColorStop(0.25, planet.color);
                pGrad.addColorStop(1, "#0F172A");
                ctx.fillStyle = pGrad;
                ctx.beginPath();
                ctx.arc(cx, cy, planet.radiusPx, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = "#FFFFFF";
                ctx.font = "bold 12px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText(planet.name, cx, cy + 4);

                // Orbit trail
                if (st.trail.length > 1) {
                    ctx.strokeStyle = orbitStatus === "success" ? "#10B981" : "#38BDF8";
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    st.trail.forEach((pt, idx) => {
                        if (idx === 0) ctx.moveTo(cx + pt.x, cy + pt.y);
                        else ctx.lineTo(cx + pt.x, cy + pt.y);
                    });
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }

                // Satellite position
                const satX = st.trail.length > 0 ? cx + st.x : cx;
                const satY = st.trail.length > 0 ? cy + st.y : cy - targetR;

                // Preview velocity arrow before launch
                if (!st.running && orbitStatus === "idle") {
                    const arrowLen = Math.min(110, launchSpeed * 1.3);
                    ctx.strokeStyle = "#F59E0B";
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(satX, satY);
                    ctx.lineTo(satX + arrowLen, satY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(satX + arrowLen - 7, satY - 4);
                    ctx.lineTo(satX + arrowLen, satY);
                    ctx.lineTo(satX + arrowLen - 7, satY + 4);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }

                // Satellite icon dot
                ctx.fillStyle = "#F8FAFC";
                ctx.beginPath();
                ctx.arc(satX, satY, 6, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#38BDF8";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.lineWidth = 1;
            }

            rafRef.current = requestAnimationFrame(render);
        };

        rafRef.current = requestAnimationFrame(render);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [mode, planet, airDrag, dropHeight, leftObj, rightObj, launchAltitude, launchSpeed, orbitStatus]);

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
                            setMode("freefall");
                            resetOrbit();
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                            mode === "freefall" ? "bg-[#161614] text-[#FAF9F6]" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        <ArrowDown className="w-4 h-4" />
                        <span>Free-Fall Lab</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setMode("orbit");
                            resetFreefall();
                        }}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                            mode === "orbit" ? "bg-[#161614] text-[#FAF9F6]" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        <Orbit className="w-4 h-4" />
                        <span>Orbit Challenge</span>
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.gravity-lab.title", "Gravity & Orbit Lab")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        {mode === "freefall"
                            ? "Compare side-by-side free-fall acceleration with or without air resistance across four worlds."
                            : "Adjust launch speed and altitude to achieve a complete 360° stable satellite orbit."}
                    </p>
                </div>
                <div className="flex items-center gap-4 text-right font-mono tabular-nums">
                    <div>
                        <div className="text-[11px] uppercase tracking-wider text-[#78756C]">Gravity (g)</div>
                        <div className="text-lg font-bold text-indigo-700">{planet.g.toFixed(2)} m/s²</div>
                    </div>
                    {mode === "orbit" && (
                        <div className="pl-4 border-l border-[#E6E3DB]">
                            <div className="text-[11px] uppercase tracking-wider text-[#78756C]">Stable Orbits</div>
                            <div className="text-lg font-bold text-emerald-700">{orbitsCompleted}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Two-Zone Sandbox */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Visual Stage (65%) */}
                <div className="lg:col-span-8 bg-white border border-[#E6E3DB] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="relative w-full h-[410px] sm:h-[460px] rounded-xl overflow-hidden border border-[#E6E3DB]">
                        <canvas ref={canvasRef} className="w-full h-full block" />
                    </div>

                    {/* Live Readout Strip */}
                    {mode === "freefall" ? (
                        <div className="grid grid-cols-3 gap-3 text-center">
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3">
                                <div className="text-[11px] font-medium uppercase text-[#78756C]">Elapsed Time</div>
                                <div className="text-lg font-bold font-mono tabular-nums text-[#161614]">
                                    {fallTime.toFixed(2)} s
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3">
                                <div className="text-[11px] font-medium uppercase text-[#78756C]">Left Velocity</div>
                                <div className="text-lg font-bold font-mono tabular-nums text-[#161614]">
                                    {leftTelemetry.v.toFixed(1)} m/s
                                </div>
                            </div>
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3">
                                <div className="text-[11px] font-medium uppercase text-[#78756C]">Right Velocity</div>
                                <div className="text-lg font-bold font-mono tabular-nums text-[#161614]">
                                    {rightTelemetry.v.toFixed(1)} m/s
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] px-4 py-3">
                            <div className="flex items-center gap-2 text-sm font-semibold">
                                {orbitStatus === "success" && (
                                    <span className="inline-flex items-center gap-1.5 text-emerald-700">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Stable 360° orbit achieved!
                                    </span>
                                )}
                                {orbitStatus === "crashed" && (
                                    <span className="inline-flex items-center gap-1.5 text-rose-700">
                                        <AlertTriangle className="w-4 h-4" />
                                        Sub-orbital crash — increase tangential speed.
                                    </span>
                                )}
                                {orbitStatus === "escaped" && (
                                    <span className="inline-flex items-center gap-1.5 text-amber-700">
                                        <AlertTriangle className="w-4 h-4" />
                                        Escape velocity exceeded — reduce speed.
                                    </span>
                                )}
                                {(orbitStatus === "idle" || orbitStatus === "flying") && (
                                    <span className="text-[#3F3E39]">
                                        Orbit Sweep: <strong className="font-mono tabular-nums">{orbitSweepDeg}° / 360°</strong>
                                    </span>
                                )}
                            </div>
                            <div className="text-xs font-mono text-[#78756C] tabular-nums">
                                Ideal circular v ≈ {idealOrbitSpeed.toFixed(1)} units
                            </div>
                        </div>
                    )}
                </div>

                {/* Control & Live Formula Deck (35%) */}
                <div className="lg:col-span-4 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-5">
                        {/* Planet Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Planetary Gravity
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                {(Object.keys(PLANETS) as PlanetKey[]).map((key) => {
                                    const p = PLANETS[key];
                                    const active = planetKey === key;
                                    return (
                                        <button
                                            key={key}
                                            type="button"
                                            onClick={() => {
                                                setPlanetKey(key);
                                                resetFreefall();
                                                resetOrbit();
                                            }}
                                            className={`px-3 py-2 rounded-xl border text-left transition-colors ${
                                                active
                                                    ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                                                    : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:bg-[#FAF9F6]"
                                            }`}
                                        >
                                            <div className="text-sm font-semibold">{p.name}</div>
                                            <div className="text-xs font-mono text-[#78756C] tabular-nums">{p.g} m/s²</div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {mode === "freefall" ? (
                            <>
                                {/* Drop Height Slider */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                        <span>Drop Height (h)</span>
                                        <span className="font-mono tabular-nums text-indigo-700">{dropHeight} m</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={10}
                                        max={120}
                                        step={5}
                                        value={dropHeight}
                                        onChange={(e) => {
                                            setDropHeight(Number(e.target.value));
                                            resetFreefall();
                                        }}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                {/* Air Resistance Toggle */}
                                <div className="flex items-center justify-between p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB]">
                                    <div className="flex items-center gap-2">
                                        <Wind className="w-4 h-4 text-indigo-600" />
                                        <div>
                                            <div className="text-sm font-semibold text-[#161614]">Air Resistance</div>
                                            <div className="text-xs text-[#78756C]">
                                                {airDrag && planet.atmDensity > 0 ? "Atmosphere Active" : "Pure Vacuum"}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAirDrag((v) => !v);
                                            resetFreefall();
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                            airDrag
                                                ? "bg-[#161614] text-[#FAF9F6] border-[#161614]"
                                                : "bg-white text-[#3F3E39] border-[#D8D4C9]"
                                        }`}
                                    >
                                        {airDrag ? "ON" : "VACUUM"}
                                    </button>
                                </div>

                                {/* Object Pair Selectors */}
                                <div className="grid grid-cols-2 gap-2.5">
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase text-[#78756C]">Left Object</label>
                                        <select
                                            value={leftObjIdx}
                                            onChange={(e) => {
                                                setLeftObjIdx(Number(e.target.value));
                                                resetFreefall();
                                            }}
                                            className="mt-1 w-full rounded-lg border border-[#E6E3DB] bg-white px-2.5 py-2 text-xs font-medium text-[#161614]"
                                        >
                                            {OBJECTS.map((o, idx) => (
                                                <option key={o.id} value={idx}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[11px] font-semibold uppercase text-[#78756C]">Right Object</label>
                                        <select
                                            value={rightObjIdx}
                                            onChange={(e) => {
                                                setRightObjIdx(Number(e.target.value));
                                                resetFreefall();
                                            }}
                                            className="mt-1 w-full rounded-lg border border-[#E6E3DB] bg-white px-2.5 py-2 text-xs font-medium text-[#161614]"
                                        >
                                            {OBJECTS.map((o, idx) => (
                                                <option key={o.id} value={idx}>
                                                    {o.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Live Formula Card */}
                                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3.5 space-y-1.5 font-mono text-xs">
                                    <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#78756C]">
                                        Vacuum Kinematics Prediction
                                    </div>
                                    <div className="text-[#161614]">d = ½ · g · t² → t = √(2h / g)</div>
                                    <div className="text-indigo-700 font-bold tabular-nums">
                                        t_vac = {vacuumFallTime.toFixed(2)} s · v_impact = {vacuumImpactV.toFixed(1)} m/s
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Launch Speed */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                        <span>Tangential Launch Speed (v₀)</span>
                                        <span className="font-mono tabular-nums text-indigo-700">{launchSpeed} u/s</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={18}
                                        max={85}
                                        step={1}
                                        value={launchSpeed}
                                        onChange={(e) => {
                                            setLaunchSpeed(Number(e.target.value));
                                            if (orbitStatus !== "flying") resetOrbit();
                                        }}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                {/* Launch Altitude */}
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                        <span>Orbital Altitude (h)</span>
                                        <span className="font-mono tabular-nums text-indigo-700">{launchAltitude} km</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={45}
                                        max={125}
                                        step={5}
                                        value={launchAltitude}
                                        onChange={(e) => {
                                            setLaunchAltitude(Number(e.target.value));
                                            resetOrbit();
                                        }}
                                        className="w-full accent-indigo-600"
                                    />
                                </div>

                                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-3.5 space-y-1.5 font-mono text-xs">
                                    <div className="text-[11px] font-sans font-semibold uppercase tracking-wider text-[#78756C]">
                                        Circular Orbit Formula
                                    </div>
                                    <div className="text-[#161614]">v_orb = √(G · M / r)</div>
                                    <div className="text-[#57554E] font-sans text-xs">
                                        Match centrifugal balance at radius r = R + h to complete a full 360° orbit.
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2.5 pt-2">
                        {mode === "freefall" ? (
                            <>
                                <button
                                    type="button"
                                    onClick={startDrop}
                                    disabled={isDropping}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] disabled:opacity-60 text-[#FAF9F6] text-sm font-semibold transition-colors"
                                >
                                    <Play className="w-4 h-4" />
                                    <span>{isDropping ? "Dropping..." : "Drop Objects"}</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={resetFreefall}
                                    className="px-3.5 py-3 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] transition-colors"
                                    aria-label="Reset drop"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={launchSatellite}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                                >
                                    <Orbit className="w-4 h-4" />
                                    <span>Launch Satellite</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={resetOrbit}
                                    className="px-3.5 py-3 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] transition-colors"
                                    aria-label="Reset orbit"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
