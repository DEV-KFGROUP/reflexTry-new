import { Metadata } from 'next';
import SpeedHubClient from './SpeedHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('speed');
}

export default function SpeedHub() {
    return <SpeedHubClient />;
}
