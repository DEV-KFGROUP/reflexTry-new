"use client";

import { Target, Keyboard, Crosshair, Palette, Eye, Brain, Shapes, Compass } from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const ACCURACY_CONFIG: ArenaHubConfig = {
    category: "accuracy",
    icon: Target,
    kicker: "Accuracy Arena",
    heroTitleFallback: "Aim & Precision Training",
    heroSubtitleFallback:
        "Refine your micro-target accuracy, hand-eye coordination, and visual estimation.",
    heroDescFallback:
        "Speed means little without control. The accuracy suite trains exactness over raw velocity to eliminate input errors and strengthen fine motor consistency.",
    whatItCoversFallback:
        "Precision over pace: color matching, angle estimation, pattern matching, mental rotation, data entry, and pixel-level clicking.",
    benefits: [
        {
            icon: Target,
            titleKey: "categoryHub.accuracy.benefit1Title",
            titleFallback: "Precision Aim",
            descKey: "categoryHub.accuracy.benefit1Desc",
            descFallback: "Micro-target cursor control",
        },
        {
            icon: Compass,
            titleKey: "categoryHub.accuracy.benefit2Title",
            titleFallback: "Spatial Angles",
            descKey: "categoryHub.accuracy.benefit2Desc",
            descFallback: "Visual geometry and angle estimation",
        },
        {
            icon: Shapes,
            titleKey: "categoryHub.accuracy.benefit3Title",
            titleFallback: "Visual Match",
            descKey: "categoryHub.accuracy.benefit3Desc",
            descFallback: "Pattern and color discrimination",
        },
    ],
    tools: [
        {
            title: "Image Recognition",
            desc: "Scan and identify blurred, rotated, and distorted visual targets.",
            icon: Eye,
            href: "/accuracy/image-recognition",
        },
        {
            title: "Color Blindness Test",
            desc: "Find hidden numbers or shapes within generated Ishihara-style dot plates.",
            icon: Eye,
            href: "/accuracy/color-blindness",
        },
        {
            title: "Mental Rotation",
            desc: "Determine if 3D shapes are identical or mirrored under rotation.",
            icon: Brain,
            href: "/accuracy/mental-rotation",
        },
        {
            title: "Data Entry Accuracy",
            desc: "Type complex alphanumeric strings and code fragments with high precision.",
            icon: Keyboard,
            href: "/accuracy/data",
        },
        {
            title: "Pattern Matching",
            desc: "Match spatial sequences of symbols amidst visually similar decoys.",
            icon: Shapes,
            href: "/accuracy/pattern-matching",
        },
        {
            title: "Precision Clicking",
            desc: "Aim and click small drifting targets without missing the hit zone.",
            icon: Target,
            href: "/accuracy/precision-click",
        },
        {
            title: "Angle Estimation",
            desc: "Observe visual geometry and estimate angles under rotated baselines.",
            icon: Crosshair,
            href: "/accuracy/angle-estimation",
        },
        {
            title: "Color Match",
            desc: "Recall flashed target colors and replicate them accurately with RGB sliders.",
            icon: Palette,
            href: "/accuracy/color-match",
        },
    ],
};

export default function AccuracyPageClient() {
    return <ArenaHubLayout config={ACCURACY_CONFIG} />;
}
