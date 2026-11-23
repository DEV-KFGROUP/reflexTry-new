"use client";

import { Scale } from "lucide-react";

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3 pb-8 border-b border-[#E6E3DB]">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            <Scale className="w-4 h-4" aria-hidden="true" />
            <span>Legal Terms</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614]">
            Terms of Service
          </h1>
          <p className="text-xs font-mono text-[#6A675F]">
            Last updated: February 2024
          </p>
        </header>

        <article className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-10 space-y-8 text-sm text-[#4A4842] leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] text-[#161614]">
            Please read these Terms of Service carefully before using Reflextry
            and its interactive browser tools.
          </div>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using Reflextry, you agree to be bound by these
              terms. If you do not agree, please discontinue use of the site. We
              may update these terms periodically, and continued use constitutes
              acceptance of the updated version.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              2. Usage License
            </h2>
            <p>
              Permission is granted to use Reflextry for personal,
              non-commercial viewing and practice. Under this license you may
              not:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Modify or redistribute site materials without permission</li>
              <li>Use site materials for unauthorized commercial resale</li>
              <li>
                Attempt to reverse engineer proprietary software on the site
              </li>
              <li>Remove copyright or attribution notices</li>
              <li>Mirror the website on another server</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              3. Advertising and Third-Party Content
            </h2>
            <p>
              Reflextry displays advertisements provided by Google AdSense and
              third-party partners. We do not control third-party ad content or
              external websites linked from advertisements. You may opt out of
              personalized advertising via{" "}
              <a
                href="https://www.google.com/settings/ads"
                className="text-[#1E40AF] hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              4. User Conduct
            </h2>
            <p>
              You agree to use the website only for lawful purposes and in a way
              that does not infringe the rights of or disrupt the experience for
              other users.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              5. Intellectual Property
            </h2>
            <p>
              All text, graphics, interactive code, and design assets on
              Reflextry are the property of Reflextry or its licensors and are
              protected by applicable copyright laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              6. Disclaimer
            </h2>
            <p>
              Materials and interactive benchmarks on Reflextry are provided
              &ldquo;as is&rdquo; for educational and recreational benchmarking,
              not clinical or medical diagnosis. We disclaim implied warranties
              of merchantability, fitness for a particular purpose, or
              non-infringement.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              7. Limitations of Liability
            </h2>
            <p>
              In no event shall Reflextry or its contributors be liable for
              indirect or consequential damages arising from the use or
              inability to use materials on this site.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              8. Accuracy, Links &amp; Modifications
            </h2>
            <p>
              Site content may be updated at any time without notice. External
              links are provided for reference and used at your own discretion.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              9. Governing Law
            </h2>
            <p>
              These terms are governed by and construed in accordance with
              applicable laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif text-xl font-semibold text-[#161614] border-b border-[#E6E3DB] pb-2">
              10. Contact Information
            </h2>
            <p>
              Questions about these Terms of Service can be sent to{" "}
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
