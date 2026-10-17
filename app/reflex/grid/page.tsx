import { headers } from 'next/headers';
import { Metadata } from 'next';
import GridShotPageClient from './GridShotPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('grid-shot', '/reflex/grid', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('grid-shot', locale);
    const content = getToolContent('grid-shot', config.title, locale);
    const structuredData = generateToolStructuredData(
        'grid-shot',
        config.title,
        config.description,
        `/reflex/grid`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/grid` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/grid`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <GridShotPageClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Grid Shot Target Aim Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Teaches FPS-oriented muscle memory and precision tracking controls.",
                                  "Improves flicking response times across multiple simultaneous targets.",
                                  "Sharpens hand-eye calibration through shrinking and moving targets.",
                                  "Enforces aim discipline by penalising incorrect board clicks.",
                                  "Maintains per-difficulty scoring benchmarks to note improvements.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (Large 70px target, 45s) to Professional (Micro 22px floating targets, 1.2s lifespan).",
                                  "Tap 'Initialize Aim Arena' to start.",
                                  "Quickly target and click the green dots inside the dark grid console.",
                                  "On Normal/Hard/Pro, missing a target or letting it expire deducts score points.",
                                  "On Professional mode, targets float slightly to test continuous tracking aim.",
                                  "Acquire and click as many target nodes as possible before the timer runs out.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}