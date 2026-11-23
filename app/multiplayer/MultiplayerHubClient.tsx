"use client";

import { Swords, Zap, Calculator, Crosshair, Users, Keyboard, Trophy } from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const MULTIPLAYER_CONFIG: ArenaHubConfig = {
    category: "multiplayer",
    icon: Swords,
    kicker: "2-Player Battle Arena",
    heroTitleFallback: "2-Player Split-Screen Battles",
    heroSubtitleFallback: "Challenge a friend or classmate head-to-head on one keyboard or touch screen.",
    heroDescFallback:
        "No matchmaking queues or logins needed. Share one screen for millisecond reaction showdowns, rapid arithmetic tug-of-war, and wind-adjusted gravity cannon artillery battles.",
    whatItCoversFallback:
        "Local 2-player competitive brain and STEM games engineered for classrooms, study groups, and friendly couch rivalries.",
    benefits: [
        {
            icon: Keyboard,
            titleKey: "categoryHub.multiplayer.benefit1Title",
            titleFallback: "Shared Keyboard & Touch",
            descKey: "categoryHub.multiplayer.benefit1Desc",
            descFallback: "Left vs. right controls work on laptops and tablets",
        },
        {
            icon: Users,
            titleKey: "categoryHub.multiplayer.benefit2Title",
            titleFallback: "Classroom Ready",
            descKey: "categoryHub.multiplayer.benefit2Desc",
            descFallback: "Difficulty tiers for kids, students, and pros",
        },
        {
            icon: Trophy,
            titleKey: "categoryHub.multiplayer.benefit3Title",
            titleFallback: "Fair Millisecond Scoring",
            descKey: "categoryHub.multiplayer.benefit3Desc",
            descFallback: "False-start detection and instant match stats",
        },
    ],
    tools: [
        {
            title: "2-Player Reaction Duel",
            desc: "Best-of-5 millisecond reflex showdown (A vs L or Left/Right tap) with false-start detection.",
            icon: Zap,
            href: "/multiplayer/reaction-duel",
        },
        {
            title: "Math Tug-of-War",
            desc: "Solve arithmetic faster than your rival to pull the tug-of-war rope across your victory line.",
            icon: Calculator,
            href: "/multiplayer/math-tug-of-war",
        },
        {
            title: "Gravity Cannon Battle",
            desc: "Turn-based 2D artillery across mountain terrain with shifting wind and Earth, Mars, or Moon gravity.",
            icon: Crosshair,
            href: "/multiplayer/cannon-battle",
        },
    ],
};

export default function MultiplayerHubClient() {
    return <ArenaHubLayout config={MULTIPLAYER_CONFIG} />;
}
