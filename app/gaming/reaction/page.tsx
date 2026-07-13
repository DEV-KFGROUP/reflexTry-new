import { Metadata } from 'next';
import RPGReactionClient from './RPGReactionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('rpg-reaction', '/gaming/reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['rpg-reaction'];
    const content = getToolContent('rpg-reaction', config.title);
    const structuredData = generateToolStructuredData(
        'rpg-reaction',
        config.title,
        config.description,
        `/gaming/reaction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/reaction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/reaction`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <RPGReactionClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="RPG Reflex Test"
                                description={content?.description || "Test your defensive reflexes in this RPG-style reaction game."}
                                howToUse={content?.howToUse || []}
                                howToImprove={content?.howToImprove || []}
                                faqs={content?.faqs || []}
                                relatedTools={content?.relatedTools || []}
                                benefits={[
                                  "Improves defensive reaction speeds and motor trigger limits.",
                                  "Sharpens selective visual inhibition by ignoring warning feints.",
                                  "Develops directional choice reaction speeds (Left/Top/Right options).",
                                  "Saves historical average block latencies per difficulty level.",
                                  "Fun medieval combat-themed cognitive reaction testing.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (countdown cues, standard click) to Professional (directional shield controls, feints).",
                                  "Click 'Enter Combat Arena' to start.",
                                  "Observe the center of the field. When the sword flashes, execute block immediately.",
                                  "On Hard/Professional, ignore sword shakes and audio glitches (feints). Block only when the sword fully strikes.",
                                  "On Professional, check the sword strike direction (Left, Top, Right) and click the aligned shield button (Left, Top, Right).",
                                  "Exceeding mistake limits ends the test early.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}