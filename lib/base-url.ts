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

