/**
 * Centralized International SEO configuration
 * 
 * Published language, hreflang generation, and OG locale helpers.
 * Used by SEO.tsx, layout.tsx, sitemap.ts, and structured-data.ts.
 * 
 * IMPORTANT: Reflextry is a single-language (English) site serving users globally.
 * Only English is published; do not advertise unfinished translations.
 */

import { getBaseUrl } from '@/lib/base-url';
import { extractLocaleFromPath } from '@/lib/i18n/config';

export const TARGET_LOCALES = [
    { lang: 'en', hreflang: 'en', region: 'Global', ogLocale: 'en_US', label: 'English', isPrimary: true },
] as const;

export type TargetLocale = typeof TARGET_LOCALES[number];

/**
 * Advertise the published English page and the default-language fallback.
 */
export function getHreflangAlternates(canonicalUrl: string): Record<string, string> {
    const { cleanPath } = extractLocaleFromPath(new URL(canonicalUrl, getBaseUrl()).pathname);
    const canonical = `${getBaseUrl()}${cleanPath === '/' ? '' : cleanPath}`;
    return { en: canonical, 'x-default': canonical };
}

/**
 * Get all OG locale alternate values (excluding the primary locale).
 * Used in layout.tsx for og:locale:alternate meta tags.
 */
export function getOGLocaleAlternates(): string[] {
    const alternates = new Set<string>();
    for (const l of TARGET_LOCALES) {
        if (!l.isPrimary) {
            alternates.add(l.ogLocale);
        }
    }
    return Array.from(alternates);
}

/**
 * Primary OG locale (en_US)
 */
export const PRIMARY_OG_LOCALE = TARGET_LOCALES.find(l => l.isPrimary)!.ogLocale;

/**
 * Content-Language header value listing all supported languages.
 * Used in next.config.ts headers.
 */
export const CONTENT_LANGUAGE_HEADER = 'en';

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
    { "@type": "Country" as const, "name": "Canada", "identifier": "CA" },
    { "@type": "Country" as const, "name": "Australia", "identifier": "AU" },
    { "@type": "Country" as const, "name": "Germany", "identifier": "DE" },
    { "@type": "Country" as const, "name": "India", "identifier": "IN" },
    { "@type": "Country" as const, "name": "Brazil", "identifier": "BR" },
    { "@type": "Country" as const, "name": "South Korea", "identifier": "KR" },
    { "@type": "Country" as const, "name": "Japan", "identifier": "JP" },
    { "@type": "Country" as const, "name": "France", "identifier": "FR" },
];
