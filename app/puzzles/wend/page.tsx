import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPuzzleMetadata } from "@/lib/puzzles/meta";
import { PuzzlePageFrame } from "@/components/puzzles/PuzzlePageFrame";
import { WendGame } from "@/components/puzzles/games/WendGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildPuzzleMetadata("wend", locale);
}

export default async function WendPuzzlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <PuzzlePageFrame id="wend" locale={locale}>
            <WendGame />
        </PuzzlePageFrame>
    );
}
