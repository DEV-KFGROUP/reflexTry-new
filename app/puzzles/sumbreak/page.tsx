import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPuzzleMetadata } from "@/lib/puzzles/meta";
import { PuzzlePageFrame } from "@/components/puzzles/PuzzlePageFrame";
import { SumbreakGame } from "@/components/puzzles/games/SumbreakGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildPuzzleMetadata("sumbreak", locale);
}

export default async function SumbreakPuzzlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <PuzzlePageFrame id="sumbreak" locale={locale}>
            <SumbreakGame />
        </PuzzlePageFrame>
    );
}
