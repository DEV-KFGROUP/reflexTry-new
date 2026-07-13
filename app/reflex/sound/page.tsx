import { Metadata } from 'next';
import SoundGame from './SoundGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('sound-reaction', '/reflex/sound');
}

export default function Page() {
    const config = SEO_CONFIGS['sound-reaction'];
    const content = getToolContent('sound-reaction', config.title);
    const structuredData = generateToolStructuredData(
        'sound-reaction',
        config.title,
        config.description,
        `/reflex/sound`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/sound` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/sound`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SoundGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Audio Reaction Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Calibrates motor reaction speeds strictly via auditory cues.",
                                  "Improves selective auditory focus by tuning out false pitch frequencies.",
                                  "Sharpens sensory coordination speed through dual-task pitch matching.",
                                  "Compares visual reaction time to auditory reaction speeds side by side.",
                                  "Saves historical latency charts to note progress milestones.",
                                ]}
                                howToPlay={[
                                  "Select a difficulty level — Beginner (6000ms delay, no penalty) to Professional (Pitch matching task shifts).",
                                  "Tap the console pad to trigger a synchronization timer.",
                                  "Listen carefully: On Hard/Professional mode, low pitch tones (350Hz) are distractions.",
                                  "On Professional mode, pay attention to the banner: Click only on the requested pitch (High or Low).",
                                  "Click immediately when the correct tone plays. Early or incorrect pitch clicks incur penalties.",
                                  "Calibrate all 5 attempts to calculate your average auditory latency.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}