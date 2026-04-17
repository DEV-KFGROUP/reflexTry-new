import { Metadata } from 'next';
import BlogHubClient, { type BlogPost } from './BlogHubClient';
import { getBaseUrl } from '@/lib/base-url';
import { getAllContent } from '@/lib/content/loader';
import type { Article } from '@/lib/content/types';

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = getBaseUrl();

    return {
        title: 'Brain Training Articles & Guides | Reflextry Blog',
        description: 'Discover expert insights on brain training, memory improvement, reaction time, and cognitive enhancement. In-depth articles, research-backed guides, and practical tips for improving your mental performance.',
        keywords: ['brain training', 'memory improvement', 'cognitive enhancement', 'reaction time', 'mental performance', 'brain health', 'cognitive training'],
        alternates: {
            canonical: `${baseUrl}/blog`,
        },
        openGraph: {
            title: 'Brain Training Articles & Guides | Reflextry Blog',
            description: 'Expert insights on brain training, memory improvement, and cognitive enhancement.',
            url: `${baseUrl}/blog`,
            type: 'website',
        },
    };
}

export default async function Blog() {
    const items = await getAllContent<Article>('blog');
    const posts: BlogPost[] = items.map(({ slug, meta }) => ({
        slug,
        title: meta.title,
        description: meta.description,
        readTime: meta.readingTime ?? '5 min read',
        category: meta.category,
        date: meta.publishedAt,
    }));

    return <BlogHubClient posts={posts} />;
}
