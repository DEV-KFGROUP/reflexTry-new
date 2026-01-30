"use client";

import { useState, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Gamepad2, Zap, Brain, Target, Gauge, Trophy, BarChart3, Flame, Award } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";

const languages = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
    { code: "fr", label: "FR" },
    { code: "de", label: "DE" },
    { code: "pt", label: "PT" },
];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const locale = useLocale();
    const t = useTranslations('Navbar');

    // Get current language label
    const currentLanguage = languages.find(lang => lang.code === locale) || languages[0];

    // Ensure component is mounted before rendering interactive elements
    useEffect(() => {
        setMounted(true);
    }, []);

    // Pre-compute nav links with game-themed icons
    const navLinks = [
        { name: t('home'), href: "/", icon: Gamepad2 },
        { name: "Blog", href: "/blog", icon: null },
        { name: "All Tools", href: "/tools", icon: null },
        { name: t('memory'), href: "/memory", icon: Brain },
        { name: t('speed'), href: "/speed", icon: Gauge },
        { name: t('reflex'), href: "/reflex", icon: Zap },
        { name: t('accuracy'), href: "/accuracy", icon: Target },
        { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
        { name: "Statistics", href: "/statistics", icon: BarChart3 },
        { name: "Challenges", href: "/challenges", icon: Flame },
        { name: "Achievements", href: "/achievements", icon: Award },
    ];

    const changeLanguage = (locale: string) => {
        router.replace(pathname, { locale });
        setIsLangOpen(false);
    };

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

                        {/* Language Switcher - Game Style */}
                        {mounted && (
                            <div className="relative ml-2">
                                <button
                                    onClick={() => setIsLangOpen(!isLangOpen)}
                                    className="flex items-center justify-center text-muted-foreground hover:text-speed transition-colors px-3 py-2 rounded-lg font-medium uppercase text-sm border border-transparent hover:border-speed/30 hover:bg-speed/5"
                                    aria-label={t('selectLanguage')}
                                    aria-expanded={isLangOpen}
                                >
                                    <span className="text-xs font-bold tracking-wider">{currentLanguage.label}</span>
                                </button>

                                <AnimatePresence>
                                    {isLangOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-28 bg-background/90 backdrop-blur-xl border border-speed/30 rounded-xl overflow-hidden shadow-[0_10px_40px_rgba(6,182,212,0.2)] z-50"
                                        >
                                            {languages.map((lang) => (
                                                <button
                                                    key={lang.code}
                                                    onClick={() => changeLanguage(lang.code)}
                                                    className="w-full px-4 py-2.5 text-left text-sm text-muted-foreground hover:bg-speed/10 hover:text-speed transition-colors border-b border-white/5 last:border-b-0"
                                                >
                                                    {lang.label}
                                                </button>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button - Game Controller Style */}
                    {mounted && (
                        <div className="md:hidden flex items-center gap-3">
                            <button
                                onClick={() => setIsLangOpen(!isLangOpen)}
                                className="text-muted-foreground hover:text-speed transition-colors px-3 py-2 rounded-lg font-bold uppercase text-xs border border-transparent hover:border-speed/30"
                                aria-label={t('selectLanguage')}
                                aria-expanded={isLangOpen}
                            >
                                {currentLanguage.label}
                            </button>
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
                    {isLangOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-background/90 backdrop-blur-xl border-b border-speed/20" />
                            <div className="relative px-4 py-4 space-y-2">
                                <div className="text-xs text-speed/60 uppercase tracking-widest mb-3 font-bold">{t('selectLanguage')}</div>
                                <div className="grid grid-cols-5 gap-2">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={`py-3 px-4 text-center font-bold rounded-lg transition-all ${lang.code === locale
                                                ? 'bg-speed/20 text-speed border border-speed/30'
                                                : 'text-muted-foreground hover:bg-speed/10 hover:text-speed border border-transparent'
                                                }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </nav>
    );
}

