import { headers } from 'next/headers';
import { Metadata } from 'next';
import DataEntryClient from './DataEntryClient';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('data-entry', '/accuracy/data', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('data-entry', locale);
    const content = getToolContent('data-entry', config.title, locale);
    const structuredData = generateToolStructuredData(
        'data-entry',
        config.title,
        config.description,
        `/accuracy/data`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/data` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/data`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <DataEntryClient />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Data Entry Accuracy Calibration"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves keystroke mapping speed (WPM) and accuracy.",
                                  "Enhances finger muscle memory for brackets, semi-colons, and casing.",
                                  "Prepares developer typing skills for complex CLI pipelines and configs.",
                                  "Teaches sustained focus under time pressure constraints.",
                                  "Saves optimal session performance records per preset level.",
                                ]}
                                howToPlay={[
                                  "Select a level — Beginner (simple text) to Professional (cryptographic strings, max 4 errors, 20s timer).",
                                  "Click 'Initialize Keystroke Deck' to reveal the target sequence.",
                                  "Start typing immediately. Typographical errors will highlight red.",
                                  "Complete the entire sequence before the time runs out.",
                                  "Exceeding mistake thresholds halts calibration instantly.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
