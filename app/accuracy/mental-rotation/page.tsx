import { Metadata } from 'next';
import MentalRotationGame from './MentalRotationGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('mental-rotation', '/accuracy/mental-rotation');
}

export default function Page() {
    const config = SEO_CONFIGS['mental-rotation'];
    const content = getToolContent('mental-rotation', config.title);
    const structuredData = generateToolStructuredData(
        'mental-rotation',
        config.title,
        config.description,
        `/accuracy/mental-rotation`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/mental-rotation` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/mental-rotation`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <MentalRotationGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                        title="Mental Rotation"
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        relatedTools={content.relatedTools}
                        benefits={[
                            "Measures spatial working memory and 3D visualization.",
                            "Activates the parietal lobe, enhancing spatial reasoning.",
                            "Mimics classic cognitive psychology mental rotation tasks.",
                            "Improves ability to visualize objects from different perspectives."
                        ]}
                        howToPlay={[
                            "Two 3D block structures will be shown on the screen.",
                            "The second structure is either the exact same object rotated, or a mirrored (different) object.",
                            "Mentally rotate the objects to see if they align perfectly.",
                            "Select 'Same' if they match.",
                            "Select 'Different' if they are mirrored versions."
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
