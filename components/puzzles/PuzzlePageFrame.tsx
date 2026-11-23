import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PUZZLE_LIST, PUZZLES_META, type PuzzleId } from "@/lib/puzzles/meta";
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
    generateHowToSchema,
    generateToolStructuredData,
    generateWebPageSchema,
} from "@/lib/structured-data";

interface PuzzlePageFrameProps {
    id: PuzzleId;
    locale?: string;
    children: React.ReactNode;
}

export function PuzzlePageFrame({ id, locale = "en", children }: PuzzlePageFrameProps) {
    const meta = PUZZLES_META[id];
    const otherPuzzles = PUZZLE_LIST.filter((p) => p.id !== id).slice(0, 4);

    const toolSchema = generateToolStructuredData(
        `puzzle-${meta.id}`,
        meta.shortTitle,
        meta.description,
        meta.path,
        locale
    );
    const breadcrumbSchema = generateBreadcrumbStructuredData(
        [
            { name: "Home", url: "/" },
            { name: "Logic Puzzles", url: "/puzzles" },
            { name: meta.shortTitle, url: meta.path },
        ],
        locale
    );
    const webPageSchema = generateWebPageSchema(meta.shortTitle, meta.description, meta.path, locale);
    const howToSchema = generateHowToSchema(meta.shortTitle, meta.rules);
    const faqSchema = generateFAQPageSchema(meta.faqs);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-20 px-4 sm:px-6 lg:px-8">
            <SchemaInjector
                schemas={[
                    toolSchema,
                    breadcrumbSchema,
                    webPageSchema,
                    howToSchema,
                    ...(faqSchema ? [faqSchema] : []),
                ]}
            />
            <div className="max-w-5xl mx-auto space-y-10">
                <div>{children}</div>

                {/* Editorial Strategy & Rules Guide */}
                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                        <h2 className="font-serif text-xl font-medium text-[#161614]">
                            How to Play {meta.shortTitle}
                        </h2>
                        <ul className="space-y-2 text-sm text-[#57554E] list-disc pl-5 leading-relaxed">
                            {meta.rules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h2 className="font-serif text-xl font-medium text-[#161614]">
                            Mensa Deduction Tips
                        </h2>
                        <ul className="space-y-2 text-sm text-[#57554E] list-disc pl-5 leading-relaxed">
                            {meta.guidePoints.map((pt, idx) => (
                                <li key={idx}>{pt}</li>
                            ))}
                        </ul>
                    </div>
                </section>

                {/* Visible FAQ matching FAQPage JSON-LD */}
                {meta.faqs.length > 0 && (
                    <section
                        aria-labelledby="puzzle-faq-heading"
                        className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-5"
                    >
                        <h2 id="puzzle-faq-heading" className="font-serif text-xl font-medium text-[#161614]">
                            {meta.shortTitle} Frequently Asked Questions
                        </h2>
                        <dl className="divide-y divide-[#F0EDE6]">
                            {meta.faqs.map((faq, idx) => (
                                <div key={idx} className={idx === 0 ? "pb-4" : "pt-4 pb-4 last:pb-0"}>
                                    <dt className="text-sm font-semibold text-[#161614]">{faq.question}</dt>
                                    <dd className="mt-1.5 text-sm text-[#57554E] leading-relaxed aeo-answer">
                                        {faq.answer}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>
                )}

                {/* Related Puzzles Strip */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <h2 className="font-serif text-xl font-medium text-[#161614]">
                            More Logic &amp; Word Puzzles
                        </h2>
                        <Link
                            href="/puzzles"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors whitespace-nowrap"
                        >
                            <span>View all 9 games</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E6E3DB] bg-white">
                        {otherPuzzles.map((p) => (
                            <Link
                                key={p.id}
                                href={p.path}
                                className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-4 flex flex-col justify-between gap-2 transition-colors"
                            >
                                <div className="space-y-1">
                                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#78756C]">
                                        {p.groupLabel} · 1,200 Levels
                                    </p>
                                    <h3 className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">
                                        {p.shortTitle}
                                    </h3>
                                    <p className="text-xs text-[#57554E] line-clamp-2 leading-relaxed">
                                        {p.tagline}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
