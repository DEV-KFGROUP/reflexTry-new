import Link from "next/link";
import { HOME_FAQS } from "@/lib/site-faqs";
import { TOOL_COUNT } from "@/config/tool-mapping";

export function HomeSEOContent() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="space-y-10 bg-white border border-slate-200 p-6 sm:p-8 rounded-3xl text-slate-700 leading-relaxed">
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900">What is Reflextry?</h2>
                    <p className="aeo-answer">Reflextry offers {TOOL_COUNT} free browser games for reaction time, memory, typing, clicking, accuracy, and aim practice. Each test records a score for that task so you can compare your own sessions.</p>
                    <p>A browser score includes the effects of your screen, input device, browser, and test settings. It is not a direct measurement of biological latency or a clinical assessment.</p>
                </div>
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900">Make your practice sessions comparable</h2>
                    <ol className="list-decimal pl-5 space-y-2">
                        <li>Choose the same test, difficulty, and input device each time.</li>
                        <li>Read the scoring rules before starting. Milliseconds, accuracy, span length, and words per minute describe different tasks.</li>
                        <li>Repeat several trials and compare trends rather than one unusually good score.</li>
                        <li>Take a break if you feel tired or uncomfortable.</li>
                    </ol>
                    <p>Read our <Link href="/methodology" className="text-blue-800 underline">testing methodology</Link> for scoring formulas and hardware limitations. Your <Link href="/statistics" className="text-blue-800 underline">personal statistics</Link> show your own recorded progress, not population norms.</p>
                </div>
                <div className="space-y-3 max-w-3xl">
                    <h2 className="text-2xl font-bold text-slate-900">What a better score means</h2>
                    <p>Practice gains are strongest on trained tasks; broad benefits in everyday cognition are less established. See <a className="text-blue-800 underline" href="https://www.psychologicalscience.org/journals/pspi/1529100616661983/">Simons and colleagues’ review of brain-training research</a>. This research does not validate Reflextry as a medical or intelligence test.</p>
                    <p>We do not publish a verified global benchmark dataset. Use your own repeated results as a practice baseline. For background and references, visit <Link href="/science" className="text-blue-800 underline">the science page</Link>.</p>
                </div>
                <div className="space-y-5">
                    <h2 className="text-2xl font-bold text-slate-900">Frequently asked questions</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {HOME_FAQS.map(({ question, answer }) => (
                            <div key={question} className="space-y-2">
                                <h3 className="text-lg font-semibold text-slate-900">{question}</h3>
                                <p className="aeo-answer">{answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
