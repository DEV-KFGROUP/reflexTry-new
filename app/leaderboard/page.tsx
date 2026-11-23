import { Metadata } from "next";
import { headers } from "next/headers";
import LeaderboardClient from "./LeaderboardClient";
import { getLeaderboardMetadata } from "@/lib/legal-seo";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get("x-locale") || "en";
    return getLeaderboardMetadata(locale);
}

export default async function LeaderboardPage() {
    const h = await headers();
    const locale = h.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Leaderboard", url: "/leaderboard" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "Leaderboard — Personal Bests & Benchmarks",
        "View your personal best scores across all Reflextry tools. Track your progress in memory games, reaction tests, typing speed, and more.",
        "/leaderboard",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <LeaderboardClient />
        </>
    );
}
