import { headers } from 'next/headers';
import { Metadata } from 'next';
import GridGame from './GridGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('grid-selection', '/speed/grid', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('grid-selection', locale);
    const content = getToolContent('grid-selection', config.title, locale);
    const structuredData = generateToolStructuredData(
        'grid-selection',
        config.title,
        config.description,
        `/speed/grid`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/grid` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/grid`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <GridGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Grid Selection Speed Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Enhances visual search velocity and spatial motor reflexes.",
                                  "Sharpens hand-eye accuracy and cursor placement precision.",
                                  "Develops parallel tracking parameters by avoiding decoy mine cells.",
                                  "Improves target acquisition under changing grid sizes and scales.",
                                  "Retains highest wave-score statistics per difficulty level.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (3x3 grid, no mines) to Professional (6x6 grid, mines, multiplier blocks, shuffler cells).",
                                  "Click 'Initialize Telemetry Grid' to spawn the active cells wave.",
                                  "Click cyan target keycaps as fast as possible. Clear all targets to complete waves.",
                                  "Avoid Red mine cells and empty black nodes, which deduct score and strike remaining lives.",
                                  "Tap Yellow cells (2X) to activate double points score boosters for 5 seconds.",
                                  "Tap Purple cells (S) to scramble the grid, rearranging the remaining targets.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}