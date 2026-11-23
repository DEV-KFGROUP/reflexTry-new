import { Metadata } from "next";
import { headers } from "next/headers";
import ProductivityHubClient from "./ProductivityHubClient";
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
    return getCategoryMetadata("productivity", locale);
}

export default async function ProductivityHubPage() {
    const headersList = await headers();
    const locale = headersList.get("x-locale") || "en";

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Student & Work Suite", url: "/productivity" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "Student & Work Performance Suite - Speed Reading, 10-Key & Focus",
        "Daily productivity benchmarks for students and professionals: speed reading with comprehension checks, 10-key numpad KPH tests, and focus fatigue tracking.",
        "/productivity",
        locale
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "How is Effective WPM calculated in Speed Reading?",
            answer: "Effective WPM multiplies your measured reading pace by your comprehension quiz accuracy percentage, ensuring speed is paired with genuine retention.",
        },
        {
            question: "What is a good 10-Key Numpad KPH score for accounting or data entry?",
            answer: "Many office roles look for 8,000 to 10,000 Keystrokes Per Hour (KPH) at 95%+ accuracy, while experienced data-entry specialists exceed 12,000 KPH.",
        },
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <ProductivityHubClient />
            <CategorySEOContent category="productivity" />
        </>
    );
}
