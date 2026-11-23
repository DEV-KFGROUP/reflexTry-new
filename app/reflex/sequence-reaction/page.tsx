import { headers } from 'next/headers';
import { Metadata } from 'next';
import SequenceReactionGame from './SequenceReactionGame';
import { getToolMetadata } from '@/lib/seo-utils';
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

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = SEO_CONFIGS['sequence-reaction'] || {
        title: 'Sequence Reaction Test',
        description: 'Test your memory and reaction speed by repeating color sequences'
    };
    const content = getToolContent('sequence-reaction', config.title);
    const structuredData = generateToolStructuredData(
        'sequence-reaction',
        config.title,
        config.description,
        `/reflex/sequence-reaction`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/sequence-reaction` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/sequence-reaction`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SequenceReactionGame />
                
                <div className="w-full max-w-5xl relative z-10">
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
