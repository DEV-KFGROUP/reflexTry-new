"use client";

import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  readTime: string;
  category: string;
  date: string;
}

export default function BlogHubClient({ posts }: { posts: BlogPost[] }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Editorial Header */}
        <header className="space-y-3 max-w-3xl pb-6 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <BookOpen className="w-4 h-4" aria-hidden="true" />
            <span>Research &amp; Guides</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#161614]">
            Cognitive Journal
          </h1>
          <p className="text-base sm:text-lg text-[#4A4842] leading-relaxed">
            Evidence-based methodology notes, reaction-time science, and
            practical training guides from the Reflextry lab.
          </p>
        </header>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white border border-[#E6E3DB] rounded-2xl p-12 text-center">
            <p className="text-sm text-[#6A675F]">
              No articles published yet. Check back soon for new research
              guides.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {posts.map((post) => {
              const formattedDate = new Date(post.date).toLocaleDateString(
                "en-US",
                {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                }
              );

              return (
                <article
                  key={post.slug}
                  className="group bg-white border border-[#E6E3DB] hover:border-[#D8D4C9] rounded-2xl transition-colors flex flex-col h-full"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="flex flex-col h-full p-6 justify-between gap-6 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] rounded-2xl"
                  >
                    <div className="space-y-3">
                      <p className="text-xs font-mono text-[#6A675F] flex items-center flex-wrap gap-x-2 gap-y-1">
                        <span className="font-semibold uppercase tracking-wider text-[#1E40AF]">
                          {post.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTime}</span>
                      </p>

                      <div className="space-y-2">
                        <h2 className="font-serif text-xl font-semibold text-[#161614] leading-snug group-hover:text-[#1E40AF] transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm text-[#4A4842] leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-[#E6E3DB] text-xs">
                      <time
                        dateTime={post.date}
                        className="font-mono text-[#6A675F] tabular-nums"
                      >
                        {formattedDate}
                      </time>
                      <span className="font-semibold text-[#161614] group-hover:text-[#1E40AF] inline-flex items-center gap-1 transition-colors">
                        Read article
                        <ArrowRight
                          className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                </article>
              );
            })}
          </div>
        )}

        {/* Bottom Training CTA Strip */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <h2 className="font-serif text-2xl font-semibold text-[#161614] tracking-tight">
              Put the research into practice
            </h2>
            <p className="text-sm text-[#4A4842] leading-relaxed">
              Establish your own baseline across reaction time, working memory,
              speed, and precision benchmarks.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/reflex/reaction"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] text-[#FAF9F6] text-sm font-semibold transition-colors"
            >
              <span>Test Reaction Time</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-[#D8D4C9] hover:bg-[#F3F1EB] text-[#161614] text-sm font-semibold transition-colors"
            >
              <span>Browse All Tools</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
