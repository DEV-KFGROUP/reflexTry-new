"use client";

import { ReactNode } from "react";

interface GameBackgroundProps {
    children: ReactNode;
    variant?: "default" | "memory" | "reflex" | "speed" | "gaming" | "accuracy";
    showParticles?: boolean;
    showGrid?: boolean;
    intensity?: "normal" | "high" | "esports";
    className?: string;
}

export function GameBackground({
    children,
    className = "",
}: GameBackgroundProps) {
    return (
        <div className={`relative min-h-screen overflow-hidden bg-background ${className}`}>
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(circle at top, rgba(255,255,255,0.9) 0%, rgba(248,250,252,1) 45%, rgba(241,245,249,1) 100%),
                        hsl(var(--background))
                    `
                }}
            />

            {/* Main Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
