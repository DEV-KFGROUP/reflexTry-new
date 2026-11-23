import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import FocusSprintGame from "./FocusSprintGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("focus-sprint", "/productivity/focus-sprint", locale);
}

export default async function FocusSprintPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="focus-sprint"
            path="/productivity/focus-sprint"
            categoryName="Student & Work Suite"
            categoryHref="/productivity"
            locale={locale}
        >
            <FocusSprintGame />
        </NewToolPageShell>
    );
}
