import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SUPPORTED_LOCALES, DEFAULT_LOCALE, isSupportedLocale } from './lib/i18n/config';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip static assets, APIs, and meta files
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.includes('.') // matches favicon.ico, sitemap.xml, robots.txt, etc.
    ) {
        return NextResponse.next();
    }

    const segments = pathname.split('/').filter(Boolean);
    const firstSegment = segments[0];

    // Check if the first segment is a supported locale code (e.g. /es/reflex/reaction)
    if (firstSegment && isSupportedLocale(firstSegment)) {
        const locale = firstSegment;
        // If it's the default locale prefix (e.g. /en/reflex/reaction), redirect to canonical root path
        if (locale === DEFAULT_LOCALE) {
            const canonicalPath = '/' + segments.slice(1).join('/');
            const url = request.nextUrl.clone();
            url.pathname = canonicalPath === '/' ? '/' : canonicalPath;
            return NextResponse.redirect(url, { status: 308 });
        }

        // Rewrite internally to the non-prefixed page handler
        const targetPath = '/' + segments.slice(1).join('/');
        const internalPath = targetPath === '/' ? '/' : targetPath;

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('x-reflextry-locale', locale);
        requestHeaders.set('x-reflextry-pathname', internalPath);

        const rewriteUrl = request.nextUrl.clone();
        rewriteUrl.pathname = internalPath;

        const response = NextResponse.rewrite(rewriteUrl, {
            request: {
                headers: requestHeaders,
            },
        });

        // Set cookie for client hydration
        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            maxAge: 60 * 60 * 24 * 365,
            sameSite: 'lax',
        });

        return response;
    }

    // Default locale (en)
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-reflextry-locale', DEFAULT_LOCALE);
    requestHeaders.set('x-reflextry-pathname', pathname);

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt
         */
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|sitemap.xml|ads.txt|llms.txt|llms-full.txt|ai.txt|.*\\..*).*)',
    ],
};
