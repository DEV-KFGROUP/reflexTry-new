import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentSlugs } from '@/lib/content/loader';
import { MDXContent } from '@/components/content/mdx-components';
import { Article } from '@/lib/content/types';
import { getBaseUrl } from '@/lib/base-url';
import { generateArticleStructuredData } from '@/lib/structured-data';

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

        return (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
                />
                <article className="container max-w-3xl py-12 text-foreground">
                    <header className="mb-10 text-center">
                        {meta.category && (
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                {meta.category}
                            </span>
                        )}
                        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-foreground lg:text-5xl">
                            {meta.title}
                        </h1>
                        <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                            <time dateTime={meta.publishedAt}>
                                {new Date(meta.publishedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </time>
                            {meta.readingTime && (
                                <>
                                    <span>•</span>
                                    <span>{meta.readingTime}</span>
                                </>
                            )}
                        </div>
                    </header>

                    <div className="prose prose-lg mx-auto max-w-none text-foreground prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-slate-700 prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground">
                        <MDXContent source={content} />
                    </div>
                </article>
            </>
        );
    } catch {
        notFound();
    }
}
