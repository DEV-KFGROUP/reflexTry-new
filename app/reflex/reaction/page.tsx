import { Metadata } from 'next';
import ReactionGame from './ReactionGame';
import { getToolMetadata, getToolSEOConfig } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { ToolContent } from '@/components/ToolContent';
import { getToolContent } from '@/lib/tool-content';

import { AEOAnswerBlock } from '@/components/AEOAnswerBlock';
import { AEO_DEFINITIONS } from '@/lib/aeo-definitions';

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getToolMetadata('reaction-time', '/reflex/reaction', locale);
}

import { headers } from 'next/headers';

export default async function Page() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    const config = getToolSEOConfig('reaction-time', locale);
    const content = getToolContent('reaction-time', config.title, locale);
    const reactionDef = AEO_DEFINITIONS['reaction-time'];

    const structuredData = generateToolStructuredData(
        'reaction-time',
        config.title,
        config.description,
        `/reflex/reaction`,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/reaction` },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/reaction`,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
                <ReactionGame />

                <div className="w-full max-w-5xl">
                    <AEOAnswerBlock 
                        question="What is a good reaction time in milliseconds?"
                        answer={reactionDef.quickAnswer}
                        keyPoints={["Compare the same device and difficulty", "Repeat trials rather than judging one result", "Browser timing includes screen and input delays"]}
                    />
                </div>
                
                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                                title="Reaction Time Test"
                                description={content.description}
                                howToUse={content.howToUse}
                                howToImprove={content.howToImprove}
                                faqs={content.faqs}
                                relatedTools={content.relatedTools}
                                benefits={[
                                  "Accurately calibrates visual-motor motor reactions down to the millisecond.",
                                  "Sharpens anticipation speeds and visual attention filtering under stress.",
                                  "Teaches players to filter out visual distractions (Faux Signals).",
                                  "Increases accuracy in professional modes requiring cursor target hitting.",
                                  "Provides historic average speed statistics per difficulty mode.",
                                ]}
                                howToPlay={[
                                  "Choose a difficulty level — Beginner (6000ms delay, no penalty) to Professional (random target coordinates, faux signals).",
                                  "Tap the console pad to trigger a wait sequence.",
                                  "Wait carefully. On Hard/Professional mode, ignore warning flashes of yellow or blue.",
                                  "On Professional mode, quickly tap the Green Target Dot wherever it appears on the screen.",
                                  "On other modes, tap anywhere on the screen immediately when it turns green.",
                                  "Avoid misfires (clicking too early) to prevent score penalties or reset flags.",
                                ]}
                              />
                </div>
            </div>
        </div>
    );
}
