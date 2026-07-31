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
    // This component renders the educational content as standard static HTML.
    // It is visually hidden but accessible to crawlers and screen readers.
    // This ensures Google AdSense can read the full content regardless of the active JS tab.

    return (
        <article className="sr-only" aria-hidden="false">
            <h1>{title}</h1>
            
            <section>
                <h2>About</h2>
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
                <h2>How to Play</h2>
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

            <section>
                <h2>Benefits</h2>
                <ul>
                    {benefits?.map((benefit, idx) => (
                        <li key={idx}>{benefit}</li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>How to Improve</h2>
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
                <h2>Frequently Asked Questions</h2>
                {faqs?.map((faq, idx) => (
                    <div key={idx}>
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </section>
        </article>
    );
}
