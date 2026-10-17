import { headers } from 'next/headers';
import { Metadata } from 'next';
import PrecisionClickGame from './PrecisionClickGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('precision-click', '/accuracy/precision-click', locale);
}

export default function Page() {
    const config = SEO_CONFIGS['precision-click'] || {
        title: 'Precision Clicking Test',
        description: 'Test your hand-eye coordination and precision clicking accuracy'
    };
    const content = getToolContent('precision-click', config.title);
    const structuredData = generateToolStructuredData(
        'precision-click',
        config.title,
        config.description,
        `/accuracy/precision-click`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/precision-click` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/precision-click`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <PrecisionClickGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Precision Clicking Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains cursor precision pointing speed.",
                                  "Improves dynamic micro tracking aim adjustments.",
                                  "Sharpens sensory-motor coordination under strict strike limits.",
                                  "Saves optimal performance hit records per difficulty level.",
                                  "Essential calibration tool for competitive FPS gamers.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (65px, static) to Professional (20px, moving drift, 3 lives limit).",
                                  "Click 'Initialize Precision Deck' to start the 30-second trial.",
                                  "Observe target points spawning. Click the cyan target center.",
                                  "On Hard and Professional, track targets vibrating or drifting across the screen.",
                                  "Missing clicks or letting targets expire strikes remaining lives.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}