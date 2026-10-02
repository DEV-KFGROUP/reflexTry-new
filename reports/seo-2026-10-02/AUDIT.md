# Reflextry SEO and AEO/GEO audit

Audit date: 2 October 2026. “AGO” interpreted as answer-engine/generative-engine optimization (AEO/GEO).

The site has a working technical SEO foundation, but inconsistent international signals, unsupported public data claims, structured-data mismatches, and mobile rendering delays need attention. These are observable issues, not proof of a Google penalty or the cause of a particular ranking position.

## Scope and evidence

- Reviewed the Next.js route inventory (70 page files), shared metadata/schema generators, robots, sitemap, middleware, language handling, content pipeline, 21-post blog inventory, AI discovery files, and representative content/game components.
- Crawled every URL in the production sitemap: **87/87 returned 200**, had a title, description, and one canonical, and none contained noindex. No identical titles or descriptions between these 87 pages.
- Checked six localized URLs, the personal statistics page, a nonexistent URL, and the missing author image: 96 requests in `crawl.json`. Additional focused checks covered achievements, challenges, FAQ visibility, and redirects.
- Ran mobile Lighthouse once each on the live homepage and reaction test. Raw summarized audit output is saved alongside this report. These are lab snapshots, not 28-day field Core Web Vitals or Google ranking scores.
- No application code changed. No Search Console, analytics account, backlink dataset, field INP, or historical ranking data was available. Not every game interaction, viewport, locale URL, external citation, or article claim was individually validated.

## Prioritized findings

### 1. High: multilingual URLs are English-canonical duplicates

Evidence: `/es`, `/de`, `/fr`, `/pt`, `/ja` all return 200 but canonicalize to the English homepage. `/es/reflex/reaction` canonicalizes to `/reflex/reaction`, declares `html lang="en"`, and contains the English question “What is a good reaction time in milliseconds?” in its initial HTML.

`middleware.ts` rewrites language prefixes into English route handlers. `lib/international-seo.ts:36` advertises five non-English variants for every page, while `components/SEO.tsx:94` and blog metadata generate unprefixed canonicals. The layout fixes the document language to English (`app/layout.tsx:92`); translation dictionaries do not translate the full server-rendered article/game content.

Impact: the alternate-language promises do not match the actual pages; Google may consolidate these URLs into English and disregard intended language targeting. This is not evidence that English pages cannot rank.

Fix: either publish complete translated pages with localized metadata, self-canonicals, document language, and reciprocal hreflang, or stop advertising unfinished language variants and redirect unused prefixes to English. Choose the approach based on real translation coverage. Merely adding more countries to schema does not establish country-specific relevance.

### 2. High: benchmark provenance and dataset destination are inconsistent

`lib/geo-stats.ts:23` hard-codes 1,450,000+ tests, 140+ countries, and global averages. Country-specific values are also constants. `components/GeoStatsSection.tsx` displays them as aggregated actual tests on the homepage. No computation, export, sample dates, or provenance for these figures was found in the reviewed implementation; this does not establish that external supporting data cannot exist.

`lib/structured-data.ts:287` describes this as a Dataset but points to `/statistics`. That route is a **personal progress dashboard with noindex**, confirmed live and in `app/statistics/page.tsx`. `public/ai.txt:60` says all data comes from over 1.4 million tests, and `public/llms.txt:73` presents this same dashboard as a public benchmark source.

Fix: substantiate the numbers with an indexable public methodology/dataset page containing sample size, sampling period, device effects, inclusion rules, aggregation method, and provenance. Otherwise remove the unsupported claims or clearly label illustrative values and remove claims of measured global data. Keep the personal dashboard noindex; do not index private/local user progress merely to repair this citation.

### 3. High: mobile LCP needs improvement, especially on first visits

