import type { Tool3DIconSpec } from "@/lib/icons/tool-3d-catalog";

const dataUrlCache = new Map<string, string>();

export function cacheKeyFor(spec: Tool3DIconSpec): string {
    return `${spec.archetype}|${spec.primaryColor}|${spec.secondaryColor}|${spec.accentColor}`;
}

export function getCachedToolIconUrl(spec: Tool3DIconSpec): string | null {
    return dataUrlCache.get(cacheKeyFor(spec)) ?? null;
}

export function getCachedToolIconByKey(key: string): string | null {
    return dataUrlCache.get(key) ?? null;
}

export function setCachedToolIconByKey(key: string, dataUrl: string): void {
    dataUrlCache.set(key, dataUrl);
}
