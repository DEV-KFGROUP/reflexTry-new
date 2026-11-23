"use client";

import {
    Brain,
    Activity,
    Hash,
    Grid3X3,
    Palette,
    Shapes,
    Shuffle,
    BookOpen,
    Layers,
    Eye,
    Focus,
} from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const MEMORY_CONFIG: ArenaHubConfig = {
    category: "memory",
    icon: Brain,
    kicker: "Memory Arena",
    heroTitleFallback: "Memory Capacity & Training Games",
    heroSubtitleFallback: "Expand your working memory capacity and cognitive retention.",
    heroDescFallback:
        "Working memory is the active scratchpad of cognition. Challenging your ability to hold and update visual, spatial, verbal, and sequential patterns builds disciplined recall.",
    whatItCoversFallback:
        "Working memory, spatial recall, and verbal recognition tests—including sequence patterns, digit span, visual grids, and the chimp test.",
    benefits: [
        {
            icon: Brain,
            titleKey: "categoryHub.memory.benefit1Title",
            titleFallback: "Working Memory",
            descKey: "categoryHub.memory.benefit1Desc",
            descFallback: "Hold and update longer active sequences",
        },
        {
            icon: Grid3X3,
            titleKey: "categoryHub.memory.benefit2Title",
            titleFallback: "Spatial Recall",
            descKey: "categoryHub.memory.benefit2Desc",
            descFallback: "Map positions across expanding grids",
        },
        {
            icon: Focus,
            titleKey: "categoryHub.memory.benefit3Title",
            titleFallback: "Sustained Focus",
            descKey: "categoryHub.memory.benefit3Desc",
            descFallback: "Reduce interference during continuous recall",
        },
    ],
    tools: [
        {
            title: "Chimp Test",
            desc: "Memorize ascending number positions and click them in order after they vanish.",
            icon: Brain,
            href: "/memory/chimp-test",
        },
        {
            title: "Verbal Memory",
            desc: "Keep track of seen words and distinguish them from novel vocabulary.",
            icon: BookOpen,
            href: "/memory/verbal-memory",
        },
        {
            title: "N-Back",
            desc: "Match letters that appeared N steps earlier in a continuous stream.",
            icon: Layers,
            href: "/memory/n-back",
        },
        {
            title: "Sequence Memory",
            desc: "Memorize and repeat an increasingly complex flashing button pattern.",
            icon: Activity,
            href: "/memory/sequence",
        },
        {
            title: "Object Tracking",
            desc: "Track multiple moving targets among distractors and identify them when they stop.",
            icon: Eye,
            href: "/memory/object-tracking",
        },
        {
            title: "Number Memory",
            desc: "Remember and repeat the longest digit strings you can hold in active memory.",
            icon: Hash,
            href: "/memory/number",
        },
        {
            title: "Visual Memory",
            desc: "Retain spatial coordinates of highlighted blocks in expanding matrices.",
            icon: Grid3X3,
            href: "/memory/visual",
        },
        {
            title: "Color Matching",
            desc: "Verify semantic colors against text indicators under time pressure.",
            icon: Palette,
            href: "/memory/color",
        },
        {
            title: "Shape Recognition",
            desc: "Identify shape details and geometry configurations within custom grids.",
            icon: Shapes,
            href: "/memory/shape",
        },
        {
            title: "Symbol Matching",
            desc: "Scan and recall symbol configurations inside coordinate boxes.",
            icon: Shuffle,
            href: "/memory/symbol",
        },
        {
            title: "Word Recall",
            desc: "Memorize and recall random lists of words to test linguistic retention.",
            icon: BookOpen,
            href: "/memory/word-recall",
        },
        {
            title: "Card Match",
            desc: "Classic card-flipping pairs board match testing visual-spatial memory.",
            icon: Layers,
            href: "/memory/card-match",
        },
    ],
};

export default function MemoryHubClient() {
    return <ArenaHubLayout config={MEMORY_CONFIG} />;
}
