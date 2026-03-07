import { Metadata } from 'next';
import MemoryHubClient from './MemoryHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('memory');
}

export default function MemoryHub() {
    return <MemoryHubClient />;
}
