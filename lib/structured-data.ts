// Server-side structured data generators
// These can be called from server components

import { getBaseUrl } from '@/lib/base-url';
import type { Article } from '@/lib/content/types';

export function generateToolStructuredData(_toolId: string, title: string, description: string, url: string) {
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
    };
}

export function generateArticleStructuredData(meta: Article, slug: string) {
    const baseUrl = getBaseUrl();
    const pageUrl = `${baseUrl}/blog/${slug}`;
    const resolveUrl = (u: string) => (u.startsWith("http") ? u : `${baseUrl}${u}`);

    const images: string[] = meta.image
        ? [resolveUrl(meta.image)]
        : [`${baseUrl}/opengraph-image`];

    const authorName = meta.author?.name ?? "Reflextry";
    const author: Record<string, unknown> = {
        "@type": "Person",
        name: authorName,
    };
    if (meta.author?.image) {
        author.image = resolveUrl(meta.author.image);
    }

    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: meta.title,
        description: meta.description,
        datePublished: meta.publishedAt,
        dateModified: meta.updatedAt ?? meta.publishedAt,
        author,
        publisher: {
            "@type": "Organization",
            name: "Reflextry",
            url: baseUrl,
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
        },
        image: images,
        url: pageUrl,
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
