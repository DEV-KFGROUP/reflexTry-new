"use client";

import { motion } from "framer-motion";
import { Shield, Eye, Lock, FileText, Database, HelpCircle, Mail, Sparkles } from "lucide-react";

export default function CookiesPolicyClient() {
    const FLOATING_SHAPES = [
        { value: "🍪", x: "8%", y: "15%", size: "text-7xl", delay: 0, duration: 11, opacity: 0.12, rotate: 15 },
        { value: "✦", x: "85%", y: "18%", size: "text-6xl", delay: 1, duration: 9, opacity: 0.15, rotate: -20 },
        { value: "🔒", x: "10%", y: "75%", size: "text-8xl", delay: 2, duration: 13, opacity: 0.08, rotate: 30 },
        { value: "❖", x: "82%", y: "70%", size: "text-7xl", delay: 0.5, duration: 10, opacity: 0.12, rotate: -15 },
        { value: "◆", x: "42%", y: "85%", size: "text-6xl", delay: 3, duration: 12, opacity: 0.10, rotate: 25 },
        { value: "📄", x: "75%", y: "35%", size: "text-8xl", delay: 1.5, duration: 14, opacity: 0.07, rotate: -10 }
    ];

    return (
        <div className="w-full bg-[#f8fafc] dark:bg-slate-800 text-slate-800 dark:text-white font-sans relative overflow-hidden py-8 px-4 sm:px-6 lg:px-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm mb-8">
            
            {/* Technical Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.03)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_at_center,black_50%,transparent_100%)] pointer-events-none z-0" />
            
            {/* Floating 3D parallax elements */}
            {FLOATING_SHAPES.map((item, idx) => (
                <motion.div
                    key={idx}
                    className="absolute pointer-events-none select-none z-0"
                    style={{
                        left: item.x,
                        top: item.y,
                        opacity: item.opacity,
                    }}
                    animate={{
                        y: [0, -25, 0]
                    }}
                    transition={{
                        duration: item.duration,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: item.delay
                    }}
                >
                    <div 
                        className={`${item.size} font-mono font-black text-cyan-600`}
                        style={{
                            transform: `perspective(800px) rotateX(25deg) rotateY(-20deg) rotateZ(${item.rotate}deg)`,
                            filter: "drop-shadow(2px 4px 6px rgba(15,23,42,0.06)) drop-shadow(4px 10px 15px rgba(6,182,212,0.1))"
                        }}
                    >
                        {item.value}
                    </div>
                </motion.div>
            ))}

            {/* Soft Ambient glows */}
            <div className="absolute top-[-5%] left-[10%] w-[600px] h-[600px] bg-cyan-500/[0.02] blur-[130px] rounded-full pointer-events-none z-0" />
            <div className="absolute bottom-[-5%] right-[10%] w-[600px] h-[600px] bg-violet-500/[0.02] blur-[130px] rounded-full pointer-events-none z-0" />

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center space-y-12">
                
                {/* Header HUD panel */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 w-full max-w-3xl relative"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-xs font-mono tracking-widest uppercase">
                        <Database className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Data Cache Protocol
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 uppercase">
                        Cookie <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">Policy</span>
                    </h1>

                    <p className="text-xs font-mono text-slate-400 max-w-xl mx-auto leading-relaxed">
                        Last Calibrated / Updated: February 2024
                    </p>
                </motion.div>

                {/* Technical-themed wrapper for Legal Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="w-full bg-white border border-slate-200 shadow-sm rounded-3xl p-6 sm:p-12 backdrop-blur-md relative"
                >
                    <div className="absolute top-0 left-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
                    
                    <div className="space-y-8 text-slate-600 leading-relaxed font-sans text-sm md:text-base">
                        
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 font-medium">
                            This Cookie Policy explains what cookies are, how we use them, and your choices regarding their use on the Reflextry cognitive training hub.
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">1</span>
                                What are Cookies?
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide telemetry information to website owners.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                Cookies allow a website to recognize your device and store some information about your preferences or past actions.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-4">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">2</span>
                                Types of Cookies We Use
                            </h2>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h3 className="text-sm font-mono font-bold text-slate-800 mb-1">1. Essential Cookies</h3>
                                    <p className="text-xs md:text-sm text-slate-500">
                                        These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas of the website.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h3 className="text-sm font-mono font-bold text-slate-800 mb-1">2. Analytics Cookies</h3>
                                    <p className="text-xs md:text-sm text-slate-500">
                                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use Google Analytics for this purpose.
                                    </p>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                                    <h3 className="text-sm font-mono font-bold text-slate-800 mb-1.5">3. Advertising Cookies</h3>
                                    <p className="text-xs md:text-sm text-slate-500 mb-2">
                                        These cookies are used to deliver advertisements that are relevant to you and your interests. They are also used to limit the number of times you see an advertisement and help measure the effectiveness of advertising campaigns.
                                    </p>
                                    <p className="text-xs md:text-sm text-slate-500 mb-2 font-semibold">
                                        Google AdSense Cookies: We use Google AdSense to display ads on our website. Google AdSense uses cookies to:
                                    </p>
                                    <ul className="space-y-1 pl-4">
                                        <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                            <span>Serve ads based on your prior visits to our website or other websites</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                            <span>Measure the effectiveness of ads</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                            <span>Prevent showing the same ad multiple times</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                            <span>Provide personalized advertising</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">3</span>
                                Third-Party Cookies
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Google AdSense:</strong> Google, as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables it to serve ads to our users based on their visit to our site and other sites on the Internet.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Google Analytics:</strong> We use Google Analytics to analyze the use of our website. Google Analytics gathers information about website use by means of cookies.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">4</span>
                                Managing Cookies
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your experience on our website.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500 font-semibold">
                                Opt-Out of Personalized Advertising:
                            </p>
                            <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Visit <a href="https://www.google.com/settings/ads" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a> to opt out of Google's use of cookies for personalized advertising</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Visit <a href="https://www.aboutads.info/choices/" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a> to opt out of a third-party vendor's use of cookies for personalized advertising</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Use the <a href="https://tools.google.com/dlpage/gaoptout" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Google Analytics Opt-out Browser Add-on</a> to prevent Google Analytics from collecting information about your visits</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">5</span>
                                Cookie Consent
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                By continuing to use our website, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you should set your browser settings accordingly or not use our website.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">6</span>
                                Contact Us
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                If you have any questions about our use of cookies, please contact us at <a href="mailto:support@reflextry.com" className="text-cyan-600 hover:underline font-semibold">support@reflextry.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
