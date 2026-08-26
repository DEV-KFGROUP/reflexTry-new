"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Locale, DEFAULT_LOCALE, extractLocaleFromPath, getLocalizedPath, LOCALES_METADATA } from "./config";

import enDict from "./dictionaries/en.json";
import esDict from "./dictionaries/es.json";
import deDict from "./dictionaries/de.json";
import frDict from "./dictionaries/fr.json";
import ptDict from "./dictionaries/pt.json";
import jaDict from "./dictionaries/ja.json";

const DICTIONARIES: Record<Locale, any> = {
    en: enDict,
    es: esDict,
    de: deDict,
    fr: frDict,
    pt: ptDict,
    ja: jaDict,
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
    t: (key, fallback) => fallback || key,
    getLocalizedHref: (path) => path,
    cleanPathname: "/",
});

/**
 * Resolve a dot-notation key in a dictionary object (e.g. 'nav.home')
 */
function resolveKey(dict: any, key: string): string | null {
    if (!dict) return null;
    const parts = key.split(".");
    let current = dict;
    for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
            current = current[part];
        } else {
            return null;
        }
    }
    return typeof current === "string" ? current : null;
}

export function I18nProvider({
    children,
    initialLocale,
}: {
    children: React.ReactNode;
    initialLocale?: Locale;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const { locale: detectedLocale, cleanPath: cleanPathname } = useMemo(() => {
        return extractLocaleFromPath(pathname || "/");
    }, [pathname]);

    const [currentLocale, setCurrentLocale] = useState<Locale>(
        initialLocale || detectedLocale || DEFAULT_LOCALE
    );

    useEffect(() => {
        if (detectedLocale && detectedLocale !== currentLocale) {
            setCurrentLocale(detectedLocale);
        }
    }, [detectedLocale, currentLocale]);

    const dict = useMemo(() => {
        return DICTIONARIES[currentLocale] || DICTIONARIES[DEFAULT_LOCALE];
    }, [currentLocale]);

    const fallbackDict = DICTIONARIES[DEFAULT_LOCALE];

    const t = useMemo(() => {
        return (key: string, fallback?: string): string => {
            const translated = resolveKey(dict, key);
            if (translated) return translated;

            const fallbackTranslation = resolveKey(fallbackDict, key);
            if (fallbackTranslation) return fallbackTranslation;

            return fallback || key;
        };
    }, [dict, fallbackDict]);

    const setLocale = (newLocale: Locale) => {
        if (newLocale === currentLocale) return;
        setCurrentLocale(newLocale);
        
        // Persist in cookie
        if (typeof document !== "undefined") {
            document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        }

        // Navigate to localized route
        const targetPath = getLocalizedPath(cleanPathname, newLocale);
        router.push(targetPath);
    };

    const getLocalizedHref = (path: string, targetLocale?: Locale) => {
        return getLocalizedPath(path, targetLocale || currentLocale);
    };

    const contextValue = useMemo(() => {
        return {
            locale: currentLocale,
            setLocale,
            t,
            getLocalizedHref,
            cleanPathname,
        };
    }, [currentLocale, t, cleanPathname]);

    return (
        <I18nContext.Provider value={contextValue}>
            {children}
        </I18nContext.Provider>
    );
}

export function useTranslation() {
    return useContext(I18nContext);
}
