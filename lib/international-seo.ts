/**
 * Centralized International SEO configuration
 * 
 * Published languages, hreflang generation, and OG locale helpers.
 * Used by SEO.tsx, layout.tsx, sitemap.ts, and structured-data.ts.
 */

import { getBaseUrl } from '@/lib/base-url';
import { extractLocaleFromPath, SUPPORTED_LOCALES, type Locale } from '@/lib/i18n/config';

export const TARGET_LOCALES = [
    { lang: 'en', hreflang: 'en', region: 'Global', ogLocale: 'en_US', label: 'English', isPrimary: true },
    { lang: 'es', hreflang: 'es', region: 'Spain & Latin America', ogLocale: 'es_ES', label: 'Spanish' },
    { lang: 'pt', hreflang: 'pt-BR', region: 'Brazil & Portugal', ogLocale: 'pt_BR', label: 'Portuguese' },
    { lang: 'de', hreflang: 'de', region: 'Germany', ogLocale: 'de_DE', label: 'German' },
    { lang: 'fr', hreflang: 'fr', region: 'France', ogLocale: 'fr_FR', label: 'French' },
    { lang: 'ja', hreflang: 'ja', region: 'Japan', ogLocale: 'ja_JP', label: 'Japanese' },
    { lang: 'ko', hreflang: 'ko', region: 'South Korea', ogLocale: 'ko_KR', label: 'Korean' },
    { lang: 'ru', hreflang: 'ru', region: 'Russia', ogLocale: 'ru_RU', label: 'Russian' },
    { lang: 'it', hreflang: 'it', region: 'Italy', ogLocale: 'it_IT', label: 'Italian' },
    { lang: 'pl', hreflang: 'pl', region: 'Poland', ogLocale: 'pl_PL', label: 'Polish' },
    { lang: 'tr', hreflang: 'tr', region: 'Turkey', ogLocale: 'tr_TR', label: 'Turkish' },
    { lang: 'id', hreflang: 'id', region: 'Indonesia', ogLocale: 'id_ID', label: 'Indonesian' },
    { lang: 'vi', hreflang: 'vi', region: 'Vietnam', ogLocale: 'vi_VN', label: 'Vietnamese' },
    { lang: 'zh-CN', hreflang: 'zh-Hans', region: 'China', ogLocale: 'zh_CN', label: 'Simplified Chinese' },
    { lang: 'zh-TW', hreflang: 'zh-Hant', region: 'Taiwan', ogLocale: 'zh_TW', label: 'Traditional Chinese' },
    { lang: 'nl', hreflang: 'nl', region: 'Netherlands', ogLocale: 'nl_NL', label: 'Dutch' },
] as const;

export type TargetLocale = typeof TARGET_LOCALES[number];

/**
 * Generate complete reciprocal hreflang alternate URLs for all supported locales + x-default
 */
export function getHreflangAlternates(canonicalUrl: string): Record<string, string> {
    const { cleanPath } = extractLocaleFromPath(new URL(canonicalUrl, getBaseUrl()).pathname);
    const normalizedPath = cleanPath === '/' ? '' : cleanPath;
    const baseUrl = getBaseUrl();

    const rootCanonical = normalizedPath ? `${baseUrl}${normalizedPath}` : baseUrl;

    const alternates: Record<string, string> = {
        en: rootCanonical,
        'x-default': rootCanonical,
    };

    for (const target of TARGET_LOCALES) {
        if (target.lang === 'en') continue;
        alternates[target.hreflang] = `${baseUrl}/${target.lang}${normalizedPath}`;
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
        if (!('isPrimary' in l && l.isPrimary)) {
            alternates.add(l.ogLocale);
        }
    }
    return Array.from(alternates);
}

/**
 * Primary OG locale (en_US)
 */
export const PRIMARY_OG_LOCALE = TARGET_LOCALES.find(l => 'isPrimary' in l && l.isPrimary)!.ogLocale;

/**
 * Content-Language header value listing all supported languages.
 */
export const CONTENT_LANGUAGE_HEADER = TARGET_LOCALES.map(l => l.lang).join(', ');

/**
 * Available language codes for Organization/WebSite structured data.
 */
export const AVAILABLE_LANGUAGES = TARGET_LOCALES.map(l => l.lang);

/**
 * Geo target countries for structured data areaServed.
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
    { "@type": "Country" as const, "name": "Spain", "identifier": "ES" },
    { "@type": "Country" as const, "name": "Italy", "identifier": "IT" },
    { "@type": "Country" as const, "name": "Netherlands", "identifier": "NL" },
    { "@type": "Country" as const, "name": "Poland", "identifier": "PL" },
    { "@type": "Country" as const, "name": "Turkey", "identifier": "TR" },
    { "@type": "Country" as const, "name": "Indonesia", "identifier": "ID" },
    { "@type": "Country" as const, "name": "Vietnam", "identifier": "VN" },
];
