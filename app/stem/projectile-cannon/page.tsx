import { Metadata } from "next";
import { headers } from "next/headers";
import { getToolMetadata } from "@/lib/seo-utils";
import { NewToolPageShell } from "@/components/NewToolPageShell";
import ProjectileCannonGame from "./ProjectileCannonGame";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getToolMetadata("projectile-cannon", "/stem/projectile-cannon", locale);
}

export default async function ProjectileCannonPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    return (
        <NewToolPageShell
            toolId="projectile-cannon"
            path="/stem/projectile-cannon"
            categoryName="STEM & Physics Lab"
            categoryHref="/stem"
            locale={locale}
        >
            <ProjectileCannonGame />
        </NewToolPageShell>
    );
}
