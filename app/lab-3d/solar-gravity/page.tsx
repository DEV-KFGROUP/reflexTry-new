import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import SolarGravity3DGame from "./SolarGravity3DGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("solar-gravity-3d", "/lab-3d/solar-gravity", locale);
}

export default async function SolarGravity3DPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="solar-gravity-3d"
            path="/lab-3d/solar-gravity"
            categoryName="3D Interactive Lab"
            categoryHref="/lab-3d"
            locale={locale}
        >
            <SolarGravity3DGame />
        </NewToolPageShell>
    );
}
