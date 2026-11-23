import { Metadata } from 'next';
import { headers } from 'next/headers';
import ContactClient from './ContactClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';
    return getLegalPageMetadata('contact', locale);
}

export default async function Contact() {
    const headersList = await headers();
    const locale = headersList.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Contact Us", url: "/contact" },
    ], locale);
    
    const webPageSchema = generateWebPageSchema(
        "Contact Us - Get in Touch | Reflextry",
        "Contact Reflextry for questions, support, or feedback. We're here to help with your brain training and cognitive testing needs.",
        "/contact",
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <ContactClient />
        </>
    );
}
