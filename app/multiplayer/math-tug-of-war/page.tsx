import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import MathTugOfWarGame from "./MathTugOfWarGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("math-tug-of-war", "/multiplayer/math-tug-of-war", locale);
}

export default async function MathTugOfWarPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="math-tug-of-war"
            path="/multiplayer/math-tug-of-war"
            categoryName="2-Player Battle Arena"
            categoryHref="/multiplayer"
            locale={locale}
        >
            <MathTugOfWarGame />
        </NewToolPageShell>
    );
}