| Metric | Homepage | Reaction test |
|---|---:|---:|
| Performance | 84 | 76 |
| Accessibility | 96 | 96 |
| Best practices | 79 | 79 |
| Basic SEO | 100 | 100 |
| FCP | 2.23 s | 1.22 s |
| LCP | 3.83 s | 7.36 s |
| TBT | 38.5 ms | 26 ms |
| CLS | 0 | 0 |

Homepage LCP was the hero paragraph, with about 3.17 s render delay. Reaction-page LCP was the **cookie-banner paragraph**, with about 6.73 s render delay. `components/CookieBanner.tsx:15` waits for hydration, checks local storage, then waits another second before animating in. This makes the banner a late large paint on first visits; the measurement does not mean the game takes 7.36 seconds to become visible.

Lighthouse estimated 269 KiB unused JS on the homepage and 266 KiB on the reaction page. Most homepage savings were AdSense and Google Analytics scripts. AdSense loads globally in `app/layout.tsx:104`. Revisit third-party loading, banner initial rendering/size, critical CSS/font delivery, and above-the-fold animation timing; remeasure after each change. Do not remove necessary consent functionality simply to improve a score.

Use field data before concluding the site fails Google's Core Web Vitals assessment. TBT is not INP. The helper reports PWA 0 when the Lighthouse category is absent; that is **not** a demonstrated PWA failure or ranking issue. Its automatic “critical” labels also include diagnostics, so they should not be treated as SEO penalties.

### 4. Medium: all 21 blog titles repeat the brand

Live titles end in `| Reflextry | Reflextry`. `app/blog/[slug]/page.tsx:38` adds the suffix, then the root layout's `%s | Reflextry` template adds it again.

Fix: return `title: meta.title` and allow the parent template to append the brand, or use an absolute title as the shared SEO helper already does. This improves title clarity and avoids wasting display space; it is not a sitewide indexing blocker.

### 5. Medium: FAQ and search schema do not reliably describe visible functionality

Homepage FAQ schema in `app/page.tsx` uses different questions from `app/HomeSEOContent.tsx`. All three exact schema questions were absent from the visible initial HTML. The `/tools` route also emits three FAQ questions absent from its visible page. Source inspection confirms these are independently maintained definitions, not one shared visible FAQ data source. Reaction-page FAQ questions, in contrast, were present in visible HTML.

Fix: generate visible FAQ content and JSON-LD from the same data, or remove unsupported markup. Review answer text as well as question text. `lib/structured-data.ts:50` also declares a `/tools?q=...` SearchAction, while the tools directory does not implement query-based search in the inspected code. Remove it or implement the promised search.

These are structured-data accuracy issues. Extra FAQ/HowTo/Speakable markup is not a guarantee of rich results, rankings, or AI citations.

### 6. Medium: scientific authorship and claims need traceable evidence

`content/blog/reflex-science.mdx:6` names “Dr. Sarah Chen”; its `/authors/sarah.jpg` image returns 404. Article schema assigns every author `Person` plus “Cognitive Assessment Specialist” (`lib/structured-data.ts:73`), including editorial-team names. The shared author card asserts review by a cognitive-science research team without identifying the reviewer or linking a profile.

Fix: use verified bylines, correct Person/Organization types, real profiles and credentials where applicable, working images, and explicit review attribution. This audit cannot establish whether the named author exists or has the stated credentials.

Many blog posts contain no external source links even though shared copy claims grounding in peer-reviewed literature. Homepage claims about improved driving safety, standardized test results, and gains within 2–4 weeks require direct relevant support or narrower wording. Some newer articles already explain browser measurement limitations and avoid diagnosis promises; apply that editorial standard consistently. The science page has study links, but their accuracy was not fully validated here.

### 7. Medium: sitemap dates track unrelated blog changes

`app/sitemap.ts:92–101` assigns the newest blog date to every non-blog URL, including games and legal pages. This does not reflect those pages' actual significant changes.

Fix: maintain per-page modification dates, or omit lastmod when reliable dates are unavailable. Blog entries already use individual frontmatter dates. Avoid changing timestamps solely to suggest freshness.

