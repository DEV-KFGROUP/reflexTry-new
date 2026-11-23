"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RotateCw, RotateCcw, ChevronsDown, Repeat } from "lucide-react";

const COLS = 10;
const ROWS = 20;
const CELL = 26;

type PieceKey = "I" | "O" | "T" | "S" | "Z" | "J" | "L";

const SHAPES: Record<PieceKey, number[][]> = {
    I: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    O: [
        [1, 1],
        [1, 1],
    ],
    T: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    S: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    Z: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    J: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    L: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
};

const COLORS: Record<PieceKey, string> = {
    I: "#06B6D4",
    O: "#EAB308",
    T: "#8B5CF6",
    S: "#10B981",
    Z: "#EF4444",
    J: "#3B82F6",
    L: "#F97316",
};

const PIECE_KEYS: PieceKey[] = ["I", "O", "T", "S", "Z", "J", "L"];
const HIGH_SCORE_KEY = "reflextry_tetris_best_v1";

function rotateMatrix(m: number[][]): number[][] {
    const n = m.length;
    return Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => m[n - 1 - c][r]));
}

function makeBag(): PieceKey[] {
    const bag = [...PIECE_KEYS];
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag;
}

function MiniPiecePreview({ pieceKey }: { pieceKey: PieceKey | null }) {
    if (!pieceKey) {
        return <div className="h-14 flex items-center justify-center text-xs text-slate-400 font-mono">Empty</div>;
    }
    const shape = SHAPES[pieceKey];
    const color = COLORS[pieceKey];
    return (
        <div className="h-14 flex items-center justify-center">
            <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${shape[0].length}, 14px)` }}>
                {shape.flatMap((row, r) =>
                    row.map((val, c) => (
                        <div
                            key={`${r}-${c}`}
                            className="w-3.5 h-3.5 rounded-[3px]"
                            style={{ backgroundColor: val ? color : "transparent" }}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

export default function TetrisGame() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [phase, setPhase] = useState<"ready" | "playing" | "paused" | "gameover">("ready");
    const [score, setScore] = useState(0);
    const [bestScore, setBestScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [level, setLevel] = useState(1);
    const [holdPiece, setHoldPiece] = useState<PieceKey | null>(null);
    const [nextQueue, setNextQueue] = useState<PieceKey[]>([]);

    const stateRef = useRef<{
        board: (string | null)[][];
        active: { key: PieceKey; shape: number[][]; x: number; y: number } | null;
        bag: PieceKey[];
        hold: PieceKey | null;
        canHold: boolean;
        score: number;
        lines: number;
        level: number;
        phase: "ready" | "playing" | "paused" | "gameover";
        dropAcc: number;
    }>({
        board: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
        active: null,
        bag: [],
        hold: null,
        canHold: true,
        score: 0,
        lines: 0,
        level: 1,
        phase: "ready",
        dropAcc: 0,
    });

    useEffect(() => {
        try {
            const saved = Number(localStorage.getItem(HIGH_SCORE_KEY) || "0");
            if (saved > 0) setBestScore(saved);
        } catch {
            // ignore
        }
    }, []);

    const beep = useCallback((freq: number, dur = 0.06) => {
        try {
            const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
            if (!Ctx) return;
            const ctx = new Ctx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + dur);
        } catch {
            // ignore
        }
    }, []);

    const collides = (board: (string | null)[][], shape: number[][], px: number, py: number) => {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) continue;
                const nx = px + c;
                const ny = py + r;
                if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
                if (ny >= 0 && board[ny][nx]) return true;
            }
        }
        return false;
    };

    const pullNextPiece = useCallback(() => {
        const st = stateRef.current;
        if (st.bag.length < 5) st.bag.push(...makeBag());
        const key = st.bag.shift()!;
        setNextQueue(st.bag.slice(0, 3));
        const shape = SHAPES[key].map((r) => [...r]);
        const x = Math.floor((COLS - shape[0].length) / 2);
        const y = -1;
        if (collides(st.board, shape, x, y + 1)) {
            st.phase = "gameover";
            setPhase("gameover");
            beep(160, 0.25);
            return;
        }
        st.active = { key, shape, x, y };
        st.canHold = true;
    }, [beep]);

    const lockPiece = useCallback(() => {
        const st = stateRef.current;
        if (!st.active) return;
        const { key, shape, x, y } = st.active;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[r].length; c++) {
                if (!shape[r][c]) continue;
                if (y + r < 0) {
                    st.phase = "gameover";
                    setPhase("gameover");
                    return;
                }
                st.board[y + r][x + c] = COLORS[key];
            }
        }

        let cleared = 0;
        for (let r = ROWS - 1; r >= 0; r--) {
            if (st.board[r].every((cell) => cell !== null)) {
                st.board.splice(r, 1);
                st.board.unshift(Array(COLS).fill(null));
                cleared += 1;
                r += 1;
            }
        }

        if (cleared > 0) {
            const pts = [0, 100, 300, 500, 800][cleared] * st.level;
            st.score += pts;
            st.lines += cleared;
            st.level = Math.floor(st.lines / 10) + 1;
            setScore(st.score);
            setLines(st.lines);
            setLevel(st.level);
            beep(cleared === 4 ? 720 : 520, 0.11);
            setBestScore((prev) => {
                const next = Math.max(prev, st.score);
                try {
                    localStorage.setItem(HIGH_SCORE_KEY, String(next));
                } catch {
                    // ignore
                }
                return next;
            });
        } else {
            beep(260, 0.04);
        }

        pullNextPiece();
    }, [beep, pullNextPiece]);

    const move = useCallback(
        (dx: number, dy: number) => {
            const st = stateRef.current;
            if (st.phase !== "playing" || !st.active) return false;
            if (!collides(st.board, st.active.shape, st.active.x + dx, st.active.y + dy)) {
                st.active.x += dx;
                st.active.y += dy;
                return true;
            }
            if (dy > 0) lockPiece();
            return false;
        },
        [lockPiece]
    );

    const rotate = useCallback(() => {
        const st = stateRef.current;
        if (st.phase !== "playing" || !st.active) return;
        const rotated = rotateMatrix(st.active.shape);
        // SRS-style horizontal wall kick offsets
        const kicks = [0, -1, 1, -2, 2];
        for (const offset of kicks) {
            if (!collides(st.board, rotated, st.active.x + offset, st.active.y)) {
                st.active.shape = rotated;
                st.active.x += offset;
                beep(420, 0.03);
                return;
            }
        }
    }, [beep]);

    const hardDrop = useCallback(() => {
        const st = stateRef.current;
        if (st.phase !== "playing" || !st.active) return;
        let dropped = 0;
        while (!collides(st.board, st.active.shape, st.active.x, st.active.y + 1)) {
            st.active.y += 1;
            dropped += 1;
        }
        st.score += dropped * 2;
        setScore(st.score);
        lockPiece();
    }, [lockPiece]);

    const triggerHold = useCallback(() => {
        const st = stateRef.current;
        if (st.phase !== "playing" || !st.active || !st.canHold) return;
        const currentKey = st.active.key;
        if (st.hold) {
            const swapKey = st.hold;
            st.hold = currentKey;
            const shape = SHAPES[swapKey].map((r) => [...r]);
            st.active = { key: swapKey, shape, x: Math.floor((COLS - shape[0].length) / 2), y: -1 };
        } else {
            st.hold = currentKey;
            pullNextPiece();
        }
        st.canHold = false;
        setHoldPiece(st.hold);
        beep(360, 0.04);
    }, [beep, pullNextPiece]);

    const startGame = useCallback(() => {
        const st = stateRef.current;
        st.board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
        st.bag = [...makeBag(), ...makeBag()];
        st.hold = null;
        st.canHold = true;
        st.score = 0;
        st.lines = 0;
        st.level = 1;
        st.dropAcc = 0;
        st.phase = "playing";
        setScore(0);
        setLines(0);
        setLevel(1);
        setHoldPiece(null);
        setPhase("playing");
        pullNextPiece();
    }, [pullNextPiece]);

    const togglePause = useCallback(() => {
        const st = stateRef.current;
        if (st.phase === "playing") {
            st.phase = "paused";
            setPhase("paused");
        } else if (st.phase === "paused") {
            st.phase = "playing";
            setPhase("playing");
        }
    }, []);

    // Keyboard bindings
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (stateRef.current.phase !== "playing" && e.key.toLowerCase() !== "p") return;
            if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a") {
                e.preventDefault();
                move(-1, 0);
            } else if (e.key === "ArrowRight" || e.key.toLowerCase() === "d") {
                e.preventDefault();
                move(1, 0);
            } else if (e.key === "ArrowDown" || e.key.toLowerCase() === "s") {
                e.preventDefault();
                move(0, 1);
            } else if (e.key === "ArrowUp" || e.key.toLowerCase() === "w" || e.key.toLowerCase() === "x") {
                e.preventDefault();
                rotate();
            } else if (e.code === "Space") {
                e.preventDefault();
                hardDrop();
            } else if (e.key.toLowerCase() === "c" || e.key === "Shift") {
                e.preventDefault();
                triggerHold();
            } else if (e.key.toLowerCase() === "p") {
                togglePause();
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [move, rotate, hardDrop, triggerHold, togglePause]);

    // Main 60fps Canvas Loop
    useEffect(() => {
        let raf = 0;
        let lastTime = performance.now();

        const loop = (now: number) => {
            const dt = Math.min(0.1, (now - lastTime) / 1000);
            lastTime = now;
            const st = stateRef.current;

            if (st.phase === "playing") {
                const dropInterval = Math.max(0.08, 0.82 * Math.pow(0.86, st.level - 1));
                st.dropAcc += dt;
                if (st.dropAcc >= dropInterval) {
                    st.dropAcc = 0;
                    move(0, 1);
                }
            }

            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext("2d");
                if (ctx) {
                    ctx.fillStyle = "#0F172A";
                    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL);

                    // Subtle playfield grid
                    ctx.strokeStyle = "rgba(148,163,184,0.12)";
                    ctx.lineWidth = 1;
                    for (let c = 0; c <= COLS; c++) {
                        ctx.beginPath();
                        ctx.moveTo(c * CELL, 0);
                        ctx.lineTo(c * CELL, ROWS * CELL);
                        ctx.stroke();
                    }
                    for (let r = 0; r <= ROWS; r++) {
                        ctx.beginPath();
                        ctx.moveTo(0, r * CELL);
                        ctx.lineTo(COLS * CELL, r * CELL);
                        ctx.stroke();
                    }

                    const drawBlock = (cx: number, cy: number, color: string, alpha = 1) => {
                        if (cy < 0) return;
                        ctx.globalAlpha = alpha;
                        ctx.fillStyle = color;
                        ctx.fillRect(cx * CELL + 1.5, cy * CELL + 1.5, CELL - 3, CELL - 3);
                        ctx.fillStyle = "rgba(255,255,255,0.22)";
                        ctx.fillRect(cx * CELL + 2, cy * CELL + 2, CELL - 4, 4);
                        ctx.globalAlpha = 1;
                    };

                    // Locked blocks
                    for (let r = 0; r < ROWS; r++) {
                        for (let c = 0; c < COLS; c++) {
                            const col = st.board[r][c];
                            if (col) drawBlock(c, r, col);
                        }
                    }

                    // Active piece + Ghost preview
                    if (st.active) {
                        const { key, shape, x, y } = st.active;
                        let ghostY = y;
                        while (!collides(st.board, shape, x, ghostY + 1)) ghostY += 1;

                        for (let r = 0; r < shape.length; r++) {
                            for (let c = 0; c < shape[r].length; c++) {
                                if (!shape[r][c]) continue;
                                drawBlock(x + c, ghostY + r, COLORS[key], 0.22);
                                drawBlock(x + c, y + r, COLORS[key], 1);
                            }
                        }
                    }
                }
            }
            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [move]);

    return (
        <div
            data-capture-keys={phase === "playing" ? "s" : undefined}
            className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6"
        >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Info: Hold + Controls */}
                <div className="md:col-span-3 space-y-4 order-2 md:order-1">
                    <div className="border border-[#E6E3DB] rounded-xl p-3.5 bg-[#FAF9F6]">
                        <p className="text-xs font-mono font-semibold text-[#78756C] mb-2">HOLD (C / Shift)</p>
                        <MiniPiecePreview pieceKey={holdPiece} />
                    </div>

                    <div className="border border-[#E6E3DB] rounded-xl p-3.5 space-y-2 text-xs text-[#57554E]">
                        <p className="font-semibold text-[#161614]">Controls</p>
                        <p className="font-mono">← / → : Move</p>
                        <p className="font-mono">↑ / W : Rotate</p>
                        <p className="font-mono">↓ : Soft Drop</p>
                        <p className="font-mono">Space : Hard Drop</p>
                        <p className="font-mono">C / Shift : Hold</p>
                        <p className="font-mono">P : Pause</p>
                    </div>
                </div>

                {/* Center Canvas Board */}
                <div className="md:col-span-6 flex flex-col items-center gap-4 order-1 md:order-2 w-full min-w-0">
                    <div className="relative w-full max-w-[264px] rounded-xl overflow-hidden border-2 border-slate-800 shadow-lg bg-slate-950">
                        <canvas ref={canvasRef} width={COLS * CELL} height={ROWS * CELL} className="block w-full h-auto" />

                        {phase !== "playing" && (
                            <div className="absolute inset-0 bg-slate-950/85 flex flex-col items-center justify-center p-6 text-center gap-4">
                                <p className="text-2xl font-extrabold text-white tracking-tight">
                                    {phase === "ready" ? "Classic Tetris" : phase === "paused" ? "Game Paused" : "Game Over"}
                                </p>
                                {phase === "gameover" && (
                                    <p className="text-sm font-mono text-sky-300">
                                        Final Score: {score.toLocaleString()} · {lines} Lines
                                    </p>
                                )}
                                <button
                                    type="button"
                                    onClick={phase === "paused" ? togglePause : startGame}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-bold cursor-pointer"
                                >
                                    <Play className="w-4 h-4 fill-current" aria-hidden="true" />
                                    <span>{phase === "paused" ? "Resume" : phase === "ready" ? "Start Game" : "Play Again"}</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Touch & Click Controls Bar */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => move(-1, 0)}
                            aria-label="Move Left"
                            className="p-3 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => move(0, 1)}
                            aria-label="Soft Drop"
                            className="p-3 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] cursor-pointer"
                        >
                            <ArrowDown className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={() => move(1, 0)}
                            aria-label="Move Right"
                            className="p-3 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] cursor-pointer"
                        >
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={rotate}
                            aria-label="Rotate Piece"
                            className="p-3 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-800 cursor-pointer"
                        >
                            <RotateCw className="w-4 h-4" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            onClick={hardDrop}
                            aria-label="Hard Drop"
                            className="px-3.5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                            <ChevronsDown className="w-4 h-4" aria-hidden="true" />
                            <span>Drop</span>
                        </button>
                        <button
                            type="button"
                            onClick={triggerHold}
                            aria-label="Hold Piece"
                            className="p-3 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] cursor-pointer"
                        >
                            <Repeat className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                {/* Right HUD: Score, Lines, Level, Next Queue */}
                <div className="md:col-span-3 space-y-4 order-3">
                    <div className="border border-[#E6E3DB] rounded-xl p-4 space-y-3 bg-[#FAF9F6]">
                        <div>
                            <p className="text-xs text-[#78756C]">Score</p>
                            <p className="text-2xl font-extrabold font-mono tabular-nums text-[#161614]">{score.toLocaleString()}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E6E3DB]">
                            <div>
                                <p className="text-xs text-[#78756C]">Level</p>
                                <p className="text-lg font-bold font-mono tabular-nums text-blue-700">{level}</p>
                            </div>
                            <div>
                                <p className="text-xs text-[#78756C]">Lines</p>
                                <p className="text-lg font-bold font-mono tabular-nums text-[#161614]">{lines}</p>
                            </div>
                        </div>
                        <div className="pt-2 border-t border-[#E6E3DB]">
                            <p className="text-xs text-[#78756C]">Best Score</p>
                            <p className="text-sm font-bold font-mono tabular-nums text-amber-700">{bestScore.toLocaleString()}</p>
                        </div>
                    </div>

                    <div className="border border-[#E6E3DB] rounded-xl p-3.5 bg-[#FAF9F6] space-y-2">
                        <p className="text-xs font-mono font-semibold text-[#78756C]">NEXT</p>
                        <div className="space-y-2">
                            {nextQueue.slice(0, 3).map((pk, idx) => (
                                <div key={`${pk}-${idx}`} className="bg-white border border-[#E6E3DB]/80 rounded-lg">
                                    <MiniPiecePreview pieceKey={pk} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={togglePause}
                            disabled={phase === "ready" || phase === "gameover"}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] disabled:opacity-40 text-xs font-semibold text-[#161614] cursor-pointer"
                        >
                            {phase === "paused" ? <Play className="w-3.5 h-3.5" aria-hidden="true" /> : <Pause className="w-3.5 h-3.5" aria-hidden="true" />}
                            <span>{phase === "paused" ? "Resume" : "Pause"}</span>
                        </button>
                        <button
                            type="button"
                            onClick={startGame}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-xs font-semibold text-[#161614] cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Restart</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
