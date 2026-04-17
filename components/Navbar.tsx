"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Zap, Brain, Target, Gauge, Trophy, BarChart3, Flame, Award } from "lucide-react";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

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
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md border-b border-border" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between min-h-[72px]">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-border shadow-sm flex items-center justify-center">
                            <Image
                                src="/apple-icon.png"
                                alt="Reflextry Logo"
                                width={40}
                                height={40}
                                sizes="40px"
                                className="object-contain relative z-10 rounded-md"
                                priority={true}
                            />
                        </div>
                        <span className="text-xl sm:text-2xl font-semibold tracking-tight whitespace-nowrap text-foreground">
                            Reflextry
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1">
                        {navLinks.slice(0, 8).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent transition-colors group flex items-center gap-2"
                            >
                                {link.icon && (
                                    <link.icon className="w-4 h-4 text-muted-foreground/80 transition-colors" aria-hidden="true" />
                                )}
                                <span className="relative z-10">{link.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    {mounted && (
                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors rounded-lg border border-border bg-white"
                                aria-label={isOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isOpen}
                            >
                                {isOpen ? (
                                    <X className="w-7 h-7 relative z-10" aria-hidden="true" />
                                ) : (
                                    <Menu className="w-7 h-7 relative z-10" aria-hidden="true" />
                                )}
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile nav panel */}
                {mounted && (
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: -8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.15 }}
                                className="lg:hidden mt-3 mb-4 rounded-2xl border border-border bg-white shadow-sm overflow-hidden"
                            >
                                <div className="p-3 space-y-1">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -12 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.03 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-3 py-3 px-4 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors rounded-xl border border-transparent"
                                            >
                                                {link.icon && (
                                                    <link.icon className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                                                )}
                                                <span className="flex-1">{link.name}</span>
                                                <span className="text-muted-foreground/60">→</span>
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

