"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Zap, Brain, Target, Gauge, Trophy, BarChart3, Flame, Award } from "lucide-react";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();

    // Ensure component is mounted before rendering interactive elements
    useEffect(() => {
        setMounted(true);
    }, []);

    // Pre-compute nav links with game-themed icons
    const navLinks = [
        { name: "Home", href: "/", icon: Gamepad2 },
        { name: "Blog", href: "/blog", icon: null },
        { name: "All Tools", href: "/tools", icon: null },
        { name: "Memory", href: "/memory", icon: Brain },
        { name: "Speed", href: "/speed", icon: Gauge },
        { name: "Reflex", href: "/reflex", icon: Zap },
        { name: "Accuracy", href: "/accuracy", icon: Target },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "Statistics", href: "/statistics", icon: BarChart3 },
        { name: "Challenges", href: "/challenges", icon: Flame },
        { name: "Achievements", href: "/achievements", icon: Award },
    ];



    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Glassmorphism Background with HUD-style border */}
            <div className="absolute inset-0 bg-background/70 backdrop-blur-xl border-b border-speed/20 shadow-[0_4px_30px_rgba(6,182,212,0.1)]" />

            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-speed/40" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-speed/40" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo with neon glow effect */}
                    <Link href="/" className="flex items-center gap-4 group relative">
                        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
                            {/* Glow effect behind logo */}
                            <div className="absolute inset-0 bg-speed/30 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <Image
                                src="/apple-icon.png"
                                alt="Reflextry Logo"
                                width={40}
                                height={40}
                                sizes="40px"
                                className="object-contain group-hover:scale-110 transition-transform relative z-10 rounded-lg"
                                priority={true}
                            />
                        </div>
                        <span className="text-2xl font-bold tracking-tighter whitespace-nowrap transition-all" style={{ color: '#22d3ee' }}>
                            Reflextry
                        </span>
                        {/* Animated underline */}
                        <span className="absolute -bottom-1 left-14 right-0 h-0.5 bg-gradient-to-r from-speed to-reflex scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                    </Link>

                    {/* Desktop Nav - Game HUD Style */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.slice(0, 7).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-3 py-2 text-muted-foreground hover:text-speed transition-all duration-300 font-medium group flex items-center gap-1.5"
                            >
                                {/* Hover background glow */}
                                <span className="absolute inset-0 bg-speed/0 group-hover:bg-speed/10 rounded-lg transition-all duration-300" />
                                {link.icon && <link.icon className="w-4 h-4 relative z-10 opacity-70 group-hover:opacity-100" />}
                                <span className="relative z-10 text-sm">{link.name}</span>
                                {/* Bottom glow line */}
                                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-speed group-hover:w-3/4 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                            </Link>
                        ))}

                        {/* Mobile Menu Button - Game Controller Style */}
                        {mounted && (
                            <div className="md:hidden flex items-center gap-3">
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className="relative p-2 text-muted-foreground hover:text-speed transition-all group"
                                    aria-label={isOpen ? "Close menu" : "Open menu"}
                                    aria-expanded={isOpen}
                                >
                                    {/* Button glow */}
                                    <span className="absolute inset-0 bg-speed/0 group-hover:bg-speed/10 rounded-lg transition-all" />
                                    {isOpen ? (
                                        <X className="w-7 h-7 relative z-10" aria-hidden="true" />
                                    ) : (
                                        <Menu className="w-7 h-7 relative z-10" aria-hidden="true" />
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Nav - Game Panel Style */}
                {mounted && (
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="md:hidden relative overflow-hidden"
                            >
                                {/* Glassmorphism background */}
                                <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-b border-speed/20" />

                                <div className="relative px-4 py-6 space-y-1">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 py-3 px-4 text-lg font-medium text-muted-foreground hover:text-speed hover:bg-speed/10 rounded-lg transition-all group"
                                            >
                                                {link.icon && (
                                                    <link.icon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                                                )}
                                                <span>{link.name}</span>
                                                {/* Arrow indicator */}
                                                <span className="ml-auto opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all">→</span>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}
            </div>
        </nav>
    );
}

