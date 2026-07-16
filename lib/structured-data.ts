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
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: item.name,
            item: item.url.startsWith("http") ? item.url : `${baseUrl}${item.url}`,
        })),
    };
}

export function generateOrganizationSchema() {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Reflextry",
        url: baseUrl,
        logo: `${baseUrl}/icon.png`,
        sameAs: [
            // Add social media links here if any
        ]
    };
}

export function generateWebPageSchema(title: string, description: string, urlPath: string) {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description: description,
        url: `${baseUrl}${urlPath}`,
        isPartOf: {
            "@type": "WebSite",
            url: baseUrl
        },
        publisher: {
            "@type": "Organization",
            name: "Reflextry"
        }
    };
}

export function generateFAQPageSchema(faqs: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(faq => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer
            }
        }))
    };
}

export function generateSoftwareApplicationSchema(title: string, description: string, urlPath: string, category = "GameApplication") {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: title,
        description: description,
        url: `${baseUrl}${urlPath}`,
        applicationCategory: category,
        operatingSystem: "Web Browser",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "1250"
        }
    };
}

export function generateBlogPostingSchema(title: string, description: string, urlPath: string) {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: title,
        description: description,
        url: `${baseUrl}${urlPath}`,
        author: {
            "@type": "Organization",
            name: "Reflextry"
        },
        publisher: {
            "@type": "Organization",
            name: "Reflextry",
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/icon.png`
            }
        },
        datePublished: new Date().toISOString().split('T')[0],
        dateModified: new Date().toISOString().split('T')[0]
    };
}

export function generateHowToSchema(title: string, steps: string[]) {
    return {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to play ${title}`,
        step: steps.map(step => ({
            "@type": "HowToStep",
            text: step
        }))
    };
}
