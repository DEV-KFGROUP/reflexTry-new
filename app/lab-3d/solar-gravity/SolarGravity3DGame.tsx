"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import {
    ArrowLeft,
    Orbit,
    Rocket,
    RotateCcw,
    SlidersHorizontal,
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    AlertTriangle,
    Camera,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";
import { detectSoftwareGl, createFramePacer, createPlanetTexture } from "@/lib/three-runtime";

type CameraPreset = "overview" | "top" | "profile";

interface SimParams {
    starMass: number; // multiplier 0.5 - 2.5
    timeScale: number; // 0.2 - 2.5
    launchRadius: number; // 8 - 18
    launchSpeed: number; // 2.0 - 8.5
}

export default function SolarGravity3DGame() {
    const { t, getLocalizedHref } = useTranslation();

    const mountRef = useRef<HTMLDivElement | null>(null);

    const [starMass, setStarMass] = useState(1.0);
    const [timeScale, setTimeScale] = useState(1.0);
    const [launchRadius, setLaunchRadius] = useState(11.5);
    const [launchSpeed, setLaunchSpeed] = useState(4.6);
    const [controlsOpen, setControlsOpen] = useState(true);
    const [camPreset, setCamPreset] = useState<CameraPreset>("overview");
    const [satStatus, setSatStatus] = useState<"ready" | "orbiting" | "stable" | "crashed" | "escaped">("ready");
    const [satSweepDeg, setSatSweepDeg] = useState(0);
    const [stableCount, setStableCount] = useState(0);
    const [contextLost, setContextLost] = useState(false);

    const paramsRef = useRef<SimParams>({
        starMass: 1.0,
        timeScale: 1.0,
        launchRadius: 11.5,
        launchSpeed: 4.6,
    });

    useEffect(() => {
        paramsRef.current = { starMass, timeScale, launchRadius, launchSpeed };
    }, [starMass, timeScale, launchRadius, launchSpeed]);

    // Imperative callbacks wired into the WebGL loop
    const launchActionRef = useRef<(() => void) | null>(null);
    const resetSatActionRef = useRef<(() => void) | null>(null);
    const setCameraActionRef = useRef<((preset: CameraPreset) => void) | null>(null);

    const idealSpeed = Math.sqrt((240 * starMass) / launchRadius);

    // Keyboard shortcut 'C' to toggle collapsible control dock (leaves H for global category hub navigation)
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

    const handleLaunch = useCallback(() => {
        launchActionRef.current?.();
    }, []);

    const handleResetSat = useCallback(() => {
        resetSatActionRef.current?.();
    }, []);

    const handleCamPreset = useCallback((preset: CameraPreset) => {
        setCamPreset(preset);
        setCameraActionRef.current?.(preset);
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
        renderer.toneMappingExposure = 1.1;

        container.replaceChildren(renderer.domElement);

        const handleContextLost = (e: Event) => {
            e.preventDefault();
            setContextLost(true);
        };
        const handleContextRestored = () => {
            setContextLost(false);
        };
        renderer.domElement.addEventListener("webglcontextlost", handleContextLost, false);
        renderer.domElement.addEventListener("webglcontextrestored", handleContextRestored, false);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#070D1A");

        // RoomEnvironment IBL
        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
        scene.environment = envTex;

        const camera = new THREE.PerspectiveCamera(48, width / height, 0.2, 400);
        camera.position.set(0, 21, 30);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.06;
        controls.minDistance = 10;
        controls.maxDistance = 68;
        controls.maxPolarAngle = Math.PI * 0.49;

        // Lighting
        const ambient = new THREE.AmbientLight(0xcbd5e1, 0.45);
        scene.add(ambient);
        const sunLight = new THREE.PointLight(0xfff4d6, 180, 140, 1.5);
        sunLight.position.set(0, 0, 0);
        scene.add(sunLight);
        const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.7);
        rimLight.position.set(-18, 25, -20);
        scene.add(rimLight);

        const maxAniso = renderer.capabilities.getMaxAnisotropy();

        // Procedural Starfield backdrop (Points)
        const starCount = 700;
        const starPositions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 85 + Math.random() * 55;
            starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            starPositions[i * 3 + 1] = r * Math.cos(phi);
            starPositions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        const starMat = new THREE.PointsMaterial({ color: 0xe2e8f0, size: 0.45, transparent: true, opacity: 0.8 });
        const starField = new THREE.Points(starGeo, starMat);
        scene.add(starField);

        // Deformed 3D Spacetime Gravity-Well Grid
        const gridSize = 48;
        const gridSegs = 40;
        const wellGeo = new THREE.PlaneGeometry(gridSize, gridSize, gridSegs, gridSegs);
        wellGeo.rotateX(-Math.PI / 2);
        const wellMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.24,
        });
        const wellMesh = new THREE.Mesh(wellGeo, wellMat);
        wellMesh.position.y = -2.2;
        scene.add(wellMesh);

        let lastAppliedMass = -1;
        const updateGravityWell = (massMult: number) => {
            if (Math.abs(massMult - lastAppliedMass) < 0.005) return;
            lastAppliedMass = massMult;
            const pos = wellGeo.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < pos.count; i++) {
                const vx = pos.getX(i);
                const vz = pos.getZ(i);
                const r = Math.hypot(vx, vz);
                const depth = -(5.8 * massMult) / Math.sqrt(r * r * 0.18 + 1.2);
                pos.setY(i, depth);
            }
            pos.needsUpdate = true;
        };
        updateGravityWell(paramsRef.current.starMass);

        // Composite Central Star (Core + Corona + Equatorial Prominence Ring)
        const sunTex = createPlanetTexture("sun", maxAniso);
        const starGroup = new THREE.Group();
        const starCore = new THREE.Mesh(
            new THREE.SphereGeometry(2.3, 32, 32),
            new THREE.MeshStandardMaterial({
                map: sunTex,
                emissive: new THREE.Color("#F59E0B"),
                emissiveIntensity: 1.5,
                roughness: 0.35,
            })
        );
        const starCorona = new THREE.Mesh(
            new THREE.SphereGeometry(2.75, 24, 24),
            new THREE.MeshBasicMaterial({
                color: 0xfde047,
                transparent: true,
                opacity: 0.18,
                side: THREE.BackSide,
            })
        );
        const starHalo = new THREE.Mesh(
            new THREE.TorusGeometry(3.15, 0.045, 12, 64),
            new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.45 })
        );
        starHalo.rotation.x = Math.PI / 2;
        starGroup.add(starCore, starCorona, starHalo);
        scene.add(starGroup);

        // Helper for orbital track ring
        const makeOrbitLine = (radius: number, color: number) => {
            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= 96; i++) {
                const a = (i / 96) * Math.PI * 2;
                pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
            }
            const g = new THREE.BufferGeometry().setFromPoints(pts);
            const m = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 });
            return new THREE.Line(g, m);
        };

        // Composite Planets (Earth + Moon, Mars, Saturn + Rings)
        const earthTex = createPlanetTexture("earth", maxAniso);
        const marsTex = createPlanetTexture("mars", maxAniso);
        const saturnTex = createPlanetTexture("saturn", maxAniso);

        const earthPivot = new THREE.Group();
        const earthMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.95, 28, 28),
            new THREE.MeshStandardMaterial({ map: earthTex, roughness: 0.55, metalness: 0.08 })
        );
        const earthAtm = new THREE.Mesh(
            new THREE.SphereGeometry(1.03, 24, 24),
            new THREE.MeshBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.18 })
        );
        const moonOrbit = new THREE.Group();
        const moonMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.24, 16, 16),
            new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.85 })
        );
        moonMesh.position.set(1.7, 0.15, 0);
        moonOrbit.add(moonMesh);
        earthPivot.add(earthMesh, earthAtm, moonOrbit);
        scene.add(earthPivot);
        scene.add(makeOrbitLine(8.2, 0x3b82f6));

        const marsPivot = new THREE.Group();
        const marsMesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.72, 24, 24),
            new THREE.MeshStandardMaterial({ map: marsTex, roughness: 0.78, metalness: 0.05 })
        );
        const marsCap = new THREE.Mesh(
            new THREE.TorusGeometry(0.92, 0.02, 8, 36),
            new THREE.MeshBasicMaterial({ color: 0xfb923c, transparent: true, opacity: 0.35 })
        );
        marsCap.rotation.x = Math.PI / 2;
        marsPivot.add(marsMesh, marsCap);
        scene.add(marsPivot);
        scene.add(makeOrbitLine(13.8, 0xf97316));

        const saturnPivot = new THREE.Group();
        const saturnBody = new THREE.Mesh(
            new THREE.SphereGeometry(1.32, 28, 28),
            new THREE.MeshStandardMaterial({ map: saturnTex, roughness: 0.5, metalness: 0.1 })
        );
        const saturnRing = new THREE.Mesh(
            new THREE.RingGeometry(1.75, 2.85, 64),
            new THREE.MeshStandardMaterial({
                color: 0xfde68a,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.75,
                roughness: 0.6,
            })
        );
        saturnRing.rotation.x = Math.PI / 2.4;
        saturnPivot.add(saturnBody, saturnRing);
        scene.add(saturnPivot);
        scene.add(makeOrbitLine(19.5, 0xf59e0b));

        // Composite Custom Satellite (Multi-part THREE.Group: Bus + Gold Core + 2 Solar Wings + Dish + Thruster)
        const satGroup = new THREE.Group();
        const busMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.75, roughness: 0.25 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.85, roughness: 0.25 });
        const panelMat = new THREE.MeshStandardMaterial({
            color: 0x1d4ed8,
            emissive: new THREE.Color("#1E40AF"),
            emissiveIntensity: 0.35,
            metalness: 0.5,
            roughness: 0.2,
        });

        const satBus = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.68, 8), busMat);
        satBus.rotation.z = Math.PI / 2;
        const satCore = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.36), goldMat);
        const leftPanel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 1.35), panelMat);
        leftPanel.position.set(0, 0, -0.95);
        const rightPanel = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 1.35), panelMat);
        rightPanel.position.set(0, 0, 0.95);
        const dish = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.16, 16, 1, true), busMat);
        dish.position.set(0.42, 0, 0);
        dish.rotation.z = -Math.PI / 2;
        const thruster = new THREE.Mesh(
            new THREE.CylinderGeometry(0.08, 0.16, 0.22, 12),
            new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: new THREE.Color("#38BDF8"), emissiveIntensity: 0.9 })
        );
        thruster.position.set(-0.44, 0, 0);
        thruster.rotation.z = Math.PI / 2;

        satGroup.add(satBus, satCore, leftPanel, rightPanel, dish, thruster);
        scene.add(satGroup);

        // Satellite trail ribbon
        const MAX_TRAIL = 340;
        const trailPositions = new Float32Array(MAX_TRAIL * 3);
        const trailGeo = new THREE.BufferGeometry();
        trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPositions, 3));
        trailGeo.setDrawRange(0, 0);
        const trailMat = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.9 });
        const trailLine = new THREE.Line(trailGeo, trailMat);
        scene.add(trailLine);

        // Mutable physics state for satellite
        const satState = {
            active: false,
            pos: new THREE.Vector3(paramsRef.current.launchRadius, 0, 0),
            vel: new THREE.Vector3(0, 0, paramsRef.current.launchSpeed),
            prevAngle: 0,
            accumAngle: 0,
            trailCount: 0,
        };
        const _acc = new THREE.Vector3();
        const _lookTarget = new THREE.Vector3();

        const syncSatToLaunchPad = () => {
            satState.active = false;
            satState.pos.set(paramsRef.current.launchRadius, 0, 0);
            satState.vel.set(0, 0, paramsRef.current.launchSpeed);
            satState.prevAngle = 0;
            satState.accumAngle = 0;
            satState.trailCount = 0;
            trailGeo.setDrawRange(0, 0);
            satGroup.position.copy(satState.pos);
            setSatStatus("ready");
            setSatSweepDeg(0);
        };
        syncSatToLaunchPad();

        launchActionRef.current = () => {
            satState.pos.set(paramsRef.current.launchRadius, 0, 0);
            satState.vel.set(0, 0, paramsRef.current.launchSpeed);
            satState.prevAngle = Math.atan2(satState.pos.z, satState.pos.x);
            satState.accumAngle = 0;
            satState.trailCount = 0;
            trailGeo.setDrawRange(0, 0);
            satState.active = true;
            setSatStatus("orbiting");
            setSatSweepDeg(0);
        };

        resetSatActionRef.current = syncSatToLaunchPad;

        setCameraActionRef.current = (preset: CameraPreset) => {
            if (preset === "overview") {
                camera.position.set(0, 21, 30);
            } else if (preset === "top") {
                camera.position.set(0, 40, 0.1);
            } else {
                camera.position.set(0, 5.5, 33);
            }
            controls.target.set(0, 0, 0);
            controls.update();
        };

        // Resize observer
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

        let earthAng = 0.4;
        let marsAng = 2.4;
        let saturnAng = 4.6;
        let lastTime = performance.now();
        let lastReportedDeg = -1;

        const pacer = createFramePacer(renderer, isSoftwareGl);

        const tick = () => {
            const now = performance.now();
            const dtRaw = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
            lastTime = now;

            const { starMass: mMult, timeScale: tScale, launchRadius: lRad } = paramsRef.current;
            const dt = dtRaw * tScale;

            // Update spacetime curvature & star scale subtly
            updateGravityWell(mMult);
            const starScale = 0.85 + mMult * 0.2;
            starGroup.scale.setScalar(starScale);
            starCore.rotation.y += dt * 0.25;
            starHalo.rotation.z += dt * 0.18;

            // Keplerian planetary angular speed ~ sqrt(M / r^3)
            const gm = 240 * mMult;
            earthAng += Math.sqrt(gm / Math.pow(8.2, 3)) * dt;
            marsAng += Math.sqrt(gm / Math.pow(13.8, 3)) * dt;
            saturnAng += Math.sqrt(gm / Math.pow(19.5, 3)) * dt;

            earthPivot.position.set(Math.cos(earthAng) * 8.2, 0, Math.sin(earthAng) * 8.2);
            earthMesh.rotation.y += dt * 0.9;
            moonOrbit.rotation.y += dt * 2.4;

            marsPivot.position.set(Math.cos(marsAng) * 13.8, 0, Math.sin(marsAng) * 13.8);
            marsMesh.rotation.y += dt * 0.7;

            saturnPivot.position.set(Math.cos(saturnAng) * 19.5, 0, Math.sin(saturnAng) * 19.5);
            saturnBody.rotation.y += dt * 0.6;

            // Satellite simulation
            if (satState.active) {
                const substeps = 4;
                const h = dt / substeps;
                for (let s = 0; s < substeps; s++) {
                    const rSq = satState.pos.lengthSq();
                    const r = Math.sqrt(rSq);
                    if (r < 2.6 * starScale) {
                        satState.active = false;
                        setSatStatus("crashed");
                        break;
                    }
                    if (r > 36) {
                        satState.active = false;
                        setSatStatus("escaped");
                        break;
                    }
                    const aMag = gm / rSq;
                    _acc.copy(satState.pos).multiplyScalar(-aMag / r);
                    satState.vel.addScaledVector(_acc, h);
                    satState.pos.addScaledVector(satState.vel, h);

                    const ang = Math.atan2(satState.pos.z, satState.pos.x);
                    let delta = ang - satState.prevAngle;
                    if (delta > Math.PI) delta -= Math.PI * 2;
                    if (delta < -Math.PI) delta += Math.PI * 2;
                    satState.accumAngle += Math.abs(delta);
                    satState.prevAngle = ang;
                }

                satGroup.position.copy(satState.pos);
                _lookTarget.copy(satState.pos).add(satState.vel);
                satGroup.lookAt(_lookTarget);

                // Append trail
                if (satState.trailCount < MAX_TRAIL) {
                    const idx = satState.trailCount * 3;
                    trailPositions[idx] = satState.pos.x;
                    trailPositions[idx + 1] = satState.pos.y;
                    trailPositions[idx + 2] = satState.pos.z;
                    satState.trailCount++;
                } else {
                    trailPositions.copyWithin(0, 3);
                    const idx = (MAX_TRAIL - 1) * 3;
                    trailPositions[idx] = satState.pos.x;
                    trailPositions[idx + 1] = satState.pos.y;
                    trailPositions[idx + 2] = satState.pos.z;
                }
                trailGeo.attributes.position.needsUpdate = true;
                trailGeo.setDrawRange(0, satState.trailCount);

                const deg = Math.min(360, Math.round((satState.accumAngle * 180) / Math.PI));
                if (deg !== lastReportedDeg) {
                    lastReportedDeg = deg;
                    setSatSweepDeg(deg);
                }

                if (satState.active && satState.accumAngle >= Math.PI * 2) {
                    satState.active = false;
                    setSatStatus("stable");
                    setStableCount((prev) => {
                        const next = prev + 1;
                        ScoreHistory.save("solar-gravity-3d", next, "orbits", "3d-kepler", {
                            higherIsBetter: true,
                            configuration: `mass-${mMult.toFixed(1)}`,
                        });
                        return next;
                    });
                }
            } else if (satState.trailCount === 0) {
                // Keep parked satellite synced with launch radius slider
                satGroup.position.set(lRad, 0, 0);
                satGroup.rotation.set(0, 0, 0);
            }

            controls.update();
            renderer.render(scene, camera);
            pacer.schedule(tick);
        };

        pacer.schedule(tick);

        return () => {
            pacer.cancel();
            ro.disconnect();
            renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
            renderer.domElement.removeEventListener("webglcontextrestored", handleContextRestored);
            controls.dispose();
            pmrem.dispose();
            envTex.dispose();
            sunTex.dispose();
            earthTex.dispose();
            marsTex.dispose();
            saturnTex.dispose();
            scene.traverse((obj) => {
                if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points) {
                    obj.geometry.dispose();
                    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
                    else obj.material.dispose();
                }
            });
            renderer.dispose();
            container.replaceChildren();
        };
    }, []);

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

                <div className="flex items-center gap-2">
                    {(["overview", "top", "profile"] as CameraPreset[]).map((p) => (
                        <button
                            key={p}
                            type="button"
                            onClick={() => handleCamPreset(p)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                                camPreset === p
                                    ? "bg-sky-600 text-white border-sky-600"
                                    : "bg-white text-[#3F3E39] border-[#E6E3DB] hover:bg-[#FAF9F6]"
                            }`}
                        >
                            <Camera className="w-3.5 h-3.5" />
                            <span className="capitalize">{p}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* 3D Viewport Stage (dedicated canvas mount + sibling HUD overlays, zero backdrop-blur) */}
            <div className="relative w-full h-[540px] sm:h-[600px] rounded-2xl overflow-hidden border border-slate-800 bg-[#070D1A]">
                {/* Dedicated empty WebGL mount */}
                <div ref={mountRef} className="absolute inset-0 w-full h-full" />

                {/* Top-Left Title & Telemetry HUD */}
                <div className="pointer-events-none absolute top-4 left-4 right-4 flex flex-wrap items-start justify-between gap-3 z-10">
                    <div className="pointer-events-auto rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-3 text-white max-w-md">
                        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400">
                            <Orbit className="w-3.5 h-3.5" />
                            <span>3D Spacetime Gravity Well</span>
                        </div>
                        <h1 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                            {t("tools.solar-gravity-3d.title", "3D Solar Gravity Simulator")}
                        </h1>
                        <p className="text-xs text-slate-300 mt-0.5">
                            Drag to orbit camera · Scroll to zoom · Adjust star mass & launch a stable satellite.
                        </p>
                    </div>

                    <div className="pointer-events-auto rounded-xl bg-slate-900/90 border border-slate-700 px-4 py-2.5 text-white font-mono text-xs tabular-nums flex items-center gap-4">
                        <div>
                            <div className="text-[10px] uppercase text-slate-400">Sweep</div>
                            <div className="text-sm font-bold text-sky-400">{satSweepDeg}° / 360°</div>
                        </div>
                        <div className="pl-3 border-l border-slate-700">
                            <div className="text-[10px] uppercase text-slate-400">Stable Orbits</div>
                            <div className="text-sm font-bold text-emerald-400">{stableCount}</div>
                        </div>
                        <div className="pl-3 border-l border-slate-700">
                            <div className="text-[10px] uppercase text-slate-400">Ideal v₀</div>
                            <div className="text-sm font-bold text-amber-300">{idealSpeed.toFixed(2)}</div>
                        </div>
                    </div>
                </div>

                {/* Status Toast */}
                {(satStatus === "stable" || satStatus === "crashed" || satStatus === "escaped") && (
                    <div className="pointer-events-none absolute top-28 left-1/2 -translate-x-1/2 z-10">
                        <div
                            className={`rounded-xl px-4 py-2 text-xs font-semibold border flex items-center gap-2 ${
                                satStatus === "stable"
                                    ? "bg-emerald-950/95 border-emerald-500 text-emerald-200"
                                    : "bg-rose-950/95 border-rose-500 text-rose-200"
                            }`}
                        >
                            {satStatus === "stable" ? (
                                <>
                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    <span>Stable 360° Keplerian Orbit Achieved!</span>
                                </>
                            ) : satStatus === "crashed" ? (
                                <>
                                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                                    <span>Satellite fell into the star — raise Launch Speed.</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                                    <span>Escape velocity exceeded — lower Launch Speed.</span>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {contextLost && (
                    <div className="absolute inset-0 bg-slate-950/95 flex items-center justify-center z-20 text-white text-sm font-semibold">
                        WebGL context paused. Reload or resume tab to restore 3D viewport.
                    </div>
                )}

                {/* Collapsible Bottom Control Dock (no backdrop-blur) */}
                <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col items-end gap-2">
                    <button
                        type="button"
                        onClick={() => setControlsOpen((o) => !o)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/95 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
                    >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-sky-400" />
                        <span>{controlsOpen ? "Hide Controls (C)" : "Show Controls (C)"}</span>
                        {controlsOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                    </button>

                    {controlsOpen && (
                        <div className="w-full rounded-xl bg-slate-900/95 border border-slate-700 p-4 text-white grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">Star Mass (M)</span>
                                    <span className="font-mono text-amber-300 tabular-nums">{starMass.toFixed(1)}×</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.5}
                                    max={2.4}
                                    step={0.1}
                                    value={starMass}
                                    onChange={(e) => setStarMass(Number(e.target.value))}
                                    className="w-full accent-amber-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">Launch Radius (r)</span>
                                    <span className="font-mono text-sky-300 tabular-nums">{launchRadius.toFixed(1)} AU</span>
                                </div>
                                <input
                                    type="range"
                                    min={7.0}
                                    max={18.0}
                                    step={0.5}
                                    value={launchRadius}
                                    onChange={(e) => setLaunchRadius(Number(e.target.value))}
                                    className="w-full accent-sky-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">Launch Speed (v₀)</span>
                                    <span className="font-mono text-emerald-300 tabular-nums">{launchSpeed.toFixed(2)}</span>
                                </div>
                                <input
                                    type="range"
                                    min={2.0}
                                    max={8.5}
                                    step={0.05}
                                    value={launchSpeed}
                                    onChange={(e) => setLaunchSpeed(Number(e.target.value))}
                                    className="w-full accent-emerald-400"
                                />
                            </div>

                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-300">Time Scale</span>
                                    <span className="font-mono text-slate-200 tabular-nums">{timeScale.toFixed(1)}×</span>
                                </div>
                                <input
                                    type="range"
                                    min={0.2}
                                    max={2.5}
                                    step={0.1}
                                    value={timeScale}
                                    onChange={(e) => setTimeScale(Number(e.target.value))}
                                    className="w-full accent-blue-400"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={handleLaunch}
                                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold transition-colors"
                                >
                                    <Rocket className="w-3.5 h-3.5" />
                                    <span>Launch</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={handleResetSat}
                                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 transition-colors"
                                    aria-label="Reset satellite"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
