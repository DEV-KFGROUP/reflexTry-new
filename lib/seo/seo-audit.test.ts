import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { SEO_CONFIGS } from "@/config/seo-config";
import { PUZZLE_LIST, PUZZLES_HUB_FAQS } from "@/lib/puzzles/meta";
import { FLAGSHIP_TOOLS_META } from "@/lib/flagship-tools-meta";
import { fitMetaDescription, formatSeoTitle } from "@/components/SEO";
import { getHomeMetadata } from "@/lib/seo-utils";
import {
    generateArticleStructuredData,
    generateBreadcrumbStructuredData,
    generateFAQPageSchema,
    generateHowToSchema,
    generateItemListSchema,
    generateOrganizationSchema,
    generateToolStructuredData,
    generateWebPageSchema,
    generateWebsiteStructuredData,
    safeJsonLdStringify,
} from "@/lib/structured-data";

const ROOT = process.cwd();
const INTENTIONAL_NOINDEX_ROUTES = new Set(["/achievements", "/challenges", "/statistics"]);

function walkPageFiles(dir: string, acc: string[] = []): string[] {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkPageFiles(full, acc);
        } else if (entry.name === "page.tsx") {
            acc.push(full);
        }
    }
    return acc;
}

function fileToRoute(filePath: string): string {
    const rel = path.relative(path.join(ROOT, "app"), filePath);
    const dir = path.dirname(rel);
    if (dir === ".") return "/";
    return "/" + dir.split(path.sep).join("/");
}

