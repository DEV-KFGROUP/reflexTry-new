import { Metadata } from 'next';
import ScienceClient from './ScienceClient';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('science');
}

export default function Science() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Science", url: "/science" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "The Science of Brain Training | Neuroplasticity & Cognitive Research",
        "Explore the neuroscience behind brain training, neuroplasticity, and cognitive enhancement.",
        "/science"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ScienceClient />
        </>
    );
}
