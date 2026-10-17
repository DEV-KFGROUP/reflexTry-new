import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupportedLocale, DEFAULT_LOCALE } from './lib/i18n/config';

/**
 * Handles:
 * 1. Apex (reflextry.com) -> Canonical (www.reflextry.com) redirect.
 * 2. Default locale (/en/...) -> Canonical clean path (/...) redirect.
 * 3. Supported locales (/[locale]/...) -> Internal rewrite to App Router routes, keeping localized URL intact for users and search engines.
 */
export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || request.nextUrl.hostname;
    const isApex = host === 'reflextry.com' || host.startsWith('reflextry.com:');

    const pathname = request.nextUrl.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];
    const isLocale = firstSegment && isSupportedLocale(firstSegment);

    // 1. Canonicalize apex domain to www
    if (isApex) {
        const url = request.nextUrl.clone();
        url.hostname = 'www.reflextry.com';
        url.protocol = 'https:';
        url.port = '';
        return NextResponse.redirect(url, 308);
    }

    // 2. Default locale '/en' prefix -> redirect 308 to root path without prefix (clean canonical)
    if (isLocale && firstSegment === DEFAULT_LOCALE) {
        const url = request.nextUrl.clone();
        const remaining = segments.slice(1).join('/');
        url.pathname = remaining ? `/${remaining}` : '/';
        return NextResponse.redirect(url, 308);
    }

    // 3. Supported non-default locale (e.g. /es/reflex/reaction, /ja, /de/tools)
    // Internally rewrite to the base App Router route while keeping the browser URL localized
    if (isLocale && firstSegment !== DEFAULT_LOCALE) {
        const remainingPath = '/' + segments.slice(1).join('/');
        const rewriteUrl = new URL(remainingPath === '/' ? '/' : remainingPath, request.url);
        
        // Pass query params along
        rewriteUrl.search = request.nextUrl.search;

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-locale', firstSegment);
        requestHeaders.set('x-pathname', pathname);

        const response = NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: requestHeaders,
            },
        });

        response.headers.set('Content-Language', firstSegment);
        return response;
    }

    // 4. Default route (English)
    const response = NextResponse.next();
    response.headers.set('Content-Language', DEFAULT_LOCALE);
    return response;
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
