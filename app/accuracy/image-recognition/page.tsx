import { Metadata } from 'next';
import ImageRecognitionClient from './ImageRecognitionClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('image-recognition', '/accuracy/image-recognition');
}

export default function Page() {
    const config = SEO_CONFIGS['image-recognition'];
    const content = getToolContent('image-recognition', config.title);
    const structuredData = generateToolStructuredData(
        'image-recognition',
        config.title,
        config.description,
        `/accuracy/image-recognition`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/image-recognition` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/image-recognition`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ImageRecognitionClient />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Image Recognition Accuracy Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves fast visual sorting and pattern recognition speed.",
                                  "Trains OCR and shape matching skills under severe distortions.",
                                  "Develops choice decision speed in multiple distractor grids.",
                                  "Saves historical recognition accuracy % records per level.",
                                  "Fun and visually challenging cognitive training.",
                                ]}
                                howToPlay={[
                                  "Choose your difficulty — Beginner (clear image, typing) to Professional (grayscale blur, 4 choice options, 4s timer).",
                                  "Click 'Initialize Scanner Deck' to deploy the visual trials.",
                                  "Examine the distorted emoji in the center. Identify what shape it matches.",
                                  "Type the answer in the text field or tap the aligned choice button (1-4 number keys).",
                                  "Exceeding mistake strikes or running out of round timer deducts lives.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}