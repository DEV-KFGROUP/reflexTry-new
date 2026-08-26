"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import { SUPPORTED_LOCALES, LOCALES_METADATA, Locale } from "@/lib/i18n/config";

interface LanguageSwitcherProps {
    className?: string;
    variant?: "dropdown" | "compact" | "footer";
}

export function LanguageSwitcher({ className = "", variant = "dropdown" }: LanguageSwitcherProps) {
    const { locale: currentLocale, setLocale, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentMeta = LOCALES_METADATA[currentLocale] || LOCALES_METADATA.en;

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        }
        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    const handleSelectLocale = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    if (variant === "footer") {
        return (
            <div className={`flex flex-wrap items-center gap-2 ${className}`}>
                <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="text-xs text-muted-foreground font-medium mr-1">
                    {t("common.switchLanguage", "Language")}:
                </span>
                {SUPPORTED_LOCALES.map((code) => {
                    const meta = LOCALES_METADATA[code];
                    const isActive = currentLocale === code;
                    return (
                        <button
                            key={code}
                            type="button"
                            onClick={() => handleSelectLocale(code)}
                            className={`text-xs px-2 py-1 rounded-md transition-colors flex items-center gap-1.5 ${
                                isActive
                                    ? "bg-foreground/10 text-foreground font-bold shadow-xs"
                                    : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                            }`}
                            title={meta.nativeName}
                        >
                            <span>{meta.flag}</span>
                            <span>{meta.nativeName}</span>
                        </button>
                    );
                })}
            </div>
        );
    }

    return (
        <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-black/10 dark:border-white/10 bg-white/70 dark:bg-black/50 hover:bg-black/5 dark:hover:bg-white/10 backdrop-blur-md transition-all text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer shadow-xs"
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label={t("common.switchLanguage", "Switch Language")}
            >
                <Globe className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="hidden sm:inline">{currentMeta.flag}</span>
                <span className="font-bold">{currentMeta.code.toUpperCase()}</span>
                <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-48 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-black/10 dark:border-white/10 shadow-2xl backdrop-blur-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                    role="menu"
                >
                    <div className="px-3 py-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wider border-b border-black/5 dark:border-white/5 mb-1">
                        {t("common.switchLanguage", "Select Language")}
                    </div>
                    {SUPPORTED_LOCALES.map((code) => {
                        const meta = LOCALES_METADATA[code];
                        const isActive = currentLocale === code;
                        return (
                            <button
                                key={code}
                                type="button"
                                onClick={() => handleSelectLocale(code)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors text-left cursor-pointer ${
                                    isActive
                                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold"
                                        : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                                }`}
                                role="menuitem"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-base">{meta.flag}</span>
                                    <div className="flex flex-col">
                                        <span className="leading-tight">{meta.nativeName}</span>
                                        <span className="text-[10px] text-muted-foreground">{meta.label}</span>
                                    </div>
                                </div>
                                {isActive && <Check className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
