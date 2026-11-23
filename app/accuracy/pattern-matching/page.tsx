import { headers } from 'next/headers';
import { Metadata } from 'next';
import PatternMatchingGame from './PatternMatchingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('pattern-matching', '/accuracy/pattern-matching', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = SEO_CONFIGS['pattern-matching'] || {
        title: 'Pattern Matching Accuracy Test',
        description: 'Test your visual accuracy by matching patterns with precision'
    };
    const content = getToolContent('pattern-matching', config.title);
    const structuredData = generateToolStructuredData(
        'pattern-matching',
        config.title,
        config.description,
        `/accuracy/pattern-matching`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/pattern-matching` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/pattern-matching`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <PatternMatchingGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Pattern Matching Accuracy Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves spatial and iconic short-term working memory.",
                                  "Enhances focus and observation speed.",
                                  "Trains ocular recall capabilities for visual inspections.",
                                  "Saves optimal calibration scores per difficulty level.",
                                  "Sharpens sensory retention under heavy time constraints.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (4-length, 2.2s exposure) to Professional (8-length, 0.6s exposure, 8 choices, 2 lives limit).",
                                  "Click 'Initialize Optical Deck' to begin the 10-round sequence.",
                                  "Observe the flashing pattern projected in the center console.",
                                  "When the pattern disappears, select the exact match from the option blocks.",
                                  "Avoid selecting incorrect patterns; exceeding mistake limits stops the calibration.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
