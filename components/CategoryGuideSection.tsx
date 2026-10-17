"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/context";

interface CategoryGuideProps {
  category: "reflex" | "memory" | "speed" | "accuracy" | "gaming";
}

const CATEGORY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  reflex: { text: "text-amber-700 dark:text-amber-400", bg: "hover:bg-amber-500/5", border: "hover:border-amber-500/50" },
  memory: { text: "text-blue-700 dark:text-blue-400", bg: "hover:bg-blue-500/5", border: "hover:border-blue-500/50" },
  speed: { text: "text-red-700 dark:text-red-400", bg: "hover:bg-red-500/5", border: "hover:border-red-500/50" },
  accuracy: { text: "text-emerald-700 dark:text-emerald-400", bg: "hover:bg-emerald-500/5", border: "hover:border-emerald-500/50" },
  gaming: { text: "text-purple-700 dark:text-purple-400", bg: "hover:bg-purple-500/5", border: "hover:border-purple-500/50" },
};

const ALL_CATEGORIES = [
  { id: "gaming", icon: "🎮", href: "/gaming", color: "text-purple-500", hoverBorder: "hover:border-purple-500/50", hoverBg: "hover:bg-purple-500/5" },
  { id: "memory", icon: "🧠", href: "/memory", color: "text-blue-500", hoverBorder: "hover:border-blue-500/50", hoverBg: "hover:bg-blue-500/5" },
  { id: "reflex", icon: "⚡", href: "/reflex", color: "text-amber-500", hoverBorder: "hover:border-amber-500/50", hoverBg: "hover:bg-amber-500/5" },
  { id: "speed", icon: "⌨️", href: "/speed", color: "text-red-500", hoverBorder: "hover:border-red-500/50", hoverBg: "hover:bg-red-500/5" },
  { id: "accuracy", icon: "🎯", href: "/accuracy", color: "text-teal-500", hoverBorder: "hover:border-teal-500/50", hoverBg: "hover:bg-teal-500/5" },
];

export function CategoryGuideSection({ category }: CategoryGuideProps) {
  const { t, getLocalizedHref } = useTranslation();
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.reflex;
  const otherCategories = ALL_CATEGORIES.filter(c => c.id !== category);

  return (
    <>
      {/* Detailed SEO / AEO / GEO Section */}
      <div className="max-w-4xl mx-auto mt-16 space-y-12 text-left pt-6 border-t border-black/10 dark:border-white/10 relative z-10">
        
        {/* What is Section */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-foreground">
            {t(`categoryGuide.${category}.whatIsTitle`, "What is Training?")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t(`categoryGuide.${category}.whatIsDesc`, "")}
          </p>
        </div>

        {/* How to Improve Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t(`categoryGuide.${category}.howToTitle`, "How to Improve?")}
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>
              <strong>{t(`categoryGuide.${category}.howToStep1Title`, "Step 1")}:</strong>{" "}
              {t(`categoryGuide.${category}.howToStep1Desc`, "")}
            </li>
            <li>
              <strong>{t(`categoryGuide.${category}.howToStep2Title`, "Step 2")}:</strong>{" "}
              {t(`categoryGuide.${category}.howToStep2Desc`, "")}
            </li>
            <li>
              <strong>{t(`categoryGuide.${category}.howToStep3Title`, "Step 3")}:</strong>{" "}
              {t(`categoryGuide.${category}.howToStep3Desc`, "")}
            </li>
            <li>
              <strong>{t(`categoryGuide.${category}.howToStep4Title`, "Step 4")}:</strong>{" "}
              {t(`categoryGuide.${category}.howToStep4Desc`, "")}
            </li>
          </ol>
        </div>

        {/* Should I Practice Daily? */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            {t(`categoryGuide.${category}.shouldPracticeTitle`, "Should I Practice Daily?")}
          </h3>
          <p className="text-muted-foreground leading-relaxed">
            {t(`categoryGuide.${category}.shouldPracticeDesc`, "")}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t(`categoryGuide.${category}.comparisonTitle`, "Tools Comparison")}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-black/10 dark:border-white/10">
                  <th className="p-3 text-foreground font-bold">
                    {t("categoryHub.toolNameCol", "Tool Name")}
                  </th>
                  <th className="p-3 text-foreground font-bold">
                    {t("categoryHub.bestForCol", "Best For (Use Case)")}
                  </th>
                  <th className="p-3 text-foreground font-bold">
                    {t("categoryHub.coreBenefitCol", "Core Benefit")}
                  </th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-black/5 dark:border-white/5">
                  <td className={`p-3 font-bold ${colors.text}`}>
                    {t(`categoryGuide.${category}.row1Tool`, "")}
                  </td>
                  <td className="p-3">{t(`categoryGuide.${category}.row1BestFor`, "")}</td>
                  <td className="p-3">{t(`categoryGuide.${category}.row1Benefit`, "")}</td>
                </tr>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <td className={`p-3 font-bold ${colors.text}`}>
                    {t(`categoryGuide.${category}.row2Tool`, "")}
                  </td>
                  <td className="p-3">{t(`categoryGuide.${category}.row2BestFor`, "")}</td>
                  <td className="p-3">{t(`categoryGuide.${category}.row2Benefit`, "")}</td>
                </tr>
                <tr className="border-b border-black/5 dark:border-white/5">
                  <td className={`p-3 font-bold ${colors.text}`}>
                    {t(`categoryGuide.${category}.row3Tool`, "")}
                  </td>
                  <td className="p-3">{t(`categoryGuide.${category}.row3BestFor`, "")}</td>
                  <td className="p-3">{t(`categoryGuide.${category}.row3Benefit`, "")}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmarks & Scientific Proof */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t(`categoryGuide.${category}.benchmarksTitle`, "Benchmarks & Scientific Proof")}
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            {t(`categoryGuide.${category}.benchmarksDesc`, "")}
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">
            {t(`categoryGuide.${category}.faqTitle`, "Frequently Asked Questions")}
          </h2>
          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t(`categoryGuide.${category}.faq1Q`, "")}
            </h3>
            <p className="text-muted-foreground mb-3">
              {t(`categoryGuide.${category}.faq1A`, "")}
            </p>
          </div>
          <div className="bg-white/5 dark:bg-white/5 backdrop-blur-sm border border-black/10 dark:border-white/10 p-6 rounded-3xl">
            <h3 className="text-xl font-bold text-foreground mb-3">
              {t(`categoryGuide.${category}.faq2Q`, "")}
            </h3>
            <p className="text-muted-foreground mb-3">
              {t(`categoryGuide.${category}.faq2A`, "")}
            </p>
          </div>
        </div>
      </div>

      {/* Related Categories */}
      <div className="mt-16 pt-8 border-t border-black/10 dark:border-white/10 relative z-10">
        <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
          {t("categoryHub.exploreOther", "Explore Other Categories")}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {otherCategories.map((c) => (
            <Link
              key={c.id}
              href={getLocalizedHref(c.href)}
              prefetch={false}
              className={`p-4 rounded-2xl bg-white/5 border border-black/10 dark:border-white/10 ${c.hoverBorder} ${c.hoverBg} transition-all text-center`}
            >
              <div className={`${c.color} text-2xl mb-2 drop-shadow-sm`}>{c.icon}</div>
              <div className="text-sm font-bold text-foreground">
                {t(`categories.${c.id}.title`, c.id.toUpperCase())}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
