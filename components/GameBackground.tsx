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

/**
 * Enhanced Game-themed animated background component
 * Now with Esports-grade visual intensity options
 */
export function GameBackground({
    children,
    variant = "default",
    showParticles = true,
    showGrid = true,
    intensity = "high",
    className = "",
}: GameBackgroundProps) {
    const arenaColors: Record<string, string> = {
        default: "from-speed/10 via-reflex/8 to-speed/10",
        memory: "from-memory/15 via-memory/8 to-transparent",
        reflex: "from-reflex/15 via-reflex/8 to-transparent",
        speed: "from-speed/15 via-speed/8 to-transparent",
        gaming: "from-wisdom/15 via-wisdom/8 to-transparent",
        accuracy: "from-accuracy/15 via-accuracy/8 to-transparent",
    };

    const glowIntensity = {
        normal: { size: "w-72 h-72", opacity: "opacity-30" },
        high: { size: "w-96 h-96", opacity: "opacity-50" },
        esports: { size: "w-[32rem] h-[32rem]", opacity: "opacity-60" },
    };

    const gridOpacity = {
        normal: "0.02",
        high: "0.04",
        esports: "0.06",
    };

    const currentGlow = glowIntensity[intensity];

    return (
        <div className={`relative min-h-screen overflow-hidden bg-background ${className}`}>
            {/* Deep Space Background Gradient */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `
                        radial-gradient(ellipse at 20% 20%, hsl(var(--speed) / 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse at 80% 80%, hsl(var(--reflex) / 0.12) 0%, transparent 50%),
                        radial-gradient(ellipse at 50% 100%, hsl(var(--memory) / 0.08) 0%, transparent 40%),
                        hsl(var(--background))
                    `
                }}
            />

            {/* Animated Grid Background */}
            {showGrid && (
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(6, 182, 212, ${gridOpacity[intensity]}) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(6, 182, 212, ${gridOpacity[intensity]}) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px',
                        animation: 'grid-pulse 4s ease-in-out infinite',
                    }}
                />
            )}

            {/* Floating Particles */}
            {showParticles && <div className="game-particles" />}

            {/* Corner Spotlight Effects - Esports Grade */}
            <div
                className={`fixed top-0 left-0 ${currentGlow.size} bg-gradient-radial ${arenaColors[variant]} rounded-full blur-3xl ${currentGlow.opacity} pointer-events-none -translate-x-1/3 -translate-y-1/3`}
            />
            <div
                className={`fixed bottom-0 right-0 ${currentGlow.size} bg-gradient-radial ${arenaColors[variant]} rounded-full blur-3xl ${currentGlow.opacity} pointer-events-none translate-x-1/3 translate-y-1/3`}
            />

            {/* Center Stage Spotlight (Esports mode) */}
            {intensity === "esports" && (
                <div
                    className="fixed top-1/4 left-1/2 w-[40rem] h-[40rem] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(ellipse at center, hsl(var(--speed) / 0.1) 0%, transparent 70%)`,
                        animation: 'game-pulse 6s ease-in-out infinite',
                    }}
                />
            )}

            {/* Floating Game Icons (Decorative) */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                {/* Top Right Floating Element */}
                <div
                    className="absolute top-20 right-10 w-24 h-24 opacity-[0.08]"
                    style={{ animation: 'game-float-slow 8s ease-in-out infinite' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-speed w-full h-full">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                </div>

                {/* Bottom Left Floating Element */}
                <div
                    className="absolute bottom-32 left-16 w-20 h-20 opacity-[0.08]"
                    style={{ animation: 'game-float-slow 6s ease-in-out infinite', animationDelay: '-3s' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-reflex w-full h-full">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>

                {/* Center Right Floating Element */}
                <div
                    className="absolute top-1/2 right-20 w-16 h-16 opacity-[0.06]"
                    style={{ animation: 'game-float 5s ease-in-out infinite', animationDelay: '-1s' }}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-memory w-full h-full">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                    </svg>
                </div>

                {/* Additional decorative elements for esports mode */}
                {intensity === "esports" && (
                    <>
                        <div
                            className="absolute top-1/3 left-10 w-12 h-12 opacity-[0.05]"
                            style={{ animation: 'game-float 7s ease-in-out infinite', animationDelay: '-2s' }}
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="text-speed w-full h-full">
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                        </div>
                        <div
                            className="absolute bottom-1/4 right-1/3 w-14 h-14 opacity-[0.04]"
                            style={{ animation: 'game-float-slow 9s ease-in-out infinite', animationDelay: '-4s' }}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-wisdom w-full h-full">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        </div>
                    </>
                )}
            </div>

            {/* Scanline Overlay (subtle CRT effect) */}
            <div
                className="fixed inset-0 pointer-events-none z-[1] opacity-[0.02]"
                style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)',
                }}
            />

            {/* Main Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
