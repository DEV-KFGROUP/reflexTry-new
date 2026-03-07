import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HeroSection } from "./HeroSection";
import { getHomeMetadata } from "@/lib/seo-utils";
import { StructuredData } from "@/components/StructuredData";
import { generateWebsiteStructuredData } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getHomeMetadata();
}

export default function Home() {
    const structuredData = generateWebsiteStructuredData();

    return (
        <>
            <StructuredData type="WebSite" data={structuredData} />
            {/* Server-rendered hero section for immediate LCP */}
            <HeroSection />
            {/* Client component for interactive tools grid */}
            <HomeClient />
        </>
    );
}
