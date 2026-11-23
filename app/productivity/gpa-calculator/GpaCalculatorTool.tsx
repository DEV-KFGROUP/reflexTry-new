"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, GraduationCap, RotateCcw } from "lucide-react";

interface CourseRow {
    id: string;
    name: string;
    credits: number;
    grade: string;
}

const GRADE_POINTS: Record<string, number> = {
    "A+": 4.0,
    A: 4.0,
    "A-": 3.7,
    "B+": 3.3,
    B: 3.0,
    "B-": 2.7,
    "C+": 2.3,
    C: 2.0,
    "C-": 1.7,
    "D+": 1.3,
    D: 1.0,
    F: 0.0,
};

const DEFAULT_COURSES: CourseRow[] = [
    { id: "c1", name: "Calculus II", credits: 4, grade: "A-" },
    { id: "c2", name: "Physics Mechanics", credits: 4, grade: "A" },
    { id: "c3", name: "Computer Science", credits: 3, grade: "A" },
    { id: "c4", name: "Academic Writing", credits: 3, grade: "B+" },
];

const STORAGE_KEY = "reflextry_gpa_courses_v1";

export default function GpaCalculatorTool() {
    const [courses, setCourses] = useState<CourseRow[]>(DEFAULT_COURSES);
    const [priorGpa, setPriorGpa] = useState("3.50");
    const [priorCredits, setPriorCredits] = useState("0");

    // Final exam target calculator
    const [currentPct, setCurrentPct] = useState("86");
    const [targetPct, setTargetPct] = useState("90");
    const [finalWeight, setFinalWeight] = useState("25");

    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) setCourses(parsed);
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
        } catch {
            // ignore
        }
    }, [courses]);

    const stats = useMemo(() => {
        let semPoints = 0;
        let semCredits = 0;
        courses.forEach((c) => {
            const cr = Math.max(0, Number(c.credits) || 0);
            const pts = GRADE_POINTS[c.grade] ?? 0;
            semPoints += pts * cr;
            semCredits += cr;
        });
        const semGpa = semCredits > 0 ? semPoints / semCredits : 0;

        const pCr = Math.max(0, parseFloat(priorCredits) || 0);
        const pGpa = Math.max(0, Math.min(4, parseFloat(priorGpa) || 0));
        const totalCredits = semCredits + pCr;
        const cumGpa = totalCredits > 0 ? (semPoints + pGpa * pCr) / totalCredits : 0;

        return { semGpa, semCredits, cumGpa, totalCredits };
    }, [courses, priorGpa, priorCredits]);

    const neededFinal = useMemo(() => {
        const cur = parseFloat(currentPct) || 0;
        const tgt = parseFloat(targetPct) || 0;
        const wt = Math.max(1, Math.min(99, parseFloat(finalWeight) || 20)) / 100;
        return (tgt - cur * (1 - wt)) / wt;
    }, [currentPct, targetPct, finalWeight]);

    const addCourse = () => {
        setCourses((prev) => [
            ...prev,
            { id: `c-${Date.now()}`, name: `Course ${prev.length + 1}`, credits: 3, grade: "A" },
        ]);
    };

    return (
        <div className="space-y-6">
            {/* Live GPA Summary Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5">
                    <p className="text-xs font-medium text-[#78756C]">Semester GPA</p>
                    <p className="text-3xl font-extrabold font-mono tabular-nums text-blue-700 mt-1">
                        {stats.semGpa.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#78756C] mt-1 font-mono">{stats.semCredits} credits</p>
                </div>
                <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5">
                    <p className="text-xs font-medium text-[#78756C]">Cumulative GPA</p>
                    <p className="text-3xl font-extrabold font-mono tabular-nums text-[#161614] mt-1">
                        {stats.cumGpa.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#78756C] mt-1 font-mono">{stats.totalCredits} total credits</p>
                </div>
                <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5">
                    <p className="text-xs font-medium text-[#78756C]">Academic Standing</p>
                    <p className="text-xl font-extrabold text-emerald-700 mt-2">
                        {stats.cumGpa >= 3.7 ? "Dean's List / Honors" : stats.cumGpa >= 3.0 ? "Good Standing" : stats.cumGpa >= 2.0 ? "Satisfactory" : "Review Needed"}
                    </p>
                    <p className="text-xs text-[#78756C] mt-1">4.0 Standard Scale</p>
                </div>
            </div>

            {/* Course Table */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-blue-600" aria-hidden="true" />
                        <h2 className="text-base font-bold text-[#161614]">Semester Courses</h2>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCourses(DEFAULT_COURSES)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E6E3DB] text-xs font-semibold text-[#57554E] hover:bg-[#FAF9F6] cursor-pointer"
                        >
                            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Reset</span>
                        </button>
                        <button
                            type="button"
                            onClick={addCourse}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-xs font-semibold cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Add Course</span>
                        </button>
                    </div>
                </div>

                <div className="space-y-2.5">
                    {courses.map((c) => (
                        <div key={c.id} className="grid grid-cols-6 sm:grid-cols-12 gap-2 items-center">
                            <input
                                type="text"
                                value={c.name}
                                onChange={(e) =>
                                    setCourses((prev) => prev.map((row) => (row.id === c.id ? { ...row, name: e.target.value } : row)))
                                }
                                placeholder="Course name"
                                className="col-span-6 sm:col-span-6 min-w-0 w-full px-3 py-2 rounded-xl border border-[#E6E3DB] text-sm text-[#161614]"
                            />
                            <input
                                type="number"
                                min={0.5}
                                max={12}
                                step={0.5}
                                value={c.credits}
                                onChange={(e) =>
                                    setCourses((prev) =>
                                        prev.map((row) => (row.id === c.id ? { ...row, credits: Number(e.target.value) } : row))
                                    )
                                }
                                aria-label="Course credits"
                                className="col-span-2 sm:col-span-2 min-w-0 w-full px-2.5 py-2 rounded-xl border border-[#E6E3DB] font-mono text-sm text-[#161614]"
                            />
                            <select
                                value={c.grade}
                                onChange={(e) =>
                                    setCourses((prev) => prev.map((row) => (row.id === c.id ? { ...row, grade: e.target.value } : row)))
                                }
                                aria-label="Letter grade"
                                className="col-span-3 sm:col-span-3 min-w-0 w-full px-2.5 py-2 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] font-mono text-sm font-semibold text-[#161614]"
                            >
                                {Object.entries(GRADE_POINTS).map(([g, p]) => (
                                    <option key={g} value={g}>
                                        {g} ({p.toFixed(1)})
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => setCourses((prev) => prev.filter((row) => row.id !== c.id))}
                                disabled={courses.length <= 1}
                                aria-label="Delete course"
                                className="col-span-1 p-2 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer flex justify-center"
                            >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Optional Prior Cumulative GPA */}
                <div className="pt-4 border-t border-[#EFECE4] grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">Prior Cumulative GPA (optional)</span>
                        <input
                            type="number"
                            min={0}
                            max={4}
                            step={0.01}
                            value={priorGpa}
                            onChange={(e) => setPriorGpa(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E3DB] font-mono text-sm text-[#161614]"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">Prior Earned Credits</span>
                        <input
                            type="number"
                            min={0}
                            max={200}
                            value={priorCredits}
                            onChange={(e) => setPriorCredits(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#E6E3DB] font-mono text-sm text-[#161614]"
                        />
                    </label>
                </div>
            </div>

            {/* Final Exam Score Target Calculator */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 space-y-4">
                <div>
                    <h2 className="text-base font-bold text-[#161614]">Final Exam Target Grade Solver</h2>
                    <p className="text-xs text-[#78756C] mt-0.5">Calculate the exact percentage you need on your final exam to reach your desired course grade.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">Current Grade (%)</span>
                        <input
                            type="number"
                            value={currentPct}
                            onChange={(e) => setCurrentPct(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">Desired Course Grade (%)</span>
                        <input
                            type="number"
                            value={targetPct}
                            onChange={(e) => setTargetPct(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm"
                        />
                    </label>
                    <label className="space-y-1">
                        <span className="text-xs font-medium text-[#57554E]">Final Exam Weight (%)</span>
                        <input
                            type="number"
                            value={finalWeight}
                            onChange={(e) => setFinalWeight(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-[#D8D4C9] font-mono text-sm"
                        />
                    </label>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-slate-300">Required Final Exam Score:</span>
                    <span className={`text-xl font-extrabold font-mono tabular-nums ${neededFinal > 100 ? "text-amber-400" : "text-emerald-400"}`}>
                        {neededFinal.toFixed(1)}%
                        {neededFinal > 100 ? " (Extra credit needed)" : neededFinal <= 0 ? " (Target already secured)" : ""}
                    </span>
                </div>
            </div>
        </div>
    );
}
