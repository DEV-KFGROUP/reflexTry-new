import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('about');
}

export default function About() {
    return <AboutClient />;
}

