"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { extractLocaleFromPath, type Locale } from "./config";
import enDict from "./dictionaries/en.json";

export function I18nProvider({ children }: { children: ReactNode; initialLocale?: Locale }) {
    return <>{children}</>;
}

function t(key: string, fallback?: string): string {
    let value: unknown = enDict;
    for (const part of key.split('.')) {
        value = value && typeof value === 'object' ? (value as Record<string, unknown>)[part] : undefined;
    }
    return typeof value === 'string' ? value : fallback || key;
}

export function useTranslation() {
    const pathname = usePathname();
    return {
        locale: 'en' as Locale,
        setLocale: (_locale: Locale) => {},
        t,
        getLocalizedHref: (path: string, _locale?: Locale) => extractLocaleFromPath(path).cleanPath,
        cleanPathname: extractLocaleFromPath(pathname || '/').cleanPath,
    };
}
