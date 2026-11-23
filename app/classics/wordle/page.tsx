import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import WordleGame from "./WordleGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("wordle", locale);
}

export default async function WordlePage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="wordle" backHref="/classics" backLabel="Back to Flagship Classics" locale={locale}>
            <WordleGame />
        </FlagshipPageFrame>
    );
}
