"use client";

import { useEffect } from "react";

/**
 * Client component that ensures dark theme is always applied
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Always apply dark theme
        const root = document.documentElement;
        root.classList.remove("light");
        root.classList.add("dark");
    }, []);

    return <>{children}</>;
}

