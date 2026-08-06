import { ContentSection, StepSection } from "./ToolContentBase";

interface ToolContentServerProps {
    title: string;
    description: string | ContentSection[];
    howToUse: string | StepSection[];
    howToImprove: string | ContentSection[];
    howToPlay: string[];
    benefits: string[];
    faqs: { question: string; answer: string }[];
}

export function ToolContentServer({
    title,
    description,
    howToUse = [],
    howToImprove = [],
    howToPlay = [],
    benefits = [],
    faqs = [],
}: ToolContentServerProps) {
    // Generate FAQPage structured data for rich search results (accordions) in Google
    const faqSchema = faqs && faqs.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer,
            },
        })),
    } : null;

    // Generate HowTo structured data for interactive game instructions
    const stepsList: string[] = [];
    if (Array.isArray(howToPlay) && howToPlay.length > 0) {
        stepsList.push(...howToPlay);
    } else if (Array.isArray(howToUse)) {
        howToUse.forEach((item) => {
            if (item.steps) stepsList.push(...item.steps);
            else if (item.description) stepsList.push(item.description);
        });
    }

    const howToSchema = stepsList.length > 0 ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to Play and Master ${title}`,
        "description": `Step-by-step instructions to take the free online ${title} and benchmark your cognitive score.`,
        "step": stepsList.map((step, idx) => ({
            "@type": "HowToStep",
            "position": idx + 1,
            "name": `Step ${idx + 1}`,
            "text": step,
        })),
    } : null;

    return (
        <>
            {/* Direct JSON-LD Injection for Googlebot Rich Snippets */}
            {faqSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
                />
            )}
            {howToSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
                />
            )}

            {/* Semantic Raw HTML Article for Search Engine Crawlers */}
            <article className="sr-only" aria-hidden="false">
                <h1>{title} - Free Online Benchmark & Cognitive Training Tool</h1>
                
                <section>
                    <h2>What is the {title} & How Does It Measure Performance?</h2>
                    {typeof description === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: description }} />
                    ) : (
                        description?.map((section, idx) => (
                            <div key={idx}>
                                <h3>{section.title}</h3>
                                <p>{section.content || section.description}</p>
                            </div>
                        ))
                    )}
                </section>

                <section>
                    <h2>Step-by-Step Instructions & How to Play</h2>
                    <ul>
                        {howToPlay?.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ul>
                    {typeof howToUse === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: howToUse }} />
                    ) : (
                        howToUse?.map((step, idx) => (
                            <div key={idx}>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                                {step.steps && (
                                    <ul>
                                        {step.steps.map((sub, sIdx) => (
                                            <li key={sIdx}>{sub}</li>
                                        ))}
                                    </ul>
                                )}
                                {step.subSteps && (
                                    <ul>
                                        {step.subSteps.map((sub, sIdx) => (
                                            <li key={sIdx}>{sub}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))
                    )}
                </section>

                {benefits && benefits.length > 0 ? (
                    <section>
                        <h2>What This Test Trains</h2>
                        <ul>
                            {benefits.map((benefit, idx) => (
                                <li key={idx}>{benefit}</li>
                            ))}
                        </ul>
                    </section>
                ) : null}

                <section>
                    <h2>Tips to Improve Your Score</h2>
                    {typeof howToImprove === 'string' ? (
                        <div dangerouslySetInnerHTML={{ __html: howToImprove }} />
                    ) : (
                        howToImprove?.map((tip, idx) => (
                            <div key={idx}>
                                <h3>{tip.title}</h3>
                                <p>{tip.description || (tip as any).content}</p>
                            </div>
                        ))
                    )}
                </section>

                <section>
                    <h2>Frequently Asked Questions About {title}</h2>
                    {faqs?.map((faq, idx) => (
                        <div key={idx}>
                            <h3>{faq.question}</h3>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </section>
            </article>
        </>
    );
}
