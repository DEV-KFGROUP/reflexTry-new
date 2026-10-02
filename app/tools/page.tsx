import { Metadata } from "next";
import AllToolsClient from "./AllToolsClient";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('tools');
}

export default function AllToolsPage() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "All Tools", url: "/tools" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "All Brain Training Tools & Games",
        "Explore our complete collection of reaction, memory, speed, and accuracy tools.",
        "/tools"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <AllToolsClient />
        </>
    );
}







