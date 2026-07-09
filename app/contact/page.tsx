import { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('contact');
}

export default function Contact() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
    ]);
    
    // For these static pages, we don't have the config object imported, 
    // but we can generate a basic WebPage schema with the title.
    const webPageSchema = generateWebPageSchema(
        "Contact | Reflextry",
        "Learn more about Reflextry and our brain training tools.",
        "/contact"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ContactClient />
        </>
    );
}
