import { MetadataRoute } from 'next';
import { getContentSlugs, getContentBySlug } from '@/lib/content/loader';
import { getBaseUrl } from '@/lib/base-url';
import { getHreflangAlternates, TARGET_LOCALES } from '@/lib/international-seo';
import type { Article } from '@/lib/content/types';

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
    '/methodology',
    '/training-programs',
    '/tools',
    '/leaderboard',
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
    '/memory/word-recall',
    '/memory/card-match',
    '/memory/chimp-test',
    '/memory/verbal-memory',
    '/memory/object-tracking',
    '/memory/n-back',
    // Reflex
    '/reflex',
    '/reflex/reaction',
    '/reflex/sound',
    '/reflex/grid',
    '/reflex/peripheral',
    '/reflex/direction',
    '/reflex/multi-stimulus',
    '/reflex/sequence-reaction',
    '/reflex/whack-a-mole',
    '/reflex/color-switch',
    '/reflex/time-perception',
    '/reflex/go-no-go',
    '/reflex/flanker',
    '/reflex/choice-reaction',
    // Speed
    '/speed',
    '/speed/click',
    '/speed/typing',
    '/speed/math',
    '/speed/words',
    '/speed/grid',
    '/speed/number-rush',
    '/speed/quick-sort',
    '/speed/schulte-table',
    // Accuracy
    '/accuracy',
    '/accuracy/pattern-matching',
    '/accuracy/precision-click',
    '/accuracy/data',
    '/accuracy/image-recognition',
    '/accuracy/angle-estimation',
    '/accuracy/color-match',
    '/accuracy/color-blindness',
    '/accuracy/mental-rotation',
    // Gaming
    '/gaming',
    '/gaming/aim',
    '/gaming/reaction',
    '/gaming/endless-dodge',
    '/gaming/stroop-drop',
    '/gaming/target-tracking',
    '/gaming/flick-shot',
    '/gaming/rhythm-tap',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getBaseUrl();
    const allRoutes = [...STATIC_ROUTES, ...GAME_ROUTES];

    // Core tools and category pages audited and updated in the recent release
    const CORE_PAGES_LASTMOD = new Date('2026-10-02T19:04:49.000Z');

    const entries: MetadataRoute.Sitemap = [];

    for (const route of allRoutes) {
        const isHome = route === '';
        const priority = isHome ? 1.0 : route.split('/').length === 2 ? 0.9 : 0.8;
        const canonicalUrl = `${siteUrl}${route}`;
        const alternates = {
            languages: getHreflangAlternates(canonicalUrl),
        };

        for (const target of TARGET_LOCALES) {
            const localizedUrl = target.lang === 'en'
                ? canonicalUrl
                : `${siteUrl}/${target.lang}${route}`;

            entries.push({
                url: localizedUrl,
                lastModified: CORE_PAGES_LASTMOD,
                changeFrequency: isHome ? 'daily' : 'weekly',
                priority,
                alternates,
            });
        }
    }

    const blogSlugs = await getContentSlugs('blog');
    for (const file of blogSlugs) {
        const cleanSlug = file.replace(/\.mdx?$/, '');
        const canonicalBlogUrl = `${siteUrl}/blog/${cleanSlug}`;
        let lastModified = CORE_PAGES_LASTMOD;
        try {
            const { meta } = await getContentBySlug<Article>('blog', cleanSlug);
            lastModified = new Date(meta.updatedAt ?? meta.publishedAt);
        } catch {
            // fallback to default lastmod
        }

        const alternates = {
            languages: getHreflangAlternates(canonicalBlogUrl),
        };

        for (const target of TARGET_LOCALES) {
            const localizedBlogUrl = target.lang === 'en'
                ? canonicalBlogUrl
                : `${siteUrl}/${target.lang}/blog/${cleanSlug}`;

            entries.push({
                url: localizedBlogUrl,
                lastModified,
                changeFrequency: 'weekly',
                priority: 0.7,
                alternates,
            });
        }
    }

    return entries;
}

