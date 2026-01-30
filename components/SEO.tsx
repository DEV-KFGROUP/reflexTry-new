import { Metadata } from "next";
import { getBaseUrl, buildHreflangMap, SUPPORTED_LOCALES, DEFAULT_LOCALE, type SupportedLocale } from "@/lib/base-url";

interface SEOProps {
    title: string;
    description: string;
    keywords: string[];
    url?: string;
    image?: string;
    type?: "website" | "article";
    locale?: string;
}

export function generateSEOMetadata({
    title,
    description,
    keywords,
    url = "",
    image = "/og-image.png",
    type = "website",
    locale = "en"
}: SEOProps): Metadata {
    const baseUrl = getBaseUrl();
    const normalizedLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale) ? locale : DEFAULT_LOCALE;
    
    // Clean path - remove locale prefix if present
    let cleanPath = url || "";
    const localePattern = /^\/(en|es|fr|de|pt)(\/|$)/;
    if (cleanPath && localePattern.test(cleanPath)) {
        cleanPath = cleanPath.replace(localePattern, '/');
    }
    // Ensure path starts with / if not empty
    if (cleanPath && !cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
    }
    // Remove trailing slash for consistency
    if (cleanPath.endsWith('/') && cleanPath !== '/') {
        cleanPath = cleanPath.slice(0, -1);
    }
    
    // Build canonical URL - this is the URL for the CURRENT page
    // Format: https://www.reflextry.com/{locale}{/path}
    const canonicalUrl = `${baseUrl}/${normalizedLocale}${cleanPath === '/' ? '' : cleanPath}`;
    const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;
    
    // Build hreflang URLs - all point to www version
    const hreflangLanguages = buildHreflangMap(normalizedLocale, cleanPath === '/' ? '' : cleanPath);

    return {
        title,
        description,
        keywords: keywords.join(", "),
        authors: [{ name: "Reflextry" }],
        creator: "Reflextry",
        publisher: "Reflextry",
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
        openGraph: {
            type,
            locale: normalizedLocale,
            url: canonicalUrl,
            title,
            description,
            siteName: "Reflextry",
            images: [
                {
                    url: fullImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [fullImageUrl],
            creator: "@reflextry",
        },
        alternates: {
            canonical: canonicalUrl,
            languages: hreflangLanguages,
        },
    };
}
