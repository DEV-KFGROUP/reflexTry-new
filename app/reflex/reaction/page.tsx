import { Metadata } from 'next';
import ReactionGame from './ReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('reaction-time', '/reflex/reaction');
}

export default function Page() {
    const config = SEO_CONFIGS['reaction-time'];
    const content = getToolContent('reaction-time', config.title);
    const structuredData = generateToolStructuredData(
        'reaction-time',
        config.title,
        config.description,
        `/reflex/reaction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/reaction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/reaction`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ReactionGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Reaction Time Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Accurately calibrates visual-motor motor reactions down to the millisecond.",
                                  "Sharpens anticipation speeds and visual attention filtering under stress.",
                                  "Teaches players to filter out visual distractions (Faux Signals).",
                                  "Increases accuracy in professional modes requiring cursor target hitting.",
                                  "Provides historic average speed statistics per difficulty mode.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty level — Beginner (6000ms delay, no penalty) to Professional (random target coordinates, faux signals).",
                                  "Tap the console pad to trigger a wait sequence.",
                                  "Wait carefully. On Hard/Professional mode, ignore warning flashes of yellow or blue.",
                                  "On Professional mode, quickly tap the Green Target Dot wherever it appears on the screen.",
                                  "On other modes, tap anywhere on the screen immediately when it turns green.",
                                  "Avoid misfires (clicking too early) to prevent score penalties or reset flags.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}