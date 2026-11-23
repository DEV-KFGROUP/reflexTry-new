import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import FlashcardsTool from "./FlashcardsTool";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("flashcards", locale);
}

export default async function FlashcardsPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="flashcards" backHref="/productivity" backLabel="Back to Student & Work Suite" locale={locale}>
            <FlashcardsTool />
        </FlagshipPageFrame>
    );
}
