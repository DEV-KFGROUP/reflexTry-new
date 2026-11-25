"use client";

import React, { useState, useRef, useEffect } from "react";
import { Globe, Check, ChevronDown, Search } from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";
import {
    LOCALES_METADATA,
    SUPPORTED_LOCALES,
    type Locale,
} from "@/lib/i18n/config";

interface LanguageSwitcherProps {
    className?: string;
    variant?: "dropdown" | "compact" | "footer";
}

export function LanguageSwitcher({ className = "", variant = "dropdown" }: LanguageSwitcherProps) {
    const { locale, setLocale, t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const currentMetadata = LOCALES_METADATA[locale] || LOCALES_METADATA.en;

    const filteredLocales = SUPPORTED_LOCALES.filter((loc) => {
        const meta = LOCALES_METADATA[loc];
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            meta.label.toLowerCase().includes(query) ||
            meta.nativeName.toLowerCase().includes(query) ||
            meta.code.toLowerCase().includes(query)
        );
    });

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") setIsOpen(false);
        }
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("keydown", handleKeyDown);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            const timer = setTimeout(() => searchInputRef.current?.focus(), 50);
            return () => clearTimeout(timer);
        } else {
            setSearchQuery("");
        }
    }, [isOpen]);

    const handleSelect = (newLocale: Locale) => {
        setLocale(newLocale);
        setIsOpen(false);
    };

    if (variant === "footer") {
        return (
            <div className={`relative inline-block ${className}`} ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center gap-2 min-h-[44px] px-3.5 py-2.5 text-xs font-medium text-[#3F3E39] hover:text-[#161614] bg-[#FAF9F6] hover:bg-[#F3F1EC] rounded-lg border border-[#E6E3DB] transition-colors whitespace-nowrap shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
                    aria-label="Switch Language"
                    aria-expanded={isOpen}
                >
                    <Globe className="w-3.5 h-3.5 text-[#57554E] shrink-0" aria-hidden="true" />
                    <span className="font-semibold">{currentMetadata.nativeName}</span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 text-[#78756C] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                        aria-hidden="true"
                    />
                </button>

                {isOpen && (
                    <div
                        className="absolute bottom-full mb-2 right-0 sm:left-0 sm:right-auto w-72 sm:w-80 bg-white border border-[#E6E3DB] rounded-xl shadow-xl p-3 z-50 animate-in fade-in duration-150"
                    >
                        <div className="flex items-center justify-between pb-2 border-b border-[#F0EDE6] mb-2">
                            <span className="text-xs font-semibold text-[#161614]">
                                {t("common.switchLanguage", "Select Language")}
                            </span>
                            <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                {SUPPORTED_LOCALES.length}
                            </span>
                        </div>

                        <div className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
                            {SUPPORTED_LOCALES.map((loc) => {
                                const meta = LOCALES_METADATA[loc];
                                const isCurrent = loc === locale;
                                return (
                                    <button
                                        key={loc}
                                        type="button"
                                        onClick={() => handleSelect(loc)}
                                        className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-colors touch-manipulation cursor-pointer ${
                                            isCurrent
                                                ? "bg-[#F3F1EB] text-[#161614] font-semibold"
                                                : "text-[#3F3E39] hover:bg-[#FAF9F6] hover:text-[#161614]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="font-medium truncate">{meta.nativeName}</span>
                                            <span className="text-[11px] text-[#78756C] truncate">({meta.label})</span>
                                        </div>
                                        {isCurrent && <Check className="w-3.5 h-3.5 text-[#1E40AF] shrink-0" aria-hidden="true" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center gap-1.5 min-h-[44px] min-w-[44px] px-2.5 sm:px-3 py-2 rounded-lg text-xs font-semibold text-[#3F3E39] hover:text-[#161614] bg-white hover:bg-[#F3F1EC] border border-[#E6E3DB] transition-colors whitespace-nowrap shrink-0 touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E40AF]"
                aria-label="Switch Language"
                aria-expanded={isOpen}
            >
                <Globe className="w-4 h-4 text-[#57554E] shrink-0" aria-hidden="true" />
                <span className="uppercase tracking-wide font-mono">{currentMetadata.code}</span>
                <ChevronDown
                    className={`hidden sm:block w-3.5 h-3.5 text-[#78756C] transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-[min(20rem,calc(100vw-2rem))] sm:w-96 bg-white border border-[#E6E3DB] rounded-xl shadow-xl p-3.5 z-50 animate-in fade-in duration-150"
                >
                    <div className="pb-3 border-b border-[#F0EDE6]">
                        <div className="flex items-center justify-between mb-2.5">
                            <span className="text-xs font-semibold text-[#161614] flex items-center gap-1.5">
                                <Globe className="w-3.5 h-3.5 text-[#1E40AF]" aria-hidden="true" />
                                {t("common.switchLanguage", "Select Language")}
                            </span>
                            <span className="text-xs font-mono text-[#78756C] tabular-nums">
                                {SUPPORTED_LOCALES.length} languages
                            </span>
                        </div>

                        <div className="relative">
                            <Search className="w-3.5 h-3.5 text-[#78756C] absolute left-2.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search language..."
                                className="w-full min-h-[44px] pl-9 pr-3 py-2.5 text-base sm:text-xs bg-[#FAF9F6] border border-[#DCD8CE] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] text-[#161614] placeholder:text-[#78756C]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-72 overflow-y-auto pt-2 pr-1">
                        {filteredLocales.map((loc) => {
                            const meta = LOCALES_METADATA[loc];
                            const isCurrent = loc === locale;

                            return (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => handleSelect(loc)}
                                    className={`min-h-[44px] flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-left transition-colors touch-manipulation cursor-pointer ${
                                        isCurrent
                                            ? "bg-[#F3F1EB] text-[#161614] font-semibold border border-[#DCD8CE]"
                                            : "text-[#3F3E39] hover:bg-[#FAF9F6] hover:text-[#161614] border border-transparent"
                                    }`}
                                >
                                    <div className="flex flex-col min-w-0">
                                        <span className="truncate leading-tight">{meta.nativeName}</span>
                                        <span className="text-[11px] text-[#78756C] truncate">{meta.label}</span>
                                    </div>
                                    {isCurrent && <Check className="w-3.5 h-3.5 text-[#1E40AF] shrink-0 ml-2" aria-hidden="true" />}
                                </button>
                            );
                        })}
                        {filteredLocales.length === 0 && (
                            <div className="col-span-2 py-6 text-center text-xs text-[#78756C]">
                                No language matching &ldquo;{searchQuery}&rdquo;
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
