import { headers } from 'next/headers';
import { Metadata } from 'next';
import GridShotPageClient from './GridShotPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
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
        `/reflex/grid`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/grid` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/grid`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <GridShotPageClient />
                
                <div className="w-full max-w-5xl relative z-10">
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
