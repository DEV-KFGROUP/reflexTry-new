import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/base-url';

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                // Allow all pages and static assets (JS, CSS needed for rendering)
                allow: '/',
                // Only block private routes - NOT /_next/ as Google needs those to render
                disallow: [
                    '/api/',      // API endpoints (private)
                    '/admin/',    // Admin routes (if any)
                ],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}
