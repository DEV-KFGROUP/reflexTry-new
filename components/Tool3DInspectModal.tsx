"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RotateCcw, X } from "lucide-react";
import type { Tool3DIconSpec } from "@/lib/icons/tool-3d-catalog";
import {
    buildIconSculptureGroup,
    detectIconSoftwareWebGL,
    disposeObject3D,
} from "@/lib/three/icon-renderer";

interface Tool3DInspectModalProps {
    spec: Tool3DIconSpec;
    title?: string;
    onClose: () => void;
}

/**
 * On-demand live Three.js OrbitControls inspector for any tool's 3D icon sculpture.
 * Uses a single temporary WebGL context that disposes cleanly on close and obeys
 * software-WebGL pacing (render-on-demand + afterDraw fence sync).
 */
export function Tool3DInspectModal({ spec, title, onClose }: Tool3DInspectModalProps) {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const resetRef = useRef<(() => void) | null>(null);
    const [webglUnavailable, setWebglUnavailable] = useState(false);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [onClose]);

    useEffect(() => {
        const container = mountRef.current;
        if (!container) return;

        const isSoftware = detectIconSoftwareWebGL();
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                alpha: false,
                antialias: !isSoftware,
                powerPreference: "high-performance",
            });
        } catch {
            setWebglUnavailable(true);
            return;
        }

        const w = Math.max(container.clientWidth, 260);
        const h = Math.max(container.clientHeight, 260);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.setPixelRatio(isSoftware ? 1 : Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(w, h);

        container.replaceChildren(renderer.domElement);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#F3F1EB");

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envTarget.texture;
        pmrem.dispose();

        const hemi = new THREE.HemisphereLight(0xf1f5ff, 0xd6d3cd, 1.05);
        const key = new THREE.DirectionalLight(0xfff7ed, 2.05);
        key.position.set(3.4, 4.8, 3.8);
        const rim = new THREE.DirectionalLight(0xcbd5e1, 1.0);
        rim.position.set(-3.2, 2.6, -3.4);
        scene.add(hemi, key, rim);

        const floor = new THREE.Mesh(
            new THREE.CircleGeometry(3.2, 36),
            new THREE.MeshStandardMaterial({
                color: 0xece9e1,
                roughness: 0.9,
                metalness: 0.02,
            })
        );
        floor.rotation.x = -Math.PI / 2;
        floor.position.y = -0.74;
        scene.add(floor);

        const sculpture = buildIconSculptureGroup(spec);
        scene.add(sculpture);

        const camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 30);
        camera.position.set(2.35, 1.75, 2.85);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = !isSoftware;
        controls.dampingFactor = 0.07;
        controls.enablePan = false;
        controls.minDistance = 2.0;
        controls.maxDistance = 5.4;
        controls.target.set(0, -0.05, 0);
        controls.update();

        let disposed = false;
        let frameId = 0;
        let renderBusy = false;
        let renderDirty = false;

        function afterDraw(cb: () => void) {
            const gl = renderer.getContext() as WebGL2RenderingContext;
            const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
            gl.flush();
            const poll = () => {
                if (disposed) {
                    if (sync) gl.deleteSync(sync);
                    return;
                }
                const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
                if (state === gl.UNSIGNALED) {
                    frameId = window.setTimeout(poll, 5);
                } else {
                    if (sync) gl.deleteSync(sync);
                    frameId = window.setTimeout(cb, 60);
                }
            };
            frameId = window.setTimeout(poll, 5);
        }

        function requestRender() {
            if (disposed) return;
            if (renderBusy) {
                renderDirty = true;
                return;
            }
            renderBusy = true;
            frameId = window.requestAnimationFrame(() => {
                if (disposed) return;
                renderDirty = false;
                controls.update();
                renderer.render(scene, camera);
                const done = () => {
                    renderBusy = false;
                    if (renderDirty) requestRender();
                };
                if (isSoftware) afterDraw(done);
                else done();
            });
        }

        resetRef.current = () => {
            camera.position.set(2.35, 1.75, 2.85);
            controls.target.set(0, -0.05, 0);
            controls.update();
            requestRender();
        };

        const onControlChange = () => requestRender();
        controls.addEventListener("change", onControlChange);

        const resizeObserver = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            const nw = Math.max(Math.floor(entry.contentRect.width), 240);
            const nh = Math.max(Math.floor(entry.contentRect.height), 240);
            camera.aspect = nw / nh;
            camera.updateProjectionMatrix();
            renderer.setSize(nw, nh);
            requestRender();
        });
        resizeObserver.observe(container);

        // Initial render + subtle auto-spin only on GPU devices
        requestRender();

        return () => {
            disposed = true;
            window.cancelAnimationFrame(frameId);
            window.clearTimeout(frameId);
            resizeObserver.disconnect();
            controls.removeEventListener("change", onControlChange);
            controls.dispose();
            envTarget.dispose();
            disposeObject3D(scene);
            renderer.dispose();
        };
    }, [spec]);

    return (
        <div
            className="fixed inset-0 z-50 bg-[#161614]/45 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`3D icon preview for ${title || spec.visualLabel}`}
            onClick={onClose}
        >
            <div
                className="bg-white border border-[#E6E3DB] rounded-2xl w-full max-w-md overflow-hidden shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="px-5 py-4 border-b border-[#E6E3DB] flex items-center justify-between gap-3">
                    <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                            3D Tool Visual · Drag to Orbit
                        </p>
                        <h3 className="font-serif text-lg font-medium text-[#161614] truncate">
                            {title || spec.visualLabel}
                        </h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close 3D icon preview"
                        className="p-2 rounded-lg text-[#78756C] hover:text-[#161614] hover:bg-[#F3F1EB] transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

                <div className="relative w-full h-72 bg-[#F3F1EB]">
                    <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
                    {webglUnavailable && (
                        <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-[#57554E]">
                            Interactive 3D view is unavailable in this browser context.
                        </div>
                    )}
                </div>

                <div className="px-5 py-3.5 bg-[#FAF9F6] border-t border-[#E6E3DB] flex items-center justify-between gap-3">
                    <span className="text-xs text-[#57554E] truncate">{spec.visualLabel}</span>
                    <button
                        type="button"
                        onClick={() => resetRef.current?.()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E6E3DB] bg-white text-xs font-semibold text-[#161614] hover:bg-[#F3F1EB] transition-colors cursor-pointer whitespace-nowrap"
                    >
                        <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Reset Angle</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
