import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { isSupportedLocale } from '@/lib/i18n/config';
import { Article, ContentType, TestContent } from './types';

const CONTENT_DIR = path.resolve(process.cwd(), 'content');
const SAFE_SLUG_RX = /^[a-z0-9][a-z0-9_-]*$/i;

const slugsCache = new Map<ContentType, string[]>();
const itemCache = new Map<string, { slug: string; meta: unknown; content: string }>();
const allContentCache = new Map<string, Array<{ slug: string; meta: unknown; content: string }>>();

function isConfinedPath(candidate: string, baseDir: string): boolean {
    const resolvedBase = path.resolve(baseDir);
    const resolvedCandidate = path.resolve(candidate);
    return resolvedCandidate.startsWith(resolvedBase + path.sep);
}

export async function getContentSlugs(type: ContentType) {
    const cached = slugsCache.get(type);
    if (cached) return cached;

    const dir = path.resolve(CONTENT_DIR, type);
    if (!isConfinedPath(dir, CONTENT_DIR) || !fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
    slugsCache.set(type, files);
    return files;
}

export async function getContentBySlug<T = Article | TestContent>(
    type: ContentType,
    slug: string,
    locale?: string
) {
    const realSlug = slug.replace(/\.mdx?$/, '');
    if (!SAFE_SLUG_RX.test(realSlug)) {
        throw new Error(`Invalid content slug: ${slug}`);
    }

    const safeLocale = locale && locale !== 'en' && isSupportedLocale(locale) ? locale : 'en';
    const cacheKey = `${type}:${safeLocale}:${realSlug}`;
    const cached = itemCache.get(cacheKey);
    if (cached) {
        return cached as { slug: string; meta: T; content: string };
    }

    let fullPath = '';
    if (safeLocale !== 'en') {
        const transDir = path.resolve(CONTENT_DIR, 'translations', safeLocale, type);
        const transMdx = path.resolve(transDir, `${realSlug}.mdx`);
        const transMd = path.resolve(transDir, `${realSlug}.md`);
        if (isConfinedPath(transMdx, transDir) && fs.existsSync(transMdx)) {
            fullPath = transMdx;
        } else if (isConfinedPath(transMd, transDir) && fs.existsSync(transMd)) {
            fullPath = transMd;
        }
    }

    if (!fullPath) {
        const dir = path.resolve(CONTENT_DIR, type);
        const mdxPath = path.resolve(dir, `${realSlug}.mdx`);
        const mdPath = path.resolve(dir, `${realSlug}.md`);
        if (isConfinedPath(mdxPath, dir) && fs.existsSync(mdxPath)) {
            fullPath = mdxPath;
        } else if (isConfinedPath(mdPath, dir) && fs.existsSync(mdPath)) {
            fullPath = mdPath;
        }
    }

    if (!fullPath) {
        throw new Error(`Content not found: ${type}/${slug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    const parsed = {
        slug: realSlug,
        meta: data as T,
        content,
    };
    itemCache.set(cacheKey, parsed);
    return parsed;
}

/** Latest modified time across blog posts (for sitemap fallbacks). */
export async function getLatestBlogModifiedDate(): Promise<Date> {
    const slugs = await getContentSlugs('blog');
    let latestMs = 0;
    for (const file of slugs) {
        const slug = file.replace(/\.mdx?$/, '');
        try {
            const { meta } = await getContentBySlug<Article>('blog', slug);
            const t = new Date(meta.updatedAt ?? meta.publishedAt).getTime();
            if (t > latestMs) latestMs = t;
        } catch {
            /* skip missing */
        }
    }
    return latestMs === 0 ? new Date() : new Date(latestMs);
}

export async function getAllContent<T = Article>(type: ContentType, locale?: string) {
    const safeLocale = locale && locale !== 'en' && isSupportedLocale(locale) ? locale : 'en';
    const cacheKey = `${type}:${safeLocale}`;
    const cached = allContentCache.get(cacheKey);
    if (cached) {
        return cached as Array<{ slug: string; meta: T; content: string }>;
    }

    const slugs = await getContentSlugs(type);
    const articles = await Promise.all(
        slugs.map(async (file) => {
            const slug = file.replace(/\.mdx?$/, '');
            try {
                return await getContentBySlug<T>(type, slug, safeLocale);
            } catch {
                return null;
            }
        })
    );

    const sorted = articles
        .filter((a): a is NonNullable<typeof a> => a !== null)
        .sort((a, b) => {
            if ((a.meta as any).publishedAt && (b.meta as any).publishedAt) {
                return (a.meta as any).publishedAt > (b.meta as any).publishedAt ? -1 : 1;
            }
            return 0;
        });

    allContentCache.set(cacheKey, sorted);
    return sorted;
}
