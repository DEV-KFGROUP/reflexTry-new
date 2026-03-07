import { Metadata } from 'next';
import PrivacyPolicyClient from './PrivacyPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('privacy');
}

export default function PrivacyPolicy() {
    return <PrivacyPolicyClient />;
}
