import { Metadata } from 'next';
import AimTrainerClient from './AimTrainerClient';
import { getToolMetadata } from '@/lib/seo-utils';
import { StructuredData } from '@/components/StructuredData';
import { generateToolStructuredData } from '@/lib/structured-data';
import { SEO_CONFIGS } from '@/config/seo-config';

export async function generateMetadata(): Promise<Metadata> {
    return getToolMetadata('aim-trainer', '/gaming/aim');
}

export default function Page() {
    const config = SEO_CONFIGS['aim-trainer'];
    const structuredData = generateToolStructuredData(
        'aim-trainer',
        config.title,
        config.description,
        `/gaming/aim`
    );

    return (
        <>
            <StructuredData type="WebApplication" data={structuredData} />
            <AimTrainerClient />
        </>
    );
}
