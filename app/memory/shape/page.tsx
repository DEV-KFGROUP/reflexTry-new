import { headers } from 'next/headers';
import { Metadata } from 'next';
import ShapeMemoryPageClient from './ShapeMemoryPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('shape-memory', '/memory/shape', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('shape-memory', locale);
    const content = getToolContent('shape-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'shape-memory',
        config.title,
        config.description,
        `/memory/shape`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/shape` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/shape`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ShapeMemoryPageClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Shape Rush"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Enhances visual processing speed by identifying objects in cluttered layouts.",
                                  "Trains selective attention and rapid search patterns across 9 to 49 targets.",
                                  "Sharpens shape and icon discrimination accuracy under time pressure.",
                                  "Builds cognitive switching agility through dual-target clearing (Professional mode).",
                                  "Stores persistent scores to track spatial focus improvements over sessions.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (3×3 grid, 1 target shape) to Professional (7×7 grid, dual target shapes).",
                                  "Examine the target shape(s) displayed in the top HUD container.",
                                  "Locate and click every cell in the grid containing that target shape.",
                                  "Correct clicks clear the shape from the grid; wrong clicks deduct score & lives.",
                                  "Clearing all active targets generates a new board and adds a streak bonus.",
                                  "Find as many targets as you can before the stability countdown runs out!",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}