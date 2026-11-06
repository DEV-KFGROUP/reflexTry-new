import { getArticleSources } from "@/lib/research-sources";
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentSlugs } from '@/lib/content/loader';
import { MDXContent } from '@/components/content/mdx-components';
import { Article } from '@/lib/content/types';
import { getBaseUrl, getBaseUrlObject } from '@/lib/base-url';
import { getHreflangAlternates, PRIMARY_OG_LOCALE } from '@/lib/international-seo';
import { generateArticleStructuredData, safeJsonLdStringify } from '@/lib/structured-data';
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

import { headers } from 'next/headers';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const baseUrl = getBaseUrl();
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    try {
        const { meta } = await getContentBySlug<Article>('blog', slug, locale);
        const pageUrl = `${baseUrl}/blog/${slug}`;
        const ogImage = meta.image
            ? meta.image.startsWith('http')
                ? meta.image
                : `${baseUrl}${meta.image}`
            : `${baseUrl}/opengraph-image`;

        return {
            metadataBase: getBaseUrlObject(),
            title: meta.title,
            description: meta.description,
            authors: [{ name: meta.author?.name ?? 'Reflextry' }],
            alternates: {
                canonical: `/blog/${slug}`,
                languages: getHreflangAlternates(pageUrl),
            },
            openGraph: {
                url: pageUrl,
                title: meta.title,
                description: meta.description,
                type: 'article',
                publishedTime: meta.publishedAt,
                modifiedTime: meta.updatedAt ?? meta.publishedAt,
                siteName: 'Reflextry',
                locale: PRIMARY_OG_LOCALE,
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
                creator: '@reflextry',
            },
            robots: {
                index: true,
                follow: true,
            },
        };
    } catch {
        return {
            title: 'Guide Not Found | Reflextry',
        };
    }
}

import { AuthorCard } from '@/components/AuthorCard';
import { BlogRelatedTools } from '@/components/BlogRelatedTools';

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    try {
        const { meta, content } = await getContentBySlug<Article>('blog', slug, locale);
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
                    dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(articleLd) }}
                />
                <ArticleClient article={articleData}>
                    <MDXContent source={content} />
                    <section aria-labelledby="research-background" className="mt-8 space-y-3 text-slate-700">
                        <h2 id="research-background" className="text-2xl font-semibold text-slate-900">Research background and limits</h2>
                        <p>These references discuss memory or training research; they did not evaluate Reflextry. A higher score on a practice task does not establish a clinical benefit or improvement in everyday cognitive ability.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            {getArticleSources(slug).map(source => <li key={source.url}><a className="text-blue-800 underline" href={source.url}>{source.title}</a></li>)}
                        </ul>
                        <p>For this product’s scoring rules and device limitations, read the <a className="text-blue-800 underline" href="/methodology">Reflextry methodology</a>.</p>
                    </section>
                    
                    {/* Related Interactive Tests / Tools */}
                    <BlogRelatedTools slug={slug} category={meta.category} />

                    <div className="mt-10 pt-8 border-t border-slate-200 dark:border-slate-800">
                        <AuthorCard 
                            name={meta.author?.name ?? "Reflextry Editorial"}
                            bio="Product guides from the Reflextry team. These articles explain browser tests and their limitations; they are not clinical assessments."
                        />
                    </div>
                </ArticleClient>
            </>
        );
    } catch {
        notFound();
    }
}
