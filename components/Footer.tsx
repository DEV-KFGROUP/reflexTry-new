"use client";

import Link from "next/link";
import { Twitter, Instagram, ChevronDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { useTranslation } from "@/lib/i18n/context";
import { PREFERENCES_EVENT } from "@/lib/cookie-consent";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { TOOL_COUNT } from "@/config/tool-mapping";
import {
    FEATURED_FLAGSHIP_LINKS,
    PROGRESS_LINKS,
    RESEARCH_LINKS,
    COMPANY_LEGAL_LINKS,
} from "@/lib/site-navigation";

const FOOTER_BENCHMARKS = [
    { label: "Reflex Arena", href: "/reflex", count: 13 },
    { label: "Memory Arena", href: "/memory", count: 12 },
    { label: "Speed Arena", href: "/speed", count: 8 },
    { label: "Accuracy Arena", href: "/accuracy", count: 8 },
    { label: "Gaming Arena", href: "/gaming", count: 7 },
    { label: `All ${TOOL_COUNT} Tools`, href: "/tools" },
];

const FOOTER_PUZZLES_AND_LABS = [
    { label: "Logic & Word Puzzles", href: "/puzzles", count: 9 },
    { label: "Flagship Classics", href: "/classics", count: 3 },
    { label: "Student & Work Suite", href: "/productivity", count: 7 },
    { label: "STEM & Physics Lab", href: "/stem", count: 4 },
    { label: "3D Interactive Lab", href: "/lab-3d", count: 2 },
    { label: "2-Player Battle Arena", href: "/multiplayer", count: 3 },
];

export function Footer() {
    const { t, getLocalizedHref } = useTranslation();

    return (
        <footer className="cv-auto mt-20 bg-white border-t border-[#E6E3DB] text-[#161614] font-sans">
            {/* Quick-Access Popular Tools Strip */}
            <div className="border-b border-[#E6E3DB] bg-[#FAF9F6]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center gap-x-6 gap-y-2">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C] shrink-0">
                        Popular Tools
                    </span>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                        {FEATURED_FLAGSHIP_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={getLocalizedHref(item.href)}
                                prefetch={false}
                                className="inline-flex items-center gap-1 min-h-[44px] sm:min-h-[32px] py-1 text-xs font-medium text-[#3F3E39] hover:text-[#1E40AF] transition-colors touch-manipulation"
                            >
                                <span>{item.label}</span>
                                <ArrowUpRight className="w-3 h-3 opacity-45" aria-hidden="true" />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-12">
                    {/* Col 1: Brand & Editorial Colophon */}
                    <div className="lg:col-span-4 space-y-4 pr-0 lg:pr-6">
                        <Link
                            href={getLocalizedHref("/")}
                            className="inline-flex items-center gap-2.5 group w-fit min-h-[44px] touch-manipulation"
                        >
                            <div className="relative w-9 h-9 flex items-center justify-center overflow-hidden rounded-md border border-[#161614] bg-[#161614] shrink-0">
                                <Image
                                    src="/logo-80x80.png"
                                    alt="Reflextry"
                                    width={28}
                                    height={28}
                                    referrerPolicy="no-referrer"
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-serif text-xl font-semibold text-[#161614] tracking-tight leading-none">
                                    Reflextry
                                </span>
                                <span className="text-xs text-[#78756C] mt-0.5">
                                    Independent Cognitive &amp; Puzzle Lab
                                </span>
                            </div>
                        </Link>
                        <p className="text-[#57554E] text-sm leading-relaxed max-w-sm">
                            {t(
                                "footer.tagline",
                                "Free browser benchmarks, daily logic puzzles, and practical study tools. Straightforward scoring in milliseconds, spans, and accuracy—with zero sign-up required."
                            )}
                        </p>
                        <div className="flex gap-2.5 pt-1">
                            {[
                                {
                                    icon: Twitter,
                                    href: "https://twitter.com/reflextry_",
                                    label: "Twitter",
                                },
                                {
                                    icon: Instagram,
                                    href: "https://instagram.com/reflextry_",
                                    label: "Instagram",
                                },
                            ].map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 bg-[#FAF9F6] border border-[#E6E3DB] rounded-lg text-[#57554E] hover:text-[#161614] hover:border-[#161614] transition-colors touch-manipulation"
                                    aria-label={social.label}
                                >
                                    <social.icon className="w-4 h-4" aria-hidden="true" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Col 2: Cognitive Benchmarks */}
                    <div className="lg:col-span-2">
                        <p className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.14em] mb-4">
                            Benchmarks
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                            {FOOTER_BENCHMARKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedHref(link.href)}
                                        prefetch={false}
                                        className="inline-flex items-center justify-between gap-2 w-full min-h-[44px] sm:min-h-[30px] py-1 sm:py-0.5 text-sm text-[#3F3E39] hover:text-[#1E40AF] transition-colors touch-manipulation"
                                    >
                                        <span>{link.label}</span>
                                        {link.count !== undefined && (
                                            <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                                {link.count}
                                            </span>
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 3: Puzzles, Classics & Labs */}
                    <div className="lg:col-span-2">
                        <p className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.14em] mb-4">
                            Puzzles &amp; Labs
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                            {FOOTER_PUZZLES_AND_LABS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedHref(link.href)}
                                        prefetch={false}
                                        className="inline-flex items-center justify-between gap-2 w-full min-h-[44px] sm:min-h-[30px] py-1 sm:py-0.5 text-sm text-[#3F3E39] hover:text-[#1E40AF] transition-colors touch-manipulation"
                                    >
                                        <span>{link.label}</span>
                                        <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                            {link.count}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 4: Progress & Research */}
                    <div className="lg:col-span-2">
                        <p className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.14em] mb-4">
                            Progress &amp; Research
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                            {[...PROGRESS_LINKS, ...RESEARCH_LINKS].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedHref(link.href)}
                                        prefetch={false}
                                        className="inline-flex items-center min-h-[44px] sm:min-h-[30px] py-1 sm:py-0.5 text-sm text-[#3F3E39] hover:text-[#1E40AF] transition-colors touch-manipulation"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Col 5: About & Policies */}
                    <div className="lg:col-span-2">
                        <p className="text-[11px] font-semibold text-[#78756C] uppercase tracking-[0.14em] mb-4">
                            About &amp; Policies
                        </p>
                        <ul className="space-y-1 sm:space-y-1.5">
                            {COMPANY_LEGAL_LINKS.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={getLocalizedHref(link.href)}
                                        prefetch={false}
                                        className="inline-flex items-center min-h-[44px] sm:min-h-[30px] py-1 sm:py-0.5 text-sm text-[#3F3E39] hover:text-[#1E40AF] transition-colors touch-manipulation"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Preferences & Language Bar */}
                <div className="py-5 border-t border-[#E6E3DB] flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                        <LanguageSwitcher variant="footer" />
                        <button
                            type="button"
                            className="inline-flex items-center min-h-[44px] px-2 text-xs font-medium text-[#57554E] hover:text-[#161614] underline underline-offset-4 transition-colors cursor-pointer touch-manipulation"
                            onClick={() => window.dispatchEvent(new Event(PREFERENCES_EVENT))}
                        >
                            {t("footer.cookiePreferences", "Cookie preferences")}
                        </button>
                    </div>
                    <p className="text-xs text-[#78756C]">
                        Local-first browser storage · No account required
                    </p>
                </div>

                {/* Platform Methodology Collapsible */}
                <div className="py-4 border-t border-[#E6E3DB] text-xs text-[#57554E]">
                    <details className="group">
                        <summary className="min-h-[44px] py-2 font-medium text-[#3F3E39] list-none flex items-center justify-between cursor-pointer hover:text-[#161614] transition-colors select-none touch-manipulation">
                            <span>{t("footer.platformMethodology", "Notes on Scoring & Measurement")}</span>
                            <ChevronDown
                                className="w-4 h-4 text-[#78756C] transition-transform duration-200 group-open:rotate-180"
                                aria-hidden="true"
                            />
                        </summary>
                        <div className="mt-4 pt-4 border-t border-[#F0EDE6] text-sm text-[#57554E] leading-relaxed space-y-4 max-w-3xl">
                            <p>
                                <strong className="text-[#161614] font-semibold">
                                    {t("footer.brainTrainingTitle", "Task-specific practice:")}{" "}
                                </strong>
                                {t(
                                    "footer.brainTrainingText",
                                    "Reflextry isolates individual skills—such as visual reaction time, working memory span, and spatial pattern recognition—so you can track your own sessions honestly over time."
                                )}
                            </p>
                            <p>
                                <strong className="text-[#161614] font-semibold">
                                    {t("footer.esportsTitle", "Hardware & browser context:")}{" "}
                                </strong>
                                {t(
                                    "footer.esportsText",
                                    "Browser reaction and aim scores include display refresh rate, mouse or touch input latency, and browser scheduling. Compare sessions on the same device for meaningful trends."
                                )}
                            </p>
                            <p>
                                <span className="font-semibold text-[#161614]">
                                    {t("footer.clinicalRef", "Further reading:")}{" "}
                                </span>
                                <span>Review peer-reviewed </span>
                                <a
                                    href="https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6128435/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#1E40AF] hover:underline font-medium underline-offset-2"
                                >
                                    {t("footer.brainTrainingResearch", "cognitive training literature")}
                                </a>
                                .
                            </p>
                        </div>
                    </details>
                </div>

                {/* Quiet Copyright Line */}
                <div className="pt-5 border-t border-[#E6E3DB] flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#78756C]">
                    <p>
                        &copy; 2026 Reflextry. All rights reserved.
                    </p>
                    <p>
                        {TOOL_COUNT} interactive tools across 11 arenas
                    </p>
                </div>
            </div>
        </footer>
    );
}
