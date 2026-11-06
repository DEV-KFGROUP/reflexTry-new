import { Metadata } from "next";
import { getBaseUrl, getBaseUrlObject } from "@/lib/base-url";
import { getHreflangAlternates, PRIMARY_OG_LOCALE, CONTENT_LANGUAGE_HEADER } from "@/lib/international-seo";

interface SEOProps {
    title: string;
    description: string;
    keywords: string[];
    url?: string;
    image?: string;
    type?: "website" | "article";
    robots?: { index?: boolean; follow?: boolean };
}

const TITLE_RANGE = { min: 50, max: 60 };

/**
 * Calculates distance from the optimal 50-60 character SEO title range.
 */
function titleDistance(length: number): number {
    return Math.max(TITLE_RANGE.min - length, length - TITLE_RANGE.max, 0);
}

/**
 * Selects the candidate title closest to the 50-60 character range,
 * guaranteeing brand suffix formatting and preventing double-suffixing.
 */
export function fitTitle(candidates: string[], siteName = "Reflextry"): string {
    if (!candidates || candidates.length === 0) return siteName;
    const brandSuffix = ` | ${siteName}`;
    const allCandidates = candidates.map((t) => {
        const clean = t.replace(new RegExp(`\\s*\\|?\\s*${siteName}$`), "").trim();
        return `${clean}${brandSuffix}`;
    });
    return allCandidates.reduce((best, current) =>
        titleDistance(current.length) < titleDistance(best.length) ? current : best,
        allCandidates[0]
    );
}

export function generateSEOMetadata({
    title,
    description,
    keywords,
    url = "",
    image = "/opengraph-image",
    type = "website",
    robots,
}: SEOProps): Metadata {
    const baseUrl = getBaseUrl();

    // Clean path
    let cleanPath = url || "";
    // Ensure path starts with / if not empty
    if (cleanPath && !cleanPath.startsWith('/')) {
        cleanPath = `/${cleanPath}`;
    }
    // Remove trailing slash for consistency
    if (cleanPath.endsWith('/') && cleanPath !== '/') {
        cleanPath = cleanPath.slice(0, -1);
    }

    // Build canonical URL - simple path without locale prefix
    // Format: https://www.reflextry.com{/path}
    const canonicalUrl = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;
    const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

    // Format full title cleanly — ensure Reflextry suffix is present once
    const fullTitle = title.includes("Reflextry") ? title : `${title} | Reflextry`;

    // Advertise only the published English page and its default fallback.
    const hreflangAlternates = getHreflangAlternates(canonicalUrl);

    return {
        metadataBase: getBaseUrlObject(),
        title: {
            absolute: fullTitle,
        },
        description,
        keywords: keywords.join(", "),
        authors: [{ name: "Reflextry" }],
        creator: "Reflextry",
        publisher: "Reflextry",
        robots: robots || {
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
            locale: PRIMARY_OG_LOCALE,
            url: canonicalUrl,
            title: fullTitle,
            description,
            siteName: "Reflextry",
            images: [
                {
                    url: fullImageUrl,
                    width: 1200,
                    height: 630,
                    alt: fullTitle,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [fullImageUrl],
            creator: "@reflextry",
        },
        alternates: {
            canonical: cleanPath || '/',
            languages: hreflangAlternates,
        },
        other: {
            'content-language': CONTENT_LANGUAGE_HEADER,
        },
    };
}
