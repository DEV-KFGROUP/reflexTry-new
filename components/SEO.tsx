import { Metadata } from "next";
import { getBaseUrl, getBaseUrlObject } from "@/lib/base-url";
import { getHreflangAlternates, TARGET_LOCALES } from "@/lib/international-seo";
import {
    DEFAULT_LOCALE,
    LOCALES_METADATA,
    getLocalizedPath,
    isSupportedLocale,
    type Locale,
} from "@/lib/i18n/config";

interface SEOProps {
    title: string;
    description: string;
    keywords: string[];
    url?: string;
    image?: string;
    type?: "website" | "article";
    robots?: { index?: boolean; follow?: boolean };
    locale?: string;
    publishedTime?: string;
    modifiedTime?: string;
    authorName?: string;
}

const TITLE_RANGE = { min: 48, max: 60 };

/**
 * Calculates distance from the optimal 48-60 character SEO title range.
 */
function titleDistance(length: number): number {
    return Math.max(TITLE_RANGE.min - length, length - TITLE_RANGE.max, 0);
}

/**
 * Selects the candidate title closest to the 48-60 character range,
 * guaranteeing brand suffix formatting and preventing double-suffixing.
 */
export function fitTitle(candidates: string[], siteName = "Reflextry"): string {
    if (!candidates || candidates.length === 0) return siteName;
    const brandSuffix = ` | ${siteName}`;
    const allCandidates = candidates.map((t) => {
        const clean = t.replace(new RegExp(`\\s*[|\\-–—]?\\s*${siteName}$`, "i"), "").trim();
        return `${clean}${brandSuffix}`;
    });
    return allCandidates.reduce(
        (best, current) =>
            titleDistance(current.length) < titleDistance(best.length) ? current : best,
        allCandidates[0]
    );
}

/**
 * Ensures meta descriptions stay within the Google SERP snippet window (<= 160 chars)
 * without cutting mid-word.
 */
export function fitMetaDescription(text: string, maxLen = 158): string {
    const clean = text.replace(/\s+/g, " ").trim();
    if (clean.length <= maxLen) return clean;
    const sliced = clean.slice(0, maxLen - 1);
    const lastPeriod = sliced.lastIndexOf(". ");
    if (lastPeriod >= Math.floor(maxLen * 0.65)) {
        return sliced.slice(0, lastPeriod + 1).trim();
    }
    const lastSpace = sliced.lastIndexOf(" ");
    const base = (lastSpace > 80 ? sliced.slice(0, lastSpace) : sliced).replace(/[,;:\-–—\s]+$/, "");
    return `${base}…`;
}

/**
 * Formats an SEO title with a single brand suffix and enforces max length cleanly.
 */
export function formatSeoTitle(rawTitle: string, maxLen = 60, siteName = "Reflextry"): string {
    const brandSuffix = ` | ${siteName}`;
    const hasBrand = new RegExp(`\\b${siteName}\\b`, "i").test(rawTitle);
    const clean = rawTitle.replace(new RegExp(`\\s*\\|\\s*${siteName}$`, "i"), "").trim();
    const candidate = hasBrand && !rawTitle.endsWith(brandSuffix) ? rawTitle.trim() : `${clean}${brandSuffix}`;
    if (candidate.length <= maxLen) return candidate;

    // Preserve brand suffix when trimming overly long titles
    const allowedBase = Math.max(20, maxLen - brandSuffix.length);
    const trimmed = clean.slice(0, allowedBase);
    const sepCut = Math.max(trimmed.lastIndexOf(" — "), trimmed.lastIndexOf(" - "), trimmed.lastIndexOf(": "));
    if (sepCut >= Math.floor(allowedBase * 0.45)) {
        return `${trimmed.slice(0, sepCut).trim()}${brandSuffix}`;
    }
    const spaceCut = trimmed.lastIndexOf(" ");
    let base = (spaceCut > 16 ? trimmed.slice(0, spaceCut) : trimmed).replace(/[,;:\-–—\s]+$/, "");
    // Avoid awkward dangling prepositions or conjunctions at the end of a truncated title
    base = base.replace(/\s+(en|de|of|in|for|with|and|&|y|e|pour|mit|di|a|to|the|la|el|le|der|die|das|para|con|on|at)$/i, "").replace(/[,;:\-–—\s]+$/, "");
    return `${base}${brandSuffix}`;
}

export function generateSEOMetadata({
    title,
    description,
    keywords,
    url = "",
    image = "/opengraph-image",
    type = "website",
    robots,
    locale,
    publishedTime,
    modifiedTime,
    authorName,
}: SEOProps): Metadata {
    const baseUrl = getBaseUrl();
    const activeLocale: Locale =
        locale && isSupportedLocale(locale) ? locale : DEFAULT_LOCALE;
    const localeMeta = LOCALES_METADATA[activeLocale];

    // Clean English base path
    let cleanPath = url || "";
    if (cleanPath && !cleanPath.startsWith("/")) {
        cleanPath = `/${cleanPath}`;
    }
    if (cleanPath.endsWith("/") && cleanPath !== "/") {
        cleanPath = cleanPath.slice(0, -1);
    }
    const basePath = cleanPath || "/";

    // Self-referencing canonical path for the active locale
    // English: "/" or "/reflex/reaction"
    // Non-English: "/es" or "/es/reflex/reaction"
    const localizedPath = getLocalizedPath(basePath, activeLocale);
    const canonicalUrl = `${baseUrl}${localizedPath === "/" ? "" : localizedPath}`;
    const englishCanonicalUrl = `${baseUrl}${basePath === "/" ? "" : basePath}`;
    const fullImageUrl = image.startsWith("http") ? image : `${baseUrl}${image}`;

    // Single brand suffix, SERP-safe length
    const maxTitleLen = activeLocale === "en" ? 60 : 65;
    const fullTitle = formatSeoTitle(title, maxTitleLen);
    const safeDescription = fitMetaDescription(description, 158);

    // Complete reciprocal hreflang alternates across all 16 published locales + x-default
    const hreflangAlternates = getHreflangAlternates(englishCanonicalUrl);

    const alternateOgLocales = TARGET_LOCALES
        .filter((l) => l.ogLocale !== localeMeta.ogLocale)
        .map((l) => l.ogLocale);

    const openGraphBase = {
        type,
        locale: localeMeta.ogLocale,
        alternateLocale: alternateOgLocales,
        url: canonicalUrl,
        title: fullTitle,
        description: safeDescription,
        siteName: "Reflextry",
        images: [
            {
                url: fullImageUrl,
                width: 1200,
                height: 630,
                alt: fullTitle,
            },
        ],
        ...(type === "article" && publishedTime ? { publishedTime } : {}),
        ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    };

    const isNoIndex = robots?.index === false;

    return {
        metadataBase: getBaseUrlObject(),
        title: {
            absolute: fullTitle,
        },
        description: safeDescription,
        keywords: keywords.join(", "),
        authors: [{ name: authorName || "Reflextry" }],
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
        openGraph: openGraphBase,
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description: safeDescription,
            images: [fullImageUrl],
            creator: "@reflextry",
        },
        alternates: {
            canonical: localizedPath,
            ...(isNoIndex ? {} : { languages: hreflangAlternates }),
        },
        other: {
            "content-language": activeLocale,
        },
    };
}
