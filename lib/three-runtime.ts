import * as THREE from "three";

export function detectSoftwareGl(): boolean {
    if (typeof document === "undefined") return false;
    try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2") || probe.getContext("webgl");
        if (!gl) return true;
        const dbg = gl.getExtension("WEBGL_debug_renderer_info");
        const rendererStr = dbg
            ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "")
            : String(gl.getParameter(gl.RENDERER) || "");
        const lose = gl.getExtension("WEBGL_lose_context");
        lose?.loseContext();
        return /swiftshader|llvmpipe|software|mesa|microsoft basic/i.test(rendererStr);
    } catch {
        return false;
    }
}

export function createFramePacer(renderer: THREE.WebGLRenderer, isSoftwareGl: boolean) {
    let cancelled = false;
    let rafId: number | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    const schedule = (fn: () => void) => {
        if (cancelled) return;
        if (!isSoftwareGl) {
            rafId = requestAnimationFrame(fn);
            return;
        }
        const gl = renderer.getContext() as WebGL2RenderingContext;
        if (typeof gl.fenceSync === "function" && typeof gl.clientWaitSync === "function") {
            const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
            gl.flush();
            const poll = () => {
                if (cancelled) {
                    if (sync) gl.deleteSync(sync);
                    return;
                }
                if (!sync) {
                    rafId = requestAnimationFrame(fn);
                    return;
                }
                const status = gl.clientWaitSync(sync, 0, 0);
                if (status === gl.ALREADY_SIGNALED || status === gl.CONDITION_SATISFIED) {
                    gl.deleteSync(sync);
                    rafId = requestAnimationFrame(fn);
                } else {
                    timerId = setTimeout(poll, 4);
                }
            };
            timerId = setTimeout(poll, 4);
        } else {
            timerId = setTimeout(() => {
                if (!cancelled) rafId = requestAnimationFrame(fn);
            }, 16);
        }
    };

    const cancel = () => {
        cancelled = true;
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (timerId !== null) clearTimeout(timerId);
    };

    return { schedule, cancel };
}

export function createPlanetTexture(
    kind: "earth" | "mars" | "saturn" | "sun",
    maxAnisotropy: number
): THREE.CanvasTexture {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (ctx) {
        if (kind === "earth") {
            ctx.fillStyle = "#1D4ED8";
            ctx.fillRect(0, 0, 512, 256);
            // Stylized continents
            ctx.fillStyle = "#16A34A";
            const blobs = [
                [95, 90, 58, 34],
                [150, 155, 36, 42],
                [265, 80, 74, 44],
                [290, 150, 44, 46],
                [395, 115, 62, 36],
                [430, 185, 36, 22],
            ];
            blobs.forEach(([x, y, rx, ry]) => {
                ctx.beginPath();
                ctx.ellipse(x, y, rx, ry, 0.2, 0, Math.PI * 2);
                ctx.fill();
            });
            // Polar caps + cloud wisps
            ctx.fillStyle = "rgba(248, 250, 252, 0.85)";
            ctx.fillRect(0, 0, 512, 18);
            ctx.fillRect(0, 238, 512, 18);
            ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
            for (let i = 0; i < 14; i++) {
                ctx.beginPath();
                ctx.ellipse((i * 41) % 512, 34 + ((i * 29) % 185), 42, 8, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (kind === "mars") {
            const g = ctx.createLinearGradient(0, 0, 0, 256);
            g.addColorStop(0, "#EA580C");
            g.addColorStop(0.5, "#C2410C");
            g.addColorStop(1, "#9A3412");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 256);
            ctx.fillStyle = "rgba(67, 20, 7, 0.32)";
            for (let i = 0; i < 22; i++) {
                ctx.beginPath();
                ctx.arc((i * 57) % 512, (i * 37) % 256, 8 + (i % 16), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.fillStyle = "rgba(255, 247, 237, 0.7)";
            ctx.fillRect(0, 0, 512, 12);
            ctx.fillRect(0, 244, 512, 12);
        } else if (kind === "saturn") {
            const bands = ["#FDE68A", "#F59E0B", "#FEF3C7", "#D97706", "#FDE68A", "#B45309", "#FEF3C7"];
            const bandH = 256 / bands.length;
            bands.forEach((col, idx) => {
                ctx.fillStyle = col;
                ctx.fillRect(0, idx * bandH, 512, bandH + 1);
            });
        } else {
            const g = ctx.createRadialGradient(256, 128, 12, 256, 128, 256);
            g.addColorStop(0, "#FEF9C3");
            g.addColorStop(0.5, "#F59E0B");
            g.addColorStop(1, "#EA580C");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 512, 256);
            ctx.fillStyle = "rgba(254, 240, 138, 0.4)";
            for (let i = 0; i < 36; i++) {
                ctx.beginPath();
                ctx.arc((i * 73) % 512, (i * 43) % 256, 6 + (i % 14), 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = Math.min(8, maxAnisotropy || 1);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
}
