import { CONSENT_KEY } from "@/lib/cookie-consent";

export const GA_TRACKING_ID =
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-Y88CPQZ0HG";

export const GA_GTAG_SRC = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;

export interface AiAssistantMatch {
    isAiReferral: boolean;
    source: string | null;
    medium: "ai_assistant" | null;
    referrerHost: string | null;
}

/**
 * Canonical lookup of AI assistant domains and UTM source tokens so Google Analytics 4
 * can separately attribute visits sent by ChatGPT, Perplexity, Claude, Gemini, Copilot, etc.
 */
export const AI_ASSISTANT_HOST_PATTERNS: ReadonlyArray<{
    pattern: RegExp;
    source: string;
}> = [
    { pattern: /(^|\.)chatgpt\.com$/i, source: "chatgpt" },
    { pattern: /(^|\.)chat\.openai\.com$/i, source: "chatgpt" },
    { pattern: /(^|\.)openai\.com$/i, source: "chatgpt" },
    { pattern: /(^|\.)perplexity\.ai$/i, source: "perplexity" },
    { pattern: /(^|\.)claude\.ai$/i, source: "claude" },
    { pattern: /(^|\.)anthropic\.com$/i, source: "claude" },
    { pattern: /(^|\.)gemini\.google\.com$/i, source: "gemini" },
    { pattern: /(^|\.)bard\.google\.com$/i, source: "gemini" },
    { pattern: /(^|\.)copilot\.microsoft\.com$/i, source: "copilot" },
    { pattern: /(^|\.)deepseek\.com$/i, source: "deepseek" },
    { pattern: /(^|\.)grok\.com$/i, source: "grok" },
    { pattern: /(^|\.)x\.ai$/i, source: "grok" },
    { pattern: /(^|\.)meta\.ai$/i, source: "meta_ai" },
    { pattern: /(^|\.)you\.com$/i, source: "you_ai" },
    { pattern: /(^|\.)phind\.com$/i, source: "phind" },
    { pattern: /(^|\.)poe\.com$/i, source: "poe" },
    { pattern: /(^|\.)mistral\.ai$/i, source: "mistral" },
];

export const AI_UTM_SOURCE_PATTERNS: ReadonlyArray<{
    pattern: RegExp;
    source: string;
}> = [
    { pattern: /^(chatgpt\.com|chatgpt|openai)$/i, source: "chatgpt" },
    { pattern: /^(perplexity\.ai|perplexity)$/i, source: "perplexity" },
    { pattern: /^(claude\.ai|claude|anthropic)$/i, source: "claude" },
    { pattern: /^(gemini\.google\.com|gemini|bard)$/i, source: "gemini" },
    { pattern: /^(copilot\.microsoft\.com|copilot|bing_chat)$/i, source: "copilot" },
    { pattern: /^(deepseek\.com|deepseek)$/i, source: "deepseek" },
    { pattern: /^(grok\.com|grok)$/i, source: "grok" },
    { pattern: /^(meta\.ai|meta_ai)$/i, source: "meta_ai" },
    { pattern: /^(you\.com|you_ai)$/i, source: "you_ai" },
    { pattern: /^(phind\.com|phind)$/i, source: "phind" },
    { pattern: /^(poe\.com|poe)$/i, source: "poe" },
    { pattern: /^(mistral\.ai|mistral)$/i, source: "mistral" },
];

/**
 * Pure detector for visits originating from AI assistants (ChatGPT, Perplexity, Claude, Gemini, Copilot, etc.)
 * via either HTTP Referer header / document.referrer or query parameters (utm_source / ref).
 */
export function detectAiAssistantTraffic(
    referrer: string | null | undefined,
    search?: string | URLSearchParams | null
): AiAssistantMatch {
    if (search) {
        try {
            const params =
                typeof search === "string"
                    ? new URLSearchParams(search.startsWith("?") ? search.slice(1) : search)
                    : search;
            const candidate = (
                params.get("utm_source") ||
                params.get("ref") ||
                params.get("source") ||
                ""
            ).trim();
            if (candidate) {
                for (const entry of AI_UTM_SOURCE_PATTERNS) {
                    if (entry.pattern.test(candidate)) {
                        return {
                            isAiReferral: true,
                            source: entry.source,
                            medium: "ai_assistant",
                            referrerHost: candidate.toLowerCase(),
                        };
                    }
                }
            }
        } catch {
            // Ignore malformed query strings
        }
    }

    if (referrer && referrer.trim().length > 0) {
        try {
            const parsed = new URL(referrer);
            const host = parsed.hostname.toLowerCase();
            for (const entry of AI_ASSISTANT_HOST_PATTERNS) {
                if (entry.pattern.test(host)) {
                    return {
                        isAiReferral: true,
                        source: entry.source,
                        medium: "ai_assistant",
                        referrerHost: host,
                    };
                }
            }
        } catch {
            // Ignore invalid referrer URLs
        }
    }

    return {
        isAiReferral: false,
        source: null,
        medium: null,
        referrerHost: null,
    };
}

/**
 * Builds the standard Google tag (gtag.js) inline initialization snippet with
 * Google Consent Mode v2 and automatic AI assistant traffic classification.
 */
export function buildGaBootstrapScript(trackingId: string = GA_TRACKING_ID): string {
    return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
(function() {
  var analyticsGranted = 'denied';
  var adGranted = 'denied';
  try {
    var raw = window.localStorage.getItem('${CONSENT_KEY}');
    if (raw === 'accepted') {
      analyticsGranted = 'granted';
      adGranted = 'granted';
    } else if (raw && raw !== 'customized') {
      var parsed = JSON.parse(raw);
      if (parsed && parsed.analytics === true) analyticsGranted = 'granted';
      if (parsed && parsed.advertising === true) adGranted = 'granted';
    }
  } catch (e) {}
  gtag('consent', 'default', {
    analytics_storage: analyticsGranted,
    ad_storage: adGranted,
    ad_user_data: adGranted,
    ad_personalization: adGranted,
    wait_for_update: 500
  });
})();
gtag('js', new Date());
gtag('config', '${trackingId}');
(function() {
  try {
    var ref = document.referrer || '';
    var search = window.location ? window.location.search : '';
    var combined = (ref + ' ' + search).toLowerCase();
    var aiMap = [
      ['chatgpt.com', 'chatgpt'],
      ['chat.openai.com', 'chatgpt'],
      ['perplexity.ai', 'perplexity'],
      ['claude.ai', 'claude'],
      ['gemini.google.com', 'gemini'],
      ['copilot.microsoft.com', 'copilot'],
      ['deepseek.com', 'deepseek'],
      ['grok.com', 'grok'],
      ['meta.ai', 'meta_ai'],
      ['you.com', 'you_ai'],
      ['phind.com', 'phind']
    ];
    for (var i = 0; i < aiMap.length; i++) {
      if (combined.indexOf(aiMap[i][0]) !== -1) {
        gtag('event', 'ai_assistant_referral', {
          ai_source: aiMap[i][1],
          traffic_medium: 'ai_assistant',
          page_path: window.location ? window.location.pathname : '/'
        });
        break;
      }
    }
  } catch (e) {}
})();
`.trim();
}
