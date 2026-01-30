import { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';
import { getLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404 - Page Not Found | Reflextry',
    description: 'The page you are looking for could not be found. Return to Reflextry homepage or explore our brain training games.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NotFound() {
  // Get locale from next-intl context
  let locale: string;
  try {
    locale = await getLocale();
  } catch {
    // Fallback to default locale if getLocale fails
    locale = routing.defaultLocale;
  }
  
  // Ensure locale is valid
  if (!routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  
  // Next.js automatically sets 404 status code for not-found.tsx
  // This ensures search engines and audit tools recognize it as a custom 404
  return <NotFoundClient locale={locale} />;
}
