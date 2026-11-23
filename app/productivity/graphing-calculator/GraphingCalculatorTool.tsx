"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Calculator, LineChart, Plus, Trash2, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { compileMathExpression, safeEvalMath } from "@/lib/math/safe-eval";

interface PlotExpr {
    id: string;
    expr: string;
    color: string;
    enabled: boolean;
}

const DEFAULT_PLOTS: PlotExpr[] = [
    { id: "f1", expr: "sin(x)", color: "#2563EB", enabled: true },
    { id: "f2", expr: "0.25 * x^2 - 2", color: "#DC2626", enabled: true },
    { id: "f3", expr: "cos(2*x)", color: "#059669", enabled: false },
];

export default function GraphingCalculatorTool() {
    const [activeTab, setActiveTab] = useState<"graph" | "scientific">("graph");
    const [plots, setPlots] = useState<PlotExpr[]>(DEFAULT_PLOTS);
    const [xRange, setXRange] = useState(10); // -xRange to +xRange
    const [centerX, setCenterX] = useState(0);
    const [centerY, setCenterY] = useState(0);
    const [useDeg, setUseDeg] = useState(false);
    const [hoverPt, setHoverPt] = useState<{ x: number; y: number } | null>(null);

    // Scientific calculator state
    const [calcExpr, setCalcExpr] = useState("sqrt(144) + sin(pi/2) * 5");
    const [calcHistory, setCalcHistory] = useState<{ expr: string; result: string }[]>([]);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const calcResult = useMemo(() => {
        const val = safeEvalMath(calcExpr, 0, useDeg);
        if (Number.isNaN(val)) return "—";
        return Number(val.toPrecision(10)).toString();
    }, [calcExpr, useDeg]);

    // Render 2D Coordinate Graph
    useEffect(() => {
        if (activeTab !== "graph") return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = canvas.clientWidth || 720;
        const h = canvas.clientHeight || 420;
        canvas.width = Math.round(w * dpr);
        canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const yRange = (xRange * h) / w;
        const xMin = centerX - xRange;
        const xMax = centerX + xRange;
        const yMin = centerY - yRange;
        const yMax = centerY + yRange;

        const toPxX = (x: number) => ((x - xMin) / (xMax - xMin)) * w;
        const toPxY = (y: number) => h - ((y - yMin) / (yMax - yMin)) * h;

        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, w, h);

        // Adaptive grid spacing
        const rawStep = xRange / 5;
        const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
        const step = rawStep / mag >= 5 ? 5 * mag : rawStep / mag >= 2 ? 2 * mag : mag;

        ctx.strokeStyle = "#E2E8F0";
        ctx.lineWidth = 1;
        const startX = Math.floor(xMin / step) * step;
        for (let gx = startX; gx <= xMax; gx += step) {
            const px = toPxX(gx);
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();
        }
        const startY = Math.floor(yMin / step) * step;
        for (let gy = startY; gy <= yMax; gy += step) {
            const py = toPxY(gy);
            ctx.beginPath();
            ctx.moveTo(0, py);
            ctx.lineTo(w, py);
            ctx.stroke();
        }

        // Main Axes
        ctx.strokeStyle = "#475569";
        ctx.lineWidth = 1.6;
        const axisY = toPxY(0);
        const axisX = toPxX(0);
        if (axisY >= 0 && axisY <= h) {
            ctx.beginPath();
            ctx.moveTo(0, axisY);
            ctx.lineTo(w, axisY);
            ctx.stroke();
        }
        if (axisX >= 0 && axisX <= w) {
            ctx.beginPath();
            ctx.moveTo(axisX, 0);
            ctx.lineTo(axisX, h);
            ctx.stroke();
        }

        // Axis tick labels
        ctx.fillStyle = "#64748B";
        ctx.font = "11px ui-monospace, monospace";
        for (let gx = startX; gx <= xMax; gx += step) {
            if (Math.abs(gx) < step * 0.01) continue;
            const px = toPxX(gx);
            const labelY = Math.min(h - 8, Math.max(14, axisY + 14));
            ctx.fillText(Number(gx.toFixed(2)).toString(), px + 3, labelY);
        }
        for (let gy = startY; gy <= yMax; gy += step) {
            if (Math.abs(gy) < step * 0.01) continue;
            const py = toPxY(gy);
            const labelX = Math.min(w - 32, Math.max(6, axisX + 5));
            ctx.fillText(Number(gy.toFixed(2)).toString(), labelX, py - 4);
        }

        // Pre-compile each enabled function once before sampling pixels
        const compiledPlots = plots.map((p) => ({
            plot: p,
            evaluate: p.enabled && p.expr.trim() ? compileMathExpression(p.expr, useDeg) : null,
        }));

        // Plot each enabled function
        compiledPlots.forEach(({ plot: p, evaluate }) => {
            if (!evaluate) return;
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            let penDown = false;
            let prevY = 0;

            for (let px = 0; px <= w; px += 1.5) {
                const x = xMin + (px / w) * (xMax - xMin);
                const y = evaluate(x);
                if (Number.isNaN(y) || Math.abs(y) > yRange * 20) {
                    penDown = false;
                    continue;
                }
                const py = toPxY(y);
                if (penDown && Math.abs(py - prevY) > h * 1.2) {
                    penDown = false;
                }
                if (!penDown) {
                    ctx.moveTo(px, py);
                    penDown = true;
                } else {
                    ctx.lineTo(px, py);
                }
                prevY = py;
            }
            ctx.stroke();
        });

        // Hover crosshair & evaluated points
        if (hoverPt) {
            const px = toPxX(hoverPt.x);
            ctx.strokeStyle = "rgba(15, 23, 42, 0.25)";
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, 0);
            ctx.lineTo(px, h);
            ctx.stroke();
            ctx.setLineDash([]);

            compiledPlots.forEach(({ plot: p, evaluate }) => {
                if (!evaluate) return;
                const y = evaluate(hoverPt.x);
                if (Number.isNaN(y)) return;
                const py = toPxY(y);
                if (py >= -10 && py <= h + 10) {
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(px, py, 5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.strokeStyle = "#FFFFFF";
                    ctx.lineWidth = 2;
                    ctx.stroke();
                }
            });
        }
    }, [activeTab, plots, xRange, centerX, centerY, useDeg, hoverPt]);

    const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const yRange = (xRange * rect.height) / rect.width;
        const x = centerX - xRange + (px / rect.width) * (2 * xRange);
        const y = centerY + yRange - (py / rect.height) * (2 * yRange);
        setHoverPt({ x, y });
    };

    const addPlot = () => {
        if (plots.length >= 5) return;
        const palette = ["#2563EB", "#DC2626", "#059669", "#7C3AED", "#D97706"];
        setPlots((prev) => [
            ...prev,
            { id: `f${Date.now()}`, expr: "x", color: palette[prev.length % palette.length], enabled: true },
        ]);
    };

    const appendCalc = (token: string) => {
        if (token === "C") {
            setCalcExpr("");
        } else if (token === "⌫") {
            setCalcExpr((prev) => prev.slice(0, -1));
        } else if (token === "=") {
            if (calcResult !== "—" && calcExpr.trim()) {
                setCalcHistory((prev) => [{ expr: calcExpr, result: calcResult }, ...prev.slice(0, 9)]);
                setCalcExpr(calcResult);
            }
        } else {
            setCalcExpr((prev) => prev + token);
        }
    };

    const sciButtons = [
        ["sin(", "cos(", "tan(", "pi", "C"],
        ["sqrt(", "log(", "ln(", "^", "⌫"],
        ["7", "8", "9", "/", "("],
        ["4", "5", "6", "*", ")"],
        ["1", "2", "3", "-", "e"],
        ["0", ".", "abs(", "+", "="],
    ];

    return (
        <div className="bg-white border border-[#E6E3DB] rounded-2xl overflow-hidden">
            {/* Toolbar */}
            <div className="px-5 py-3.5 border-b border-[#E6E3DB] flex flex-wrap items-center justify-between gap-3 bg-[#FAF9F6]/70">
                <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
                    <button
                        type="button"
                        onClick={() => setActiveTab("graph")}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            activeTab === "graph" ? "bg-white text-[#161614] shadow-xs" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        <LineChart className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Function Grapher</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab("scientific")}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                            activeTab === "scientific" ? "bg-white text-[#161614] shadow-xs" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        <Calculator className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Scientific Keypad</span>
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setUseDeg((d) => !d)}
                        className="px-3 py-1.5 rounded-lg border border-[#D8D4C9] bg-white text-xs font-mono font-semibold text-[#3F3E39] hover:bg-[#FAF9F6] cursor-pointer"
                    >
                        Angle: {useDeg ? "DEG" : "RAD"}
                    </button>
                    {activeTab === "graph" && (
                        <>
                            <button
                                type="button"
                                onClick={() => setXRange((r) => Math.max(1, r * 0.7))}
                                aria-label="Zoom In"
                                className="p-1.5 rounded-lg border border-[#D8D4C9] bg-white text-[#3F3E39] hover:bg-[#FAF9F6] cursor-pointer"
                            >
                                <ZoomIn className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setXRange((r) => Math.min(100, r * 1.4))}
                                aria-label="Zoom Out"
                                className="p-1.5 rounded-lg border border-[#D8D4C9] bg-white text-[#3F3E39] hover:bg-[#FAF9F6] cursor-pointer"
                            >
                                <ZoomOut className="w-4 h-4" aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setXRange(10);
                                    setCenterX(0);
                                    setCenterY(0);
                                }}
                                aria-label="Reset View"
                                className="p-1.5 rounded-lg border border-[#D8D4C9] bg-white text-[#3F3E39] hover:bg-[#FAF9F6] cursor-pointer"
                            >
                                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </>
                    )}
                </div>
            </div>

            {activeTab === "graph" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Left Expressions Panel */}
                    <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E6E3DB] p-4 space-y-3 bg-[#FAF9F6]/40">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#3F3E39]">Functions y = f(x)</p>
                            <button
                                type="button"
                                onClick={addPlot}
                                disabled={plots.length >= 5}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 disabled:opacity-40 cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Add Curve</span>
                            </button>
                        </div>

                        <div className="space-y-2.5">
                            {plots.map((p, idx) => {
                                const valAtHover = hoverPt ? safeEvalMath(p.expr, hoverPt.x, useDeg) : NaN;
                                return (
                                    <div key={p.id} className="bg-white border border-[#E6E3DB] rounded-xl p-2.5 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setPlots((prev) =>
                                                        prev.map((item) => (item.id === p.id ? { ...item, enabled: !item.enabled } : item))
                                                    )
                                                }
                                                aria-label="Toggle curve visibility"
                                                className="w-4 h-4 rounded-sm shrink-0 border border-[#D8D4C9] cursor-pointer"
                                                style={{ backgroundColor: p.enabled ? p.color : "transparent" }}
                                            />
                                            <span className="text-xs font-mono text-[#78756C]">y{idx + 1} =</span>
                                            <input
                                                type="text"
                                                value={p.expr}
                                                onChange={(e) =>
                                                    setPlots((prev) =>
                                                        prev.map((item) => (item.id === p.id ? { ...item, expr: e.target.value } : item))
                                                    )
                                                }
                                                placeholder="sin(x) + 0.5*x"
                                                className="flex-1 min-w-0 font-mono text-sm text-[#161614] focus:outline-none"
                                            />
                                            {plots.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setPlots((prev) => prev.filter((item) => item.id !== p.id))}
                                                    aria-label="Remove curve"
                                                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
                                                </button>
                                            )}
                                        </div>
                                        {hoverPt && p.enabled && !Number.isNaN(valAtHover) && (
                                            <p className="text-[11px] font-mono tabular-nums text-[#78756C] pl-6">
                                                f({hoverPt.x.toFixed(2)}) = <strong className="text-[#161614]">{valAtHover.toFixed(3)}</strong>
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-2 border-t border-[#E6E3DB] space-y-1.5">
                            <p className="text-xs font-medium text-[#78756C]">Quick Presets</p>
                            <div className="flex flex-wrap gap-1.5">
                                {[
                                    { label: "Parabola", expr: "0.5*x^2 - 3" },
                                    { label: "Damped Wave", expr: "3*exp(-0.2*abs(x))*cos(2*x)" },
                                    { label: "Cubic", expr: "0.1*x^3 - x" },
                                    { label: "Bell Curve", expr: "4*exp(-0.3*x^2)" },
                                ].map((preset) => (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() =>
                                            setPlots((prev) =>
                                                prev.map((item, i) => (i === 0 ? { ...item, expr: preset.expr, enabled: true } : item))
                                            )
                                        }
                                        className="px-2.5 py-1 rounded-md border border-[#E6E3DB] bg-white text-xs text-[#3F3E39] hover:border-blue-400 hover:text-blue-700 cursor-pointer"
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Interactive Canvas */}
                    <div className="lg:col-span-8 relative bg-white">
                        <canvas
                            ref={canvasRef}
                            onMouseMove={handleCanvasMove}
                            onMouseLeave={() => setHoverPt(null)}
                            className="w-full h-[420px] sm:h-[460px] block cursor-crosshair"
                        />
                        <div className="px-4 py-2 border-t border-[#EFECE4] flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#78756C] tabular-nums">
                            <span>
                                Domain: [{(centerX - xRange).toFixed(1)}, {(centerX + xRange).toFixed(1)}]
                            </span>
                            <span>
                                {hoverPt ? `Cursor (${hoverPt.x.toFixed(2)}, ${hoverPt.y.toFixed(2)})` : "Hover graph to inspect exact (x, y) values"}
                            </span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7 space-y-4">
                        <div className="bg-slate-900 rounded-xl p-4 text-right space-y-1">
                            <input
                                type="text"
                                value={calcExpr}
                                onChange={(e) => setCalcExpr(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && appendCalc("=")}
                                aria-label="Calculator expression"
                                className="w-full bg-transparent text-right font-mono text-base text-slate-300 focus:outline-none"
                            />
                            <p className="text-3xl font-extrabold font-mono tabular-nums text-white truncate">
                                = {calcResult}
                            </p>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            {sciButtons.flat().map((btn) => (
                                <button
                                    key={btn}
                                    type="button"
                                    onClick={() => appendCalc(btn)}
                                    className={`py-3 rounded-xl font-mono text-sm font-bold transition-colors cursor-pointer ${
                                        btn === "="
                                            ? "bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6]"
                                            : btn === "C" || btn === "⌫"
                                              ? "bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200"
                                              : "bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#161614] border border-[#E6E3DB]"
                                    }`}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-5 border border-[#E6E3DB] rounded-xl p-4 space-y-3 bg-[#FAF9F6]/50">
                        <div className="flex items-center justify-between">
                            <p className="text-xs font-semibold text-[#3F3E39]">Calculation Tape</p>
                            {calcHistory.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setCalcHistory([])}
                                    className="text-xs text-[#78756C] hover:text-[#161614] cursor-pointer"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                        {calcHistory.length === 0 ? (
                            <p className="text-xs text-[#78756C] py-8 text-center">
                                Press = or Enter to record calculations here. Click any history entry to reuse it.
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                {calcHistory.map((item, i) => (
                                    <button
                                        key={`${item.expr}-${i}`}
                                        type="button"
                                        onClick={() => setCalcExpr(item.expr)}
                                        className="w-full text-left p-2.5 rounded-lg bg-white border border-[#E6E3DB] hover:border-blue-400 transition-colors cursor-pointer"
                                    >
                                        <p className="text-xs font-mono text-[#78756C] truncate">{item.expr}</p>
                                        <p className="text-sm font-mono font-bold text-[#161614] tabular-nums">= {item.result}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
