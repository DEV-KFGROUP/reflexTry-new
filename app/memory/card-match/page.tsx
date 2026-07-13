import { Metadata } from 'next';
import CardMatchGame from './CardMatchGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('card-match', '/memory/card-match');
}

export default function Page() {
    const config = SEO_CONFIGS['card-match'];
    const content = getToolContent('card-match', config.title);
    const structuredData = generateToolStructuredData(
        'card-match',
        config.title,
        config.description,
        `/memory/card-match`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Memory Tools", url: "/memory" },
        { name: config.title, url: `/memory/card-match` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/memory/card-match`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <CardMatchGame />
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Card Match Memory Game"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Enhances visual and spatial memory retention under constraints.",
                                  "Improves pattern recognition across 6 to 36 flippable targets.",
                                  "Trains rapid cognitive filtering (matching both emojis AND border colors).",
                                  "Increases short-term focus through positive and negative time incentives.",
                                  "Stores historical progress metrics across 5 difficulty levels.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty level — Beginner (3×2 grid, 45s) to Professional (6×6 grid, border match criteria).",
                                  "Click a card to reveal its emoji and border color.",
                                  "Flip a second card to find the matching partner.",
                                  "On Professional mode, cards must match both the emoji AND card backing border color.",
                                  "Correct matches add time (+4s), while mismatched cards subtract time (-3s) on Pro mode.",
                                  "Clear all matching pairs from the grid before the time limit expires.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}