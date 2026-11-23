"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Sparkles, CheckCircle2, ChevronRight, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

interface Vec2 {
    x: number;
    y: number;
}

interface MirrorDef {
    id: string;
    x: number;
    y: number;
    length: number;
    angleDeg: number; // angle of mirror surface
}

interface WallDef {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
}

interface OpticsLevel {
    id: number;
    name: string;
    hint: string;
    emitter: { x: number; y: number; angleDeg: number };
    sensor: { x: number; y: number; radius: number };
    mirrors: MirrorDef[];
    walls: WallDef[];
}

const BOARD_W = 720;
const BOARD_H = 440;

const LEVELS: OpticsLevel[] = [
    {
        id: 1,
        name: "Level 1: Single Bounce",
        hint: "Rotate Mirror A to 45° so the horizontal laser reflects straight down into the optical sensor.",
        emitter: { x: 70, y: 120, angleDeg: 0 },
        sensor: { x: 420, y: 360, radius: 22 },
        mirrors: [{ id: "M1", x: 420, y: 120, length: 96, angleDeg: 18 }],
        walls: [],
    },
    {
        id: 2,
        name: "Level 2: Periscope Double Reflection",
        hint: "Use two parallel mirrors to route the laser cleanly around the center barrier wall.",
        emitter: { x: 70, y: 100, angleDeg: 0 },
        sensor: { x: 630, y: 340, radius: 22 },
        mirrors: [
            { id: "M1", x: 300, y: 100, length: 92, angleDeg: 25 },
            { id: "M2", x: 300, y: 340, length: 92, angleDeg: 65 },
        ],
        walls: [{ x1: 420, y1: 40, x2: 420, y2: 260 }],
    },
    {
        id: 3,
        name: "Level 3: Acute Prism Corridor",
        hint: "Deflect upward through the gap, then ricochet downward past the right shield.",
        emitter: { x: 70, y: 340, angleDeg: 0 },
        sensor: { x: 640, y: 340, radius: 22 },
        mirrors: [
            { id: "M1", x: 250, y: 340, length: 92, angleDeg: 115 },
            { id: "M2", x: 440, y: 110, length: 96, angleDeg: 15 },
        ],
        walls: [{ x1: 370, y1: 210, x2: 370, y2: 420 }],
    },
    {
        id: 4,
        name: "Level 4: Triple Mirror Zig-Zag",
        hint: "Chain all three mirrors across the chamber while avoiding two staggered blockers.",
        emitter: { x: 65, y: 90, angleDeg: 0 },
        sensor: { x: 645, y: 95, radius: 22 },
        mirrors: [
            { id: "M1", x: 210, y: 90, length: 88, angleDeg: 28 },
            { id: "M2", x: 210, y: 350, length: 88, angleDeg: 145 },
            { id: "M3", x: 520, y: 350, length: 88, angleDeg: 115 },
        ],
        walls: [
            { x1: 360, y1: 30, x2: 360, y2: 260 },
            { x1: 440, y1: 180, x2: 680, y2: 180 },
        ],
    },
    {
        id: 5,
        name: "Level 5: Diagonal Precision Vault",
        hint: "Use fine 1° adjustments to thread a diagonal beam through the narrow central aperture.",
        emitter: { x: 75, y: 220, angleDeg: -22 },
        sensor: { x: 645, y: 220, radius: 20 },
        mirrors: [
            { id: "M1", x: 260, y: 145, length: 90, angleDeg: 15 },
            { id: "M2", x: 460, y: 325, length: 90, angleDeg: 135 },
            { id: "M3", x: 560, y: 120, length: 86, angleDeg: 40 },
        ],
        walls: [
            { x1: 360, y1: 20, x2: 360, y2: 190 },
            { x1: 360, y1: 270, x2: 360, y2: 420 },
        ],
    },
];

function raySegmentIntersect(
    ox: number,
    oy: number,
    dx: number,
    dy: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
): { t: number; x: number; y: number } | null {
    const sx = x2 - x1;
    const sy = y2 - y1;
    const denom = dx * sy - dy * sx;
    if (Math.abs(denom) < 1e-7) return null;
    const qpx = x1 - ox;
    const qpy = y1 - oy;
    const t = (qpx * sy - qpy * sx) / denom;
    const u = (qpx * dy - qpy * dx) / denom;
    if (t > 1e-3 && u >= 0 && u <= 1) {
        return { t, x: ox + t * dx, y: oy + t * dy };
    }
    return null;
}

