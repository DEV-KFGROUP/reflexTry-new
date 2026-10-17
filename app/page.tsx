import { Metadata } from "next";
import { headers } from "next/headers";
import HomeClient from "./HomeClient";
import { HeroSection } from "./HeroSection";
import { HomeSEOContent } from "./HomeSEOContent";
import { getHomeMetadata } from "@/lib/seo-utils";
import { StructuredData } from "@/components/StructuredData";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebsiteStructuredData, generateFAQPageSchema, generateBreadcrumbStructuredData } from "@/lib/structured-data";

import { HOME_FAQS } from "@/lib/site-faqs";

export async function generateMetadata(): Promise<Metadata> {
    const headerList = await headers();
    const locale = headerList.get("x-locale") || "en";
    return getHomeMetadata(locale);
}

export default function Home() {
    const structuredData = generateWebsiteStructuredData();
    const faqSchema = generateFAQPageSchema(HOME_FAQS);

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" }
    ]);

    return (
        <>
            <StructuredData type="WebSite" data={structuredData} />
            <SchemaInjector schemas={[faqSchema, breadcrumbSchema]} />
            {/* Server-rendered hero section for immediate LCP */}
            <HeroSection />
            {/* Client component for interactive tools grid */}
            <HomeClient />
            {/* Server-rendered educational content - always in HTML for crawlers */}
            <HomeSEOContent />
        </>
    );
}
