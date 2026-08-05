import { Metadata } from "next";
import AllToolsClient from "./AllToolsClient";
import { getCategoryMetadata } from "@/lib/seo-utils";
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateWebPageSchema, generateBreadcrumbStructuredData, generateFAQPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('tools');
}

export default function AllToolsPage() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "All Tools", url: "/tools" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "All Brain Training Tools & Games",
        "Explore our complete collection of reaction, memory, speed, and accuracy tools.",
        "/tools"
    );

    const faqSchema = generateFAQPageSchema([
        {
            question: "What are the best tools for improving reaction time?",
            answer: "For improving reaction time, we recommend starting with the classic Reaction Time test in our Reflex Arena, followed by the Sequence Reaction and Multi Stimulus tools. These train both your physical response speed and cognitive processing speed."
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

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema, faqSchema]} />
            <AllToolsClient />
        </>
    );
}







