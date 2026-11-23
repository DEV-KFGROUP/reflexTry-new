"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Keyboard, LayoutGrid, RotateCcw, Settings } from "lucide-react";
import {
    KEYBOARD_NAV_EVENTS,
    mapKeyToToolAction,
    parseCapturedKeys,
    resolveToolPageContext,
    shouldIgnoreKeyboardEvent,
    type ToolKeyboardAction,
} from "@/lib/keyboard-navigation";

interface ToolKeyboardNavigationProps {
    children: React.ReactNode;
}

/**
 * Global keyboard navigation controller for all tool pages:
 * - R: Restart the current tool cleanly (in-place if tool handles TOOL_RESTART, else clean subtree reset)
 * - S: Toggle the global Settings drawer
 * - H: Return to the current tool's category hub (locale-aware)
 */
export function ToolKeyboardNavigation({ children }: ToolKeyboardNavigationProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [resetNonce, setResetNonce] = useState(0);
    const [activeAction, setActiveAction] = useState<ToolKeyboardAction | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const flashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const toolContext = useMemo(() => resolveToolPageContext(pathname), [pathname]);

    const flashAction = useCallback((action: ToolKeyboardAction, message: string) => {
        setActiveAction(action);
        setAnnouncement(message);
        if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        flashTimerRef.current = setTimeout(() => {
            setActiveAction(null);
        }, 650);
    }, []);

    useEffect(() => {
        return () => {
            if (flashTimerRef.current) clearTimeout(flashTimerRef.current);
        };
    }, []);

    const triggerRestart = useCallback(() => {
        window.dispatchEvent(new CustomEvent(KEYBOARD_NAV_EVENTS.SETTINGS_CLOSE));
        const restartEvent = new CustomEvent(KEYBOARD_NAV_EVENTS.TOOL_RESTART, {
            cancelable: true,
        });
        window.dispatchEvent(restartEvent);

        if (!restartEvent.defaultPrevented) {
            window.dispatchEvent(new CustomEvent("game_abort_requested"));
            setResetNonce((n) => n + 1);
        }
        flashAction("restart", "Tool restarted");
    }, [flashAction]);

    const triggerSettings = useCallback(() => {
        window.dispatchEvent(new CustomEvent(KEYBOARD_NAV_EVENTS.SETTINGS_TOGGLE));
        flashAction("settings", "Toggled settings panel");
    }, [flashAction]);

    const triggerHub = useCallback(() => {
        if (!toolContext) return;
        window.dispatchEvent(new CustomEvent(KEYBOARD_NAV_EVENTS.SETTINGS_CLOSE));
        flashAction("hub", `Returning to ${toolContext.categoryLabel}`);
        router.push(toolContext.hubPath);
    }, [flashAction, router, toolContext]);

    useEffect(() => {
        if (!toolContext) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            const action = mapKeyToToolAction(event.key);
            if (!action) return;

            const target = event.target instanceof HTMLElement ? event.target : null;
            const captureNodes = document.querySelectorAll<HTMLElement>("[data-capture-keys]");
            const capturedKeys = parseCapturedKeys(
                Array.from(captureNodes, (node) => node.getAttribute("data-capture-keys"))
            );

            const ignore = shouldIgnoreKeyboardEvent({
                key: event.key,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                altKey: event.altKey,
                repeat: event.repeat,
                defaultPrevented: event.defaultPrevented,
                targetTagName: target?.tagName ?? null,
                targetIsContentEditable: target?.isContentEditable ?? false,
                targetRole: target?.getAttribute("role") ?? null,
                capturedKeys,
            });

            if (ignore) return;

            event.preventDefault();
            if (action === "restart") {
                triggerRestart();
            } else if (action === "settings") {
                triggerSettings();
            } else if (action === "hub") {
                triggerHub();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toolContext, triggerRestart, triggerSettings, triggerHub]);

    return (
        <>
            {toolContext && (
                <>
                    <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
                        {announcement}
                    </div>

                    <div className="hidden md:block border-b border-[#E6E3DB] bg-white">
                        <nav
                            aria-label="Tool keyboard shortcuts"
                            data-testid="tool-keyboard-shortcuts"
                            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between gap-4 text-xs text-[#57554E]"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <Keyboard className="w-3.5 h-3.5 text-[#78756C] shrink-0" aria-hidden="true" />
                                <span className="font-medium text-[#78756C]">Keyboard shortcuts</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={triggerRestart}
                                    aria-label="Restart tool (Shortcut: R)"
                                    title="Restart tool (R)"
                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        activeAction === "restart"
                                            ? "bg-[#161614] text-[#FAF9F6]"
                                            : "hover:bg-[#F3F1EC] text-[#3F3E39]"
                                    }`}
                                >
                                    <kbd
                                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[11px] font-semibold ${
                                            activeAction === "restart"
                                                ? "border-[#FAF9F6]/30 bg-[#2C2B27] text-[#FAF9F6]"
                                                : "border-[#DCD8CE] bg-[#FAF9F6] text-[#161614]"
                                        }`}
                                    >
                                        R
                                    </kbd>
                                    <RotateCcw className="w-3 h-3 opacity-75" aria-hidden="true" />
                                    <span>Restart</span>
                                </button>

                                <span className="h-3.5 w-px bg-[#E6E3DB]" aria-hidden="true" />

                                <button
                                    type="button"
                                    onClick={triggerSettings}
                                    aria-label="Open settings (Shortcut: S)"
                                    title="Open settings (S)"
                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        activeAction === "settings"
                                            ? "bg-[#161614] text-[#FAF9F6]"
                                            : "hover:bg-[#F3F1EC] text-[#3F3E39]"
                                    }`}
                                >
                                    <kbd
                                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[11px] font-semibold ${
                                            activeAction === "settings"
                                                ? "border-[#FAF9F6]/30 bg-[#2C2B27] text-[#FAF9F6]"
                                                : "border-[#DCD8CE] bg-[#FAF9F6] text-[#161614]"
                                        }`}
                                    >
                                        S
                                    </kbd>
                                    <Settings className="w-3 h-3 opacity-75" aria-hidden="true" />
                                    <span>Settings</span>
                                </button>

                                <span className="h-3.5 w-px bg-[#E6E3DB]" aria-hidden="true" />

                                <button
                                    type="button"
                                    onClick={triggerHub}
                                    aria-label={`Return to ${toolContext.categoryLabel} (Shortcut: H)`}
                                    title={`Return to ${toolContext.categoryLabel} (H)`}
                                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF] ${
                                        activeAction === "hub"
                                            ? "bg-[#161614] text-[#FAF9F6]"
                                            : "hover:bg-[#F3F1EC] text-[#3F3E39]"
                                    }`}
                                >
                                    <kbd
                                        className={`inline-flex h-5 min-w-5 items-center justify-center rounded border px-1 font-mono text-[11px] font-semibold ${
                                            activeAction === "hub"
                                                ? "border-[#FAF9F6]/30 bg-[#2C2B27] text-[#FAF9F6]"
                                                : "border-[#DCD8CE] bg-[#FAF9F6] text-[#161614]"
                                        }`}
                                    >
                                        H
                                    </kbd>
                                    <LayoutGrid className="w-3 h-3 opacity-75" aria-hidden="true" />
                                    <span>{toolContext.categoryLabel}</span>
                                </button>
                            </div>
                        </nav>
                    </div>
                </>
            )}

            <div key={resetNonce} data-tool-reset-nonce={resetNonce}>
                {children}
            </div>
        </>
    );
}
