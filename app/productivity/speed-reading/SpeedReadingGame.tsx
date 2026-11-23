"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Play, RotateCcw, CheckCircle2, Zap, Gauge } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { ScoreHistory } from "@/utils/scoreHistory";

type ReadMode = "highlight" | "rsvp";
type Phase = "setup" | "reading" | "quiz" | "result";

interface QuizQuestion {
    q: string;
    options: string[];
    correctIdx: number;
}

interface Passage {
    id: string;
    title: string;
    category: string;
    text: string;
    questions: QuizQuestion[];
}

const PASSAGES: Passage[] = [
    {
        id: "orbital-mechanics",
        title: "Why Satellites Stay in Orbit",
        category: "Physics & Space",
        text: "A common misconception is that astronauts float in low Earth orbit because there is zero gravity in space. In reality, at the altitude of the International Space Station roughly four hundred kilometers above the surface, Earth still pulls with nearly ninety percent of its surface gravitational strength. Satellites remain aloft because they travel sideways at about seven point six kilometers per second. As gravity continuously bends their path downward, the spherical surface of Earth curves away at the exact same rate. This continuous state of free fall around the planet is what creates the sensation of weightlessness. If a spacecraft fires its thrusters backward to slow down, its curved path shrinks until it intersects the upper atmosphere, initiating reentry.",
        questions: [
            {
                q: "Roughly how much of Earth's surface gravity still acts on the International Space Station?",
                options: ["Zero percent", "About 50 percent", "Nearly 90 percent", "Over 120 percent"],
                correctIdx: 2,
            },
            {
                q: "Why does a satellite not hit Earth while falling continuously?",
                options: [
                    "Earth's surface curves away at the same rate as its downward fall",
                    "Solar wind pushes the satellite upward",
                    "The vacuum of space blocks gravitational pull",
                    "Magnetic fields lock the satellite at a fixed height",
                ],
                correctIdx: 0,
            },
            {
                q: "What happens when an orbiting spacecraft fires thrusters backward to reduce speed?",
                options: [
                    "It escapes into deep space",
                    "Its path shrinks into the upper atmosphere for reentry",
                    "It hovers motionless above one spot",
                    "Gravity stops pulling on it",
                ],
                correctIdx: 1,
            },
        ],
    },
    {
        id: "focus-neuroscience",
        title: "Attention Switching and Cognitive Residue",
        category: "Cognitive Science",
        text: "When you switch rapidly from writing a technical report to checking a short chat notification, your brain does not instantly reset its working memory. Cognitive psychologists call the lingering mental drag attention residue. Even after you return to the original task, neural networks continue allocating processing bandwidth to the unfinished message for several minutes. Studies measuring reaction speed and reading comprehension find that twenty-five minutes of uninterrupted single-task focus produces dramatically fewer errors than an hour of fragmented multitasking. Scheduling clear sprint intervals and silencing alerts protects the prefrontal cortex from constant context switching, preserving alertness across long study or office afternoons.",
        questions: [
            {
                q: "What term describes the lingering mental drag after switching tasks?",
                options: ["Synaptic drift", "Attention residue", "Visual latency", "Working decay"],
                correctIdx: 1,
            },
            {
                q: "According to the passage, how does 25 minutes of single-task focus compare to an hour of multitasking?",
                options: [
                    "It produces dramatically fewer errors",
                    "It always yields slower reading speeds",
                    "It causes higher attention residue",
                    "They produce identical outcomes",
                ],
                correctIdx: 0,
            },
            {
                q: "Which brain region is specifically protected by silencing alerts during sprint intervals?",
                options: ["Cerebellum", "Brainstem", "Prefrontal cortex", "Occipital lobe"],
                correctIdx: 2,
            },
        ],
    },
    {
        id: "numeric-fluency",
        title: "Precision Data Workflows in Finance",
        category: "Work & Analytics",
        text: "Modern spreadsheets automate complex formulas, yet human data entry remains a vital bottleneck in accounting, logistics, and laboratory records. A single transposed digit in a quarterly invoice ledger can cascade through tax calculations and force hours of manual auditing. Experienced ten-key operators rely on the tactile home-row bump on the number five key so their eyes stay locked on source documents rather than bouncing down to the keyboard. Research on motor skill acquisition shows that accuracy should always be locked above ninety-five percent before pushing keystrokes per hour higher. Clean rhythmic entry consistently beats frantic typing followed by repeated backspace corrections.",
        questions: [
            {
                q: "Which key on a 10-key numpad provides the tactile home-row anchor bump?",
                options: ["Number 0", "Number 1", "Number 5", "Enter key"],
                correctIdx: 2,
            },
            {
                q: "What accuracy threshold should operators hold before pushing speed higher?",
                options: ["Above 70 percent", "Above 80 percent", "Above 95 percent", "Exactly 100 percent"],
                correctIdx: 2,
            },
            {
                q: "Why does rhythmic accurate entry outperform frantic fast typing?",
                options: [
                    "It avoids repeated backspace corrections and cascading audit errors",
                    "Spreadsheets reject fast keystrokes",
                    "Keyboards lock out rapid inputs",
                    "It disables automatic formulas",
                ],
                correctIdx: 0,
            },
        ],
    },
];

