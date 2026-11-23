"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import type { Tool3DIconSpec } from "@/lib/icons/tool-3d-catalog";

/**
 * Shared single-context Three.js PBR 3D Icon Renderer + Composite Sculpture Builder.
 *
 * Uses ONE lazily-created offscreen WebGLRenderer with RoomEnvironment PMREM and
 * warm/cool 3-point studio lighting so 76+ tools on /tools and / render crisp
 * tactile 3D PBR icons without ever exhausting browser WebGL contexts.
 */

let cachedSoftwareGl: boolean | null = null;

export function detectIconSoftwareWebGL(): boolean {
    if (cachedSoftwareGl !== null) return cachedSoftwareGl;
    if (typeof document === "undefined") {
        cachedSoftwareGl = true;
        return true;
    }
    try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2");
        if (!gl) {
            cachedSoftwareGl = true;
            return true;
        }
        const ext = gl.getExtension("WEBGL_debug_renderer_info");
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param) || "");
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
        return cachedSoftwareGl;
    } catch {
        cachedSoftwareGl = true;
        return true;
    }
}

function makeMaterials(spec: Tool3DIconSpec) {
    // Primary satin architectural lacquer / ceramic
    const primary = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(spec.primaryColor),
        roughness: 0.28,
        metalness: 0.14,
        clearcoat: 0.72,
        clearcoatRoughness: 0.18,
    });

    // Secondary matte travertine / graphite structural body (roughness delta >= 0.30)
    const secondary = new THREE.MeshStandardMaterial({
        color: new THREE.Color(spec.secondaryColor),
        roughness: 0.62,
        metalness: 0.1,
    });

    // Accent brushed metallic brass / anodized alloy
    const accent = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(spec.accentColor),
        roughness: 0.2,
        metalness: 0.78,
        clearcoat: 0.45,
        clearcoatRoughness: 0.2,
    });

    // Crisp alabaster ivory & satin chrome trims
    const ivory = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#F7F5F0"),
        roughness: 0.56,
        metalness: 0.05,
    });

    const metal = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#CBD5E1"),
        roughness: 0.22,
        metalness: 0.88,
    });

    const darkInk = new THREE.MeshStandardMaterial({
        color: new THREE.Color("#1F201D"),
        roughness: 0.48,
        metalness: 0.25,
    });

    return { primary, secondary, accent, ivory, metal, darkInk };
}

/**
 * Builds a composite 3-to-9 part procedural Three.js sculpture for any Tool3DIconSpec.
 * Grounded near y = 0 with balanced silhouette around ~1.3 units radius.
 * Reused identically by both the offscreen snapshot engine and the live OrbitControls modal.
 */
