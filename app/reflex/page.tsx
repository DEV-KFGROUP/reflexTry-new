import { Metadata } from 'next';
import ReflexHubClient from './ReflexHubClient';
import { getCategoryMetadata } from '@/lib/seo-utils';

export async function generateMetadata(): Promise<Metadata> {
    return getCategoryMetadata('reflex');
}

export default function ReflexHub() {
    return <ReflexHubClient />;
}
