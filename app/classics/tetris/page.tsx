import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import TetrisGame from "./TetrisGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("tetris", locale);
}

export default async function TetrisPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="tetris" backHref="/classics" backLabel="Back to Flagship Classics" locale={locale}>
            <TetrisGame />
        </FlagshipPageFrame>
    );
}
