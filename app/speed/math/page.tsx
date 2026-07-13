import { Metadata } from 'next';
import MathGame from './MathGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('speed-math', '/speed/math');
}

export default function Page() {
    const config = SEO_CONFIGS['speed-math'];
    const content = getToolContent('speed-math', config.title);
    const structuredData = generateToolStructuredData(
        'speed-math',
        config.title,
        config.description,
        `/speed/math`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/math` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/math`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <MathGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
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