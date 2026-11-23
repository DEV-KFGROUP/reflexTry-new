"use client";

import Link from "next/link";
import {
    Zap,
    Brain,
    Gauge,
    Target,
    Gamepad2,
    Atom,
    Orbit,
    Swords,
    BookOpenCheck,
    Crown,
    ArrowUpRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

interface CategoryGuideProps {
    category: "reflex" | "memory" | "speed" | "accuracy" | "gaming" | "stem" | "lab-3d" | "multiplayer" | "productivity";
}

const ALL_CATEGORIES = [
    { id: "puzzles", label: "Logic Puzzles", icon: Crown, href: "/puzzles" },
    { id: "classics", label: "Flagship Classics", icon: Gamepad2, href: "/classics" },
    { id: "reflex", label: "Reflex Arena", icon: Zap, href: "/reflex" },
    { id: "memory", label: "Memory Arena", icon: Brain, href: "/memory" },
    { id: "speed", label: "Speed Arena", icon: Gauge, href: "/speed" },
    { id: "gaming", label: "Gaming Arena", icon: Gamepad2, href: "/gaming" },
    { id: "accuracy", label: "Accuracy Arena", icon: Target, href: "/accuracy" },
    { id: "stem", label: "STEM & Physics Lab", icon: Atom, href: "/stem" },
    { id: "lab-3d", label: "3D Interactive Lab", icon: Orbit, href: "/lab-3d" },
    { id: "multiplayer", label: "2-Player Arena", icon: Swords, href: "/multiplayer" },
    { id: "productivity", label: "Student & Work Suite", icon: BookOpenCheck, href: "/productivity" },
];

export function CategoryGuideSection({ category }: CategoryGuideProps) {
    const { t, getLocalizedHref } = useTranslation();
    const otherCategories = ALL_CATEGORIES.filter((c) => c.id !== category);

    return (
        <div className="space-y-12">
            {/* Editorial Reading Guide */}
            <article className="bg-white border border-[#E6E3DB] rounded-xl p-6 sm:p-10 divide-y divide-[#E6E3DB]">
                <section className="space-y-3 pb-8 max-w-3xl">
                    <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.whatIsTitle`, "What is Training?")}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                        {t(`categoryGuide.${category}.whatIsDesc`, "")}
                    </p>
                </section>

                <section className="space-y-3 py-8 max-w-3xl">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.howToTitle`, "How to Improve?")}
                    </h2>
                    <ol className="list-decimal pl-5 space-y-2.5 text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                        <li>
                            <strong className="text-[#161614] font-semibold">
                                {t(`categoryGuide.${category}.howToStep1Title`, "Step 1")}:
                            </strong>{" "}
                            {t(`categoryGuide.${category}.howToStep1Desc`, "")}
                        </li>
                        <li>
                            <strong className="text-[#161614] font-semibold">
                                {t(`categoryGuide.${category}.howToStep2Title`, "Step 2")}:
                            </strong>{" "}
                            {t(`categoryGuide.${category}.howToStep2Desc`, "")}
                        </li>
                        <li>
                            <strong className="text-[#161614] font-semibold">
                                {t(`categoryGuide.${category}.howToStep3Title`, "Step 3")}:
                            </strong>{" "}
                            {t(`categoryGuide.${category}.howToStep3Desc`, "")}
                        </li>
                        <li>
                            <strong className="text-[#161614] font-semibold">
                                {t(`categoryGuide.${category}.howToStep4Title`, "Step 4")}:
                            </strong>{" "}
                            {t(`categoryGuide.${category}.howToStep4Desc`, "")}
                        </li>
                    </ol>
                </section>

                <section className="space-y-3 py-8 max-w-3xl">
                    <h3 className="font-serif text-xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.shouldPracticeTitle`, "Should I Practice Daily?")}
                    </h3>
                    <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                        {t(`categoryGuide.${category}.shouldPracticeDesc`, "")}
                    </p>
                </section>

                <section className="space-y-4 py-8">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.comparisonTitle`, "Tools Comparison")}
                    </h2>
                    <div className="overflow-x-auto border border-[#E6E3DB] rounded-lg">
                        <table className="w-full text-left border-collapse min-w-[560px]">
                            <thead>
                                <tr className="bg-[#FAF9F6] border-b border-[#E6E3DB]">
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                        {t("categoryHub.toolNameCol", "Tool Name")}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                        {t("categoryHub.bestForCol", "Best For")}
                                    </th>
                                    <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#78756C]">
                                        {t("categoryHub.coreBenefitCol", "Core Benefit")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#E6E3DB] text-sm text-[#57554E]">
                                {[1, 2, 3].map((row) => (
                                    <tr key={row} className="hover:bg-[#FAF9F6] transition-colors">
                                        <td className="px-4 py-3.5 font-semibold whitespace-nowrap text-[#161614]">
                                            {t(`categoryGuide.${category}.row${row}Tool`, "")}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {t(`categoryGuide.${category}.row${row}BestFor`, "")}
                                        </td>
                                        <td className="px-4 py-3.5">
                                            {t(`categoryGuide.${category}.row${row}Benefit`, "")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="space-y-3 py-8 max-w-3xl">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.benchmarksTitle`, "Benchmarks & Context")}
                    </h2>
                    <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                        {t(`categoryGuide.${category}.benchmarksDesc`, "")}
                    </p>
                </section>

                <section className="space-y-5 pt-8">
                    <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#161614] tracking-tight">
                        {t(`categoryGuide.${category}.faqTitle`, "Frequently Asked Questions")}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <h3 className="text-base font-semibold text-[#161614]">
                                {t(`categoryGuide.${category}.faq1Q`, "")}
                            </h3>
                            <p className="text-sm text-[#57554E] leading-relaxed">
                                {t(`categoryGuide.${category}.faq1A`, "")}
                            </p>
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="text-base font-semibold text-[#161614]">
                                {t(`categoryGuide.${category}.faq2Q`, "")}
                            </h3>
                            <p className="text-sm text-[#57554E] leading-relaxed">
                                {t(`categoryGuide.${category}.faq2A`, "")}
                            </p>
                        </div>
                    </div>
                </section>
            </article>

            {/* Explore All Other Arenas */}
            <section className="space-y-4">
                <h3 className="font-serif text-xl font-medium text-[#161614] tracking-tight">
                    {t("categoryHub.exploreOther", "Explore Other Arenas")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 border-t border-l border-[#E6E3DB] bg-white">
                    {otherCategories.map((c) => {
                        const CatIcon = c.icon;
                        return (
                            <Link
                                key={c.id}
                                href={getLocalizedHref(c.href)}
                                prefetch={false}
                                className="group min-h-[56px] p-4 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors flex items-center justify-between gap-2.5 touch-manipulation"
                            >
                                <div className="flex items-center gap-2.5 min-w-0">
                                    <CatIcon className="w-4 h-4 text-[#57554E] group-hover:text-[#161614] shrink-0" aria-hidden="true" />
                                    <span className="text-sm font-medium text-[#161614] group-hover:text-[#1E40AF] transition-colors truncate">
                                        {t(`categories.${c.id}.title`, c.label)}
                                    </span>
                                </div>
                                <ArrowUpRight className="w-3.5 h-3.5 text-[#78756C] group-hover:text-[#1E40AF] shrink-0" aria-hidden="true" />
                            </Link>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}
