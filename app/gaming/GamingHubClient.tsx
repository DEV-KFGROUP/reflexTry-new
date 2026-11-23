"use client";

import { Crosshair, Zap, Gamepad2, Music, ShieldAlert, Brain, Target } from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const GAMING_CONFIG: ArenaHubConfig = {
    category: "gaming",
    icon: Gamepad2,
    kicker: "Gaming Arena",
    heroTitleFallback: "Esports Warmup & Aim Arena",
    heroSubtitleFallback:
        "Calibrate mouse flick shots, target tracking, and combat reflexes for competitive games.",
    heroDescFallback:
        "Built for competitive FPS and action players to warm up mouse control, tracking consistency, and split-second decision making directly in the browser.",
    whatItCoversFallback:
        "Flick shot aim, continuous target tracking, split-second combat reflexes, rhythm timing, and dodging obstacle streams.",
    benefits: [
        {
            icon: Crosshair,
            titleKey: "categoryHub.gaming.benefit1Title",
            titleFallback: "Flick Shots",
            descKey: "categoryHub.gaming.benefit1Desc",
            descFallback: "Rapid target acquisition and micro-adjustments",
        },
        {
            icon: Target,
            titleKey: "categoryHub.gaming.benefit2Title",
            titleFallback: "Tracking",
            descKey: "categoryHub.gaming.benefit2Desc",
            descFallback: "Smooth cursor follow on moving targets",
        },
        {
            icon: Zap,
            titleKey: "categoryHub.gaming.benefit3Title",
            titleFallback: "Combat Reflex",
            descKey: "categoryHub.gaming.benefit3Desc",
            descFallback: "Rapid directional defense and evasion",
        },
    ],
    tools: [
        {
            title: "Aim Trainer",
            desc: "Track and click moving targets to warm up FPS mouse control.",
            icon: Crosshair,
            href: "/gaming/aim",
        },
        {
            title: "RPG Reflex",
            desc: "Block incoming directional attacks in a gamified combat reaction drill.",
            icon: ShieldAlert,
            href: "/gaming/reaction",
        },
        {
            title: "Target Tracking",
            desc: "Continuous smooth tracking accuracy test on evasive targets.",
            icon: Target,
            href: "/gaming/target-tracking",
        },
        {
            title: "Endless Dodge",
            desc: "Survive incoming projectiles and expanding hazards as pace accelerates.",
            icon: Zap,
            href: "/gaming/endless-dodge",
        },
        {
            title: "Stroop Drop",
            desc: "Match ink colors of falling words under cognitive interference.",
            icon: Brain,
            href: "/gaming/stroop-drop",
        },
        {
            title: "Flick Shot",
            desc: "Snap to small targets before they vanish while avoiding decoys.",
            icon: Crosshair,
            href: "/gaming/flick-shot",
        },
        {
            title: "Rhythm Tap",
            desc: "Hit falling calibration bars on the beat across multi-key lanes.",
            icon: Music,
            href: "/gaming/rhythm-tap",
        },
    ],
};

export default function GamingHubClient() {
    return <ArenaHubLayout config={GAMING_CONFIG} />;
}
