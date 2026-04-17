"use client";

import { useEffect } from "react";

/**
 * Client component that ensures the neutral default theme is applied
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.remove("dark");
        root.classList.add("light");
    }, []);

    return <>{children}</>;
}

