import { headers } from 'next/headers';
import { Metadata } from 'next';
import MultiStimulusGame from './MultiStimulusGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('multi-stimulus', '/reflex/multi-stimulus', locale);
}

export default function Page() {
    const config = SEO_CONFIGS['multi-stimulus'] || {
        title: 'Multi-Stimulus Reaction Test',
        description: 'Test your selective attention and decision-making speed with multiple stimuli'
    };
    const content = getToolContent('multi-stimulus', config.title);
    const structuredData = generateToolStructuredData(
        'multi-stimulus',
        config.title,
        config.description,
        `/reflex/multi-stimulus`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/multi-stimulus` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/multi-stimulus`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <MultiStimulusGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Multi-Stimulus Reaction Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Teaches rapid decision choice filtering and visual scanning.",
                                  "Improves selective attention inhibition by processing 'DON'T click' rules.",
                                  "Resolves Stroop color-word interference conflicts to build cerebral flexibility.",
                                  "Processes simultaneous shape + color parameters under strict countdown limits.",
                                  "Builds average latency statistics per difficulty stage.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty level — Beginner (4 basic colors) to Professional (9 buttons, shapes + colors combined, 1.0s limit).",
                                  "Click 'Initialize Arena' to begin.",
                                  "Quickly read the instruction prompt banner (e.g. 'Click the GREEN one' or 'DON'T click PURPLE').",
                                  "If Stroop rules are active, ignore the ink color of the text and follow the literal word instruction.",
                                  "If shape matching is active, verify both color and shape (Circle, Square, Triangle) before pressing.",
                                  "Complete all 10 rounds within the mistake/life tolerance threshold.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}