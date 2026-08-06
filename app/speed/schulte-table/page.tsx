import { Metadata } from 'next';
import SchulteTableGame from './SchulteTableGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from "@/components/ToolContent";
import { getToolContent } from "@/lib/tool-content";

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('schulte-table', '/speed/schulte-table');
}

export default function Page() {
    const config = SEO_CONFIGS['schulte-table'];
    const content = getToolContent("schulte-table", config.title);
    const structuredData = generateToolStructuredData(
        'schulte-table',
        config.title,
        config.description,
        `/speed/schulte-table`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/schulte-table` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/schulte-table`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <SchulteTableGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                        title="Schulte Table"
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
