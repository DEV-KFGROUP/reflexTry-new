import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';
import { SchemaInjector } from "@/components/SchemaInjector";
import { generateBreadcrumbStructuredData, generateWebPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('privacy');
}

export default function PrivacyPolicy() {
    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Privacy Policy", url: "/privacy" },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        "Privacy Policy - Data Protection & Privacy | Reflextry",
        "Read our privacy policy to understand how Reflextry collects, uses, and protects your data. We use Google AdSense and respect your privacy.",
        "/privacy"
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <PrivacyPolicyClient />
        </>
    );
}
