import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLegalPageMetadata('privacy', locale);
}

export default function PrivacyPolicy() {
    return <PrivacyPolicyClient />;
}
