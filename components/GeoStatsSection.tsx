import React from "react";
import { Globe2, Zap, Keyboard, MousePointerClick } from "lucide-react";
import { GEO_STATS_DATA, GLOBAL_SUMMARY } from "@/lib/geo-stats";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateDatasetSchema } from "@/lib/structured-data";

export function GeoStatsSection() {
    const datasetSchema = generateDatasetSchema();

    return (
        <section
            className="w-full my-12 p-8 rounded-3xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 backdrop-blur-md"
            itemScope
            itemType="https://schema.org/Dataset"
            data-speakable="true"
        >
            <SchemaInjector schemas={[datasetSchema]} />
            <meta itemProp="name" content="Reflextry Global Cognitive Benchmarks" />
            <meta itemProp="description" content="Aggregated reaction time, typing speed, and click speed benchmarks across 140+ countries." />

            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                    <Globe2 className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-foreground">Global Cognitive Benchmarks</h2>
                    <p className="text-sm text-muted-foreground">
                        Aggregated statistics across {GLOBAL_SUMMARY.activeCountriesCount} regions based on {GLOBAL_SUMMARY.totalTestsCompleted} tests.
                    </p>
                </div>
            </div>

            {/* Global Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 flex items-center gap-4">
                    <Zap className="w-8 h-8 text-blue-500 shrink-0" />
                    <div>
                        <span className="text-xs uppercase font-semibold text-muted-foreground">Global Avg Reaction</span>
                        <p className="text-2xl font-extrabold text-foreground">{GLOBAL_SUMMARY.globalAvgReactionTime}</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 flex items-center gap-4">
                    <Keyboard className="w-8 h-8 text-emerald-500 shrink-0" />
                    <div>
                        <span className="text-xs uppercase font-semibold text-muted-foreground">Global Avg Typing</span>
                        <p className="text-2xl font-extrabold text-foreground">{GLOBAL_SUMMARY.globalAvgTypingSpeed}</p>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 flex items-center gap-4">
                    <MousePointerClick className="w-8 h-8 text-amber-500 shrink-0" />
                    <div>
                        <span className="text-xs uppercase font-semibold text-muted-foreground">Global Avg Click Speed</span>
                        <p className="text-2xl font-extrabold text-foreground">{GLOBAL_SUMMARY.globalAvgCps}</p>
                    </div>
                </div>
            </div>

            {/* Regional Comparison Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                    <thead>
                        <tr className="border-b border-black/10 dark:border-white/10 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            <th className="p-3">Region</th>
                            <th className="p-3">Avg Reaction</th>
                            <th className="p-3">Avg Typing</th>
                            <th className="p-3">Avg Click Speed</th>
                            <th className="p-3">Popular Test</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5 dark:divide-white/5 text-sm text-foreground">
                        {GEO_STATS_DATA.map((region) => (
                            <tr key={region.code} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                <td className="p-3 font-semibold flex items-center gap-2">
                                    <span className="text-lg">{region.flag}</span>
                                    <span>{region.country}</span>
                                </td>
                                <td className="p-3 font-mono font-medium text-blue-700 dark:text-blue-400">{region.avgReactionMs} ms</td>
                                <td className="p-3 font-mono font-medium text-emerald-700 dark:text-emerald-400">{region.avgTypingWpm} WPM</td>
                                <td className="p-3 font-mono font-medium text-amber-700 dark:text-amber-400">{region.avgCps} CPS</td>
                                <td className="p-3 text-muted-foreground">{region.topGamePreference}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}