### 8. Lower priority: heading hierarchy and accessibility

16 sitemap pages had two H1 elements, including category hubs and several newer tools. `components/CategorySEOContent.tsx:148` contributes a second H1 to category pages. Prefer one descriptive primary title with supporting sections as H2s. Multiple H1s alone are not evidence of a Google penalty.

The main reaction game's H1 is “REFLEX ARENA” rather than the more specific “Reaction Time Test” (`app/reflex/reaction/ReactionGame.tsx:301`). Make visible headings identify the actual tool.

Lighthouse found low-contrast text and visible-label/accessibility-name mismatches on the language selector and cookie-policy link. Correct contrast and have accessible names include their visible labels. These improve usability; do not equate accessibility audit scores with a Google ranking score.

### 9. Lower priority: AI discovery files conflict with product descriptions

`public/llms.txt` describes color blindness as Farnsworth-Munsell style, while SEO configuration describes Ishihara-style plates; it describes color match as Stroop interference, while the configured page description describes RGB hue discrimination. Tool totals also vary (37+, 40+, 45+). These lower-bound counts are not strictly contradictory, but a maintained inventory is clearer.

Fix: derive discovery files and tool descriptions from maintained product data and verify them against actual game behavior. Correct the benchmark citation discussed above first.

## What is already working

- All 87 sitemap URLs are reachable, indexable in their own HTML, and have individual metadata and canonicals.
- Server-rendered educational text and tool instructions are present; a client component designation has not prevented initial HTML content here.
- Robots permits Googlebot crawling and references the production sitemap.
- Nonexistent test URL returns a real 404 with noindex.
- Statistics, achievements, and challenges correctly use noindex and are omitted from the sitemap.
- Non-www and trailing-slash samples returned permanent 308 redirects. Full redirect-chain verification was not completed by the Python probe.
- The site includes visible answer blocks, articles linked to tools, breadcrumbs, organization data, methodology content, and language dictionaries—useful foundations once their claims and metadata are consistent.

## SEO versus AEO/GEO

Google's AI features build on normal search eligibility and helpful, reliable content. There is no special required AI schema. `llms.txt`, `ai.txt`, extra bot allowlists, and Speakable markup are not substitutes for indexable pages, correct facts, and sources worth citing. Google-Extended permission is not a switch for normal Google Search rankings.

Prioritize a working test that answers the query, a concise explanation, transparent score calculation, limitations, factual sourcing, and stable public references. Do not expand generic pages or markup solely for presumed AI visibility.

## Recommended order

1. Correct unsupported benchmark/dataset claims, untranslated hreflang coverage, and visible/schema inconsistencies.
2. Fix blog-title templating and first-visit cookie-banner LCP; then address global third-party loading and remeasure mobile performance.
3. Verify author identities, citations, and claims; align AI text files with product behavior.
4. Correct lastmod dates, secondary headings, and accessibility findings.
5. In Search Console, inspect indexing exclusions, Google-selected canonicals, query/page impressions and clicks, manual actions, and field Core Web Vitals. Compare at least 28–90 days, accounting for releases. Assess backlink quality and competing pages separately. Without this evidence, no audit can honestly identify the exact reason for low rankings or promise a ranking gain.

## Official references

- [Google AI optimization guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide): normal SEO, original value, and no special required schema.
- [Google localized versions](https://developers.google.com/search/docs/specialty/international/localized-versions) and [canonical guidance](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls): align language variants and canonical signals.
- [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies): markup must accurately represent page content.
- [Google sitemap guidance](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): lastmod reflects significant page changes.
- [LCP guidance](https://web.dev/articles/lcp): good LCP is at most 2.5 seconds; field evaluation uses the 75th percentile.

Evidence files: `crawl.json`, `sitemap.xml`, `lighthouse-home.json`, `lighthouse-reaction.json`.
