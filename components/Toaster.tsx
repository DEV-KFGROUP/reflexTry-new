"use client";

import { useEffect, useState } from "react";

// Try to import sonner, fallback to empty component if not available
function getSonnerToaster() {
    if (typeof window === "undefined") {
        return null; // Server-side: return null
    }
    
    try {
        return require("sonner").Toaster;
    } catch {
        return null; // Sonner not installed, use fallback toast instead
    }
}

export function Toaster() {
    const [SonnerToaster, setSonnerToaster] = useState<any>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const ToasterComponent = getSonnerToaster();
        setSonnerToaster(() => ToasterComponent);
    }, []);

    // Don't render anything on server or until mounted
    if (!mounted || !SonnerToaster) {
        return null;
    }
    
    return (
        <SonnerToaster
            position="top-center"
            richColors
            closeButton
            toastOptions={{
                style: {
                    background: 'rgba(0, 0, 0, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                },
            }}
        />
    );
}

