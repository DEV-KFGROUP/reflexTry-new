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
                
                <div className="w-full max-w-5xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl p-4 md:p-5 flex items-start gap-3 text-amber-900 dark:text-amber-200 text-xs md:text-sm leading-relaxed">
                    <span className="font-bold text-base flex-shrink-0">⚠️</span>
                    <div>
                        <strong>Medical &amp; Screening Notice:</strong> This online color vision test is designed strictly for educational demonstration and recreational screening. Digital computer monitors vary widely in color calibration, gamma curves, and brightness. This test does <em>not</em> constitute a medical diagnosis. If you suspect you have a color vision deficiency, consult a licensed optometrist or ophthalmologist for clinical Ishihara plate testing.
                    </div>
                </div>

                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-2">
                    <ToolContent
                        title="Color Blindness Test"
                        description="An interactive visual screening tool inspired by classic pseudoisochromatic Ishihara plates. Test your ability to perceive hidden numbers across varying red-green color contrasts."
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
