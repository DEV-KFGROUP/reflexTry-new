import { headers } from 'next/headers';
import { Metadata } from 'next';
import NumberMemoryPageClient from './NumberMemoryPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('number-memory', '/memory/number', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('number-memory', locale);
    const content = getToolContent('number-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'number-memory',
        config.title,
        config.description,
        `/memory/number`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/number` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/number`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <NumberMemoryPageClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Number Memory"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Expands digit span capacity from 2 digits (Beginner) to 15+ (Professional).",
                                  "Hard & Professional modes include decimals and negative numbers for real challenge.",
                                  "Digit-group display on Beginner/Easy trains chunking — a proven memory technique.",
                                  "Lives system lets beginners retry the same level without losing all progress.",
                                  "Streak counter rewards consecutive correct answers with 🔥 momentum.",
                                  "Per-difficulty high scores in localStorage give clear, lasting progress milestones.",
                                  "Input countdown timer on Hard/Pro builds recall speed under genuine pressure.",
                                ]}
                                howToPlay={[
                                  "Pick a difficulty — Beginner (2 digits, 3 lives) to Professional (7+ digits, ultra-fast, timed).",
                                  "A number flashes on screen — memorize it before the progress bar drains.",
                                  "Beginner/Easy shows numbers in grouped chunks to help you apply chunking technique.",
                                  "When the number disappears, type it exactly (including any decimal or minus sign on Hard+).",
                                  "Correct → advance to the next level with more digits. Wrong → costs a life.",
                                  "Hard & Professional modes start a countdown after the number hides — submit before time runs out.",
                                  "Run out of lives and the game ends — beat your best digit count per difficulty!",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}