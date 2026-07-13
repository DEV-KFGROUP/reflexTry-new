"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, BookOpen, Brain, Activity, ShieldCheck, Zap } from "lucide-react";
import { SEO_CONFIGS } from "@/config/seo-config";

import { usePathname } from "next/navigation";

interface SeoKeywordFooterProps {
    title: string;
}

export function SeoKeywordFooter({ title }: SeoKeywordFooterProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Find config by matching the title, or loosely matching the pathname
    let config = null;
    let currentId = "";
    
    for (const [id, val] of Object.entries(SEO_CONFIGS)) {
        if (val.title === title || val.title.includes(title)) {
            config = val;
            currentId = id;
            break;
        }
    }

    if (!config) return null;

    return (
        <div className="w-full max-w-5xl mx-auto mt-16 mb-8 px-4 relative z-10">
            <div className="bg-white/5 dark:bg-slate-900/40 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/50 rounded-3xl overflow-hidden shadow-sm transition-all duration-300">
                
                {/* Accordion Header */}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-6 py-5 flex items-center justify-between bg-transparent hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-500/10 rounded-xl">
                            <BookOpen className="w-5 h-5 text-indigo-500" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-200 font-mono tracking-tight">
                                Deep Dive & Research: {config.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Cognitive mechanics, latency tracking, and semantic search queries.
                            </p>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <div className="px-6 pb-8 pt-4 border-t border-slate-200/30 dark:border-slate-800/30 space-y-8 text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
                                
                                {/* Section 1: The Core Mechanism */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-3 text-base">
                                        <Brain className="w-4 h-4 text-purple-500" />
                                        Cognitive Mechanics & Neuroplasticity
                                    </h4>
                                    <p className="mb-3">
                                        The <strong>{config.title}</strong> is designed to rigorously test and conditionally train specific neural pathways associated with your working memory, visual-spatial reasoning, and raw motor-reaction latency. Consistent engagement with tools like {config.title} stimulates neuroplasticity—the brain's ability to reorganize itself by forming new neural connections. 
                                    </p>
                                    <p>
                                        Whether you are an esports athlete looking to minimize input delay during high-stakes competitive matches, a student attempting to expand your short-term digit span, or simply someone trying to maintain peak cognitive health as you age, establishing a persistent baseline is critical. The brain operates similarly to a muscle; without active cognitive resistance training, processing speeds naturally degrade over time.
                                    </p>
                                </div>

                                {/* Section 2: Hardware Latency & Accuracy */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-3 text-base">
                                        <Zap className="w-4 h-4 text-amber-500" />
                                        Hardware Latency & Statistical Filtering
                                    </h4>
                                    <p className="mb-3">
                                        When measuring benchmarks using the {config.title}, it's highly important to understand the role of hardware latency (input lag). A standard 60Hz monitor refreshes a frame every 16.67 milliseconds. Conversely, a 240Hz esports-grade monitor refreshes every 4.16 milliseconds. Combined with mouse polling rates (typically 1000Hz or 1ms) and browser rendering delays, your raw score may fluctuate based on your physical setup.
                                    </p>
                                    <p>
                                        To maintain the integrity of our Global Leaderboards, Reflextry utilizes advanced statistical filtering algorithms. We actively monitor for physically impossible reaction thresholds (such as automated bot scripts executing at 1ms intervals) and flag anomalous variance to ensure that the global rankings genuinely reflect the absolute pinnacle of human cognitive capability and biological response times.
                                    </p>
                                </div>

                                {/* Section 3: Telemetry & Privacy */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-3 text-base">
                                        <ShieldCheck className="w-4 h-4 text-teal-500" />
                                        Data Telemetry & Local Storage
                                    </h4>
                                    <p>
                                        By default, your performance telemetry for the {config.title} is processed entirely on the client side. We leverage your browser's secure local storage to maintain your personal bests, historical averages, and rolling progression charts. This ensures your baseline data remains private. When you voluntarily submit a score to the Global Leaderboard, the payload is securely transmitted over HTTPS, stripped of personally identifiable information, and securely cataloged alongside thousands of other players worldwide to establish an accurate "Human Benchmark".
                                    </p>
                                </div>

                                {/* Section 4: Semantic Search Entities (Keyword Injection) */}
                                <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                                    <h4 className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold mb-3 text-base">
                                        <Activity className="w-4 h-4 text-blue-500" />
                                        Related Queries & Terminology
                                    </h4>
                                    <p className="mb-3 text-xs">
                                        Users engaging with the {config.title} frequently utilize the following semantic terms and related methodologies when researching cognitive improvement and reflex training:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {config.keywords.map((keyword, idx) => (
                                            <span 
                                                key={idx} 
                                                className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-500 dark:text-slate-400 capitalize whitespace-nowrap"
                                            >
                                                {keyword.replace(/-/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
