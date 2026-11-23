"use client";

import { Database } from "lucide-react";

export default function CookiesPolicyClient() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3 pb-8 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <Database className="w-4 h-4" aria-hidden="true" />
            <span>Browser Storage &amp; Cookies</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614]">
            Cookie Policy
          </h1>
          <p className="text-xs font-mono text-[#6A675F]">
            Last updated: February 2024
          </p>
        </header>

        <article className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-[#4A4842] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] text-[#161614]">
            This Cookie Policy explains what cookies are, how Reflextry uses
            them, and how you can manage or disable cookies in your browser.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device when you visit
              a website. They help websites remember basic preferences and
              measure aggregate usage.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              2. Types of Cookies We Use
            </h2>
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1">
                <h3 className="text-sm font-semibold text-[#161614]">
                  Essential Cookies
                </h3>
                <p>
                  Necessary for basic page navigation and core website
                  functionality.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-1">
                <h3 className="text-sm font-semibold text-[#161614]">
                  Analytics Cookies
                </h3>
                <p>
                  Help us understand aggregate traffic patterns via Google
                  Analytics so we can improve tools and guides.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] space-y-2">
                <h3 className="text-sm font-semibold text-[#161614]">
                  Advertising Cookies
                </h3>
                <p>
                  Used by Google AdSense to serve relevant ads, limit repeat
                  impressions, and measure campaign effectiveness.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              3. Third-Party Cookies
            </h2>
            <p>
              Google AdSense and Google Analytics may place third-party cookies
              when you browse Reflextry to report traffic statistics and serve
              advertisements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              4. Managing Cookies &amp; Opt-Out
            </h2>
            <p>
              You can clear or block cookies at any time through your browser
              settings. To opt out of personalized advertising or analytics:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <a
                  href="https://www.google.com/settings/ads"
                  className="text-[#1E40AF] hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Ads Settings
                </a>
              </li>
              <li>
                <a
                  href="https://www.aboutads.info/choices/"
                  className="text-[#1E40AF] hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  aboutads.info/choices
                </a>
              </li>
              <li>
                <a
                  href="https://tools.google.com/dlpage/gaoptout"
                  className="text-[#1E40AF] hover:underline font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Analytics Opt-out Browser Add-on
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              5. Contact Us
            </h2>
            <p>
              Questions about this Cookie Policy can be sent to{" "}
              <a
                href="mailto:support@reflextry.com"
                className="text-[#1E40AF] hover:underline font-medium"
              >
                support@reflextry.com
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
