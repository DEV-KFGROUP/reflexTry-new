import { Metadata } from 'next';
import AboutClient from './AboutClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLegalPageMetadata('about', locale);
}

export default function About() {
    return <AboutClient />;
}

