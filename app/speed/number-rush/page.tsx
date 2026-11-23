import { headers } from 'next/headers';
import { Metadata } from 'next';
import NumberRushGame from './NumberRushGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('number-rush', '/speed/number-rush', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('number-rush', locale);
    const content = getToolContent('number-rush', config.title, locale);
    const structuredData = generateToolStructuredData(
        'number-rush',
        config.title,
        config.description,
        `/speed/number-rush`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/number-rush` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/number-rush`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <NumberRushGame />
                
                <div className="w-full max-w-5xl relative z-10">
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
