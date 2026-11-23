import { Metadata } from "next";
import { headers } from "next/headers";
import StemHubClient from "./StemHubClient";
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
    return getCategoryMetadata("stem", locale);
}

export default async function StemHubPage() {
    const headersList = await headers();
    const locale = headersList.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "STEM & Physics Lab", url: "/stem" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "STEM & Physics Visual Lab - Interactive Science & Math Games",
        "Interactive 2D physics and math visualizers for students: gravity free-fall, laser reflection optics, projectile motion, and seesaw torque balance.",
        "/stem",
        locale
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Who is the STEM & Physics Visual Lab built for?",
            answer: "It is designed for middle school, high school, and college students, teachers demonstrating physics on classroom screens, and curious self-learners who want to visualize equations interactively.",
        },
        {
            question: "Do these physics simulations use real formulas?",
            answer: "Yes. Every lab computes live kinematics, gravitational acceleration, geometric ray reflection, or rotational torque directly from standard textbook equations.",
        },
        {
            question: "Are the STEM games free to use in classrooms?",
            answer: "Yes. All simulations run instantly in any modern browser with zero accounts, downloads, or paywalls.",
        },
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <StemHubClient />
            <CategorySEOContent category="stem" />
        </>
    );
}
