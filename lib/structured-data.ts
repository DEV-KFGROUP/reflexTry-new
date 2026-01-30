// Server-side structured data generators
// These can be called from server components

import { getBaseUrl } from '@/lib/base-url';

export function generateToolStructuredData(toolId: string, title: string, description: string, url: string) {
    const baseUrl = getBaseUrl();
    
    return {
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: title,
        description: description,
        url: `${baseUrl}${url}`,
        applicationCategory: "Game",
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            ratingCount: "1000",
        },
    };
}

export function generateWebsiteStructuredData() {
    const baseUrl = getBaseUrl();
    
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Reflextry",
        description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games, reaction time tests, typing speed tests, and more.",
        url: baseUrl,
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url,
        })),
    };
}
