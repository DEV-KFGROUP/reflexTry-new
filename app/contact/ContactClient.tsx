"use client";

import { useState } from "react";
import { Mail, Send, Loader2, MessageSquare, Headphones, Twitter, Instagram, Sparkles, Shield, SendHorizontal, Building2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/utils/toast";
import { useTranslation } from "@/lib/i18n/context";

export default function ContactClient() {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                toast.success(t("contact.successMsg", "Message sent successfully!"));
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || t("contact.errorMsg", "Failed to send message"));
            }
        } catch (error) {
            toast.error(t("contact.errorMsg", "Failed to send message. Please try again."));
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: MessageSquare,
            title: t("contact.generalInquiries", "General Inquiries"),
            email: "support@reflextry.com",
            description: t("contact.generalInquiriesDesc", "For general inquiries, partnerships, and press."),
            color: "from-cyan-500/20 to-cyan-500/5",
            borderColor: "border-cyan-200 hover:border-cyan-400/60",
            iconColor: "text-cyan-600",
            shadowColor: "hover:shadow-[0_0_20px_rgba(6,182,212,0.15)]",
            accentBg: "bg-cyan-50 border-cyan-200"
        },
        {
            icon: Headphones,
            title: t("contact.technicalSupport", "Technical Support"),
            email: "support@reflextry.com",
            description: t("contact.technicalSupportDesc", "For technical support, bug reports, and product feedback."),
            color: "from-violet-500/20 to-violet-500/5",
            borderColor: "border-violet-200 hover:border-violet-400/60",
            iconColor: "text-violet-600",
            shadowColor: "hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]",
            accentBg: "bg-violet-50 border-violet-200"
        },
        {
            icon: Building2,
            title: "Head Office",
            address: "346, Gujarat State Highway 167, Shanti Niketan Society, Mota Varachha, Surat, Gujarat 394101",
            description: "Visit us at our headquarters for business meetings and collaborations.",
            color: "from-emerald-500/20 to-emerald-500/5",
            borderColor: "border-emerald-200 hover:border-emerald-400/60",
            iconColor: "text-emerald-600",
            shadowColor: "hover:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
            accentBg: "bg-emerald-50 border-emerald-200"
        }
    ];

    const socialLinks = [
        {
            icon: Twitter,
            name: "Twitter",
            href: "https://twitter.com/reflextry_",
            accentColor: "group-hover:text-sky-500 group-hover:border-sky-300",
            glowColor: "shadow-sky-500/10",
            activeTranslate: "group-active:translate-y-1"
        },
        {
            icon: Instagram,
            name: "Instagram",
            href: "https://instagram.com/reflextry_",
            accentColor: "group-hover:text-pink-500 group-hover:border-pink-300",
            glowColor: "shadow-pink-500/10",
            activeTranslate: "group-active:translate-y-1"
        }
    ];

    const FLOATING_SHAPES = [
        { value: "✉", x: "8%", y: "12%", size: "text-7xl", delay: 0, duration: 12, opacity: 0.12, rotate: 15 },
        { value: "✦", x: "88%", y: "15%", size: "text-6xl", delay: 1, duration: 10, opacity: 0.15, rotate: -20 },
        { value: "💬", x: "7%", y: "78%", size: "text-8xl", delay: 2, duration: 14, opacity: 0.08, rotate: 35 },
        { value: "❖", x: "84%", y: "72%", size: "text-7xl", delay: 0.5, duration: 9, opacity: 0.12, rotate: -15 },
        { value: "◆", x: "42%", y: "88%", size: "text-6xl", delay: 3, duration: 11, opacity: 0.10, rotate: 25 },
        { value: "☏", x: "78%", y: "32%", size: "text-8xl", delay: 1.5, duration: 13, opacity: 0.07, rotate: -10 }
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

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col items-start space-y-12">

                {/* Header HUD panel */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-left space-y-4 w-full max-w-3xl relative"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 text-xs font-mono tracking-widest uppercase">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
                        Communications Portal
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-mono font-extrabold tracking-tight text-slate-900 dark:text-white uppercase">
                        {t("contact.heroTitle", "Contact")}{" "}
                        <span
                            className="inline-block text-cyan-600"
                            style={{
                                background: "linear-gradient(110deg, #0891b2 0%, #2563eb 50%, #7c3aed 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                backgroundClip: "text",
                            }}
                        >
                            {t("contact.heroTitleHighlight", "Us")}
                        </span>
                    </h1>

                    <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
                        {t("contact.heroSubtitle", "Have queries, feedback, or need technical calibration? Access our support pipelines below.")}
                    </p>
                </motion.div>

                {/* Main Content Grid */}
                <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Contact Channels */}
                    <div className="lg:col-span-5 space-y-6">

                        <div className="flex flex-col space-y-4">
                            <h2 className="text-xs font-mono font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                                Transmission Channels
                            </h2>

                            {contactMethods.map((method, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`group relative p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm ${method.shadowColor} transition-all duration-300 overflow-hidden`}
                                >
                                    {/* Subtle gradient hover background */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`} />

                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className={`p-3.5 rounded-xl ${method.accentBg} border ${method.borderColor} group-hover:scale-105 transition-transform duration-300`}>
                                            <method.icon className={`w-6 h-6 ${method.iconColor}`} />
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h3 className="text-base font-mono font-bold text-slate-800">{method.title}</h3>
                                            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed pr-2">{method.description}</p>
                                            <div className="pt-2">
                                                {method.email ? (
                                                    <a
                                                        href={`mailto:${method.email}`}
                                                        className={`inline-flex items-center gap-1.5 text-xs font-mono font-semibold ${method.iconColor} hover:underline`}
                                                    >
                                                        <Mail className="w-3.5 h-3.5" />
                                                        {method.email}
                                                    </a>
                                                ) : (
                                                    <a
                                                        href={`https://maps.google.com/?q=${encodeURIComponent(method.address as string)}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className={`inline-flex items-start gap-1.5 text-xs font-mono font-semibold ${method.iconColor} hover:underline text-left`}
                                                    >
                                                        <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                                                        <span className="leading-relaxed">{method.address}</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Social Channels */}
                        <div className="space-y-3">
                            <h2 className="text-xs font-mono font-bold tracking-widest text-slate-600 dark:text-slate-400 uppercase flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                                Social Networks
                            </h2>

                            <div className="flex gap-4">
                                {socialLinks.map((social) => (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`group relative flex-1 flex items-center justify-center gap-2 py-4 bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-300 select-none hover:shadow-lg ${social.glowColor} ${social.activeTranslate}`}
                                    >
                                        <div className="absolute inset-0 rounded-xl bg-slate-100 translate-y-1 border-b-2 border-black/10 -z-10 group-hover:translate-y-1 group-active:translate-y-0" />
                                        <social.icon className="w-4 h-4 text-slate-500 transition-colors duration-300 group-hover:text-slate-800" />
                                        <span className="text-xs font-mono font-bold text-slate-600 group-hover:text-slate-800">{social.name}</span>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Response Time Console */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 relative overflow-hidden shadow-inner"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/[0.02] rounded-full blur-xl pointer-events-none" />
                            <div className="space-y-2">
                                <h3 className="text-xs font-mono font-bold text-slate-700 tracking-wider flex items-center gap-1.5">
                                    <Shield className="w-4 h-4 text-cyan-600" />
                                    TRANSMISSION SLA
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed font-sans">
                                    Our support channels are monitored continuously. General feedback, bug reports, and customization requests typically process within <span className="text-cyan-600 font-mono font-bold">24-48 hours</span> on standard business days.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Transmission Form Deck */}
                    <div className="lg:col-span-7 bg-white border border-slate-200/80 shadow-sm rounded-3xl p-6 md:p-8 backdrop-blur-md relative">
                        <div className="absolute top-0 left-10 w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

                        <div className="space-y-6">
                            <div className="space-y-1">
                                <h2 className="text-xl font-mono font-bold text-slate-800 uppercase tracking-wide">
                                    {t("contact.heroTitle", "Transmit")} {t("contact.heroTitleHighlight", "Message")}
                                </h2>
                                <p className="text-xs text-slate-400">
                                    {t("contact.heroSubtitle", "Fill out the coordinates below to dispatch a message directly to our database.")}
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="space-y-1.5">
                                        <label htmlFor="name" className="text-xs font-mono font-semibold text-slate-500 uppercase">
                                            {t("contact.formName", "Operator Name")}
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-sm text-slate-800 placeholder-slate-400 transition-all font-sans"
                                            placeholder={t("contact.formNamePlaceholder", "John Doe")}
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-mono font-semibold text-slate-500 uppercase">
                                            {t("contact.formEmail", "Return Address")}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-sm text-slate-800 placeholder-slate-400 transition-all font-sans"
                                            placeholder={t("contact.formEmailPlaceholder", "john@example.com")}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="subject" className="text-xs font-mono font-semibold text-slate-500 uppercase">
                                        {t("contact.formSubject", "Signal Subject")}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-sm text-slate-800 placeholder-slate-400 transition-all font-sans"
                                        placeholder={t("contact.formSubjectPlaceholder", "Partnership / Bug / General Feedback")}
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label htmlFor="message" className="text-xs font-mono font-semibold text-slate-500 uppercase">
                                        {t("contact.formMessage", "Message Payload")}
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 focus:bg-white text-sm text-slate-800 placeholder-slate-400 transition-all font-sans resize-none"
                                        placeholder={t("contact.formMessagePlaceholder", "Describe the nature of your request...")}
                                    ></textarea>
                                </div>

                                <div className="pt-2">
                                    <motion.button
                                        type="submit"
                                        disabled={isSubmitting}
                                        whileHover={{ translateY: -2 }}
                                        whileTap={{ translateY: 4 }}
                                        className="relative group cursor-pointer focus:outline-none select-none w-full"
                                    >
                                        <div className="absolute inset-0 rounded-xl bg-cyan-700 translate-y-1 border-b-2 border-black/25" />
                                        <div className="relative py-4 rounded-xl bg-cyan-500 text-white font-mono font-bold tracking-widest text-sm border border-cyan-400 group-hover:bg-cyan-400 transition-colors shadow-[0_4px_12px_rgba(6,182,212,0.15)] flex items-center justify-center gap-2 group-active:translate-y-1 group-disabled:bg-slate-300 group-disabled:border-slate-200 group-disabled:cursor-not-allowed">
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    {t("contact.formSending", "Transmitting...")}
                                                </>
                                            ) : (
                                                <>
                                                    <SendHorizontal className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                                    {t("contact.formSubmit", "Dispatch Signal")}
                                                </>
                                            )}
                                        </div>
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* SEO & FAQ Content Block */}
                <div className="w-full max-w-4xl mx-auto mt-16 p-8 md:p-10 bg-white/50 backdrop-blur-sm border border-slate-200/80 rounded-3xl shadow-sm z-10 relative">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-6 font-mono tracking-tight">Support & Feedback FAQ</h2>
                    <div className="space-y-6 text-slate-600 leading-relaxed font-sans">
                        <p>
                            Welcome to the Reflextry contact portal. We value community input above all else. Whether you're reporting a bug on our visual memory test, requesting a brand new typing speed variation, or inquiring about commercial licensing for cognitive research, our team is ready to assist.
                        </p>

                        <div className="space-y-4 mt-8">
                            <div>
                                <h4 className="font-bold text-slate-800">How do I report a bug or glitch?</h4>
                                <p>If a specific brain training tool isn't loading or scoring correctly, please use the contact form above. Include your browser (Chrome, Safari, Firefox), your device type (Mobile/Desktop), and a brief description of the issue. This helps our engineers patch the problem rapidly.</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800">Can I request a new benchmark tool?</h4>
                                <p>Absolutely! Many of our most popular games—like the Chimp Test and Sequence Memory—were heavily inspired by user suggestions. If you have an idea for a new reflex, accuracy, or speed test, drop us a message with the subject "New Tool Request".</p>
                            </div>

                            <div>
                                <h4 className="font-bold text-slate-800">Do you offer API access or data exports?</h4>
                                <p>We are currently exploring options for educational institutions, researchers, and professional esports teams who wish to export raw cognitive latency data or integrate our reaction tools via API. Please reach out to our business email for enterprise inquiries.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
