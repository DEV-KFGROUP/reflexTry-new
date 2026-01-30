import { Metadata } from 'next';
import ReflexHubClient from './ReflexHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getCategoryMetadata('reflex', locale);
}

export default function ReflexHub() {
    return <ReflexHubClient />;
}
