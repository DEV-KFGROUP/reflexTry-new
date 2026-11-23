"use client";

import { Orbit, Crosshair, Box, Cpu, Eye } from "lucide-react";
import { ArenaHubLayout, type ArenaHubConfig } from "@/components/ArenaHubLayout";

const LAB_3D_CONFIG: ArenaHubConfig = {
    category: "lab-3d",
    icon: Orbit,
    kicker: "3D Interactive Showcase",
    heroTitleFallback: "3D Interactive WebGL Lab",
    heroSubtitleFallback: "Explore three-dimensional gravity wells and depth-plane spatial reflexes in real time.",
    heroDescFallback:
        "Powered by live WebGL physics and 3D perspective rendering, these flagship simulations let you rotate around deformed spacetime grids, launch satellites into stable orbits, and track 3D targets across near, mid, and far depth planes.",
    whatItCoversFallback:
        "Hardware-accelerated 3D browser simulations featuring orbital astrophysics mechanics and perspective depth-plane target acquisition.",
    benefits: [
        {
            icon: Box,
            titleKey: "categoryHub.lab-3d.benefit1Title",
            titleFallback: "Real-Time WebGL 3D",
            descKey: "categoryHub.lab-3d.benefit1Desc",
            descFallback: "Interactive 3D camera controls and live lighting",
        },
        {
            icon: Eye,
            titleKey: "categoryHub.lab-3d.benefit2Title",
            titleFallback: "Depth Perception",
            descKey: "categoryHub.lab-3d.benefit2Desc",
            descFallback: "Train spatial judgment across near, mid, and far planes",
        },
        {
            icon: Cpu,
            titleKey: "categoryHub.lab-3d.benefit3Title",
            titleFallback: "Zero Downloads",
            descKey: "categoryHub.lab-3d.benefit3Desc",
            descFallback: "Adaptive rendering runs smoothly on laptops and desktops",
        },
    ],
    tools: [
        {
            title: "3D Solar Gravity Simulator",
            desc: "Orbit a live 3D spacetime gravity well, inspect planetary motion, and launch custom satellites.",
            icon: Orbit,
            href: "/lab-3d/solar-gravity",
        },
        {
            title: "3D Spatial Aim Arena",
            desc: "Acquire and strike 3D drone targets across near, mid, and far Z-depth planes with millisecond tracking.",
            icon: Crosshair,
            href: "/lab-3d/spatial-aim",
        },
    ],
};

export default function Lab3DHubClient() {
    return <ArenaHubLayout config={LAB_3D_CONFIG} />;
}
