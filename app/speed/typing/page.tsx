import { Metadata } from 'next';
import TypingGame from './TypingGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('typing-speed', '/speed/typing');
}

export default function Page() {
    const config = SEO_CONFIGS['typing-speed'];
    const structuredData = generateToolStructuredData(
        'typing-speed',
        config.title,
        config.description,
        `/speed/typing`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Speed Tools", url: "/speed" },
        { name: config.title, url: `/speed/typing` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/speed/typing`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <TypingGame />
        </>
    );
}
