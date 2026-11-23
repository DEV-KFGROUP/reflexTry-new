import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import LaserReflectionGame from "./LaserReflectionGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("laser-reflection", "/stem/laser-reflection", locale);
}

export default async function LaserReflectionPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="laser-reflection"
            path="/stem/laser-reflection"
            categoryName="STEM & Physics Lab"
            categoryHref="/stem"
            locale={locale}
        >
            <LaserReflectionGame />
        </NewToolPageShell>
    );
}
