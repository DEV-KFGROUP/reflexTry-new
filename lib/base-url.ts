/** Canonical origin shared by metadata, discovery files, and structured data. */
export function getBaseUrl(): string {
    const configured = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.reflextry.com';
    const url = new URL(configured.includes('://') ? configured : `https://${configured}`);
    if (url.hostname === 'reflextry.com') url.hostname = 'www.reflextry.com';
    if (url.hostname === 'www.reflextry.com') url.protocol = 'https:';
    return url.origin;
}

export function getBaseUrlObject(): URL {
    return new URL(getBaseUrl());
}
