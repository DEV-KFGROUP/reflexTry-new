import { Metadata } from "next";
import { generateSEOMetadata } from "@/components/SEO";

export function getLegalPageMetadata(page: "privacy" | "cookies" | "terms" | "contact" | "about"): Metadata {
    const configs = {
        about: {
            title: "About Us - Our Mission & Team | Reflextry",
            description: "Learn about Reflextry's mission to improve cognitive performance. Discover our evidence-based approach to memory, reaction time, and speed training.",
            keywords: [
                "about us", "our mission", "team", "brain training", "cognitive enhancement",
                "memory training", "reaction time", "speed training", "brain games",
                "cognitive performance", "mental training", "brain health", "cognitive skills",
                "training tools", "brain exercises", "cognitive development", "mental fitness",
                "brain improvement", "cognitive training", "mental agility", "brain power"
            ],
        },
        privacy: {
            title: "Privacy Policy - Data Protection & Privacy | Reflextry",
            description: "Read our privacy policy to understand how Reflextry collects, uses, and protects your data. We use Google AdSense and respect your privacy.",
            keywords: [
                "privacy policy", "data protection", "privacy statement", "data privacy",
                "user privacy", "data security", "privacy rights", "GDPR compliance",
                "cookie policy", "data collection", "personal information", "privacy rights",
                "online privacy", "data protection policy", "privacy notice", "user data",
                "privacy practices", "data handling", "privacy compliance", "information privacy"
            ],
        },
        cookies: {
            title: "Cookies Policy - Cookie Usage & Management | Reflextry",
            description: "Learn about how Reflextry uses cookies, including Google AdSense cookies. Manage your cookie preferences and understand our cookie policy.",
            keywords: [
                "cookies policy", "cookie usage", "cookie management", "cookie consent",
                "browser cookies", "tracking cookies", "cookie settings", "cookie preferences",
                "third party cookies", "cookie information", "cookie disclosure", "cookie notice",
                "web cookies", "cookie policy", "cookie usage policy", "cookie tracking",
                "advertising cookies", "analytics cookies", "essential cookies", "cookie control"
            ],
        },
        terms: {
            title: "Terms and Conditions - User Agreement | Reflextry",
            description: "Read our terms and conditions to understand the rules and guidelines for using Reflextry. User agreement and terms of service.",
            keywords: [
                "terms and conditions", "terms of service", "user agreement", "terms of use",
                "service terms", "user terms", "website terms", "legal terms",
                "terms of agreement", "usage terms", "service agreement", "user conditions",
                "website terms", "terms policy", "legal agreement", "terms document",
                "service conditions", "user policy", "terms statement", "agreement terms"
            ],
        },
        contact: {
            title: "Contact Us - Get in Touch | Reflextry",
            description: "Contact Reflextry for questions, support, or feedback. We're here to help with your brain training and cognitive testing needs.",
            keywords: [
                "contact us", "get in touch", "support contact", "customer service",
                "help center", "contact form", "support email", "customer support",
                "contact information", "support team", "help desk", "contact page",
                "customer care", "support contact", "help contact", "contact support",
                "support center", "contact details", "help support", "customer contact"
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
    });
}

export function getLeaderboardMetadata(): Metadata {
    return generateSEOMetadata({
        title: "Leaderboard - Track Your Personal Bests | Reflextry",
        description: "View your personal best scores across all Reflextry tools. Track your progress in memory games, reaction tests, typing speed, and more.",
        keywords: [
            "leaderboard", "high scores", "personal bests", "score tracking",
            "game scores", "best scores", "performance tracking", "score leaderboard",
            "personal records", "achievement tracking", "score history", "performance records",
            "game leaderboard", "score tracking", "best performance", "achievement scores",
            "personal statistics", "score comparison", "performance metrics", "game statistics"
        ],
        url: `/leaderboard`,
        type: "website",
    });
}