export function buildIconSculptureGroup(spec: Tool3DIconSpec): THREE.Group {
    const g = new THREE.Group();
    const { primary, secondary, accent, ivory, metal, darkInk } = makeMaterials(spec);

    switch (spec.archetype) {
        case "crown_board": {
            // 2x2 checkered plinth + sculpted 5-point royal crown
            const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.16, 1.42), secondary);
            plinth.position.y = -0.58;
            g.add(plinth);
            for (let r = 0; r < 2; r++) {
                for (let c = 0; c < 2; c++) {
                    const tile = new THREE.Mesh(
                        new THREE.BoxGeometry(0.64, 0.06, 0.64),
                        (r + c) % 2 === 0 ? ivory : darkInk
                    );
                    tile.position.set((c - 0.5) * 0.68, -0.47, (r - 0.5) * 0.68);
                    g.add(tile);
                }
            }
            const band = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.24, 24), primary);
            band.position.y = -0.26;
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.045, 10, 28), accent);
            ring.rotation.x = Math.PI / 2;
            ring.position.y = -0.14;
            g.add(band, ring);
            for (let i = 0; i < 5; i++) {
                const a = (i / 5) * Math.PI * 2;
                const spike = new THREE.Mesh(new THREE.ConeGeometry(0.11, 0.46, 6), primary);
                spike.position.set(Math.cos(a) * 0.32, 0.08, Math.sin(a) * 0.32);
                const pearl = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), accent);
                pearl.position.set(Math.cos(a) * 0.34, 0.33, Math.sin(a) * 0.34);
                g.add(spike, pearl);
            }
            const centerOrb = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), accent);
            centerOrb.position.y = 0.08;
            g.add(centerOrb);
            break;
        }

        case "celestial_balance": {
            // Recessed stone tray with golden Sun + crescent Moon + "=" connector bar
            const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.92, 0.16, 32), ivory);
            tray.position.y = -0.52;
            const rim = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.045, 10, 36), metal);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = -0.43;
            g.add(tray, rim);

            // Golden Sun left
            const sunCore = new THREE.Mesh(new THREE.SphereGeometry(0.32, 22, 22), primary);
            sunCore.position.set(-0.36, 0.05, 0.08);
            g.add(sunCore);
            for (let i = 0; i < 8; i++) {
                const a = (i / 8) * Math.PI * 2;
                const ray = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 6), primary);
                ray.position.set(
                    -0.36 + Math.cos(a) * 0.42,
                    0.05 + Math.sin(a) * 0.42,
                    0.08
                );
                ray.rotation.z = a - Math.PI / 2;
                g.add(ray);
            }

            // Sculpted Crescent Moon right
            const moonShape = new THREE.Shape();
            moonShape.absarc(0, 0, 0.34, -Math.PI * 0.42, Math.PI * 0.42, false);
            moonShape.absarc(0.14, 0, 0.27, Math.PI * 0.36, -Math.PI * 0.36, true);
            const moonGeo = new THREE.ExtrudeGeometry(moonShape, {
                depth: 0.16,
                bevelEnabled: true,
                bevelSize: 0.03,
                bevelThickness: 0.03,
                bevelSegments: 2,
            });
            moonGeo.center();
            const moon = new THREE.Mesh(moonGeo, accent);
            moon.position.set(0.38, 0.06, -0.05);
            moon.rotation.y = -0.25;
            g.add(moon);
            break;
        }

        case "winding_path": {
            // Base grid plate + 3D tubular S-curve trail + start/mid/end checkpoint pins
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.44, 0.14, 1.44), ivory);
            base.position.y = -0.5;
            g.add(base);

            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(-0.5, -0.22, 0.48),
                new THREE.Vector3(-0.46, -0.1, -0.35),
                new THREE.Vector3(0.02, 0.02, -0.35),
                new THREE.Vector3(0.05, 0.12, 0.38),
                new THREE.Vector3(0.5, 0.25, 0.32),
                new THREE.Vector3(0.48, 0.36, -0.44),
            ]);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 36, 0.11, 14, false), primary);
            g.add(tube);

            const stops = [
                { pos: [-0.5, -0.14, 0.48], mat: accent },
                { pos: [0.02, 0.14, -0.35], mat: secondary },
                { pos: [0.48, 0.46, -0.44], mat: accent },
            ];
            for (const s of stops) {
                const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.14, 18), s.mat);
                cap.position.set(s.pos[0], s.pos[1], s.pos[2]);
                g.add(cap);
            }
            break;
        }

        case "sudoku_matrix": {
            // 3x3 stepped architectural grid matrix with elevated highlighted blocks
            const frame = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.16, 1.48), secondary);
            frame.position.y = -0.52;
            g.add(frame);

            const heights = [
                [0.22, 0.48, 0.2],
                [0.54, 0.24, 0.36],
                [0.24, 0.34, 0.6],
            ];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const h = heights[r][c];
                    const isHero = (r === 0 && c === 1) || (r === 1 && c === 0) || (r === 2 && c === 2);
                    const mat =
                        r === 2 && c === 2 ? accent : isHero ? primary : ivory;
                    const cell = new THREE.Mesh(new THREE.BoxGeometry(0.38, h, 0.38), mat);
                    cell.position.set((c - 1) * 0.45, -0.44 + h / 2, (r - 1) * 0.45);
                    g.add(cell);
                }
            }
            break;
        }

        case "patch_mosaic": {
            // Interlocking rectangular Shikaku partitions on beveled stone base
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.46, 0.14, 1.46), ivory);
            base.position.y = -0.5;
            g.add(base);

            const rects: { w: number; h: number; d: number; x: number; z: number; mat: THREE.Material }[] = [
                { w: 0.86, h: 0.36, d: 0.44, x: -0.22, z: -0.42, mat: primary },
                { w: 0.42, h: 0.54, d: 0.9, x: 0.44, z: -0.19, mat: accent },
                { w: 0.42, h: 0.46, d: 0.88, x: -0.44, z: 0.24, mat: secondary },
                { w: 0.86, h: 0.26, d: 0.42, x: 0.22, z: 0.46, mat: primary },
                { w: 0.4, h: 0.22, d: 0.4, x: 0.0, z: 0.02, mat: ivory },
            ];
            for (const r of rects) {
                const m = new THREE.Mesh(new THREE.BoxGeometry(r.w, r.h, r.d), r.mat);
                m.position.set(r.x, -0.43 + r.h / 2, r.z);
                g.add(m);
            }
            break;
        }

        case "merge_blocks": {
            // Three ascending beveled blocks sliding into a crowned hero cube
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.12, 1.48), ivory);
            base.position.y = -0.54;
            const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.34, 0.46), secondary);
            b1.position.set(-0.42, -0.31, 0.36);
            const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.52, 0.52), accent);
            b2.position.set(-0.28, -0.22, -0.28);
            const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.78, 0.68), primary);
            b3.position.set(0.28, -0.09, 0.06);
            const crown = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.44), metal);
            crown.position.set(0.28, 0.35, 0.06);
            g.add(base, b1, b2, b3, crown);
            break;
        }

        case "letter_weave": {
            // Three overlapping tilted tactile Scrabble/Wordle tiles with embossed cap bars
            const tiles = [
                { pos: [-0.38, -0.18, 0.26], rot: [0.18, 0.22, 0.14], mat: secondary },
                { pos: [0.02, 0.06, 0.0], rot: [0.12, -0.1, -0.06], mat: primary },
                { pos: [0.4, 0.24, -0.24], rot: [0.16, -0.24, -0.15], mat: accent },
            ];
            for (const t of tiles) {
                const sub = new THREE.Group();
                const body = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.66, 0.16), t.mat);
                const barH = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.08, 0.05), ivory);
                barH.position.set(0, 0.14, 0.095);
                const barV = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.34, 0.05), ivory);
                barV.position.set(0, -0.02, 0.095);
                sub.add(body, barH, barV);
                sub.position.set(t.pos[0], t.pos[1], t.pos[2]);
                sub.rotation.set(t.rot[0], t.rot[1], t.rot[2]);
                g.add(sub);
            }
            break;
        }

        case "pinpoint_dart": {
            // Concentric flat target rings pierced vertically by a machined brass/cobalt pin
            const outerRing = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.075, 14, 36), secondary);
            outerRing.rotation.x = Math.PI / 2;
            outerRing.position.y = -0.4;
            const midRing = new THREE.Mesh(new THREE.TorusGeometry(0.42, 0.065, 14, 32), primary);
            midRing.rotation.x = Math.PI / 2;
            midRing.position.y = -0.34;
            const centerPad = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.12, 22), accent);
            centerPad.position.y = -0.36;

            const pinGroup = new THREE.Group();
            const needle = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.45, 12), metal);
            needle.rotation.x = Math.PI;
            needle.position.y = -0.05;
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.04, 0.56, 14), primary);
            shaft.position.y = 0.28;
            const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 20), primary);
            head.position.y = 0.62;
            const collar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.03, 10, 22), accent);
            collar.rotation.x = Math.PI / 2;
            collar.position.y = 0.46;
            pinGroup.add(needle, shaft, head, collar);
            pinGroup.rotation.z = -0.18;
            pinGroup.position.y = 0.04;
            g.add(outerRing, midRing, centerPad, pinGroup);
            break;
        }

        case "word_ladder": {
            // Twin inclined vertical rails + 5 ascending stepped rungs
            const railL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.56, 14), secondary);
            railL.position.set(-0.38, 0.02, 0);
            const railR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 1.56, 14), secondary);
            railR.position.set(0.38, 0.02, 0);
            g.add(railL, railR);

            for (let i = 0; i < 5; i++) {
                const mat = i === 0 || i === 4 ? accent : primary;
                const rung = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.12, 0.18), mat);
                rung.position.set(0, -0.52 + i * 0.27, 0);
                g.add(rung);
            }
            g.rotation.z = -0.14;
            g.rotation.x = 0.12;
            break;
        }

        case "tetromino_stack": {
            // Interlocking 3D T-piece + L-piece + O-block sculptural cluster
            const c = 0.34;
            const addBlock = (x: number, y: number, z: number, mat: THREE.Material) => {
                const b = new THREE.Mesh(new THREE.BoxGeometry(c * 0.94, c * 0.94, c * 0.94), mat);
                b.position.set(x * c, y * c, z * c);
                g.add(b);
            };
            // T-piece (primary)
            addBlock(-1, -1.1, 0, primary);
            addBlock(0, -1.1, 0, primary);
            addBlock(1, -1.1, 0, primary);
            addBlock(0, -0.1, 0, primary);
            // L-piece (secondary)
            addBlock(-1, -0.1, 0, secondary);
            addBlock(-1, 0.9, 0, secondary);
            addBlock(-1, 1.9, 0, secondary);
            addBlock(0, 1.9, 0, secondary);
            // Z/O accent blocks
            addBlock(1, -0.1, 0, accent);
            addBlock(1, 0.9, 0, accent);
            addBlock(0, 0.9, 0, accent);
            g.position.y = -0.12;
            break;
        }

        case "chronometer": {
            // Precision machined stopwatch casing + bezel + dial + sweep hand + twin pushers
            const casing = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.72, 0.28, 32), primary);
            casing.rotation.x = Math.PI / 2;
            const bezel = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.065, 14, 36), metal);
            bezel.position.z = 0.12;
            const dial = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.05, 32), ivory);
            dial.rotation.x = Math.PI / 2;
            dial.position.z = 0.13;
            const centerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.09, 16), darkInk);
            centerHub.rotation.x = Math.PI / 2;
            centerHub.position.z = 0.18;
            const hand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.42, 0.04), accent);
            hand.position.set(0.12, 0.14, 0.19);
            hand.rotation.z = -0.62;
            const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.22, 16), metal);
            crown.position.y = 0.78;
            const pusher = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.18, 14), accent);
            pusher.position.set(0.52, 0.58, 0);
            pusher.rotation.z = -0.68;
            g.add(casing, bezel, dial, centerHub, hand, crown, pusher);
            g.position.y = -0.06;
            break;
        }

        case "sound_wave": {
            // Sculpted acoustic speaker horn + 3 concentric wave arcs
            const body = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.44), secondary);
            body.position.set(-0.46, 0, 0);
            const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.18, 0.44, 24), primary);
            horn.rotation.z = -Math.PI / 2;
            horn.position.set(-0.08, 0, 0);
            const coneInner = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), accent);
            coneInner.position.set(0.06, 0, 0);
            g.add(body, horn, coneInner);

            for (let i = 0; i < 3; i++) {
                const wave = new THREE.Mesh(
                    new THREE.TorusGeometry(0.28 + i * 0.22, 0.042, 10, 24, Math.PI * 0.78),
                    i === 1 ? accent : primary
                );
                wave.rotation.z = -Math.PI * 0.39;
                wave.position.set(0.18 + i * 0.06, 0, 0);
                g.add(wave);
            }
            break;
        }

        case "traffic_signal": {
            // Vertical architectural signal housing with 3 distinct recessed lamps (Go / Caution / Stop)
            const housing = new THREE.Mesh(new THREE.BoxGeometry(0.62, 1.46, 0.46), secondary);
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.1, 0.54), metal);
            cap.position.y = 0.74;
            g.add(housing, cap);

            const lensSpecs = [
                { y: 0.42, mat: accent },
                { y: 0.0, mat: ivory },
                { y: -0.42, mat: primary },
            ];
            for (const l of lensSpecs) {
                const hood = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.035, 10, 24), darkInk);
                hood.position.set(0, l.y, 0.23);
                const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 18, 18), l.mat);
                lamp.scale.set(1, 1, 0.55);
                lamp.position.set(0, l.y, 0.22);
                g.add(hood, lamp);
            }
            break;
        }

        case "flanker_arrows": {
            // Extruded 3D central arrow pointing right flanked by two opposing outer arrows
            const makeArrowMesh = (mat: THREE.Material, scale: number) => {
                const s = new THREE.Shape();
                s.moveTo(-0.34, -0.11);
                s.lineTo(0.04, -0.11);
                s.lineTo(0.04, -0.26);
                s.lineTo(0.38, 0);
                s.lineTo(0.04, 0.26);
                s.lineTo(0.04, 0.11);
                s.lineTo(-0.34, 0.11);
                s.closePath();
                const geo = new THREE.ExtrudeGeometry(s, {
                    depth: 0.16,
                    bevelEnabled: true,
                    bevelSize: 0.025,
                    bevelThickness: 0.025,
                    bevelSegments: 2,
                });
                geo.center();
                const mesh = new THREE.Mesh(geo, mat);
                mesh.scale.setScalar(scale);
                return mesh;
            };
            const center = makeArrowMesh(primary, 1.15);
            center.position.set(0, 0.14, 0.16);
            const left = makeArrowMesh(secondary, 0.72);
            left.position.set(-0.56, -0.22, -0.18);
            left.rotation.y = Math.PI;
            const right = makeArrowMesh(accent, 0.72);
            right.position.set(0.56, -0.22, -0.18);
            right.rotation.y = Math.PI;
            const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.1, 0.62), ivory);
            plinth.position.y = -0.56;
            g.add(center, left, right, plinth);
            break;
        }

        case "peripheral_eye": {
            // Precision optical lens barrel + outer peripheral sensor ring + glossy iris
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.055, 12, 36), accent);
            const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.56, 0.34, 28), secondary);
            barrel.rotation.x = Math.PI / 2;
            const iris = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.1, 14, 28), primary);
            iris.position.z = 0.16;
            const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.22, 20, 20), darkInk);
            pupil.scale.set(1, 1, 0.6);
            pupil.position.z = 0.18;
            g.add(ring, barrel, iris, pupil);

            // 4 peripheral tick satellites
            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
                const dot = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), primary);
                dot.position.set(Math.cos(a) * 0.76, Math.sin(a) * 0.76, 0.04);
                g.add(dot);
            }
            break;
        }

        case "whack_pedestal": {
            // 3-hole game board deck with one popping hero dome + mallet accent
            const deck = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.24, 1.3), ivory);
            deck.position.y = -0.46;
            g.add(deck);

            const holes: [number, number, boolean][] = [
                [-0.42, 0.22, false],
                [0.42, 0.24, false],
                [0.0, -0.22, true],
            ];
            for (const [x, z, popped] of holes) {
                const rim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.045, 10, 24), secondary);
                rim.rotation.x = Math.PI / 2;
                rim.position.set(x, -0.33, z);
                g.add(rim);
                if (popped) {
                    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.21, 0.44, 20), primary);
                    body.position.set(x, -0.1, z);
                    const dome = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 18), primary);
                    dome.position.set(x, 0.12, z);
                    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), accent);
                    nose.position.set(x, 0.14, z + 0.19);
                    g.add(body, dome, nose);
                } else {
                    const well = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.05, 18), darkInk);
                    well.position.set(x, -0.34, z);
                    g.add(well);
                }
            }
            break;
        }

        case "memory_cubes": {
            // 3 floating stepped cubes connected by brushed metallic neural rails
            const positions: [number, number, number, THREE.Material, number][] = [
                [-0.44, -0.32, 0.22, secondary, 0.46],
                [0.0, 0.04, 0.0, primary, 0.56],
                [0.44, 0.4, -0.22, accent, 0.44],
            ];
            for (const [x, y, z, mat, s] of positions) {
                const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat);
                cube.position.set(x, y, z);
                g.add(cube);
            }
            const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.32, 12), metal);
            rail.rotation.z = -0.82;
            rail.rotation.y = 0.42;
            rail.position.y = 0.04;
            const ring = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.032, 10, 32), metal);
            ring.rotation.x = Math.PI / 2.2;
            ring.position.y = -0.05;
            g.add(rail, ring);
            break;
        }

        case "digit_keypad": {
            // Tilted mechanical numeric pad housing with 3x3 raised keycaps + enter accent bar
            const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.24, 1.46), secondary);
            chassis.position.y = -0.28;
            g.add(chassis);

            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    const isCorner = r === 2 && c === 2;
                    const key = new THREE.Mesh(
                        new THREE.BoxGeometry(0.32, 0.18, 0.32),
                        isCorner ? accent : r === 0 && c === 1 ? primary : ivory
                    );
                    key.position.set((c - 1) * 0.4, -0.08, (r - 1) * 0.42);
                    g.add(key);
                }
            }
            g.rotation.x = 0.48;
            g.position.y = 0.08;
            break;
        }

        case "color_prism": {
            // Triangular optical prism flanked by 3 chromatic spectrum beams
            const prism = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.86, 3), ivory);
            prism.rotation.x = Math.PI / 2;
            prism.rotation.z = Math.PI / 6;
            const frame = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.035, 8, 3), metal);
            frame.rotation.z = Math.PI / 6;
            frame.position.z = 0.42;
            g.add(prism, frame);

            const bands = [
                { y: 0.26, rot: 0.24, mat: primary },
                { y: 0.0, rot: 0.0, mat: accent },
                { y: -0.26, rot: -0.24, mat: secondary },
            ];
            for (const b of bands) {
                const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.72, 12), b.mat);
                beam.rotation.z = Math.PI / 2 + b.rot;
                beam.position.set(0.56, b.y, 0);
                g.add(beam);
            }
            break;
        }

        case "ishihara_disc": {
            // Circular stone plate studded with multi-toned chromatic dot pebbles
            const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.82, 0.16, 36), ivory);
            plate.rotation.x = Math.PI / 2.2;
            g.add(plate);

            const dots: [number, number, number, THREE.Material][] = [
                [-0.36, 0.26, 0.12, primary],
                [0.02, 0.44, 0.11, primary],
                [0.36, 0.22, 0.13, secondary],
                [-0.42, -0.14, 0.12, primary],
                [-0.14, 0.08, 0.13, accent],
                [0.14, 0.14, 0.12, accent],
                [0.02, -0.1, 0.13, accent],
                [0.36, -0.2, 0.11, secondary],
                [-0.16, -0.4, 0.12, secondary],
                [0.18, -0.4, 0.11, primary],
            ];
            for (const [x, y, r, mat] of dots) {
                const pebble = new THREE.Mesh(new THREE.SphereGeometry(r, 14, 14), mat);
                pebble.scale.set(1, 1, 0.55);
                pebble.position.set(x, y * 0.96, 0.11 + y * 0.14);
                g.add(pebble);
            }
            break;
        }

        case "mental_cube": {
            // Shepard-Metzler 3D polycube arm sculpture (6 connected blocks in 3 axes)
            const s = 0.34;
            const coords: [number, number, number, THREE.Material][] = [
                [-1, -1, 0, primary],
                [0, -1, 0, primary],
                [0, 0, 0, primary],
                [0, 1, 0, accent],
                [1, 1, 0, accent],
                [1, 1, 1, secondary],
            ];
            for (const [x, y, z, mat] of coords) {
                const b = new THREE.Mesh(new THREE.BoxGeometry(s * 0.94, s * 0.94, s * 0.94), mat);
                b.position.set(x * s - 0.1, y * s - 0.05, z * s - 0.14);
                g.add(b);
            }
            const orbit = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.026, 10, 32), metal);
            orbit.rotation.x = Math.PI / 2.6;
            orbit.rotation.y = 0.3;
            g.add(orbit);
            break;
        }

        case "bullseye_target": {
            // Multi-layered concentric precision bullseye + 4 crosshair calipers
            const back = new THREE.Mesh(new THREE.CylinderGeometry(0.74, 0.78, 0.16, 36), primary);
            back.rotation.x = Math.PI / 2;
            const ring1 = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.2, 32), secondary);
            ring1.rotation.x = Math.PI / 2;
            const ring2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.24, 28), primary);
            ring2.rotation.x = Math.PI / 2;
            const core = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 18), accent);
            core.position.z = 0.14;
            g.add(back, ring1, ring2, core);

            for (let i = 0; i < 4; i++) {
                const a = (i / 4) * Math.PI * 2;
                const tick = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.26, 0.08), metal);
                tick.position.set(Math.cos(a) * 0.78, Math.sin(a) * 0.78, 0.08);
                tick.rotation.z = a + Math.PI / 2;
                g.add(tick);
            }
            break;
        }

        case "keycap_cluster": {
            // Sculpted mechanical 4-key inverted-T cluster on brushed aluminum plate
            const plate = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.16, 1.12), secondary);
            plate.position.y = -0.34;
            g.add(plate);

            const keys: [number, number, THREE.Material][] = [
                [0, -0.26, primary],
                [-0.46, 0.24, ivory],
                [0, 0.24, accent],
                [0.46, 0.24, ivory],
            ];
            for (const [x, z, mat] of keys) {
                const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.23, 0.26, 4), mat);
                cap.rotation.y = Math.PI / 4;
                cap.position.set(x, -0.14, z);
                g.add(cap);
            }
            g.rotation.x = 0.32;
            g.position.y = 0.06;
            break;
        }

        case "parabola_graph": {
            // L-shaped coordinate axes frame + glowing parabolic 3D tube curve + peak node
            const board = new THREE.Mesh(new THREE.BoxGeometry(1.44, 1.24, 0.14), ivory);
            board.position.z = -0.14;
            const axisX = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.26, 10), secondary);
            axisX.rotation.z = Math.PI / 2;
            axisX.position.set(0, -0.4, 0.02);
            const axisY = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.06, 10), secondary);
            axisY.position.set(-0.52, 0.04, 0.02);
            g.add(board, axisX, axisY);

            const pts: THREE.Vector3[] = [];
            for (let i = 0; i <= 16; i++) {
                const t = i / 16;
                const x = -0.46 + t * 0.98;
                const y = -0.3 + Math.sin(t * Math.PI) * 0.72;
                pts.push(new THREE.Vector3(x, y, 0.08));
            }
            const curve = new THREE.CatmullRomCurve3(pts);
            const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.065, 12, false), primary);
            const peak = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), accent);
            peak.position.set(0.03, 0.42, 0.11);
            g.add(tube, peak);
            break;
        }

        case "rhythm_lanes": {
            // Inclined 3-lane track with strike bar and approaching stepped note blocks
            const deck = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 1.48), secondary);
            deck.position.y = -0.18;
            const strikeBar = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.08, 0.12), accent);
            strikeBar.position.set(0, -0.09, 0.52);
            g.add(deck, strikeBar);

            const notes: [number, number, THREE.Material][] = [
                [-0.4, -0.34, primary],
                [0.0, 0.08, accent],
                [0.4, -0.16, primary],
                [-0.4, 0.46, ivory],
            ];
            for (const [x, z, mat] of notes) {
                const n = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.24), mat);
                n.position.set(x, -0.04, z);
                g.add(n);
            }
            g.rotation.x = 0.44;
            g.position.y = 0.05;
            break;
        }

        case "duel_podiums": {
            // Two opposing player podiums facing off across a central dividing lightning/arc crest
            const base = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.14, 0.92), ivory);
            base.position.y = -0.5;
            const leftP = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.62, 20), primary);
            leftP.position.set(-0.46, -0.12, 0);
            const leftCap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), primary);
            leftCap.position.set(-0.46, 0.32, 0);

            const rightP = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.34, 0.62, 20), secondary);
            rightP.position.set(0.46, -0.12, 0);
            const rightCap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), secondary);
            rightCap.position.set(0.46, 0.32, 0);

            const divider = new THREE.Mesh(new THREE.OctahedronGeometry(0.22, 0), accent);
            divider.position.set(0, 0.1, 0);
            g.add(base, leftP, leftCap, rightP, rightCap, divider);
            break;
        }

        case "solar_orbit": {
            // Luminous central sun + dual inclined metallic orbital rings + 2 orbiting planets
            const star = new THREE.Mesh(new THREE.SphereGeometry(0.34, 24, 24), secondary);
            const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.032, 12, 42), metal);
            ring1.rotation.x = Math.PI / 2.6;
            ring1.rotation.y = 0.24;
            const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.54, 0.028, 12, 36), primary);
            ring2.rotation.x = Math.PI / 1.85;
            ring2.rotation.y = -0.52;

            const planet1 = new THREE.Mesh(new THREE.SphereGeometry(0.15, 18, 18), primary);
            planet1.position.set(0.66, 0.22, 0.24);
            const planet2 = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), accent);
            planet2.position.set(-0.5, -0.14, 0.22);
            g.add(star, ring1, ring2, planet1, planet2);
            break;
        }

        case "laser_mirror": {
            // Angled precision optical mirror on stand + incident & reflected ruby laser beams
            const base = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.48, 0.14, 24), secondary);
            base.position.set(0.28, -0.52, -0.16);
            const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.88, 0.72), secondary);
            mirrorFrame.position.set(0.28, -0.02, -0.16);
            mirrorFrame.rotation.y = -0.62;
            const mirrorFace = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.76, 0.6), metal);
            mirrorFace.position.set(0.22, -0.02, -0.11);
            mirrorFace.rotation.y = -0.62;

            const beamIn = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.05, 12), accent);
            beamIn.rotation.z = Math.PI / 2 - 0.28;
            beamIn.position.set(-0.24, 0.14, 0.04);

            const beamOut = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.96, 12), primary);
            beamOut.rotation.z = Math.PI / 2 + 0.56;
            beamOut.position.set(-0.2, -0.28, 0.18);

            const hitDot = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 16), accent);
            hitDot.position.set(0.18, -0.02, -0.04);
            g.add(base, mirrorFrame, mirrorFace, beamIn, beamOut, hitDot);
            break;
        }

        case "cannon_arc": {
            // Grounded carriage + angled brass barrel + 3 ascending parabolic projectile spheres
            const wheelL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 20), secondary);
            wheelL.rotation.x = Math.PI / 2;
            wheelL.position.set(-0.44, -0.4, 0.2);
            const wheelR = wheelL.clone();
            wheelR.position.z = -0.2;
            const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.2, 0.74, 20), primary);
            barrel.rotation.z = -0.78;
            barrel.position.set(-0.26, -0.18, 0);
            const muzzle = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.035, 10, 20), metal);
            muzzle.rotation.y = Math.PI / 2;
            muzzle.rotation.x = 0.78;
            muzzle.position.set(0.0, 0.08, 0);
            g.add(wheelL, wheelR, barrel, muzzle);

            const arcPts: [number, number, number][] = [
                [0.24, 0.3, 0.09],
                [0.54, 0.36, 0.08],
                [0.78, 0.12, 0.075],
            ];
            for (const [x, y, r] of arcPts) {
                const ball = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 16), accent);
                ball.position.set(x, y, 0);
                g.add(ball);
            }
            break;
        }

        case "torque_lever": {
            // Triangular fulcrum prism balancing a calibrated lever beam + asymmetric brass weights
            const fulcrum = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.56, 3), secondary);
            fulcrum.position.y = -0.34;
            fulcrum.rotation.y = Math.PI / 6;

            const beamGroup = new THREE.Group();
            beamGroup.position.y = -0.02;
            beamGroup.rotation.z = 0.14;

            const beam = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.1, 0.24), metal);
            const heavyWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.36, 20), primary);
            heavyWeight.position.set(-0.54, 0.23, 0);
            const lightWeight = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.26, 20), accent);
            lightWeight.position.set(0.58, 0.18, 0);
            const pivotPin = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.3, 14), darkInk);
            pivotPin.rotation.x = Math.PI / 2;
            beamGroup.add(beam, heavyWeight, lightWeight, pivotPin);
            g.add(fulcrum, beamGroup);
            break;
        }

        case "study_cards":
        default: {
            // Fanned 3-card architectural index deck with color-coded divider tabs
            const cards: { pos: [number, number, number]; rot: [number, number, number]; mat: THREE.Material }[] = [
                { pos: [-0.22, -0.04, -0.22], rot: [0, 0.24, 0.18], mat: secondary },
                { pos: [0.0, 0.02, 0.0], rot: [0, 0.05, 0.03], mat: ivory },
                { pos: [0.22, 0.08, 0.2], rot: [0, -0.14, -0.1], mat: primary },
            ];
            for (const c of cards) {
                const card = new THREE.Mesh(new THREE.BoxGeometry(0.86, 1.06, 0.09), c.mat);
                card.position.set(c.pos[0], c.pos[1], c.pos[2]);
                card.rotation.set(c.rot[0], c.rot[1], c.rot[2]);
                g.add(card);
            }
            const tab = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.1), accent);
            tab.position.set(0.36, 0.62, 0.2);
            tab.rotation.set(0, -0.14, -0.1);
            g.add(tab);
            break;
        }
    }

    return g;
}

