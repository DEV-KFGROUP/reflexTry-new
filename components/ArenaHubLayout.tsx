"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { CategoryGuideSection } from "@/components/CategoryGuideSection";
import { ToolIcon } from "@/components/ToolIcon";

export interface ArenaToolItem {
    title: string;
    desc: string;
    icon: React.ElementType;
    href: string;
}

export interface ArenaBenefitItem {
    icon: React.ElementType;
    titleKey: string;
    titleFallback: string;
    descKey: string;
    descFallback: string;
}

export interface ArenaHubConfig {
    category: "reflex" | "memory" | "speed" | "gaming" | "accuracy" | "stem" | "lab-3d" | "multiplayer" | "productivity";
    icon: React.ElementType;
    kicker: string;
    heroTitleFallback: string;
    heroSubtitleFallback: string;
    heroDescFallback: string;
    whatItCoversFallback: string;
    benefits: [ArenaBenefitItem, ArenaBenefitItem, ArenaBenefitItem];
    tools: ArenaToolItem[];
}

export function ArenaHubLayout({ config }: { config: ArenaHubConfig }) {
    const { t, getLocalizedHref } = useTranslation();

    return (
        <div className="bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8 min-h-screen text-[#161614]">
            <div className="max-w-7xl mx-auto space-y-14">
                {/* Open Editorial Arena Header (No Nested Cards-in-Cards) */}
                <header className="space-y-8 border-b border-[#D8D4C9] pb-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
                            <ToolIcon
                                toolId={config.category}
                                variant="3d-pedestal"
                                size="xl"
                                interactive
                                title={t(`categoryHub.${config.category}.heroTitle`, config.heroTitleFallback)}
                                className="hidden sm:inline-flex mt-1"
                            />
                            <div className="space-y-3">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                    {config.kicker} · {config.tools.length} interactive tools
                                </p>
                                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                                    {t(`categoryHub.${config.category}.heroTitle`, config.heroTitleFallback)}
                                </h1>
                                <p className="text-base sm:text-lg text-[#3F3E39] leading-relaxed">
                                    {t(`categoryHub.${config.category}.heroSubtitle`, config.heroSubtitleFallback)}
                                </p>
                                <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed max-w-2xl">
                                    {t(`categoryHub.${config.category}.heroDesc`, config.heroDescFallback)}
                                </p>
                            </div>
                        </div>

                        <Link
                            href={getLocalizedHref(config.tools[0]?.href ?? "/tools")}
                            className="w-full md:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2"
                        >
                            <span>Start Featured Test</span>
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                    </div>

                    {/* Hairline-Divided 3-Column Focus Strip */}
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-[#E6E3DB] pt-6 gap-6">
                        {config.benefits.map((benefit, index) => {
                            const BenefitIcon = benefit.icon;
                            return (
                                <div
                                    key={benefit.titleKey}
                                    className={`flex items-start gap-3 ${
                                        index > 0 ? "md:border-l md:border-[#E6E3DB] md:pl-6" : ""
                                    }`}
                                >
                                    <BenefitIcon
                                        className="w-4 h-4 text-[#57554E] shrink-0 mt-1"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <h2 className="text-sm font-semibold text-[#161614]">
                                            {t(benefit.titleKey, benefit.titleFallback)}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-[#57554E] mt-0.5 leading-relaxed">
                                            {t(benefit.descKey, benefit.descFallback)}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Concise Scope Note */}
                    <p className="text-sm text-[#57554E] leading-relaxed max-w-3xl">
                        <strong className="font-semibold text-[#161614]">
                            {t(`categoryHub.${config.category}.whatItCovers`, "What this arena covers")}:{" "}
                        </strong>
                        {t(`categoryHub.${config.category}.whatItCoversDesc`, config.whatItCoversFallback)}
                    </p>
                </header>

                {/* Ruled Architectural Tool Catalog Grid */}
                <section aria-label={`${config.category} tools`} className="space-y-5">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                            Available Benchmarks
                        </h2>
                        <span className="text-xs font-mono text-[#78756C] tabular-nums">
                            {config.tools.length} interactive tests
                        </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        {config.tools.map((tool) => {
                            const shortSlug = tool.href.replace(`/${config.category}/`, "");
                            const localizedTitle = t(`tools.${shortSlug}.title`, tool.title);
                            const localizedDesc = t(`tools.${shortSlug}.desc`, tool.desc);

                            return (
                                <Link
                                    key={tool.href}
                                    href={getLocalizedHref(tool.href)}
                                    className="group min-h-[60px] p-6 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors flex flex-col justify-between gap-5 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E40AF]"
                                >
                                    <div className="space-y-3.5">
                                        <ToolIcon
                                            toolId={tool.href}
                                            variant="3d"
                                            size="md"
                                            title={localizedTitle}
                                        />
                                        <div>
                                            <h3 className="text-base font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors mb-1">
                                                {localizedTitle}
                                            </h3>
                                            <p className="text-sm text-[#57554E] leading-relaxed">
                                                {localizedDesc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-[#F0EDE6] text-xs font-medium text-[#78756C] group-hover:text-[#1E40AF] transition-colors">
                                        <span>Open benchmark</span>
                                        <ArrowUpRight
                                            className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>

                {/* Category Guide & Related Arenas */}
                <CategoryGuideSection category={config.category} />
            </div>
        </div>
    );
}
