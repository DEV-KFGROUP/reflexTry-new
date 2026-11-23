import { headers } from 'next/headers';
import { Metadata } from 'next';
import MathGame from './MathGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('speed-math', '/speed/math', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('speed-math', locale);
    const content = getToolContent('speed-math', config.title, locale);
    const structuredData = generateToolStructuredData(
        'speed-math',
        config.title,
        config.description,
        `/speed/math`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/math` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/math`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <MathGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Speed Math Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves mental arithmetic calculations and response latency.",
                                  "Sharpens short term logical memory tracking (Double operands).",
                                  "Increases neural connections by solving algebraic equations.",
                                  "Enforces extreme math precision through mistake life caps.",
                                  "Saves historical scoring averages per difficulty configuration.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (Add/Sub 1-10) to Professional (Algebra: Solve for X).",
                                  "Click 'Initialize Math Deck' to start the timer countdown.",
                                  "Read the arithmetic equation displayed inside the console screen.",
                                  "Mental math calculate the solution and type it into the input box.",
                                  "For Professional mode, calculate the value of x that makes the algebraic equation true.",
                                  "Hit Enter or submit before the timer run outs. Watch your remaining lives limit.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
