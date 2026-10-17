import { headers } from 'next/headers';
import { Metadata } from 'next';
import RhythmTapGame from './RhythmTapGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('rhythm-tap', '/gaming/rhythm-tap', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('rhythm-tap', locale);
    const content = getToolContent('rhythm-tap', config.title, locale);
    const structuredData = generateToolStructuredData(
        'rhythm-tap',
        config.title,
        config.description,
        `/gaming/rhythm-tap`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/rhythm-tap` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/rhythm-tap`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <RhythmTapGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Rhythm Tap Game"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves rhythmic auditory timing precision reflexes.",
                                  "Trains fast finger positioning across 2 to 5 independent keys.",
                                  "Develops cognitive adaptation to dynamic target falling speeds.",
                                  "Saves optimal performance scores per difficulty preset.",
                                  "Fun and engaging rhythm gameplay style.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (2 lanes, F/J) to Professional (5 lanes, D/F/Space/J/K, speed changes).",
                                  "Click 'Initialize Rhythm Board' to deploy the beat sequence.",
                                  "Tap the aligned keys (D, F, Spacebar, J, or K) as calibration notes pass the neon line.",
                                  "Accurate timing triggers Perfect ratings and combo multipliers.",
                                  "Missing notes or pressing incorrect keys strikes remaining lives.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}