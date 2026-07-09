import { Metadata } from 'next';
import ColorSwitchGame from './ColorSwitchGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateToolStructuredData, generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('color-switch', '/reflex/color-switch');
}

export default function Page() {
    const config = SEO_CONFIGS['color-switch'];
    const structuredData = generateToolStructuredData(
        'color-switch',
        config.title,
        config.description,
        `/reflex/color-switch`
    );

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: "Home", url: "/" },
        { name: "Reflex Tools", url: "/reflex" },
        { name: config.title, url: `/reflex/color-switch` },
    ]);
    
    const webPageSchema = generateWebPageSchema(
        config.title,
        config.description,
        `/reflex/color-switch`
    );

    return (
        <>
            <SchemaInjector schemas={[structuredData, breadcrumbSchema, webPageSchema]} />
            <ColorSwitchGame />
        </>
    );
}
