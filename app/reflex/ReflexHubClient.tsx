"use client";

import {
    Zap,
    Timer,
    Activity,
    Move,
    Volume2,
    Eye,
    Palette,
    LayoutGrid,
    CircleDot,
    Crosshair,
} from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const REFLEX_CONFIG: ArenaHubConfig = {
    category: "reflex",
    icon: Zap,
    kicker: "Reflex Arena",
    heroTitleFallback: "Reflex Training & Reaction Games",
    heroSubtitleFallback: "Measure your visual and auditory reaction times down to the millisecond.",
    heroDescFallback:
        "In competitive sports, esports, and driving, response latency is critical. Our reflex suite isolates visual, auditory, and directional pathways so you can measure your baseline and train consistently.",
    whatItCoversFallback:
        "Visual and auditory reaction tests timed in milliseconds—simple reaction, sound cues, grid clicks, peripheral targets, and multi-stimulus choices.",
    benefits: [
        {
            icon: Zap,
            titleKey: "categoryHub.reflex.benefit1Title",
            titleFallback: "Visual Reflex",
            descKey: "categoryHub.reflex.benefit1Desc",
            descFallback: "React to instant visual color and shape cues",
        },
        {
            icon: Volume2,
            titleKey: "categoryHub.reflex.benefit2Title",
            titleFallback: "Audio Reflex",
            descKey: "categoryHub.reflex.benefit2Desc",
            descFallback: "Measure millisecond auditory response speed",
        },
        {
            icon: Crosshair,
            titleKey: "categoryHub.reflex.benefit3Title",
            titleFallback: "Spatial Reflex",
            descKey: "categoryHub.reflex.benefit3Desc",
            descFallback: "Track and strike cues across the full screen",
        },
    ],
    tools: [
        {
            title: "Reaction Time",
            desc: "Test raw visual reflex click response speeds under classic light cues.",
            icon: Zap,
            href: "/reflex/reaction",
        },
        {
            title: "Time Perception",
            desc: "Test your internal clock by holding a button for the exact requested duration.",
            icon: Timer,
            href: "/reflex/time-perception",
        },
        {
            title: "Go / No-Go",
            desc: "Press on green Go trials and withhold on red No-Go to measure inhibitory control.",
            icon: CircleDot,
            href: "/reflex/go-no-go",
        },
        {
            title: "Flanker Task",
            desc: "Respond to the center arrow only while ignoring congruent or incongruent flankers.",
            icon: Move,
            href: "/reflex/flanker",
        },
        {
            title: "Choice Reaction",
            desc: "Click the lit colored box as fast as possible across multiple choice targets.",
            icon: LayoutGrid,
            href: "/reflex/choice-reaction",
        },
        {
            title: "Sound Reflex",
            desc: "Measure auditory reflex triggers and millisecond latency via sound pulses.",
            icon: Volume2,
            href: "/reflex/sound",
        },
        {
            title: "Directional Reflex",
            desc: "Test cognitive direction translation using directional arrow cues.",
            icon: Move,
            href: "/reflex/direction",
        },
        {
            title: "Peripheral Vision",
            desc: "React to shapes spawning in peripheral fields away from center anchors.",
            icon: Eye,
            href: "/reflex/peripheral",
        },
        {
            title: "Grid Shot",
            desc: "Click transient targets scattered in standard aim matrix layouts.",
            icon: Activity,
            href: "/reflex/grid",
        },
        {
            title: "Multi-Stimulus",
            desc: "Selective attention test reacting only to targets while avoiding decoy symbols.",
            icon: Zap,
            href: "/reflex/multi-stimulus",
        },
        {
            title: "Sequence Reaction",
            desc: "Click rapid sequence points in specified incremental patterns.",
            icon: Activity,
            href: "/reflex/sequence-reaction",
        },
        {
            title: "Whack-a-Mole",
            desc: "Test fine motor click speed by striking targets before they vanish.",
            icon: Crosshair,
            href: "/reflex/whack-a-mole",
        },
        {
            title: "Color Switch",
            desc: "Ignore word meaning and strike only the literal ink colors shown.",
            icon: Palette,
            href: "/reflex/color-switch",
        },
    ],
};

export default function ReflexHubClient() {
    return <ArenaHubLayout config={REFLEX_CONFIG} />;
}
