import { Metadata } from 'next';
import CookiesPolicyClient from './CookiesPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('cookies');
}

export default function CookiesPolicy() {
    return <CookiesPolicyClient />;
}
