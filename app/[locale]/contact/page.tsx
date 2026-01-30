import { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    return getLegalPageMetadata('contact', locale);
}

export default function Contact() {
    return <ContactClient />;
}
