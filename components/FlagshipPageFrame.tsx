import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { FLAGSHIP_TOOLS_META } from "@/lib/flagship-tools-meta";
import { SchemaInjector } from "@/components/SchemaInjector";
import { ToolIcon } from "@/components/ToolIcon";
import {
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
    generateHowToSchema,
    generateToolStructuredData,
    generateWebPageSchema,
} from "@/lib/structured-data";

interface FlagshipPageFrameProps {
    id: keyof typeof FLAGSHIP_TOOLS_META;
    backHref: string;
    backLabel: string;
    locale?: string;
    children: React.ReactNode;
}

export function FlagshipPageFrame({ id, backHref, backLabel, locale = "en", children }: FlagshipPageFrameProps) {
    const meta = FLAGSHIP_TOOLS_META[id];
    const categoryName = meta.category === "classics" ? "Flagship Classics" : "Student & Work Suite";
    const siblingTools = Object.entries(FLAGSHIP_TOOLS_META).filter(
        ([key, item]) => key !== id && item.category === meta.category
    );

    const toolSchema = generateToolStructuredData(
        String(id),
        meta.shortTitle,
        meta.description,
        meta.path,
        locale
    );
    const breadcrumbSchema = generateBreadcrumbStructuredData(
        [
            { name: "Home", url: "/" },
            { name: categoryName, url: backHref },
            { name: meta.shortTitle, url: meta.path },
        ],
        locale
    );
    const webPageSchema = generateWebPageSchema(meta.shortTitle, meta.description, meta.path, locale);
    const howToSchema = generateHowToSchema(meta.shortTitle, meta.guidePoints);
    const faqSchema = generateFAQPageSchema(meta.faqs);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-8 pb-20 px-4 sm:px-6 lg:px-8">
            <SchemaInjector
                schemas={[
                    toolSchema,
                    breadcrumbSchema,
                    webPageSchema,
                    howToSchema,
                    ...(faqSchema ? [faqSchema] : []),
                ]}
            />
            <div className="max-w-5xl mx-auto space-y-8">
                <header className="space-y-2.5 pb-6 border-b border-[#E6E3DB]">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#78756C] hover:text-[#161614] transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{backLabel}</span>
                    </Link>
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                        <ToolIcon
                            toolId={String(id)}
                            variant="3d-pedestal"
                            size="lg"
                            interactive
                            title={meta.shortTitle}
                            className="mt-0.5 shrink-0"
                        />
                        <div className="space-y-1.5 min-w-0 flex-1">
                            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.1] [text-wrap:balance] break-words">
                                {meta.shortTitle}
                            </h1>
                            <p className="text-sm sm:text-base text-[#57554E] max-w-3xl leading-relaxed hero-subtitle">
                                {meta.description}
                            </p>
                        </div>
                    </div>
                </header>

                <div className="w-full min-w-0">{children}</div>

                <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-7 space-y-3">
                    <h2 className="font-serif text-xl font-medium text-[#161614]">Quick Tips &amp; Features</h2>
                    <ul className="space-y-2 text-sm text-[#57554E] list-disc pl-5 leading-relaxed">
                        {meta.guidePoints.map((pt, i) => (
                            <li key={i}>{pt}</li>
                        ))}
                    </ul>
                </section>

                {/* Visible FAQ matching FAQPage JSON-LD */}
                {meta.faqs.length > 0 && (
                    <section
                        aria-labelledby="flagship-faq-heading"
                        className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-7 space-y-4"
                    >
                        <h2 id="flagship-faq-heading" className="font-serif text-xl font-medium text-[#161614]">
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

                {/* Internal Cross-Linking Strip */}
                <section className="space-y-4 pt-2">
                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
                        <h2 className="font-serif text-xl font-medium text-[#161614]">
                            More in {categoryName}
                        </h2>
                        <Link
                            href="/puzzles"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E40AF] hover:text-[#161614] transition-colors whitespace-nowrap"
                        >
                            <span>Explore 9 Mensa Logic Puzzles</span>
                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        {siblingTools.map(([key, item]) => (
                            <Link
                                key={key}
                                href={item.path}
                                className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-5 flex flex-col justify-between gap-2 transition-colors"
                            >
                                <div className="space-y-2.5">
                                    <ToolIcon toolId={key} variant="3d" size="sm" title={item.shortTitle} />
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C]">
                                            {categoryName}
                                        </p>
                                        <h3 className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">
                                            {item.shortTitle}
                                        </h3>
                                        <p className="text-xs text-[#57554E] line-clamp-2 leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
