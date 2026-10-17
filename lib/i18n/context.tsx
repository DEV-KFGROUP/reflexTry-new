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

// Statically import all 16 lightweight dictionaries (~3KB each)
import enDict from "./dictionaries/en.json";
import esDict from "./dictionaries/es.json";
import ptDict from "./dictionaries/pt.json";
import deDict from "./dictionaries/de.json";
import frDict from "./dictionaries/fr.json";
import jaDict from "./dictionaries/ja.json";
import koDict from "./dictionaries/ko.json";
import ruDict from "./dictionaries/ru.json";
import itDict from "./dictionaries/it.json";
import plDict from "./dictionaries/pl.json";
import trDict from "./dictionaries/tr.json";
import idDict from "./dictionaries/id.json";
import viDict from "./dictionaries/vi.json";
import zhCNDict from "./dictionaries/zh-CN.json";
import zhTWDict from "./dictionaries/zh-TW.json";
import nlDict from "./dictionaries/nl.json";

const DICTIONARIES: Record<Locale, Record<string, any>> = {
    en: enDict,
    es: esDict,
    pt: ptDict,
    de: deDict,
    fr: frDict,
    ja: jaDict,
    ko: koDict,
    ru: ruDict,
    it: itDict,
    pl: plDict,
    tr: trDict,
    id: idDict,
    vi: viDict,
    "zh-CN": zhCNDict,
    "zh-TW": zhTWDict,
    nl: nlDict,
};

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

export function I18nProvider({ children, initialLocale }: { children: ReactNode; initialLocale?: Locale }) {
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

    // Synchronize locale when browser URL changes
    useEffect(() => {
        if (typeof window !== "undefined") {
            const pathMeta = extractLocaleFromPath(window.location.pathname);
            const activeLocale = pathMeta.locale || DEFAULT_LOCALE;
            if (activeLocale !== locale) {
                setLocaleState(activeLocale);
            }
        }
    }, [pathname]);

    const activeDict = DICTIONARIES[locale] || DICTIONARIES[DEFAULT_LOCALE];

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
            let enValue: any = DICTIONARIES[DEFAULT_LOCALE];
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
        } catch (_) {}

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
