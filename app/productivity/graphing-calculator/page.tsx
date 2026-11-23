import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import GraphingCalculatorTool from "./GraphingCalculatorTool";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("graphing-calculator", locale);
}

export default async function GraphingCalculatorPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="graphing-calculator" backHref="/productivity" backLabel="Back to Student & Work Suite" locale={locale}>
            <GraphingCalculatorTool />
        </FlagshipPageFrame>
    );
}
