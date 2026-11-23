"use client";

import {
  Brain,
  Zap,
  TrendingUp,
  Activity,
  BookOpen,
  ShieldCheck,
  FileText,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const STUDIES = [
  {
    title:
      "Advanced Cognitive Training for Independent and Vital Elderly (ACTIVE)",
    authors:
      "Ball, K., Berch, D. B., Helmers, K. F., Jobe, J. B., Leveck, M. D., Marsiske, M., et al.",
    journal: "JAMA (Journal of the American Medical Association)",
    year: "2002",
    sampleSize: "2,832 healthy older adults across 6 clinical centers",
    intervention:
      "10 sessions (60–75 min) of speed of processing, memory, or reasoning training",
    findings:
      "The randomized trial reported improvements in the trained cognitive abilities over its follow-up period.",
    limitations:
      "The intervention and study population differ from browser-based practice games; this study is not a clinical validation of Reflextry.",
    doi: "10.1001/jama.288.18.2271",
    pmid: "12425704",
  },
  {
    title: "Improving Fluid Intelligence with Training on Working Memory",
    authors: "Jaeggi, S. M., Buschkuehl, M., Jonides, J., & Perrig, W. J.",
    journal: "Proceedings of the National Academy of Sciences (PNAS)",
    year: "2008",
    sampleSize: "68 young adult participants across 4 training experiments",
    intervention:
      "Dual N-back visual and auditory working memory training over 8 to 19 days",
    findings:
      "Demonstrated dose-dependent performance gains on the dual N-back task, with evidence suggesting potential transfer to matrix reasoning tests.",
    limitations:
      "Replication studies have shown mixed far-transfer effect sizes; near-transfer (task-specific working memory capacity) is reproducible, while broad fluid intelligence transfer remains debated.",
    doi: "10.1073/pnas.0801268105",
    pmid: "18443283",
  },
  {
    title: "Action Video Game Modifies Visual Selective Attention",
    authors: "Green, C. S., & Bavelier, D.",
    journal: "Nature",
    year: "2003",
    sampleSize:
      "Experienced action game players vs. non-action players, plus longitudinal intervention cohort",
    intervention:
      "Action game training sessions measuring spatial distribution of visual attention and attentional blink",
    findings:
      "Action video game practice enhanced spatial resolution of vision, reduced attentional bottleneck durations, and expanded the functional field of view.",
    limitations:
      "Gains were most pronounced in fast-paced visual-motor spatial tasks; tasks requiring verbal or conceptual recall showed no direct transfer.",
    doi: "10.1038/nature01647",
    pmid: "12774121",
  },
  {
    title: "Do “Brain-Training” Programs Work?",
    authors: "Simons, D. J., Boot, W. R., Charness, N., et al.",
    journal: "Psychological Science in the Public Interest",
    year: "2016",
    sampleSize: "Comprehensive review of published cognitive-training research",
    intervention: "Evaluation of training studies and their research methods",
    findings:
      "Evidence is strongest for improvement on trained tasks; evidence for transfer to unrelated everyday cognition is limited.",
    limitations:
      "Study-design limitations make broad benefit claims difficult to establish. The review did not evaluate Reflextry.",
    doi: "10.1177/1529100616661983",
    pmid: "27697851",
  },
];

export default function ScienceClient() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Cognitive Neuroscience &amp; Empirical Research</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614] leading-tight">
            The Science of Reaction &amp; Cognition
          </h1>
          <p className="text-base sm:text-lg text-[#4A4842] max-w-2xl leading-relaxed">
            A transparent, evidence-based overview of neuroplasticity, sensory
            latency, working memory limits, and peer-reviewed cognitive training
            literature.
          </p>
        </header>

        {/* Measurement vs Practice vs Transfer */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#1E40AF]">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              <span>Scientific Framework</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161614]">
              Distinguishing Measurement, Practice, and Transfer
            </h2>
          </div>

          <p className="text-sm sm:text-base text-[#4A4842] leading-relaxed">
            To maintain scientific clarity, Reflextry separates cognitive and
            motor performance into three distinct empirical layers:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#1E40AF]">
                <Activity className="w-4 h-4" aria-hidden="true" />
                <span>1. Measurement</span>
              </div>
              <h3 className="font-semibold text-[#161614] text-base">
                Baseline Evaluation
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                What a test measures right now under standardized browser
                conditions—simple visual reaction time in ms, typing speed in
                WPM, or N-back accuracy.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#1E40AF]">
                <Zap className="w-4 h-4" aria-hidden="true" />
                <span>2. Practice</span>
              </div>
              <h3 className="font-semibold text-[#161614] text-base">
                Near-Transfer Gains
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Repeated practice builds motor familiarity, reduces decision
                friction, and sharpens stimulus detection on trained and closely
                related tasks.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#1E40AF]">
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                <span>3. Transfer</span>
              </div>
              <h3 className="font-semibold text-[#161614] text-base">
                Real-World Limits
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Current neuroscience shows mixed evidence for far-transfer to
                unrelated skills. Targeted drills sharpen specific circuits but
                are not a panacea for general intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Biological Mechanisms */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
              <Brain className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                Biological Mechanisms of Motor &amp; Perceptual Adaptation
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Synaptic efficiency, myelination, and sensorimotor pathways
              </p>
            </div>
          </div>

          <p className="text-sm text-[#4A4842] leading-relaxed">
            Performing repetitive high-speed perceptual-motor tasks engages
            several well-studied neural adaptation pathways:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Activity-Dependent Myelination
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Oligodendrocytes respond to sustained firing by reinforcing
                myelin sheaths around active axons, improving conduction timing.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Synaptic Potentiation (LTP)
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Frequent activation strengthens specific synaptic connections,
                reducing transmission friction between sensory detection and
                motor response.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Motor Program Chunking
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                The basal ganglia and cerebellum consolidate discrete
                micro-movements—such as key sequences or flick paths—into
                smoother automated programs.
              </p>
            </div>
          </div>
        </section>

        {/* Peer-Reviewed Citations */}
        <section className="space-y-5">
          <div className="flex items-start gap-3 pb-3 border-b border-[#E6E3DB]">
            <FileText
              className="w-5 h-5 text-[#1E40AF] mt-1 shrink-0"
              aria-hidden="true"
            />
            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161614]">
                Peer-Reviewed Clinical &amp; Cognitive Research
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Key empirical literature, sample sizes, and methodological
                limits
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {STUDIES.map((study) => (
              <article
                key={study.doi}
                className="bg-white border border-[#E6E3DB] rounded-2xl p-6 space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg font-semibold text-[#161614]">
                      {study.title}
                    </h3>
                    <p className="text-xs text-[#6A675F] italic">
                      {study.authors} —{" "}
                      <strong className="not-italic text-[#4A4842]">
                        {study.journal}
                      </strong>
                    </p>
                  </div>
                  <span className="text-xs font-mono font-semibold text-[#1E40AF] tabular-nums">
                    {study.year}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1">
                    <strong className="text-[#161614] block">
                      Participants &amp; Method
                    </strong>
                    <p className="text-[#4A4842] leading-relaxed">
                      {study.sampleSize}. Intervention: {study.intervention}
                    </p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1">
                    <strong className="text-[#161614] block">
                      Key Findings
                    </strong>
                    <p className="text-[#4A4842] leading-relaxed">
                      {study.findings}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E6E3DB] text-xs space-y-1">
                  <strong className="text-[#92400E] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Methodological Scope &amp; Limitations</span>
                  </strong>
                  <p className="text-[#4A4842] leading-relaxed">
                    {study.limitations}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[#6A675F]">
                  <span>
                    DOI:{" "}
                    <a
                      href={`https://doi.org/${study.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E40AF] hover:underline"
                    >
                      {study.doi}
                    </a>
                  </span>
                  <span>
                    PubMed:{" "}
                    <a
                      href={`https://pubmed.ncbi.nlm.nih.gov/${study.pmid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1E40AF] hover:underline"
                    >
                      {study.pmid}
                    </a>
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Footer Nav Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E6E3DB]">
          <Link
            href="/methodology"
            className="text-sm font-medium text-[#1E40AF] hover:underline"
          >
            ← Read Testing Methodology &amp; Timing Formulas
          </Link>
          <Link
            href="/reflex/reaction"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
          >
            <span>Test Reaction Time</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
