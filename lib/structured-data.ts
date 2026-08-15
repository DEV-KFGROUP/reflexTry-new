// Server-side structured data generators
// These can be called from server components

import { getBaseUrl } from '@/lib/base-url';
import { AVAILABLE_LANGUAGES, GEO_TARGET_COUNTRIES } from '@/lib/international-seo';
import type { Article } from '@/lib/content/types';

/** Standardized SpeakableSpecification CSS selectors used across all schemas */
const SPEAKABLE_SELECTORS = ["h1", ".hero-subtitle", ".aeo-answer", "article p:first-of-type"];

export const TARGET_GEO_LOCATIONS = [
    { "@type": "Country", "name": "United States", "identifier": "US" },
    { "@type": "Country", "name": "United Kingdom", "identifier": "GB" },
    { "@type": "Country", "name": "Germany", "identifier": "DE" },
    { "@type": "Country", "name": "India", "identifier": "IN" },
    { "@type": "Country", "name": "Brazil", "identifier": "BR" },
    { "@type": "Country", "name": "South Korea", "identifier": "KR" },
    { "@type": "Country", "name": "Japan", "identifier": "JP" },
    { "@type": "Country", "name": "France", "identifier": "FR" }
];

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
        inLanguage: "en",
        areaServed: TARGET_GEO_LOCATIONS,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "3420",
            bestRating: "5",
            worstRating: "1"
        }
    };
}

export function generateWebsiteStructuredData() {
    const baseUrl = getBaseUrl();

    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "Reflextry",
        alternateName: ["Reflextry Brain Benchmark", "Reflextry Games"],
        description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games, reaction time tests, typing speed tests, and more.",
        url: baseUrl,
        inLanguage: "en",
        availableLanguage: AVAILABLE_LANGUAGES,
        publisher: {
            "@type": "Organization",
            name: "Reflextry",
            url: baseUrl
        },
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${baseUrl}/tools?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };
}

export function generateArticleStructuredData(meta: Article, slug: string) {
    const baseUrl = getBaseUrl();
    const pageUrl = `${baseUrl}/blog/${slug}`;
    const resolveUrl = (u: string) => (u.startsWith("http") ? u : `${baseUrl}${u}`);

    const images: string[] = meta.image
        ? [resolveUrl(meta.image)]
        : [`${baseUrl}/opengraph-image`];

    const authorName = meta.author?.name ?? "Reflextry Cognitive Lab Team";
    const author: Record<string, unknown> = {
        "@type": "Person",
        name: authorName,
        jobTitle: "Cognitive Assessment Specialist"
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
        inLanguage: "en",
        author,
        publisher: {
            "@type": "Organization",
            name: "Reflextry",
            url: baseUrl,
            logo: {
                "@type": "ImageObject",
                url: `${baseUrl}/icon.png`
            }
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": pageUrl,
        },
        image: images,
        url: pageUrl,
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: SPEAKABLE_SELECTORS
        }
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
        foundingDate: "2024",
        description: "Free online cognitive training platform providing visual reaction time, working memory, typing WPM, and aim precision benchmarks.",
        availableLanguage: AVAILABLE_LANGUAGES,
        areaServed: GEO_TARGET_COUNTRIES,
        knowsAbout: [
            "Cognitive Assessment",
            "Visual Reaction Time",
            "Working Memory Capacity",
            "Esports Warmup Mechanics",
            "Motor Speed & Typing Benchmarks"
        ],
        contactPoint: {
            "@type": "ContactPoint",
            email: "support@reflextry.com",
            contactType: "customer support",
            availableLanguage: AVAILABLE_LANGUAGES
        },
        sameAs: [
            "https://twitter.com/reflextry",
            "https://github.com/reflextry",
            "https://www.youtube.com/@reflextry"
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
        inLanguage: "en",
        isPartOf: {
            "@type": "WebSite",
            url: baseUrl
        },
        publisher: {
            "@type": "Organization",
            name: "Reflextry"
        },
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: SPEAKABLE_SELECTORS
        }
    };
}

export function generateFAQPageSchema(faqs: { question: string; answer: string }[]) {
    if (!faqs || faqs.length === 0) return null;
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

export function generateSpeakableSchema(cssSelectors: string[] = SPEAKABLE_SELECTORS) {
    return {
        "@context": "https://schema.org",
        "@type": "SpeakableSpecification",
        cssSelector: cssSelectors
    };
}

export function generateDefinedTermSchema(name: string, description: string, termCode: string, urlPath: string) {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "DefinedTerm",
        name: name,
        description: description,
        termCode: termCode,
        url: `${baseUrl}${urlPath}`,
        inDefinedTermSet: {
            "@type": "DefinedTermSet",
            name: "Reflextry Cognitive Glossary",
            url: `${baseUrl}/science#glossary`
        }
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
        inLanguage: "en",
        areaServed: TARGET_GEO_LOCATIONS,
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
        },
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            ratingCount: "2150",
            bestRating: "5",
            worstRating: "1"
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
        inLanguage: "en",
        author: {
            "@type": "Organization",
            name: "Reflextry Cognitive Lab Team"
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
        dateModified: new Date().toISOString().split('T')[0],
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: SPEAKABLE_SELECTORS
        }
    };
}

export function generateHowToSchema(title: string, steps: string[]) {
    if (!steps || steps.length === 0) return null;
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

// ── Phase 4: Dataset & ItemList schemas for GEO/AEO ──

export function generateDatasetSchema() {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: "Reflextry Global Cognitive Benchmarks",
        description: "Aggregated reaction time, typing speed, and click speed benchmarks across 140+ countries based on 1,450,000+ completed tests.",
        url: `${baseUrl}/statistics`,
        creator: {
            "@type": "Organization",
            name: "Reflextry",
            url: baseUrl
        },
        temporalCoverage: "2024/..",
        spatialCoverage: GEO_TARGET_COUNTRIES,
        variableMeasured: [
            { "@type": "PropertyValue", name: "Visual Reaction Time", unitCode: "ms", description: "Time in milliseconds from visual stimulus to motor response" },
            { "@type": "PropertyValue", name: "Typing Speed", unitCode: "WPM", description: "Words per minute adjusted for errors" },
            { "@type": "PropertyValue", name: "Click Speed", unitCode: "CPS", description: "Mouse clicks per second" }
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
        isAccessibleForFree: true
    };
}

export function generateItemListSchema(items: { name: string; url: string; description: string; position: number }[]) {
    const baseUrl = getBaseUrl();
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        numberOfItems: items.length,
        itemListElement: items.map(item => ({
            "@type": "ListItem",
            position: item.position,
            name: item.name,
            url: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
            description: item.description
        }))
    };
}
