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
    { lang: 'en', hreflang: 'en', region: 'Global', ogLocale: 'en_US', label: 'English (Global)', isPrimary: true },
    { lang: 'en', hreflang: 'en-US', region: 'US', ogLocale: 'en_US', label: 'English (United States)', isPrimary: false },
    { lang: 'en', hreflang: 'en-GB', region: 'GB', ogLocale: 'en_GB', label: 'English (United Kingdom)', isPrimary: false },
    { lang: 'en', hreflang: 'en-CA', region: 'CA', ogLocale: 'en_CA', label: 'English (Canada)', isPrimary: false },
    { lang: 'en', hreflang: 'en-AU', region: 'AU', ogLocale: 'en_AU', label: 'English (Australia)', isPrimary: false },
    { lang: 'en', hreflang: 'en-IN', region: 'IN', ogLocale: 'en_IN', label: 'English (India)', isPrimary: false },
    { lang: 'en', hreflang: 'en-IE', region: 'IE', ogLocale: 'en_IE', label: 'English (Ireland)', isPrimary: false },
    { lang: 'en', hreflang: 'en-NZ', region: 'NZ', ogLocale: 'en_NZ', label: 'English (New Zealand)', isPrimary: false },
    { lang: 'en', hreflang: 'en-SG', region: 'SG', ogLocale: 'en_SG', label: 'English (Singapore)', isPrimary: false },
    { lang: 'en', hreflang: 'en-ZA', region: 'ZA', ogLocale: 'en_ZA', label: 'English (South Africa)', isPrimary: false },
    { lang: 'en', hreflang: 'en-PH', region: 'PH', ogLocale: 'en_PH', label: 'English (Philippines)', isPrimary: false },
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
export const AVAILABLE_LANGUAGES = ['en', 'en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN'];

/**
 * Geo target countries for structured data areaServed.
 * Re-exported from structured-data.ts for backwards compatibility.
 */
export const GEO_TARGET_COUNTRIES = [
    { "@type": "Country" as const, "name": "United States", "identifier": "US" },
    { "@type": "Country" as const, "name": "United Kingdom", "identifier": "GB" },
    { "@type": "Country" as const, "name": "Canada", "identifier": "CA" },
    { "@type": "Country" as const, "name": "Australia", "identifier": "AU" },
    { "@type": "Country" as const, "name": "Germany", "identifier": "DE" },
    { "@type": "Country" as const, "name": "India", "identifier": "IN" },
    { "@type": "Country" as const, "name": "Brazil", "identifier": "BR" },
    { "@type": "Country" as const, "name": "South Korea", "identifier": "KR" },
    { "@type": "Country" as const, "name": "Japan", "identifier": "JP" },
    { "@type": "Country" as const, "name": "France", "identifier": "FR" },
];
