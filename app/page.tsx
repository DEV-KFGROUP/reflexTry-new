import { Metadata } from "next";
import HomeClient from "./HomeClient";
import { HeroSection } from "./HeroSection";
import { HomeSEOContent } from "./HomeSEOContent";
import { getHomeMetadata } from "@/lib/seo-utils";
import { StructuredData } from "@/components/StructuredData";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebsiteStructuredData, generateFAQPageSchema, generateBreadcrumbStructuredData } from "@/lib/structured-data";

import { GeoStatsSection } from "@/components/GeoStatsSection";

export async function generateMetadata(): Promise<Metadata> {
    return getHomeMetadata();
}

export default function Home() {
    const structuredData = generateWebsiteStructuredData();
    const faqSchema = generateFAQPageSchema([
        {
            question: "Does brain training actually work?",
            answer: "Yes, regular engagement in cognitive tasks leverages neuroplasticity—the brain's ability to reorganize itself by forming new neural connections. Consistent practice with tools like our Sequence Memory or Reaction Time tests can lead to measurable improvements in those specific skills over time."
        },
        {
            question: "How often should I use these cognitive training games?",
            answer: "For optimal results, we suggest practicing for 10-15 minutes daily. Consistency is key in neuroplasticity. Use the Memory arena to improve retention, and the Speed arena to enhance quick decision-making."
        },
        {
            question: "Are these tools useful for esports and competitive gamers?",
            answer: "Yes. Professional gamers frequently use our Aim Trainer, Grid Click, and Flick Shot tools to warm up their physical mechanics, hand-eye coordination, and peripheral vision before competitive matches."
        }
    ]);

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
            {/* Server-rendered global benchmarks section */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <GeoStatsSection />
            </div>
            {/* Server-rendered educational content - always in HTML for crawlers */}
            <HomeSEOContent />
        </>
    );
}
