"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Cookie, Settings } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

const COOKIE_CONSENT_KEY = "reflextry_cookie_consent";

export function CookieBanner() {
    const [showBanner, setShowBanner] = useState(false);
    const [showCustomize, setShowCustomize] = useState(false);
    const t = useTranslations('CookieBanner');

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
                    <div className="max-w-6xl mx-auto bg-gradient-to-br from-slate-900/98 via-slate-800/95 to-slate-900/98 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl p-5 md:p-6 relative ring-1 ring-neon-teal/30">
                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6">
                            {/* Cookie Icon */}
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-teal/30 to-electric-purple/30 flex items-center justify-center border-2 border-neon-teal/40 shadow-lg shadow-neon-teal/20">
                                    <Cookie className="w-5 h-5 text-neon-teal" />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-white mb-2">
                                    {t('title')}
                                </h3>
                                <p className="text-sm text-slate-300 leading-relaxed mb-2">
                                    {t('description')}
                                </p>
                                <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                                    <Link href="/cookies" className="text-neon-teal hover:text-cyan-300 transition-colors underline decoration-neon-teal/50 hover:decoration-neon-teal" aria-label="Learn more about our cookie policy">
                                        {t('learnMore')} {t('aboutCookies')}
                                    </Link>
                                    <span className="text-slate-600">•</span>
                                    <Link href="/privacy" className="text-neon-teal hover:text-cyan-300 transition-colors underline decoration-neon-teal/50 hover:decoration-neon-teal">
                                        {t('privacyPolicy')}
                                    </Link>
                                </div>
                            </div>

                            {/* Actions - Customize and Accept All buttons */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto lg:flex-shrink-0">
                                <Button
                                    variant="outline"
                                    onClick={handleCustomize}
                                    className="text-sm whitespace-nowrap border-2 border-slate-600 text-slate-300 hover:text-white hover:border-neon-teal/50 hover:bg-neon-teal/10 transition-all px-4 py-2 flex items-center justify-center gap-2 order-2 sm:order-1"
                                >
                                    <Settings className="w-4 h-4" />
                                    {t('customize')}
                                </Button>
                                <Button
                                    onClick={handleAccept}
                                    className="text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-neon-teal to-electric-purple hover:from-neon-teal/90 hover:to-electric-purple/90 text-white shadow-lg shadow-neon-teal/30 hover:shadow-neon-teal/40 transition-all px-5 py-2 order-1 sm:order-2"
                                >
                                    {t('accept')}
                                </Button>
                            </div>
                        </div>

                        {/* Customize Panel */}
                        {showCustomize && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-4 pt-4 border-t border-slate-700/50"
                            >
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-white mb-3">Cookie Preferences</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-white">Essential Cookies</p>
                                                <p className="text-xs text-slate-400 mt-1">Required for the site to function properly</p>
                                            </div>
                                            <div className="text-sm text-slate-400">Always Active</div>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-white">Analytics Cookies</p>
                                                <p className="text-xs text-slate-400 mt-1">Help us understand how visitors interact with our site</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-teal/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-teal"></div>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                                            <div>
                                                <p className="text-sm font-medium text-white">Advertising Cookies</p>
                                                <p className="text-xs text-slate-400 mt-1">Used to deliver personalized ads</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked className="sr-only peer" />
                                                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-neon-teal/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-teal"></div>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setShowCustomize(false)}
                                            className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:border-slate-500"
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            onClick={handleSaveCustomize}
                                            className="flex-1 bg-gradient-to-r from-neon-teal to-electric-purple hover:from-neon-teal/90 hover:to-electric-purple/90 text-white"
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

