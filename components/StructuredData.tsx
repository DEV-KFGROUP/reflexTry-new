// Server Component - No "use client" needed
// This component just renders JSON-LD structured data

interface StructuredDataProps {
    type: "WebApplication" | "Game" | "Article" | "WebSite" | "BreadcrumbList";
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
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}

// Re-export generator functions from lib for convenience
export { 
    generateToolStructuredData, 
    generateWebsiteStructuredData, 
    generateBreadcrumbStructuredData 
} from "@/lib/structured-data";

