"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Target,
  Zap,
  Users,
  Heart,
  Trophy,
  Brain,
  Shield,
  BarChart3,
  ArrowRight,
  Globe,
  Compass,
  Mail,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export default function AboutClient() {
  const { t, getLocalizedHref } = useTranslation();

  const values = [
    {
      icon: Target,
      title: t("about.valAccuracyTitle", "Accuracy"),
      description: t(
        "about.valAccuracyDesc",
        "No fluff, just precise measurements and reliable testing to track your true mechanical baseline."
      ),
    },
    {
      icon: Zap,
      title: t("about.valInnovationTitle", "Innovation"),
      description: t(
        "about.valInnovationDesc",
        "Constantly pushing new modules to test the absolute limits of human reaction time."
      ),
    },
    {
      icon: Users,
      title: t("about.valAccessibilityTitle", "Accessibility"),
      description: t(
        "about.valAccessibilityDesc",
        "Professional-grade testing and performance tracking tools, completely free for everyone."
      ),
    },
    {
      icon: Heart,
      title: t("about.valUserFirstTitle", "User First"),
      description: t(
        "about.valUserFirstDesc",
        "We build what the community asks for. If a game mode does not feel right, we fix it."
      ),
    },
  ];

  const offerings = [
    {
      icon: Brain,
      title: t("about.offerBrainTitle", "Brain Training Games"),
      description: t(
        "about.offerBrainDesc",
        "Push your working memory and pattern recognition with cognitive drills designed around clear scoring rules."
      ),
    },
    {
      icon: Zap,
      title: t("about.offerReflexTitle", "Reaction & Speed Tests"),
      description: t(
        "about.offerReflexDesc",
        "Measure your physical latency down to the millisecond across aim, click, and reaction arenas."
      ),
    },
    {
      icon: BarChart3,
      title: t("about.offerTrackingTitle", "Progress Tracking"),
      description: t(
        "about.offerTrackingDesc",
        "Automatically log session baselines in your browser and watch your performance trends over time."
      ),
    },
    {
      icon: Trophy,
      title: t("about.offerLeaderboardTitle", "Achievements & Leaderboards"),
      description: t(
        "about.offerLeaderboardDesc",
        "Unlock ranks, complete daily challenges, and compare personal records across difficulty levels."
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-[#E6E3DB]">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            {t("about.identityProfile", "About Reflextry")}
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614] leading-tight">
            {t("about.heroTitle", "About")}{" "}
            {t("about.heroTitleHighlight", "Us")}
          </h1>
          <p className="text-base sm:text-lg text-[#4A4842] max-w-2xl leading-relaxed">
            {t(
              "about.heroSubtitle",
              "A no-nonsense platform for measuring and pushing your mechanical limits. Built by competitive players for anyone who wants to get sharper."
            )}
          </p>
        </header>

        {/* Mission & Story */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center text-[#161614]">
                <Compass className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#6A675F]">
                  {t("about.missionLabel", "Mission")}
                </p>
                <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                  {t("about.missionTitle", "Our Mission")}
                </h2>
              </div>
            </div>
            <p className="text-sm sm:text-base text-[#4A4842] leading-relaxed">
              {t(
                "about.missionDesc",
                "Our mission is simple: make reliable reaction and cognitive testing tools accessible in any browser. Improvement starts with honest data. We built Reflextry so you can establish an exact baseline, practice deliberately, and track measurable progress."
              )}
            </p>
          </div>

          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center text-[#161614]">
                <Globe className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-wider text-[#6A675F]">
                  {t("about.originLabel", "Background")}
                </p>
                <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                  {t("about.originTitle", "Our Story")}
                </h2>
              </div>
            </div>
            <div className="space-y-3 text-sm text-[#4A4842] leading-relaxed">
              <p>
                {t(
                  "about.originP1",
                  "Reflextry began as a small browser script to measure click latency without installing another desktop trainer. That single tool grew into a complete suite covering memory, reflex, speed, accuracy, and cognitive benchmarks."
                )}
              </p>
              <p>
                {t(
                  "about.originP2",
                  "Built in Surat, India, by an independent two-person team, every module ships as an instant browser test with local session statistics—no download walls or paywalled core drills."
                )}
              </p>
              <p>
                {t(
                  "about.originP3",
                  "Today Reflextry is used by players warming up before ranked matches, students practicing working memory, and curious visitors checking reaction time or color perception."
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between border-b border-[#E6E3DB] pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161614]">
              Core Values
            </h2>
            <span className="text-xs font-mono text-[#6A675F] uppercase tracking-wider">
              4 principles
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white border border-[#E6E3DB] rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#1E40AF]">
                  <value.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-base font-semibold text-[#161614]">
                    {value.title}
                  </h3>
                  <p className="text-sm text-[#4A4842] leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What We Offer */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between border-b border-[#E6E3DB] pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161614]">
              What Reflextry Offers
            </h2>
            <span className="text-xs font-mono text-[#6A675F] uppercase tracking-wider">
              Platform capabilities
            </span>
          </div>
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {offerings.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#161614]">
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[#161614]">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#4A4842] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="space-y-5">
          <div className="flex items-baseline justify-between border-b border-[#E6E3DB] pb-3">
            <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#161614]">
              Meet the Team
            </h2>
            <span className="text-xs font-mono text-[#6A675F] uppercase tracking-wider">
              Independent team
            </span>
          </div>
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-[#E6E3DB] shrink-0 bg-[#F3F1EB]">
                  <Image
                    src="/images/team/rabadiya-kaushik.webp"
                    alt="Rabadiya Kaushik"
                    fill
                    sizes="112px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-[#161614]">
                    Rabadiya Kaushik
                  </h3>
                  <p className="text-xs font-mono text-[#1E40AF]">
                    Founder &amp; Full-Stack Developer
                  </p>
                  <p className="text-sm text-[#4A4842] leading-relaxed">
                    Builds the interactive benchmarks, timing engine, and site
                    infrastructure. Focuses on fair measurement, clear
                    difficulty tiers, and fast browser performance.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
                <div className="relative w-28 h-28 rounded-2xl overflow-hidden border border-[#E6E3DB] shrink-0 bg-[#F3F1EB]">
                  <Image
                    src="/images/team/harshil-miyani.webp"
                    alt="Harshil Miyani"
                    fill
                    sizes="112px"
                    referrerPolicy="no-referrer"
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-semibold text-[#161614]">
                    Harshil Miyani
                  </h3>
                  <p className="text-xs font-mono text-[#1E40AF]">
                    Growth &amp; Content
                  </p>
                  <p className="text-sm text-[#4A4842] leading-relaxed">
                    Leads research guides, discoverability, and making sure
                    every tool explains what your score means rather than just
                    displaying a number.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-[#E6E3DB] pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm text-[#4A4842]">
              <p className="max-w-xl">
                We answer support emails directly and prioritize honest score
                interpretation over marketing claims.
              </p>
              <a
                href="mailto:support@reflextry.com"
                className="inline-flex items-center gap-2 font-mono text-xs font-semibold text-[#1E40AF] hover:underline shrink-0"
              >
                <Mail className="w-4 h-4" aria-hidden="true" />
                support@reflextry.com
              </a>
            </div>
          </div>
        </section>

        {/* Methodology & Contact */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-[#6A675F]">
              Methodology
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#161614]">
              How We Build &amp; Score Tests
            </h2>
            <div className="space-y-3 text-sm text-[#4A4842] leading-relaxed">
              <p>
                Each tool uses an explicit scoring rule—reaction time in
                milliseconds, memory span, accuracy percentage, or completion
                time—with documented difficulty differences.
              </p>
              <p>
                Because display refresh rate and input hardware affect raw
                numbers, compare scores on the same device and difficulty. For
                details, read our{" "}
                <Link
                  href="/methodology"
                  className="text-[#1E40AF] font-medium hover:underline"
                >
                  testing methodology
                </Link>{" "}
                and{" "}
                <Link
                  href="/science"
                  className="text-[#1E40AF] font-medium hover:underline"
                >
                  science overview
                </Link>
                .
              </p>
            </div>
          </div>

          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-4">
            <p className="text-xs font-mono uppercase tracking-wider text-[#6A675F]">
              Contact &amp; Legal
            </p>
            <h2 className="font-serif text-2xl font-semibold text-[#161614]">
              Reach the Team
            </h2>
            <ul className="space-y-2 text-sm text-[#4A4842] leading-relaxed">
              <li>
                <span className="font-semibold text-[#161614]">Email:</span>{" "}
                <a
                  href="mailto:support@reflextry.com"
                  className="text-[#1E40AF] hover:underline"
                >
                  support@reflextry.com
                </a>
              </li>
              <li>
                <span className="font-semibold text-[#161614]">Office:</span>{" "}
                346, Gujarat State Highway 167, Shanti Niketan Society, Mota
                Varachha, Surat, Gujarat 394101, India
              </li>
            </ul>
            <div className="pt-2 flex flex-wrap gap-3 text-xs font-medium">
              <Link
                href={getLocalizedHref("/contact")}
                className="inline-flex items-center gap-1.5 text-[#1E40AF] hover:underline"
              >
                Contact form
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
              <span className="text-[#D8D4C9]" aria-hidden="true">
                ·
              </span>
              <Link
                href={getLocalizedHref("/privacy")}
                className="text-[#4A4842] hover:text-[#161614] hover:underline"
              >
                {t("footer.privacy", "Privacy Policy")}
              </Link>
              <Link
                href={getLocalizedHref("/terms")}
                className="text-[#4A4842] hover:text-[#161614] hover:underline"
              >
                {t("footer.terms", "Terms of Service")}
              </Link>
              <Link
                href={getLocalizedHref("/cookies")}
                className="text-[#4A4842] hover:text-[#161614] hover:underline"
              >
                {t("footer.cookies", "Cookie Policy")}
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#6A675F]">
              <Shield className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Free browser benchmarks</span>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-[#161614]">
              {t("about.ctaTitle", "Ready to Test Your Limits?")}
            </h2>
            <p className="text-sm text-[#4A4842] leading-relaxed">
              {t(
                "about.ctaDesc",
                "Jump straight into the benchmarks and establish your personal baseline."
              )}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href={getLocalizedHref("/tools")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
            >
              <span>{t("about.ctaStart", "Explore All Tools")}</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={getLocalizedHref("/leaderboard")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D8D4C9] hover:bg-[#F3F1EB] text-[#161614] text-sm font-semibold transition-colors"
            >
              <Trophy className="w-4 h-4" aria-hidden="true" />
              <span>{t("nav.leaderboard", "Leaderboard")}</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
