import { Metadata } from "next";
import { headers } from "next/headers";
import Lab3DHubClient from "./Lab3DHubClient";
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
    return getCategoryMetadata("lab-3d", locale);
}

export default async function Lab3DHubPage() {
    const headersList = await headers();
    const locale = headersList.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "3D Interactive Lab", url: "/lab-3d" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "3D Interactive Showcase - Solar Gravity & 3D Spatial Aim",
        "Real-time WebGL 3D orbital gravity simulation and 3D depth-plane spatial aim arena right in your browser.",
        "/lab-3d",
        locale
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Do I need a special plugin to run the 3D Interactive Lab?",
            answer: "No. Both 3D modules run natively in any modern desktop or mobile browser using standard WebGL with automatic performance scaling.",
        },
        {
            question: "What makes 3D orbital gravity different from 2D diagrams?",
            answer: "You can orbit the camera freely around a deformed 3D spacetime grid, adjust central star mass, and launch custom 3D satellites to observe Keplerian ellipses.",
        },
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <Lab3DHubClient />
            <CategorySEOContent category="lab-3d" />
        </>
    );
}
