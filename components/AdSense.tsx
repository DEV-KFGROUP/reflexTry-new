"use client";

import { useEffect, useState } from "react";

export function AdSense({ pId }: { pId: string }) {
    const [shouldLoad, setShouldLoad] = useState(false);

    useEffect(() => {
        // Delay AdSense loading until after page is fully interactive
        // This reduces initial JavaScript bundle size and HTTP requests
        // Only load when user is likely to see ads (after 3 seconds or on scroll)
        const loadAdSense = () => {
            if (shouldLoad) return;
            setShouldLoad(true);
            
            // Create and inject AdSense script using standard method (not Next.js Script)
            // This avoids the data-nscript attribute that AdSense doesn't support
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-ad-client', pId);
            
            // Only add if not already present
            if (!document.querySelector(`script[src*="adsbygoogle.js?client=${pId}"]`)) {
                document.head.appendChild(script);
            }
        };
        
        // Load after 3 seconds OR on first user interaction (scroll/click)
        const timer = setTimeout(loadAdSense, 3000);
        
        const handleInteraction = () => {
            clearTimeout(timer);
            loadAdSense();
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
    }, [pId, shouldLoad]);

    // Return null - script is injected via useEffect
    return null;
}
