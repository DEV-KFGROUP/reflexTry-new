"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
    Activity,
    ArrowUpDown,
    Atom,
    BookOpen,
    BookOpenCheck,
    Brain,
    Calculator,
    Clock,
    Compass,
    Crosshair,
    Crown,
    Eye,
    Gamepad2,
    Grid3X3,
    Hash,
    Keyboard,
    Layers,
    LayoutGrid,
    MousePointer2,
    Move,
    Orbit,
    Palette,
    Route,
    Scale,
    Sparkles,
    Sun,
    Swords,
    Target,
    Type,
    Volume2,
    Zap,
    type LucideIcon,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
    resolveToolIconSpec,
    type FallbackLucideName,
    type Tool3DIconSpec,
} from "@/lib/icons/tool-3d-catalog";
import { getCachedToolIconUrl } from "@/lib/three/icon-cache";

const Tool3DInspectModal = dynamic(
    () =>
        import("@/components/Tool3DInspectModal").then((mod) => ({
            default: mod.Tool3DInspectModal,
        })),
    { ssr: false }
);

export type ToolIconVariant = "3d" | "3d-pedestal" | "3d-floating" | "flat";
export type ToolIconSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface ToolIconProps {
    /** Tool slug, TOOL_MAPPING key, arena ID, or route href (e.g. "/reflex/reaction"). */
    toolId: string;
    /** Visual presentation variant. Defaults to tactile framed "3d". */
    variant?: ToolIconVariant;
    /** Icon container size token. Defaults to "md". */
    size?: ToolIconSize;
    /** When true, clicking the icon opens a live interactive OrbitControls 3D inspector. */
    interactive?: boolean;
    /** When true, schedules an offscreen WebGL 3D snapshot render. Defaults to false for zero TBT on catalog grids. */
    eager3D?: boolean;
    /** Optional accessible title used in interactive inspector or tooltip. */
    title?: string;
    /** Optional override for visual label accessibility. */
    decorative?: boolean;
    className?: string;
}

const LUCIDE_MAP: Record<FallbackLucideName, LucideIcon> = {
    Crown,
    Sun,
    Route,
    Grid3X3,
    LayoutGrid,
    Layers,
    Compass,
    Target,
    ArrowUpDown,
    Zap,
    Clock,
    Volume2,
    Eye,
    Move,
    Brain,
    Hash,
    Palette,
    Keyboard,
    MousePointer2,
    Calculator,
    Type,
    Gamepad2,
    Atom,
    Orbit,
    Swords,
    BookOpenCheck,
    Sparkles,
    Crosshair,
    Scale,
    BookOpen,
    Activity,
};

const SIZE_CLASSES: Record<
    ToolIconSize,
    { box: string; img: string; fallback: string; radius: string }
> = {
    xs: { box: "w-7 h-7", img: "w-6 h-6", fallback: "w-3.5 h-3.5", radius: "rounded-lg" },
    sm: { box: "w-9 h-9", img: "w-8 h-8", fallback: "w-4 h-4", radius: "rounded-lg" },
    md: { box: "w-11 h-11", img: "w-10 h-10", fallback: "w-5 h-5", radius: "rounded-xl" },
    lg: { box: "w-14 h-14", img: "w-12 h-12", fallback: "w-6 h-6", radius: "rounded-xl" },
    xl: { box: "w-16 h-16", img: "w-14 h-14", fallback: "w-7 h-7", radius: "rounded-2xl" },
};

const VARIANT_CLASSES: Record<ToolIconVariant, string> = {
    "3d": "bg-[#FAF9F6] border border-[#E6E3DB] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_2px_6px_-2px_rgba(22,22,20,0.08)]",
    "3d-pedestal":
        "bg-[#F3F1EB] border border-[#D8D4C9] shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_4px_10px_-3px_rgba(22,22,20,0.12)]",
    "3d-floating": "bg-transparent border-0 shadow-none",
    flat: "bg-[#FAF9F6] border border-[#E6E3DB]",
};

/**
 * Reusable ToolIcon component supporting tactile framed variants
 * ("3d", "3d-pedestal", "3d-floating") and a minimal clinical "flat" variant.
 *
 * Renders the crisp vector icon immediately on first paint with zero main-thread
 * WebGL overhead by default (0ms Total Blocking Time), and lazily loads Three.js
 * only when interactive 3D inspection or eager3D is explicitly requested.
 */
