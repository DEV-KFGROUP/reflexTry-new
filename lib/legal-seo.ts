import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";

export function getLegalPageMetadata(page: "privacy" | "cookies" | "terms" | "contact" | "about", locale?: string): Metadata {
    const configs = {
        about: {
            title: "About Us - Our Mission & Team",
            description: "Learn about Reflextry's mission to improve cognitive performance. Discover our evidence-based approach to memory, reaction time, and speed training.",
            keywords: [
                "about us", "our mission", "team", "brain training", "cognitive enhancement",
                "memory training", "reaction time", "speed training", "brain games",
                "cognitive performance", "mental training", "brain health", "cognitive skills"
            ],
        },
        privacy: {
            title: "Privacy Policy - Data Protection & Privacy",
            description: "Read our privacy policy to understand how Reflextry collects, uses, and protects your data. We use Google AdSense and respect your privacy.",
            keywords: [
                "privacy policy", "data protection", "privacy statement", "data privacy",
                "user privacy", "data security", "privacy rights", "GDPR compliance",
                "cookie policy", "data collection", "personal information", "online privacy"
            ],
        },
        cookies: {
            title: "Cookies Policy - Cookie Usage & Management",
            description: "Learn about how Reflextry uses cookies, including Google AdSense cookies. Manage your cookie preferences and understand our cookie policy.",
            keywords: [
                "cookies policy", "cookie usage", "cookie management", "cookie consent",
                "browser cookies", "cookie settings", "cookie preferences",
                "advertising cookies", "analytics cookies", "essential cookies"
            ],
        },
        terms: {
            title: "Terms and Conditions - User Agreement",
            description: "Read our terms and conditions to understand the rules and guidelines for using Reflextry. User agreement and terms of service.",
            keywords: [
                "terms and conditions", "terms of service", "user agreement", "terms of use",
                "service terms", "website terms", "legal terms", "usage terms"
            ],
        },
        contact: {
            title: "Contact Us - Get in Touch",
            description: "Contact Reflextry for questions, support, or feedback. We're here to help with your brain training and cognitive testing needs.",
            keywords: [
                "contact us", "get in touch", "support contact", "customer service",
                "help center", "contact form", "support email", "customer support"
            ],
        },
    };

    const config = configs[page];

    return generateSEOMetadata({
        title: config.title,
        description: config.description,
        keywords: config.keywords,
        url: `/${page}`,
        type: "website",
        locale,
    });
}

export function getLeaderboardMetadata(locale?: string): Metadata {
    return generateSEOMetadata({
        title: "Leaderboard - Track Your Personal Bests",
        description: "View your personal best scores across all Reflextry tools. Track your progress in memory games, reaction tests, typing speed, and more.",
        keywords: [
            "leaderboard", "high scores", "personal bests", "score tracking",
            "game scores", "best scores", "performance tracking", "personal records",
            "score history", "cognitive benchmark rankings"
        ],
        url: `/leaderboard`,
        type: "website",
        locale,
    });
}

