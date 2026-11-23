import { headers } from 'next/headers';
import { Metadata } from 'next';
import QuickSortGame from './QuickSortGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('quick-sort', '/speed/quick-sort', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('quick-sort', locale);
    const content = getToolContent('quick-sort', config.title, locale);
    const structuredData = generateToolStructuredData(
        'quick-sort',
        config.title,
        config.description,
        `/speed/quick-sort`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/quick-sort` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/quick-sort`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <QuickSortGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Quick Sort Speed Game"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves cognitive categorization speeds and sorting reflexes.",
                                  "Sharpens decision choice mapping accuracy under high time pressure.",
                                  "Forces scanning adaptation by shuffling bin buttons on hits.",
                                  "Tests visual classification accuracy through mistake strike caps.",
                                  "Retains highest sorting records across all challenge difficulties.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (2 categories, static) to Professional (6 categories, shuffles, bomb distractors).",
                                  "Click 'Initialize Sorter Deck' to begin the countdown timer.",
                                  "Locate the active emoji node displayed inside the LCD display screen.",
                                  "Sort it into the correct category button. Correct clicks spawn the subsequent node.",
                                  "On Hard and Professional, watch the choice keys rearrange positions after correct sorting hits.",
                                  "On Professional, check for distractor trash items and click 'DISCARD' to discard them.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
