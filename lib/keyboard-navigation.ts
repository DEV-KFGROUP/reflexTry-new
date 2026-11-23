import { TOOL_MAPPING } from "@/config/tool-mapping";
import {
    extractLocaleFromPath,
    getLocalizedPath,
    type Locale,
} from "@/lib/i18n/config";

export type ToolKeyboardAction = "restart" | "settings" | "hub";

export interface CategoryHubInfo {
    category: string;
    hubPath: string;
    label: string;
}

export interface ToolPageContext {
    isToolPage: true;
    locale: Locale;
    cleanPath: string;
    category: string;
    categoryLabel: string;
    hubPath: string;
}

export interface KeyboardEventGuardInput {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    altKey?: boolean;
    repeat?: boolean;
    defaultPrevented?: boolean;
    targetTagName?: string | null;
    targetIsContentEditable?: boolean;
    targetRole?: string | null;
    capturedKeys?: Iterable<string>;
}

/** Custom DOM event names coordinating global tool keyboard navigation */
export const KEYBOARD_NAV_EVENTS = {
    TOOL_RESTART: "reflextry:tool-restart",
    SETTINGS_TOGGLE: "reflextry:toggle-settings",
    SETTINGS_CLOSE: "reflextry:close-settings",
} as const;

/** Canonical category hubs for all 11 tool categories */
export const TOOL_CATEGORY_HUBS: Record<string, CategoryHubInfo> = {
    memory: { category: "memory", hubPath: "/memory", label: "Memory Hub" },
    reflex: { category: "reflex", hubPath: "/reflex", label: "Reflex Hub" },
    speed: { category: "speed", hubPath: "/speed", label: "Speed Hub" },
    accuracy: { category: "accuracy", hubPath: "/accuracy", label: "Accuracy Hub" },
    gaming: { category: "gaming", hubPath: "/gaming", label: "Gaming Hub" },
    stem: { category: "stem", hubPath: "/stem", label: "STEM & Physics Lab" },
    "lab-3d": { category: "lab-3d", hubPath: "/lab-3d", label: "3D Interactive Lab" },
    multiplayer: { category: "multiplayer", hubPath: "/multiplayer", label: "2-Player Arena" },
    productivity: { category: "productivity", hubPath: "/productivity", label: "Student & Work Suite" },
    classics: { category: "classics", hubPath: "/classics", label: "Classics Hub" },
    puzzles: { category: "puzzles", hubPath: "/puzzles", label: "Logic Puzzles Hub" },
};

const KNOWN_TOOL_PATHS = new Set<string>(Object.values(TOOL_MAPPING));

const EDITABLE_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);
const EDITABLE_ROLES = new Set(["textbox", "searchbox", "combobox", "spinbutton"]);

/**
 * Resolves whether a given pathname is an active tool page (supporting all 16 locales),
 * returning its localized category hub destination and display label, or null for non-tool pages
 * (home, category hub indexes, blog, legal, profile pages).
 */
export function resolveToolPageContext(pathname: string | null | undefined): ToolPageContext | null {
    if (!pathname) return null;

    const normalizedRaw = pathname.split("?")[0].split("#")[0];
    const { locale, cleanPath } = extractLocaleFromPath(normalizedRaw);
    const trimmed = cleanPath.length > 1 && cleanPath.endsWith("/")
        ? cleanPath.slice(0, -1)
        : cleanPath;

    const segments = trimmed.split("/").filter(Boolean);
    if (segments.length < 2) {
        return null;
    }

    const category = segments[0];
    const hub = TOOL_CATEGORY_HUBS[category];
    if (!hub) {
        return null;
    }

    // Confirm this is a registered tool path or a direct child route of a tool category
    if (!KNOWN_TOOL_PATHS.has(trimmed) && segments.length !== 2) {
        return null;
    }

    return {
        isToolPage: true,
        locale,
        cleanPath: trimmed,
        category: hub.category,
        categoryLabel: hub.label,
        hubPath: getLocalizedPath(hub.hubPath, locale),
    };
}

/**
 * Maps a pressed key to its global tool navigation action.
 */
export function mapKeyToToolAction(key: string): ToolKeyboardAction | null {
    switch (key.toLowerCase()) {
        case "r":
            return "restart";
        case "s":
            return "settings";
        case "h":
            return "hub";
        default:
            return null;
    }
}

/**
 * Parses comma- or whitespace-separated `data-capture-keys` attribute values into a lowercase Set.
 */
export function parseCapturedKeys(rawValues: Iterable<string | null | undefined>): Set<string> {
    const keys = new Set<string>();
    for (const raw of rawValues) {
        if (!raw) continue;
        for (const token of raw.split(/[\s,]+/)) {
            const clean = token.trim().toLowerCase();
            if (clean) keys.add(clean);
        }
    }
    return keys;
}

/**
 * Determines whether a keyboard event must be ignored so global tool shortcuts never
 * hijack browser modifiers, typing in inputs/textareas, or active in-game keybindings.
 */
export function shouldIgnoreKeyboardEvent(input: KeyboardEventGuardInput): boolean {
    if (input.defaultPrevented) return true;
    if (input.repeat) return true;
    if (input.ctrlKey || input.metaKey || input.altKey) return true;

    const tag = input.targetTagName ? input.targetTagName.toUpperCase() : "";
    if (EDITABLE_TAGS.has(tag)) return true;
    if (input.targetIsContentEditable) return true;

    const role = input.targetRole ? input.targetRole.toLowerCase() : "";
    if (EDITABLE_ROLES.has(role)) return true;

    if (input.capturedKeys) {
        const lowerKey = input.key.toLowerCase();
        for (const captured of input.capturedKeys) {
            if (captured.toLowerCase() === lowerKey) return true;
        }
    }

    return false;
}
