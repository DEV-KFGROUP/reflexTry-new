import { headers } from 'next/headers';
import { Metadata } from 'next';
import ColorMemoryPageClient from './ColorMemoryPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('color-memory', '/memory/color', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('color-memory', locale);
    const content = getToolContent('color-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'color-memory',
        config.title,
        config.description,
        `/memory/color`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/color` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/color`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ColorMemoryPageClient />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Color Matching (Stroop Test)"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Enhances selective attention by filtering out text meaning from color values.",
                                  "Improves cognitive flexibility through rapid task switching (Professional mode).",
                                  "Trains response inhibition — overrides the natural impulse to read words.",
                                  "Sharpens visual processing speeds under time-restricted pressure.",
                                  "Provides persistent score tracking to monitor cognitive resilience.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (3 colors) to Professional (7 colors, dual-mode switch).",
                                  "A color word will flash on screen in a colored ink.",
                                  "On Professional mode, look at the banner: either match INK COLOR or match TEXT value.",
                                  "On other modes, click the button matching the INK COLOR.",
                                  "Wrong choices cost a life; timer count down warns you of the limit.",
                                  "Score as many points as possible before time runs out!",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
