"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PREFERENCES_EVENT, readConsent, saveConsent, type CookieConsent } from "@/lib/cookie-consent";

export function CookieBanner() {
    // Render a compact notice in the initial HTML; never introduce a delayed large paint.
    const [visible, setVisible] = useState(true);
    const [customize, setCustomize] = useState(false);
    const [choices, setChoices] = useState<CookieConsent>({ analytics: false, advertising: false });

    useEffect(() => {
        const saved = readConsent();
        if (saved) {
            setChoices(saved);
            setVisible(false);
        }
        const open = () => {
            setVisible(true);
            setCustomize(true);
        };
        window.addEventListener(PREFERENCES_EVENT, open);
        return () => window.removeEventListener(PREFERENCES_EVENT, open);
    }, []);

    function save(value: CookieConsent) {
        try {
            saveConsent(value);
        } catch {
            // Keep dismissal working even when browser storage is restricted in embedded previews
        }
        setChoices(value);
        setVisible(false);
        setCustomize(false);
    }

    if (!visible) return null;

    const secondaryButton =
        "cursor-pointer rounded-lg border border-[#D8D4C9] bg-white px-3.5 py-2 text-sm font-semibold text-[#3F3E39] hover:bg-[#FAF9F6] hover:text-[#161614] hover:border-[#161614] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2";
    const primaryButton =
        "cursor-pointer rounded-lg border border-[#161614] bg-[#161614] px-3.5 py-2 text-sm font-semibold text-[#FAF9F6] hover:bg-[#2C2B27] hover:border-[#2C2B27] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] focus-visible:ring-offset-2";

    return (
        <aside
            aria-label="Cookie preferences"
            className="fixed bottom-0 inset-x-0 z-[60] border-t border-[#E6E3DB] bg-[#FAF9F6]/95 backdrop-blur-md px-4 py-3.5 text-[#161614] shadow-lg"
        >
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-[#57554E] max-w-xl leading-relaxed">
                    Choose whether to allow optional analytics and advertising cookies.{" "}
                    <Link
                        href="/cookies"
                        className="font-medium underline underline-offset-2 text-[#1E40AF] hover:text-[#161614]"
                    >
                        Cookie policy
                    </Link>
                </p>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        type="button"
                        className={secondaryButton}
                        onClick={() => save({ analytics: false, advertising: false })}
                    >
                        Reject optional
                    </button>
                    <button
                        type="button"
                        className={secondaryButton}
                        aria-expanded={customize}
                        onClick={() => setCustomize((prev) => !prev)}
                    >
                        Customize
                    </button>
                    <button
                        type="button"
                        className={primaryButton}
                        onClick={() => save({ analytics: true, advertising: true })}
                    >
                        Accept all
                    </button>
                </div>
                {customize && (
                    <fieldset className="w-full border-t border-[#E6E3DB] pt-3 flex flex-wrap items-center gap-4 text-sm text-[#3F3E39]">
                        <legend className="sr-only">Optional cookies</legend>
                        <span className="text-[#78756C]">Essential storage is always on.</span>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-[#D8D4C9] accent-[#161614] cursor-pointer"
                                checked={choices.analytics}
                                onChange={(e) => setChoices({ ...choices, analytics: e.target.checked })}
                            />
                            <span>Analytics</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-[#D8D4C9] accent-[#161614] cursor-pointer"
                                checked={choices.advertising}
                                onChange={(e) => setChoices({ ...choices, advertising: e.target.checked })}
                            />
                            <span>Advertising</span>
                        </label>
                        <button
                            type="button"
                            className={primaryButton}
                            onClick={() => save(choices)}
                        >
                            Save preferences
                        </button>
                    </fieldset>
                )}
            </div>
        </aside>
    );
}
