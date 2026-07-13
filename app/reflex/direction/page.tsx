import { Metadata } from 'next';
import DirectionGame from './DirectionGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('directional-reflex', '/reflex/direction');
}

export default function Page() {
    const config = SEO_CONFIGS['directional-reflex'];
    const content = getToolContent('directional-reflex', config.title);
    const structuredData = generateToolStructuredData(
        'directional-reflex',
        config.title,
        config.description,
        `/reflex/direction`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/direction` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/direction`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <DirectionGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
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