export function disposeObject3D(root: THREE.Object3D) {
    root.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
            const mesh = obj as THREE.Mesh;
            mesh.geometry?.dispose();
            if (Array.isArray(mesh.material)) {
                mesh.material.forEach((m) => m.dispose());
            } else {
                mesh.material?.dispose();
            }
        }
    });
}

// =============================================================================
// SINGLE SHARED OFFSCREEN SNAPSHOT ENGINE (ZERO WEBGL CONTEXT EXHAUSTION)
// =============================================================================

interface SnapshotEngine {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    envTarget: THREE.WebGLRenderTarget;
    size: number;
}

let engine: SnapshotEngine | null = null;
let engineFailed = false;
const dataUrlCache = new Map<string, string>();

interface QueueItem {
    key: string;
    spec: Tool3DIconSpec;
    resolve: (url: string | null) => void;
    priority: boolean;
}

const renderQueue: QueueItem[] = [];
const pendingCallbacks = new Map<string, Array<(url: string | null) => void>>();
let queueRunning = false;

function createContactShadowDisc(): THREE.Mesh {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        const grad = ctx.createRadialGradient(
            size / 2,
            size / 2,
            size * 0.06,
            size / 2,
            size / 2,
            size * 0.48
        );
        grad.addColorStop(0, "rgba(22, 22, 20, 0.28)");
        grad.addColorStop(0.55, "rgba(22, 22, 20, 0.11)");
        grad.addColorStop(1, "rgba(22, 22, 20, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    const disc = new THREE.Mesh(
        new THREE.CircleGeometry(0.95, 28),
        new THREE.MeshBasicMaterial({
            map: tex,
            transparent: true,
            depthWrite: false,
        })
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = -0.72;
    return disc;
}

function getOrCreateEngine(): SnapshotEngine | null {
    if (engineFailed || typeof document === "undefined") return null;
    if (engine) return engine;

    try {
        const isSoftware = detectIconSoftwareWebGL();
        const size = 144;
        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: !isSoftware,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
        });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.12;
        renderer.setPixelRatio(1);
        renderer.setSize(size, size, false);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();

        const pmrem = new THREE.PMREMGenerator(renderer);
        const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
        scene.environment = envTarget.texture;
        pmrem.dispose();

        // Calibrated 3-point warm/cool studio light rig
        const hemi = new THREE.HemisphereLight(0xf1f5ff, 0xd6d3cd, 1.08);
        const key = new THREE.DirectionalLight(0xfff7ed, 2.05);
        key.position.set(3.4, 4.8, 3.8);
        const rim = new THREE.DirectionalLight(0xcbd5e1, 1.0);
        rim.position.set(-3.2, 2.6, -3.4);
        const shadowDisc = createContactShadowDisc();
        scene.add(hemi, key, rim, shadowDisc);

        const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
        camera.position.set(2.25, 1.72, 2.75);
        camera.lookAt(0, -0.05, 0);

        engine = { renderer, scene, camera, envTarget, size };
        return engine;
    } catch {
        engineFailed = true;
        return null;
    }
}

