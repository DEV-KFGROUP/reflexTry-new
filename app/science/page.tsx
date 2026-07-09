import { Metadata } from 'next';
import ScienceClient from './ScienceClient';
import { getBaseUrl } from '@/lib/base-url';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const baseUrl = getBaseUrl();

    return {
        title: 'The Science of Brain Training | Neuroplasticity, Research & Cognitive Enhancement - Reflextry',
        description: 'Explore the neuroscience behind brain training. Learn about neuroplasticity, cognitive reserve, research evidence, and how brain training improves memory, reaction time, and cognitive performance.',
        keywords: ['brain training science', 'neuroplasticity', 'cognitive neuroscience', 'brain research', 'cognitive reserve', 'memory science', 'brain plasticity'],
        alternates: {
            canonical: `${baseUrl}/science`,
        },
        openGraph: {
            title: 'The Science of Brain Training | Reflextry',
            description: 'Discover the neuroscience behind cognitive training and how your brain adapts and improves.',
            url: `${baseUrl}/science`,
            type: 'website',
        },
    };
}

export default function Science() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Science", url: "/science" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "Science | Reflextry",
        "Learn more about Reflextry and our brain training tools.",
        "/science"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ScienceClient />
        </>
    );
}
