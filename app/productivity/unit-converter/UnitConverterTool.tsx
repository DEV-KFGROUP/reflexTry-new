"use client";

import React, { useMemo, useState } from "react";
import { ArrowLeftRight, Calculator, Copy, Check } from "lucide-react";

interface UnitDef {
    id: string;
    label: string;
    symbol: string;
    toBase: (v: number) => number;
    fromBase: (v: number) => number;
}

interface UnitCategory {
    id: string;
    name: string;
    units: UnitDef[];
}

const linear = (id: string, label: string, symbol: string, factor: number): UnitDef => ({
    id,
    label,
    symbol,
    toBase: (v) => v * factor,
    fromBase: (v) => v / factor,
});

const CATEGORIES: UnitCategory[] = [
    {
        id: "length",
        name: "Length",
        units: [
            linear("m", "Meters", "m", 1),
            linear("km", "Kilometers", "km", 1000),
            linear("cm", "Centimeters", "cm", 0.01),
            linear("mm", "Millimeters", "mm", 0.001),
            linear("mi", "Miles", "mi", 1609.344),
            linear("ft", "Feet", "ft", 0.3048),
            linear("in", "Inches", "in", 0.0254),
        ],
    },
    {
        id: "mass",
        name: "Mass",
        units: [
            linear("kg", "Kilograms", "kg", 1),
            linear("g", "Grams", "g", 0.001),
            linear("mg", "Milligrams", "mg", 1e-6),
            linear("lb", "Pounds", "lb", 0.45359237),
            linear("oz", "Ounces", "oz", 0.0283495231),
            linear("t", "Metric Tonnes", "t", 1000),
        ],
    },
    {
        id: "temp",
        name: "Temperature",
        units: [
            { id: "c", label: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
            { id: "f", label: "Fahrenheit", symbol: "°F", toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
            { id: "k", label: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
        ],
    },
    {
        id: "speed",
        name: "Speed",
        units: [
            linear("mps", "Meters / sec", "m/s", 1),
            linear("kph", "Kilometers / hr", "km/h", 1 / 3.6),
            linear("mph", "Miles / hr", "mph", 0.44704),
            linear("kn", "Knots", "kn", 0.514444),
            linear("mach", "Mach (Sea Level)", "Ma", 340.29),
        ],
    },
    {
        id: "energy",
        name: "Energy",
        units: [
            linear("j", "Joules", "J", 1),
            linear("kj", "Kilojoules", "kJ", 1000),
            linear("cal", "Kilocalories (Food)", "kcal", 4184),
            linear("kwh", "Kilowatt-Hours", "kWh", 3.6e6),
            linear("ev", "Electronvolts", "eV", 1.602176634e-19),
        ],
    },
    {
        id: "pressure",
        name: "Pressure",
        units: [
            linear("pa", "Pascals", "Pa", 1),
            linear("kpa", "Kilopascals", "kPa", 1000),
            linear("bar", "Bar", "bar", 100000),
            linear("atm", "Atmospheres", "atm", 101325),
            linear("psi", "PSI", "psi", 6894.757),
        ],
    },
    {
        id: "data",
        name: "Data Storage",
        units: [
            linear("b", "Bytes", "B", 1),
            linear("kb", "Kilobytes (1024)", "KB", 1024),
            linear("mb", "Megabytes", "MB", 1024 ** 2),
            linear("gb", "Gigabytes", "GB", 1024 ** 3),
            linear("tb", "Terabytes", "TB", 1024 ** 4),
        ],
    },
];

export default function UnitConverterTool() {
    const [catId, setCatId] = useState("length");
    const category = useMemo(() => CATEGORIES.find((c) => c.id === catId) || CATEGORIES[0], [catId]);

    const [fromId, setFromId] = useState("m");
    const [toId, setToId] = useState("ft");
    const [rawInput, setRawInput] = useState("100");
    const [copied, setCopied] = useState(false);

    // Quick Physics Formula Solver state
    const [formulaId, setFormulaId] = useState<"ke" | "ohm" | "kinematics" | "compound">("ke");
    const [pA, setPA] = useState("10");
    const [pB, setPB] = useState("5");
    const [pC, setPC] = useState("3");

    const fromUnit = category.units.find((u) => u.id === fromId) || category.units[0];
    const toUnit = category.units.find((u) => u.id === toId) || category.units[1] || category.units[0];

    const numericVal = parseFloat(rawInput);
    const converted = useMemo(() => {
        if (Number.isNaN(numericVal)) return "—";
        const base = fromUnit.toBase(numericVal);
        const out = toUnit.fromBase(base);
        if (Math.abs(out) !== 0 && (Math.abs(out) < 0.0001 || Math.abs(out) >= 1e9)) {
            return out.toExponential(5);
        }
        return Number(out.toPrecision(8)).toString();
    }, [numericVal, fromUnit, toUnit]);

    const handleCategoryChange = (nextId: string) => {
        const nextCat = CATEGORIES.find((c) => c.id === nextId) || CATEGORIES[0];
        setCatId(nextId);
        setFromId(nextCat.units[0].id);
        setToId(nextCat.units[1]?.id || nextCat.units[0].id);
    };

    const handleSwap = () => {
        setFromId(toUnit.id);
        setToId(fromUnit.id);
    };

    const handleCopy = () => {
        if (converted === "—") return;
        navigator.clipboard?.writeText(`${converted} ${toUnit.symbol}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    // Physics / Finance formula calculation
    const formulaOutput = useMemo(() => {
        const a = parseFloat(pA) || 0;
        const b = parseFloat(pB) || 0;
        const c = parseFloat(pC) || 0;
        if (formulaId === "ke") {
            return {
                title: "Kinetic Energy",
                equation: "KE = ½ · m · v²",
                labels: ["Mass m (kg)", "Velocity v (m/s)", ""],
                result: `${(0.5 * a * b * b).toFixed(3)} Joules`,
            };
        }
        if (formulaId === "ohm") {
            const pwr = a * b;
            return {
                title: "Ohm's Law & Power",
                equation: "V = I · R   |   P = V · I",
                labels: ["Current I (Amps)", "Resistance R (Ω)", ""],
                result: `Voltage = ${(a * b).toFixed(3)} V · Power = ${(pwr * a).toFixed(3)} W`,
            };
        }
        if (formulaId === "kinematics") {
            const dist = a * c + 0.5 * b * c * c;
            const vf = a + b * c;
            return {
                title: "Kinematics Displacement",
                equation: "Δx = v₀·t + ½·a·t²",
                labels: ["Initial v₀ (m/s)", "Accel a (m/s²)", "Time t (s)"],
                result: `Δx = ${dist.toFixed(3)} m · Final v = ${vf.toFixed(3)} m/s`,
            };
        }
        const total = a * Math.pow(1 + b / 100, c);
        return {
            title: "Compound Growth",
            equation: "A = P · (1 + r)^t",
            labels: ["Principal P ($)", "Annual Rate r (%)", "Years t"],
            result: `Total = $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })} (Gain +$${(total - a).toLocaleString(undefined, { maximumFractionDigits: 2 })})`,
        };
    }, [formulaId, pA, pB, pC]);

    return (
        <div className="space-y-6">
            {/* Unit Converter Panel */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap gap-1.5">
                    {CATEGORIES.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            onClick={() => handleCategoryChange(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                catId === c.id ? "bg-slate-900 text-white" : "bg-[#F3F1EB] text-[#3F3E39] hover:bg-[#E6E3DB]"
                            }`}
                        >
                            {c.name}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
                    <div className="md:col-span-5 space-y-2">
                        <label className="block text-xs font-semibold text-[#57554E]">From</label>
                        <input
                            type="number"
                            value={rawInput}
                            onChange={(e) => setRawInput(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#D8D4C9] text-lg font-mono font-bold text-[#161614] focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <select
                            value={fromUnit.id}
                            onChange={(e) => setFromId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] text-sm text-[#161614]"
                        >
                            {category.units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.label} ({u.symbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-1 flex justify-center pb-2">
                        <button
                            type="button"
                            onClick={handleSwap}
                            aria-label="Swap units"
                            className="p-2.5 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] hover:bg-[#F3F1EB] text-[#3F3E39] cursor-pointer"
                        >
                            <ArrowLeftRight className="w-4 h-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div className="md:col-span-5 space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-[#57554E]">To</label>
                            <button
                                type="button"
                                onClick={handleCopy}
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
                            >
                                {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
                                <span>{copied ? "Copied" : "Copy"}</span>
                            </button>
                        </div>
                        <div className="w-full px-3.5 py-2.5 rounded-xl border border-blue-200 bg-blue-50/50 text-lg font-mono font-bold text-blue-900 tabular-nums truncate">
                            {converted} <span className="text-sm font-normal text-blue-700">{toUnit.symbol}</span>
                        </div>
                        <select
                            value={toUnit.id}
                            onChange={(e) => setToId(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] text-sm text-[#161614]"
                        >
                            {category.units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.label} ({u.symbol})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Full Conversion Reference Table */}
                {!Number.isNaN(numericVal) && (
                    <div className="pt-4 border-t border-[#EFECE4] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                        {category.units.map((u) => {
                            const val = u.fromBase(fromUnit.toBase(numericVal));
                            const formatted =
                                Math.abs(val) !== 0 && (Math.abs(val) < 0.001 || Math.abs(val) >= 1e7)
                                    ? val.toExponential(3)
                                    : Number(val.toPrecision(6)).toString();
                            return (
                                <div key={u.id} className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB]/80">
                                    <p className="text-xs text-[#78756C]">{u.label}</p>
                                    <p className="text-sm font-mono font-bold text-[#161614] tabular-nums mt-0.5">
                                        {formatted} {u.symbol}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick STEM & Study Formula Solver */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-blue-600" aria-hidden="true" />
                        <h2 className="text-base font-bold text-[#161614]">Instant Formula Solver</h2>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {[
                            { id: "ke", label: "Kinetic Energy" },
                            { id: "ohm", label: "Ohm's Law" },
                            { id: "kinematics", label: "Kinematics" },
                            { id: "compound", label: "Compound Growth" },
                        ].map((f) => (
                            <button
                                key={f.id}
                                type="button"
                                onClick={() => setFormulaId(f.id as "ke" | "ohm" | "kinematics" | "compound")}
                                className={`px-3 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                                    formulaId === f.id ? "bg-blue-600 text-white" : "bg-[#F3F1EB] text-[#3F3E39] hover:bg-[#E6E3DB]"
                                }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>

                <p className="font-mono text-sm font-semibold text-blue-800 bg-blue-50/70 border border-blue-100 rounded-xl px-4 py-2.5">
                    {formulaOutput.equation}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">{formulaOutput.labels[0]}</span>
                        <input
                            type="number"
                            value={pA}
                            onChange={(e) => setPA(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm text-[#161614]"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">{formulaOutput.labels[1]}</span>
                        <input
                            type="number"
                            value={pB}
                            onChange={(e) => setPB(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm text-[#161614]"
                        />
                    </label>
                    {formulaOutput.labels[2] && (
                        <label className="space-y-1">
                            <span className="text-xs font-medium text-[#57554E]">{formulaOutput.labels[2]}</span>
                            <input
                                type="number"
                                value={pC}
                                onChange={(e) => setPC(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm text-[#161614]"
                            />
                        </label>
                    )}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white font-mono text-sm font-bold tabular-nums">
                    {formulaOutput.result}
                </div>
            </div>
        </div>
    );
}
