# SEO / AEO / GEO remediation

Implemented locally on 2 October 2026. This document supersedes the original audit's code findings. The public website has not been deployed from this workspace.

## Changes

- English is the only advertised language. Legacy `/en`, `/es`, `/de`, `/fr`, `/pt`, and `/ja` URLs permanently redirect to the equivalent English path, preserving query strings. Unfinished language controls and unnecessary dictionary imports are removed from the rendered application. Translation dictionaries remain available for future complete localization.
- Blog titles receive one brand suffix from the layout. Canonical origin parsing now handles trailing slashes without constructing malformed origins.
- Removed the unsupported global statistics section, dataset schema, claimed test/country totals, and fabricated verification links. Personal statistics remain noindex.
- Homepage FAQs and FAQ JSON-LD share a single data source. Removed invisible tools-directory FAQs and the nonfunctional SearchAction.
- Removed per-render publication/modification dates from unused schema and answer markup. Static sitemap pages no longer inherit unrelated blog modification dates; real blog frontmatter dates are preserved.
- Replaced unsupported homepage performance/health claims with task-specific explanations and research limitations. Added background references to articles, corrected the wrong working-memory PubMed link, and replaced an unverifiable motor-practice citation with a verified research review.
- Removed the unsupported doctoral byline and missing portrait reference; article metadata distinguishes editorial organizations from individual authors and no longer invents professional qualifications. Author cards link to the existing about page.
- Generated `/llms.txt`, `/llms-full.txt`, and `/ai.txt` from the maintained tool registry and SEO configuration. They list 48 unique tests, current article URLs, and explain that personal scores are not population norms. Removed the invalid AI plugin manifest that advertised a plain-text file as an OpenAPI specification.
- Corrected duplicate H1s across the affected hubs and tools. The main reaction test now has a descriptive title. Improved shared muted-text contrast and remaining reaction-page text colors.
- Replaced the delayed animated consent overlay with a compact server-rendered notice. Optional analytics/advertising preferences now persist independently, can be reopened from the footer, and control SDK loading. Revoking enabled preferences reloads the page so the disabled SDKs are not initialized again. Ads and analytics now load with `lazyOnload` only when enabled; this can reduce measured visits/ad impressions versus the previous unconditional loading.
- Critical reaction-page content no longer starts transparent. The font uses optional display to avoid a late text swap on slow connections. Tailwind scans actual UI/content sources rather than agent instructions, audit artifacts, and architecture examples.
- Added `.nvmrc` for the supported Node runtime used in validation and a repeatable rendered-page regression check: `python3 scripts/check-seo.py http://localhost:3100`.

## Validation

- Production build and TypeScript checks passed using Node 22.22.0.
- ESLint: zero errors, 171 warnings across the project; broad lint cleanup is outside this SEO change.
- Rendered production crawl: all 87 sitemap URLs pass HTTP status, metadata, canonical, heading, indexability and language checks.
- Regression probes pass for language redirects (including query preservation), noindex personal pages, real 404 behavior, matching visible homepage FAQs, and text discovery endpoints.
- Chrome interaction checks pass for first-visit notice, rejection persistence, analytics-only customization, accepting all, reopening preferences, and revocation. No browser page errors were observed.
- Mobile screenshots were inspected for the reaction page and consent controls.

Lighthouse measurements are stored in `lighthouse-home-after.json` and `lighthouse-reaction-after.json`. These are throttled local production lab runs, with no optional cookies selected. The original baseline was measured on the public deployment, so timing differences are not a controlled production before/after comparison. Accepted-cookie sessions load additional third-party work and may have different results. The helper's PWA zero means that category was absent, not a measured failure.

## Final local mobile results

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
|---|---:|---:|---:|---:|---:|---:|
| Homepage | 93 | 100 | 100 | 100 | 3.21 s | 0 |
| Reaction test | 93 | 100 | 100 | 100 | 3.16 s | 0 |

The delayed cookie-banner paint is fixed. **LCP remains above the 2.5-second target** in this mobile lab profile, so performance should not be described as fully solved. Remaining costs include the shared CSS and application JavaScript. An inline-CSS experiment made LCP worse (3.46 seconds), so it was reverted. The retained build uses normal cacheable stylesheets. Production field measurements are still required before choosing a broader CSS/component split or declaring a Core Web Vitals pass.

## After deployment

1. Run the same regression script against the public origin, rerun mobile Lighthouse, and verify ads/analytics under saved preferences.
2. Submit the sitemap and inspect the main tool and article URLs in Search Console. Confirm Google-selected canonicals and retirement of unfinished language URLs.
3. Monitor field LCP, INP, and CLS, plus impressions/clicks by page/query over time. Lab improvements do not establish a Core Web Vitals pass or a ranking gain.
4. Search Console history, backlink quality, independent author credentials, and comprehensive scientific review cannot be established from this repository. No global benchmark data has been fabricated to fill those gaps.

Sources used to correct research references are linked directly in `lib/research-sources.ts`, `app/HomeSEOContent.tsx`, and `app/science/ScienceClient.tsx`. Their presence is not a claim that those studies evaluated Reflextry.
