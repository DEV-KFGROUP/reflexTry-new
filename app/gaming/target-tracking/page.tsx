import { headers } from 'next/headers';
import { Metadata } from 'next';
import TargetTrackingClient from './TargetTrackingClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('target-tracking', '/gaming/target-tracking', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('target-tracking', locale);
    const content = getToolContent('target-tracking', config.title, locale);
    const structuredData = generateToolStructuredData(
        'target-tracking',
        config.title,
        config.description,
        `/gaming/target-tracking`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/target-tracking` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/target-tracking`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <TargetTrackingClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Continuous Target Tracking"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves ocular motor smooth pursuit control capacity.",
                                  "Trains cursor stabilization and micro-flicking speed tracking.",
                                  "Develops prediction capabilities during periodic target phase-outs.",
                                  "Saves maximal tracking survival durations per difficulty level.",
                                  "Essential training for FPS gaming tracking engagement stability.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (72px, slow stable) to Professional (24px, fast chaotic, fades, jitter recoil).",
                                  "Click 'Commence Pursuit Calibration' to start.",
                                  "Locate the target sphere inside the tracking console window.",
                                  "Hover and follow the sphere smoothly with your cursor. Hovering fills the Telemetry Health bar.",
                                  "Losing contact with the target drains health. The drain accelerates over time.",
                                  "On Hard and Professional, track the sphere through faded glitch phases.",
                                  "Telemetry Health hitting 0% fails the session.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}