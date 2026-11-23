"use client";

import {
    HelpCircle,
    Info,
    TrendingUp,
    ArrowRight,
    CheckCircle2,
    Trophy,
    Brain,
    Gamepad2,
    MousePointer2,
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

interface FAQItem {
    question: string;
    answer: string;
}

interface RelatedTool {
    id: string;
    title: string;
    href: string;
}

export interface ContentSection {
    title: string;
    description?: string;
    content?: string;
    icon?: string;
}

export interface StepSection {
    title: string;
    description?: string;
    subSteps?: string[];
    steps?: string[];
}

export interface ToolContentProps {
    title: string;
    description: string | ContentSection[];
    howToUse: string | StepSection[];
    howToImprove: string | ContentSection[];
    howToPlay: string[];
    benefits: string[];
    faqs: FAQItem[];
    relatedTools?: RelatedTool[];
}

export function ToolContent({
    description,
    howToUse,
    howToImprove,
    howToPlay,
    benefits,
    faqs,
    relatedTools = [],
}: ToolContentProps) {
    const { t, getLocalizedHref } = useTranslation();

    const renderDescription = () => {
        if (typeof description === "string") {
            return (
                <div
                    className="prose prose-stone max-w-none text-[#57554E] leading-relaxed prose-headings:text-[#161614] prose-headings:font-semibold prose-headings:mt-4 prose-headings:mb-2 prose-p:mb-3 prose-strong:text-[#161614] prose-ul:my-3 prose-li:my-1"
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            );
        }

        return (
            <div className="space-y-4">
                {description?.map((section, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-semibold text-[#161614]">
                            {section.title}
                        </h3>
                        <div className="text-[#57554E] leading-relaxed text-sm sm:text-base">
                            {section.content || section.description}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderHowToUse = () => {
        if (typeof howToUse === "string") {
            return (
                <div
                    className="prose prose-stone prose-sm max-w-none text-[#57554E] leading-relaxed prose-headings:text-[#161614] prose-headings:font-semibold prose-strong:text-[#161614]"
                    dangerouslySetInnerHTML={{ __html: howToUse }}
                />
            );
        }

        return (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {howToUse?.map((step, idx) => (
                    <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] flex flex-col space-y-2.5"
                    >
                        <div className="flex items-center gap-2.5">
                            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white text-[#161614] font-mono font-bold text-xs border border-[#D8D4C9] shrink-0 tabular-nums">
                                {idx + 1}
                            </span>
                            <h4 className="font-semibold text-[#161614] text-sm">
                                {step.title}
                            </h4>
                        </div>
                        {step.description && (
                            <p className="text-[#57554E] text-xs sm:text-sm leading-relaxed">
                                {step.description}
                            </p>
                        )}
                        {(step.subSteps || step.steps) && (
                            <ul className="pt-1 space-y-1.5 text-xs text-[#3F3E39]">
                                {(step.subSteps || step.steps)?.map((sub, sIdx) => (
                                    <li key={sIdx} className="flex items-start gap-2">
                                        <CheckCircle2
                                            className="w-3.5 h-3.5 mt-0.5 text-[#1E40AF] shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span>{sub}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderHowToImprove = () => {
        if (typeof howToImprove === "string") {
            return (
                <div
                    className="prose prose-stone prose-sm max-w-none text-[#57554E] leading-relaxed prose-headings:text-[#161614] prose-headings:font-semibold prose-strong:text-[#161614]"
                    dangerouslySetInnerHTML={{ __html: howToImprove }}
                />
            );
        }

        return (
            <div className="grid gap-4 sm:grid-cols-2">
                {howToImprove?.map((tip, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] p-5 space-y-2"
                    >
                        <h4 className="text-sm sm:text-base font-semibold text-[#161614] flex items-center gap-2.5">
                            <span className="flex items-center justify-center w-6 h-6 rounded-md bg-white border border-[#D8D4C9] text-[#3F3E39] font-mono text-xs font-bold shrink-0 tabular-nums">
                                {idx + 1}
                            </span>
                            <span>{tip.title}</span>
                        </h4>
                        <p className="text-sm text-[#57554E] leading-relaxed">
                            {tip.description || tip.content}
                        </p>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="w-full max-w-6xl mx-auto mt-10 mb-14 space-y-8">
            {/* Guide Header & Quick Anchor Bar */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-5 border-b border-[#D8D4C9]">
                <div className="space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                        Reference Guide
                    </p>
                    <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#161614] tracking-[-0.02em]">
                        {t("guide.howItWorks", "How It Works & Tips")}
                    </h2>
                    <p className="text-sm text-[#57554E]">
                        {t(
                            "guide.subtitle",
                            "Review test mechanics, scoring methodology, and focused improvement strategies."
                        )}
                    </p>
                </div>

                <nav aria-label="Jump to guide sections" className="flex flex-wrap gap-2">
                    {[
                        { href: "#guide-about", label: t("guide.about", "About") },
                        { href: "#guide-how-to-play", label: t("guide.howToPlay", "How to Play") },
                        { href: "#guide-tips", label: t("guide.proTips", "Strategies") },
                        { href: "#guide-faq", label: t("guide.faq", "FAQ") },
                    ].map(({ href, label }) => (
                        <a
                            key={href}
                            href={href}
                            className="inline-flex items-center min-h-[44px] px-4 py-2 rounded-lg text-xs font-semibold bg-white border border-[#E6E3DB] text-[#3F3E39] hover:border-[#161614] hover:text-[#161614] transition-colors touch-manipulation"
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>

            {/* Single-Elevation Guide Container with Hairline Dividers */}
            <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 lg:p-10 divide-y divide-[#F0EDE6]">
                {/* About Section */}
                <section id="guide-about" className="scroll-mt-24 pb-8 space-y-5">
                    <h3 className="font-serif text-xl font-medium text-[#161614] flex items-center gap-2.5">
                        <Info className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                        <span>{t("guide.aboutTest", "About This Test")}</span>
                    </h3>
                    <div className="max-w-3xl">{renderDescription()}</div>

                    {benefits && benefits.length > 0 && (
                        <div className="pt-5 border-t border-[#F0EDE6] space-y-3">
                            <h4 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
                                <Brain className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                                <span>{t("guide.trains", "What This Test Trains")}</span>
                            </h4>
                            <ul className="grid sm:grid-cols-2 gap-2.5">
                                {benefits.map((benefit, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-start gap-2.5 p-3 rounded-xl border border-[#E6E3DB] bg-[#FAF9F6] text-sm text-[#3F3E39]"
                                    >
                                        <CheckCircle2
                                            className="w-4 h-4 mt-0.5 text-[#1E40AF] shrink-0"
                                            aria-hidden="true"
                                        />
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </section>

                {/* How to Play Section */}
                <section id="guide-how-to-play" className="scroll-mt-24 py-8 space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-serif text-xl font-medium text-[#161614] flex items-center gap-2.5">
                            <Gamepad2 className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                            <span>{t("guide.instructions", "Instructions & Mechanics")}</span>
                        </h3>
                        <span className="text-[11px] font-mono text-[#78756C] uppercase tracking-[0.12em]">
                            {t("guide.quickSetup", "Quick Setup")}
                        </span>
                    </div>

                    {renderHowToUse()}

                    {howToPlay && howToPlay.length > 0 && (
                        <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex flex-col md:flex-row md:items-start gap-3 text-xs sm:text-sm">
                            <span className="font-semibold text-[#161614] flex items-center gap-1.5 shrink-0">
                                <Trophy className="w-4 h-4 text-[#57554E]" aria-hidden="true" />
                                {t("guide.keyRules", "Key Rules:")}
                            </span>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[#3F3E39]">
                                {howToPlay.map((step, idx) => (
                                    <span key={idx} className="inline-flex items-center gap-1.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" aria-hidden="true" />
                                        <span>{step}</span>
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </section>

                {/* Strategies Section */}
                <section id="guide-tips" className="scroll-mt-24 py-8 space-y-5">
                    <h3 className="font-serif text-xl font-medium text-[#161614] flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                        <span>{t("guide.strategies", "Improvement Strategies")}</span>
                    </h3>
                    {renderHowToImprove()}
                </section>

                {/* FAQ Section */}
                <section id="guide-faq" className="scroll-mt-24 pt-8 space-y-5" data-speakable="true">
                    <h3 className="font-serif text-xl font-medium text-[#161614] flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                        <span>{t("guide.faqs", "Frequently Asked Questions")}</span>
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs?.map((faq, idx) => (
                            <div
                                key={idx}
                                className="space-y-2"
                                itemScope
                                itemType="https://schema.org/Question"
                            >
                                <h4 className="text-base font-semibold text-[#161614]" itemProp="name">
                                    {faq.question}
                                </h4>
                                <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                                    <p
                                        className="aeo-answer text-[#57554E] text-sm leading-relaxed"
                                        itemProp="text"
                                    >
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
                <section className="space-y-4">
                    <h2 className="font-serif text-xl font-medium text-[#161614] tracking-tight">
                        {t("guide.continueTraining", "Continue Your Training")}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        {relatedTools.map((tool) => (
                            <Link
                                key={tool.id}
                                href={getLocalizedHref(tool.href)}
                                className="group min-h-[60px] flex items-center gap-3.5 p-4 border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] transition-colors touch-manipulation"
                            >
                                <div className="shrink-0 w-9 h-9 rounded-lg bg-[#FAF9F6] border border-[#E6E3DB] group-hover:bg-white flex items-center justify-center transition-colors">
                                    <MousePointer2
                                        className="w-4 h-4 text-[#57554E] group-hover:text-[#161614] transition-colors"
                                        aria-hidden="true"
                                    />
                                </div>
                                <span className="text-[#161614] text-sm font-semibold group-hover:text-[#1E40AF] transition-colors flex-1 truncate">
                                    {tool.title}
                                </span>
                                <ArrowRight
                                    className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF] group-hover:translate-x-0.5 transition-all shrink-0"
                                    aria-hidden="true"
                                />
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}
