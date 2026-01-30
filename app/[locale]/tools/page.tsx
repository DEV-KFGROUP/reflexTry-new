import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import AllToolsClient from "./AllToolsClient";
import { generateSEOMetadata } from "@/components/SEO";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('AllTools');
    
    return generateSEOMetadata({
        title: t('title'),
        description: t('description'),
        keywords: [
            "all tools", "brain training games", "memory games", "reflex tests",
            "speed tests", "accuracy tests", "gaming tools", "cognitive training",
            "reaction time test", "typing speed test", "click speed test"
        ],
        url: "/tools",
        locale,
        type: "website",
    });
}

export default async function AllToolsPage({ params }: { params: Promise<{ locale: string }> }) {
    return <AllToolsClient />;
}







