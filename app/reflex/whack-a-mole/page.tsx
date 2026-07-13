import { Metadata } from 'next';
import WhackAMoleGame from './WhackAMoleGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('whack-a-mole', '/reflex/whack-a-mole');
}

export default function Page() {
    const config = SEO_CONFIGS['whack-a-mole'];
    const content = getToolContent('whack-a-mole', config.title);
    const structuredData = generateToolStructuredData(
        'whack-a-mole',
        config.title,
        config.description,
        `/reflex/whack-a-mole`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/whack-a-mole` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/whack-a-mole`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <WhackAMoleGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Whack-a-Mole Game"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves spatial coordination and peripheral scanning speed.",
                                  "Sharpens hand-eye motor reflex timing under high speed spawning ratios.",
                                  "Trains cognitive inhibition checks by avoiding red decoy bomb targets.",
                                  "Develops parallel focus parameters to spot special bonus targets.",
                                  "Stores highest scoring record benchmarks per difficulty level.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (2x2 grid, 3 lives) to Professional (5x5 grid, bomb decoys, slomo moles).",
                                  "Click 'Initialize Gallery' to start the 30-second challenge.",
                                  "Watch the holes and tap/click emerging color dots as quickly as possible.",
                                  "Avoid Red bomb moles (-300 points, -1 life penalty).",
                                  "Whack Yellow golden moles for a massive +300 points bonus.",
                                  "Whack Green moles to temporarily slow down spawning rates and mole lifespans for 3 seconds.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}