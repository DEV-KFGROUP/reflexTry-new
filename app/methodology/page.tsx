import { Metadata } from 'next';
import { headers } from 'next/headers';
import MethodologyClient from './MethodologyClient';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { generateSEOMetadata } from '@/components/SEO';

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';
    return generateSEOMetadata({
        title: "Testing Methodology & Scoring Standards | Reflextry",
        description: "Explore Reflextry's testing methodology: how we measure millisecond reaction times, WPM typing formulas, CPS click rates, memory spans, and hardware latency.",
        url: "/methodology",
        locale,
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

export default async function MethodologyPage() {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Testing Methodology", url: "/methodology" },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        "Reflextry Testing Methodology & Scoring Standards",
        "Technical documentation and standards for measuring millisecond reaction time, typing speed, and cognitive accuracy.",
        "/methodology",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <MethodologyClient />
        </>
    );
}
