import { headers } from 'next/headers';
import { Metadata } from 'next';
import EndlessDodgeClient from './EndlessDodgeClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('endless-dodge', '/gaming/endless-dodge', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('endless-dodge', locale);
    const content = getToolContent('endless-dodge', config.title, locale);
    const structuredData = generateToolStructuredData(
        'endless-dodge',
        config.title,
        config.description,
        `/gaming/endless-dodge`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/endless-dodge` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/endless-dodge`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <EndlessDodgeClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Endless Dodge"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains rapid spatial positioning and defensive motor reflexes.",
                                  "Sharpens visual tracking by dodging moving objects across fields.",
                                  "Develops micro-pointing control by avoiding homing and pulse bombs.",
                                  "Saves maximal survival time stats per difficulty preset.",
                                  "Fun, competitive arcade gameplay mode.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (slow spawn, unlimited hits) to Professional (homing, expanding pulse bombs, sudden death).",
                                  "Click 'Commence Evasion Trial' to start.",
                                  "Move your cursor around the game viewport. Your cursor is represented by the blue orb.",
                                  "Dodge all incoming projectiles (Rose = Normal, Amber = Homing, Purple = Expanding Pulse Bombs).",
                                  "Beginner features a fixed 45-second countdown to count hits; other modes feature sudden death.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}