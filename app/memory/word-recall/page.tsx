import { headers } from 'next/headers';
import { Metadata } from 'next';
import WordRecallGame from './WordRecallGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('word-recall', '/memory/word-recall', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('word-recall', locale);
    const content = getToolContent('word-recall', config.title, locale);
    const structuredData = generateToolStructuredData(
        'word-recall',
        config.title,
        config.description,
        `/memory/word-recall`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/word-recall` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/word-recall`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <WordRecallGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Word Recall Memory Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Strengthens verbal working memory capacity over 5 levels.",
                                  "Improves cognitive recall speed under strict input deadlines.",
                                  "Trains focus under visual distortions (varying word rotations & size scales).",
                                  "Tests sequential order recall to evaluate chronological working memory.",
                                  "Maintains persistent records across multiple difficulty modes.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (2+ words, 2s display) to Professional (6+ words, 600ms display, sequential matching).",
                                  "Watch the words flash in sequence in the console deck — memorize them.",
                                  "Once all words have flashed, input them using the recall input field.",
                                  "On Professional mode, you must type them in the exact order they appeared.",
                                  "On other modes, order does not matter as long as all words are recalled.",
                                  "Beat your peak level record across all difficulty modes!",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}