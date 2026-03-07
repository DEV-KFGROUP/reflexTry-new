import { Metadata } from 'next';
import TermsClient from './TermsClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('terms');
}

export default function Terms() {
    return <TermsClient />;
}
