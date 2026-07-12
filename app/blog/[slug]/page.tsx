import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentSlugs } from '@/lib/content/loader';
import { MDXContent } from '@/components/content/mdx-components';
import { Article } from '@/lib/content/types';
import { getBaseUrl } from '@/lib/base-url';
import { generateArticleStructuredData } from '@/lib/structured-data';
import ArticleClient from './ArticleClient';

interface Props {
    params: Promise<{
        slug: string;
    }>;
}

export async function generateStaticParams() {
    const slugs = await getContentSlugs('blog');
    return slugs.map((file) => ({
        slug: file.replace(/\.mdx?$/, ''),
    }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const baseUrl = getBaseUrl();
    try {
        const { meta } = await getContentBySlug<Article>('blog', slug);
        const pageUrl = `${baseUrl}/blog/${slug}`;
        const ogImage = meta.image
            ? meta.image.startsWith('http')
                ? meta.image
                : `${baseUrl}${meta.image}`
            : `${baseUrl}/opengraph-image`;

        return {
            title: `${meta.title} | Reflextry`,
            description: meta.description,
            authors: [{ name: meta.author?.name ?? 'Reflextry' }],
            alternates: { canonical: pageUrl },
            openGraph: {
                url: pageUrl,
                title: meta.title,
                description: meta.description,
                type: 'article',
                publishedTime: meta.publishedAt,
                modifiedTime: meta.updatedAt ?? meta.publishedAt,
                siteName: 'Reflextry',
                locale: 'en',
                images: [
                    {
                        url: ogImage,
                        width: 1200,
                        height: 630,
                        alt: meta.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title: meta.title,
                description: meta.description,
                images: [ogImage],
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch {
        return {
            title: 'Guide Not Found',
        };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;

    try {
        const { meta, content } = await getContentBySlug<Article>('blog', slug);
        const articleLd = generateArticleStructuredData(meta, slug);

        const articleData = {
            slug,
            title: meta.title,
            description: meta.description,
            readTime: meta.readingTime ?? '5 min read',
            category: meta.category ?? '',
            date: meta.publishedAt,
        };

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
                />
                <ArticleClient article={articleData}>
                    <MDXContent source={content} />
                </ArticleClient>
            </>
        );
    } catch {
        notFound();
    }
}