export default function SpeedReadingGame() {
    const { t, getLocalizedHref } = useTranslation();

    const [passageIdx, setPassageIdx] = useState(0);
    const [readMode, setReadMode] = useState<ReadMode>("highlight");
    const [targetWpm, setTargetWpm] = useState(300);
    const [phase, setPhase] = useState<Phase>("setup");
    const [wordIndex, setWordIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [actualWpm, setActualWpm] = useState(0);

    const startTsRef = useRef<number>(0);

    const passage = PASSAGES[passageIdx];
    const words = passage.text.split(/\s+/);

    const finishReading = () => {
        const elapsedMin = Math.max(0.05, (performance.now() - startTsRef.current) / 60000);
        const computedRaw = Math.round(words.length / elapsedMin);
        setActualWpm(computedRaw);
        setAnswers({});
        setPhase("quiz");
    };

    const startReading = () => {
        setWordIndex(0);
        startTsRef.current = performance.now();
        setPhase("reading");
    };

    useEffect(() => {
        if (phase !== "reading") return;
        const msPerWord = Math.round(60000 / targetWpm);
        const interval = setInterval(() => {
            setWordIndex((prev) => {
                if (prev + 1 >= words.length) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const elapsedMin = Math.max(0.05, (performance.now() - startTsRef.current) / 60000);
                        setActualWpm(Math.round(words.length / elapsedMin));
                        setAnswers({});
                        setPhase("quiz");
                    }, 350);
                    return prev;
                }
                return prev + 1;
            });
        }, msPerWord);
        return () => clearInterval(interval);
    }, [phase, targetWpm, words.length]);

    const submitQuiz = () => {
        let correct = 0;
        passage.questions.forEach((q, idx) => {
            if (answers[idx] === q.correctIdx) correct++;
        });
        const compPct = Math.round((correct / passage.questions.length) * 100);
        const effWpm = Math.round((actualWpm * compPct) / 100);
        ScoreHistory.save("speed-reading", effWpm, "EWPM", readMode, {
            higherIsBetter: true,
            accuracy: compPct,
            configuration: `${readMode}-${passage.id}`,
        });
        setPhase("result");
    };

    const correctCount = passage.questions.reduce(
        (acc, q, idx) => acc + (answers[idx] === q.correctIdx ? 1 : 0),
        0
    );
    const compPct = Math.round((correctCount / passage.questions.length) * 100);
    const effectiveWpm = Math.round((actualWpm * compPct) / 100);

    // Highlight optimal recognition point (ORP) letter in RSVP mode
    const activeWord = words[wordIndex] || "";
    const orpIdx = Math.min(activeWord.length - 1, Math.floor(activeWord.length * 0.35));

    return (
        <div className="w-full max-w-5xl mx-auto space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                    href={getLocalizedHref("/productivity")}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#57554E] hover:text-[#161614] transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t("categories.productivity.title", "Student & Work Suite")}</span>
                </Link>

                <div className="inline-flex rounded-xl border border-[#E6E3DB] bg-white p-1">
                    <button
                        type="button"
                        onClick={() => {
                            setReadMode("highlight");
                            if (phase !== "setup") setPhase("setup");
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            readMode === "highlight" ? "bg-teal-600 text-white" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        Paced Highlighter
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setReadMode("rsvp");
                            if (phase !== "setup") setPhase("setup");
                        }}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            readMode === "rsvp" ? "bg-teal-600 text-white" : "text-[#57554E] hover:text-[#161614]"
                        }`}
                    >
                        RSVP Center Flash
                    </button>
                </div>
            </div>

            {/* Header */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#161614] tracking-tight">
                        {t("tools.speed-reading.title", "Speed Reading & Comprehension")}
                    </h1>
                    <p className="text-sm text-[#57554E] mt-1">
                        Read at your chosen pace, then pass the 3-question recall check to calculate Effective WPM.
                    </p>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 font-mono text-sm font-bold tabular-nums">
                    <Gauge className="w-4 h-4" />
                    <span>{targetWpm} WPM Target</span>
                </div>
            </div>

            {/* Main Panel */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
                {phase === "setup" && (
                    <div className="space-y-6">
                        {/* Topic Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-[#78756C]">
                                Select Reading Passage ({words.length} words)
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {PASSAGES.map((p, idx) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setPassageIdx(idx)}
                                        className={`p-4 rounded-xl border text-left transition-colors ${
                                            passageIdx === idx
                                                ? "bg-teal-50 border-teal-500 text-teal-950"
                                                : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:bg-[#FAF9F6]"
                                        }`}
                                    >
                                        <div className="text-[11px] font-mono uppercase text-teal-700">{p.category}</div>
                                        <div className="text-sm font-bold mt-1">{p.title}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Pace Slider */}
                        <div className="space-y-2 max-w-md">
                            <div className="flex justify-between text-xs font-semibold text-[#3F3E39]">
                                <span>Pacing Speed</span>
                                <span className="font-mono text-teal-700 tabular-nums">{targetWpm} WPM</span>
                            </div>
                            <input
                                type="range"
                                min={180}
                                max={650}
                                step={10}
                                value={targetWpm}
                                onChange={(e) => setTargetWpm(Number(e.target.value))}
                                className="w-full accent-teal-600"
                            />
                            <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                                <span>180 (Careful)</span>
                                <span>300 (College)</span>
                                <span>500+ (Speed)</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={startReading}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                        >
                            <Play className="w-4 h-4" />
                            <span>Start Reading Session</span>
                        </button>
                    </div>
                )}

                {phase === "reading" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between text-xs font-mono text-[#78756C] tabular-nums">
                            <span>
                                {passage.title} ({wordIndex + 1}/{words.length} words)
                            </span>
                            <span>{Math.round(((wordIndex + 1) / words.length) * 100)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#F3F1EB] overflow-hidden">
                            <div
                                className="h-full bg-teal-600 transition-all duration-100"
                                style={{ width: `${((wordIndex + 1) / words.length) * 100}%` }}
                            />
                        </div>

                        {readMode === "rsvp" ? (
                            <div className="h-52 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative">
                                <div className="w-0.5 h-4 bg-teal-400/70 absolute top-8" />
                                <div className="text-4xl sm:text-5xl font-bold font-mono tracking-wide text-white select-none">
                                    <span>{activeWord.slice(0, orpIdx)}</span>
                                    <span className="text-rose-400">{activeWord[orpIdx] || ""}</span>
                                    <span>{activeWord.slice(orpIdx + 1)}</span>
                                </div>
                                <div className="w-0.5 h-4 bg-teal-400/70 absolute bottom-8" />
                            </div>
                        ) : (
                            <div className="p-6 rounded-2xl bg-[#FAF9F6] border border-[#E6E3DB] text-lg sm:text-xl leading-relaxed text-[#3F3E39] font-serif">
                                {words.map((w, idx) => (
                                    <span
                                        key={idx}
                                        className={`inline-block mr-1.5 px-1 rounded transition-colors ${
                                            idx === wordIndex
                                                ? "bg-teal-600 text-white font-semibold"
                                                : idx < wordIndex
                                                ? "text-slate-400"
                                                : "text-[#161614]"
                                        }`}
                                    >
                                        {w}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={finishReading}
                                className="px-4 py-2 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-xs font-semibold text-[#3F3E39] transition-colors"
                            >
                                Finish & Take Quiz Early
                            </button>
                        </div>
                    </div>
                )}

                {phase === "quiz" && (
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-bold text-[#161614]">Comprehension Check</h2>
                            <p className="text-sm text-[#57554E] mt-0.5">
                                Answer all 3 questions without re-reading to calculate your Effective WPM.
                            </p>
                        </div>

                        <div className="space-y-5">
                            {passage.questions.map((q, qIdx) => (
                                <div key={qIdx} className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4 space-y-3">
                                    <div className="text-sm font-bold text-[#161614]">
                                        {qIdx + 1}. {q.q}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {q.options.map((opt, oIdx) => {
                                            const picked = answers[qIdx] === oIdx;
                                            return (
                                                <button
                                                    key={oIdx}
                                                    type="button"
                                                    onClick={() => setAnswers((prev) => ({ ...prev, [qIdx]: oIdx }))}
                                                    className={`p-3 rounded-lg border text-left text-xs sm:text-sm font-medium transition-colors ${
                                                        picked
                                                            ? "bg-teal-600 border-teal-600 text-white"
                                                            : "bg-white border-[#E6E3DB] text-[#3F3E39] hover:bg-[#F3F1EB]"
                                                    }`}
                                                >
                                                    {opt}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            disabled={Object.keys(answers).length < passage.questions.length}
                            onClick={submitQuiz}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Calculate Effective WPM</span>
                        </button>
                    </div>
                )}

                {phase === "result" && (
                    <div className="space-y-6 text-center max-w-xl mx-auto py-4">
                        <BookOpen className="w-10 h-10 text-teal-600 mx-auto" />
                        <div>
                            <h2 className="text-2xl font-extrabold text-[#161614]">Session Benchmark Complete</h2>
                            <p className="text-sm text-[#57554E] mt-1">
                                Effective WPM = Raw Pace × Comprehension Percentage
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 font-mono tabular-nums">
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                <div className="text-[11px] uppercase text-[#78756C]">Raw Pace</div>
                                <div className="text-2xl font-bold text-[#161614]">{actualWpm}</div>
                                <div className="text-[11px] text-[#78756C]">WPM</div>
                            </div>
                            <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-4">
                                <div className="text-[11px] uppercase text-[#78756C]">Comprehension</div>
                                <div className="text-2xl font-bold text-teal-700">{compPct}%</div>
                                <div className="text-[11px] text-[#78756C]">
                                    {correctCount}/{passage.questions.length} right
                                </div>
                            </div>
                            <div className="rounded-xl bg-teal-50 border border-teal-300 p-4">
                                <div className="text-[11px] uppercase text-teal-800">Effective</div>
                                <div className="text-2xl font-extrabold text-teal-700">{effectiveWpm}</div>
                                <div className="text-[11px] text-teal-700">EWPM</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPhase("setup")}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
                            >
                                <RotateCcw className="w-4 h-4" />
                                <span>Try Another Passage</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setTargetWpm((w) => Math.min(650, w + 40));
                                    setPassageIdx((i) => (i + 1) % PASSAGES.length);
                                    setPhase("setup");
                                }}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E6E3DB] bg-white hover:bg-[#FAF9F6] text-[#3F3E39] text-sm font-semibold transition-colors"
                            >
                                <Zap className="w-4 h-4 text-teal-600" />
                                <span>Bump Pace +40 WPM</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
