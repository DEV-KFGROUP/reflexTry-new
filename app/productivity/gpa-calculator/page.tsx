import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import GpaCalculatorTool from "./GpaCalculatorTool";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("gpa-calculator", locale);
}

export default async function GpaCalculatorPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="gpa-calculator" backHref="/productivity" backLabel="Back to Student & Work Suite" locale={locale}>
            <GpaCalculatorTool />
        </FlagshipPageFrame>
    );
}
