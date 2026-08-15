"use client";

import { motion } from "framer-motion";
import { 
    Activity, 
    Clock, 
    Cpu, 
    Gauge, 
    Monitor, 
    ShieldCheck, 
    Sparkles, 
    Target, 
    Terminal, 
    Zap,
    HelpCircle,
    CheckCircle2,
    AlertTriangle,
    Layers
} from "lucide-react";
import Link from "next/link";

export default function MethodologyClient() {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 min-h-screen text-slate-800 dark:text-slate-200">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* ── Header ── */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase">
                        <Terminal className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Measurement Standards &amp; Technical Calibration
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                        Testing{" "}
                        <span
                            className="inline-block text-cyan-600"
                            style={{
                                background: "linear-gradient(110deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Methodology
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        How Reflextry measures human reaction latency, motor speed, and cognitive accuracy down to the millisecond—including technical constraints, hardware variables, and scoring formulas.
                    </p>
                </motion.div>

                {/* ── Executive Summary / AEO Answer Block ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-cyan-500/30 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-violet-600" />
                    
                    <h2 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4" />
                        Reflextry Measurement Standard (At A Glance)
                    </h2>

                    <div className="space-y-4 text-sm md:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                        <p>
                            <strong>Reflextry</strong> utilizes browser-native, high-resolution hardware timestamps via the <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-cyan-600 text-xs">performance.now()</code> API synchronized to the device display refresh cycle through <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-cyan-600 text-xs">requestAnimationFrame()</code>.
                        </p>
                        <p>
                            Tests are designed as <strong>recreational and personal benchmarking instruments</strong> to establish relative performance baselines and track progress over repeated practice sessions under consistent testing conditions.
                        </p>
                    </div>
                </motion.div>

                {/* ── Section 1: Reaction Time & Latency Architecture ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                1. Reaction Time &amp; Millisecond Timing Engine
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Stimulus Detection, Timestamp Capture, &amp; Outlier Filtering
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        <p>
                            In our visual reaction tests (such as <Link href="/reflex/reaction" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">Reaction Time Test</Link> and <Link href="/reflex/sound" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">Sound Reaction</Link>), timing is captured as follows:
                        </p>
                        
                        <div className="grid md:grid-cols-3 gap-4 my-6">
                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                                <h3 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase mb-2 flex items-center gap-1.5">
                                    <Clock className="w-4 h-4 text-cyan-500" />
                                    Microsecond Resolution
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Stimulus presentation and user click events are measured using the DOM High Resolution Time specification (<code className="text-cyan-600">performance.now()</code>), providing sub-millisecond precision.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                                <h3 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase mb-2 flex items-center gap-1.5">
                                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                                    False Start Protection
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Human biological neural transmission requires at least ~100ms. Any registered response under 100ms is classified as an anticipated false start and penalized/invalidated.
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60">
                                <h3 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase mb-2 flex items-center gap-1.5">
                                    <Activity className="w-4 h-4 text-violet-500" />
                                    Multi-Trial Median
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                    Each test session aggregates 5 consecutive trials. We compute both the arithmetic mean and the median to mitigate momentary distractions or anomalous outliers.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hardware Factors Table */}
                    <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                        <h3 className="text-sm font-mono font-bold text-slate-900 dark:text-white uppercase mb-3 flex items-center gap-2">
                            <Monitor className="w-4 h-4 text-cyan-500" />
                            Hardware Latency Sources (Why Browser Tests Differ From Laboratory EEG)
                        </h3>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                                    <tr>
                                        <th className="p-3">Variable</th>
                                        <th className="p-3">60Hz Standard Display</th>
                                        <th className="p-3">144Hz Gaming Display</th>
                                        <th className="p-3">240Hz+ Esports Display</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    <tr>
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">Frame Duration</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">~16.6 ms per frame</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">~6.9 ms per frame</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">~4.1 ms per frame</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">Input Polling (USB vs BT)</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">Bluetooth: +8–15 ms latency</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">USB 1000Hz: ~1 ms polling</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">USB 8000Hz: &lt;0.2 ms polling</td>
                                    </tr>
                                    <tr>
                                        <td className="p-3 font-semibold text-slate-900 dark:text-white">Typical Measured Latency</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">220 – 270 ms</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">190 – 240 ms</td>
                                        <td className="p-3 text-slate-600 dark:text-slate-400">170 – 220 ms</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </motion.section>

                {/* ── Section 2: Speed & Typing Calculation Formulas ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                            <Gauge className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                2. Speed, Typing (WPM), &amp; CPS Formulas
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Standardized Calculation Standards
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600 dark:text-slate-300">
                        {/* WPM Box */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                            <h3 className="font-mono font-bold text-slate-900 dark:text-white text-base">
                                Words Per Minute (WPM) Formula
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                In accordance with international typing standards, a standard "word" is defined as exactly <strong>5 keystrokes</strong> (including spaces and punctuation).
                            </p>
                            <div className="p-3 rounded-xl bg-slate-900 text-cyan-400 font-mono text-xs">
                                Gross WPM = (Total Keystrokes / 5) / (Time in Seconds / 60)<br />
                                Net WPM = Gross WPM - (Uncorrected Errors / Time in Minutes)<br />
                                Accuracy = (Correct Characters / Total Characters Typed) × 100%
                            </div>
                        </div>

                        {/* CPS Box */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-3">
                            <h3 className="font-mono font-bold text-slate-900 dark:text-white text-base">
                                Clicks Per Second (CPS) Formula
                            </h3>
                            <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                                CPS calculates the rate of validated mouse down/up click events within an active window timer (1s, 5s, 10s, 60s).
                            </p>
                            <div className="p-3 rounded-xl bg-slate-900 text-amber-400 font-mono text-xs">
                                CPS = Validated Clicks Registered / Selected Duration (seconds)<br />
                                Debounce threshold: 25ms minimum per click to prevent software macro cheating.
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── Section 3: Memory & Cognitive Progression Algorithms ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                3. Memory &amp; Cognitive Scaling Architecture
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Adaptive Difficulty, Sequence Randomization, &amp; Memory Span
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            Our cognitive assessment modules (<Link href="/memory/chimp-test" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">Chimp Test</Link>, <Link href="/memory/sequence" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">Sequence Memory</Link>, <Link href="/memory/n-back" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">N-Back</Link>, <Link href="/speed/schulte-table" className="text-cyan-600 dark:text-cyan-400 font-semibold underline hover:no-underline">Schulte Table</Link>) generate non-repeating pseudorandom trials designed to isolate specific cognitive faculties:
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase mb-1">
                                    Spatial Working Memory (Chimp Test)
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Numbers are placed randomly on a 9×5 grid. As soon as number 1 is clicked, numbers 2..N are visually masked. Measures immediate visual-spatial buffer capacity.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase mb-1">
                                    Sequential Retention (Sequence Memory)
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Incrementing 3×3 grid pattern. Each level appends exactly one new step to the preceding sequence, testing working memory retention limits under increasing cognitive load.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── Section 4: Privacy & Ethical Data Governance ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                4. Privacy &amp; Anonymized Data Handling
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Client-Side Processing &amp; Zero Personal Data Storage
                            </p>
                        </div>
                    </div>

                    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
                        <p>
                            All tests run <strong>entirely client-side in your local browser</strong>. Your individual millisecond clicks and raw trial patterns are never uploaded to a remote server without explicit consent.
                        </p>
                        <p>
                            Local best scores and personal baselines are stored directly in your browser's <code className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-xs">localStorage</code>, keeping your performance data under your total control.
                        </p>
                    </div>
                </motion.section>

                {/* ── CTA / Related Links ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Link 
                        href="/science"
                        className="inline-flex items-center gap-2 text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                        Explore Neuroscience Research &amp; Citations →
                    </Link>
                    <Link 
                        href="/reflex/reaction"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
                    >
                        <Zap className="w-4 h-4 text-amber-400" />
                        Test Your Reaction Time
                    </Link>
                </div>

            </div>
        </div>
    );
}
