import { Metadata } from 'next';
import GamingHubClient from './GamingHubClient';
import { CategorySEOContent } from '@/components/CategorySEOContent';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('gaming');
}

export default function GamingHub() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Gaming Tools", url: "/gaming" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Pro Gaming Lab - Aim & Reaction Training",
        "Warm up your hands and sharpen your senses with our esports tools. Aim trainer, flick shot, and grid click for competitive gamers.",
        "/gaming"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "Does aim training actually improve my game?",
            answer: "Yes. Aim trainers isolate the physical mechanics of using a mouse, such as tracking and flicking. By separating these from game sense, map awareness, and strategy, you can build raw mechanical muscle memory much faster than just playing the game alone."
        },
        {
            question: "What is the best way to warm up before a ranked match?",
            answer: "A solid pre-game warmup should last 5-10 minutes and involve progressively faster movements. We recommend 2 minutes of Grid Click, 3 minutes of Aim Trainer, and 2 minutes of Flick Shot."
        },
        {
            question: "How does CPS (Clicks Per Second) affect gaming?",
            answer: "A higher CPS rate allows you to attack faster in PvP games like Minecraft, or register actions quicker in MOBAs like League of Legends. Training your CPS builds finger endurance, reducing fatigue during long gaming sessions while maintaining high performance."
        }
    ]);

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <GamingHubClient />
            <CategorySEOContent category="gaming" />
        </>
    );
}
