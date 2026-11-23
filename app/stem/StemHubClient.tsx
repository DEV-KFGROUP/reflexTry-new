"use client";

import { Atom, Orbit, Sparkles, Crosshair, Scale, Compass, Calculator, FlaskConical } from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const STEM_CONFIG: ArenaHubConfig = {
    category: "stem",
    icon: Atom,
    kicker: "STEM & Physics Lab",
    heroTitleFallback: "STEM & Physics Visual Lab",
    heroSubtitleFallback: "See gravity, optics, kinematics, and torque come alive with live equations.",
    heroDescFallback:
        "Turn abstract textbook physics and math formulas into hands-on visual experiments. Drag sliders, launch orbits, bounce laser beams, and solve torque balance puzzles right in your browser.",
    whatItCoversFallback:
        "Interactive 2D physics and math visualizers covering gravitational free-fall, orbital speed, geometric mirror reflection, parabolic projectile motion, and rotational lever equilibrium.",
    benefits: [
        {
            icon: FlaskConical,
            titleKey: "categoryHub.stem.benefit1Title",
            titleFallback: "Real-Time Equations",
            descKey: "categoryHub.stem.benefit1Desc",
            descFallback: "Watch formulas update live as you change variables",
        },
        {
            icon: Compass,
            titleKey: "categoryHub.stem.benefit2Title",
            titleFallback: "Visual Intuition",
            descKey: "categoryHub.stem.benefit2Desc",
            descFallback: "Inspect vectors, surface normals, and ghost trails",
        },
        {
            icon: Calculator,
            titleKey: "categoryHub.stem.benefit3Title",
            titleFallback: "Challenge Modes",
            descKey: "categoryHub.stem.benefit3Desc",
            descFallback: "Test your understanding with scored student missions",
        },
    ],
    tools: [
        {
            title: "Gravity & Orbit Lab",
            desc: "Compare free-fall across Earth, Moon, Mars, and Jupiter or launch a stable orbital satellite.",
            icon: Orbit,
            href: "/stem/gravity-lab",
        },
        {
            title: "Laser Reflection Optics",
            desc: "Rotate mirrors to bounce laser rays around barriers and master the Law of Reflection.",
            icon: Sparkles,
            href: "/stem/laser-reflection",
        },
        {
            title: "Projectile Cannon Physics",
            desc: "Dial angle, velocity, wind, and gravity to land parabolic shots on moving targets.",
            icon: Crosshair,
            href: "/stem/projectile-cannon",
        },
        {
            title: "Seesaw Torque Balance",
            desc: "Balance weights along a lever arm using torque equations in sandbox or timed challenge mode.",
            icon: Scale,
            href: "/stem/torque-balance",
        },
    ],
};

export default function StemHubClient() {
    return <ArenaHubLayout config={STEM_CONFIG} />;
}
