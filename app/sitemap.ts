import { MetadataRoute } from 'next';
import { getContentSlugs } from '@/lib/content/loader';
import { SUPPORTED_LOCALES, getBaseUrl } from '@/lib/base-url';

export const dynamic = 'force-static';

// All routes in the application
const STATIC_ROUTES = [
    '', // Home
    '/about',
    '/privacy',
    '/terms',
    '/cookies',
    '/contact',
    '/blog',
    '/faq',
    '/science',
    '/training-programs',
    '/tools',
    '/leaderboard',
    '/challenges',
    '/achievements',
    '/statistics',
];

const GAME_ROUTES = [
    // Memory
    '/memory',
    '/memory/number',
    '/memory/sequence',
    '/memory/visual',
    '/memory/color',
    '/memory/shape',
    '/memory/symbol',
    // Reflex
    '/reflex',
    '/reflex/reaction',
    '/reflex/sound',
    '/reflex/grid',
    '/reflex/peripheral',
    '/reflex/direction',
    '/reflex/multi-stimulus',
    '/reflex/sequence-reaction',
    // Speed
    '/speed',
    '/speed/click',
    '/speed/typing',
    '/speed/math',
    '/speed/words',
    '/speed/grid',
    // Accuracy
    '/accuracy',
    '/accuracy/pattern-matching',
    '/accuracy/precision-click',
    '/accuracy/data',
    '/accuracy/image-recognition',
    // Gaming
    '/gaming',
    '/gaming/aim',
    '/gaming/reaction',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getBaseUrl();
    const allRoutes = [...STATIC_ROUTES, ...GAME_ROUTES];

    // Generate entries for all routes × all locales
    const localizedEntries: MetadataRoute.Sitemap = [];

    for (const locale of SUPPORTED_LOCALES) {
        for (const route of allRoutes) {
            const isHome = route === '';
            const priority = isHome ? 1.0 : route.split('/').length === 2 ? 0.9 : 0.8;

            localizedEntries.push({
                url: `${siteUrl}/${locale}${route}`,
                lastModified: new Date().toISOString(),
                changeFrequency: isHome ? 'daily' : 'weekly',
                priority,
                alternates: {
                    languages: Object.fromEntries(
                        SUPPORTED_LOCALES.map(l => [l, `${siteUrl}/${l}${route}`])
                    ),
                },
            });
        }
    }

    // Dynamic Blog Posts (for all locales)
    const blogSlugs = await getContentSlugs('blog');
    for (const locale of SUPPORTED_LOCALES) {
        for (const slug of blogSlugs) {
            const cleanSlug = slug.replace(/\.mdx?$/, '');
            localizedEntries.push({
                url: `${siteUrl}/${locale}/blog/${cleanSlug}`,
                lastModified: new Date().toISOString(),
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates: {
                    languages: Object.fromEntries(
                        SUPPORTED_LOCALES.map(l => [l, `${siteUrl}/${l}/blog/${cleanSlug}`])
                    ),
                },
            });
        }
    }

    return localizedEntries;
}
