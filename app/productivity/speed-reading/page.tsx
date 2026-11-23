import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import SpeedReadingGame from "./SpeedReadingGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("speed-reading", "/productivity/speed-reading", locale);
}

export default async function SpeedReadingPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="speed-reading"
            path="/productivity/speed-reading"
            categoryName="Student & Work Suite"
            categoryHref="/productivity"
            locale={locale}
        >
            <SpeedReadingGame />
        </NewToolPageShell>
    );
}
