"use client";

import { motion } from "framer-motion";
import { 
    Brain, 
    Zap, 
    TrendingUp, 
    Activity, 
    Sparkles, 
    BookOpen, 
    Target, 
    Award, 
    ShieldCheck, 
    ExternalLink, 
    FileText, 
    AlertCircle 
} from "lucide-react";
import Link from "next/link";

export default function ScienceClient() {
    const STUDIES = [
        {
            title: "Advanced Cognitive Training for Independent and Vital Elderly (ACTIVE)",
            authors: "Ball, K., Berch, D. B., Helmers, K. F., Jobe, J. B., Leveck, M. D., Marsiske, M., et al.",
            journal: "JAMA (Journal of the American Medical Association)",
            year: "2002 (10-Year Follow-up in 2014 by Rebok et al.)",
            sampleSize: "2,832 healthy older adults across 6 clinical centers",
            intervention: "10 sessions (60-75 min) of speed of processing, memory, or reasoning training",
            findings: "Speed-of-processing training produced significant, immediate improvements in visual processing speed that remained detectable at the 10-year mark compared to control groups.",
            limitations: "Domain-specific training primarily enhanced the targeted cognitive ability; broad general intelligence transfer was minimal without continuous engagement.",
            doi: "10.1001/jama.288.18.2271",
            pmid: "12425704",
        },
        {
            title: "Improving Fluid Intelligence with Training on Working Memory",
            authors: "Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J.",
            journal: "Proceedings of the National Academy of Sciences (PNAS)",
            year: "2008",
            sampleSize: "68 young adult participants across 4 training experiments",
            intervention: "Dual N-back visual and auditory working memory training over 8 to 19 days",
            findings: "Demonstrated dose-dependent performance gains on the dual N-back task, with evidence suggesting potential transfer to matrix reasoning tests.",
            limitations: "Replication studies have shown mixed far-transfer effect sizes; near-transfer (task-specific working memory capacity) is highly reproducible, while broad fluid intelligence transfer remains an active debate in cognitive psychology.",
            doi: "10.1073/pnas.0801268105",
            pmid: "18443292",
        },
        {
            title: "Action Video Game Modifies Visual Selective Attention",
            authors: "Green, C. S., & Bavelier, D.",
            journal: "Nature",
            year: "2003",
            sampleSize: "Experienced action game players vs. non-action players, plus longitudinal intervention cohort",
            intervention: "Action game training sessions measuring spatial distribution of visual attention and attentional blink",
            findings: "Action video game practice enhanced spatial resolution of vision, reduced attentional bottleneck durations, and expanded the functional field of view.",
            limitations: "Gains were most pronounced in fast-paced visual-motor spatial tasks; tasks requiring verbal or conceptual recall showed no direct transfer.",
            doi: "10.1038/nature01647",
            pmid: "12774121",
        },
        {
            title: "Effects of Motor Practice on Simple and Choice Reaction Time in Athletes",
            authors: "Spierer, D. K., Petersen, R. A., Duffy, K., Corcoran, B. M., & Minogue, S.",
            journal: "Journal of Strength and Conditioning Research",
            year: "2010",
            sampleSize: "Athletes across collegiate sports vs. non-athletes",
            intervention: "Multi-stimulus perceptual and motor reaction time testing under variable cognitive loads",
            findings: "Motor-specific practice significantly improved choice reaction latency and stimulus categorization speed, driven by faster visual search and optimized motor preparation.",
            limitations: "Biological sensory conduction (retina to visual cortex ~50-80ms) cannot be bypassed; improvements stem from shortened central processing and motor execution intervals.",
            doi: "10.1519/JSC.0b013e3181c7c50a",
            pmid: "20072054",
        }
    ];

    return (
        <div className="bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 min-h-screen text-slate-800 dark:text-slate-200">
            <div className="max-w-5xl mx-auto space-y-12">
                
                {/* ── Header ── */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-mono tracking-widest uppercase">
                        <BookOpen className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Cognitive Neuroscience &amp; Empirical Research
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white uppercase leading-none">
                        The Science of{" "}
                        <span
                            className="inline-block text-cyan-600"
                            style={{
                                background: "linear-gradient(110deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Reaction &amp; Cognition
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        A transparent, evidence-based review of neuroplasticity, sensory latency, working memory limits, and empirical cognitive training research.
                    </p>
                </motion.div>

                {/* ── Executive Framework: Measurement vs Practice vs Transfer ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div>
                        <h2 className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" />
                            Reflextry Scientific Framework
                        </h2>
                        <h3 className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                            Distinguishing Measurement, Practice, and Transfer
                        </h3>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        To maintain strict scientific integrity, Reflextry categorizes cognitive and motor performance into three distinct empirical layers:
                    </p>

                    <div className="grid md:grid-cols-3 gap-6 pt-2">
                        {/* Layer 1 */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono font-bold text-xs uppercase">
                                <Activity className="w-4 h-4" />
                                1. Measurement
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                Baseline Evaluation
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                What the test measures right now under standardized conditions (e.g., simple visual reaction time in ms, typing speed in WPM, or N-back accuracy).
                            </p>
                        </div>

                        {/* Layer 2 */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                            <div className="flex items-center gap-2 text-amber-500 font-mono font-bold text-xs uppercase">
                                <Zap className="w-4 h-4" />
                                2. Practice (Near Transfer)
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                Task-Specific Gains
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                Repeated practice builds motor familiarity, reduces decision friction, and optimizes stimulus detection. Near-transfer to closely related tasks is reliable.
                            </p>
                        </div>

                        {/* Layer 3 */}
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                            <div className="flex items-center gap-2 text-purple-500 font-mono font-bold text-xs uppercase">
                                <TrendingUp className="w-4 h-4" />
                                3. Transfer (Far Transfer)
                            </div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-base">
                                Real-World Limits
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                How much practice on a game improves unrelated daily skills. Current neuroscience shows mixed far-transfer; training is not a panacea for generalized intelligence.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* ── Neuroplasticity & Physiological Mechanics ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20">
                            <Brain className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                Biological Mechanisms of Motor &amp; Perceptual Adaptation
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Synaptic Efficiency, Myelination, &amp; Sensorimotor Pathways
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        <p>
                            When you perform repetitive high-speed perceptual-motor tasks, your nervous system undergoes specific structural and functional adaptations:
                        </p>

                        <div className="grid md:grid-cols-3 gap-4 my-6">
                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase">
                                    Activity-Dependent Myelination
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Oligodendrocytes in the central nervous system respond to sustained action potential firing by reinforcing myelin sheaths around high-traffic axons, optimizing conduction velocity.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase">
                                    Synaptic Potentiation (LTP)
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Frequent activation of specific neural circuits strengthens synaptic connections (Long-Term Potentiation), reducing synaptic transmission delays between perceptual input and motor output.
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                                <h4 className="font-mono font-bold text-slate-900 dark:text-white text-xs uppercase">
                                    Motor Program Chunking
                                </h4>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    The basal ganglia and cerebellum consolidate discrete micro-movements (such as typing key combinations or flicking to a target) into unified, automated motor programs.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* ── Verified Academic Studies & Citations ── */}
                <motion.section 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 md:p-8 shadow-sm space-y-6"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                Peer-Reviewed Clinical &amp; Cognitive Research
                            </h2>
                            <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
                                Key Empirical Literature, Sample Sizes, &amp; Methodological Limitations
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {STUDIES.map((study, idx) => (
                            <div 
                                key={idx}
                                className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3"
                            >
                                <div className="flex flex-wrap items-start justify-between gap-2">
                                    <h3 className="font-mono font-bold text-slate-900 dark:text-white text-base">
                                        {study.title}
                                    </h3>
                                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                        {study.year}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                    {study.authors} — <strong>{study.journal}</strong>
                                </p>

                                <div className="grid md:grid-cols-2 gap-3 text-xs pt-2">
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Participants &amp; Method:</strong>
                                        <p className="text-slate-600 dark:text-slate-400">{study.sampleSize}. Intervention: {study.intervention}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                                        <strong className="text-slate-900 dark:text-white block mb-1">Key Findings:</strong>
                                        <p className="text-slate-600 dark:text-slate-400">{study.findings}</p>
                                    </div>
                                </div>

                                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs space-y-1">
                                    <strong className="text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        Methodological Scope &amp; Limitations:
                                    </strong>
                                    <p className="text-slate-600 dark:text-slate-400">{study.limitations}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-1 text-slate-500">
                                    <span>DOI: <a href={`https://doi.org/${study.doi}`} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">{study.doi}</a></span>
                                    <span>PubMed: <a href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}`} target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">{study.pmid}</a></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.section>

                {/* ── Technical Methodology Link ── */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <Link 
                        href="/methodology"
                        className="inline-flex items-center gap-2 text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
                    >
                        ← Read Reflextry Testing Methodology &amp; Timing Formulas
                    </Link>
                    <Link 
                        href="/reflex/reaction"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-mono font-bold text-sm shadow-sm hover:opacity-90 transition-opacity"
                    >
                        <Zap className="w-4 h-4 text-amber-400" />
                        Test Reaction Time
                    </Link>
                </div>

            </div>
        </div>
    );
}
