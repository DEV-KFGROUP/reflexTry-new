import test from "node:test";
import assert from "node:assert/strict";
import { TOOL_MAPPING } from "@/config/tool-mapping";
import { SITE_CATEGORIES } from "@/lib/site-navigation";
import { resolveToolIconSpec } from "@/lib/icons/tool-3d-catalog";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

test("every unique tool in TOOL_MAPPING resolves to a non-default bespoke Tool3DIconSpec", () => {
    const uniqueEntries = new Map<string, string>();
    for (const [slug, href] of Object.entries(TOOL_MAPPING)) {
        if (!uniqueEntries.has(href)) {
            uniqueEntries.set(href, slug);
        }
    }

    assert.ok(uniqueEntries.size >= 70, `Expected >= 70 tools, got ${uniqueEntries.size}`);

    for (const [href, slug] of uniqueEntries.entries()) {
        const byHref = resolveToolIconSpec(href);
        const bySlug = resolveToolIconSpec(slug);

        assert.notEqual(
            byHref.id,
            "default",
            `Tool href "${href}" fell back to default icon spec`
        );
        assert.notEqual(
            bySlug.id,
            "default",
            `Tool slug "${slug}" fell back to default icon spec`
        );
        assert.equal(
            byHref.id,
            bySlug.id,
            `Mismatch between href "${href}" (${byHref.id}) and slug "${slug}" (${bySlug.id})`
        );
        assert.match(byHref.primaryColor, HEX_COLOR, `Invalid primaryColor on ${href}`);
        assert.match(byHref.secondaryColor, HEX_COLOR, `Invalid secondaryColor on ${href}`);
        assert.match(byHref.accentColor, HEX_COLOR, `Invalid accentColor on ${href}`);
        assert.ok(byHref.visualLabel.length >= 4, `Empty visualLabel on ${href}`);
    }
});

test("all 11 SITE_CATEGORIES resolve to dedicated arena 3D icon specs", () => {
    for (const cat of SITE_CATEGORIES) {
        const spec = resolveToolIconSpec(cat.id);
        assert.equal(spec.id, cat.id, `Category "${cat.id}" did not resolve to its own spec`);
        assert.match(spec.primaryColor, HEX_COLOR);
        assert.ok(spec.visualLabel.length >= 4);
    }
});

test("locale-prefixed paths and disambiguated grid/reaction routes resolve accurately", () => {
    assert.equal(resolveToolIconSpec("/es/puzzles/queens").id, "queens");
    assert.equal(resolveToolIconSpec("/reflex/grid").id, "reflex-grid");
    assert.equal(resolveToolIconSpec("/speed/grid").id, "speed-grid");
    assert.equal(resolveToolIconSpec("/reflex/reaction").id, "reaction");
    assert.equal(resolveToolIconSpec("/gaming/reaction").id, "rpg");
});
