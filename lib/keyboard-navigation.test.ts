import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { TOOL_MAPPING } from "@/config/tool-mapping";
import {
    TOOL_CATEGORY_HUBS,
    mapKeyToToolAction,
    parseCapturedKeys,
    resolveToolPageContext,
    shouldIgnoreKeyboardEvent,
} from "./keyboard-navigation";

describe("Global Tool Keyboard Navigation", () => {
    it("resolves every published tool path in TOOL_MAPPING to its category hub", () => {
        const uniquePaths = Array.from(new Set(Object.values(TOOL_MAPPING)));
        assert.ok(uniquePaths.length >= 75, `Expected >=75 unique tool paths, got ${uniquePaths.length}`);

        for (const toolPath of uniquePaths) {
            const ctx = resolveToolPageContext(toolPath);
            assert.ok(ctx, `Expected tool context for ${toolPath}`);
            assert.equal(ctx.isToolPage, true);
            assert.equal(ctx.locale, "en");
            assert.equal(ctx.cleanPath, toolPath);

            const expectedCategory = toolPath.split("/")[1];
            assert.equal(ctx.category, expectedCategory);
            assert.equal(ctx.hubPath, TOOL_CATEGORY_HUBS[expectedCategory].hubPath);
        }
    });

    it("preserves locale prefix in category hubPath for localized tool routes", () => {
        const cases = [
            { path: "/es/gaming/aim", locale: "es", hubPath: "/es/gaming", category: "gaming" },
            { path: "/ja/puzzles/queens", locale: "ja", hubPath: "/ja/puzzles", category: "puzzles" },
            { path: "/zh-CN/accuracy/angle-estimation", locale: "zh-CN", hubPath: "/zh-CN/accuracy", category: "accuracy" },
            { path: "/de/lab-3d/solar-gravity/", locale: "de", hubPath: "/de/lab-3d", category: "lab-3d" },
            { path: "/fr/classics/wordle?mode=daily", locale: "fr", hubPath: "/fr/classics", category: "classics" },
        ];

        for (const c of cases) {
            const ctx = resolveToolPageContext(c.path);
            assert.ok(ctx, `Expected localized context for ${c.path}`);
            assert.equal(ctx.locale, c.locale);
            assert.equal(ctx.category, c.category);
            assert.equal(ctx.hubPath, c.hubPath);
        }
    });

    it("returns null for non-tool pages and category hub index pages", () => {
        const nonToolRoutes = [
            "/",
            "/es",
            "/tools",
            "/about",
            "/blog",
            "/blog/how-to-improve-reaction-time",
            "/science",
            "/methodology",
            "/statistics",
            // Category hubs themselves should not activate tool shortcuts
            "/memory",
            "/reflex",
            "/speed",
            "/accuracy",
            "/gaming",
            "/stem",
            "/lab-3d",
            "/multiplayer",
            "/productivity",
            "/classics",
            "/puzzles",
            "/es/gaming",
            "/ja/puzzles",
        ];

        for (const route of nonToolRoutes) {
            assert.equal(
                resolveToolPageContext(route),
                null,
                `Expected non-tool route ${route} to return null`
            );
        }
    });

    it("maps R, S, and H (case-insensitive) to restart, settings, and hub actions", () => {
        assert.equal(mapKeyToToolAction("r"), "restart");
        assert.equal(mapKeyToToolAction("R"), "restart");
        assert.equal(mapKeyToToolAction("s"), "settings");
        assert.equal(mapKeyToToolAction("S"), "settings");
        assert.equal(mapKeyToToolAction("h"), "hub");
        assert.equal(mapKeyToToolAction("H"), "hub");
        assert.equal(mapKeyToToolAction("Escape"), null);
        assert.equal(mapKeyToToolAction("Enter"), null);
        assert.equal(mapKeyToToolAction(" "), null);
        assert.equal(mapKeyToToolAction("a"), null);
    });

    it("ignores editable inputs, modifier combos, key repeats, prevented events, and captured game keys", () => {
        // Normal body keypress should NOT be ignored
        assert.equal(
            shouldIgnoreKeyboardEvent({ key: "r", targetTagName: "BODY" }),
            false
        );

        // Editable targets MUST be ignored
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", targetTagName: "INPUT" }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", targetTagName: "textarea" }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "h", targetTagName: "SELECT" }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", targetTagName: "DIV", targetIsContentEditable: true }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", targetTagName: "DIV", targetRole: "textbox" }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "h", targetTagName: "DIV", targetRole: "combobox" }), true);

        // Modifiers, repeats, defaultPrevented MUST be ignored
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", ctrlKey: true }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", metaKey: true }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", altKey: true }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "h", repeat: true }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", defaultPrevented: true }), true);

        // Active tool key capture (e.g. Tetris soft-drop 's', Stroop 'r', Wordle 'r,s,h')
        const tetrisCaptured = parseCapturedKeys(["s"]);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", capturedKeys: tetrisCaptured }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "S", capturedKeys: tetrisCaptured }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", capturedKeys: tetrisCaptured }), false);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "h", capturedKeys: tetrisCaptured }), false);

        const wordleCaptured = parseCapturedKeys(["r,s,h"]);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "r", capturedKeys: wordleCaptured }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "s", capturedKeys: wordleCaptured }), true);
        assert.equal(shouldIgnoreKeyboardEvent({ key: "h", capturedKeys: wordleCaptured }), true);
    });
});
