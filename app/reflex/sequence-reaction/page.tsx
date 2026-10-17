import { headers } from 'next/headers';
import { Metadata } from 'next';
import SequenceReactionGame from './SequenceReactionGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('sequence-reaction', '/reflex/sequence-reaction', locale);
}

export default function Page() {
    const config = SEO_CONFIGS['sequence-reaction'] || {
        title: 'Sequence Reaction Test',
        description: 'Test your memory and reaction speed by repeating color sequences'
    };
    const content = getToolContent('sequence-reaction', config.title);
    const structuredData = generateToolStructuredData(
        'sequence-reaction',
        config.title,
        config.description,
        `/reflex/sequence-reaction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/sequence-reaction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/sequence-reaction`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SequenceReactionGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Sequence Reaction Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Binds spatial recall mapping logic with motor reaction execution speeds.",
                                  "Improves cognitive adaptiveness by scanning dynamically shifting grids.",
                                  "Sharpens short term memory capacity under high-speed input countdown buffers.",
                                  "Develops parallel tracking mechanisms required in competitive sports.",
                                  "Preserves detailed historical scores per difficulty configuration.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty level — Beginner (4 buttons, slow flashes) to Professional (12 buttons, dynamic grid shuffles).",
                                  "Click 'Initialize Arena' to start.",
                                  "Carefully watch the sensor lights flash sequentially.",
                                  "On Hard mode, notice the button coordinates shuffle positions before you begin typing.",
                                  "On Professional mode, notice the button coordinates shuffle *every time you hit a correct color*.",
                                  "Input all sequence colors before the time limit progress bar runs out.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}