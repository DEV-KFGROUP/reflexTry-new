"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Cookie, Settings } from "lucide-react";
import Link from "next/link";

const COOKIE_CONSENT_KEY = "reflextry_cookie_consent";

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);

    useEffect(() => {
        // Check if user has already given consent
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (!consent) {
            // Show banner after a short delay for better UX
            const timer = setTimeout(() => {
                setShowBanner(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
        localStorage.setItem("reflextry_cookie_timestamp", Date.now().toString());
        setShowBanner(false);
    };

    const handleCustomize = () => {
        setShowCustomize(!showCustomize);
    };

    const handleSaveCustomize = () => {
        // For now, save as accepted. Can be expanded to save individual preferences
        localStorage.setItem(COOKIE_CONSENT_KEY, "customized");
        localStorage.setItem("reflextry_cookie_timestamp", Date.now().toString());
        setShowBanner(false);
    };


    if (!showBanner) return null;

    return (
        <AnimatePresence>
            {showBanner && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4"
                >
                    <div className="max-w-6xl mx-auto bg-card/80 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-5 md:p-6 relative">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                            {/* Cookie Icon */}
                            <div className="flex-shrink-0 hidden sm:block">
                                <div className="w-12 h-12 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center border border-teal-200 dark:border-teal-500/20 shadow-lg shadow-teal-500/10">
                                    <Cookie className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-foreground mb-2 flex items-center gap-2">
                                    <Cookie className="w-5 h-5 text-teal-600 dark:text-teal-400 sm:hidden" />
                                    We value your privacy
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                                </p>
                                <div className="flex flex-wrap gap-3 text-xs">
                                    <Link href="/cookies" className="text-teal-600 dark:text-teal-400 hover:underline font-medium transition-colors" aria-label="Learn more about our cookie policy">
                                        Learn more about our cookies
                                    </Link>
                                    <span className="text-border">•</span>
                                    <Link href="/privacy" className="text-teal-600 dark:text-teal-400 hover:underline font-medium transition-colors">
                                        Privacy Policy
                                    </Link>
                                </div>
                            </div>

                            {/* Actions - Customize and Accept All buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto lg:flex-shrink-0 mt-2 lg:mt-0">
                                <Button
                                    variant="outline"
                                    onClick={handleCustomize}
                                    className="text-sm whitespace-nowrap bg-transparent text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors px-4 py-2 flex items-center justify-center gap-2 order-2 sm:order-1"
                                >
                                    <Settings className="w-4 h-4" />
                                    Customize
                                </Button>
                                <Button
                                    onClick={handleAccept}
                                    className="text-sm font-semibold whitespace-nowrap bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 shadow-md transition px-6 py-2 order-1 sm:order-2"
                                >
                                    Accept All
                                </Button>
                            </div>
                        </div>

                        {/* Customize Panel */}
                        {showCustomize && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-6 pt-6 border-t border-border overflow-hidden"
                            >
                                <div className="space-y-4">
                                    <h4 className="text-base font-semibold text-foreground mb-4">Cookie Preferences</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50">
                                            <div>
                                                <p className="text-sm font-semibold text-foreground">Essential Cookies</p>
                                                <p className="text-xs text-muted-foreground mt-1">Required for the site to function properly</p>
                                            </div>
                                            <div className="text-sm font-medium text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 px-3 py-1 rounded-full border border-teal-200 dark:border-teal-500/20">Always Active</div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50">
                                            <div className="pr-4">
                                                <p className="text-sm font-semibold text-foreground">Analytics Cookies</p>
                                                <p className="text-xs text-muted-foreground mt-1">Help us understand how visitors interact with our site</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition peer-checked:bg-teal-500"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-border/50">
                                            <div className="pr-4">
                                                <p className="text-sm font-semibold text-foreground">Advertising Cookies</p>
                                                <p className="text-xs text-muted-foreground mt-1">Used to deliver personalized ads</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-300 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition peer-checked:bg-teal-500"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCustomize(false)}
                                            className="flex-1 bg-transparent border-border text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveCustomize}
                                            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600 shadow-md"
                                        >
                                            Save Preferences
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

// Extend Window interface for gtag
declare global {
    interface Window {
        gtag?: (...args: any[]) => void;
        dataLayer?: any[];
    }
}
