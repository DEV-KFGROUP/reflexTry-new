export const CONSENT_KEY = "reflextry_cookie_consent";
export const CONSENT_EVENT = "reflextry-consent-change";
export const PREFERENCES_EVENT = "reflextry-open-preferences";
export interface CookieConsent { analytics: boolean; advertising: boolean }

export function readConsent(): CookieConsent | null {
    try {
        const value = localStorage.getItem(CONSENT_KEY);
        if (value === "accepted") return { analytics: true, advertising: true };
        // Old "customized" records did not store individual choices.
        if (!value || value === "customized") return null;
        const parsed: unknown = JSON.parse(value);
        if (parsed && typeof parsed === "object" && "analytics" in parsed && "advertising" in parsed &&
            typeof parsed.analytics === "boolean" && typeof parsed.advertising === "boolean") {
            return { analytics: parsed.analytics, advertising: parsed.advertising };
        }
    } catch { /* Storage may be disabled; show preferences instead. */ }
    return null;
}

export function saveConsent(consent: CookieConsent) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch { /* Keep this session usable. */ }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }));
}
