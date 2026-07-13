import { Metadata } from 'next';
import StroopDropClient from './StroopDropClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('stroop-drop', '/gaming/stroop-drop');
}

export default function Page() {
    const config = SEO_CONFIGS['stroop-drop'];
    const content = getToolContent('stroop-drop', config.title);
    const structuredData = generateToolStructuredData(
        'stroop-drop',
        config.title,
        config.description,
        `/gaming/stroop-drop`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
        { name: config.title, url: `/gaming/stroop-drop` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/gaming/stroop-drop`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <StroopDropClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Infinite Stroop Drop"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves cognitive conflict resolution under heavy time pressure.",
                                  "Trains selective visual inhibition (ignoring literal text shapes).",
                                  "Strengthens speed response mappings by adding Purple and Orange keys.",
                                  "Saves historical maximum cleared score counts per preset level.",
                                  "Sharpens ocular control during sudden word rotations and blurs.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (2 colors, congruent) to Professional (6 colors, 10% congruent, rotations, blurs).",
                                  "Click 'Commence Interference Test' to start.",
                                  "Observe falling words. Focus only on the FONT COLOR of the lowest word.",
                                  "Tap the aligned color key keypad or press hotkeys on your keyboard.",
                                  "Avoid selecting incorrect colors or letting words cross the drop boundary.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}