export function ToolIcon({
    toolId,
    variant = "3d",
    size = "md",
    interactive = false,
    eager3D = false,
    title,
    decorative = true,
    className = "",
}: ToolIconProps) {
    const spec: Tool3DIconSpec = useMemo(() => resolveToolIconSpec(toolId), [toolId]);
    const is3D = variant !== "flat";
    const containerRef = useRef<HTMLSpanElement | null>(null);
    const [dataUrl, setDataUrl] = useState<string | null>(() =>
        is3D && eager3D ? getCachedToolIconUrl(spec) : null
    );
    const [inspectOpen, setInspectOpen] = useState(false);

    useEffect(() => {
        if (!is3D || !eager3D) return;
        const cached = getCachedToolIconUrl(spec);
        if (cached) {
            setDataUrl(cached);
            return;
        }

        let cancelled = false;
        let requested = false;
        let idleTimer: ReturnType<typeof setTimeout> | null = null;

        const trigger = (priority: boolean) => {
            if (requested || cancelled) return;
            requested = true;
            const runSnapshot = () => {
                if (cancelled) return;
                import("@/lib/three/icon-renderer")
                    .then((mod) => mod.requestToolIconSnapshot(spec, priority))
                    .then((url) => {
                        if (!cancelled && url) setDataUrl(url);
                    })
                    .catch(() => {
                        // Keep vector fallback if WebGL or dynamic chunk is unavailable
                    });
            };

            if (typeof window !== "undefined" && typeof window.requestIdleCallback === "function") {
                window.requestIdleCallback(runSnapshot, { timeout: 4000 });
            } else {
                idleTimer = setTimeout(runSnapshot, 250);
            }
        };

        const el = containerRef.current;
        if (typeof IntersectionObserver !== "undefined" && el) {
            const observer = new IntersectionObserver(
                (entries) => {
                    if (entries.some((e) => e.isIntersecting)) {
                        observer.disconnect();
                        trigger(true);
                    }
                },
                { rootMargin: "120px" }
            );
            observer.observe(el);
            return () => {
                cancelled = true;
                if (idleTimer !== null) clearTimeout(idleTimer);
                observer.disconnect();
            };
        }

        trigger(false);
        return () => {
            cancelled = true;
            if (idleTimer !== null) clearTimeout(idleTimer);
        };
    }, [is3D, eager3D, spec]);

    const sizeStyles = SIZE_CLASSES[size];
    const variantStyles = VARIANT_CLASSES[variant];
    const FallbackIcon = LUCIDE_MAP[spec.fallbackLucide] ?? Brain;

    const innerContent = (
        <span
            ref={containerRef}
            data-tool-icon={spec.id}
            data-tool-icon-variant={variant}
            data-tool-icon-archetype={spec.archetype}
            className={`relative inline-flex items-center justify-center shrink-0 select-none transition-transform duration-200 ${sizeStyles.box} ${sizeStyles.radius} ${variantStyles} ${
                interactive
                    ? "group-hover:-translate-y-0.5 hover:border-[#1E40AF] cursor-pointer"
                    : "group-hover:-translate-y-0.5"
            } ${className}`}
            title={interactive ? `Inspect 3D icon: ${title || spec.visualLabel}` : title}
            aria-hidden={decorative && !interactive ? true : undefined}
        >
            {is3D && dataUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                    src={dataUrl}
                    alt={decorative ? "" : title || spec.visualLabel}
                    referrerPolicy="no-referrer"
                    draggable={false}
                    className={`${sizeStyles.img} object-contain pointer-events-none transition-opacity duration-200`}
                />
            ) : (
                <FallbackIcon
                    className={`${sizeStyles.fallback} transition-colors`}
                    style={{ color: variant === "flat" ? "#57554E" : spec.primaryColor }}
                    aria-hidden="true"
                />
            )}
        </span>
    );

    if (!interactive) {
        return innerContent;
    }

    return (
        <>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setInspectOpen(true);
                }}
                aria-label={`Inspect 3D visual for ${title || spec.visualLabel}`}
                className="inline-flex items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2"
            >
                {innerContent}
            </button>
            {inspectOpen && (
                <Tool3DInspectModal
                    spec={spec}
                    title={title}
                    onClose={() => setInspectOpen(false)}
                />
            )}
        </>
    );
}
