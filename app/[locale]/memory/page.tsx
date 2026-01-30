import { Metadata } from 'next';
import MemoryHubClient from './MemoryHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getCategoryMetadata('memory', locale);
}

export default function MemoryHub() {
    return <MemoryHubClient />;
}