function cacheKeyFor(spec: Tool3DIconSpec): string {
    return `${spec.archetype}|${spec.primaryColor}|${spec.secondaryColor}|${spec.accentColor}`;
}

export function getCachedToolIconUrl(spec: Tool3DIconSpec): string | null {
    return dataUrlCache.get(cacheKeyFor(spec)) ?? null;
}

function processQueueBatch() {
    if (renderQueue.length === 0) {
        queueRunning = false;
        return;
    }
    queueRunning = true;

    const eng = getOrCreateEngine();
    if (!eng) {
        while (renderQueue.length > 0) {
            const item = renderQueue.shift()!;
            const cbs = pendingCallbacks.get(item.key) || [];
            pendingCallbacks.delete(item.key);
            cbs.forEach((cb) => cb(null));
        }
        queueRunning = false;
        return;
    }

    const isSoftware = detectIconSoftwareWebGL();
    const batchCount = isSoftware ? 1 : 2;

    for (let i = 0; i < batchCount && renderQueue.length > 0; i++) {
        const item = renderQueue.shift()!;
        let dataUrl = dataUrlCache.get(item.key) ?? null;

        if (!dataUrl) {
            const group = buildIconSculptureGroup(item.spec);
            eng.scene.add(group);
            eng.renderer.render(eng.scene, eng.camera);
            try {
                dataUrl = eng.renderer.domElement.toDataURL("image/png");
                dataUrlCache.set(item.key, dataUrl);
            } catch {
                dataUrl = null;
            }
            eng.scene.remove(group);
            disposeObject3D(group);
        }

        const cbs = pendingCallbacks.get(item.key) || [];
        pendingCallbacks.delete(item.key);
        cbs.forEach((cb) => cb(dataUrl));
    }

    if (renderQueue.length > 0) {
        window.setTimeout(processQueueBatch, isSoftware ? 10 : 4);
    } else {
        queueRunning = false;
    }
}

/**
 * Schedules a non-blocking 3D PBR icon snapshot render using the shared WebGL context.
 * Visible icons can pass priority=true to jump ahead of offscreen items.
 */
export function requestToolIconSnapshot(
    spec: Tool3DIconSpec,
    priority = false
): Promise<string | null> {
    const key = cacheKeyFor(spec);
    const cached = dataUrlCache.get(key);
    if (cached) return Promise.resolve(cached);
    if (engineFailed || typeof window === "undefined") return Promise.resolve(null);

    return new Promise((resolve) => {
        const existing = pendingCallbacks.get(key);
        if (existing) {
            existing.push(resolve);
            return;
        }
        pendingCallbacks.set(key, [resolve]);
        const entry: QueueItem = { key, spec, resolve, priority };
        if (priority) {
            renderQueue.unshift(entry);
        } else {
            renderQueue.push(entry);
        }
        if (!queueRunning) {
            window.setTimeout(processQueueBatch, 4);
        }
    });
}
