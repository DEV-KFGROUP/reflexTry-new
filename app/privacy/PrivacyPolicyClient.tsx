"use client";

import { motion } from "framer-motion";
import { Shield, Lock, FileText, Eye, Share2, HelpCircle, Mail, Sparkles } from "lucide-react";

export default function PrivacyPolicyClient() {
    const FLOATING_SHAPES = [
        { value: "🛡", x: "8%", y: "15%", size: "text-7xl", delay: 0, duration: 11, opacity: 0.12, rotate: 15 },
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
                        <Shield className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Security & Trust Protocol
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 uppercase">
                        Privacy <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 bg-clip-text text-transparent">Policy</span>
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
                            Your privacy is critically important to us. This policy outlines how we collect, use, and protect your information when engaging with Reflextry's cognitive calibrators.
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">1</span>
                                Information We Collect
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We do not collect personal data such as names or emails unless you voluntarily contact us. We may collect non-personal data like browser type and usage statistics to improve our services.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                When you use our website, we may automatically collect certain information about your device, including information about your web browser, IP address, time zone, and some of the cookies that are installed on your device.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">2</span>
                                Cookies and Tracking Technologies
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We use cookies to enhance your experience, analyze site traffic, and serve personalized ads via Google AdSense. Cookies are small data files stored on your device.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                We use the following types of cookies:
                            </p>
                            <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span><strong>Essential Cookies:</strong> Required for the website to function properly</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span><strong>Advertising Cookies:</strong> Used to deliver relevant advertisements and track ad performance</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">3</span>
                                Google AdSense and Advertising
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We use Google AdSense to display advertisements on our website. Google AdSense is a program run by Google that allows publishers to display ads on their websites.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Third-Party Vendors:</strong> Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Google's Use of Advertising Cookies:</strong> Google uses cookies to serve ads on our site. Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our site and/or other sites on the Internet.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Opt-Out:</strong> You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">www.aboutads.info/choices</a>.
                            </p>
                            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs md:text-sm font-mono text-slate-500">
                                AdSense Publisher ID: ca-pub-3064655546051154
                            </div>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">4</span>
                                Third-Party Services
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We use third-party services including:
                            </p>
                            <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span><strong>Google Analytics:</strong> To analyze website traffic and user behavior</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span><strong>Google AdSense:</strong> To display advertisements on our website</span>
                                </li>
                            </ul>
                            <p className="text-xs md:text-sm text-slate-500">
                                These services may collect information sent by your browser, including your IP address, browser type, pages visited, and time spent on pages. This information is used to provide and improve our services.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">5</span>
                                Data Sharing
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We do not sell, trade, or rent your personal information to third parties. However, we may share non-personal, aggregated information with third-party service providers to help us operate our website and conduct our business.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">6</span>
                                Your Rights
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                You have the right to:
                            </p>
                            <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Access and receive a copy of your personal data</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Request correction of inaccurate personal data</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Request deletion of your personal data</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Opt out of personalized advertising</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Disable cookies through your browser settings</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">7</span>
                                Contact Us
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@reflextry.com" className="text-cyan-600 hover:underline font-semibold">support@reflextry.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
