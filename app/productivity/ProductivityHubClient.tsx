"use client";

import {
    BookOpenCheck,
    BookOpen,
    Calculator,
    Clock,
    BarChart3,
    CheckCircle2,
    Timer,
    LineChart,
    ArrowLeftRight,
    GraduationCap,
    Layers,
} from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const PRODUCTIVITY_CONFIG: ArenaHubConfig = {
    category: "productivity",
    icon: BookOpenCheck,
    kicker: "Student & Work Suite",
    heroTitleFallback: "Real Student & Work Utilities",
    heroSubtitleFallback: "Calculators, scientific converters, study flashcards, reading pace, and focus tools.",
    heroDescFallback:
        "Practical, distraction-free browser tools built for daily studying, STEM coursework, and office work. Graph equations, convert scientific units, plan your GPA, master flashcards, and benchmark reading or 10-key speed.",
    whatItCoversFallback:
        "Seven focused utilities covering 2D function graphing, scientific unit conversion & physics solvers, GPA/final-exam math, spaced-repetition flashcards, speed reading, 10-key KPH, and focus sprints.",
    benefits: [
        {
            icon: CheckCircle2,
            titleKey: "categoryHub.productivity.benefit1Title",
            titleFallback: "Real Daily Utilities",
            descKey: "categoryHub.productivity.benefit1Desc",
            descFallback: "Built for real homework, engineering, and desk workflows",
        },
        {
            icon: BarChart3,
            titleKey: "categoryHub.productivity.benefit2Title",
            titleFallback: "Local Persistence",
            descKey: "categoryHub.productivity.benefit2Desc",
            descFallback: "Your GPA courses and custom flashcards stay saved in your browser",
        },
        {
            icon: Timer,
            titleKey: "categoryHub.productivity.benefit3Title",
            titleFallback: "Zero Sign-Up Needed",
            descKey: "categoryHub.productivity.benefit3Desc",
            descFallback: "Instant, ad-light, keyboard-friendly workspace tools",
        },
    ],
    tools: [
        {
            title: "Scientific & Graphing Calculator",
            desc: "Plot multiple y = f(x) curves with live coordinate tracing plus a full scientific keypad and calculation tape.",
            icon: LineChart,
            href: "/productivity/graphing-calculator",
        },
        {
            title: "Unit Converter & Formula Solver",
            desc: "Convert Length, Mass, Temperature, Speed, Energy, Pressure, and Data plus solve Kinetic Energy and Ohm's Law.",
            icon: ArrowLeftRight,
            href: "/productivity/unit-converter",
        },
        {
            title: "GPA & Final Exam Calculator",
            desc: "Track semester and cumulative 4.0 GPA with saved courses and solve what score you need on your final exam.",
            icon: GraduationCap,
            href: "/productivity/gpa-calculator",
        },
        {
            title: "Study Flashcards Studio",
            desc: "Review built-in Physics, Algorithms, and Biology decks or build your own spaced-repetition cards with keyboard shortcuts.",
            icon: Layers,
            href: "/productivity/flashcards",
        },
        {
            title: "Speed Reading & Comprehension",
            desc: "Read curated topics in Paced Highlight or RSVP flash mode, then pass a quiz for Effective WPM.",
            icon: BookOpen,
            href: "/productivity/speed-reading",
        },
        {
            title: "10-Key Numpad Speed Test",
            desc: "Benchmark numeric entry KPH and accuracy across Accounting Invoices, Integers, and Mixed SKUs.",
            icon: Calculator,
            href: "/productivity/ten-key",
        },
        {
            title: "Focus Sprint & Fatigue Tracker",
            desc: "Combine a wall-clock Pomodoro work sprint with pre- and post-session reaction baseline checks.",
            icon: Clock,
            href: "/productivity/focus-sprint",
        },
    ],
};

export default function ProductivityHubClient() {
    return <ArenaHubLayout config={PRODUCTIVITY_CONFIG} />;
}
