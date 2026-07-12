"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Target, Zap, Users, Heart, Trophy, Sparkles, Brain, Shield, BarChart3, Star, ArrowRight, Code2, Globe } from "lucide-react";
import Image from "next/image";

export default function AboutClient() {
    const values = [
        {
            icon: Target,
            title: "Accuracy",
            description: "We provide precise measurements and reliable testing methods to track your true performance capabilities.",
            color: "text-cyan-600",
            bg: "bg-cyan-50 border-cyan-200",
            glow: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
            accent: "from-cyan-500/20 to-cyan-500/5",
            tag: "PRECISION",
        },
        {
            icon: Zap,
            title: "Innovation",
            description: "Constantly developing new ways to challenge both cognitive and physical response times.",
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-200",
            glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
            accent: "from-amber-500/20 to-amber-500/5",
            tag: "EVOLUTION",
        },
        {
            icon: Users,
            title: "Accessibility",
            description: "Making professional-grade testing tools available to everyone globally, completely free of charge.",
            color: "text-violet-600",
            bg: "bg-violet-50 border-violet-200",
            glow: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
            accent: "from-violet-500/20 to-violet-500/5",
            tag: "GLOBAL",
        },
        {
            icon: Heart,
            title: "User First",
            description: "Building community-driven features and listening carefully to player feedback.",
            color: "text-rose-600",
            bg: "bg-rose-50 border-rose-200",
            glow: "hover:shadow-[0_0_20px_rgba(244,63,94,0.15)]",
            accent: "from-rose-500/20 to-rose-500/5",
            tag: "COMMUNITY",
        },
    ];

    const offerings = [
        {
            icon: Brain,
            title: "Brain Training Games",
            description: "Stimulate cognitive function with visual memory mapping, pattern recognition, and number sequence recalls.",
            color: "text-violet-600",
            bg: "bg-violet-50 border-violet-200",
        },
        {
            icon: Zap,
            title: "Reaction & Speed Tests",
            description: "Measure your raw physical limits down to the millisecond with our suite of aim, click, and reaction arenas.",
            color: "text-cyan-600",
            bg: "bg-cyan-50 border-cyan-200",
        },
        {
            icon: BarChart3,
            title: "Progress Tracking",
            description: "Save your scores and watch your performance curve climb as you consistently train and test your limits.",
            color: "text-emerald-600",
            bg: "bg-emerald-50 border-emerald-200",
        },
        {
            icon: Trophy,
            title: "Achievements & Challenges",
            description: "Unlock ranks, overcome daily objectives, and compete against the world for the number one spot.",
            color: "text-amber-600",
            bg: "bg-amber-50 border-amber-200",
        },
    ];

    const FLOATING_SHAPES = [
        { value: "🧠", x: "5%", y: "10%", size: "text-7xl", delay: 0, duration: 12, opacity: 0.10, rotate: 15 },
        { value: "✦", x: "90%", y: "8%", size: "text-6xl", delay: 1, duration: 10, opacity: 0.15, rotate: -20 },
        { value: "⚡", x: "6%", y: "75%", size: "text-8xl", delay: 2, duration: 14, opacity: 0.08, rotate: 35 },
        { value: "❖", x: "86%", y: "68%", size: "text-7xl", delay: 0.5, duration: 9, opacity: 0.12, rotate: -15 },
        { value: "◆", x: "44%", y: "90%", size: "text-6xl", delay: 3, duration: 11, opacity: 0.09, rotate: 25 },
        { value: "🏆", x: "80%", y: "30%", size: "text-8xl", delay: 1.5, duration: 13, opacity: 0.07, rotate: -10 },
        { value: "✧", x: "18%", y: "50%", size: "text-5xl", delay: 2.5, duration: 8, opacity: 0.10, rotate: 45 },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans relative overflow-hidden py-16 px-4">

            {/* Technical Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0" />

            {/* Floating 3D parallax elements */}
            {FLOATING_SHAPES.map((item, idx) => (
                <motion.div
                    key={idx}
                    className="absolute pointer-events-none select-none z-0"
                    style={{ left: item.x, top: item.y, opacity: item.opacity }}
                    animate={{ y: [0, -25, 0] }}
                    transition={{ duration: item.duration, repeat: Infinity, ease: "easeInOut", delay: item.delay }}
                >
                    <div
                        className={`${item.size} font-mono font-black text-cyan-600`}
                        style={{
                            transform: `perspective(800px) rotateX(25deg) rotateY(-20deg) rotateZ(${item.rotate}deg)`,
                            filter: "drop-shadow(2px 4px 6px rgba(15,23,42,0.06)) drop-shadow(4px 10px 15px rgba(6,182,212,0.1))"
                        }}
                    >
                        {item.value}
                    </div>
                </motion.div>
            ))}

            {/* Ambient glows */}
            <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-cyan-500/[0.025] blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-5%] right-[10%] w-[600px] h-[600px] bg-violet-500/[0.025] blur-[130px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 max-w-6xl mx-auto space-y-16">

                {/* ── Hero Header ── */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-5"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-xs font-mono tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Identity Profile
                    </div>

                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-mono font-extrabold tracking-tight text-slate-900 uppercase leading-none">
                        About{" "}
                        <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                            Reflextry
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
                        The ultimate platform for testing and improving your physical reactions and cognitive speed. Built for gamers, athletes, and curious minds.
                    </p>
                </motion.div>

                {/* ── Mission ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative flex items-start gap-5">
                        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex-shrink-0 shadow-sm"
                            style={{ transform: "perspective(600px) rotateX(12deg) rotateY(-8deg)", boxShadow: "3px 6px 12px rgba(245,158,11,0.15)" }}>
                            <Sparkles className="w-7 h-7 text-amber-500" />
                        </div>
                        <div>
                            <div className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">Mission Statement</div>
                            <h2 className="text-2xl font-mono font-bold text-slate-900 mb-3">Our Mission</h2>
                            <p className="text-slate-600 leading-relaxed">
                                Our mission is to democratize reflex training by offering high-quality, scientifically sound performance-tracking challenges for gamers, athletes, and anyone wanting to stay sharp. We believe improvement starts with measurement.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Story ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative flex items-start gap-5">
                        <div className="p-3 rounded-2xl bg-violet-50 border border-violet-200 flex-shrink-0 shadow-sm"
                            style={{ transform: "perspective(600px) rotateX(12deg) rotateY(-8deg)", boxShadow: "3px 6px 12px rgba(139,92,246,0.15)" }}>
                            <Globe className="w-7 h-7 text-violet-500" />
                        </div>
                        <div className="w-full">
                            <div className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-1">Origin Log</div>
                            <h2 className="text-2xl font-mono font-bold text-slate-900 mb-4">Our Story</h2>
                            <div className="space-y-3 text-slate-600 leading-relaxed">
                                <p>What started as a simple reaction time test rapidly grew into a comprehensive hub for cognitive evaluation.</p>
                                <p>We realized there was a lack of unified platforms allowing users to compare their raw mechanical skill against others globally.</p>
                                <p>Today, Reflextry serves thousands of players globally — helping them learn, compete, and improve.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Core Values ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-slate-400 tracking-widest uppercase">Core Values</div>
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className="text-xs font-mono text-cyan-500 tracking-widest">04 MODULES</div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.25 + index * 0.08 }}
                                className={`relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-300 ${value.glow} hover:border-slate-300 overflow-hidden group cursor-default`}
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${value.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />
                                <div className="relative flex items-start gap-4">
                                    <div
                                        className={`p-2.5 rounded-xl ${value.bg} border flex-shrink-0`}
                                        style={{ transform: "perspective(400px) rotateX(10deg) rotateY(-8deg)", boxShadow: "2px 4px 8px rgba(15,23,42,0.06)" }}
                                    >
                                        <value.icon className={`w-5 h-5 ${value.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className={`text-[10px] font-mono tracking-widest uppercase mb-1 ${value.color} opacity-70`}>{value.tag}</div>
                                        <h3 className="text-base font-mono font-bold text-slate-900 mb-1.5">{value.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* ── What We Offer ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-slate-400 tracking-widest uppercase">Platform Modules</div>
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className="text-xs font-mono text-violet-500 tracking-widest">04 FEATURES</div>
                    </div>

                    <div className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                        <div className="relative grid md:grid-cols-2 gap-6">
                            {offerings.map((item, idx) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.35 + idx * 0.07 }}
                                    className="flex items-start gap-4 group"
                                >
                                    <div
                                        className={`p-2.5 rounded-xl ${item.bg} border flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}
                                        style={{ transform: "perspective(400px) rotateX(10deg) rotateY(-8deg)", boxShadow: "2px 4px 8px rgba(15,23,42,0.06)" }}
                                    >
                                        <item.icon className={`w-5 h-5 ${item.color}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-mono font-bold text-slate-900 mb-1.5">{item.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Team ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-xs font-mono text-slate-400 tracking-widest uppercase">Personnel</div>
                        <div className="flex-1 h-px bg-slate-200" />
                        <div className="text-xs font-mono text-cyan-500 tracking-widest">02 AGENTS</div>
                    </div>

                    <div className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                        <div className="relative">
                            <div className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-6">Meet the Team</div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                {/* Rabadiya Kaushik */}
                                <motion.div
                                    className="flex flex-col items-center text-center group"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div
                                        className="relative w-40 h-40 mb-4 rounded-2xl overflow-hidden border-2 border-cyan-200 group-hover:border-cyan-400 transition-colors duration-300"
                                        style={{ boxShadow: "0 8px 24px rgba(6,182,212,0.12), 0 2px 6px rgba(15,23,42,0.06)", transform: "perspective(600px) rotateX(4deg) rotateY(-4deg)" }}
                                    >
                                        <Image src="/images/team/rabadiya-kaushik.webp" alt="Rabadiya Kaushik" fill className="object-cover" />
                                    </div>
                                    <h3 className="text-lg font-mono font-bold text-slate-900 mb-0.5 group-hover:text-cyan-600 transition-colors">Rabadiya Kaushik</h3>
                                    <p className="text-sm text-slate-500 font-mono">Founder & Developer</p>
                                </motion.div>

                                {/* Harshil Miyani */}
                                <motion.div
                                    className="flex flex-col items-center text-center group"
                                    whileHover={{ y: -4 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <div
                                        className="relative w-40 h-40 mb-4 rounded-2xl overflow-hidden border-2 border-violet-200 group-hover:border-violet-400 transition-colors duration-300"
                                        style={{ boxShadow: "0 8px 24px rgba(139,92,246,0.12), 0 2px 6px rgba(15,23,42,0.06)", transform: "perspective(600px) rotateX(4deg) rotateY(-4deg)" }}
                                    >
                                        <Image src="/images/team/harshil-miyani.webp" alt="Harshil Miyani" fill className="object-cover" />
                                    </div>
                                    <h3 className="text-lg font-mono font-bold text-slate-900 mb-0.5 group-hover:text-violet-600 transition-colors">Harshil Miyani</h3>
                                    <p className="text-sm text-slate-500 font-mono">SEO Expert</p>
                                </motion.div>
                            </div>

                            <div className="border-t border-slate-100 pt-6 space-y-3 text-slate-600 leading-relaxed text-sm">
                                <p>We are a passionate team dedicated to pushing the boundaries of web experiences. Combining technical expertise with a keen understanding of digital presence.</p>
                                <p>Together, we strive to deliver an exceptional platform that not only performs flawlessly but reaches the right audience effectively.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* ── Community CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="relative bg-white/80 backdrop-blur-md border border-cyan-200/60 rounded-3xl p-8 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] via-transparent to-violet-500/[0.04] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative">
                        <div className="text-xs font-mono text-cyan-500 tracking-widest uppercase mb-2">Network Access</div>
                        <h2 className="text-2xl font-mono font-bold text-slate-900 mb-3">Join the Community</h2>
                        <p className="text-slate-600 leading-relaxed mb-6 max-w-xl">
                            Ready to see where you stand? Explore the leaderboards, challenge your friends, and connect with other members of the Reflextry network.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/leaderboard"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 text-white text-sm font-mono font-semibold shadow-[0_4px_12px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-cyan-500 active:shadow-[0_1px_4px_rgba(6,182,212,0.3),inset_0_2px_4px_rgba(0,0,0,0.1)] active:translate-y-0.5 transition-all duration-150"
                                style={{ border: "1px solid rgba(6,182,212,0.5)" }}
                            >
                                <Trophy className="w-4 h-4" />
                                View Leaderboard
                                <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                            </Link>
                            <Link href="/contact"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-700 text-sm font-mono font-semibold border border-slate-200 shadow-[0_2px_8px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.8)] hover:border-cyan-300 hover:text-cyan-600 active:shadow-[0_1px_2px_rgba(15,23,42,0.08),inset_0_1px_3px_rgba(15,23,42,0.05)] active:translate-y-0.5 transition-all duration-150"
                            >
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* ── Legal Links ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-8 shadow-sm overflow-hidden"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-300/80 to-transparent" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative">
                        <div className="flex items-center gap-3 mb-6">
                            <Shield className="w-5 h-5 text-slate-400" />
                            <div>
                                <div className="text-xs font-mono text-slate-400 tracking-widest uppercase">Compliance</div>
                                <h2 className="text-xl font-mono font-bold text-slate-900">Legal Information</h2>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                            We are committed to transparency and protecting your rights. Please review our legal documents to understand how we operate and protect your data.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { href: "/privacy", label: "Privacy Policy", icon: "🔒", color: "hover:border-cyan-300 hover:text-cyan-600" },
                                { href: "/terms", label: "Terms of Service", icon: "📋", color: "hover:border-violet-300 hover:text-violet-600" },
                                { href: "/cookies", label: "Cookie Policy", icon: "🍪", color: "hover:border-amber-300 hover:text-amber-600" },
                            ].map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`flex items-center justify-center gap-2 px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-700 text-sm font-mono font-medium shadow-sm hover:shadow-md ${link.color} transition-all duration-200`}
                                >
                                    <span>{link.icon}</span>
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* ── Final CTA ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="relative bg-white/80 backdrop-blur-md border border-slate-200 rounded-3xl p-10 shadow-sm overflow-hidden text-center"
                >
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/[0.03] via-transparent to-cyan-500/[0.03] pointer-events-none" />
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

                    <div className="relative">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-violet-50 border border-slate-200 mb-5"
                            style={{ boxShadow: "3px 6px 16px rgba(15,23,42,0.08)", transform: "perspective(600px) rotateX(12deg) rotateY(-8deg)" }}>
                            <Star className="w-7 h-7 text-cyan-500" />
                        </div>
                        <h2 className="text-2xl font-mono font-bold text-slate-900 mb-3">Ready to Test Your Limits?</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-md mx-auto">
                            Jump straight into the action and find out how fast you truly are.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-cyan-600 text-sm font-mono font-semibold active:translate-y-0.5 transition-all duration-150"
                            style={{
                                background: "linear-gradient(to right, #0891b2, #7c3aed)",
                                color: "#ffffff",
                                boxShadow: "0 4px 16px rgba(6,182,212,0.25), inset 0 1px 0 rgba(255,255,255,0.15)"
                            }}
                        >
                            Start Playing Now
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                    </div>
                </motion.div>

            </div>
        </div>
    );
}
