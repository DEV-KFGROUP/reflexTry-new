import { Metadata } from 'next';
import AccuracyPageClient from './AccuracyPageClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getCategoryMetadata('accuracy', locale);
}

export default function AccuracyPage() {
    return <AccuracyPageClient />;
}
