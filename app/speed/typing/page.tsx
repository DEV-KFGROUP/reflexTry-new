import { headers } from 'next/headers';
import { Metadata } from 'next';
import TypingGame from './TypingGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

import { AEOAnswerBlock } from '@/components/AEOAnswerBlock';
import { AEO_DEFINITIONS } from '@/lib/aeo-definitions';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('typing-speed', '/speed/typing', locale);
}

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('typing-speed', locale);
    const content = getToolContent('typing-speed', config.title, locale);
    const typingDef = AEO_DEFINITIONS['typing-wpm'];

    const structuredData = generateToolStructuredData(
        'typing-speed',
        config.title,
        config.description,
        `/speed/typing`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/typing` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/typing`
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <TypingGame />

                <div className="w-full max-w-5xl">
                    <AEOAnswerBlock 
                        question="What is a good typing speed in Words Per Minute (WPM)?"
                        answer={typingDef.quickAnswer}
                        keyPoints={["Read speed together with accuracy", "Compare passages of similar difficulty", "Keep the test duration and keyboard consistent"]}
                    />
                </div>
                
                <div className="w-full max-w-5xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-3xl p-6 md:p-8 relative z-10 mt-8">
                    <ToolContent
                                title="Typing Speed Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Calculates precise words per minute (WPM) speed indexes.",
                                  "Improves motor response accuracy by identifying mistyped key strikes.",
                                  "Tests technical punctuation symbol mapping (Coding snippet mode).",
                                  "Isolates pure mechanical key reflex speed (Cyber cipher chaos).",
                                  "Retains highest high-score records across all challenge difficulties.",
                                ]}
                                howToPlay={[
                                  "Select a difficulty level — Beginner (Simple words, lowercase) to Professional (Cipher chaos text).",
                                  "Click 'Initialize Keyboard Link' to begin typing.",
                                  "Keystrokes will be evaluated immediately. Correct inputs display dark, errors light up red.",
                                  "Under Normal/Hard/Professional modes, watch your remaining Error Strikes threshold.",
                                  "Complete the entire sequence before the timer expires to log your benchmark.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}