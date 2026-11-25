"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Menu,
    X,
    ChevronDown,
    Search,
    ArrowRight,
    ArrowUpRight,
    LayoutGrid,
} from "lucide-react";
import Image from "next/image";

import { useTranslation } from "@/lib/i18n/context";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TOOL_COUNT } from "@/config/tool-mapping";
import {
    SITE_CATEGORIES,
    FEATURED_FLAGSHIP_LINKS,
    PROGRESS_LINKS,
    RESEARCH_LINKS,
    COMPANY_LEGAL_LINKS,
    buildAllPagesDirectory,
} from "@/lib/site-navigation";

const MOBILE_CORE_ARENAS = [
    { label: "Logic Puzzles", href: "/puzzles", count: 9 },
    { label: "Classics", href: "/classics", count: 3 },
    { label: "Reflex Arena", href: "/reflex", count: 13 },
    { label: "Memory Arena", href: "/memory", count: 12 },
    { label: "Speed Arena", href: "/speed", count: 8 },
    { label: "Accuracy Arena", href: "/accuracy", count: 8 },
    { label: "Gaming Arena", href: "/gaming", count: 7 },
    { label: "Study & Work", href: "/productivity", count: 7 },
    { label: "STEM Lab", href: "/stem", count: 4 },
    { label: "3D Lab", href: "/lab-3d", count: 2 },
    { label: "2-Player Arena", href: "/multiplayer", count: 3 },
    { label: "All 76 Tools", href: "/tools", count: TOOL_COUNT },
];

