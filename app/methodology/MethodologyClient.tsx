"use client";

import {
  Activity,
  Clock,
  Cpu,
  Gauge,
  Monitor,
  ShieldCheck,
  Terminal,
  Zap,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function MethodologyClient() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <Terminal className="w-4 h-4" aria-hidden="true" />
            <span>Measurement Standards &amp; Calibration</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614] leading-tight">
            Testing Methodology
          </h1>
          <p className="text-base sm:text-lg text-[#4A4842] max-w-2xl leading-relaxed">
            How Reflextry measures reaction latency, motor speed, and cognitive
            accuracy down to the millisecond—including hardware variables and
            scoring formulas.
          </p>
        </header>

        {/* Executive Summary */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#1E40AF]">
            <ShieldCheck className="w-4 h-4" aria-hidden="true" />
            <span>Measurement Standard at a Glance</span>
          </div>
          <div className="space-y-3 text-sm sm:text-base text-[#3A3934] leading-relaxed">
            <p>
              <strong>Reflextry</strong> uses browser-native high-resolution
              timestamps via{" "}
              <code className="px-1.5 py-0.5 rounded bg-[#F3F1EB] border border-[#E6E3DB] font-mono text-xs text-[#161614]">
                performance.now()
              </code>{" "}
              synchronized to display paint cycles with{" "}
              <code className="px-1.5 py-0.5 rounded bg-[#F3F1EB] border border-[#E6E3DB] font-mono text-xs text-[#161614]">
                requestAnimationFrame()
              </code>
              .
            </p>
            <p>
              Modules are designed as personal benchmarking instruments to
              establish baselines and track progress across repeated practice
              sessions on the same device.
            </p>
          </div>
        </section>

        {/* Section 1: Reaction Time */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
              <Zap className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                1. Reaction Time &amp; Millisecond Timing Engine
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Stimulus detection, timestamp capture, and outlier filtering
              </p>
            </div>
          </div>

          <p className="text-sm text-[#4A4842] leading-relaxed">
            In visual and auditory latency tests such as{" "}
            <Link
              href="/reflex/reaction"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Reaction Time Test
            </Link>{" "}
            and{" "}
            <Link
              href="/reflex/sound"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Sound Reaction
            </Link>
            , timing follows three safeguards:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-xs font-mono font-semibold uppercase text-[#161614] flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
                <span>High-Resolution Clock</span>
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Stimulus presentation and input events use the DOM High
                Resolution Time API (<code>performance.now()</code>) for
                monotonic sub-millisecond timing.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-xs font-mono font-semibold uppercase text-[#161614] flex items-center gap-1.5">
                <AlertTriangle
                  className="w-4 h-4 text-[#92400E]"
                  aria-hidden="true"
                />
                <span>False Start Protection</span>
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Biological visual-motor transmission takes at least ~100 ms.
                Anticipated inputs before the go cue are flagged as false
                starts.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-xs font-mono font-semibold uppercase text-[#161614] flex items-center gap-1.5">
                <Activity
                  className="w-4 h-4 text-[#1E40AF]"
                  aria-hidden="true"
                />
                <span>Multi-Trial Aggregation</span>
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Sessions aggregate multiple consecutive trials so isolated
                distractions do not distort your baseline average.
              </p>
            </div>
          </div>

          <div className="border-t border-[#E6E3DB] pt-6 space-y-3">
            <h3 className="text-sm font-semibold text-[#161614] flex items-center gap-2">
              <Monitor className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
              <span>
                Hardware Latency Sources (Why Browser Tests Differ From Lab EEG)
              </span>
            </h3>

            <div className="overflow-x-auto border border-[#E6E3DB] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F3F1EB] text-[#161614] font-mono">
                  <tr>
                    <th className="p-3 font-semibold">Variable</th>
                    <th className="p-3 font-semibold">60 Hz Display</th>
                    <th className="p-3 font-semibold">144 Hz Display</th>
                    <th className="p-3 font-semibold">240 Hz+ Display</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E3DB] tabular-nums">
                  <tr>
                    <td className="p-3 font-semibold text-[#161614]">
                      Frame Duration
                    </td>
                    <td className="p-3 text-[#4A4842]">~16.6 ms / frame</td>
                    <td className="p-3 text-[#4A4842]">~6.9 ms / frame</td>
                    <td className="p-3 text-[#4A4842]">~4.1 ms / frame</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#161614]">
                      Input Polling
                    </td>
                    <td className="p-3 text-[#4A4842]">
                      Bluetooth: +8–15 ms latency
                    </td>
                    <td className="p-3 text-[#4A4842]">
                      USB 1000 Hz: ~1 ms polling
                    </td>
                    <td className="p-3 text-[#4A4842]">
                      USB 8000 Hz: &lt;0.2 ms polling
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-[#161614]">
                      Typical Measured Latency
                    </td>
                    <td className="p-3 text-[#4A4842]">220–270 ms</td>
                    <td className="p-3 text-[#4A4842]">190–240 ms</td>
                    <td className="p-3 text-[#4A4842]">170–220 ms</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 2: Speed & Typing Formulas */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
              <Gauge className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                2. Speed, Typing (WPM), &amp; CPS Formulas
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Standardized scoring equations
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-3">
              <h3 className="text-base font-semibold text-[#161614]">
                Words Per Minute (WPM)
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Following international typing conventions, one standard word
                equals exactly <strong>5 keystrokes</strong> including spaces
                and punctuation.
              </p>
              <pre className="p-3.5 rounded-lg bg-[#161614] text-[#FAF9F6] font-mono text-xs overflow-x-auto leading-relaxed">
{`Gross WPM = (Total Keystrokes / 5) / (Seconds / 60)
Net WPM   = Gross WPM - (Uncorrected Errors / Minutes)
Accuracy  = (Correct Chars / Total Typed) × 100%`}
              </pre>
            </div>

            <div className="p-5 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-3">
              <h3 className="text-base font-semibold text-[#161614]">
                Clicks Per Second (CPS)
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                CPS measures validated pointer activations over the configured
                duration window (1s, 5s, 10s, or 60s).
              </p>
              <pre className="p-3.5 rounded-lg bg-[#161614] text-[#FAF9F6] font-mono text-xs overflow-x-auto leading-relaxed">
{`CPS = Validated Clicks / Selected Duration (s)
Debounce floor: prevents synthetic macro bursts`}
              </pre>
            </div>
          </div>
        </section>

        {/* Section 3: Memory & Cognitive Scaling */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
              <Cpu className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                3. Memory &amp; Cognitive Scaling
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Adaptive difficulty, randomization, and span progression
              </p>
            </div>
          </div>

          <p className="text-sm text-[#4A4842] leading-relaxed">
            Cognitive drills such as{" "}
            <Link
              href="/memory/chimp-test"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Chimp Test
            </Link>
            ,{" "}
            <Link
              href="/memory/sequence"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Sequence Memory
            </Link>
            ,{" "}
            <Link
              href="/memory/n-back"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              N-Back
            </Link>
            , and{" "}
            <Link
              href="/speed/schulte-table"
              className="text-[#1E40AF] font-medium hover:underline"
            >
              Schulte Table
            </Link>{" "}
            generate randomized sequences each round to isolate specific memory
            and attention faculties:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Spatial Working Memory (Chimp Test)
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Numbers appear across a grid. Once you select 1, remaining
                numbers mask immediately to measure short-term visual-spatial
                buffer capacity.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#E6E3DB] space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Sequential Retention (Sequence Memory)
              </h3>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Each level appends one new step to the tile pattern, scaling
                working-memory load progressively until an error occurs.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Local Data */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
              <ShieldCheck className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                4. Privacy &amp; Local Storage
              </h2>
              <p className="text-xs font-mono text-[#6A675F] uppercase tracking-wider mt-0.5">
                Client-side execution and user-controlled records
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm text-[#4A4842] leading-relaxed">
            <p>
              All timing loops and game scoring run directly in your local
              browser. Personal best scores and history are stored locally in{" "}
              <code className="px-1.5 py-0.5 rounded bg-[#F3F1EB] border border-[#E6E3DB] font-mono text-xs text-[#161614]">
                localStorage
              </code>{" "}
              so you can track trends without creating an account.
            </p>
          </div>
        </section>

        {/* Footer Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#E6E3DB]">
          <Link
            href="/science"
            className="text-sm font-medium text-[#1E40AF] hover:underline"
          >
            Explore Neuroscience Research &amp; Citations →
          </Link>
          <Link
            href="/reflex/reaction"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
          >
            <span>Test Your Reaction Time</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
