"use client";

import Link from "next/link";
import { TOOL_COUNT } from "@/config/tool-mapping";
import { useTranslation } from "@/lib/i18n/context";

export function HomeSEOContent() {
    const { t, getLocalizedHref } = useTranslation();

    const faqs = [
        {
            question: t("homeContent.faq1Q", "Does brain training actually work?"),
            answer: t("homeContent.faq1A", "Practice can improve performance on the task you train. A better game score does not establish improved intelligence, safer driving, or prevention of cognitive decline. Reflextry tests are practice tools, not clinical assessments.")
        },
        {
            question: t("homeContent.faq2Q", "How often should I practice?"),
            answer: t("homeContent.faq2A", "Start with a short session that fits your schedule and stop when tired or uncomfortable. Compare the same test and difficulty on the same device. There is no validated Reflextry training dose or guaranteed improvement timeline.")
        },
        {
            question: t("homeContent.faq3Q", "Can I use Reflextry for an esports warmup?"),
            answer: t("homeContent.faq3A", "You can use the aim, tracking, and reaction games for a browser-based warmup. Their scores measure performance in these exercises, not your rank or likely performance in another game.")
        },
        {
            question: t("homeContent.faq4Q", "Is Reflextry free?"),
            answer: t("homeContent.faq4A", "The tests are free to play in your browser. You can start a test without creating an account.")
        }
    ];

    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="space-y-10 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-white/10 p-6 sm:p-8 rounded-3xl text-slate-700 dark:text-slate-300 leading-relaxed">
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t("homeContent.whatIsReflextryTitle", "What is Reflextry?")}
                    </h2>
                    <p className="aeo-answer">
                        {t(
                            "homeContent.whatIsReflextryDesc1",
                            `Reflextry offers ${TOOL_COUNT} free browser games for reaction time, memory, typing, clicking, accuracy, and aim practice. Each test records a score for that task so you can compare your own sessions.`
                        )}
                    </p>
                    <p>
                        {t(
                            "homeContent.whatIsReflextryDesc2",
                            "A browser score includes the effects of your screen, input device, browser, and test settings. It is not a direct measurement of biological latency or a clinical assessment."
                        )}
                    </p>
                </div>
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t("homeContent.comparableSessionsTitle", "Make your practice sessions comparable")}
                    </h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>{t("homeContent.comparableStep1", "Choose the same test, difficulty, and input device each time.")}</li>
                        <li>{t("homeContent.comparableStep2", "Read the scoring rules before starting. Milliseconds, accuracy, span length, and words per minute describe different tasks.")}</li>
                        <li>{t("homeContent.comparableStep3", "Repeat several trials and compare trends rather than one unusually good score.")}</li>
                        <li>{t("homeContent.comparableStep4", "Take a break if you feel tired or uncomfortable.")}</li>
                    </ol>
                    <p>
                        {t("homeContent.comparableFooterPre", "Read our ")}
                        <Link href={getLocalizedHref("/methodology")} className="text-blue-600 dark:text-blue-400 underline">
                            {t("homeContent.testingMethodology", "testing methodology")}
                        </Link>
                        {t("homeContent.comparableFooterMid", " for scoring formulas and hardware limitations. Your ")}
                        <Link href={getLocalizedHref("/statistics")} className="text-blue-600 dark:text-blue-400 underline">
                            {t("homeContent.personalStatistics", "personal statistics")}
                        </Link>
                        {t("homeContent.comparableFooterPost", " show your own recorded progress, not population norms.")}
                    </p>
                </div>
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t("homeContent.betterScoreTitle", "What a better score means")}
                    </h2>
                    <p>
                        {t("homeContent.betterScoreDesc1Pre", "Practice gains are strongest on trained tasks; broad benefits in everyday cognition are less established. See ")}
                        <a className="text-blue-600 dark:text-blue-400 underline" href="https://www.psychologicalscience.org/journals/pspi/1529100616661983/">
                            {t("homeContent.simonsReview", "Simons and colleagues’ review of brain-training research")}
                        </a>
                        {t("homeContent.betterScoreDesc1Post", ". This research does not validate Reflextry as a medical or intelligence test.")}
                    </p>
                    <p>
                        {t("homeContent.betterScoreDesc2Pre", "We do not publish a verified global benchmark dataset. Use your own repeated results as a practice baseline. For background and references, visit ")}
                        <Link href={getLocalizedHref("/science")} className="text-blue-600 dark:text-blue-400 underline">
                            {t("homeContent.theSciencePage", "the science page")}
                        </Link>
                        {t("homeContent.betterScoreDesc2Post", ".")}
                    </p>
                </div>
                <div className="space-y-5">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        {t("homeContent.faqTitle", "Frequently asked questions")}
                    </h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {faqs.map(({ question, answer }, index) => (
                            <div key={index} className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{question}</h3>
                                <p className="aeo-answer">{answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
