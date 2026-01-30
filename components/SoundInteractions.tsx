"use client";

import { useEffect } from "react";
import { SoundManager } from "@/utils/soundManager";

export function SoundInteractions() {
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("a") || target.closest(".interactive")) {
                SoundManager.play("click");
            }
        };

        const handleMouseEnter = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (target.closest("button") || target.closest("a") || target.closest(".interactive")) {
                SoundManager.play("hover");
            }
        };

        window.addEventListener("click", handleClick);
        // Using mouseover for delegation since mouseenter doesn't bubble
        window.addEventListener("mouseover", handleMouseEnter);

        return () => {
            window.removeEventListener("click", handleClick);
            window.removeEventListener("mouseover", handleMouseEnter);
        };
    }, []);

    return null;
}

