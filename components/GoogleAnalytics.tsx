"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const GA_TRACKING_ID = "G-Y88CPQZ0HG";

export function GoogleAnalytics() {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Delay Google Analytics loading until after page is interactive
        // This reduces initial JavaScript bundle size and HTTP requests
        // Analytics doesn't need to load immediately - it can wait for user engagement
        const loadAnalytics = () => {
            setShouldLoad(true);
        };
        
        // Load after 2 seconds OR on first user interaction
        const timer = setTimeout(loadAnalytics, 2000);
        
        const handleInteraction = () => {
            clearTimeout(timer);
            loadAnalytics();
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };
        
        // Load on first scroll or click (user is engaged)
        window.addEventListener('scroll', handleInteraction, { once: true, passive: true });
        window.addEventListener('click', handleInteraction, { once: true });

        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        };
    }, []);

    if (!shouldLoad) return null;

    return (
        <>
            {/* Google tag (gtag.js) */}
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                strategy="lazyOnload"
            />
            <Script
                id="google-analytics"
                strategy="lazyOnload"
                dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}');
                    `,
                }}
            />
        </>
    );
}

