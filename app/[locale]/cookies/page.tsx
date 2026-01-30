import { Metadata } from 'next';
import CookiesPolicyClient from './CookiesPolicyClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLegalPageMetadata('cookies', locale);
}

export default function CookiesPolicy() {
    return <CookiesPolicyClient />;
}
