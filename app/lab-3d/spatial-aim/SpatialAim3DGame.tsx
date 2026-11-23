"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
    ArrowLeft,
    Crosshair,
    Play,
    RotateCcw,
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    Trophy,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";
import { detectSoftwareGl, createFramePacer } from "@/lib/three-runtime";

type AimMode = "flick" | "grid" | "moving";

interface DroneEntity {
    id: number;
    group: THREE.Group;
    outerRingA: THREE.Mesh;
    outerRingB: THREE.Mesh;
    plane: "near" | "mid" | "far";
    spawnTs: number;
    vx: number;
    vy: number;
}

const DEPTH_PLANES: { name: "near" | "mid" | "far"; z: number; xLim: number; yLim: number; color: number }[] = [
    { name: "near", z: -4.8, xLim: 3.1, yLim: 1.8, color: 0x38bdf8 },
    { name: "mid", z: -9.5, xLim: 5.2, yLim: 2.9, color: 0x6366f1 },
    { name: "far", z: -14.8, xLim: 7.4, yLim: 4.0, color: 0xf43f5e },
];

const SESSION_SEC = 30;

export default function SpatialAim3DGame() {
    const { t, getLocalizedHref } = useTranslation();

    const mountRef = useRef<HTMLDivElement | null>(null);

    const [mode, setMode] = useState<AimMode>("flick");
    const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
    const [timeLeft, setTimeLeft] = useState(SESSION_SEC);
    const [hits, setHits] = useState(0);
    const [shots, setShots] = useState(0);
    const [avgMs, setAvgMs] = useState(0);
    const [lastMs, setLastMs] = useState<number | null>(null);
    const [controlsOpen, setControlsOpen] = useState(true);
    const [contextLost, setContextLost] = useState(false);

    const modeRef = useRef<AimMode>("flick");
    const phaseRef = useRef<"idle" | "playing" | "done">("idle");

    useEffect(() => {
        modeRef.current = mode;
    }, [mode]);

    useEffect(() => {
        phaseRef.current = phase;
    }, [phase]);

    const startRunActionRef = useRef<(() => void) | null>(null);
    const statsRef = useRef({ hits: 0, shots: 0, totalMs: 0 });

    // Keyboard shortcut C to collapse dock (leaves H for global category hub navigation)
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
            if (e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
            if (e.key === "c" || e.key === "C") {
                setControlsOpen((prev) => !prev);
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Session countdown timer
    useEffect(() => {
        if (phase !== "playing") return;
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    setPhase("done");
                    phaseRef.current = "done";
                    const st = statsRef.current;
                    const acc = st.shots > 0 ? Math.round((st.hits / st.shots) * 100) : 0;
                    ScoreHistory.save("spatial-aim-3d", st.hits, "hits", modeRef.current, {
                        higherIsBetter: true,
                        accuracy: acc,
                        configuration: `30s-${modeRef.current}`,
                    });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);

    const handleStart = useCallback(() => {
        statsRef.current = { hits: 0, shots: 0, totalMs: 0 };
        setHits(0);
        setShots(0);
        setAvgMs(0);
        setLastMs(null);
        setTimeLeft(SESSION_SEC);
        setPhase("playing");
        phaseRef.current = "playing";
        startRunActionRef.current?.();
    }, []);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const isSoftwareGl = detectSoftwareGl();
        const width = Math.max(320, container.clientWidth);
        const height = Math.max(360, container.clientHeight);

        const renderer = new THREE.WebGLRenderer({
            antialias: !isSoftwareGl,
            powerPreference: "high-performance",
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : 2));
        renderer.setSize(width, height);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.05;

        container.replaceChildren(renderer.domElement);

        const onLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
        };
        const onRestored = () => setContextLost(false);
        renderer.domElement.addEventListener("webglcontextlost", onLost, false);
        renderer.domElement.addEventListener("webglcontextrestored", onRestored, false);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#0B1120");
        scene.fog = new THREE.Fog("#0B1120", 14, 30);

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;

        const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 100);
        camera.position.set(0, 0.4, 2.5);
        camera.lookAt(0, 0, -10);

        // Chamber Lighting
        const hemi = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 0.9);
        scene.add(hemi);
        const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
        keyLight.position.set(4, 8, 6);
        scene.add(keyLight);

        // 3D Calibration Chamber Architecture (Floor Grid + Ceiling Light Rails + Depth Frame Rings)
        const floorGrid = new THREE.GridHelper(28, 28, 0x38bdf8, 0x1e293b);
        floorGrid.position.set(0, -4.6, -10);
        scene.add(floorGrid);

        const ceilGrid = new THREE.GridHelper(28, 28, 0x334155, 0x0f172a);
        ceilGrid.position.set(0, 5.2, -10);
        scene.add(ceilGrid);

        // Depth calibration gate frames at Near, Mid, Far
        DEPTH_PLANES.forEach((dp) => {
            const framePts = [
                new THREE.Vector3(-dp.xLim - 1.2, -dp.yLim - 1.1, dp.z),
                new THREE.Vector3(dp.xLim + 1.2, -dp.yLim - 1.1, dp.z),
                new THREE.Vector3(dp.xLim + 1.2, dp.yLim + 1.1, dp.z),
                new THREE.Vector3(-dp.xLim - 1.2, dp.yLim + 1.1, dp.z),
                new THREE.Vector3(-dp.xLim - 1.2, -dp.yLim - 1.1, dp.z),
            ];
            const fGeo = new THREE.BufferGeometry().setFromPoints(framePts);
            const fMat = new THREE.LineBasicMaterial({ color: dp.color, transparent: true, opacity: 0.25 });
            scene.add(new THREE.Line(fGeo, fMat));
        });

        // Shared geometries for composite 3D Drone Targets
        const coreGeo = new THREE.SphereGeometry(0.42, 24, 24);
        const bullGeo = new THREE.TorusGeometry(0.28, 0.045, 10, 28);
        const ringAGeo = new THREE.TorusGeometry(0.62, 0.045, 10, 36);
        const ringBGeo = new THREE.TorusGeometry(0.76, 0.032, 10, 36);
        const finGeo = new THREE.BoxGeometry(0.22, 0.06, 0.08);
        const burstGeo = new THREE.RingGeometry(0.4, 0.56, 28);

        const drones: DroneEntity[] = [];
        let nextDroneId = 1;
        const bursts: { mesh: THREE.Mesh; life: number }[] = [];

        const spawnBurst = (pos: THREE.Vector3, colorHex: number) => {
            const mat = new THREE.MeshBasicMaterial({
                color: colorHex,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.9,
            });
            const m = new THREE.Mesh(burstGeo, mat);
            m.position.copy(pos);
            m.lookAt(camera.position);
            scene.add(m);
            bursts.push({ mesh: m, life: 1.0 });
        };

        const createDrone = (planeOverride?: number): DroneEntity => {
            const dp = DEPTH_PLANES[planeOverride ?? Math.floor(Math.random() * DEPTH_PLANES.length)];
            const group = new THREE.Group();

            const coreMat = new THREE.MeshStandardMaterial({
                color: dp.color,
                emissive: new THREE.Color(dp.color),
                emissiveIntensity: 0.55,
                metalness: 0.55,
                roughness: 0.2,
            });
            const ringMat = new THREE.MeshStandardMaterial({
                color: 0xf8fafc,
                metalness: 0.8,
                roughness: 0.2,
            });
            const bullMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

            const core = new THREE.Mesh(coreGeo, coreMat);
            const bull = new THREE.Mesh(bullGeo, bullMat);
            bull.position.z = 0.36;
            const ringA = new THREE.Mesh(ringAGeo, ringMat);
            const ringB = new THREE.Mesh(ringBGeo, coreMat);
            ringB.rotation.x = Math.PI / 3;

            // 4 stabilizer fins
            for (let i = 0; i < 4; i++) {
                const fin = new THREE.Mesh(finGeo, ringMat);
                const ang = (i * Math.PI) / 2;
                fin.position.set(Math.cos(ang) * 0.55, Math.sin(ang) * 0.55, 0);
                fin.rotation.z = ang;
                group.add(fin);
            }

            group.add(core, bull, ringA, ringB);

            // Scale slightly up at far depth so hit targets remain ergonomically fair
            const scale = dp.name === "near" ? 0.78 : dp.name === "mid" ? 1.0 : 1.24;
            group.scale.setScalar(scale);

            // Position cleanly separated from existing drones
            let x = (Math.random() * 2 - 1) * dp.xLim;
            let y = (Math.random() * 2 - 1) * dp.yLim;
            for (let tries = 0; tries < 10; tries++) {
                const tooClose = drones.some((d) => Math.hypot(d.group.position.x - x, d.group.position.y - y) < 2.2);
                if (!tooClose) break;
                x = (Math.random() * 2 - 1) * dp.xLim;
                y = (Math.random() * 2 - 1) * dp.yLim;
            }
            group.position.set(x, y, dp.z);

            const id = nextDroneId++;
            group.traverse((child) => {
                child.userData.droneId = id;
            });

            scene.add(group);
            return {
                id,
                group,
                outerRingA: ringA,
                outerRingB: ringB,
                plane: dp.name,
                spawnTs: performance.now(),
                vx: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 1.4),
                vy: (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 0.9),
            };
        };

        const clearDrones = () => {
            while (drones.length > 0) {
                const d = drones.pop()!;
                scene.remove(d.group);
                d.group.traverse((obj) => {
                    if (obj instanceof THREE.Mesh) {
                        if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                        else obj.material.dispose();
                    }
                });
            }
        };

        const populateForMode = () => {
            clearDrones();
            const count = modeRef.current === "flick" ? 1 : 3;
            for (let i = 0; i < count; i++) {
                drones.push(createDrone(count === 3 ? i : undefined));
            }
        };

        // Preview drone in idle
        drones.push(createDrone(1));

        startRunActionRef.current = () => {
            populateForMode();
        };

        // Pre-allocated raycaster helpers
        const raycaster = new THREE.Raycaster();
        const pointerNdc = new THREE.Vector2();

        const handlePointerDown = (ev: PointerEvent) => {
            if (phaseRef.current !== "playing") return;
            const rect = renderer.domElement.getBoundingClientRect();
            pointerNdc.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
            pointerNdc.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;

            statsRef.current.shots++;
            setShots(statsRef.current.shots);

            raycaster.setFromCamera(pointerNdc, camera);
            const hitTargets = drones.map((d) => d.group);
            const hitsFound = raycaster.intersectObjects(hitTargets, true);

            if (hitsFound.length > 0) {
                const hitId = hitsFound[0].object.userData.droneId as number | undefined;
                const idx = drones.findIndex((d) => d.id === hitId);
                if (idx !== -1) {
                    const hitDrone = drones[idx];
                    const rt = Math.max(40, Math.round(performance.now() - hitDrone.spawnTs));
                    statsRef.current.hits++;
                    statsRef.current.totalMs += rt;
                    setHits(statsRef.current.hits);
                    setLastMs(rt);
                    setAvgMs(Math.round(statsRef.current.totalMs / statsRef.current.hits));

                    const planeMeta = DEPTH_PLANES.find((p) => p.name === hitDrone.plane);
                    spawnBurst(hitDrone.group.position, planeMeta?.color ?? 0x38bdf8);

                    scene.remove(hitDrone.group);
                    hitDrone.group.traverse((obj) => {
                        if (obj instanceof THREE.Mesh) {
                            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                            else obj.material.dispose();
                        }
                    });
                    drones.splice(idx, 1);

                    // Spawn replacement drone
                    drones.push(createDrone());
                }
            }
        };

        renderer.domElement.addEventListener("pointerdown", handlePointerDown);

        const onResize = () => {
            if (!container) return;
            const w = Math.max(320, container.clientWidth);
            const h = Math.max(360, container.clientHeight);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        const ro = new ResizeObserver(onResize);
        ro.observe(container);

        let lastTs = performance.now();
        const pacer = createFramePacer(renderer, isSoftwareGl);

        const tick = () => {
            const now = performance.now();
            const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
            lastTs = now;

            // Animate gyro drones
            for (const d of drones) {
                d.outerRingA.rotation.z += dt * 1.9;
                d.outerRingB.rotation.y += dt * 2.3;
                if (phaseRef.current === "playing" && modeRef.current === "moving") {
                    const dp = DEPTH_PLANES.find((p) => p.name === d.plane)!;
                    d.group.position.x += d.vx * dt;
                    d.group.position.y += d.vy * dt;
                    if (Math.abs(d.group.position.x) > dp.xLim) {
                        d.vx = -d.vx;
                        d.group.position.x = Math.sign(d.group.position.x) * dp.xLim;
                    }
                    if (Math.abs(d.group.position.y) > dp.yLim) {
                        d.vy = -d.vy;
                        d.group.position.y = Math.sign(d.group.position.y) * dp.yLim;
                    }
                }
            }

            // Animate hit bursts
            for (let i = bursts.length - 1; i >= 0; i--) {
                const b = bursts[i];
                b.life -= dt * 3.4;
                if (b.life <= 0) {
                    scene.remove(b.mesh);
                    (b.mesh.material as THREE.Material).dispose();
                    bursts.splice(i, 1);
                } else {
                    const s = 1 + (1 - b.life) * 2.2;
                    b.mesh.scale.setScalar(s);
                    (b.mesh.material as THREE.MeshBasicMaterial).opacity = b.life;
                }
            }

            renderer.render(scene, camera);
            pacer.schedule(tick);
        };

        pacer.schedule(tick);

        return () => {
            pacer.cancel();
            ro.disconnect();
            renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
            renderer.domElement.removeEventListener("webglcontextlost", onLost);
            renderer.domElement.removeEventListener("webglcontextrestored", onRestored);
            clearDrones();
            coreGeo.dispose();
            bullGeo.dispose();
            ringAGeo.dispose();
            ringBGeo.dispose();
            finGeo.dispose();
            burstGeo.dispose();
            pmrem.dispose();
            envTex.dispose();
            renderer.dispose();
            container.replaceChildren();
        };
    }, []);

    const accuracy = shots > 0 ? Math.round((hits / shots) * 100) : 100;

    return (
        <div className="w-full max-w-6xl mx-auto space-y-4">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/lab-3d")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.lab-3d.title", "3D Interactive Lab")}</span>
                </Link>

                <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                    {(
                        [
                            { id: "flick", label: "Depth Flick" },
                            { id: "grid", label: "3-Plane Grid" },
                            { id: "moving", label: "Moving Drones" },
                        ] as { id: AimMode; label: string }[]
                    ).map((m) => (
                        <button
                            key={m.id}
                            type="button"
                            onClick={() => {
                                setMode(m.id);
                                if (phase === "playing") {
                                    modeRef.current = m.id;
                                    handleStart();
                                }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                mode === m.id ? "bg-sky-600 text-white" : "text-[#57554E] hover:text-[#161614]"
                            }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 3D Viewport Stage */}
            <div className="relative w-full h-[540px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-800 bg-[#0B1120] cursor-crosshair">
                {/* Dedicated Empty WebGL Mount */}
                <div ref={mountRef} className="absolute inset-0 w-full h-full" />

                {/* Top Telemetry HUD (no backdrop-blur) */}
                <div className="pointer-events-none absolute top-4 left-4 right-4 flex flex-wrap items-start justify-between gap-3 z-10">
                    <div className="rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-2.5 text-white">
                        <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wider text-sky-400">
                            <Crosshair className="w-3.5 h-3.5" />
                            <span>Near · Mid · Far Z-Depth</span>
                        </div>
                        <h1 className="text-lg font-bold tracking-tight">
                            {t("tools.spatial-aim-3d.title", "3D Spatial Aim Arena")}
                        </h1>
                    </div>

                    <div className="rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-2.5 text-white font-mono text-xs tabular-nums flex items-center gap-4">
                        <div>
                            <div className="text-[10px] uppercase text-slate-400">Time</div>
                            <div className={`text-sm font-bold ${timeLeft <= 5 && phase === "playing" ? "text-rose-400" : "text-white"}`}>
                                {timeLeft}s
                            </div>
                        </div>
                        <div className="pl-3 border-l border-slate-700">
                            <div className="text-[10px] uppercase text-slate-400">Hits</div>
                            <div className="text-sm font-bold text-emerald-400">{hits}</div>
                        </div>
                        <div className="pl-3 border-l border-slate-700">
                            <div className="text-[10px] uppercase text-slate-400">Accuracy</div>
                            <div className="text-sm font-bold text-sky-400">{accuracy}%</div>
                        </div>
                        <div className="pl-3 border-l border-slate-700">
                            <div className="text-[10px] uppercase text-slate-400">Avg RT</div>
                            <div className="text-sm font-bold text-amber-300">{avgMs > 0 ? `${avgMs}ms` : "—"}</div>
                        </div>
                    </div>
                </div>

                {/* Idle / Finish Overlay */}
                {phase !== "playing" && (
                    <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center p-6 z-20 cursor-default">
                        <div className="max-w-md w-full rounded-2xl bg-slate-900 border border-slate-700 p-6 text-center text-white space-y-4">
                            {phase === "done" ? (
                                <>
                                    <Trophy className="w-9 h-9 text-amber-400 mx-auto" />
                                    <h2 className="text-2xl font-extrabold">30s Run Complete</h2>
                                    <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
                                        <div className="rounded-xl bg-slate-800 p-3">
                                            <div className="text-[10px] uppercase text-slate-400">Hits</div>
                                            <div className="text-lg font-bold text-emerald-400">{hits}</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-800 p-3">
                                            <div className="text-[10px] uppercase text-slate-400">Accuracy</div>
                                            <div className="text-lg font-bold text-sky-400">{accuracy}%</div>
                                        </div>
                                        <div className="rounded-xl bg-slate-800 p-3">
                                            <div className="text-[10px] uppercase text-slate-400">Avg RT</div>
                                            <div className="text-lg font-bold text-amber-300">{avgMs || "—"}ms</div>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        <span>Run Again</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Crosshair className="w-9 h-9 text-sky-400 mx-auto" />
                                    <h2 className="text-2xl font-extrabold">3D Spatial Aim Arena</h2>
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        Click composite 3D gyro-drones spawning across cyan (Near), indigo (Mid), and crimson (Far) depth planes.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={handleStart}
                                        className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                                    >
                                        <Play className="w-4 h-4" />
                                        <span>Start 30s Session</span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {contextLost && (
                    <div className="absolute inset-0 bg-slate-950/95 flex items-center justify-center z-30 text-white text-sm font-semibold">
                        WebGL context paused. Reload to restore 3D chamber.
                    </div>
                )}

                {/* Collapsible Bottom Control Dock */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-end gap-2 cursor-default">
                    <button
                        type="button"
                        onClick={() => setControlsOpen((o) => !o)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                        <span>{controlsOpen ? "Hide Dock (C)" : "Show Dock (C)"}</span>
                        {controlsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>

                    {controlsOpen && (
                        <div className="w-full rounded-xl bg-slate-900/95 border border-slate-700 px-4 py-3 text-white flex flex-wrap items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-4 font-mono">
                                <span className="text-sky-400">■ Near Z = -4.8m</span>
                                <span className="text-indigo-400">■ Mid Z = -9.5m</span>
                                <span className="text-rose-400">■ Far Z = -14.8m</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {lastMs !== null && (
                                    <span className="font-mono text-amber-300 tabular-nums">Last Hit: {lastMs}ms</span>
                                )}
                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-semibold transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Restart</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
