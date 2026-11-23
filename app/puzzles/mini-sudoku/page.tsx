import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildPuzzleMetadata } from "@/lib/puzzles/meta";
import { PuzzlePageFrame } from "@/components/puzzles/PuzzlePageFrame";
import MiniSudokuGame from "@/components/puzzles/games/MiniSudokuGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildPuzzleMetadata("mini-sudoku", locale);
}

export default async function MiniSudokuPuzzlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <PuzzlePageFrame id="mini-sudoku" locale={locale}>
            <MiniSudokuGame />
        </PuzzlePageFrame>
    );
}
