import { headers } from 'next/headers';
import { Metadata } from 'next';
import DirectionGame from './DirectionGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('directional-reflex', '/reflex/direction', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('directional-reflex', locale);
    const content = getToolContent('directional-reflex', config.title, locale);
    const structuredData = generateToolStructuredData(
        'directional-reflex',
        config.title,
        config.description,
        `/reflex/direction`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/direction` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/direction`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <DirectionGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Directional Reflex Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves spatial orientation and choices under speed pressure.",
                                  "Sharpens visual search filtering by tuning out flanker decoy arrows.",
                                  "Enhances keyboard coordination muscle memory patterns (WASD/Arrows).",
                                  "Forces cognitive flexibility through red/green inversion rules.",
                                  "Provides stats metrics to track progress parameters.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (Basic arrows, 45s) to Professional (Flanker decoys + prompt mods).",
                                  "Click 'Initialize Vector' to begin.",
                                  "Replicate arrows on screen using Arrow keys or on-screen D-pad.",
                                  "On Normal/Hard, Green arrows mean direct entry, Red arrows require opposite directions.",
                                  "On Professional, check the top prompt banner rule (Direct or Inverse opposite) on every turn.",
                                  "Avoid misfires to ensure your final accuracy rating and scores stay optimal.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
