import React from "react";
import { SchemaInjector } from "@/components/SchemaInjector";
import {
    generateToolStructuredData,
    generateBreadcrumbStructuredData,
    generateWebPageSchema,
} from "@/lib/structured-data";
import { getToolSEOConfig } from "@/lib/seo-utils";
import { getToolContent } from "@/lib/tool-content";
import { ToolContent } from "@/components/ToolContent";
import { AEOAnswerBlock } from "@/components/AEOAnswerBlock";
import { NEW_PACKS_AEO, NEW_PACKS_EXTRAS } from "@/lib/new-packs-content";

interface NewToolPageShellProps {
    toolId: string;
    path: string;
    categoryName: string;
    categoryHref: string;
    locale: string;
    children: React.ReactNode;
}

export function NewToolPageShell({
    toolId,
    path,
    categoryName,
    categoryHref,
    locale,
    children,
}: NewToolPageShellProps) {
    const config = getToolSEOConfig(toolId, locale);
    const content = getToolContent(toolId, config.title, locale);
    const aeo = NEW_PACKS_AEO[toolId];
    const extras = NEW_PACKS_EXTRAS[toolId];

    const structuredData = generateToolStructuredData(
        toolId,
        config.title,
        config.description,
        path,
        locale
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData(
        [
            { name: "Home", url: "/" },
            { name: categoryName, url: categoryHref },
            { name: config.title, url: path },
        ],
        locale
    );

    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        path,
        locale
    );

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-[#161614] pt-6 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8 flex flex-col items-center">
                <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />

                <div className="w-full">{children}</div>

                {aeo && (
                    <div className="w-full max-w-5xl">
                        <AEOAnswerBlock
                            question={aeo.question}
                            answer={aeo.answer}
                            keyPoints={aeo.keyPoints}
                        />
                    </div>
                )}

                <div className="w-full max-w-5xl relative z-10">
                    <ToolContent
                        title={config.title}
                        description={content.description}
                        howToUse={content.howToUse}
                        howToImprove={content.howToImprove}
                        faqs={content.faqs}
                        relatedTools={content.relatedTools}
                        benefits={extras?.benefits ?? []}
                        howToPlay={extras?.howToPlay ?? []}
                    />
                </div>
            </div>
        </div>
    );
}