describe("Full-Site Technical & On-Page SEO Audit", () => {
    it("all SEO_CONFIGS entries produce SERP-safe titles (<=60 chars, single brand suffix) and descriptions", () => {
        const entries = Object.entries(SEO_CONFIGS);
        assert.ok(entries.length >= 75, `Expected >=75 SEO_CONFIGS entries, found ${entries.length}`);

        for (const [key, cfg] of entries) {
            const formattedTitle = formatSeoTitle(cfg.title, 60);
            assert.ok(
                formattedTitle.length >= 25 && formattedTitle.length <= 60,
                `${key}: formatted title out of bounds (${formattedTitle.length}): "${formattedTitle}"`
            );
            const brandMatches = formattedTitle.match(/Reflextry/gi) || [];
            assert.equal(
                brandMatches.length,
                1,
                `${key}: expected single Reflextry brand suffix in "${formattedTitle}"`
            );

            const safeDesc = fitMetaDescription(cfg.description, 158);
            assert.ok(
                safeDesc.length >= 90 && safeDesc.length <= 160,
                `${key}: description out of bounds (${safeDesc.length}): "${safeDesc}"`
            );
            assert.ok(Array.isArray(cfg.keywords) && cfg.keywords.length >= 3, `${key}: missing keywords`);
        }
    });

    it("all 9 Mensa logic puzzles have zero-truncation metadata, >=3 FAQs, and valid JSON-LD", () => {
        assert.equal(PUZZLE_LIST.length, 9, "Expected exactly 9 Mensa puzzles");
        assert.ok(PUZZLES_HUB_FAQS.length >= 3, "Expected >=3 hub FAQs");

        const hubFaqLd = generateFAQPageSchema(PUZZLES_HUB_FAQS);
        assert.ok(hubFaqLd && hubFaqLd["@type"] === "FAQPage");
        assert.doesNotThrow(() => JSON.parse(safeJsonLdStringify(hubFaqLd)));

        for (const puzzle of PUZZLE_LIST) {
            assert.ok(
                puzzle.title.length <= 60,
                `Puzzle ${puzzle.id} title exceeds 60 chars (${puzzle.title.length}): "${puzzle.title}"`
            );
            assert.ok(
                puzzle.description.length >= 115 && puzzle.description.length <= 160,
                `Puzzle ${puzzle.id} raw description out of SERP bounds (${puzzle.description.length}): "${puzzle.description}"`
            );
            assert.ok(
                puzzle.faqs.length >= 3,
                `Puzzle ${puzzle.id} must define >=3 FAQs`
            );

            const schemas = [
                generateToolStructuredData(`puzzle-${puzzle.id}`, puzzle.shortTitle, puzzle.description, puzzle.path, "en"),
                generateBreadcrumbStructuredData(
                    [
                        { name: "Home", url: "/" },
                        { name: "Logic Puzzles", url: "/puzzles" },
                        { name: puzzle.shortTitle, url: puzzle.path },
                    ],
                    "en"
                ),
                generateWebPageSchema(puzzle.shortTitle, puzzle.description, puzzle.path, "en"),
                generateHowToSchema(puzzle.shortTitle, puzzle.rules),
                generateFAQPageSchema(puzzle.faqs),
            ];

            for (const schema of schemas) {
                assert.ok(schema, `Null schema for puzzle ${puzzle.id}`);
                const serialized = safeJsonLdStringify(schema);
                assert.ok(!serialized.includes("</script>"), "Unsafe script termination in JSON-LD");
                const parsed = JSON.parse(serialized);
                assert.equal(parsed["@context"], "https://schema.org");
            }
        }
    });

    it("all 7 Flagship Classics & Productivity tools have SERP-safe metadata, >=3 FAQs, and valid JSON-LD", () => {
        const entries = Object.entries(FLAGSHIP_TOOLS_META);
        assert.equal(entries.length, 7, "Expected 7 flagship tools");

        for (const [id, item] of entries) {
            assert.ok(item.title.length <= 60, `Flagship ${id} title exceeds 60 chars: ${item.title}`);
            assert.ok(
                item.description.length >= 115 && item.description.length <= 160,
                `Flagship ${id} description out of bounds (${item.description.length})`
            );
            assert.ok(item.faqs.length >= 3, `Flagship ${id} must define >=3 FAQs`);

            const faqSchema = generateFAQPageSchema(item.faqs);
            assert.ok(faqSchema && faqSchema["@type"] === "FAQPage");
            assert.equal(faqSchema.mainEntity.length, item.faqs.length);
            assert.doesNotThrow(() => JSON.parse(safeJsonLdStringify(faqSchema)));
        }
    });

    it("homepage metadata, WebSite SearchAction, Organization, and ItemList schemas are valid", () => {
        const homeMeta = getHomeMetadata("en");
        const titleStr =
            typeof homeMeta.title === "object" && homeMeta.title && "absolute" in homeMeta.title
                ? String(homeMeta.title.absolute)
                : String(homeMeta.title || "");
        assert.ok(titleStr.length >= 35 && titleStr.length <= 60, `Home title length ${titleStr.length}`);
        assert.ok(
            typeof homeMeta.description === "string" &&
                homeMeta.description.length >= 120 &&
                homeMeta.description.length <= 160,
            `Home description length ${String(homeMeta.description).length}`
        );

        const langs = homeMeta.alternates?.languages as Record<string, string> | undefined;
        assert.ok(langs, "Home hreflang alternates missing");
        assert.equal(Object.keys(langs).length, 17, "Expected 16 locales + x-default hreflang alternates");
        assert.ok(langs["x-default"], "Missing x-default hreflang");

        const siteLd = generateWebsiteStructuredData("en");
        assert.equal(siteLd["@type"], "WebSite");
        assert.equal(siteLd.potentialAction["@type"], "SearchAction");
        assert.match(siteLd.potentialAction.target.urlTemplate, /\/tools\?q=\{search_term_string\}$/);

        const orgLd = generateOrganizationSchema();
        assert.equal(orgLd["@type"], "Organization");
        assert.ok(orgLd.knowsAbout.includes("Mensa Logic Puzzles"));

        const listLd = generateItemListSchema([
            { position: 1, name: "Mensa Logic Puzzles", url: "/puzzles", description: "9 logic games" },
        ]);
        assert.equal(listLd["@type"], "ItemList");
        assert.equal(listLd.numberOfItems, 1);
    });

    it("all blog MDX articles have clean <=160 char descriptions and valid Article JSON-LD with wordCount", () => {
        const blogDir = path.join(ROOT, "content/blog");
        const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".mdx"));
        assert.ok(files.length >= 20, `Expected >=20 blog MDX files, found ${files.length}`);

        for (const file of files) {
            const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
            const descMatch = raw.match(/^description:\s*['"](.+?)['"]\s*$/m);
            const titleMatch = raw.match(/^title:\s*['"](.+?)['"]\s*$/m);
            assert.ok(titleMatch, `${file}: missing title frontmatter`);
            assert.ok(descMatch, `${file}: missing description frontmatter`);
            const desc = descMatch[1];
            assert.ok(
                desc.length >= 80 && desc.length <= 160,
                `${file}: description length ${desc.length} outside [80..160]: "${desc}"`
            );

            const articleLd = generateArticleStructuredData(
                {
                    title: titleMatch[1],
                    description: desc,
                    publishedAt: "2025-01-15",
                    category: "Science",
                } as any,
                file.replace(/\.mdx$/, ""),
                "en",
                850
            );
            assert.equal(articleLd["@type"], "Article");
            assert.equal(articleLd.wordCount, 850);
            assert.equal(articleLd.articleSection, "Science");
            assert.doesNotThrow(() => JSON.parse(safeJsonLdStringify(articleLd)));
        }
    });

    it("100% of indexable app/**/page.tsx routes are Server Components with metadata and match app/sitemap.ts with zero deleted routes", () => {
        const pageFiles = walkPageFiles(path.join(ROOT, "app"));
        assert.ok(pageFiles.length >= 100, `Expected >=100 app routes, found ${pageFiles.length}`);

        const sitemapSource = fs.readFileSync(path.join(ROOT, "app/sitemap.ts"), "utf8");
        assert.ok(!sitemapSource.includes("/games-2d"), "Stale /games-2d found in sitemap.ts");
        assert.ok(!sitemapSource.includes("/games-3d"), "Stale /games-3d found in sitemap.ts");

        const sitemapRouteMatches = new Set(
            Array.from(sitemapSource.matchAll(/'(\/[^']*)'/g)).map((m) => m[1])
        );
        sitemapRouteMatches.add("/");

        for (const file of pageFiles) {
            const route = fileToRoute(file);
            assert.ok(!route.startsWith("/games-2d") && !route.startsWith("/games-3d"), `Stale deleted route ${route}`);

            const src = fs.readFileSync(file, "utf8");
            assert.ok(
                !/^['"]use client['"]/m.test(src),
                `Route ${route} (${file}) must be a Server Component to export metadata`
            );
            assert.ok(
                /export\s+(async\s+function\s+generateMetadata|const\s+metadata)\b/.test(src),
                `Route ${route} is missing metadata / generateMetadata export`
            );

            if (route.includes("[") || INTENTIONAL_NOINDEX_ROUTES.has(route)) {
                continue;
            }
            assert.ok(
                sitemapRouteMatches.has(route),
                `Indexable route ${route} is missing from app/sitemap.ts`
            );
        }
    });

    it("eliminates render-blocking stylesheets and defers heavy Three.js / Framer Motion bundles from the initial critical path", () => {
        const nextConfigSrc = fs.readFileSync(path.join(ROOT, "next.config.ts"), "utf8");
        assert.match(
            nextConfigSrc,
            /\binlineCss:\s*true\b/,
            "next.config.ts must enable experimental.inlineCss: true to eliminate render-blocking external CSS links"
        );
        assert.match(
            nextConfigSrc,
            /\bcssChunking:\s*['"]strict['"]/,
            "next.config.ts must enable strict cssChunking"
        );

        const layoutSrc = fs.readFileSync(path.join(ROOT, "app/layout.tsx"), "utf8");
        assert.match(
            layoutSrc,
            /id=["']critical-above-the-fold-css["']/,
            "app/layout.tsx must inline critical above-the-fold CSS in <head>"
        );
        assert.doesNotMatch(
            layoutSrc,
            /<link[^>]+rel=["']stylesheet["']/i,
            "app/layout.tsx must not hardcode render-blocking external <link rel='stylesheet'> tags"
        );

        const toolIconSrc = fs.readFileSync(path.join(ROOT, "components/ToolIcon.tsx"), "utf8");
        assert.doesNotMatch(
            toolIconSrc,
            /^import\s+.*from\s+["']three["']/m,
            "components/ToolIcon.tsx must not statically import three at top level"
        );
        assert.doesNotMatch(
            toolIconSrc,
            /^import\s+.*from\s+["']@\/lib\/three\/icon-renderer["']/m,
            "components/ToolIcon.tsx must dynamically import @/lib/three/icon-renderer during idle time"
        );
        assert.match(
            toolIconSrc,
            /import\(["']@\/lib\/three\/icon-renderer["']\)/,
            "components/ToolIcon.tsx must lazily import @/lib/three/icon-renderer"
        );

        for (const rootChromeFile of [
            "components/ThemeProvider.tsx",
            "components/Navbar.tsx",
            "components/LanguageSwitcher.tsx",
            "components/ui/Button.tsx",
        ]) {
            const chromeSrc = fs.readFileSync(path.join(ROOT, rootChromeFile), "utf8");
            assert.doesNotMatch(
                chromeSrc,
                /^import\s+.*from\s+["']framer-motion["']/m,
                `${rootChromeFile} must not pull framer-motion into the synchronous root layout bundle`
            );
        }

        const lazySrc = fs.readFileSync(path.join(ROOT, "components/LazyLoadedComponents.tsx"), "utf8");
        assert.match(
            lazySrc,
            /requestIdleCallback/,
            "LazyLoadedComponents.tsx must defer mounting non-critical background widgets until browser idle"
        );

        const gaSrc = fs.readFileSync(path.join(ROOT, "components/GoogleAnalytics.tsx"), "utf8");
        assert.doesNotMatch(
            gaSrc,
            /strategy=["']beforeInteractive["']/,
            "GoogleAnalytics.tsx must never use render-blocking beforeInteractive scripts"
        );
        assert.match(
            gaSrc,
            /strategy=["']lazyOnload["']/,
            "GoogleAnalytics.tsx must defer third-party scripts with lazyOnload"
        );

        assert.match(
            layoutSrc,
            /<script\s+async\s+src=\{GA_GTAG_SRC\}\s*\/>/,
            "app/layout.tsx must render non-blocking <script async src={GA_GTAG_SRC} /> in <head> for Google Analytics detection"
        );
        assert.match(
            layoutSrc,
            /id=["']google-analytics["']/,
            "app/layout.tsx must render the inline #google-analytics gtag config script in <head>"
        );
    });
});

