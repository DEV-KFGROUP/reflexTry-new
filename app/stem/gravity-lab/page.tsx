import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import GravityLabGame from "./GravityLabGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("gravity-lab", "/stem/gravity-lab", locale);
}

export default async function GravityLabPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="gravity-lab"
            path="/stem/gravity-lab"
            categoryName="STEM & Physics Lab"
            categoryHref="/stem"
            locale={locale}
        >
            <GravityLabGame />
        </NewToolPageShell>
    );
}
