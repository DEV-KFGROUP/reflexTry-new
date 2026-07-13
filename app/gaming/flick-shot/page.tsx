import { Metadata } from 'next';
import FlickShotGame from './FlickShotGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('flick-shot', '/gaming/flick-shot');
}

export default function Page() {
    const config = SEO_CONFIGS['flick-shot'];
    const content = getToolContent('flick-shot', config.title);
    const structuredData = generateToolStructuredData(
        'flick-shot',
        config.title,
        config.description,
        `/gaming/flick-shot`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/flick-shot` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/flick-shot`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <FlickShotGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Flick Shot Aim Trainer"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains hand-eye micro-flick pointing speeds.",
                                  "Improves target snap latency and choice tracking.",
                                  "Tests visual differentiation by identifying decoy bomb centers.",
                                  "Saves optimal calibration hit records per difficulty level.",
                                  "Essential training for fast FPS target acquisitions.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (68px, slow) to Professional (24px, fast, decoy bomb targets).",
                                  "Click 'Initialize Optic Field' to begin the 30-second trial.",
                                  "Snap and click cyan targets immediately as they expand and shrink on screen.",
                                  "On Professional, ignore targets with black cores (decoy bombs). Clicking them deducts score and lives.",
                                  "Exceeding mistake limits or missing clicks ends the trial early.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}