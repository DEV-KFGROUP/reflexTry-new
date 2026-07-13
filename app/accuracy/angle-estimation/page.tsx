import { Metadata } from 'next';
import AngleEstimationGame from './AngleEstimationGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('angle-estimation', '/accuracy/angle-estimation');
}

export default function Page() {
    const config = SEO_CONFIGS['angle-estimation'];
    const content = getToolContent('angle-estimation', config.title);
    const structuredData = generateToolStructuredData(
        'angle-estimation',
        config.title,
        config.description,
        `/accuracy/angle-estimation`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/angle-estimation` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/angle-estimation`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <AngleEstimationGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Angle Estimation Calibration Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves spatial orientation and geometric angle estimation.",
                                  "Develops relative angle comparison under tilted camera baseline frames.",
                                  "Strengthens visual attention by filtering out distractor cues.",
                                  "Saves optimal average performance logs per difficulty level.",
                                  "Engaging mathematical calibration task.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (90° snaps, horizontal) to Professional (any degree, tilted baseline, distractor line, strikes on scores < 80).",
                                  "Click 'Initialize Scanner Deck' to deploy the 10 visual rounds.",
                                  "Analyze the angle between the thick slate baseline and the cyan target line.",
                                  "Adjust the slider range control to estimate the degrees (0° to 360°).",
                                  "Submit guesses; scoring low accuracy points deducts lives on harder presets.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}