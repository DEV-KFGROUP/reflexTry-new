import { Metadata } from 'next';
import ObjectTrackingGame from './ObjectTrackingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('object-tracking', '/memory/object-tracking');
}

export default function Page() {
    const config = SEO_CONFIGS['object-tracking'];
    const content = getToolContent('object-tracking', config.title);
    const structuredData = generateToolStructuredData(
        'object-tracking',
        config.title,
        config.description,
        `/memory/object-tracking`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/object-tracking` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/object-tracking`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ObjectTrackingGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
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
