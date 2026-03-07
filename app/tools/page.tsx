import { Metadata } from "next";
import AllToolsClient from "./AllToolsClient";
import { generateSEOMetadata } from "@/components/SEO";

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "All Brain Training Tools & Games",
        description: "Explore our complete collection of reaction, memory, speed, and accuracy tools.",
        keywords: [
            "all tools", "brain training games", "memory games", "reflex tests",
            "speed tests", "accuracy tests", "gaming tools", "cognitive training",
            "reaction time test", "typing speed test", "click speed test"
        ],
        url: "/tools",
        type: "website",
    });
}

export default function AllToolsPage() {
    return <AllToolsClient />;
}







