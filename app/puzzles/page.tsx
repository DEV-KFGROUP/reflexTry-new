import type { Metadata } from "next";
import { headers } from "next/headers";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { PUZZLE_LIST, PUZZLES_HUB_FAQS } from "@/lib/puzzles/meta";
import { PuzzlesHubClient } from "@/app/puzzles/PuzzlesHubClient";
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
    generateItemListSchema,
    generateWebPageSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getCategoryMetadata("puzzles", locale);
}

export default async function PuzzlesHubPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData(
        [
            { name: "Home", url: "/" },
            { name: "Logic Puzzles", url: "/puzzles" },
        ],
        locale
    );
    const webPageSchema = generateWebPageSchema(
        "Mensa Logic & Word Puzzles — 9 Games, 10,800+ Levels",
        "Play Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint, and Crossclimb with 1,200+ deterministic levels each and daily challenges.",
        "/puzzles",
        locale
    );
    const itemListSchema = generateItemListSchema(
        PUZZLE_LIST.map((p, idx) => ({
            position: idx + 1,
            name: p.shortTitle,
            url: p.path,
            description: p.tagline,
        }))
    );
    const faqSchema = generateFAQPageSchema(PUZZLES_HUB_FAQS);

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <SchemaInjector
                schemas={[
                    breadcrumbSchema,
                    webPageSchema,
                    itemListSchema,
                    ...(faqSchema ? [faqSchema] : []),
                ]}
            />
            <div className="max-w-7xl mx-auto space-y-14">
                <PuzzlesHubClient />

                <section
                    aria-labelledby="puzzles-hub-faq"
                    className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-5"
                >
                    <h2 id="puzzles-hub-faq" className="font-serif text-2xl font-medium text-[#161614]">
                        Frequently Asked Questions
                    </h2>
                    <dl className="divide-y divide-[#F0EDE6]">
                        {PUZZLES_HUB_FAQS.map((faq, idx) => (
                            <div key={idx} className={idx === 0 ? "pb-4" : "pt-4 pb-4 last:pb-0"}>
                                <dt className="text-sm font-semibold text-[#161614]">{faq.question}</dt>
                                <dd className="mt-1.5 text-sm text-[#57554E] leading-relaxed aeo-answer">
                                    {faq.answer}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>
            </div>
        </div>
    );
}
