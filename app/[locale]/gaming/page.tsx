import { Metadata } from 'next';
import GamingHubClient from './GamingHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getCategoryMetadata('gaming', locale);
}

export default function GamingHub() {
    return <GamingHubClient />;
}
