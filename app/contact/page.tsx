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
        { name: "Contact Us", url: "/contact" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Contact Us - Get in Touch | Reflextry",
        "Contact Reflextry for questions, support, or feedback. We're here to help with your brain training and cognitive testing needs.",
        "/contact"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ContactClient />
        </>
    );
}
