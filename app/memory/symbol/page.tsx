import { headers } from 'next/headers';
import { Metadata } from 'next';
import SymbolMemoryPageClient from './SymbolMemoryPageClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('symbol-memory', '/memory/symbol', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('symbol-memory', locale);
    const content = getToolContent('symbol-memory', config.title, locale);
    const structuredData = generateToolStructuredData(
        'symbol-memory',
        config.title,
        config.description,
        `/memory/symbol`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/symbol` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/symbol`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SymbolMemoryPageClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Symbol Pairs"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves spatial memory capacity by mapping symbol locations.",
                                  "Enhances focus and attention span across board layouts up to 30 elements.",
                                  "Teaches efficient memory chunking and organization strategies.",
                                  "Adds mind-bending board shuffles to test extreme recall flexibility.",
                                  "Tracks top speed and lowest move records dynamically per mode.",
                                ]}
                                howToPlay={[
                                  "Pick a difficulty — Beginner (3×4 grid, hints allowed) to Professional (6×5 grid, shuffle distortion).",
                                  "Click cards to flip and reveal their underlying symbol.",
                                  "Flip two cards; if the symbols are identical, they stay face-up.",
                                  "If they match, you've found a pair. If not, they flip back.",
                                  "On Professional mode, unmatched cards will shuffle locations every 4 misses!",
                                  "Clear the entire board before running out of moves or timer constraints.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}