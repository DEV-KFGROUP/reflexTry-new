import { Metadata } from 'next';
import ContactClient from './ContactClient';
import { getLegalPageMetadata } from '@/lib/legal-seo';

export async function generateMetadata(): Promise<Metadata> {
    return getLegalPageMetadata('contact');
}

export default function Contact() {
    return <ContactClient />;
}
