"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Twitter, Instagram, Trophy, Heart, Gamepad2, Shield, Swords } from "lucide-react";
import Image from "next/image";

export function Footer() {
    const [mounted, setMounted] = useState(false);
    const [currentYear, setCurrentYear] = useState(2024);

    useEffect(() => {
        setMounted(true);
        // Set year on client side to ensure consistency
        setCurrentYear(new Date().getFullYear());
    }, []);

    return (
        <footer className="relative mt-20 border-t border-speed/20 bg-[hsl(222.2,71%,3%)] backdrop-blur-xl overflow-hidden">
            {/* Decorative Top Glow - Intensified */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-speed to-transparent shadow-[0_0_20px_rgba(0,229,255,0.6)]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg group-hover:ring-2 group-hover:ring-speed/50 transition-all">
                                <Image
                                    src="/apple-icon.png"
                                    alt="Reflextry Logo"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-speed via-reflex to-speed bg-clip-text text-transparent bg-[length:200%_auto] animate-shine">
                                Reflextry
                            </span>
                        </Link>
                        <p className="text-muted-foreground/80 max-w-xs leading-relaxed">
                            Train your brain, improve your reflexes, and compete with players worldwide.
                        </p>
                        <div className="flex gap-3">
                            {[
                                { icon: Twitter, href: "https://twitter.com/reflextry_", label: "Twitter", color: "hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]" },
                                { icon: Instagram, href: "https://instagram.com/reflextry_", label: "Instagram", color: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]" },
                                // { icon: Github, href: "#", label: "GitHub", color: "hover:bg-[#333] hover:text-white hover:border-[#333]" },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className={`p-2.5 bg-card/50 border border-white/10 rounded-lg text-muted-foreground transition-all duration-300 ${social.color} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1: Tools / Quests */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-6">
                            <Swords className="w-4 h-4 text-reflex" />
                            Training Tools
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/reflex" className="text-muted-foreground hover:text-reflex transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-reflex rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Reflex Tests
                                </Link>
                            </li>
                            <li>
                                <Link href="/speed" className="text-muted-foreground hover:text-speed transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-speed rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Speed Tests
                                </Link>
                            </li>
                            <li>
                                <Link href="/accuracy" className="text-muted-foreground hover:text-accuracy transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-accuracy rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Accuracy Tools
                                </Link>
                            </li>
                            <li>
                                <Link href="/memory" className="text-muted-foreground hover:text-memory transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-memory rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Memory Games
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 2: Features / Stats */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-6">
                            <Trophy className="w-4 h-4 text-wisdom" />
                            Features
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <Link href="/leaderboard" className="text-muted-foreground hover:text-wisdom transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-wisdom rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Leaderboard
                                </Link>
                            </li>
                            <li className="flex items-start">
                                <Link href="/statistics" className="text-muted-foreground hover:text-wisdom transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-wisdom rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Statistics
                                </Link>
                            </li>
                            <li className="flex items-start">
                                <Link href="/achievements" className="text-muted-foreground hover:text-wisdom transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-wisdom rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Achievements
                                </Link>
                            </li>
                            <li className="flex items-start">
                                <Link href="/challenges" className="text-muted-foreground hover:text-wisdom transition-colors flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-wisdom rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Daily Challenges
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Links Column 3: Legal / Guild Info */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider mb-6">
                            <Shield className="w-4 h-4 text-gray-400" />
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-white transition-colors capitalize flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-white transition-colors capitalize flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/cookies" className="text-muted-foreground hover:text-white transition-colors capitalize flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Cookie Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-white transition-colors capitalize flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-white transition-colors capitalize flex items-center gap-2 group">
                                    <span className="w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground/60">
                        &copy; {mounted ? currentYear : 2024} Reflextry. All rights reserved.
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground/60">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                        <span>for Gamers</span>
                    </div>
                </div>
            </div>

            {/* Bottom Decoration - Esports Grade */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-memory via-speed to-reflex opacity-40" />
        </footer>
    );
}
