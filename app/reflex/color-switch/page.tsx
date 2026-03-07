import { Metadata } from 'next';
import ColorSwitchGame from './ColorSwitchGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
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

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <ColorSwitchGame />
        </>
    );
}
