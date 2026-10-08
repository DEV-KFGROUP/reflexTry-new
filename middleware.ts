import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupportedLocale } from './lib/i18n/config';

/** Handle canonical host redirection and retire unfinished language URLs in a single hop. */
export function middleware(request: NextRequest) {
    const host = request.headers.get('host') || request.nextUrl.hostname;
    const isApex = host === 'reflextry.com' || host.startsWith('reflextry.com:');

    const segments = request.nextUrl.pathname.split('/').filter(Boolean);
    const hasLocalePrefix = Boolean(segments[0] && isSupportedLocale(segments[0]));

    // Canonicalize non-www or legacy language subpaths in a single 308 redirect
    if (isApex || hasLocalePrefix) {
        const url = request.nextUrl.clone();
        if (isApex) {
            url.hostname = 'www.reflextry.com';
            url.protocol = 'https:';
            url.port = '';
        }
        if (hasLocalePrefix) {
            url.pathname = '/' + segments.slice(1).join('/');
        }
        return NextResponse.redirect(url, 308);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};

