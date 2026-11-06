import { ContentSection, StepSection } from "./ToolContentBase";
import { safeJsonLdStringify } from "@/lib/structured-data";

interface ToolContentServerProps {
    title: string;
    description: string | ContentSection[];
    howToUse: string | StepSection[];
    howToImprove: string | ContentSection[];
    howToPlay: string[];
    benefits: string[];
    faqs: { question: string; answer: string }[];
}

/** JSON-LD only — visible article body lives in ToolContentBase (no hidden duplicate). */
export function ToolContentServer({
    title,
    howToUse = [],
    howToPlay = [],
    faqs = [],
}: ToolContentServerProps) {
    const faqSchema =
        faqs && faqs.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((faq) => ({
                      "@type": "Question",
                      name: faq.question,
                      acceptedAnswer: {
                          "@type": "Answer",
                          text: faq.answer,
                      },
                  })),
              }
            : null;

    const stepsList: string[] = [];
    if (Array.isArray(howToPlay) && howToPlay.length > 0) {
        stepsList.push(...howToPlay);
    } else if (Array.isArray(howToUse)) {
        howToUse.forEach((item) => {
            if (item.steps) stepsList.push(...item.steps);
            else if (item.description) stepsList.push(item.description);
        });
    }

    const howToSchema =
        stepsList.length > 0
            ? {
                  "@context": "https://schema.org",
                  "@type": "HowTo",
                  name: `How to Play and Master ${title}`,
                  description: `Step-by-step instructions to take the free online ${title} and benchmark your cognitive score.`,
                  step: stepsList.map((step, idx) => ({
                      "@type": "HowToStep",
                      position: idx + 1,
                      name: `Step ${idx + 1}`,
                      text: step,
                  })),
              }
            : null;

    return (
        <>
            {faqSchema ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(faqSchema) }}
                />
            ) : null}
            {howToSchema ? (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(howToSchema) }}
                />
            ) : null}
        </>
    );
}
