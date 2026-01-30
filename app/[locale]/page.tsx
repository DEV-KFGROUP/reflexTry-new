import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HeroSection } from "./HeroSection";
import { getHomeMetadata } from "@/lib/seo-utils";
import { StructuredData } from "@/components/StructuredData";
import { generateWebsiteStructuredData } from "@/lib/structured-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getHomeMetadata(locale);
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const structuredData = generateWebsiteStructuredData();

    return (
        <>
            <StructuredData type="WebSite" data={structuredData} />
            {/* Server-rendered hero section for immediate LCP */}
            <HeroSection locale={locale} />
            {/* Client component for interactive tools grid */}
            <HomeClient />
        </>
    );
}
