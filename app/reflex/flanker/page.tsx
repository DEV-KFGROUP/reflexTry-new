import { headers } from 'next/headers';
import { Metadata } from 'next';
import FlankerGame from './FlankerGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('flanker', '/reflex/flanker', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('flanker', locale);
    const content = getToolContent("flanker", config.title, locale);
    const structuredData = generateToolStructuredData(
        'flanker',
        config.title,
        config.description,
        `/reflex/flanker`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/flanker` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/flanker`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <FlankerGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                        title="Flanker Task"
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
