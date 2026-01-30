import { Metadata } from 'next';
import SpeedHubClient from './SpeedHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getCategoryMetadata('speed', locale);
}

export default function SpeedHub() {
    return <SpeedHubClient />;
}
