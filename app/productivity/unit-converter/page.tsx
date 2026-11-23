import type { Metadata } from "next";
import { headers } from "next/headers";
import { buildFlagshipMetadata } from "@/lib/flagship-tools-meta";
import { FlagshipPageFrame } from "@/components/FlagshipPageFrame";
import UnitConverterTool from "./UnitConverterTool";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return buildFlagshipMetadata("unit-converter", locale);
}

export default async function UnitConverterPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return (
        <FlagshipPageFrame id="unit-converter" backHref="/productivity" backLabel="Back to Student & Work Suite" locale={locale}>
            <UnitConverterTool />
        </FlagshipPageFrame>
    );
}
