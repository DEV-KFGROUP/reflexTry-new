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
        <section className="my-10 p-6 md:p-8 rounded-2xl bg-[#FAF9F6] border border-[#E6E3DB] space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-3 pb-4 border-b border-[#E6E3DB]">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] mb-1">
                        Interactive Practice
                    </p>
                    <h3 className="font-serif text-2xl font-medium text-[#161614] tracking-[-0.02em]">
                        Related Interactive Tests
                    </h3>
                    <p className="text-sm text-[#57554E] mt-1">
                        Apply the techniques from this article directly in the test arena.
                    </p>
                </div>

                <Link
                    href="/tools"
                    prefetch={false}
                    className="text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors inline-flex items-center gap-1 whitespace-nowrap"
                >
                    <span>View All Tools</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[#E6E3DB] bg-white">
                {tools.map(tool => {
                    const Icon = tool.icon;
                    return (
                        <Link
                            key={tool.id}
                            href={tool.href}
                            prefetch={false}
                            className="group p-5 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors flex flex-col justify-between gap-3"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-xs text-[#78756C]">
                                        <Icon className="w-4 h-4 text-[#57554E] group-hover:text-[#161614] transition-colors" aria-hidden="true" />
                                        <span className="font-semibold uppercase tracking-[0.1em]">
                                            {tool.category}
                                        </span>
                                    </div>
                                    <ArrowRight className="w-3.5 h-3.5 text-[#78756C] group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                                </div>

                                <h4 className="font-semibold text-[#161614] text-base group-hover:text-[#1E40AF] transition-colors">
                                    {tool.name}
                                </h4>
                                <p className="text-xs text-[#57554E] leading-relaxed line-clamp-2">
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
