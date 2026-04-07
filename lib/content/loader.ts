import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Article, ContentType, TestContent } from './types';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function getContentSlugs(type: ContentType) {
    const dir = path.join(CONTENT_DIR, type);
    if (!fs.existsSync(dir)) return [];
    const files = fs.readdirSync(dir);
    return files.filter((file) => file.endsWith('.md') || file.endsWith('.mdx'));
}

export async function getContentBySlug<T = Article | TestContent>(
    type: ContentType,
    slug: string
) {
    const realSlug = slug.replace(/\.mdx?$/, '');
    const dir = path.join(CONTENT_DIR, type);

    // Try .mdx then .md
    let fullPath = path.join(dir, `${realSlug}.mdx`);
    if (!fs.existsSync(fullPath)) {
        fullPath = path.join(dir, `${realSlug}.md`);
    }

    if (!fs.existsSync(fullPath)) {
        throw new Error(`Content not found: ${type}/${slug}`);
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        slug: realSlug,
        meta: data as T,
        content,
    };
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

export async function getAllContent<T = Article>(type: ContentType) {
    const slugs = await getContentSlugs(type);
    const content = await Promise.all(
        slugs.map((slug) => getContentBySlug<T>(type, slug))
    );

    // Sort by date descending
    return content.sort((a, b) => {
        if ((a.meta as any).publishedAt && (b.meta as any).publishedAt) {
            return (a.meta as any).publishedAt > (b.meta as any).publishedAt ? -1 : 1;
        }
        return 0;
    });
}
