import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('about');
}

export default function About() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "About Us", url: "/about" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "About Us - Our Mission & Team | Reflextry",
        "Learn about Reflextry's mission to improve cognitive performance. Discover our evidence-based approach to memory, reaction time, and speed training.",
        "/about"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <AboutClient />
        </>
    );
}

