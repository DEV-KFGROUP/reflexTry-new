import { headers } from 'next/headers';
import { Metadata } from 'next';
import VisualMemoryPageClient from './VisualMemoryPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('visual-memory', '/memory/visual', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('visual-memory', locale);
    const content = getToolContent('visual-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'visual-memory',
        config.title,
        config.description,
        `/memory/visual`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/visual` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/visual`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <VisualMemoryPageClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Visual Memory"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Scales from 3×3 (Beginner) to 8×8 (Professional) for continuous, long-term challenge.",
                                  "Beginner/Easy reveals the correct pattern after a wrong click so you can learn from errors.",
                                  "Normal+ penalises wrong clicks immediately to build precise spatial accuracy.",
                                  "Grid size grows automatically as you advance — keeps difficulty fresh every session.",
                                  "Input countdown timer on Hard/Pro trains visual recall speed under genuine pressure.",
                                  "Streak counter motivates consistent accuracy with 🔥 combo momentum.",
                                  "Per-difficulty high scores in localStorage track long-term spatial memory growth.",
                                ]}
                                howToPlay={[
                                  "Pick a difficulty — Beginner (3×3, 3 lives, hint) to Professional (6×6+, ultra-fast, timed).",
                                  "Watch the grid: coloured tiles light up for a few seconds — memorize their positions.",
                                  "When the pattern hides, click every tile that was highlighted from memory.",
                                  "Correct tiles glow ✓; wrong tiles flash red ✕.",
                                  "On Beginner/Easy a wrong click replays the level — the correct tiles briefly pulse orange as a hint.",
                                  "On Normal+ a wrong click costs a life and the round ends immediately.",
                                  "Hard & Professional modes add a countdown timer — find all tiles before it expires!",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}