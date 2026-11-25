"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, readConsent, type CookieConsent } from "@/lib/cookie-consent";
import {
    GA_TRACKING_ID,
    GA_GTAG_SRC,
    buildGaBootstrapScript,
    detectAiAssistantTraffic,
} from "@/lib/analytics/ga-config";

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

/**
 * Renders the non-blocking Google Analytics 4 (gtag.js) script tags in <head>
 * with Google Consent Mode v2 and AI assistant referral detection.
 */
export function GoogleAnalyticsHead() {
    return (
        <>
            <script async src={GA_GTAG_SRC} />
            <script
                id="google-analytics"
                dangerouslySetInnerHTML={{
                    __html: buildGaBootstrapScript(GA_TRACKING_ID),
                }}
            />
        </>
    );
}

/**
 * Synchronizes CookieBanner consent changes with Google Consent Mode v2,
 * records SPA route navigation pageviews, and defers optional AdSense scripts with lazyOnload.
 */
export function GoogleAnalytics() {
    const pathname = usePathname();
    const [consent, setConsent] = useState<CookieConsent | null>(null);
    const activeConsent = useRef<CookieConsent | null>(null);
    const hasTrackedInitialPath = useRef(false);

    useEffect(() => {
        const current = readConsent();
        activeConsent.current = current;
        setConsent(current);

        if (current && typeof window.gtag === "function") {
            window.gtag("consent", "update", {
                analytics_storage: current.analytics ? "granted" : "denied",
                ad_storage: current.advertising ? "granted" : "denied",
                ad_user_data: current.advertising ? "granted" : "denied",
                ad_personalization: current.advertising ? "granted" : "denied",
            });
        }

        const aiTraffic = detectAiAssistantTraffic(
            typeof document !== "undefined" ? document.referrer : "",
            typeof window !== "undefined" ? window.location.search : ""
        );
        if (aiTraffic.isAiReferral && typeof window.gtag === "function") {
            window.gtag("event", "ai_referral_detected", {
                ai_source: aiTraffic.source,
                traffic_medium: aiTraffic.medium,
                referrer_host: aiTraffic.referrerHost,
            });
        }

        const update = (event: Event) => {
            const next = (event as CustomEvent<CookieConsent>).detail;
            const previous = activeConsent.current;

            if (typeof window.gtag === "function") {
                window.gtag("consent", "update", {
                    analytics_storage: next.analytics ? "granted" : "denied",
                    ad_storage: next.advertising ? "granted" : "denied",
                    ad_user_data: next.advertising ? "granted" : "denied",
                    ad_personalization: next.advertising ? "granted" : "denied",
                });
            }

            if (previous && previous.advertising && !next.advertising) {
                window.location.reload();
                return;
            }
            activeConsent.current = next;
            setConsent(next);
        };

        window.addEventListener(CONSENT_EVENT, update);
        return () => window.removeEventListener(CONSENT_EVENT, update);
    }, []);

    useEffect(() => {
        if (!pathname) return;
        if (!hasTrackedInitialPath.current) {
            hasTrackedInitialPath.current = true;
            return;
        }
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag("config", GA_TRACKING_ID, {
                page_path: pathname,
            });
        }
    }, [pathname]);

    return (
        <>
            {consent?.advertising && (
                <Script
                    id="google-adsense"
                    strategy="lazyOnload"
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3064655546051154"
                    crossOrigin="anonymous"
                />
            )}
        </>
    );
}

