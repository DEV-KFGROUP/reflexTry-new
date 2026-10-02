"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, readConsent, type CookieConsent } from "@/lib/cookie-consent";

const GA_TRACKING_ID = "G-Y88CPQZ0HG";

/** Optional third-party scripts load after consent and browser idle time. */
export function GoogleAnalytics() {
    const [consent, setConsent] = useState<CookieConsent | null>(null);
    const activeConsent = useRef<CookieConsent | null>(null);
    useEffect(() => {
        activeConsent.current = readConsent();
        setConsent(activeConsent.current);
        const update = (event: Event) => {
            const next = (event as CustomEvent<CookieConsent>).detail;
            // Already-loaded SDKs cannot be unloaded by removing a script element.
            // Reload after a preference change so disallowed SDKs do not initialize.
            const previous = activeConsent.current;
            if (previous && ((previous.analytics && !next.analytics) || (previous.advertising && !next.advertising))) {
                window.location.reload();
                return;
            }
            activeConsent.current = next;
            setConsent(next);
        };
        window.addEventListener(CONSENT_EVENT, update);
        return () => window.removeEventListener(CONSENT_EVENT, update);
    }, []);

    return <>
        {consent?.analytics && <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} strategy="lazyOnload" />
            <Script id="google-analytics" strategy="lazyOnload">{`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}');
            `}</Script>
        </>}
        {consent?.advertising && <Script id="google-adsense" strategy="lazyOnload" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3064655546051154" crossOrigin="anonymous" />}
    </>;
}
