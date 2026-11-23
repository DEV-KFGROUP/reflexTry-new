import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {
    SITE_CATEGORIES,
    PRIMARY_HEADER_LINKS,
    PROGRESS_LINKS,
    RESEARCH_LINKS,
    COMPANY_LEGAL_LINKS,
    auditSiteNavigation,
    buildAllPagesDirectory,
} from "./site-navigation";
import { TOOL_COUNT } from "../config/tool-mapping";

const APP_DIR = path.join(process.cwd(), "app");

function discoverAppRoutes(dir: string, prefix = ""): Set<string> {
    const routes = new Set<string>();
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith("(") || entry.name === "api") continue;
            const childPrefix = `${prefix}/${entry.name}`;
            for (const route of discoverAppRoutes(path.join(dir, entry.name), childPrefix)) {
                routes.add(route);
            }
        } else if (entry.name === "page.tsx") {
            routes.add(prefix === "" ? "/" : prefix);
        }
    }
    return routes;
}

test("Menu Checker: every Header and Footer link resolves to a real app route with 100% top-level page coverage", () => {
    const existingRoutes = discoverAppRoutes(APP_DIR);
    const report = auditSiteNavigation(existingRoutes);

    assert.deepEqual(
        report.brokenHeaderLinks,
        [],
        `Broken Header menu links found: ${report.brokenHeaderLinks.join(", ")}`
    );
    assert.deepEqual(
        report.brokenFooterLinks,
        [],
        `Broken Footer links found: ${report.brokenFooterLinks.join(", ")}`
    );
    assert.deepEqual(
        report.missingFromHeader,
        [],
        `Top-level pages missing from Header menu: ${report.missingFromHeader.join(", ")}`
    );
    assert.deepEqual(
        report.missingFromFooter,
        [],
        `Top-level pages missing from Footer: ${report.missingFromFooter.join(", ")}`
    );
    assert.deepEqual(
        report.duplicateLinksBySection,
        {},
        `Duplicate menu links found: ${JSON.stringify(report.duplicateLinksBySection)}`
    );
    assert.equal(report.passed, true);
});

test("Menu Checker: all 11 arenas have positive tool counts summing to TOOL_COUNT", () => {
    assert.equal(SITE_CATEGORIES.length, 11);
    const total = SITE_CATEGORIES.reduce((sum, cat) => sum + cat.toolCount, 0);
    assert.equal(total, TOOL_COUNT, `Expected category tool counts (${total}) to match TOOL_COUNT (${TOOL_COUNT})`);
    for (const cat of SITE_CATEGORIES) {
        assert.ok(cat.toolCount > 0, `Category ${cat.id} must have > 0 tools`);
    }
});

test("Menu Checker: top-level primary bar stays concise (<= 5 direct items) while All Pages directory covers every route", () => {
    assert.ok(PRIMARY_HEADER_LINKS.length <= 5, "Primary top bar should stay uncrowded (<= 5 links)");
    const existingRoutes = discoverAppRoutes(APP_DIR);
    const directory = buildAllPagesDirectory();
    const dirSet = new Set(directory.map((item) => item.href));

    for (const route of existingRoutes) {
        if (route.includes("[")) continue;
        assert.ok(
            dirSet.has(route),
            `Route ${route} is missing from the searchable All Pages header directory`
        );
    }

    assert.ok(PROGRESS_LINKS.length >= 4);
    assert.ok(RESEARCH_LINKS.length >= 5);
    assert.ok(COMPANY_LEGAL_LINKS.length >= 5);
});

test("Menu Checker: auditSiteNavigation accurately detects broken links and missing pages", () => {
    const incompleteRoutes = new Set(["/", "/puzzles", "/about"]);
    const report = auditSiteNavigation(incompleteRoutes);
    assert.equal(report.passed, false);
    assert.ok(report.brokenHeaderLinks.includes("/gaming"));
    assert.ok(report.brokenFooterLinks.includes("/methodology"));
});
