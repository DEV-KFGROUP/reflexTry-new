import Link from "next/link";
import { ArrowRight, Gamepad2, Trophy, Zap } from "lucide-react";

export function HeroSection() {
  const FLOATING_SHAPES = [
    { value: "🧠", x: "4%",  y: "18%", size: 64,  rotate: 15,  dur: 11, delay: 0   },
    { value: "⚡", x: "88%", y: "10%", size: 56,  rotate: -20, dur: 9,  delay: 0.8 },
    { value: "🎯", x: "6%",  y: "70%", size: 72,  rotate: 28,  dur: 13, delay: 1.6 },
    { value: "❖",  x: "85%", y: "65%", size: 44,  rotate: -15, dur: 8,  delay: 0.4 },
    { value: "◆",  x: "45%", y: "88%", size: 36,  rotate: 25,  dur: 10, delay: 2.2 },
    { value: "✦",  x: "76%", y: "28%", size: 40,  rotate: -35, dur: 7,  delay: 1.2 },
  ];

  return (
    <>
      <style>{`
        @keyframes hud-float {
          0%, 100% { transform: translateY(0px);  }
          50%       { transform: translateY(-18px); }
        }
        @keyframes hud-blink {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.3; }
        }
      `}</style>

      <section className="relative bg-[#f8fafc] overflow-hidden">
        {/* Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.04)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,black,transparent)] pointer-events-none" />

        {/* Glows */}
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-cyan-400/[0.07] blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-violet-400/[0.06] blur-[110px] rounded-full pointer-events-none" />

        {/* Floating 3D icons */}
        {FLOATING_SHAPES.map((s, i) => (
          <div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              left: s.x,
              top: s.y,
              opacity: 0.09,
              fontSize: s.size,
              lineHeight: 1,
              animation: `hud-float ${s.dur}s ease-in-out ${s.delay}s infinite`,
              transform: `perspective(600px) rotateX(20deg) rotateY(-15deg) rotateZ(${s.rotate}deg)`,
              filter: "drop-shadow(2px 4px 8px rgba(6,182,212,0.15))",
            }}
          >
            {s.value}
          </div>
        ))}

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 flex flex-col items-center text-center gap-6">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/25 bg-white/80 backdrop-blur-sm shadow-sm text-amber-700 dark:text-amber-400 text-xs font-mono tracking-widest uppercase">
            <span
              className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"
              style={{ animation: "hud-blink 1.6s ease-in-out infinite" }}
            />
            ⚡ Millisecond Reaction &amp; Reflex Benchmarks
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-mono font-black tracking-tight text-slate-900 uppercase leading-[1.05]">
            Test Your{" "}
            <span
              style={{
                background: "linear-gradient(110deg,#0891b2 0%,#2563eb 50%,#7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Reaction Time
            </span>{" "}
            &amp; Reflexes
          </h1>

          {/* Sub */}
          <p className="max-w-2xl text-slate-500 text-base sm:text-lg leading-relaxed">
            <strong className="text-slate-700">37+ free tools</strong> to measure your raw biological reaction latency down to the millisecond. Benchmark your reflexes, memory, and aim precision against global averages.
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {[
              { val: "200ms", label: "Avg Human Reaction" },
              { val: "37+", label: "Interactive Tools" },
              { val: "100%", label: "Free & In-Browser" },
            ].map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm shadow-sm"
              >
                <span className="text-lg font-mono font-black text-slate-900">{s.val}</span>
                <span className="text-xs font-mono text-slate-400 tracking-widest uppercase">{s.label}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3 pt-1">
            <Link
              href="/reflex/reaction"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-mono font-bold transition-all duration-150 active:translate-y-0.5"
              style={{
                background: "linear-gradient(135deg,#0891b2 0%,#7c3aed 100%)",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(6,182,212,0.30), inset 0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              Test Reaction Time
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-mono font-bold border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 hover:border-cyan-300 hover:text-cyan-600 shadow-sm transition-all duration-150"
            >
              <Gamepad2 className="w-4 h-4" />
              Explore All Tools
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
