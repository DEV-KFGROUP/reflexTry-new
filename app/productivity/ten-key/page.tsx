import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import TenKeyGame from "./TenKeyGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("ten-key", "/productivity/ten-key", locale);
}

export default async function TenKeyPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="ten-key"
            path="/productivity/ten-key"
            categoryName="Student & Work Suite"
            categoryHref="/productivity"
            locale={locale}
        >
            <TenKeyGame />
        </NewToolPageShell>
    );
}
