import { Metadata } from "next";
import { getBaseUrl, getBaseUrlObject } from "@/lib/base-url";

interface SEOProps {
    title: string;
    description: string;
    keywords: string[];
    url?: string;
    image?: string;
    type?: "website" | "article";
    robots?: { index?: boolean; follow?: boolean };
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

    return {
        metadataBase: getBaseUrlObject(),
        title,
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
            locale: "en",
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
            canonical: cleanPath || '/',
        },
    };
}
