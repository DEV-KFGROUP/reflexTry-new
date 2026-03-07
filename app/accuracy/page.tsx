import { Metadata } from 'next';
import AccuracyPageClient from './AccuracyPageClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('accuracy');
}

export default function AccuracyPage() {
    return <AccuracyPageClient />;
}
