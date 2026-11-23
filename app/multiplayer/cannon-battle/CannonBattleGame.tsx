"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Crosshair, Wind, RotateCcw, Trophy } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

const WORLD_W = 800;
const WORLD_H = 420;
const P1_X = 95;
const P2_X = 705;

const GRAVITIES = [
    { id: "earth", label: "Earth (9.8)", g: 9.81 },
    { id: "mars", label: "Mars (3.7)", g: 3.72 },
    { id: "moon", label: "Moon (1.6)", g: 1.62 },
];

function generateTerrain(): number[] {
    const heights: number[] = [];
    const peak1 = 260 + Math.random() * 140;
    const peak2 = 440 + Math.random() * 110;
    const amp1 = 85 + Math.random() * 65;
    const amp2 = 55 + Math.random() * 50;
    for (let x = 0; x <= WORLD_W; x++) {
        let h = 68;
        h += amp1 * Math.exp(-Math.pow((x - peak1) / 110, 2));
        h += amp2 * Math.exp(-Math.pow((x - peak2) / 90, 2));
        // Flatten tank pads
        if (Math.abs(x - P1_X) < 34) h = 82;
        if (Math.abs(x - P2_X) < 34) h = 82;
        heights.push(h);
    }
    return heights;
}

export default function CannonBattleGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [terrain, setTerrain] = useState<number[]>(() => generateTerrain());
    const [gravityIdx, setGravityIdx] = useState(0);
    const [turn, setTurn] = useState<1 | 2>(1);
    const [p1Hp, setP1Hp] = useState(100);
    const [p2Hp, setP2Hp] = useState(100);
    const [p1Angle, setP1Angle] = useState(48);
    const [p1Power, setP1Power] = useState(64);
    const [p2Angle, setP2Angle] = useState(48);
    const [p2Power, setP2Power] = useState(64);
    const [wind, setWind] = useState<number>(() => Math.round((Math.random() - 0.5) * 14));
    const [isFiring, setIsFiring] = useState(false);
    const [winner, setWinner] = useState<1 | 2 | null>(null);
    const [status, setStatus] = useState("Player 1's Turn — Set angle & power and fire over the mountain!");

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const rafRef = useRef<number | null>(null);

    const projRef = useRef({
        active: false,
        owner: 1 as 1 | 2,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        trail: [] as { x: number; y: number }[],
        lastTrailP1: [] as { x: number; y: number }[],
        lastTrailP2: [] as { x: number; y: number }[],
        explosion: null as { x: number; y: number; r: number } | null,
        lastTs: 0,
    });

    const resetMatch = useCallback(() => {
        setTerrain(generateTerrain());
        setTurn(1);
        setP1Hp(100);
        setP2Hp(100);
        setWind(Math.round((Math.random() - 0.5) * 14));
        setIsFiring(false);
        setWinner(null);
        setStatus("Player 1's Turn — Set angle & power and fire over the mountain!");
        projRef.current = {
            active: false,
            owner: 1,
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            trail: [],
            lastTrailP1: [],
            lastTrailP2: [],
            explosion: null,
            lastTs: 0,
        };
    }, []);

    const fireTurn = () => {
        if (isFiring || winner !== null) return;
        const angle = turn === 1 ? p1Angle : p2Angle;
        const power = turn === 1 ? p1Power : p2Power;
        const startX = turn === 1 ? P1_X : P2_X;
        const startY = WORLD_H - terrain[startX] - 14;
        const rad = (angle * Math.PI) / 180;
        const speed = power * 3.1;
        const dir = turn === 1 ? 1 : -1;

        const st = projRef.current;
        st.active = true;
        st.owner = turn;
        st.x = startX + dir * 20;
        st.y = startY - 6;
        st.vx = dir * Math.cos(rad) * speed;
        st.vy = -Math.sin(rad) * speed;
        st.trail = [{ x: st.x, y: st.y }];
        st.explosion = null;
        st.lastTs = performance.now();
        setIsFiring(true);
        setStatus(`Player ${turn} fired!`);
    };

    const gVal = GRAVITIES[gravityIdx].g;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const render = (now: number) => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            if (canvas.width !== WORLD_W * dpr || canvas.height !== WORLD_H * dpr) {
                canvas.width = WORLD_W * dpr;
                canvas.height = WORLD_H * dpr;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const st = projRef.current;
            if (st.active) {
                const dt = Math.min(0.035, Math.max(0.004, (now - st.lastTs) / 1000)) * 1.45;
                st.lastTs = now;
                // Gravity scaled to pixel space + wind acceleration
                st.vx += wind * 7.5 * dt;
                st.vy += gVal * 26 * dt;
                st.x += st.vx * dt;
                st.y += st.vy * dt;
                st.trail.push({ x: st.x, y: st.y });

                const ix = Math.round(st.x);
                const outOfBounds = ix < 0 || ix > WORLD_W || st.y > WORLD_H;
                const hitGround = !outOfBounds && st.y >= WORLD_H - terrain[ix];

                if (outOfBounds || hitGround) {
                    st.active = false;
                    setIsFiring(false);
                    if (st.owner === 1) st.lastTrailP1 = [...st.trail];
                    else st.lastTrailP2 = [...st.trail];

                    if (hitGround) {
                        st.explosion = { x: st.x, y: st.y, r: 34 };
                        const p1Y = WORLD_H - terrain[P1_X] - 10;
                        const p2Y = WORLD_H - terrain[P2_X] - 10;
                        const d1 = Math.hypot(st.x - P1_X, st.y - p1Y);
                        const d2 = Math.hypot(st.x - P2_X, st.y - p2Y);

                        let dmgMsg = "Missed both cannons.";
                        let nextP1 = p1Hp;
                        let nextP2 = p2Hp;

                        if (d1 < 44) {
                            const dmg = Math.max(15, Math.round(52 - d1));
                            nextP1 = Math.max(0, p1Hp - dmg);
                            setP1Hp(nextP1);
                            dmgMsg = `Hit Player 1 for ${dmg} damage!`;
                        } else if (d2 < 44) {
                            const dmg = Math.max(15, Math.round(52 - d2));
                            nextP2 = Math.max(0, p2Hp - dmg);
                            setP2Hp(nextP2);
                            dmgMsg = `Hit Player 2 for ${dmg} damage!`;
                        }

                        if (nextP1 <= 0 || nextP2 <= 0) {
                            const champ: 1 | 2 = nextP2 <= 0 ? 1 : 2;
                            setWinner(champ);
                            setStatus(`${dmgMsg} Player ${champ} wins the battle!`);
                            ScoreHistory.save("cannon-battle-2p", champ === 1 ? nextP1 : nextP2, "hp", GRAVITIES[gravityIdx].id, {
                                higherIsBetter: true,
                                configuration: `p${champ}-win`,
                            });
                        } else {
                            const nextTurn: 1 | 2 = st.owner === 1 ? 2 : 1;
                            const nextWind = Math.round((Math.random() - 0.5) * 16);
                            setTurn(nextTurn);
                            setWind(nextWind);
                            setStatus(`${dmgMsg} Player ${nextTurn}'s turn.`);
                        }
                    } else {
                        const nextTurn: 1 | 2 = st.owner === 1 ? 2 : 1;
                        setTurn(nextTurn);
                        setWind(Math.round((Math.random() - 0.5) * 16));
                        setStatus(`Shot flew off range. Player ${nextTurn}'s turn.`);
                    }
                }
            }

            // Sky
            const sky = ctx.createLinearGradient(0, 0, 0, WORLD_H);
            sky.addColorStop(0, "#E0F2FE");
            sky.addColorStop(1, "#F8FAFC");
            ctx.fillStyle = sky;
            ctx.fillRect(0, 0, WORLD_W, WORLD_H);

            // Terrain Mountain Polygon
            ctx.fillStyle = "#334155";
            ctx.beginPath();
            ctx.moveTo(0, WORLD_H);
            for (let x = 0; x <= WORLD_W; x += 2) {
                ctx.lineTo(x, WORLD_H - terrain[x]);
            }
            ctx.lineTo(WORLD_W, WORLD_H);
            ctx.closePath();
            ctx.fill();

            // Grass top ridge
            ctx.strokeStyle = "#16A34A";
            ctx.lineWidth = 4;
            ctx.beginPath();
            for (let x = 0; x <= WORLD_W; x += 2) {
                if (x === 0) ctx.moveTo(x, WORLD_H - terrain[x]);
                else ctx.lineTo(x, WORLD_H - terrain[x]);
            }
            ctx.stroke();
            ctx.lineWidth = 1;

            // Previous shot ghost arcs
            const drawGhost = (pts: { x: number; y: number }[], col: string) => {
                if (pts.length < 2) return;
                ctx.strokeStyle = col;
                ctx.setLineDash([4, 5]);
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                pts.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.lineWidth = 1;
            };
            drawGhost(st.lastTrailP1, "rgba(37,99,235,0.35)");
            drawGhost(st.lastTrailP2, "rgba(234,88,12,0.35)");

            // Draw Cannon Helper
            const drawCannon = (cx: number, color: string, angDeg: number, facing: 1 | -1, label: string) => {
                const cy = WORLD_H - terrain[cx] - 8;
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(facing === 1 ? (-angDeg * Math.PI) / 180 : ((angDeg - 180) * Math.PI) / 180);
                ctx.fillStyle = "#0F172A";
                ctx.fillRect(0, -4, 24, 8);
                ctx.restore();

                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(cx, cy, 11, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#FFFFFF";
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.lineWidth = 1;

                ctx.fillStyle = "#0F172A";
                ctx.font = "bold 11px monospace";
                ctx.textAlign = "center";
                ctx.fillText(label, cx, cy - 18);
            };

            drawCannon(P1_X, "#2563EB", p1Angle, 1, "P1");
            drawCannon(P2_X, "#EA580C", p2Angle, -1, "P2");

            // Active projectile trail
            if (st.active && st.trail.length > 1) {
                ctx.strokeStyle = st.owner === 1 ? "#2563EB" : "#EA580C";
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                st.trail.forEach((p, idx) => (idx === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
                ctx.stroke();
                ctx.lineWidth = 1;

                ctx.fillStyle = "#0F172A";
                ctx.beginPath();
                ctx.arc(st.x, st.y, 5, 0, Math.PI * 2);
                ctx.fill();
            }

            // Impact ring
            if (st.explosion) {
                ctx.fillStyle = "rgba(245, 158, 11, 0.35)";
                ctx.beginPath();
                ctx.arc(st.explosion.x, st.explosion.y, st.explosion.r, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#EA580C";
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
    }, [terrain, gVal, wind, p1Angle, p2Angle, p1Hp, p2Hp, gravityIdx]);

    const activeAngle = turn === 1 ? p1Angle : p2Angle;
    const activePower = turn === 1 ? p1Power : p2Power;

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

                <div className="flex items-center gap-2">
                    {GRAVITIES.map((g, idx) => (
                        <button
                            key={g.id}
                            type="button"
                            onClick={() => setGravityIdx(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                gravityIdx === idx
                                    ? "bg-orange-600 text-white border-orange-600"
                                    : "bg-white text-[#3F3E39] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                            }`}
                        >
                            {g.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* HP & Wind Bar */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-blue-700">
                        <span>PLAYER 1</span>
                        <span>{p1Hp} HP</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#F3F1EB] overflow-hidden border border-[#E6E3DB]">
                        <div className="h-full bg-blue-600 transition-all duration-300" style={{ width: `${p1Hp}%` }} />
                    </div>
                </div>

                <div className="text-center space-y-1">
                    <h1 className="text-lg font-extrabold text-[#161614] tracking-tight">
                        {t("tools.cannon-battle-2p.title", "Gravity Cannon Battle")}
                    </h1>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FAF9F6] border border-[#E6E3DB] font-mono text-xs text-[#3F3E39]">
                        <Wind className="w-3.5 h-3.5 text-sky-600" />
                        <span>
                            Wind: <strong>{wind === 0 ? "Calm" : wind > 0 ? `+${wind} →` : `${wind} ←`}</strong>
                        </span>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-mono font-bold text-orange-700">
                        <span>PLAYER 2</span>
                        <span>{p2Hp} HP</span>
                    </div>
                    <div className="h-3 rounded-full bg-[#F3F1EB] overflow-hidden border border-[#E6E3DB]">
                        <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${p2Hp}%` }} />
                    </div>
                </div>
            </div>

            {/* Battlefield Canvas */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-4 space-y-3">
                <div className="w-full rounded-xl overflow-hidden border border-[#E6E3DB]">
                    <canvas ref={canvasRef} className="w-full h-auto block" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] px-4 py-3 text-sm">
                    <span className="font-semibold text-[#161614] flex items-center gap-2">
                        {winner ? <Trophy className="w-4 h-4 text-amber-500" /> : <Crosshair className="w-4 h-4 text-orange-600" />}
                        {status}
                    </span>
                    <button
                        type="button"
                        onClick={resetMatch}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E3DB] bg-white hover:bg-[#F3F1EB] text-xs font-semibold text-[#3F3E39] transition-colors"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>New Terrain</span>
                    </button>
                </div>
            </div>

            {/* Active Player Firing Console */}
            <div
                className={`bg-white border-2 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-center ${
                    turn === 1 ? "border-blue-300" : "border-orange-300"
                }`}
            >
                <div className="md:col-span-3">
                    <div className={`text-xs font-mono font-bold uppercase ${turn === 1 ? "text-blue-700" : "text-orange-700"}`}>
                        Active Commander
                    </div>
                    <div className="text-xl font-extrabold text-[#161614] mt-0.5">
                        {winner ? `Player ${winner} Victorious!` : `Player ${turn}'s Turn`}
                    </div>
                </div>

                <div className="md:col-span-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                        <span>Elevation Angle</span>
                        <span className="font-mono tabular-nums">{activeAngle}°</span>
                    </div>
                    <input
                        type="range"
                        min={15}
                        max={82}
                        step={1}
                        value={activeAngle}
                        disabled={isFiring || winner !== null}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (turn === 1) setP1Angle(val);
                            else setP2Angle(val);
                        }}
                        className="w-full accent-blue-600"
                    />
                </div>

                <div className="md:col-span-3 space-y-1">
                    <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                        <span>Launch Power</span>
                        <span className="font-mono tabular-nums">{activePower}%</span>
                    </div>
                    <input
                        type="range"
                        min={25}
                        max={100}
                        step={1}
                        value={activePower}
                        disabled={isFiring || winner !== null}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            if (turn === 1) setP1Power(val);
                            else setP2Power(val);
                        }}
                        className="w-full accent-orange-600"
                    />
                </div>

                <div className="md:col-span-3">
                    <button
                        type="button"
                        onClick={winner ? resetMatch : fireTurn}
                        disabled={isFiring}
                        className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-semibold transition-colors disabled:opacity-60 ${
                            turn === 1 ? "bg-blue-600 hover:bg-blue-700" : "bg-orange-600 hover:bg-orange-700"
                        }`}
                    >
                        <Crosshair className="w-4 h-4" />
                        <span>{winner ? "Play Rematch" : isFiring ? "Shell In Air..." : `Fire Player ${turn}`}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
