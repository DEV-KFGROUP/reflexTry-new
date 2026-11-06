"use client";

import { motion } from "framer-motion";
import { Shield, FileText, Scale, Eye, Lock, Gavel, HelpCircle, Mail, Sparkles } from "lucide-react";

export default function TermsClient() {
    const FLOATING_SHAPES = [
        { value: "⚖", x: "8%", y: "15%", size: "text-7xl", delay: 0, duration: 11, opacity: 0.12, rotate: 15 },
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
                        <Gavel className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Terms of Engagement
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        Terms of{" "}
                        <span
                            className="inline-block text-cyan-600"
                            style={{
                                background: "linear-gradient(110deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            Service
                        </span>
                    </h1>

                    <p className="text-xs font-mono text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
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
                            Please read these Terms and Conditions carefully before initiating cognitive training or usage of Reflextry's interactive systems.
                        </div>

                        {/* Section 1 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">1</span>
                                Acceptance of Terms
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                By accessing and using Reflextry, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                We reserve the right to modify these terms at any time. Your continued use of the website after any such changes constitutes your acceptance of the new terms.
                            </p>
                        </section>

                        {/* Section 2 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">2</span>
                                Usage License
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                Permission is granted to use Reflextry for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                            </p>
                            <ul className="space-y-2 pl-4">
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Modify or copy the materials</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Use the materials for any commercial purpose or for any public display</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Attempt to decompile or reverse engineer any software contained on the website</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Remove any copyright or other proprietary notations from the materials</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs md:text-sm text-slate-500">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0" />
                                    <span>Transfer the materials to another person or "mirror" the materials on any other server</span>
                                </li>
                            </ul>
                        </section>

                        {/* Section 3 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">3</span>
                                Advertising and Third-Party Content
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                Our website displays advertisements provided by Google AdSense and other third-party advertising networks. These advertisements may be targeted to content, information gathered on this website, or other information.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Ad Content:</strong> We do not control the content of advertisements displayed on our website. Advertisers are responsible for ensuring that materials submitted for inclusion on our website comply with applicable laws and regulations.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Third-Party Links:</strong> Our website may contain links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party websites.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                <strong>Google AdSense:</strong> We participate in Google AdSense, an advertising service provided by Google Inc. Google uses cookies to serve ads based on your prior visits to our website or other websites. You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-600 hover:underline font-semibold" target="_blank" rel="noopener noreferrer">Google's Ads Settings</a>.
                            </p>
                        </section>

                        {/* Section 4 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">4</span>
                                User Conduct
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                You agree to use our website only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                Prohibited behavior includes harassing or causing distress or inconvenience to any person, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our website.
                            </p>
                        </section>

                        {/* Section 5 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">5</span>
                                Intellectual Property
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                The materials contained in this website are protected by applicable copyright and trademark law. All content, including but not limited to text, graphics, logos, and software, is the property of Reflextry or its content suppliers and is protected by international copyright laws.
                            </p>
                        </section>

                        {/* Section 6 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">6</span>
                                Disclaimer
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                The materials on Reflextry are provided 'as is'. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
                            </p>
                            <p className="text-xs md:text-sm text-slate-500">
                                Further, we do not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on our website or otherwise relating to such materials or on any sites linked to this site.
                            </p>
                        </section>

                        {/* Section 7 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">7</span>
                                Limitations
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                In no event shall Reflextry or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Reflextry, even if Reflextry or a Reflextry authorized representative has been notified orally or in writing of the possibility of such damage.
                            </p>
                        </section>

                        {/* Section 8 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">8</span>
                                Accuracy of Materials
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                The materials appearing on Reflextry could include technical, typographical, or photographic errors. We do not warrant that any of the materials on its website are accurate, complete, or current. We may make changes to the materials contained on its website at any time without notice.
                            </p>
                        </section>

                        {/* Section 9 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">9</span>
                                Links
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We have not reviewed all of the sites linked to our website and are not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any such linked website is at the user's own risk.
                            </p>
                        </section>

                        {/* Section 10 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">10</span>
                                Modifications
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                We may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
                            </p>
                        </section>

                        {/* Section 11 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">11</span>
                                Governing Law
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                These terms and conditions are governed by and construed in accordance with applicable laws. Any disputes relating to these terms shall be subject to the exclusive jurisdiction of the courts in the applicable jurisdiction.
                            </p>
                        </section>

                        {/* Section 12 */}
                        <section className="space-y-3">
                            <h2 className="text-lg font-mono font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
                                <span className="flex items-center justify-center w-6 h-6 rounded bg-cyan-50 text-cyan-600 text-xs font-mono">12</span>
                                Contact Information
                            </h2>
                            <p className="text-xs md:text-sm text-slate-500">
                                If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:support@reflextry.com" className="text-cyan-600 hover:underline font-semibold">support@reflextry.com</a>.
                            </p>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
