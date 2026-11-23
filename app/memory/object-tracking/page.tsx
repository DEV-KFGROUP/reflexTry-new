import { headers } from 'next/headers';
import { Metadata } from 'next';
import ObjectTrackingGame from './ObjectTrackingGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('object-tracking', '/memory/object-tracking', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('object-tracking', locale);
    const content = getToolContent('object-tracking', config.title, locale);
    const structuredData = generateToolStructuredData(
        'object-tracking',
        config.title,
        config.description,
        `/memory/object-tracking`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/object-tracking` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/object-tracking`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ObjectTrackingGame />
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                        title="Multiple Object Tracking"
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        relatedTools={content.relatedTools}
                        benefits={[
                            "Enhances dynamic visual attention and peripheral vision.",
                            "Improves ability to focus on multiple moving targets simultaneously.",
                            "Builds cognitive endurance through sustained tracking periods.",
                            "Directly translates to real-world skills like driving or playing sports."
                        ]}
                        howToPlay={[
                            "Choose a difficulty level.",
                            "Dots will appear on the screen.",
                            "Memorize the dots that flash briefly.",
                            "Follow those dots with your eyes as they all start moving.",
                            "When they stop, click on all the dots you were tracking.",
                            "Progress to harder levels with more dots and faster speeds!"
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
