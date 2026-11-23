"use client";

import {
    Activity,
    Award,
    BookOpen,
    Brain,
    Calculator,
    Compass,
    Crosshair,
    Crown,
    Eye,
    Flame,
    Grid3X3,
    Hash,
    Keyboard,
    Layers,
    MousePointerClick,
    Shield,
    Star,
    Target,
    Trophy,
    Zap,
} from "lucide-react";
import type { AchievementIconName } from "@/utils/achievements";

const ICON_MAP: Record<AchievementIconName, React.ElementType> = {
    target: Target,
    zap: Zap,
    flame: Flame,
    shield: Shield,
    brain: Brain,
    hash: Hash,
    book: BookOpen,
    layers: Layers,
    mouse: MousePointerClick,
    keyboard: Keyboard,
    calculator: Calculator,
    grid: Grid3X3,
    crosshair: Crosshair,
    activity: Activity,
    eye: Eye,
    star: Star,
    compass: Compass,
    award: Award,
    crown: Crown,
    trophy: Trophy,
};

export function AchievementIcon({
    name,
    className = "w-5 h-5",
}: {
    name?: AchievementIconName | string;
    className?: string;
}) {
    const Icon = (name && ICON_MAP[name as AchievementIconName]) || Award;
    return <Icon className={className} aria-hidden="true" />;
}
