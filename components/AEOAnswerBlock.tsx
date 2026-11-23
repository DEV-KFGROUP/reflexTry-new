import React from "react";
import { HelpCircle, CheckCircle2 } from "lucide-react";

interface AEOAnswerBlockProps {
    question: string;
    answer: string;
    keyPoints?: string[];
    sourceName?: string;
    sourceUrl?: string;
    className?: string;
}

export function AEOAnswerBlock({
    question,
    answer,
    keyPoints,
    sourceName = "Testing methodology",
    sourceUrl = "/methodology",
    className = ""
}: AEOAnswerBlockProps) {

    return (
        <section
            className={`aeo-block my-6 p-6 sm:p-7 rounded-2xl bg-white border border-[#E6E3DB] ${className}`}
            itemScope
            itemType="https://schema.org/Question"
            role="region"
            aria-label={`Answer: ${question}`}
            data-answer-format="direct-answer"
            data-speakable="true"
        >
            <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-5 h-5 text-[#1E40AF] shrink-0 mt-1" aria-hidden="true" />
                <h3 className="font-serif text-xl font-medium text-[#161614] tracking-tight" itemProp="name">
                    {question}
                </h3>
            </div>

            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div className="pl-8 space-y-4">
                    <p className="aeo-answer text-sm sm:text-base text-[#57554E] leading-relaxed" itemProp="text">
                        {answer}
                    </p>

                    {keyPoints && keyPoints.length > 0 && (
                        <ul className="space-y-2 mt-3">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-[#3F3E39] font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-[#1E40AF] shrink-0 mt-0.5" aria-hidden="true" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="pt-2 text-xs text-[#78756C] flex items-center gap-1.5">
                        <span>Reference:</span>
                        <a href={sourceUrl} className="font-semibold text-[#1E40AF] underline underline-offset-2 hover:text-[#161614] transition-colors">
                            {sourceName}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
