// Server Component - No "use client" needed
// This component just renders JSON-LD structured data

import { safeJsonLdStringify } from "@/lib/structured-data";

interface StructuredDataProps {
    type: "WebApplication" | "Game" | "Article" | "WebSite" | "BreadcrumbList" | "Organization" | "WebPage" | "FAQPage" | "SoftwareApplication";
    data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": type,
        ...data,
    };

    return (
        <script
            id={`structured-data-${type.toLowerCase()}`}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(structuredData) }}
            suppressHydrationWarning
        />
    );
}

// Re-export generator functions from lib for convenience
export { 
    safeJsonLdStringify,
    generateToolStructuredData, 
    generateWebsiteStructuredData, 
    generateBreadcrumbStructuredData,
    generateOrganizationSchema,
    generateWebPageSchema,
    generateFAQPageSchema,
    generateSoftwareApplicationSchema,
    generateItemListSchema
} from "@/lib/structured-data";

