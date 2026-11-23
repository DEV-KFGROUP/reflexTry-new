import { Metadata } from "next";
import { headers } from "next/headers";
import MultiplayerHubClient from "./MultiplayerHubClient";
import { CategorySEOContent } from "@/components/CategorySEOContent";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateWebPageSchema,
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
} from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get("x-locale") || "en";
    return getCategoryMetadata("multiplayer", locale);
}

export default async function MultiplayerHubPage() {
    const headersList = await headers();
    const locale = headersList.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "2-Player Battle Arena", url: "/multiplayer" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "2-Player Battle Arena - Split-Screen Reflex, Math & Cannon Duels",
        "Challenge a friend or classmate on one keyboard or touchscreen with 2-player millisecond reflex duels, math tug-of-war, and gravity cannon battles.",
        "/multiplayer",
        locale
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Do 2-Player games require two devices or accounts?",
            answer: "No. Both players share the same keyboard or touchscreen in instant split-screen mode with zero login required.",
        },
        {
            question: "Can teachers use Math Tug-of-War in classrooms?",
            answer: "Yes! It features Kids, Student, and Pro difficulty tiers and works smoothly on laptops, tablets, and interactive classroom boards.",
        },
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <MultiplayerHubClient />
            <CategorySEOContent category="multiplayer" />
        </>
    );
}
