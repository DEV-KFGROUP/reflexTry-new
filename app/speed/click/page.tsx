import { Metadata } from 'next';
import ClickGame from './ClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

import { AEOAnswerBlock } from '@/components/AEOAnswerBlock';
import { AEO_DEFINITIONS } from '@/lib/aeo-definitions';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('cps-test', '/speed/click');
}

export default function Page() {
    const config = SEO_CONFIGS['cps-test'];
    const content = getToolContent('cps-test', config.title);
    const cpsDef = AEO_DEFINITIONS['cps-speed'];

    const structuredData = generateToolStructuredData(
        'cps-test',
        config.title,
        config.description,
        `/speed/click`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/click` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/click`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ClickGame />

                <div className="w-full max-w-5xl">
                    <AEOAnswerBlock 
                        question="What is a good Clicks Per Second (CPS) score?"
                        answer={cpsDef.quickAnswer}
                        keyPoints={["Use the same test duration", "Keep your input device and technique consistent", "Stop if your hand feels uncomfortable"]}
                    />
                </div>
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Clicks Per Second (CPS) Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Accurately calibrates finger tapping speed and stamina metrics.",
                                  "Improves split-finger hand coordination (Alternating click pads).",
                                  "Develops clicking precision under movement stresses (Moving targets).",
                                  "Sharpens numerical logic scanning and speed sequencing (Ascending pads).",
                                  "Saves high score averages (CPS benchmarks) per difficulty level.",
                                ]}
                                howToPlay={[
                                  "Select a difficulty level — Beginner (Standard, 10s) to Professional (Ascending 1 -> 2 -> 3 pads).",
                                  "Click 'Initialize CPS Pad' to start.",
                                  "Under Normal mode, click LEFT then RIGHT alternatingly as fast as possible.",
                                  "Under Hard mode, follow and click the moving target dot inside the console area.",
                                  "Under Professional mode, tap keypads sequentially in order: 1, then 2, then 3, then 1, and so forth.",
                                  "Achieve maximum clicks within the 5s/10s timer limit to beat your best CPS rating.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}