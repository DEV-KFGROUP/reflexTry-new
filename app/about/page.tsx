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
        { name: "About", url: "/about" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "About",
        "Learn more about Reflextry and our brain training tools.",
        "/about"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <AboutClient />
        </>
    );
}

