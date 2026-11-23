import { headers } from 'next/headers';
import { Metadata } from 'next';
import GoNoGoGame from './GoNoGoGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('go-no-go', '/reflex/go-no-go', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('go-no-go', locale);
    const content = getToolContent("go-no-go", config.title, locale);
    const structuredData = generateToolStructuredData(
        'go-no-go',
        config.title,
        config.description,
        `/reflex/go-no-go`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/go-no-go` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/go-no-go`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <GoNoGoGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                        title="Go / No-Go"
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
