import { Metadata } from 'next';
import TermsClient from './TermsClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLegalPageMetadata('terms', locale);
}

export default function Terms() {
    return <TermsClient />;
}
