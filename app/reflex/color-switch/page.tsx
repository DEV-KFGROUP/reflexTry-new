import { headers } from 'next/headers';
import { Metadata } from 'next';
import ColorSwitchGame from './ColorSwitchGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('color-switch', '/reflex/color-switch', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('color-switch', locale);
    const content = getToolContent('color-switch', config.title, locale);
    const structuredData = generateToolStructuredData(
        'color-switch',
        config.title,
        config.description,
        `/reflex/color-switch`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/color-switch` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/color-switch`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ColorSwitchGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Color Switch Reflex Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves selective attention and executive control function capabilities.",
                                  "Resolves Stroop interference conflicts to boost neural response times.",
                                  "Forces cognitive flexibility by switching between 'match ink' and 'match word' rules.",
                                  "Sharpens spatial orientation by processing upside down rotated texts.",
                                  "Maintains historical accuracy metrics per difficulty level.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (3 colors, direct match) to Professional (8 colors, rotated text, rule switches, 1s timer).",
                                  "Click 'Initialize Stroop' to start the challenge.",
                                  "Observe the flashing color word inside the LCD console.",
                                  "On Hard, read the text rotated at random angles.",
                                  "On Professional, check the top rules banner to see whether to match 'Ink Color' or literal 'Word Text'.",
                                  "Complete all 20 rounds before the countdown timers run out.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
