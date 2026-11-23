import { getArticleSources } from "@/lib/research-sources";
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { getContentBySlug, getContentSlugs } from '@/lib/content/loader';
import { MDXContent } from '@/components/content/mdx-components';
import { Article } from '@/lib/content/types';
import { generateSEOMetadata } from '@/components/SEO';
import { SchemaInjector } from '@/components/SchemaInjector';
import {
    generateArticleStructuredData,
    generateBreadcrumbStructuredData,
} from '@/lib/structured-data';
import ArticleClient from './ArticleClient';
import { AuthorCard } from '@/components/AuthorCard';
import { BlogRelatedTools } from '@/components/BlogRelatedTools';

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
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    try {
        const { meta } = await getContentBySlug<Article>('blog', slug, locale);
        return generateSEOMetadata({
            title: meta.title,
            description: meta.description,
            keywords: [
                meta.category || 'cognitive training',
                'brain training guide',
                'reaction time science',
                'reflextry blog',
            ],
            url: `/blog/${slug}`,
            image: meta.image || '/opengraph-image',
            type: 'article',
            locale,
            publishedTime: meta.publishedAt,
            modifiedTime: meta.updatedAt ?? meta.publishedAt,
            authorName: meta.author?.name ?? 'Reflextry',
        });
    } catch {
        return {
            title: { absolute: 'Guide Not Found | Reflextry' },
            robots: { index: false, follow: true },
        };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    try {
        const { meta, content } = await getContentBySlug<Article>('blog', slug, locale);
        const wordCount = content
            .replace(/```[\s\S]*?```/g, ' ')
            .replace(/[#>*_`[\]()]/g, ' ')
            .trim()
            .split(/\s+/)
            .filter(Boolean).length;
        const articleLd = generateArticleStructuredData(meta, slug, locale, wordCount);
        const breadcrumbLd = generateBreadcrumbStructuredData(
            [
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog' },
                { name: meta.title, url: `/blog/${slug}` },
            ],
            locale
        );

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
                <SchemaInjector schemas={[articleLd, breadcrumbLd]} />
                <ArticleClient article={articleData}>
                    <MDXContent source={content} />
                    <section aria-labelledby="research-background" className="mt-8 space-y-3 text-[#3F3E39]">
                        <h2 id="research-background" className="text-2xl font-semibold text-[#161614]">Research background and limits</h2>
                        <p>These references discuss memory or training research; they did not evaluate Reflextry. A higher score on a practice task does not establish a clinical benefit or improvement in everyday cognitive ability.</p>
                        <ul className="list-disc pl-5 space-y-2">
                            {getArticleSources(slug).map(source => <li key={source.url}><a className="text-blue-800 underline" href={source.url}>{source.title}</a></li>)}
                        </ul>
                        <p>For this product’s scoring rules and device limitations, read the <a className="text-blue-800 underline" href="/methodology">Reflextry methodology</a>.</p>
                    </section>
                    
                    {/* Related Interactive Tests / Tools */}
                    <BlogRelatedTools slug={slug} category={meta.category} />

                    <div className="mt-10 pt-8 border-t border-[#E6E3DB] dark:border-slate-800">
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