function rayCircleIntersect(
    ox: number,
    oy: number,
    dx: number,
    dy: number,
    cx: number,
    cy: number,
    r: number
): { t: number; x: number; y: number } | null {
    const fx = ox - cx;
    const fy = oy - cy;
    const b = 2 * (fx * dx + fy * dy);
    const c = fx * fx + fy * fy - r * r;
    const disc = b * b - 4 * c;
    if (disc < 0) return null;
    const sqrtD = Math.sqrt(disc);
    const t1 = (-b - sqrtD) / 2;
    const t2 = (-b + sqrtD) / 2;
    const t = t1 > 1e-3 ? t1 : t2 > 1e-3 ? t2 : -1;
    if (t <= 0) return null;
    return { t, x: ox + t * dx, y: oy + t * dy };
}

interface BounceTelemetry {
    mirrorId: string;
    hitX: number;
    hitY: number;
    nx: number;
    ny: number;
    incidenceDeg: number;
}

export default function LaserReflectionGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [levelIdx, setLevelIdx] = useState(0);
    const [angles, setAngles] = useState<Record<string, number>>(() => {
        const init: Record<string, number> = {};
        LEVELS[0].mirrors.forEach((m) => (init[m.id] = m.angleDeg));
        return init;
    });
    const [selectedMirrorId, setSelectedMirrorId] = useState<string>(LEVELS[0].mirrors[0].id);
    const [showNormals, setShowNormals] = useState<boolean>(true);
    const [clearedLevels, setClearedLevels] = useState<number[]>([]);

    const level = LEVELS[levelIdx];

    const loadLevel = (idx: number) => {
        const lvl = LEVELS[idx];
        const init: Record<string, number> = {};
        lvl.mirrors.forEach((m) => (init[m.id] = m.angleDeg));
        setLevelIdx(idx);
        setAngles(init);
        setSelectedMirrorId(lvl.mirrors[0].id);
    };

    const traceResult = useMemo(() => {
        const points: Vec2[] = [{ x: level.emitter.x, y: level.emitter.y }];
        const bounces: BounceTelemetry[] = [];
        let hitSensor = false;

        let ox = level.emitter.x;
        let oy = level.emitter.y;
        const rad = (level.emitter.angleDeg * Math.PI) / 180;
        let dx = Math.cos(rad);
        let dy = Math.sin(rad);

        const boundaryWalls: WallDef[] = [
            { x1: 0, y1: 0, x2: BOARD_W, y2: 0 },
            { x1: BOARD_W, y1: 0, x2: BOARD_W, y2: BOARD_H },
            { x1: BOARD_W, y1: BOARD_H, x2: 0, y2: BOARD_H },
            { x1: 0, y1: BOARD_H, x2: 0, y2: 0 },
            ...level.walls,
        ];

        for (let step = 0; step < 10; step++) {
            let bestT = Infinity;
            let bestType: "none" | "wall" | "mirror" | "sensor" = "none";
            let bestPt: Vec2 = { x: ox + dx * 1000, y: oy + dy * 1000 };
            let bestMirror: { id: string; nx: number; ny: number } | null = null;

            // Check sensor
            const sHit = rayCircleIntersect(ox, oy, dx, dy, level.sensor.x, level.sensor.y, level.sensor.radius);
            if (sHit && sHit.t < bestT) {
                bestT = sHit.t;
                bestType = "sensor";
                bestPt = { x: sHit.x, y: sHit.y };
            }

            // Check walls
            for (const w of boundaryWalls) {
                const wHit = raySegmentIntersect(ox, oy, dx, dy, w.x1, w.y1, w.x2, w.y2);
                if (wHit && wHit.t < bestT) {
                    bestT = wHit.t;
                    bestType = "wall";
                    bestPt = { x: wHit.x, y: wHit.y };
                }
            }

            // Check mirrors
            for (const m of level.mirrors) {
                const ang = ((angles[m.id] ?? m.angleDeg) * Math.PI) / 180;
                const half = m.length / 2;
                const x1 = m.x - Math.cos(ang) * half;
                const y1 = m.y - Math.sin(ang) * half;
                const x2 = m.x + Math.cos(ang) * half;
                const y2 = m.y + Math.sin(ang) * half;
                const mHit = raySegmentIntersect(ox, oy, dx, dy, x1, y1, x2, y2);
                if (mHit && mHit.t < bestT) {
                    bestT = mHit.t;
                    bestType = "mirror";
                    bestPt = { x: mHit.x, y: mHit.y };
                    // Surface normal perpendicular to mirror segment
                    let nx = -Math.sin(ang);
                    let ny = Math.cos(ang);
                    // Orient normal facing the incoming ray
                    if (dx * nx + dy * ny > 0) {
                        nx = -nx;
                        ny = -ny;
                    }
                    bestMirror = { id: m.id, nx, ny };
                }
            }

            points.push(bestPt);

            if (bestType === "sensor") {
                hitSensor = true;
                break;
            }
            if (bestType === "mirror" && bestMirror) {
                const dot = dx * bestMirror.nx + dy * bestMirror.ny;
                const cosTheta = Math.min(1, Math.max(-1, -dot));
                const incidenceDeg = (Math.acos(cosTheta) * 180) / Math.PI;
                bounces.push({
                    mirrorId: bestMirror.id,
                    hitX: bestPt.x,
                    hitY: bestPt.y,
                    nx: bestMirror.nx,
                    ny: bestMirror.ny,
                    incidenceDeg,
                });
                // Law of reflection: r = d - 2(d·n)n
                const rx = dx - 2 * dot * bestMirror.nx;
                const ry = dy - 2 * dot * bestMirror.ny;
                const rLen = Math.hypot(rx, ry) || 1;
                dx = rx / rLen;
                dy = ry / rLen;
                ox = bestPt.x + dx * 0.5;
                oy = bestPt.y + dy * 0.5;
            } else {
                break;
            }
        }

        return { points, bounces, hitSensor };
    }, [level, angles]);

    useEffect(() => {
        if (traceResult.hitSensor && !clearedLevels.includes(level.id)) {
            setClearedLevels((prev) => {
                const next = [...prev, level.id];
                ScoreHistory.save("laser-reflection", next.length, "levels", `stage-${level.id}`, {
                    higherIsBetter: true,
                    configuration: "optics-campaign",
                });
                return next;
            });
        }
    }, [traceResult.hitSensor, level.id, clearedLevels]);

    const currentAngle = angles[selectedMirrorId] ?? 0;

    const updateAngle = (mirrorId: string, nextVal: number) => {
        const wrapped = ((nextVal % 180) + 180) % 180;
        setAngles((prev) => ({ ...prev, [mirrorId]: wrapped }));
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

                <div className="flex items-center gap-1.5">
                    {LEVELS.map((lvl, idx) => {
                        const cleared = clearedLevels.includes(lvl.id);
                        const active = idx === levelIdx;
                        return (
                            <button
                                key={lvl.id}
                                type="button"
                                onClick={() => loadLevel(idx)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-colors ${
                                    active
                                        ? "bg-[#161614] text-[#FAF9F6] border-[#161614]"
                                        : cleared
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-white text-[#57554E] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                                }`}
                            >
                                L{lvl.id}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.laser-reflection.title", "Laser Reflection Optics")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        {level.name} — {level.hint}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setShowNormals((v) => !v)}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-xs font-semibold text-[#3F3E39] transition-colors"
                    >
                        {showNormals ? <Eye className="w-4 h-4 text-indigo-600" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                        <span>Normal Guides</span>
                    </button>
                    <div className="text-right font-mono tabular-nums pl-3 border-l border-[#E6E3DB]">
                        <div className="text-[11px] uppercase text-[#78756C]">Solved</div>
                        <div className="text-lg font-bold text-indigo-700">
                            {clearedLevels.length}/{LEVELS.length}
                        </div>
                    </div>
                </div>
            </div>

            {/* Two-Zone Optics Board */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
                {/* Interactive Optics SVG Stage */}
                <div className="lg:col-span-8 bg-white border border-[#E6E3DB] rounded-2xl p-4 flex flex-col gap-3">
                    <div className="w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                        <svg viewBox={`0 0 ${BOARD_W} ${BOARD_H}`} className="w-full h-auto block select-none">
                            {/* Grid lines */}
                            <defs>
                                <pattern id="opticsGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
                                </pattern>
                            </defs>
                            <rect width={BOARD_W} height={BOARD_H} fill="url(#opticsGrid)" />

                            {/* Blocker Walls */}
                            {level.walls.map((w, i) => (
                                <line
                                    key={i}
                                    x1={w.x1}
                                    y1={w.y1}
                                    x2={w.x2}
                                    y2={w.y2}
                                    stroke="#475569"
                                    strokeWidth="12"
                                    strokeLinecap="round"
                                />
                            ))}

                            {/* Laser Beam Glow + Core */}
                            <polyline
                                points={traceResult.points.map((p) => `${p.x},${p.y}`).join(" ")}
                                fill="none"
                                stroke={traceResult.hitSensor ? "rgba(16,185,129,0.35)" : "rgba(244,63,94,0.35)"}
                                strokeWidth="9"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />
                            <polyline
                                points={traceResult.points.map((p) => `${p.x},${p.y}`).join(" ")}
                                fill="none"
                                stroke={traceResult.hitSensor ? "#34D399" : "#FB7185"}
                                strokeWidth="3"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                            />

                            {/* Surface Normals & Angle Labels */}
                            {showNormals &&
                                traceResult.bounces.map((b, idx) => (
                                    <g key={idx}>
                                        <line
                                            x1={b.hitX}
                                            y1={b.hitY}
                                            x2={b.hitX + b.nx * 54}
                                            y2={b.hitY + b.ny * 54}
                                            stroke="#38BDF8"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                        />
                                        <text
                                            x={b.hitX + b.nx * 64}
                                            y={b.hitY + b.ny * 64}
                                            fill="#7DD3FC"
                                            fontSize="11"
                                            fontFamily="monospace"
                                            textAnchor="middle"
                                        >
                                            θi=θr={b.incidenceDeg.toFixed(1)}°
                                        </text>
                                    </g>
                                ))}

                            {/* Mirrors */}
                            {level.mirrors.map((m) => {
                                const ang = ((angles[m.id] ?? m.angleDeg) * Math.PI) / 180;
                                const half = m.length / 2;
                                const x1 = m.x - Math.cos(ang) * half;
                                const y1 = m.y - Math.sin(ang) * half;
                                const x2 = m.x + Math.cos(ang) * half;
                                const y2 = m.y + Math.sin(ang) * half;
                                const selected = selectedMirrorId === m.id;
                                return (
                                    <g
                                        key={m.id}
                                        onClick={() => setSelectedMirrorId(m.id)}
                                        className="cursor-pointer"
                                    >
                                        <circle
                                            cx={m.x}
                                            cy={m.y}
                                            r={selected ? 26 : 18}
                                            fill={selected ? "rgba(99,102,241,0.18)" : "transparent"}
                                            stroke={selected ? "#818CF8" : "transparent"}
                                            strokeWidth="1.5"
                                            strokeDasharray="3 3"
                                        />
                                        <line
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke={selected ? "#60A5FA" : "#CBD5E1"}
                                            strokeWidth="7"
                                            strokeLinecap="round"
                                        />
                                        <line
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke="#FFFFFF"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                        />
                                        <circle cx={m.x} cy={m.y} r="5" fill={selected ? "#4F46E5" : "#475569"} />
                                        <text
                                            x={m.x}
                                            y={m.y - 16}
                                            fill="#E2E8F0"
                                            fontSize="11"
                                            fontWeight="bold"
                                            textAnchor="middle"
                                        >
                                            {m.id}
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Laser Emitter */}
                            <g transform={`translate(${level.emitter.x}, ${level.emitter.y}) rotate(${level.emitter.angleDeg})`}>
                                <rect x="-24" y="-12" width="32" height="24" rx="5" fill="#1E293B" stroke="#94A3B8" strokeWidth="2" />
                                <circle cx="8" cy="0" r="4" fill="#F43F5E" />
                            </g>

                            {/* Optical Sensor Target */}
                            <g>
                                <circle
                                    cx={level.sensor.x}
                                    cy={level.sensor.y}
                                    r={level.sensor.radius + 6}
                                    fill={traceResult.hitSensor ? "rgba(16,185,129,0.28)" : "rgba(56,189,248,0.12)"}
                                />
                                <circle
                                    cx={level.sensor.x}
                                    cy={level.sensor.y}
                                    r={level.sensor.radius}
                                    fill={traceResult.hitSensor ? "#10B981" : "#0F172A"}
                                    stroke={traceResult.hitSensor ? "#A7F3D0" : "#38BDF8"}
                                    strokeWidth="3"
                                />
                                <text
                                    x={level.sensor.x}
                                    y={level.sensor.y + 4}
                                    fill="#FFFFFF"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {traceResult.hitSensor ? "HIT" : "TARGET"}
                                </text>
                            </g>
                        </svg>
                    </div>

                    {/* Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] px-4 py-3">
                        {traceResult.hitSensor ? (
                            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-700">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Optical Sensor Activated! Law of Reflection verified across {traceResult.bounces.length} bounce(s).</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-sm text-[#57554E]">
                                <Sparkles className="w-4 h-4 text-indigo-600" />
                                <span>Click a mirror on the board or select it on the right to dial its angle.</span>
                            </div>
                        )}
                        {traceResult.hitSensor && levelIdx < LEVELS.length - 1 && (
                            <button
                                type="button"
                                onClick={() => loadLevel(levelIdx + 1)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
                            >
                                <span>Next Level</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Mirror Controls & Law of Reflection Readout */}
                <div className="lg:col-span-4 bg-white border border-[#E6E3DB] rounded-2xl p-5 flex flex-col justify-between gap-5">
                    <div className="space-y-5">
                        {/* Mirror Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Active Mirror
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {level.mirrors.map((m) => (
                                    <button
                                        key={m.id}
                                        type="button"
                                        onClick={() => setSelectedMirrorId(m.id)}
                                        className={`py-2 px-3 rounded-xl border text-xs font-semibold font-mono transition-colors ${
                                            selectedMirrorId === m.id
                                                ? "bg-indigo-50 border-indigo-500 text-indigo-900"
                                                : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        {m.id} ({Math.round(angles[m.id] ?? m.angleDeg)}°)
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Angle Dial */}
                        <div className="space-y-2.5">
                            <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                <span>Mirror {selectedMirrorId} Surface Angle</span>
                                <span className="font-mono tabular-nums text-indigo-700">{currentAngle.toFixed(0)}°</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={179}
                                step={1}
                                value={currentAngle}
                                onChange={(e) => updateAngle(selectedMirrorId, Number(e.target.value))}
                                className="w-full accent-indigo-600"
                            />
                            <div className="grid grid-cols-4 gap-2">
                                {[-5, -1, 1, 5].map((delta) => (
                                    <button
                                        key={delta}
                                        type="button"
                                        onClick={() => updateAngle(selectedMirrorId, currentAngle + delta)}
                                        className="py-2 rounded-lg border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-xs font-mono font-semibold text-[#161614] transition-colors"
                                    >
                                        {delta > 0 ? `+${delta}°` : `${delta}°`}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Live Reflection Telemetry */}
                        <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4 space-y-2.5">
                            <div className="text-[11px] font-semibold uppercase tracking-wider text-[#78756C]">
                                Law of Reflection (θᵢ = θᵣ)
                            </div>
                            {traceResult.bounces.length === 0 ? (
                                <p className="text-xs text-[#78756C]">No mirror intersections yet. Aim the beam onto Mirror M1.</p>
                            ) : (
                                <div className="space-y-1.5 font-mono text-xs tabular-nums">
                                    {traceResult.bounces.map((b, i) => (
                                        <div key={i} className="flex items-center justify-between text-[#3F3E39]">
                                            <span>Bounce {i + 1} ({b.mirrorId})</span>
                                            <span className="font-bold text-indigo-700">
                                                θᵢ = {b.incidenceDeg.toFixed(1)}° · θᵣ = {b.incidenceDeg.toFixed(1)}°
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => loadLevel(levelIdx)}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-sm font-semibold text-[#3F3E39] transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Reset Level Mirrors</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
