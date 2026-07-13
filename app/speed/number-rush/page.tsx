import { Metadata } from 'next';
import NumberRushGame from './NumberRushGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('number-rush', '/speed/number-rush');
}

export default function Page() {
    const config = SEO_CONFIGS['number-rush'];
    const content = getToolContent('number-rush', config.title);
    const structuredData = generateToolStructuredData(
        'number-rush',
        config.title,
        config.description,
        `/speed/number-rush`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/number-rush` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/number-rush`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <NumberRushGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Number Rush Speed Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains high-speed sequential spatial scanning processing.",
                                  "Improves target acquisition and cursor coordination skills.",
                                  "Develops cognitive control by ignoring red decoy bomb mines.",
                                  "Saves optimal calibration completion latency records per level.",
                                  "Encourages parallel visual focus through dynamic coordinate shuffling.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (10 numbers, simple) to Professional (40 numbers, shuffles, bombs).",
                                  "Click 'Initialize Scanner Board' to deploy the number layout.",
                                  "Search and tap numbers in ascending order: 1, 2, 3... up to your level's maximum.",
                                  "On Hard and Professional, watch the remaining numbers scatter and jump to new coordinates on every hit.",
                                  "Avoid red decoy bombs on Professional, which strike remaining lives.",
                                  "Exceeding mistake strikes or clicking empty areas counts as strikes, ending the trial early.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}