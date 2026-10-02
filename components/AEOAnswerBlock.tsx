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
            className={`aeo-block my-8 p-6 rounded-2xl bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5 border border-blue-500/20 shadow-sm backdrop-blur-md ${className}`}
            itemScope 
            itemType="https://schema.org/Question"
            role="region"
            aria-label={`Answer: ${question}`}
            data-answer-format="direct-answer"
            data-speakable="true"
        >
            <div className="flex items-start gap-3 mb-3">
                <HelpCircle className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
                <h3 className="text-xl font-bold text-foreground tracking-tight" itemProp="name">
                    {question}
                </h3>
            </div>

            <div itemProp="acceptedAnswer" itemScope itemType="https://schema.org/Answer">
                <div className="pl-9 space-y-4">
                    <p className="aeo-answer text-base text-muted-foreground leading-relaxed" itemProp="text">
                        {answer}
                    </p>

                    {keyPoints && keyPoints.length > 0 && (
                        <ul className="space-y-2 mt-3">
                            {keyPoints.map((point, index) => (
                                <li key={index} className="flex items-center gap-2 text-sm text-foreground/90 font-medium">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="pt-2 text-xs text-muted-foreground flex items-center gap-1.5">
                        <span>Read:</span>
                        <a href={sourceUrl} className="font-semibold text-blue-800 underline">
                            {sourceName}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

