import { Metadata } from 'next';
import PeripheralGame from './PeripheralGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('peripheral-vision', '/reflex/peripheral');
}

export default function Page() {
    const config = SEO_CONFIGS['peripheral-vision'];
    const content = getToolContent('peripheral-vision', config.title);
    const structuredData = generateToolStructuredData(
        'peripheral-vision',
        config.title,
        config.description,
        `/reflex/peripheral`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/peripheral` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/peripheral`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <PeripheralGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Peripheral Vision Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Expands visual functional field of view boundaries.",
                                  "Improves target acquisition snap mechanics on peripheral angles.",
                                  "Trains cognitive inhibition by ignoring lateral targets during red light alerts.",
                                  "Develops parallel sensory track systems (reading center digit while aiming side).",
                                  "Saves high score averages per difficulty stage.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (Close target range, 70px) to Professional (Wide target range, center odd/even digit filter).",
                                  "Click 'Initialize Gaze' to begin.",
                                  "Stare strictly at the central crosshair. Do not move your eyes.",
                                  "On Hard mode, only click if the center crosshair flashes RED (ignore orange flashes).",
                                  "On Professional mode, only click if the center crosshair displays an EVEN digit (ignore odd digits).",
                                  "Acquire and click as many lateral dots as possible before the timer runs out.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}