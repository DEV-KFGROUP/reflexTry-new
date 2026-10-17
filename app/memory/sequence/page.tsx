import { headers } from 'next/headers';
import { Metadata } from 'next';
import SequenceGame from './SequenceGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('sequence-memory', '/memory/sequence', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('sequence-memory', locale);
    const content = getToolContent('sequence-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'sequence-memory',
        config.title,
        config.description,
        `/memory/sequence`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/sequence` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/sequence`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SequenceGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Sequence Memory Calibration"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains working memory and sequential recall across 5 difficulty tiers.",
                                  "Scales from 4-button Beginner grids up to 16-button Professional grids.",
                                  "Builds pattern recognition speed under increasing cognitive load.",
                                  "Develops mental discipline through timed pressure on Hard & Professional.",
                                  "Lives system on Beginner/Easy lets beginners learn without frustration.",
                                  "Combo streak rewards sustained accuracy and builds competitive motivation.",
                                  "Per-difficulty high scores provide clear, trackable progress milestones.",
                                ]}
                                howToPlay={[
                                  "Pick a difficulty — Beginner (4 buttons, 3 lives) to Professional (16 buttons, ultra-fast, timed).",
                                  "Watch the sequence of flashing colored buttons carefully — each lights up one at a time.",
                                  "Once the sequence stops, click each button in the exact same order from memory.",
                                  "Complete the full sequence correctly to advance to the next stage (one more button added).",
                                  "A wrong click costs a life on Beginner/Easy; on Normal+ it ends the round immediately.",
                                  "Hard & Professional modes show a countdown timer — you must finish inputting before it expires.",
                                  "Chain 3+ correct rounds in a row to trigger a 🔥 Combo streak bonus.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}