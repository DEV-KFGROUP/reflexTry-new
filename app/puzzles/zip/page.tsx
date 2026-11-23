import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPuzzleMetadata } from "@/lib/puzzles/meta";
import { PuzzlePageFrame } from "@/components/puzzles/PuzzlePageFrame";
import ZipGame from "@/components/puzzles/games/ZipGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildPuzzleMetadata("zip", locale);
}

export default async function ZipPuzzlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <PuzzlePageFrame id="zip" locale={locale}>
            <ZipGame />
        </PuzzlePageFrame>
    );
}
