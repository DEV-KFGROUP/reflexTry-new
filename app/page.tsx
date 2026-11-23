import { Metadata } from "next";
import { headers } from "next/headers";
import HomeClient from "./HomeClient";
import { HeroSection } from "./HeroSection";
import { HomeSEOContent } from "./HomeSEOContent";
import { getHomeMetadata } from "@/lib/seo-utils";
import { StructuredData } from "@/components/StructuredData";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebsiteStructuredData, generateFAQPageSchema, generateBreadcrumbStructuredData, generateItemListSchema } from "@/lib/structured-data";

import { HOME_FAQS } from "@/lib/site-faqs";

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const locale = headerList.get("x-locale") || "en";
    return getHomeMetadata(locale);
}

export default async function Home() {
    const headerList = await headers();
    const locale = headerList.get("x-locale") || "en";
    const structuredData = generateWebsiteStructuredData(locale);
    const faqSchema = generateFAQPageSchema(HOME_FAQS);

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" }
    ], locale);

    const arenaListSchema = generateItemListSchema([
        { position: 1, name: "Mensa Logic & Word Puzzles (9 Games)", url: "/puzzles", description: "Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint & Crossclimb — 1,200+ levels each." },
        { position: 2, name: "Reaction Time & Reflex Benchmarks", url: "/reflex", description: "Millisecond visual, audio, choice, Go/No-Go, and Flanker reaction tests." },
        { position: 3, name: "Working Memory Tests", url: "/memory", description: "Number span, visual patterns, sequence memory, Chimp Test, verbal recall, and Dual N-Back." },
        { position: 4, name: "Flagship Classic Games", url: "/classics", description: "Daily & Unlimited Wordle, 60fps SRS Tetris, and full-rules Chess vs Alpha-Beta AI." },
        { position: 5, name: "Speed & Typing Benchmarks", url: "/speed", description: "CPS click speed, 1-minute typing WPM, mental math speed, and Schulte tables." },
        { position: 6, name: "Esports FPS Aim & Accuracy", url: "/gaming", description: "Browser FPS aim trainer, flick shots, smooth target tracking, and precision clicking." },
        { position: 7, name: "Student & Work Productivity Suite", url: "/productivity", description: "Graphing calculator, unit & physics solver, GPA calculator, flashcards, and 10-key KPH." },
        { position: 8, name: "3D WebGL & STEM Physics Labs", url: "/lab-3d", description: "Interactive 3D solar gravity well, 3D spatial aim arena, optics, and projectile physics." },
    ]);

    return (
        <>
            <StructuredData type="WebSite" data={structuredData} />
            <SchemaInjector schemas={[faqSchema, breadcrumbSchema, arenaListSchema]} />
            {/* Server-rendered hero section for immediate LCP */}
            <HeroSection />
            {/* Client component for interactive tools grid */}
            <HomeClient />
            {/* Server-rendered educational content - always in HTML for crawlers */}
            <HomeSEOContent />
        </>
    );
}
