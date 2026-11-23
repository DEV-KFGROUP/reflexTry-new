import type { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { SchemaInjector } from "@/components/SchemaInjector";
import { ToolIcon } from "@/components/ToolIcon";
import {
    generateBreadcrumbStructuredData,
    generateItemListSchema,
    generateWebPageSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getCategoryMetadata("classics", locale);
}

const CLASSICS = [
    {
        slug: "wordle",
        href: "/classics/wordle",
        title: "Wordle",
        kicker: "Daily & Unlimited Word Puzzle",
        desc: "Crack the 5-letter word in 6 tries with accurate duplicate-letter logic, physical & on-screen QWERTY keyboard, streak tracking, and emoji sharing.",
    },
    {
        slug: "tetris",
        href: "/classics/tetris",
        title: "Tetris",
        kicker: "60fps Falling-Block Arcade",
        desc: "All 7 Tetrominoes with 7-bag randomization, SRS wall kicks, translucent ghost landing preview, Hold slot, Next 3 queue, and responsive touch controls.",
    },
    {
        slug: "chess",
        href: "/classics/chess",
        title: "Chess vs AI",
        kicker: "Full-Rules Board & Minimax Engine",
        desc: "Play full-rules 8×8 chess including castling, en passant, promotion, checkmate detection, algebraic history, and 3 AI tiers or 2-Player Pass & Play.",
    },
];

export default async function ClassicsHubPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData(
        [
            { name: "Home", url: "/" },
            { name: "Flagship Classics", url: "/classics" },
        ],
        locale
    );
    const webPageSchema = generateWebPageSchema(
        "Flagship Classic Games — Wordle, Tetris & Chess",
        "Play hand-crafted browser classics with authentic rules: Daily & Unlimited Wordle, 60fps SRS Tetris, and full-rules Chess vs Alpha-Beta AI.",
        "/classics",
        locale
    );
    const itemListSchema = generateItemListSchema(
        CLASSICS.map((item, idx) => ({
            position: idx + 1,
            name: item.title,
            url: item.href,
            description: item.desc,
        }))
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, itemListSchema]} />
            <div className="max-w-7xl mx-auto space-y-12">
                <header className="border-b border-[#D8D4C9] pb-10">
                    <div className="flex items-start gap-4 sm:gap-5 max-w-3xl">
                        <ToolIcon
                            toolId="classics"
                            variant="3d-pedestal"
                            size="xl"
                            interactive
                            title="Flagship Classic Games"
                            className="hidden sm:inline-flex mt-1"
                        />
                        <div className="space-y-3">
                            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                                Hand-Crafted Classics · 3 Complete-Rules Games
                            </p>
                            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-[-0.02em] text-[#161614] leading-[1.08] [text-wrap:balance]">
                                Flagship Classic Games
                            </h1>
                            <p className="text-base text-[#57554E] leading-relaxed">
                                Three timeless, complete-rules classics built from scratch for speed, keyboard precision, and pure replayability — no bloated menus or filler levels.
                            </p>
                        </div>
                    </div>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                    {CLASSICS.map((item) => (
                        <Link
                            key={item.slug}
                            href={item.href}
                            className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-7 flex flex-col justify-between gap-6 transition-colors"
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between gap-2">
                                    <ToolIcon toolId={item.slug} variant="3d" size="lg" title={item.title} />
                                    <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#78756C] text-right">
                                        {item.kicker}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <h2 className="font-serif text-2xl font-medium text-[#161614] group-hover:text-[#1E40AF] transition-colors">
                                        {item.title}
                                    </h2>
                                    <p className="text-sm text-[#57554E] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#F0EDE6] flex items-center justify-between text-xs font-medium text-[#78756C] group-hover:text-[#1E40AF] transition-colors">
                                <span>Play {item.title}</span>
                                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                            </div>
                        </Link>
                    ))}
                </section>

                <section className="space-y-4 pt-2">
                    <h2 className="font-serif text-xl font-medium text-[#161614]">
                        Explore Related Arenas
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#E6E3DB] bg-white">
                        <Link href="/productivity" className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-5 flex items-center justify-between gap-3 transition-colors">
                            <div className="flex items-center gap-3">
                                <ToolIcon toolId="productivity" variant="3d" size="sm" title="Student & Work Tools" />
                                <div>
                                    <p className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">Student &amp; Work Tools</p>
                                    <p className="text-xs text-[#57554E]">Graphing Calc, Units, GPA, Flashcards</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF]" aria-hidden="true" />
                        </Link>

                        <Link href="/stem" className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-5 flex items-center justify-between gap-3 transition-colors">
                            <div className="flex items-center gap-3">
                                <ToolIcon toolId="stem" variant="3d" size="sm" title="PhET-Style STEM Labs" />
                                <div>
                                    <p className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">PhET-Style STEM Labs</p>
                                    <p className="text-xs text-[#57554E]">Gravity, Optics, Projectiles &amp; Torque</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF]" aria-hidden="true" />
                        </Link>

                        <Link href="/reflex" className="group border-r border-b border-[#E6E3DB] hover:bg-[#FAF9F6] p-5 flex items-center justify-between gap-3 transition-colors">
                            <div className="flex items-center gap-3">
                                <ToolIcon toolId="reflex" variant="3d" size="sm" title="Human Benchmarks" />
                                <div>
                                    <p className="text-sm font-semibold text-[#161614] group-hover:text-[#1E40AF] transition-colors">Human Benchmarks</p>
                                    <p className="text-xs text-[#57554E]">Reaction, Memory, Typing &amp; Aim</p>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-[#78756C] group-hover:text-[#1E40AF]" aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
