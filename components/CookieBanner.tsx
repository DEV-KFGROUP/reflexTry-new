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
        if (saved) { setChoices(saved); setVisible(false); }
        const open = () => { setVisible(true); setCustomize(true); };
        window.addEventListener(PREFERENCES_EVENT, open);
        return () => window.removeEventListener(PREFERENCES_EVENT, open);
    }, []);

    function save(value: CookieConsent) {
        saveConsent(value);
        setChoices(value);
        setVisible(false);
        setCustomize(false);
    }

    if (!visible) return null;
    const button = "rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700";
    return (
        <aside aria-label="Cookie preferences" className="fixed bottom-0 inset-x-0 z-50 border-t border-slate-300 bg-white p-3 text-slate-800 shadow-sm">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm max-w-xl">Choose whether to allow optional analytics and advertising cookies. <Link href="/cookies" className="underline text-blue-800">Cookie policy</Link></p>
                <div className="flex flex-wrap gap-2">
                    <button type="button" className={button} onClick={() => save({ analytics: false, advertising: false })}>Reject optional</button>
                    <button type="button" className={button} aria-expanded={customize} onClick={() => setCustomize(!customize)}>Customize</button>
                    <button type="button" className={`${button} bg-slate-900 text-white hover:bg-slate-700`} onClick={() => save({ analytics: true, advertising: true })}>Accept all</button>
                </div>
                {customize && (
                    <fieldset className="w-full border-t border-slate-200 pt-3 flex flex-wrap items-center gap-4 text-sm">
                        <legend className="sr-only">Optional cookies</legend>
                        <span>Essential storage is always on.</span>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={choices.analytics} onChange={(e) => setChoices({ ...choices, analytics: e.target.checked })} />Analytics</label>
                        <label className="flex items-center gap-2"><input type="checkbox" checked={choices.advertising} onChange={(e) => setChoices({ ...choices, advertising: e.target.checked })} />Advertising</label>
                        <button type="button" className={button} onClick={() => save(choices)}>Save preferences</button>
                    </fieldset>
                )}
            </div>
        </aside>
    );
}
