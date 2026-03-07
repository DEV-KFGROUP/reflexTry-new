import { Metadata } from 'next';
import PeripheralGame from './PeripheralGame';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('peripheral-vision', '/reflex/peripheral');
}

export default function Page() {
    const config = SEO_CONFIGS['peripheral-vision'];
    const structuredData = generateToolStructuredData(
        'peripheral-vision',
        config.title,
        config.description,
        `/reflex/peripheral`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <PeripheralGame />
        </>
    );
}
