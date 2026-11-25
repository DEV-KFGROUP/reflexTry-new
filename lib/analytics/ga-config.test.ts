import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
    GA_TRACKING_ID,
    GA_GTAG_SRC,
    buildGaBootstrapScript,
    detectAiAssistantTraffic,
} from "./ga-config";

describe("Google Analytics 4 & AI Assistant Traffic Attribution", () => {
    it("configures a valid GA4 Measurement ID and gtag.js URL", () => {
        assert.match(GA_TRACKING_ID, /^G-[A-Z0-9]+$/);
        assert.equal(
            GA_GTAG_SRC,
            `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`
        );
    });

    it("builds a complete GA4 bootstrap script with Consent Mode v2 and AI assistant referral detection", () => {
        const script = buildGaBootstrapScript("G-Y88CPQZ0HG");
        assert.ok(script.includes("window.dataLayer = window.dataLayer || [];"));
        assert.ok(script.includes("function gtag(){dataLayer.push(arguments);}"));
        assert.ok(script.includes("gtag('consent', 'default'"));
        assert.ok(script.includes("gtag('js', new Date());"));
        assert.ok(script.includes("gtag('config', 'G-Y88CPQZ0HG');"));
        assert.ok(script.includes("chatgpt.com"));
        assert.ok(script.includes("perplexity.ai"));
        assert.ok(script.includes("ai_assistant_referral"));
    });

    it("detects visits sent by ChatGPT, Perplexity, Claude, Gemini, and Copilot via referrer or UTM source", () => {
        const chatgptRef = detectAiAssistantTraffic("https://chatgpt.com/c/12345");
        assert.deepEqual(chatgptRef, {
            isAiReferral: true,
            source: "chatgpt",
            medium: "ai_assistant",
            referrerHost: "chatgpt.com",
        });

        const chatgptUtm = detectAiAssistantTraffic("", "?utm_source=chatgpt.com");
        assert.deepEqual(chatgptUtm, {
            isAiReferral: true,
            source: "chatgpt",
            medium: "ai_assistant",
            referrerHost: "chatgpt.com",
        });

        const perplexityRef = detectAiAssistantTraffic("https://www.perplexity.ai/search/brain-games");
        assert.deepEqual(perplexityRef, {
            isAiReferral: true,
            source: "perplexity",
            medium: "ai_assistant",
            referrerHost: "www.perplexity.ai",
        });

        const claudeRef = detectAiAssistantTraffic("https://claude.ai/chat/abc");
        assert.equal(claudeRef.isAiReferral, true);
        assert.equal(claudeRef.source, "claude");

        const geminiRef = detectAiAssistantTraffic("https://gemini.google.com/app");
        assert.equal(geminiRef.isAiReferral, true);
        assert.equal(geminiRef.source, "gemini");

        const organicRef = detectAiAssistantTraffic("https://www.google.com/search?q=reflextry");
        assert.deepEqual(organicRef, {
            isAiReferral: false,
            source: null,
            medium: null,
            referrerHost: null,
        });
    });
});
