import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import ChessGame from "./ChessGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("chess", locale);
}

export default async function ChessPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="chess" backHref="/classics" backLabel="Back to Flagship Classics" locale={locale}>
            <ChessGame />
        </FlagshipPageFrame>
    );
}
