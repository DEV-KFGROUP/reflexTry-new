import { notFound } from 'next/navigation';
import { getContentBySlug, getContentSlugs } from '@/lib/content/loader';
import { MDXContent } from '@/components/content/mdx-components';
import { Article } from '@/lib/content/types';
import { type Locale } from '@/i18n/routing';

interface Props {
    params: Promise<{
        slug: string;
        locale: Locale;
    }>;
}

export async function generateStaticParams() {
    // Prerender all blog posts
    const slugs = await getContentSlugs('blog');
    return slugs.map((file) => ({
        slug: file.replace(/\.mdx?$/, ''),
    }));
}

export async function generateMetadata({ params }: Props) {
    const { slug, locale } = await params;
    try {
        const { meta } = await getContentBySlug<Article>('blog', slug);
        return {
            title: `${meta.title} | ReflexTry`,
            description: meta.description,
            openGraph: {
                title: meta.title,
                description: meta.description,
                type: 'article',
                publishedTime: meta.publishedAt,
                images: meta.image ? [meta.image] : [],
            },
        };
    } catch (e) {
        return {
            title: 'Guide Not Found',
        };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug, locale } = await params;

    try {
        const { meta, content } = await getContentBySlug<Article>('blog', slug);

        return (
            <article className="container max-w-3xl py-12">
                <header className="mb-10 text-center">
                    {meta.category && (
                        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            {meta.category}
                        </span>
                    )}
                    <h1 className="mt-4 text-4xl font-extrabold tracking-tight lg:text-5xl">
                        {meta.title}
                    </h1>
                    <div className="mt-6 flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                        <time dateTime={meta.publishedAt}>
                            {new Date(meta.publishedAt).toLocaleDateString(locale, {
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

                <div className="prose prose-lg dark:prose-invert mx-auto">
                    <MDXContent source={content} />
                </div>
            </article>
        );
    } catch (error) {
        notFound();
    }
}
