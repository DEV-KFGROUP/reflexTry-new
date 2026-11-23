"use client";

import { Shield } from "lucide-react";

export default function PrivacyPolicyClient() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3 pb-8 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <Shield className="w-4 h-4" aria-hidden="true" />
            <span>Legal &amp; Privacy</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614]">
            Privacy Policy
          </h1>
          <p className="text-xs font-mono text-[#6A675F]">
            Last updated: February 2024
          </p>
        </header>

        <article className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-10 space-y-8 text-sm sm:text-base text-[#3A3934] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] text-[#161614] text-sm">
            Your privacy matters to us. This policy outlines how Reflextry
            collects, uses, and protects information when you use our browser
            benchmarks and tools.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              1. Information We Collect
            </h2>
            <p className="text-sm text-[#4A4842]">
              We do not collect personal data such as names or email addresses
              unless you voluntarily contact us. We may collect non-personal
              technical data such as browser type and aggregate usage statistics
              to improve the platform.
            </p>
            <p className="text-sm text-[#4A4842]">
              When you visit the site, standard device information such as web
              browser type, IP address, time zone, and cookies installed on your
              device may be processed by analytics or advertising partners.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              2. Cookies and Tracking Technologies
            </h2>
            <p className="text-sm text-[#4A4842]">
              We use cookies to improve your experience, measure site traffic,
              and serve advertisements via Google AdSense. Cookies are small
              data files stored by your browser:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4842]">
              <li>
                <strong className="text-[#161614]">Essential Cookies:</strong>{" "}
                Required for core navigation and site functionality.
              </li>
              <li>
                <strong className="text-[#161614]">Analytics Cookies:</strong>{" "}
                Help us understand aggregate visitor interactions.
              </li>
              <li>
                <strong className="text-[#161614]">Advertising Cookies:</strong>{" "}
                Used to display relevant advertisements and measure ad
                performance.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              3. Google AdSense and Advertising
            </h2>
            <p className="text-sm text-[#4A4842]">
              We use Google AdSense to display advertisements on Reflextry.
              Third-party vendors, including Google, use cookies to serve ads
              based on prior visits to this site or other websites.
            </p>
            <p className="text-sm text-[#4A4842]">
              <strong className="text-[#161614]">Opt-Out:</strong> You may opt
              out of personalized advertising through{" "}
              <a
                href="https://www.google.com/settings/ads"
                className="text-[#1E40AF] hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>{" "}
              or{" "}
              <a
                href="https://www.aboutads.info/choices/"
                className="text-[#1E40AF] hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                aboutads.info/choices
              </a>
              .
            </p>
            <div className="p-3 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] text-xs font-mono text-[#4A4842]">
              AdSense Publisher ID: ca-pub-3064655546051154
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              4. Third-Party Services
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4842]">
              <li>
                <strong className="text-[#161614]">Google Analytics:</strong>{" "}
                Aggregate traffic and usage analysis.
              </li>
              <li>
                <strong className="text-[#161614]">Google AdSense:</strong>{" "}
                Display advertising across the site.
              </li>
            </ul>
            <p className="text-sm text-[#4A4842]">
              These services may receive standard browser signals such as IP
              address, browser type, visited pages, and session duration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              5. Data Sharing
            </h2>
            <p className="text-sm text-[#4A4842]">
              We do not sell, trade, or rent personal information to third
              parties. Non-personal, aggregated information may be processed by
              infrastructure and analytics providers that help operate the
              website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              6. Your Rights
            </h2>
            <ul className="list-disc pl-5 space-y-1.5 text-sm text-[#4A4842]">
              <li>Request access to or a copy of personal data you provided</li>
              <li>Request correction or deletion of personal data</li>
              <li>Opt out of personalized advertising</li>
              <li>Disable cookies through your browser settings</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              7. Contact Us
            </h2>
            <p className="text-sm text-[#4A4842]">
              If you have questions about this Privacy Policy, email{" "}
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
