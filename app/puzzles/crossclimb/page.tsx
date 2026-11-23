import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPuzzleMetadata } from "@/lib/puzzles/meta";
import { PuzzlePageFrame } from "@/components/puzzles/PuzzlePageFrame";
import { CrossclimbGame } from "@/components/puzzles/games/CrossclimbGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildPuzzleMetadata("crossclimb", locale);
}

export default async function CrossclimbPuzzlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <PuzzlePageFrame id="crossclimb" locale={locale}>
            <CrossclimbGame />
        </PuzzlePageFrame>
    );
}
