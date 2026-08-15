import { Metadata } from 'next';
import MethodologyClient from './MethodologyClient';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    return generateSEOMetadata({
        title: "Testing Methodology & Scoring Standards | Reflextry",
        description: "Explore Reflextry's testing methodology. Learn how we calculate millisecond reaction times, WPM typing formulas, CPS click rates, cognitive memory spans, and hardware latency factors.",
        url: "/methodology",
        keywords: [
            "testing methodology",
            "reaction time measurement",
            "WPM formula",
            "CPS formula",
            "human reaction benchmark",
            "millisecond precision",
            "hardware latency",
            "cognitive testing standards"
        ],
    });
}

export default function MethodologyPage() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Testing Methodology", url: "/methodology" },
    ]);

    const webPageSchema = generateWebPageSchema(
        "Reflextry Testing Methodology & Scoring Standards",
        "Technical documentation and standards for measuring millisecond reaction time, typing speed, and cognitive accuracy.",
        "/methodology"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <MethodologyClient />
        </>
    );
}
