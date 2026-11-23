import { Metadata } from 'next';
import { headers } from 'next/headers';
import TrainingProgramsClient from './TrainingProgramsClient';
import { getCategoryMetadata } from '@/lib/seo-utils';
import { SchemaInjector } from '@/components/SchemaInjector';
import { generateBreadcrumbStructuredData, generateWebPageSchema } from '@/lib/structured-data';

export async function generateMetadata(): Promise<Metadata> {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';
    return getCategoryMetadata('training-programs', locale);
}

export default async function TrainingPrograms() {
    const h = await headers();
    const locale = h.get('x-locale') || 'en';

    const breadcrumbSchema = generateBreadcrumbStructuredData([
        { name: 'Home', url: '/' },
        { name: 'Training Programs', url: '/training-programs' },
    ], locale);

    const webPageSchema = generateWebPageSchema(
        'Daily Brain Training Programs & Routines',
        'Follow structured 10-15 minute daily cognitive routines designed to sharpen focus, memory retention, processing speed, and reflexes.',
        '/training-programs',
        locale
    );

    return (
        <>
            <SchemaInjector schemas={[breadcrumbSchema, webPageSchema]} />
            <TrainingProgramsClient />
        </>
    );
}
