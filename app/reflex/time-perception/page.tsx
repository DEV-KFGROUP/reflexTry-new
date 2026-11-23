import { headers } from 'next/headers';
import { Metadata } from 'next';
import TimePerceptionGame from './TimePerceptionGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('time-perception', '/reflex/time-perception', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('time-perception', locale);
    const content = getToolContent("time-perception", config.title, locale);
    const structuredData = generateToolStructuredData(
        'time-perception',
        config.title,
        config.description,
        `/reflex/time-perception`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/time-perception` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/time-perception`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <TimePerceptionGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                        title="Time Perception"
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        howToPlay={[]}
                        benefits={[]}
                    />
                </div>
            </div>
        </div>
    );
}
