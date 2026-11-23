"use client";

import Link from "next/link";
import { Clock, Calendar, ArrowLeft, ArrowRight } from "lucide-react";

interface Article {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  date: string;
}

interface ArticleClientProps {
  article: Article;
  children: React.ReactNode;
}

export default function ArticleClient({
  article,
  children,
}: ArticleClientProps) {
  const formattedDate = new Date(article.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back link */}
        <div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-[#6A675F] hover:text-[#161614] transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to Cognitive Journal</span>
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pb-6 border-b border-[#E6E3DB]">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-mono text-[#6A675F]">
            {article.category && (
              <span className="font-semibold uppercase tracking-wider text-[#1E40AF]">
                {article.category}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              {formattedDate}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              {article.readTime}
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold tracking-tight text-[#161614] leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4A4842] leading-relaxed">
            {article.description}
          </p>
        </header>

        {/* Article Body */}
        <article className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-10">
          <div
            className="prose prose-stone max-w-none
              prose-headings:font-serif prose-headings:font-semibold prose-headings:text-[#161614]
              prose-h2:text-2xl prose-h3:text-xl prose-h2:mt-8 prose-h2:mb-3
              prose-p:text-[#3A3934] prose-p:leading-relaxed prose-p:mb-5
              prose-a:text-[#1E40AF] prose-a:underline hover:prose-a:text-[#161614]
              prose-strong:text-[#161614] prose-strong:font-semibold
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-5 prose-ul:text-[#3A3934]
              prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-5 prose-ol:text-[#3A3934]
              prose-li:mb-1.5
              prose-blockquote:border-l-2 prose-blockquote:border-[#1E40AF] prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-[#4A4842] prose-blockquote:my-6
              prose-code:text-[#161614] prose-code:bg-[#F3F1EB] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:font-mono prose-code:text-xs"
          >
            {children}
          </div>
        </article>

        {/* Bottom CTA */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="space-y-1">
            <h2 className="font-serif text-xl font-semibold text-[#161614]">
              Put strategies into practice
            </h2>
            <p className="text-sm text-[#4A4842]">
              Train with interactive benchmarks and track your local progress.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D8D4C9] hover:bg-[#F3F1EB] text-[#161614] text-sm font-semibold transition-colors"
            >
              <span>More Articles</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
