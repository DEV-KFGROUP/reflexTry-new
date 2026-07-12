"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Zap, Brain, Target, Gauge, Trophy, BarChart3, Flame, Award, BookOpen } from "lucide-react";
import Image from "next/image";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before rendering interactive elements
    useEffect(() => {
        setMounted(true);
    }, []);

    // Pre-compute nav links with game-themed icons and specific highlight colors
    const navLinks = [
        { name: "Home", href: "/", icon: Gamepad2, color: "group-hover:text-indigo-600" },
        { name: "Memory", href: "/memory", icon: Brain, color: "group-hover:text-purple-600" },
        { name: "Reflex", href: "/reflex", icon: Zap, color: "group-hover:text-amber-500" },
        { name: "Speed", href: "/speed", icon: Gauge, color: "group-hover:text-cyan-600" },
        { name: "Accuracy", href: "/accuracy", icon: Target, color: "group-hover:text-emerald-500" },
        { name: "Tools", href: "/tools", icon: null, color: "group-hover:text-slate-800" },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy, color: "group-hover:text-amber-600" },
        { name: "Blog", href: "/blog", icon: BookOpen, color: "group-hover:text-rose-500" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50">
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-[0_4px_30px_rgba(15,23,42,0.03)]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between min-h-[72px]">
                    
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white border border-slate-200 shadow-sm flex items-center justify-center group-hover:border-indigo-300 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.15)] transition-all duration-300">
                            <Image
                                src="/apple-icon.png"
                                alt="Reflextry Logo"
                                width={40}
                                height={40}
                                sizes="40px"
                                className="object-contain relative z-10 rounded-md group-hover:scale-105 transition-transform duration-300"
                                priority={true}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl sm:text-2xl font-mono font-black tracking-tighter text-slate-800 group-hover:text-indigo-600 transition-colors">
                                REFLEXTRY
                            </span>
                            <span className="text-[8px] font-mono font-bold text-slate-400 tracking-[0.25em] uppercase hidden sm:block">
                                Cognitive Lab
                            </span>
                        </div>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden lg:flex items-center gap-1.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="relative px-3.5 py-2 rounded-full text-sm font-mono font-bold text-slate-500 transition-all duration-300 group hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-sm flex items-center gap-2 overflow-hidden"
                            >
                                {/* Hover background effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                {link.icon && (
                                    <link.icon className={`w-4 h-4 text-slate-400 transition-colors duration-300 ${link.color} relative z-10`} aria-hidden="true" />
                                )}
                                <span className={`relative z-10 uppercase tracking-wide transition-colors duration-300 ${link.color}`}>
                                    {link.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {/* Mobile menu button */}
                    {mounted && (
                        <div className="lg:hidden flex items-center gap-3">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="relative p-2.5 text-slate-500 hover:text-indigo-600 transition-colors rounded-xl border border-slate-200 bg-white hover:bg-slate-50 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                aria-label={isOpen ? "Close menu" : "Open menu"}
                                aria-expanded={isOpen}
                            >
                                {isOpen ? (
                                    <X className="w-5 h-5 relative z-10" aria-hidden="true" />
                                ) : (
                                    <Menu className="w-5 h-5 relative z-10" aria-hidden="true" />
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
                                initial={{ opacity: 0, height: 0, y: -10 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="lg:hidden absolute top-[80px] left-4 right-4 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.1)] overflow-hidden z-50"
                            >
                                {/* Technical Decals on Mobile Menu */}
                                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-slate-200 pointer-events-none" />
                                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-slate-200 pointer-events-none" />
                                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-slate-200 pointer-events-none" />
                                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-slate-200 pointer-events-none" />

                                <div className="p-5 space-y-2 relative z-10">
                                    {navLinks.map((link, index) => (
                                        <motion.div
                                            key={link.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.04 }}
                                        >
                                            <Link
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className="group flex items-center gap-3 py-3 px-5 text-sm font-mono font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50 hover:shadow-inner transition-all rounded-2xl border border-transparent hover:border-slate-100"
                                            >
                                                {link.icon && (
                                                    <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center transition-colors ${link.color.replace('text-', 'bg-').replace('600', '100').replace('500', '100')}`}>
                                                        <link.icon className={`w-4 h-4 text-slate-400 group-hover:text-current transition-colors ${link.color}`} aria-hidden="true" />
                                                    </div>
                                                )}
                                                <span className={`flex-1 transition-colors ${link.color}`}>
                                                    {link.name}
                                                </span>
                                                <span className="text-slate-300 group-hover:text-indigo-400 transition-colors group-hover:translate-x-1 duration-300">
                                                    →
                                                </span>
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