export function Navbar() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [megaOpen, setMegaOpen] = useState(false);
    const [menuQuery, setMenuQuery] = useState("");
    const headerRef = useRef<HTMLElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const pathname = usePathname();
    const { t, getLocalizedHref } = useTranslation();

    const allDirectoryItems = useMemo(() => buildAllPagesDirectory(), []);

    const filteredDirectory = useMemo(() => {
        const q = menuQuery.trim().toLowerCase();
        if (!q) return [];
        return allDirectoryItems
            .filter(
                (item) =>
                    item.label.toLowerCase().includes(q) ||
                    item.group.toLowerCase().includes(q) ||
                    item.href.toLowerCase().includes(q)
            )
            .slice(0, 12);
    }, [allDirectoryItems, menuQuery]);

    // Close overlays on route change
    useEffect(() => {
        setMobileOpen(false);
        setMegaOpen(false);
        setMenuQuery("");
    }, [pathname]);

    // Close on Escape or outside click
    useEffect(() => {
        if (!mobileOpen && !megaOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setMobileOpen(false);
                setMegaOpen(false);
            }
        };
        const onMouseDown = (e: MouseEvent) => {
            if (megaOpen && headerRef.current && !headerRef.current.contains(e.target as Node)) {
                setMegaOpen(false);
            }
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onMouseDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onMouseDown);
        };
    }, [mobileOpen, megaOpen]);

    const isActiveRoute = (href: string) => {
        const localized = getLocalizedHref(href);
        if (!pathname) return false;
        if (href === "/") return pathname === localized || pathname === "/";
        return pathname === localized || pathname.startsWith(`${localized}/`);
    };

    const topBarLinks = [
        { name: "Puzzles", href: "/puzzles" },
        { name: t("nav.reflex", "Benchmarks"), href: "/reflex" },
        { name: "Classics", href: "/classics" },
        { name: "Study & Labs", href: "/productivity" },
    ];

    const puzzleClassicsCats = SITE_CATEGORIES.filter((c) => c.group === "puzzles-classics");
    const benchmarkCats = SITE_CATEGORIES.filter((c) => c.group === "benchmarks");
    const labCats = SITE_CATEGORIES.filter((c) => c.group === "labs-suite");

    return (
        <header
            ref={headerRef}
            className="fixed top-0 left-0 right-0 z-50 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E6E3DB]"
        >
            <nav
                aria-label="Primary navigation"
                className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8"
            >
                <div className="flex items-center justify-between h-[68px] gap-2 sm:gap-4">
                    {/* Zone 1: Editorial Wordmark */}
                    <Link
                        href={getLocalizedHref("/")}
                        className="flex items-center gap-2.5 min-h-[44px] py-1 shrink-0 group touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2 rounded-lg"
                    >
                        <div className="relative w-8 h-8 rounded-md overflow-hidden bg-[#161614] border border-[#161614] flex items-center justify-center shrink-0">
                            <Image
                                src="/logo-80x80.png"
                                alt="Reflextry"
                                width={26}
                                height={26}
                                referrerPolicy="no-referrer"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="font-serif text-lg sm:text-xl font-semibold tracking-tight text-[#161614] whitespace-nowrap">
                            Reflextry
                        </span>
                    </Link>

                    {/* Zone 2: Clean Desktop Links + All Pages Directory Trigger */}
                    <div className="hidden lg:flex items-center gap-1">
                        {topBarLinks.map((link) => {
                            const active = isActiveRoute(link.href);
                            return (
                                <Link
                                    key={link.href}
                                    href={getLocalizedHref(link.href)}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative inline-flex items-center min-h-[44px] px-3.5 py-2 text-sm whitespace-nowrap shrink-0 rounded-lg transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        active
                                            ? "text-[#161614] font-semibold"
                                            : "text-[#57554E] font-medium hover:text-[#161614] hover:bg-[#F3F1EC]"
                                    }`}
                                >
                                    {link.name}
                                    {active && (
                                        <span className="absolute bottom-1.5 left-3.5 right-3.5 h-[2px] bg-[#161614] rounded-full" />
                                    )}
                                </Link>
                            );
                        })}

                        <button
                            type="button"
                            data-testid="all-pages-menu-trigger"
                            onClick={() => {
                                setMegaOpen((prev) => !prev);
                                setMenuQuery("");
                            }}
                            aria-expanded={megaOpen}
                            aria-controls="all-pages-mega-menu"
                            className={`cursor-pointer inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 text-sm font-medium whitespace-nowrap shrink-0 rounded-lg transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                megaOpen
                                    ? "bg-[#161614] text-[#FAF9F6]"
                                    : "text-[#161614] hover:bg-[#F3F1EC]"
                            }`}
                        >
                            <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
                            <span>All Pages</span>
                            <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform duration-150 ${
                                    megaOpen ? "rotate-180" : ""
                                }`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>

                    {/* Zone 3: Utilities & Primary Charcoal CTA */}
                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                        <PomodoroTimer />
                        <LanguageSwitcher />
                        <Link
                            href={getLocalizedHref("/reflex/reaction")}
                            className="hidden lg:inline-flex items-center gap-1.5 min-h-[44px] px-4 py-2.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-medium whitespace-nowrap shrink-0 transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2"
                        >
                            <span>{t("hero.startTraining", "Start Test")}</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                        <button
                            type="button"
                            onClick={() => setMobileOpen((prev) => !prev)}
                            className="lg:hidden cursor-pointer inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-lg border border-[#E6E3DB] bg-white text-[#161614] hover:bg-[#F3F1EC] transition-colors touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileOpen}
                        >
                            {mobileOpen ? (
                                <X className="w-5 h-5" aria-hidden="true" />
                            ) : (
                                <Menu className="w-5 h-5" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Desktop Full-Site "All Pages" Editorial Directory Panel */}
            {megaOpen && (
                <>
                    <div
                        onClick={() => setMegaOpen(false)}
                        className="hidden lg:block fixed inset-0 top-[68px] bg-[#161614]/25 z-40 animate-in fade-in duration-150"
                        aria-hidden="true"
                    />
                    <div
                        id="all-pages-mega-menu"
                        data-testid="all-pages-mega-menu"
                        className="hidden lg:block fixed top-[68px] left-0 right-0 bg-[#FAF9F6] border-b border-[#D8D4C9] shadow-xl z-50 max-h-[calc(100vh-80px)] overflow-y-auto animate-in fade-in duration-150"
                    >
                            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7 space-y-6">
                                {/* Top Search & Overview Bar */}
                                <div className="flex items-center justify-between gap-6 pb-5 border-b border-[#E6E3DB]">
                                    <div>
                                        <p className="font-serif text-lg font-semibold text-[#161614]">
                                            Complete Site Index
                                        </p>
                                        <p className="text-xs text-[#57554E] mt-0.5">
                                            Every arena, flagship puzzle, research guide, and tool in one place.
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 w-full max-w-md">
                                        <div className="relative flex-1">
                                            <Search
                                                className="w-4 h-4 text-[#78756C] absolute left-3 top-1/2 -translate-y-1/2"
                                                aria-hidden="true"
                                            />
                                            <input
                                                ref={searchInputRef}
                                                type="text"
                                                value={menuQuery}
                                                onChange={(e) => setMenuQuery(e.target.value)}
                                                placeholder={`Quick jump across ${TOOL_COUNT} tools & all pages...`}
                                                aria-label="Filter pages and tools"
                                                className="w-full min-h-[42px] pl-9 pr-3 py-2 text-sm bg-white border border-[#DCD8CE] rounded-lg text-[#161614] placeholder:text-[#78756C] focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF]"
                                            />
                                        </div>
                                        <Link
                                            href={getLocalizedHref("/tools")}
                                            onClick={() => setMegaOpen(false)}
                                            className="inline-flex items-center gap-1.5 min-h-[42px] px-3.5 py-2 rounded-lg border border-[#DCD8CE] bg-white hover:bg-[#F3F1EC] text-xs font-semibold text-[#161614] whitespace-nowrap shrink-0 transition-colors"
                                        >
                                            <span>All {TOOL_COUNT} Tools</span>
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </Link>
                                    </div>
                                </div>

                                {menuQuery.trim() ? (
                                    <div className="space-y-3">
                                        <p className="text-xs font-medium text-[#78756C]">
                                            {filteredDirectory.length > 0
                                                ? `Matching pages for "${menuQuery.trim()}"`
                                                : `No page found for "${menuQuery.trim()}"`}
                                        </p>
                                        {filteredDirectory.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {filteredDirectory.map((item) => (
                                                    <Link
                                                        key={item.href}
                                                        href={getLocalizedHref(item.href)}
                                                        onClick={() => setMegaOpen(false)}
                                                        className="group flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-lg bg-white border border-[#E6E3DB] hover:border-[#161614] transition-colors"
                                                    >
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-[#161614] group-hover:text-[#1E40AF] truncate">
                                                                {item.label}
                                                            </p>
                                                            <p className="text-[11px] text-[#78756C] truncate">
                                                                {item.group}
                                                            </p>
                                                        </div>
                                                        <ArrowUpRight
                                                            className="w-3.5 h-3.5 text-[#78756C] group-hover:text-[#1E40AF] shrink-0"
                                                            aria-hidden="true"
                                                        />
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-12 gap-8">
                                        {/* Col 1: Cognitive Benchmarks */}
                                        <div className="col-span-3 space-y-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                Cognitive Benchmarks
                                            </p>
                                            <ul className="space-y-1.5">
                                                {benchmarkCats.map((cat) => (
                                                    <li key={cat.href}>
                                                        <Link
                                                            href={getLocalizedHref(cat.href)}
                                                            onClick={() => setMegaOpen(false)}
                                                            className="group block py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-[#F3F1EC] transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF]">
                                                                    {cat.label}
                                                                </span>
                                                                <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                                                    {cat.toolCount}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#57554E] line-clamp-1 mt-0.5">
                                                                {cat.description}
                                                            </p>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Col 2: Puzzles, Classics & Labs */}
                                        <div className="col-span-4 space-y-3">
                                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                Puzzles, Classics &amp; Labs
                                            </p>
                                            <ul className="space-y-1.5">
                                                {[...puzzleClassicsCats, ...labCats].map((cat) => (
                                                    <li key={cat.href}>
                                                        <Link
                                                            href={getLocalizedHref(cat.href)}
                                                            onClick={() => setMegaOpen(false)}
                                                            className="group block py-1.5 px-2.5 -mx-2.5 rounded-lg hover:bg-[#F3F1EC] transition-colors"
                                                        >
                                                            <div className="flex items-center justify-between gap-2">
                                                                <span className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF]">
                                                                    {cat.label}
                                                                </span>
                                                                <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                                                    {cat.toolCount}
                                                                </span>
                                                            </div>
                                                            <p className="text-xs text-[#57554E] line-clamp-1 mt-0.5">
                                                                {cat.description}
                                                            </p>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Col 3: Progress & Research */}
                                        <div className="col-span-3 space-y-5">
                                            <div className="space-y-2.5">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                    Progress &amp; Activity
                                                </p>
                                                <ul className="space-y-1">
                                                    {PROGRESS_LINKS.map((item) => (
                                                        <li key={item.href}>
                                                            <Link
                                                                href={getLocalizedHref(item.href)}
                                                                onClick={() => setMegaOpen(false)}
                                                                className="block py-1 text-sm text-[#3F3E39] hover:text-[#1E40AF] font-medium transition-colors"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-2.5 pt-4 border-t border-[#E6E3DB]">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                    Research &amp; Guides
                                                </p>
                                                <ul className="space-y-1">
                                                    {RESEARCH_LINKS.map((item) => (
                                                        <li key={item.href}>
                                                            <Link
                                                                href={getLocalizedHref(item.href)}
                                                                onClick={() => setMegaOpen(false)}
                                                                className="block py-1 text-sm text-[#3F3E39] hover:text-[#1E40AF] font-medium transition-colors"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* Col 4: Popular Direct Tools & Studio */}
                                        <div className="col-span-2 space-y-5 border-l border-[#E6E3DB] pl-6">
                                            <div className="space-y-2.5">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                    Popular Now
                                                </p>
                                                <ul className="space-y-1">
                                                    {FEATURED_FLAGSHIP_LINKS.slice(0, 6).map((item) => (
                                                        <li key={item.href}>
                                                            <Link
                                                                href={getLocalizedHref(item.href)}
                                                                onClick={() => setMegaOpen(false)}
                                                                className="block py-1 text-sm text-[#3F3E39] hover:text-[#1E40AF] transition-colors"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="space-y-2 pt-4 border-t border-[#E6E3DB]">
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                                    About &amp; Policies
                                                </p>
                                                <ul className="space-y-1">
                                                    {COMPANY_LEGAL_LINKS.map((item) => (
                                                        <li key={item.href}>
                                                            <Link
                                                                href={getLocalizedHref(item.href)}
                                                                onClick={() => setMegaOpen(false)}
                                                                className="block py-0.5 text-xs text-[#57554E] hover:text-[#161614] transition-colors"
                                                            >
                                                                {item.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

            {/* Complete Solid Mobile Drawer showing every page cleanly */}
            {mobileOpen && (
                <>
                    <div
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden fixed inset-0 top-[68px] bg-[#161614]/35 z-40 animate-in fade-in duration-150"
                        aria-hidden="true"
                    />
                    <div
                        data-testid="mobile-nav-drawer"
                        className="lg:hidden fixed top-[68px] left-0 right-0 bg-[#FAF9F6] border-b border-[#D8D4C9] shadow-xl z-50 max-h-[calc(100vh-68px)] overflow-y-auto animate-in fade-in duration-150"
                    >
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] mb-2.5 px-1">
                                        All Arenas &amp; Suites
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        {MOBILE_CORE_ARENAS.map((item) => {
                                            const active = isActiveRoute(item.href);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={getLocalizedHref(item.href)}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center justify-between gap-2 min-h-[48px] px-3.5 py-2.5 rounded-lg text-sm transition-colors touch-manipulation ${
                                                        active
                                                            ? "bg-[#161614] text-[#FAF9F6] font-semibold"
                                                            : "bg-white text-[#161614] hover:bg-[#F3F1EC] border border-[#E6E3DB] font-medium"
                                                    }`}
                                                >
                                                    <span className="truncate">{item.label}</span>
                                                    <span
                                                        className={`text-xs font-mono tabular-nums shrink-0 ${
                                                            active ? "text-[#FAF9F6]/70" : "text-[#78756C]"
                                                        }`}
                                                    >
                                                        {item.count}
                                                    </span>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-[#E6E3DB] pt-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] mb-2.5 px-1">
                                        Progress &amp; Research
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                        {[...PROGRESS_LINKS, ...RESEARCH_LINKS].map((item) => {
                                            const active = isActiveRoute(item.href);
                                            return (
                                                <Link
                                                    key={item.href}
                                                    href={getLocalizedHref(item.href)}
                                                    onClick={() => setMobileOpen(false)}
                                                    className={`flex items-center justify-between min-h-[48px] px-3.5 py-2.5 rounded-lg text-sm transition-colors touch-manipulation ${
                                                        active
                                                            ? "bg-[#161614] text-[#FAF9F6] font-semibold"
                                                            : "bg-white text-[#3F3E39] hover:bg-[#F3F1EC] border border-[#E6E3DB] font-medium"
                                                    }`}
                                                >
                                                    <span>{item.label}</span>
                                                    <ArrowRight className="w-3.5 h-3.5 opacity-60 shrink-0" aria-hidden="true" />
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="border-t border-[#E6E3DB] pt-4">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] mb-2 px-1">
                                        About &amp; Policies
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {COMPANY_LEGAL_LINKS.map((item) => (
                                            <Link
                                                key={item.href}
                                                href={getLocalizedHref(item.href)}
                                                onClick={() => setMobileOpen(false)}
                                                className="inline-flex items-center min-h-[44px] px-3 py-2 rounded-lg bg-white border border-[#E6E3DB] text-xs font-medium text-[#57554E] hover:text-[#161614] touch-manipulation"
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-[#E6E3DB]">
                                    <Link
                                        href={getLocalizedHref("/reflex/reaction")}
                                        onClick={() => setMobileOpen(false)}
                                        className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors touch-manipulation"
                                    >
                                        <span>{t("hero.startTraining", "Start Reaction Test")}</span>
                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </header>
    );
}
