"use client";

import Link from "next/link";
import { TOOL_COUNT } from "@/config/tool-mapping";
import { useTranslation } from "@/lib/i18n/context";

export function HomeSEOContent() {
    const { t, getLocalizedHref } = useTranslation();

    const faqs = [
        {
            question: t("homeContent.faq1Q", "Does brain training actually work?"),
            answer: t(
                "homeContent.faq1A",
                "Practice can improve performance on the task you train. A better game score does not establish improved intelligence, safer driving, or prevention of cognitive decline. Reflextry tests are practice tools, not clinical assessments."
            ),
        },
        {
            question: t("homeContent.faq2Q", "How often should I practice?"),
            answer: t(
                "homeContent.faq2A",
                "Start with a short session that fits your schedule and stop when tired or uncomfortable. Compare the same test and difficulty on the same device. There is no validated Reflextry training dose or guaranteed improvement timeline."
            ),
        },
        {
            question: t("homeContent.faq3Q", "Can I use Reflextry for an esports warmup?"),
            answer: t(
                "homeContent.faq3A",
                "You can use the aim, tracking, and reaction games for a browser-based warmup. Their scores measure performance in these exercises, not your rank or likely performance in another game."
            ),
        },
        {
            question: t("homeContent.faq4Q", "Is Reflextry free?"),
            answer: t(
                "homeContent.faq4A",
                "The tests are free to play in your browser. You can start a test without creating an account."
            ),
        },
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="border-t border-[#D8D4C9] pt-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left Editorial Notes */}
                <div className="lg:col-span-7 space-y-10 max-w-2xl">
                    <div className="space-y-3">
                        <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                            {t("homeContent.whatIsReflextryTitle", "What is Reflextry?")}
                        </h2>
                        <p className="aeo-answer text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            {t(
                                "homeContent.whatIsReflextryDesc1",
                                `Reflextry offers ${TOOL_COUNT} free browser tools for reaction time, memory, typing, clicking, accuracy, logic puzzles, and aim practice. Each tool records a straightforward score so you can compare your own sessions over time.`
                            )}
                        </p>
                        <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            {t(
                                "homeContent.whatIsReflextryDesc2",
                                "A browser score includes the effects of your screen, input device, browser, and test settings. It is not a direct measurement of biological latency or a clinical assessment."
                            )}
                        </p>
                    </div>

                    <div className="space-y-3 pt-8 border-t border-[#E6E3DB]">
                        <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                            {t("homeContent.comparableSessionsTitle", "Make your practice sessions comparable")}
                        </h2>
                        <ol className="list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            <li>{t("homeContent.comparableStep1", "Choose the same test, difficulty, and input device each time.")}</li>
                            <li>{t("homeContent.comparableStep2", "Read the scoring rules before starting. Milliseconds, accuracy, span length, and words per minute describe different tasks.")}</li>
                            <li>{t("homeContent.comparableStep3", "Repeat several trials and compare trends rather than one unusually good score.")}</li>
                            <li>{t("homeContent.comparableStep4", "Take a break if you feel tired or uncomfortable.")}</li>
                        </ol>
                        <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed pt-1">
                            {t("homeContent.comparableFooterPre", "Read our ")}
                            <Link href={getLocalizedHref("/methodology")} className="text-[#1E40AF] hover:underline font-medium underline-offset-4">
                                {t("homeContent.testingMethodology", "testing methodology")}
                            </Link>
                            {t("homeContent.comparableFooterMid", " for scoring formulas and hardware limitations. Your ")}
                            <Link href={getLocalizedHref("/statistics")} className="text-[#1E40AF] hover:underline font-medium underline-offset-4">
                                {t("homeContent.personalStatistics", "personal statistics")}
                            </Link>
                            {t("homeContent.comparableFooterPost", " show your own recorded progress, not population norms.")}
                        </p>
                    </div>

                    <div className="space-y-3 pt-8 border-t border-[#E6E3DB]">
                        <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight">
                            {t("homeContent.betterScoreTitle", "What a better score means")}
                        </h2>
                        <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            {t("homeContent.betterScoreDesc1Pre", "Practice gains are strongest on trained tasks; broad benefits in everyday cognition are less established. See ")}
                            <a
                                className="text-[#1E40AF] hover:underline font-medium underline-offset-4"
                                href="https://www.psychologicalscience.org/journals/pspi/1529100616661983/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {t("homeContent.simonsReview", "Simons and colleagues’ review of brain-training research")}
                            </a>
                            {t("homeContent.betterScoreDesc1Post", ". This research does not validate Reflextry as a medical or intelligence test.")}
                        </p>
                        <p className="text-sm sm:text-[15px] text-[#57554E] leading-relaxed">
                            {t("homeContent.betterScoreDesc2Pre", "We do not publish a verified global benchmark dataset. Use your own repeated results as a practice baseline. For background and references, visit ")}
                            <Link href={getLocalizedHref("/science")} className="text-[#1E40AF] hover:underline font-medium underline-offset-4">
                                {t("homeContent.theSciencePage", "the science page")}
                            </Link>
                            {t("homeContent.betterScoreDesc2Post", ".")}
                        </p>
                    </div>
                </div>

                {/* Right Column: Clean Editorial FAQ */}
                <div className="lg:col-span-5 space-y-6 lg:border-l lg:border-[#E6E3DB] lg:pl-10">
                    <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#78756C]">
                            Common Questions
                        </p>
                        <h2 className="font-serif text-2xl font-medium text-[#161614] tracking-tight mt-1">
                            {t("homeContent.faqTitle", "Frequently asked questions")}
                        </h2>
                    </div>

                    <div className="divide-y divide-[#E6E3DB] border-t border-[#E6E3DB]">
                        {faqs.map(({ question, answer }, index) => (
                            <div key={index} className="py-5 space-y-1.5">
                                <h3 className="text-base font-semibold text-[#161614]">{question}</h3>
                                <p className="aeo-answer text-sm text-[#57554E] leading-relaxed">{answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
