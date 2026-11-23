"use client";

import {
    MousePointer2,
    Calculator,
    Keyboard,
    Grid3X3,
    Type,
    Gauge,
    Hash,
    ArrowUpDown,
} from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const SPEED_CONFIG: ArenaHubConfig = {
    category: "speed",
    icon: Gauge,
    kicker: "Speed Arena",
    heroTitleFallback: "Speed Tests & Velocity Benchmarks",
    heroSubtitleFallback: "Push your clicks per second (CPS), typing speed (WPM), and calculation agility.",
    heroDescFallback:
        "Reduce the friction between recognition and physical execution. Our speed suite measures raw throughput across mouse clicking, touch typing, visual scanning, and mental arithmetic.",
    whatItCoversFallback:
        "Raw execution speed: clicks per second, typing WPM, mental math under time pressure, Schulte scanning, and fast grid clearing.",
    benefits: [
        {
            icon: MousePointer2,
            titleKey: "categoryHub.speed.benefit1Title",
            titleFallback: "Click Speed",
            descKey: "categoryHub.speed.benefit1Desc",
            descFallback: "Measure burst and sustained CPS output",
        },
        {
            icon: Keyboard,
            titleKey: "categoryHub.speed.benefit2Title",
            titleFallback: "Typing Speed",
            descKey: "categoryHub.speed.benefit2Desc",
            descFallback: "Benchmark net WPM and accuracy",
        },
        {
            icon: Calculator,
            titleKey: "categoryHub.speed.benefit3Title",
            titleFallback: "Mental Math",
            descKey: "categoryHub.speed.benefit3Desc",
            descFallback: "Solve rapid arithmetic under time limits",
        },
    ],
    tools: [
        {
            title: "Click Speed (CPS)",
            desc: "Calibrate your clicks-per-second click rate across timed intervals.",
            icon: MousePointer2,
            href: "/speed/click",
        },
        {
            title: "Schulte Table",
            desc: "Click shuffled numbers in order on a grid to train visual scanning speed.",
            icon: Grid3X3,
            href: "/speed/schulte-table",
        },
        {
            title: "Speed Math",
            desc: "Calculate arithmetic equations against a shrinking timer.",
            icon: Calculator,
            href: "/speed/math",
        },
        {
            title: "Typing Test",
            desc: "Verify your typing speed words-per-minute accuracy index.",
            icon: Keyboard,
            href: "/speed/typing",
        },
        {
            title: "Grid Selection",
            desc: "Identify and sweep highlighted boxes from standard arrays.",
            icon: Grid3X3,
            href: "/speed/grid",
        },
        {
            title: "Word Accuracy",
            desc: "Type fast-spawning terms with precision vocabulary trackers.",
            icon: Type,
            href: "/speed/words",
        },
        {
            title: "Number Rush",
            desc: "Visual sweep calibration to locate numbers 1 to N rapidly.",
            icon: Hash,
            href: "/speed/number-rush",
        },
        {
            title: "Quick Sort",
            desc: "Sort categorized items into buckets under speed ramps.",
            icon: ArrowUpDown,
            href: "/speed/quick-sort",
        },
    ],
};

export default function SpeedHubClient() {
    return <ArenaHubLayout config={SPEED_CONFIG} />;
}
