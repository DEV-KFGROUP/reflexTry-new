import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isSupportedLocale } from './lib/i18n/config';

/** Retire unfinished language URLs until complete translations are published. */
export function middleware(request: NextRequest) {
    const segments = request.nextUrl.pathname.split('/').filter(Boolean);
    if (segments[0] && isSupportedLocale(segments[0])) {
        const url = request.nextUrl.clone();
        url.pathname = '/' + segments.slice(1).join('/');
        return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
