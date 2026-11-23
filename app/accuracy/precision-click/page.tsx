import { headers } from 'next/headers';
import { Metadata } from 'next';
import PrecisionClickGame from './PrecisionClickGame';
import { getToolMetadata } from '@/lib/seo-utils';
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

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = SEO_CONFIGS['precision-click'] || {
        title: 'Precision Clicking Test',
        description: 'Test your hand-eye coordination and precision clicking accuracy'
    };
    const content = getToolContent('precision-click', config.title);
    const structuredData = generateToolStructuredData(
        'precision-click',
        config.title,
        config.description,
        `/accuracy/precision-click`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/precision-click` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/precision-click`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <PrecisionClickGame />
                
                <div className="w-full max-w-5xl relative z-10">
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
