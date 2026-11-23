import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import SpatialAim3DGame from "./SpatialAim3DGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("spatial-aim-3d", "/lab-3d/spatial-aim", locale);
}

export default async function SpatialAim3DPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="spatial-aim-3d"
            path="/lab-3d/spatial-aim"
            categoryName="3D Interactive Lab"
            categoryHref="/lab-3d"
            locale={locale}
        >
            <SpatialAim3DGame />
        </NewToolPageShell>
    );
}
