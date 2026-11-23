import { Metadata } from "next";
import { headers } from "next/headers";
import AllToolsClient from "./AllToolsClient";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateWebPageSchema,
    generateBreadcrumbStructuredData,
    generateItemListSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getCategoryMetadata('tools', locale);
}

export default async function AllToolsPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "All Tools", url: "/tools" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "All Brain Training Tools & Games",
        "Explore our complete collection of reaction, memory, speed, accuracy, gaming, STEM, 3D lab, multiplayer, classics, and productivity tools.",
        "/tools",
        locale
    );

    const itemListSchema = generateItemListSchema([
        { position: 1, name: "Reflex & Reaction Tests", url: "/reflex", description: "Visual, audio, choice, Go/No-Go, and Flanker reaction benchmarks." },
        { position: 2, name: "Working Memory Games", url: "/memory", description: "Sequence, number span, visual grid, verbal recall, Chimp Test, and N-Back." },
        { position: 3, name: "Speed & Typing Benchmarks", url: "/speed", description: "CPS click speed, WPM typing test, mental math, and Schulte tables." },
        { position: 4, name: "Accuracy & Vision Tests", url: "/accuracy", description: "Precision clicking, pattern matching, color match, angles, and mental rotation." },
        { position: 5, name: "Esports Aim & Gaming Lab", url: "/gaming", description: "FPS aim trainer, flick shot, smooth target tracking, and rhythm tap." },
        { position: 6, name: "STEM & Physics Visual Lab", url: "/stem", description: "Interactive gravity, laser reflection optics, projectile motion, and torque balance." },
        { position: 7, name: "3D WebGL Interactive Lab", url: "/lab-3d", description: "3D orbital gravity simulation and 3D spatial aim training chamber." },
        { position: 8, name: "2-Player Battle Arena", url: "/multiplayer", description: "Split-screen reaction duel, math tug-of-war, and gravity cannon battles." },
        { position: 9, name: "Student & Work Suite", url: "/productivity", description: "Graphing calculator, unit converter, GPA solver, flashcards, 10-key, and speed reading." },
        { position: 10, name: "Flagship Classic Games", url: "/classics", description: "Authentic browser Wordle, 60fps SRS Tetris, and Chess vs Alpha-Beta AI." },
        { position: 11, name: "Mensa Logic & Word Puzzles", url: "/puzzles", description: "Nine Mensa-grade logic and word puzzles (Queens, Tango, Zip, Mini Sudoku, Patches, Sumbreak, Wend, Pinpoint, Crossclimb) with 1,200+ levels each." },
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, itemListSchema]} />
            <AllToolsClient />
        </>
    );
}







