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

import { getBaseUrl } from '@/lib/base-url';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, extractLocaleFromPath, getLocalizedPath, Locale } from '@/lib/i18n/config';

export const TARGET_LOCALES = [
    { lang: 'en', hreflang: 'en', region: 'Global', ogLocale: 'en_US', label: 'English (Global)', isPrimary: true },
    { lang: 'es', hreflang: 'es', region: 'ES', ogLocale: 'es_ES', label: 'Español', isPrimary: false },
    { lang: 'de', hreflang: 'de', region: 'DE', ogLocale: 'de_DE', label: 'Deutsch', isPrimary: false },
    { lang: 'fr', hreflang: 'fr', region: 'FR', ogLocale: 'fr_FR', label: 'Français', isPrimary: false },
    { lang: 'pt', hreflang: 'pt', region: 'BR', ogLocale: 'pt_BR', label: 'Português', isPrimary: false },
    { lang: 'ja', hreflang: 'ja', region: 'JP', ogLocale: 'ja_JP', label: '日本語', isPrimary: false },
    // Regional English variations
    { lang: 'en', hreflang: 'en-US', region: 'US', ogLocale: 'en_US', label: 'English (United States)', isPrimary: false },
    { lang: 'en', hreflang: 'en-GB', region: 'GB', ogLocale: 'en_GB', label: 'English (United Kingdom)', isPrimary: false },
    { lang: 'en', hreflang: 'en-CA', region: 'CA', ogLocale: 'en_CA', label: 'English (Canada)', isPrimary: false },
    { lang: 'en', hreflang: 'en-AU', region: 'AU', ogLocale: 'en_AU', label: 'English (Australia)', isPrimary: false },
    { lang: 'en', hreflang: 'en-IN', region: 'IN', ogLocale: 'en_IN', label: 'English (India)', isPrimary: false },
] as const;

export type TargetLocale = typeof TARGET_LOCALES[number];

/**
 * Generate bidirectional hreflang alternate map for any canonical URL.
 * Maps localized URLs to their respective language paths.
 */
export function getHreflangAlternates(canonicalUrl: string): Record<string, string> {
    const baseUrl = getBaseUrl();
    // Extract the clean path from full URL or relative path
    const urlObj = canonicalUrl.startsWith('http') ? new URL(canonicalUrl) : null;
    const rawPath = urlObj ? urlObj.pathname : canonicalUrl;
    const { cleanPath } = extractLocaleFromPath(rawPath);

    const baseCanonical = `${baseUrl}${cleanPath === '/' ? '' : cleanPath}`;

    const alternates: Record<string, string> = {
        'x-default': baseCanonical,
    };

    for (const locale of TARGET_LOCALES) {
        if (locale.lang === DEFAULT_LOCALE) {
            alternates[locale.hreflang] = baseCanonical;
        } else {
            const locPath = getLocalizedPath(cleanPath, locale.lang as Locale);
            alternates[locale.hreflang] = `${baseUrl}${locPath === '/' ? '' : locPath}`;
        }
    }

    return alternates;
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
export const CONTENT_LANGUAGE_HEADER = 'en, es, de, fr, pt, ja';

/**
 * Available language codes for Organization/WebSite structured data.
 */
export const AVAILABLE_LANGUAGES = ['en', 'es', 'de', 'fr', 'pt', 'ja', 'en-US', 'en-GB', 'en-CA', 'en-AU', 'en-IN'];

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
