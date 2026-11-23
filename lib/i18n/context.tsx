"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    extractLocaleFromPath,
    getLocalizedPath,
    isSupportedLocale,
    DEFAULT_LOCALE,
    type Locale,
} from "./config";
import {
    getEnglishDictionary,
    loadLocaleDictionary,
    type TranslationDictionary,
} from "./load-dictionary";

const EN_DICT: TranslationDictionary = getEnglishDictionary();

interface I18nContextType {
    locale: Locale;
    setLocale: (newLocale: Locale) => void;
    t: (key: string, fallback?: string) => string;
    getLocalizedHref: (path: string, targetLocale?: Locale) => string;
    cleanPathname: string;
}

const I18nContext = createContext<I18nContextType>({
    locale: DEFAULT_LOCALE,
    setLocale: () => {},
    t: (key: string, fallback?: string) => fallback || key,
    getLocalizedHref: (path: string) => path,
    cleanPathname: "/",
});

export function I18nProvider({
    children,
    initialLocale,
    initialDict,
}: {
    children: ReactNode;
    initialLocale?: Locale;
    initialDict?: TranslationDictionary;
}) {
    const pathname = usePathname() || "/";
    const router = useRouter();

    // Determine locale from browser URL if available, else server initialLocale, else Next.js pathname
    const [locale, setLocaleState] = useState<Locale>(() => {
        if (typeof window !== "undefined") {
            const pathMeta = extractLocaleFromPath(window.location.pathname);
            if (pathMeta.locale && isSupportedLocale(pathMeta.locale)) return pathMeta.locale;
        }
        if (initialLocale && isSupportedLocale(initialLocale)) return initialLocale;
        const pathMeta = extractLocaleFromPath(pathname);
        if (pathMeta.locale && isSupportedLocale(pathMeta.locale)) return pathMeta.locale;
        return DEFAULT_LOCALE;
    });

    const [activeDict, setActiveDict] = useState<TranslationDictionary>(() => initialDict || EN_DICT);

    // Synchronize locale when browser URL changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const pathMeta = extractLocaleFromPath(window.location.pathname);
            const activeLocale = pathMeta.locale || DEFAULT_LOCALE;
            if (activeLocale !== locale) {
                setLocaleState(activeLocale);
            }
        }
    }, [pathname, locale]);

    // Lazily load only the requested non-English dictionary if needed
    useEffect(() => {
        if (locale === DEFAULT_LOCALE) {
            setActiveDict(EN_DICT);
            return;
        }
        if (initialLocale === locale && initialDict) {
            setActiveDict(initialDict);
            return;
        }
        let cancelled = false;
        loadLocaleDictionary(locale).then((dict) => {
            if (!cancelled) setActiveDict(dict);
        });
        return () => {
            cancelled = true;
        };
    }, [locale, initialLocale, initialDict]);

    const t = useMemo(() => {
        return (key: string, fallback?: string): string => {
            const parts = key.split(".");

            // 1. Try target locale dictionary
            let value: any = activeDict;
            for (const part of parts) {
                value = value && typeof value === "object" ? value[part] : undefined;
            }
            if (typeof value === "string") return value;

            // 2. Fallback to English dictionary
            let enValue: any = EN_DICT;
            for (const part of parts) {
                enValue = enValue && typeof enValue === "object" ? enValue[part] : undefined;
            }
            if (typeof enValue === "string") return enValue;

            return fallback || key;
        };
    }, [activeDict]);

    const setLocale = (newLocale: Locale) => {
        if (!isSupportedLocale(newLocale)) return;
        setLocaleState(newLocale);

        // Save preference in cookie and localStorage
        try {
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
            localStorage.setItem("reflextry_locale", newLocale);
        } catch {
            // ignore storage errors
        }

        // Navigate to the target localized URL preserving current subpath
        const currentPath = typeof window !== "undefined" ? window.location.pathname : pathname;
        const { cleanPath } = extractLocaleFromPath(currentPath);
        const targetUrl = getLocalizedPath(cleanPath, newLocale);
        
        if (typeof window !== "undefined") {
            window.location.href = targetUrl;
        } else {
            router.push(targetUrl);
        }
    };

    const getLocalizedHref = (path: string, targetLocale?: Locale): string => {
        const target = targetLocale || locale;
        const clean = extractLocaleFromPath(path).cleanPath;
        return getLocalizedPath(clean, target);
    };

    const currentActivePath = typeof window !== "undefined" ? window.location.pathname : pathname;
    const cleanPathname = extractLocaleFromPath(currentActivePath).cleanPath;

    return (
        <I18nContext.Provider
            value={{
                locale,
                setLocale,
                t,
                getLocalizedHref,
                cleanPathname,
            }}
        >
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    return useContext(I18nContext);
}
