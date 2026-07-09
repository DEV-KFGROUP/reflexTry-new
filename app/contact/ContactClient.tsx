"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Mail, Send, Loader2, MessageSquare, Headphones, Twitter, Instagram } from "lucide-react";
import { toast } from "@/utils/toast";

export default function ContactClient() {
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
                toast.success("Message sent successfully!");
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message");
            }
        } catch (error) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactMethods = [
        {
            icon: MessageSquare,
            title: "General Inquiries",
            email: "support@reflextry.com",
            description: "For general inquiries, partnerships, and press.",
            color: "from-speed/20 to-speed/5",
            borderColor: "border-speed/30 hover:border-speed/60",
            iconColor: "text-speed",
            shadowColor: "hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
        },
        {
            icon: Headphones,
            title: "Technical Support",
            email: "support@reflextry.com",
            description: "For technical support, bug reports, and product feedback.",
            color: "from-reflex/20 to-reflex/5",
            borderColor: "border-reflex/30 hover:border-reflex/60",
            iconColor: "text-reflex",
            shadowColor: "hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
        }
    ];

    const socialLinks = [
        {
            icon: Twitter,
            name: "Twitter",
            href: "https://twitter.com/reflextry_",
            color: "hover:bg-[#1DA1F2] hover:text-white hover:border-[#1DA1F2]"
        },
        {
            icon: Instagram,
            name: "Instagram",
            href: "https://instagram.com/reflextry_",
            color: "hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]"
        }
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-speed via-reflex to-speed bg-clip-text text-transparent mb-4">
                    Contact Us
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    We're here to help! Reach out to us for any questions, feedback, or support.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Left Column - Contact Information */}
                <div className="space-y-8">
                    {/* Email Us Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Mail className="w-6 h-6 text-speed" />
                            Email Us
                        </h2>
                        <div className="space-y-4">
                            {contactMethods.map((method, index) => (
                                <div
                                    key={index}
                                    className={`group relative p-6 rounded-xl bg-card/50 backdrop-blur-xl border ${method.borderColor} ${method.shadowColor} transition duration-200`}
                                >
                                    {/* Hover glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl`} />

                                    <div className="relative z-10 space-y-3">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-3 rounded-lg bg-gradient-to-br ${method.color} border ${method.borderColor}`}>
                                                <method.icon className={`w-6 h-6 ${method.iconColor}`} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-lg font-bold text-white mb-1">{method.title}</h3>
                                                <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                                                <a
                                                    href={`mailto:${method.email}`}
                                                    className={`inline-flex items-center gap-2 text-sm font-medium ${method.iconColor} hover:underline transition-colors`}
                                                >
                                                    <Mail className="w-4 h-4" />
                                                    {method.email}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Connect With Us Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">
                            Connect With Us
                        </h2>
                        <div className="flex gap-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center gap-2 px-6 py-3 bg-card/50 border border-white/10 rounded-lg text-muted-foreground transition duration-200 ${social.color} hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                                    aria-label={social.name}
                                >
                                    <social.icon className="w-5 h-5" />
                                    <span className="font-medium">{social.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Response Time Info */}
                    <div className="p-6 rounded-xl bg-memory/10 border border-memory/30">
                        <h3 className="text-lg font-bold text-memory mb-2">
                            Response Time
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            We typically respond within 24-48 hours during business days. For urgent technical issues, please mark your email as 'Urgent' in the subject line.
                        </p>
                    </div>
                </div>

                {/* Right Column - Contact Form */}
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-speed/50 text-white placeholder-gray-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-speed/50 text-white placeholder-gray-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                                Subject
                            </label>
                            <input
                                type="text"
                                id="subject"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-speed/50 text-white placeholder-gray-500"
                                placeholder="Feedback / Question"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium text-gray-300">
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                                className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-speed/50 text-white placeholder-gray-500 resize-none"
                                placeholder="How can we help?"
                            ></textarea>
                        </div>

                        <Button
                            type="submit"
                            size="lg"
                            variant="game"
                            className="w-full"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Send Message
                                    <Send className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

