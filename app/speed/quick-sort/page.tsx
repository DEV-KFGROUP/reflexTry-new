import { Metadata } from 'next';
import QuickSortGame from './QuickSortGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('quick-sort', '/speed/quick-sort');
}

export default function Page() {
    const config = SEO_CONFIGS['quick-sort'];
    const content = getToolContent('quick-sort', config.title);
    const structuredData = generateToolStructuredData(
        'quick-sort',
        config.title,
        config.description,
        `/speed/quick-sort`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/quick-sort` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/quick-sort`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <QuickSortGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Quick Sort Speed Game"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Improves cognitive categorization speeds and sorting reflexes.",
                                  "Sharpens decision choice mapping accuracy under high time pressure.",
                                  "Forces scanning adaptation by shuffling bin buttons on hits.",
                                  "Tests visual classification accuracy through mistake strike caps.",
                                  "Retains highest sorting records across all challenge difficulties.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty — Beginner (2 categories, static) to Professional (6 categories, shuffles, bomb distractors).",
                                  "Click 'Initialize Sorter Deck' to begin the countdown timer.",
                                  "Locate the active emoji node displayed inside the LCD display screen.",
                                  "Sort it into the correct category button. Correct clicks spawn the subsequent node.",
                                  "On Hard and Professional, watch the choice keys rearrange positions after correct sorting hits.",
                                  "On Professional, check for distractor trash items and click 'DISCARD' to discard them.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}