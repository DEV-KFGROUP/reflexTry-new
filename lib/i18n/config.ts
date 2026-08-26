export const DEFAULT_LOCALE = 'en';

export const SUPPORTED_LOCALES = ['en', 'es', 'de', 'fr', 'pt', 'ja'] as const;

export type Locale = typeof SUPPORTED_LOCALES[number];

export interface LocaleMetadata {
    code: Locale;
    label: string;
    nativeName: string;
    flag: string;
    ogLocale: string;
    hreflang: string;
    direction: 'ltr' | 'rtl';
}

export const LOCALES_METADATA: Record<Locale, LocaleMetadata> = {
    en: {
        code: 'en',
        label: 'English',
        nativeName: 'English',
        flag: '🇺🇸',
        ogLocale: 'en_US',
        hreflang: 'en',
        direction: 'ltr',
    },
    es: {
        code: 'es',
        label: 'Spanish',
        nativeName: 'Español',
        flag: '🇪🇸',
        ogLocale: 'es_ES',
        hreflang: 'es',
        direction: 'ltr',
    },
    de: {
        code: 'de',
        label: 'German',
        nativeName: 'Deutsch',
        flag: '🇩🇪',
        ogLocale: 'de_DE',
        hreflang: 'de',
        direction: 'ltr',
    },
    fr: {
        code: 'fr',
        label: 'French',
        nativeName: 'Français',
        flag: '🇫🇷',
        ogLocale: 'fr_FR',
        hreflang: 'fr',
        direction: 'ltr',
    },
    pt: {
        code: 'pt',
        label: 'Portuguese',
        nativeName: 'Português',
        flag: '🇧🇷',
        ogLocale: 'pt_BR',
        hreflang: 'pt-BR',
        direction: 'ltr',
    },
    ja: {
        code: 'ja',
        label: 'Japanese',
        nativeName: '日本語',
        flag: '🇯🇵',
        ogLocale: 'ja_JP',
        hreflang: 'ja',
        direction: 'ltr',
    },
};

/**
 * Check if a given string is a supported locale
 */
export function isSupportedLocale(locale: string): locale is Locale {
    return (SUPPORTED_LOCALES as readonly string[]).includes(locale);
}

/**
 * Extract locale from a pathname
 * Example: "/es/reflex/reaction" -> { locale: "es", cleanPath: "/reflex/reaction" }
 * Example: "/reflex/reaction" -> { locale: "en", cleanPath: "/reflex/reaction" }
 */
export function extractLocaleFromPath(pathname: string): { locale: Locale; cleanPath: string } {
    if (!pathname || pathname === '/') {
        return { locale: DEFAULT_LOCALE, cleanPath: '/' };
    }

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    if (firstSegment && isSupportedLocale(firstSegment)) {
        const remainingPath = '/' + segments.slice(1).join('/');
        return {
            locale: firstSegment,
            cleanPath: remainingPath === '/' ? '/' : remainingPath,
        };
    }

    return {
        locale: DEFAULT_LOCALE,
        cleanPath: pathname.startsWith('/') ? pathname : `/${pathname}`,
    };
}

/**
 * Generate a localized URL path
 * Example: getLocalizedPath("/reflex/reaction", "es") -> "/es/reflex/reaction"
 * Example: getLocalizedPath("/reflex/reaction", "en") -> "/reflex/reaction"
 */
export function getLocalizedPath(cleanPath: string, targetLocale: Locale): string {
    const normalized = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    
    // Default locale (en) uses root path without prefix
    if (targetLocale === DEFAULT_LOCALE) {
        return normalized;
    }

    return normalized === '/' ? `/${targetLocale}` : `/${targetLocale}${normalized}`;
}
