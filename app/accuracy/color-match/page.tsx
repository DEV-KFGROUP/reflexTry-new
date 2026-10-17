import { headers } from 'next/headers';
import { Metadata } from 'next';
import ColorMatchGame from './ColorMatchGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('color-match', '/accuracy/color-match', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('color-match', locale);
    const content = getToolContent('color-match', config.title, locale);
    const structuredData = generateToolStructuredData(
        'color-match',
        config.title,
        config.description,
        `/accuracy/color-match`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Accuracy Tools", url: "/accuracy" },
        { name: config.title, url: `/accuracy/color-match` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/accuracy/color-match`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ColorMatchGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Color Match Accuracy Calibration Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Trains chromatic color differentiation and mixing precision.",
                                  "Sharpens color retention by flashing targets in visual working memory.",
                                  "Improves selective visual focus under micro time constraints.",
                                  "Saves optimal average color score ratings per difficulty preset.",
                                  "Essential calibration for web developers, graphic artists, and design specialists.",
                                ]}
                                howToPlay={[
                                  "Select a level — Beginner (32-step snaps, values shown) to Professional (0.8s flash color, scanline distortion, 8s timer).",
                                  "Click 'Initialize Spectrum Deck' to launch the 10 calibration rounds.",
                                  "On Hard and Professional, memorize the target color quickly before it locks and fades grey.",
                                  "Adjust Red, Green, and Blue sliders to match the user mix to the target.",
                                  "Submit estimates; scoring low points strikes remaining lives on harder presets.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}