/**
 * Centralized base URL configuration
 * ALWAYS use www.reflextry.com to avoid redirects
 */

// Get the canonical base URL (always with www)
export function getBaseUrl(): string {
    let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reflextry.com';
    // Normalize: remove protocol and www if present, then always add https://www.
    siteUrl = siteUrl.replace(/^https?:\/\/(www\.)?/, '');
    return `https://www.${siteUrl}`;
}

// Get the base URL as URL object (for metadataBase)
export function getBaseUrlObject(): URL {
    return new URL(getBaseUrl());
}

// Supported locales
export const SUPPORTED_LOCALES = ['en', 'es', 'fr', 'de', 'pt'] as const;
export type SupportedLocale = typeof SUPPORTED_LOCALES[number];

// Default locale
export const DEFAULT_LOCALE: SupportedLocale = 'en';

// Build a full URL with locale
export function buildLocalizedUrl(locale: string, path: string = ''): string {
    const baseUrl = getBaseUrl();
    const normalizedLocale = SUPPORTED_LOCALES.includes(locale as SupportedLocale) ? locale : DEFAULT_LOCALE;
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${baseUrl}/${normalizedLocale}${cleanPath === '/' ? '' : cleanPath}`;
}

// Build hreflang map for a given path
export function buildHreflangMap(currentLocale: string, path: string = ''): Record<string, string> {
    const baseUrl = getBaseUrl();
    const normalizedLocale = SUPPORTED_LOCALES.includes(currentLocale as SupportedLocale) ? currentLocale : DEFAULT_LOCALE;
    const cleanPath = path.startsWith('/') ? path : (path ? `/${path}` : '');
    
    const hreflangLanguages: Record<string, string> = {};
    
    // All locale versions
    SUPPORTED_LOCALES.forEach((locale) => {
        hreflangLanguages[locale] = `${baseUrl}/${locale}${cleanPath}`;
    });
    
    // x-default (English)
    hreflangLanguages['x-default'] = `${baseUrl}/${DEFAULT_LOCALE}${cleanPath}`;
    
    return hreflangLanguages;
}



