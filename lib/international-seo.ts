/**
 * Centralized International SEO configuration
 * 
 * All target locales, hreflang generation, and OG locale helpers.
 * Used by SEO.tsx, layout.tsx, sitemap.ts, and structured-data.ts.
 * 
 * IMPORTANT: Reflextry is a single-language (English) site serving users globally.
 * All hreflang alternates point to the same canonical URL — this signals to Google
 * that the English page is the correct result for users in these locales.
 */

export const TARGET_LOCALES = [
    { lang: 'en', hreflang: 'en', region: 'US', ogLocale: 'en_US', label: 'English (US)', isPrimary: true },
    { lang: 'en', hreflang: 'en-GB', region: 'GB', ogLocale: 'en_GB', label: 'English (UK)', isPrimary: false },
    { lang: 'de', hreflang: 'de', region: 'DE', ogLocale: 'de_DE', label: 'Deutsch', isPrimary: false },
    { lang: 'fr', hreflang: 'fr', region: 'FR', ogLocale: 'fr_FR', label: 'Français', isPrimary: false },
    { lang: 'pt', hreflang: 'pt-BR', region: 'BR', ogLocale: 'pt_BR', label: 'Português (Brasil)', isPrimary: false },
    { lang: 'ja', hreflang: 'ja', region: 'JP', ogLocale: 'ja_JP', label: '日本語', isPrimary: false },
    { lang: 'ko', hreflang: 'ko', region: 'KR', ogLocale: 'ko_KR', label: '한국어', isPrimary: false },
    { lang: 'hi', hreflang: 'hi', region: 'IN', ogLocale: 'hi_IN', label: 'हिन्दी', isPrimary: false },
] as const;

export type TargetLocale = typeof TARGET_LOCALES[number];

/**
 * Generate hreflang alternate map for any canonical URL.
 * All alternates point to the same URL (single-language site).
 */
export function getHreflangAlternates(canonicalUrl: string): Record<string, string> {
    const alternates: Record<string, string> = {
        'x-default': canonicalUrl,
    };
    for (const locale of TARGET_LOCALES) {
        alternates[locale.hreflang] = canonicalUrl;
    }
    return alternates;
}

/**
 * Get all OG locale alternate values (excluding the primary locale).
 * Used in layout.tsx for og:locale:alternate meta tags.
 */
export function getOGLocaleAlternates(): string[] {
    return TARGET_LOCALES
        .filter(l => !l.isPrimary)
        .map(l => l.ogLocale);
}

/**
 * Primary OG locale (en_US)
 */
export const PRIMARY_OG_LOCALE = TARGET_LOCALES.find(l => l.isPrimary)!.ogLocale;

/**
 * Content-Language header value listing all supported languages.
 * Used in next.config.ts headers.
 */
export const CONTENT_LANGUAGE_HEADER = TARGET_LOCALES
    .map(l => l.hreflang)
    .filter((v, i, a) => a.indexOf(v) === i) // deduplicate
    .join(', ');

/**
 * Available language codes for Organization/WebSite structured data.
 */
export const AVAILABLE_LANGUAGES = ['en'];

/**
 * Geo target countries for structured data areaServed.
 * Re-exported from structured-data.ts for backwards compatibility.
 */
export const GEO_TARGET_COUNTRIES = [
    { "@type": "Country" as const, "name": "United States", "identifier": "US" },
    { "@type": "Country" as const, "name": "United Kingdom", "identifier": "GB" },
    { "@type": "Country" as const, "name": "Germany", "identifier": "DE" },
    { "@type": "Country" as const, "name": "India", "identifier": "IN" },
    { "@type": "Country" as const, "name": "Brazil", "identifier": "BR" },
    { "@type": "Country" as const, "name": "South Korea", "identifier": "KR" },
    { "@type": "Country" as const, "name": "Japan", "identifier": "JP" },
    { "@type": "Country" as const, "name": "France", "identifier": "FR" },
];
