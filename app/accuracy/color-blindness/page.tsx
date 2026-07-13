import { Metadata } from 'next';
import ColorBlindnessGame from './ColorBlindnessGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('color-blindness', '/accuracy/color-blindness');
}

export default function Page() {
    const config = SEO_CONFIGS['color-blindness'];
    const content = getToolContent('color-blindness', config.title);
    const structuredData = generateToolStructuredData(
        'color-blindness',
        config.title,
        config.description,
        `/accuracy/color-blindness`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/color-blindness` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/color-blindness`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ColorBlindnessGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                        title="Color Blindness Test"
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        relatedTools={content.relatedTools}
                        benefits={[
                            "Quickly test for common red-green color vision deficiencies.",
                            "Identify potential issues with color perception.",
                            "Engaging interactive format mimicking clinical Ishihara plates.",
                            "Challenge your visual acuity as the color differences become narrower."
                        ]}
                        howToPlay={[
                            "Select your difficulty to begin.",
                            "A large circle composed of smaller colored dots will appear.",
                            "Look for a hidden number formed by differently colored dots.",
                            "Use the on-screen keypad to enter the number you see.",
                            "If you see nothing, click 'Skip'."
                        ]}
                    />
                </div>
            </div>
        </div>
    );
}
