"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Twitter, Instagram, Trophy, Heart, Shield, Swords, ArrowRight, BookOpen } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function Footer() {
    const [mounted, setMounted] = useState(false);
    const [currentYear, setCurrentYear] = useState(2024);

    useEffect(() => {
        setMounted(true);
        // Set year on client side to ensure consistency
        setCurrentYear(new Date().getFullYear());
    }, []);

    const FLOATING_SHAPES = [
        { value: "▲", x: "8%", y: "15%", size: "text-5xl", delay: 0, duration: 11, opacity: 0.05, rotate: 15 },
        { value: "⛶", x: "88%", y: "12%", size: "text-6xl", delay: 1, duration: 13, opacity: 0.04, rotate: -25 },
        { value: "●", x: "6%", y: "75%", size: "text-7xl", delay: 2, duration: 10, opacity: 0.05, rotate: 35 },
        { value: "■", x: "85%", y: "60%", size: "text-5xl", delay: 0.5, duration: 9, opacity: 0.03, rotate: -15 },
    ];

    return (
        <footer className="relative mt-20 bg-background border-t border-black/10 dark:border-white/10 overflow-hidden font-sans">
            {/* Background Grids */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.05)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-500/[0.02] blur-[140px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/[0.02] blur-[120px] rounded-full pointer-events-none z-0" />

            {/* Floating parallax elements */}
            {FLOATING_SHAPES.map((item, idx) => (
                <motion.div
                    key={idx}
                    className="absolute pointer-events-none select-none z-0"
                    style={{ left: item.x, top: item.y, opacity: item.opacity }}
                    animate={{ y: [0, -15, 0] }}
                    transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                >
                    <div
                        className={`${item.size} font-mono font-black text-foreground`}
                        style={{
                            transform: `perspective(800px) rotateX(25deg) rotateY(-20deg) rotateZ(${item.rotate}deg)`,
                        }}
                    >
                        {item.value}
                    </div>
                </motion.div>
            ))}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8 mb-16 relative">
                    
                    {/* Decal Corner Borders for the Grid area */}
                    <div className="absolute -top-4 -left-4 w-4 h-4 border-t-2 border-l-2 border-black/10 dark:border-white/10 pointer-events-none hidden lg:block" />
                    <div className="absolute -top-4 -right-4 w-4 h-4 border-t-2 border-r-2 border-black/10 dark:border-white/10 pointer-events-none hidden lg:block" />

                    {/* Brand Section */}
                    <div className="lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-3 group w-fit">
                            <div className="relative w-12 h-12 flex items-center justify-center overflow-hidden rounded-xl border border-black/10 dark:border-white/10 bg-white/10 dark:bg-white/5 shadow-sm group-hover:border-indigo-500/50 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.15)] transition-all duration-300">
                                <Image
                                    src="/apple-icon.png"
                                    alt="Reflextry Logo"
                                    width={48}
                                    height={48}
                                    className="object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-mono font-black text-foreground tracking-tighter group-hover:text-indigo-500 transition-colors">REFLEXTRY</span>
                                <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-[0.2em] uppercase">Cognitive Lab</span>
                            </div>
                        </Link>
                        <p className="text-muted-foreground text-sm max-w-sm leading-relaxed font-sans">
                            Advanced cognitive telemetry tools designed for gamers, students, and professionals. Train your brain, measure latency, and establish your baselines.
                        </p>
                        <div className="flex gap-3 pt-2">
                            {[
                                { icon: Twitter, href: "https://twitter.com/reflextry_", label: "Twitter", color: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/30" },
                                { icon: Instagram, href: "https://instagram.com/reflextry_", label: "Instagram", color: "hover:bg-[#E1306C]/10 hover:text-[#E1306C] hover:border-[#E1306C]/30" },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    className={`p-2.5 bg-white/10 dark:bg-white/5 border border-black/10 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-xl text-muted-foreground transition-all duration-300 ${social.color}`}
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-5 h-5" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Links Column 1: Tools / Quests */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-6">
                            <Swords className="w-4 h-4 text-indigo-500" />
                            Arenas
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Reflex Tests", href: "/reflex", color: "text-amber-500" },
                                { name: "Speed Tests", href: "/speed", color: "text-cyan-500" },
                                { name: "Accuracy Tools", href: "/accuracy", color: "text-emerald-500" },
                                { name: "Memory Games", href: "/memory", color: "text-purple-500" },
                                { name: "All Tools", href: "/tools", color: "text-indigo-500" },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowRight className={`w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 ${link.color}`} />
                                        <span className="relative">
                                            {link.name}
                                            <span className={`absolute -bottom-0.5 left-0 w-full h-[1px] bg-current opacity-0 group-hover:opacity-100 transition-opacity ${link.color.replace('text-', 'bg-')}`} />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 2: Features / Stats */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-6">
                            <Trophy className="w-4 h-4 text-amber-500" />
                            Features
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Leaderboard", href: "/leaderboard" },
                                { name: "Statistics", href: "/statistics" },
                                { name: "Achievements", href: "/achievements" },
                                { name: "Daily Challenges", href: "/challenges" },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-amber-500" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 3: Resources */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-6">
                            <BookOpen className="w-4 h-4 text-purple-500" />
                            Resources
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "Blog", href: "/blog" },
                                { name: "Science", href: "/science" },
                                { name: "Training Programs", href: "/training-programs" },
                                { name: "FAQ", href: "/faq" },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-purple-500" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Links Column 4: Legal / Guild Info */}
                    <div>
                        <h4 className="flex items-center gap-2 text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-6">
                            <Shield className="w-4 h-4 text-muted-foreground" />
                            Legal
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { name: "About Us", href: "/about" },
                                { name: "Privacy Policy", href: "/privacy" },
                                { name: "Cookie Policy", href: "/cookies" },
                                { name: "Terms of Service", href: "/terms" },
                                { name: "Contact Us", href: "/contact" },
                            ].map(link => (
                                <li key={link.name}>
                                    <Link href={link.href} className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-muted-foreground" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* SEO/AEO Global Context */}
                <div className="py-6 border-t border-black/10 dark:border-white/10 text-xs text-muted-foreground">
                    <details className="group cursor-pointer">
                        <summary className="font-mono uppercase tracking-widest text-center list-none flex items-center justify-center gap-2 hover:text-foreground transition-colors">
                            <span>About Reflextry Platform & Methodology</span>
                            <span className="transition group-open:rotate-180">▼</span>
                        </summary>
                        <div className="mt-6 text-sm text-muted-foreground/80 leading-relaxed max-w-5xl mx-auto space-y-4 text-justify px-4">
                            <p>
                                <strong className="text-foreground font-mono uppercase tracking-wide">Brain Training:</strong> We built Reflextry to give gamers and competitive players a raw, unfiltered look at their baseline mechanics. No fluff, just pure performance tracking. By pushing your working memory and visual pattern recognition to the limit every day, you force your brain to build faster, stronger neural pathways—a process known as neuroplasticity. We isolate specific cognitive loads (like spatial recall and sequence memory) so you can train exactly what you're weak at.
                            </p>
                            <p>
                                <strong className="text-foreground font-mono uppercase tracking-wide">Esports Latency:</strong> In competitive gaming, 50 milliseconds is the difference between clicking a head and getting sent back to the lobby. Our Speed and Reflex arenas strip away all external game mechanics to measure your raw biological reaction time. We track your Click-Per-Second (CPS), flick-shot accuracy, and raw tracking speed. We heavily optimized our testing environment to cut out browser-level input lag, giving you a true measurement of your hardware and nervous system working together. Use these tools to warm up your fast-twitch muscles before jumping into ranked.
                            </p>
                            <p>
                                <strong className="text-foreground font-mono uppercase tracking-wide">Accuracy:</strong> Speed means nothing if you miss. The Accuracy Hub forces you to lock in and prioritize precision over raw velocity. Through spatial grids, angle estimation, and color matching, you refine your fine motor control. Training speed and accuracy simultaneously teaches your central nervous system to hit complex mechanical movements efficiently. We save all your session data so you can actually see your performance curve go up over time. 10 minutes of focused practice here beats 5 hours of mindless grinding.
                            </p>
                            <p className="text-center mt-4">
                                <span className="font-bold text-foreground">Clinical Ref:</span> Consistent cognitive exercises are designed to leverage neuroplasticity. Read more about <a href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6128435/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-600 underline underline-offset-2 transition-colors">brain training research</a>.
                            </p>
                        </div>
                    </details>
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-black/10 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground flex items-center flex-wrap gap-2 justify-center">
                        <span>&copy; {mounted ? currentYear : 2024} REFLEXTRY. ALL RIGHTS RESERVED.</span>
                        <span className="hidden md:inline border-l border-black/10 dark:border-white/10 h-3 mx-1"></span>
                        <time dateTime="2026-07-09">LST UPDATE: JUL 2026</time>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
                        <span>BUILT WITH</span>
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 animate-pulse" />
                        <span>FOR GAMERS</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

