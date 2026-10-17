"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

    // Filter languages based on search query
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

    // Close dropdown when clicking outside
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

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current?.focus(), 50);
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
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium text-muted-foreground hover:text-foreground bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg border border-black/10 dark:border-white/10 transition-colors"
                    aria-label="Switch Language"
                    aria-expanded={isOpen}
                >
                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                    <span>{currentMetadata.flag}</span>
                    <span className="font-semibold">{currentMetadata.nativeName}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.96 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 w-72 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-3 z-50 overflow-hidden"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-black/10 dark:border-white/10 mb-2">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-muted-foreground">
                                    {t("common.switchLanguage", "Select Language")}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                    {SUPPORTED_LOCALES.length} Languages
                                </span>
                            </div>

                            <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                                {SUPPORTED_LOCALES.map((loc) => {
                                    const meta = LOCALES_METADATA[loc];
                                    const isCurrent = loc === locale;
                                    return (
                                        <button
                                            key={loc}
                                            type="button"
                                            onClick={() => handleSelect(loc)}
                                            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                                                isCurrent
                                                    ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold"
                                                    : "text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                                            }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm">{meta.flag}</span>
                                                <span className="font-medium">{meta.nativeName}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono">({meta.label})</span>
                                            </div>
                                            {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <div className={`relative inline-block ${className}`} ref={dropdownRef}>
            {/* Navbar Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-bold text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 transition-all duration-200 shadow-sm"
                aria-label="Switch Language"
                aria-expanded={isOpen}
            >
                <Globe className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-sm leading-none">{currentMetadata.flag}</span>
                <span className="uppercase tracking-wider">{currentMetadata.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Glassmorphism Language Dropdown Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-black/10 dark:border-white/10 rounded-2xl shadow-2xl p-3.5 z-50 overflow-hidden"
                    >
                        {/* Header & Search */}
                        <div className="pb-3 border-b border-black/10 dark:border-white/10">
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-xs font-mono font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                                    <Globe className="w-3.5 h-3.5 text-indigo-500" />
                                    {t("common.switchLanguage", "Select Language")}
                                </span>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">
                                    {SUPPORTED_LOCALES.length} Available
                                </span>
                            </div>

                            <div className="relative">
                                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-2.5 top-1/2 -translate-y-1/2" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search language or country..."
                                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        {/* Languages Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 max-h-72 overflow-y-auto pt-2 pr-1 custom-scrollbar">
                            {filteredLocales.map((loc) => {
                                const meta = LOCALES_METADATA[loc];
                                const isCurrent = loc === locale;

                                return (
                                    <button
                                        key={loc}
                                        type="button"
                                        onClick={() => handleSelect(loc)}
                                        className={`flex items-center justify-between px-2.5 py-2 rounded-xl text-xs text-left transition-all duration-150 ${
                                            isCurrent
                                                ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/30 shadow-sm"
                                                : "text-foreground hover:bg-black/5 dark:hover:bg-white/5 border border-transparent"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-base select-none">{meta.flag}</span>
                                            <div className="flex flex-col min-w-0">
                                                <span className="truncate leading-tight">{meta.nativeName}</span>
                                                <span className="text-[10px] text-muted-foreground font-mono truncate">{meta.label}</span>
                                            </div>
                                        </div>

                                        {isCurrent && <Check className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0" />}
                                    </button>
                                );
                            })}
                            {filteredLocales.length === 0 && (
                                <div className="col-span-2 py-6 text-center text-xs text-muted-foreground font-mono">
                                    No language found matching &ldquo;{searchQuery}&rdquo;
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
