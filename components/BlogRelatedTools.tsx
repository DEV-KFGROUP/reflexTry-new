import React from "react";
import Link from "next/link";
import { Zap, Brain, Gauge, Target, Gamepad2, ArrowRight, Play, Sparkles } from "lucide-react";

interface ToolItem {
    id: string;
    name: string;
    href: string;
    category: string;
    icon: React.ElementType;
    colorClass: string;
    bgClass: string;
    borderClass: string;
    description: string;
}

const ALL_TOOLS_MAP: Record<string, ToolItem> = {
    "reaction": {
        id: "reaction",
        name: "Reaction Time Test",
        href: "/reflex/reaction",
        category: "Reflex",
        icon: Zap,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
        description: "Measure your visual latency in milliseconds down to microsecond resolution."
    },
    "sound": {
        id: "sound",
        name: "Sound Reaction Test",
        href: "/reflex/sound",
        category: "Reflex",
        icon: Zap,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
        description: "Benchmark your auditory reaction latency to sudden sound cues."
    },
    "go-no-go": {
        id: "go-no-go",
        name: "Go / No-Go Test",
        href: "/reflex/go-no-go",
        category: "Reflex",
        icon: Target,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
        description: "Test motor response inhibition—press on green, withhold on red."
    },
    "flanker": {
        id: "flanker",
        name: "Eriksen Flanker Test",
        href: "/reflex/flanker",
        category: "Reflex",
        icon: ArrowRight,
        colorClass: "text-amber-500",
        bgClass: "bg-amber-500/10",
        borderClass: "border-amber-500/30",
        description: "Measure attentional focus by responding to center targets while ignoring distractors."
    },
    "grid": {
        id: "grid",
        name: "Grid Shot Aim Trainer",
        href: "/reflex/grid",
        category: "Gaming",
        icon: Target,
        colorClass: "text-purple-500",
        bgClass: "bg-purple-500/10",
        borderClass: "border-purple-500/30",
        description: "Train mouse flick accuracy, target acquisition, and clicking speed."
    },
    "typing": {
        id: "typing",
        name: "Typing Speed Test",
        href: "/speed/typing",
        category: "Speed",
        icon: Gauge,
        colorClass: "text-cyan-500",
        bgClass: "bg-cyan-500/10",
        borderClass: "border-cyan-500/30",
        description: "Test your Words Per Minute (WPM), net speed, and character accuracy."
    },
    "click": {
        id: "click",
        name: "CPS Click Test",
        href: "/speed/click",
        category: "Speed",
        icon: Gauge,
        colorClass: "text-cyan-500",
        bgClass: "bg-cyan-500/10",
        borderClass: "border-cyan-500/30",
        description: "Measure raw clicks-per-second velocity across 1s, 5s, and 10s intervals."
    },
    "schulte-table": {
        id: "schulte-table",
        name: "Schulte Table",
        href: "/speed/schulte-table",
        category: "Speed",
        icon: Target,
        colorClass: "text-cyan-500",
        bgClass: "bg-cyan-500/10",
        borderClass: "border-cyan-500/30",
        description: "Expand peripheral vision and visual search speed on a 5×5 number grid."
    },
    "n-back": {
        id: "n-back",
        name: "Dual N-Back Memory",
        href: "/memory/n-back",
        category: "Memory",
        icon: Brain,
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        description: "The gold standard working memory task—match letters and positions N steps back."
    },
    "chimp-test": {
        id: "chimp-test",
        name: "Chimp Test",
        href: "/memory/chimp-test",
        category: "Memory",
        icon: Brain,
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        description: "Recall and click numbers in ascending order after they are visually masked."
    },
    "sequence": {
        id: "sequence",
        name: "Sequence Memory",
        href: "/memory/sequence",
        category: "Memory",
        icon: Sparkles,
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        description: "Memorize and reproduce an expanding sequence of flashing grid squares."
    },
    "verbal-memory": {
        id: "verbal-memory",
        name: "Verbal Memory Test",
        href: "/memory/verbal-memory",
        category: "Memory",
        icon: Brain,
        colorClass: "text-blue-500",
        bgClass: "bg-blue-500/10",
        borderClass: "border-blue-500/30",
        description: "Evaluate verbal working memory retention across a continuous stream of words."
    },
    "color-blindness": {
        id: "color-blindness",
        name: "Color Vision Screening",
        href: "/accuracy/color-blindness",
        category: "Accuracy",
        icon: Target,
        colorClass: "text-emerald-500",
        bgClass: "bg-emerald-500/10",
        borderClass: "border-emerald-500/30",
        description: "Screen red-green visual contrast perception with procedural dot plates."
    }
};

const ARTICLE_TO_TOOLS: Record<string, string[]> = {
    "what-is-a-good-reaction-time": ["reaction", "sound", "choice-reaction", "flanker"],
    "reaction-time-training-guide": ["reaction", "sound", "go-no-go", "grid"],
    "go-no-go-and-flanker-explained": ["go-no-go", "flanker", "reaction", "choice-reaction"],
    "n-back-working-memory-guide": ["n-back", "chimp-test", "sequence", "verbal-memory"],
    "working-memory-exercises": ["n-back", "sequence", "chimp-test", "verbal-memory"],
    "working-memory-span-explained": ["chimp-test", "n-back", "sequence", "verbal-memory"],
    "how-to-improve-memory-techniques": ["sequence", "chimp-test", "verbal-memory", "n-back"],
    "typing-speed-improvement": ["typing", "click", "schulte-table", "reaction"],
    "aim-trainer-practice-protocol": ["grid", "reaction", "schulte-table", "click"],
    "schulte-table-visual-attention": ["schulte-table", "grid", "flanker", "reaction"],
    "color-vision-test-online-limits": ["color-blindness", "schulte-table", "grid", "reaction"],
    "daily-cognitive-warmup-routine": ["reaction", "grid", "typing", "sequence"],
    "brain-training-benefits": ["reaction", "n-back", "typing", "chimp-test"],
    "cognitive-aging-prevention": ["n-back", "reaction", "schulte-table", "verbal-memory"],
    "complete-guide-reflex-accuracy-tools": ["reaction", "grid", "go-no-go", "sound"],
    "complete-guide-memory-speed-gaming-tools": ["chimp-test", "typing", "grid", "n-back"]
};

interface BlogRelatedToolsProps {
    slug: string;
    category?: string;
}

export function BlogRelatedTools({ slug, category }: BlogRelatedToolsProps) {
    const toolIds = ARTICLE_TO_TOOLS[slug] || ["reaction", "grid", "n-back", "typing"];
    const tools = toolIds.map(id => ALL_TOOLS_MAP[id]).filter(Boolean);

    return (
        <section className="my-10 p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        <Play className="w-4 h-4 fill-current" />
                    </div>
                    <div>
                        <h3 className="text-lg font-mono font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            Related Interactive Tests
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                            Apply the techniques from this article directly in the test arena
                        </p>
                    </div>
                </div>

                <Link
                    href="/tools"
                    prefetch={false}
                    className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
                >
                    View All Tools →
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            prefetch={false}
                            className="group p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-400 dark:hover:border-cyan-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-xl ${tool.bgClass} ${tool.colorClass} border ${tool.borderClass}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                                        Test <ArrowRight className="w-3.5 h-3.5" />
                                    </span>
                                </div>

                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-base group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                                    {tool.name}
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
