import { headers } from 'next/headers';
import { Metadata } from 'next';
import AimTrainerClient from './AimTrainerClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('aim-trainer', '/gaming/aim', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('aim-trainer', locale);
    const content = getToolContent('aim-trainer', config.title, locale);
    const structuredData = generateToolStructuredData(
        'aim-trainer',
        config.title,
        config.description,
        `/gaming/aim`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/aim` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/aim`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <AimTrainerClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Dynamic Aim Trainer"
                                description={content?.description || "Train your aim with moving targets. Improve your accuracy and reaction speed."}
                                howToUse={content?.howToUse || []}
                                howToImprove={content?.howToImprove || []}
                                faqs={content?.faqs || []}
                                relatedTools={content?.relatedTools || []}
                                benefits={[
                                  "Improves hand-eye coordination and muscle memory.",
                                  "Enhances mouse precision and micro-flicking capabilities.",
                                  "Develops cognitive control by avoiding red decoy bomb targets.",
                                  "Teaches parallel tracking parameter adjustment.",
                                  "Saves historical score records across difficulty presets.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (64px target, slow) to Professional (24px target, red bomb decoys, screen recoil shake).",
                                  "Click 'Initialize Optic Board' to launch the trial.",
                                  "Click the cyan target balls as fast as they spawn. Correct clicks trigger new targets.",
                                  "Avoid Red bomb targets on Hard/Professional, which subtract 300 points and strike remaining lives.",
                                  "Avoid Grey decoy targets on Professional, which count as misses.",
                                  "Exceeding mistake strikes or clicking the background aborts the session early.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}