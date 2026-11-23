"use client";

import { useState } from "react";
import {
  Mail,
  Loader2,
  MessageSquare,
  Headphones,
  Twitter,
  Instagram,
  Shield,
  SendHorizontal,
  Building2,
  MapPin,
} from "lucide-react";
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
        toast.error(
          data.message || t("contact.errorMsg", "Failed to send message")
        );
      }
    } catch {
      toast.error(
        t("contact.errorMsg", "Failed to send message. Please try again.")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: MessageSquare,
      title: t("contact.generalInquiries", "General Inquiries"),
      email: "support@reflextry.com",
      description: t(
        "contact.generalInquiriesDesc",
        "For general inquiries, partnerships, and press."
      ),
    },
    {
      icon: Headphones,
      title: t("contact.technicalSupport", "Technical Support"),
      email: "support@reflextry.com",
      description: t(
        "contact.technicalSupportDesc",
        "For technical support, bug reports, and product feedback."
      ),
    },
    {
      icon: Building2,
      title: "Office",
      address:
        "346, Gujarat State Highway 167, Shanti Niketan Society, Mota Varachha, Surat, Gujarat 394101",
      description: "Surat, Gujarat, India.",
    },
  ];

  const socialLinks = [
    {
      icon: Twitter,
      name: "Twitter",
      href: "https://twitter.com/reflextry_",
    },
    {
      icon: Instagram,
      name: "Instagram",
      href: "https://instagram.com/reflextry_",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#161614] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <header className="space-y-4 pb-8 border-b border-[#E6E3DB]">
          <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#1E40AF]">
            Support &amp; Feedback
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold tracking-tight text-[#161614]">
            {t("contact.heroTitle", "Contact")}{" "}
            {t("contact.heroTitleHighlight", "Us")}
          </h1>
          <p className="text-base sm:text-lg text-[#4A4842] max-w-2xl leading-relaxed">
            {t(
              "contact.heroSubtitle",
              "Have a question, bug report, or suggestion for a new cognitive benchmark? Reach out directly using the channels or form below."
            )}
          </p>
        </header>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-5">
            {contactMethods.map((method) => (
              <div
                key={method.title}
                className="bg-white border border-[#E6E3DB] rounded-2xl p-5 flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#F3F1EB] border border-[#E6E3DB] flex items-center justify-center shrink-0 text-[#1E40AF]">
                  <method.icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <h2 className="text-base font-semibold text-[#161614]">
                    {method.title}
                  </h2>
                  <p className="text-xs text-[#4A4842] leading-relaxed">
                    {method.description}
                  </p>
                  {method.email ? (
                    <a
                      href={`mailto:${method.email}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-medium text-[#1E40AF] hover:underline pt-1"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      {method.email}
                    </a>
                  ) : (
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        method.address as string
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1.5 text-xs font-mono text-[#1E40AF] hover:underline pt-1"
                    >
                      <MapPin
                        className="w-3.5 h-3.5 mt-0.5 shrink-0"
                        aria-hidden="true"
                      />
                      <span className="leading-relaxed">{method.address}</span>
                    </a>
                  )}
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-white border border-[#E6E3DB] hover:border-[#D8D4C9] hover:bg-[#F3F1EB] rounded-xl text-sm font-medium text-[#161614] transition-colors"
                >
                  <social.icon className="w-4 h-4" aria-hidden="true" />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>

            {/* Response Time Note */}
            <div className="bg-[#F3F1EB] border border-[#E6E3DB] rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#161614]">
                <Shield className="w-4 h-4 text-[#1E40AF]" aria-hidden="true" />
                <span>Response Time</span>
              </div>
              <p className="text-xs text-[#4A4842] leading-relaxed">
                Support messages, bug reports, and feature requests are reviewed
                directly by our team and typically receive a reply within{" "}
                <span className="font-mono font-semibold text-[#161614]">
                  24–48 hours
                </span>{" "}
                on business days.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl font-semibold text-[#161614]">
                Send a Message
              </h2>
              <p className="text-sm text-[#4A4842]">
                Include your browser and device type if you are reporting a bug.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium text-[#4A4842]"
                  >
                    {t("contact.formName", "Your Name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#D8D4C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] focus:bg-white text-sm text-[#161614] placeholder:text-[#8A867C] transition-colors"
                    placeholder={t("contact.formNamePlaceholder", "Jane Doe")}
                  />
                </div>
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium text-[#4A4842]"
                  >
                    {t("contact.formEmail", "Email Address")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#D8D4C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] focus:bg-white text-sm text-[#161614] placeholder:text-[#8A867C] transition-colors"
                    placeholder={t(
                      "contact.formEmailPlaceholder",
                      "jane@example.com"
                    )}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="subject"
                  className="block text-xs font-medium text-[#4A4842]"
                >
                  {t("contact.formSubject", "Subject")}
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#D8D4C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] focus:bg-white text-sm text-[#161614] placeholder:text-[#8A867C] transition-colors"
                  placeholder={t(
                    "contact.formSubjectPlaceholder",
                    "Bug report, tool request, or general feedback"
                  )}
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="message"
                  className="block text-xs font-medium text-[#4A4842]"
                >
                  {t("contact.formMessage", "Message")}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  required
                  className="w-full px-3.5 py-2.5 bg-[#FAF9F6] border border-[#D8D4C9] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1E40AF]/20 focus:border-[#1E40AF] focus:bg-white text-sm text-[#161614] placeholder:text-[#8A867C] transition-colors resize-none"
                  placeholder={t(
                    "contact.formMessagePlaceholder",
                    "Describe your question or issue..."
                  )}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl bg-[#161614] hover:bg-[#2C2B27] disabled:bg-[#8A867C] text-[#FAF9F6] text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    <span>{t("contact.formSending", "Sending...")}</span>
                  </>
                ) : (
                  <>
                    <SendHorizontal className="w-4 h-4" aria-hidden="true" />
                    <span>{t("contact.formSubmit", "Send Message")}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ */}
        <section className="bg-white border border-[#E6E3DB] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-semibold text-[#161614]">
              Support &amp; Feedback FAQ
            </h2>
            <p className="text-sm text-[#4A4842]">
              Common questions about reporting bugs, requesting new benchmarks,
              and research inquiries.
            </p>
          </div>

          <div className="divide-y divide-[#E6E3DB]">
            <div className="py-4 first:pt-0 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                How do I report a bug or glitch?
              </h3>
              <p className="text-sm text-[#4A4842] leading-relaxed">
                Use the form above and mention the tool name, your browser
                (Chrome, Safari, Firefox), and device type (mobile or desktop)
                along with what happened so we can reproduce and fix it quickly.
              </p>
            </div>
            <div className="py-4 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Can I request a new benchmark tool?
              </h3>
              <p className="text-sm text-[#4A4842] leading-relaxed">
                Yes. Many tools in the Reflextry suite started from community
                requests. Send a note with the subject &ldquo;New Tool
                Request&rdquo; describing the skill and scoring format you want
                to measure.
              </p>
            </div>
            <div className="py-4 last:pb-0 space-y-1.5">
              <h3 className="text-sm font-semibold text-[#161614]">
                Do you support educational or team inquiries?
              </h3>
              <p className="text-sm text-[#4A4842] leading-relaxed">
                Schools, researchers, and competitive teams looking for custom
                protocols or data discussions can reach us directly at{" "}
                <a
                  href="mailto:support@reflextry.com"
                  className="text-[#1E40AF] hover:underline"
                >
                  support@reflextry.com
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
