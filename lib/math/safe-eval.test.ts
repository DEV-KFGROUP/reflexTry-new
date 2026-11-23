import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { compileMathExpression, safeEvalMath } from "./safe-eval";

const ROOT = process.cwd();

function walkTsFiles(dir: string, acc: string[] = []): string[] {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "dist") continue;
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            walkTsFiles(full, acc);
        } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name) && !entry.name.endsWith(".test.ts")) {
            acc.push(full);
        }
    }
    return acc;
}

describe("safeEvalMath & compileMathExpression", () => {
    it("evaluates standard arithmetic, precedence, unary operators, and right-associative powers", () => {
        assert.equal(safeEvalMath("2 + 3 * 4"), 14);
        assert.equal(safeEvalMath("(2 + 3) * 4"), 20);
        assert.equal(safeEvalMath("-5 + 12 / 3"), -1);
        assert.equal(safeEvalMath("2^3^2"), 512);
        assert.equal(safeEvalMath("10 × 2 ÷ 4"), 5);
    });

    it("supports implicit multiplication and variable x substitution", () => {
        assert.equal(safeEvalMath("2x + 3", 5), 13);
        assert.equal(safeEvalMath("2(x + 1)", 4), 10);
        assert.equal(safeEvalMath("(x + 1)(x - 1)", 5), 24);
        assert.ok(Math.abs(safeEvalMath("2sin(pi/2)") - 2) < 1e-12);
    });

    it("evaluates scientific calculator default expression and trig in rad/deg", () => {
        assert.ok(Math.abs(safeEvalMath("sqrt(144) + sin(pi/2) * 5", 0, false) - 17) < 1e-12);
        assert.ok(Math.abs(safeEvalMath("sin(90)", 0, true) - 1) < 1e-12);
        assert.ok(Math.abs(safeEvalMath("cos(180)", 0, true) - -1) < 1e-12);
        assert.ok(Math.abs(safeEvalMath("asin(1)", 0, true) - 90) < 1e-12);
        assert.ok(Math.abs(safeEvalMath("log(1000) + ln(e)") - 4) < 1e-12);
        assert.equal(safeEvalMath("pow(2, 8) + max(3, 9) - min(4, 2)"), 263);
    });

    it("pre-compiles plot expressions once and evaluates across domain samples", () => {
        const fn = compileMathExpression("0.25 * x^2 - 2", false);
        assert.ok(fn !== null);
        assert.equal(fn(0), -2);
        assert.equal(fn(4), 2);
        assert.equal(fn(-4), 2);
    });

    it("rejects invalid syntax, excessive length, excessive depth, and code-injection attempts", () => {
        assert.ok(Number.isNaN(safeEvalMath("")));
        assert.ok(Number.isNaN(safeEvalMath("1 / 0")));
        assert.ok(Number.isNaN(safeEvalMath("2 + * 3")));
        assert.ok(Number.isNaN(safeEvalMath("1+".repeat(150) + "1")));
        assert.ok(Number.isNaN(safeEvalMath("(".repeat(60) + "1" + ")".repeat(60))));

        const payloads = [
            'constructor.constructor("return 1")()',
            "globalThis.process",
            "window.alert(1)",
            "process.exit(1)",
            'eval("1+1")',
            "__proto__",
            "alert(1)",
            "Function('return 1')()",
        ];
        for (const payload of payloads) {
            assert.equal(compileMathExpression(payload, false), null, `Should reject: ${payload}`);
            assert.ok(Number.isNaN(safeEvalMath(payload, 0, false)), `Should return NaN for: ${payload}`);
        }
    });
});

describe("Codebase security, bundle, and SEO optimization guardrails", () => {
    it("contains zero eval() or new Function() calls across app/, components/, and lib/", () => {
        const dirs = ["app", "components", "lib"].map((d) => path.join(ROOT, d));
        const offenders: string[] = [];
        const forbidden = /\beval\s*\(|\bnew\s+Function\s*\(/;

        for (const dir of dirs) {
            for (const file of walkTsFiles(dir)) {
                const raw = fs.readFileSync(file, "utf8");
                const stripped = raw
                    .replace(/\/\*[\s\S]*?\*\//g, "")
                    .replace(/\/\/.*$/gm, "");
                if (forbidden.test(stripped)) {
                    offenders.push(path.relative(ROOT, file));
                }
            }
        }
        assert.deepEqual(offenders, [], `Found forbidden dynamic code execution in: ${offenders.join(", ")}`);
    });

    it("ensures no client component imports server-only lib/tool-content or lib/seo-utils", () => {
        const dirs = ["app", "components"].map((d) => path.join(ROOT, d));
        const offenders: string[] = [];

        for (const dir of dirs) {
            for (const file of walkTsFiles(dir)) {
                const src = fs.readFileSync(file, "utf8");
                const isClient = /^\s*["']use client["']/.test(src);
                if (isClient && /@\/lib\/(tool-content|seo-utils)/.test(src)) {
                    offenders.push(path.relative(ROOT, file));
                }
            }
        }
        assert.deepEqual(offenders, [], `Client files should not import server content/SEO libs: ${offenders.join(", ")}`);
    });

    it("keeps non-English i18n dictionaries dynamically loaded out of the root client bundle", () => {
        const ctxSrc = fs.readFileSync(path.join(ROOT, "lib/i18n/context.tsx"), "utf8");
        assert.doesNotMatch(ctxSrc, /import\s+\w+\s+from\s+["']\.\/dictionaries\/(es|pt|de|fr|ja|ko|ru|it|pl|tr|id|vi|zh-CN|zh-TW|nl)\.json["']/);
    });

    it("keeps manifest.json aligned with Clinical Light palette and clean copy", () => {
        const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "public/manifest.json"), "utf8"));
        assert.equal(manifest.background_color.toLowerCase(), "#faf9f6");
        assert.equal(manifest.theme_color.toLowerCase(), "#161614");
        assert.doesNotMatch(manifest.description, /gen z/i);
    });

    it("exports force-static on app/robots.ts and avoids duplicate ToolContent on /memory/color", () => {
        const robotsSrc = fs.readFileSync(path.join(ROOT, "app/robots.ts"), "utf8");
        assert.match(robotsSrc, /export const dynamic\s*=\s*['"]force-static['"]/);

        const colorClientSrc = fs.readFileSync(path.join(ROOT, "app/memory/color/ColorMemoryPageClient.tsx"), "utf8");
        assert.doesNotMatch(colorClientSrc, /<ToolContent\b/);
    });
});
