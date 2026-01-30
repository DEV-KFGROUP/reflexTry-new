import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Reflextry',
  description: 'The page you are looking for could not be found. Return to Reflextry homepage or explore our brain training games.',
  robots: {
    index: false,
    follow: true,
  },
};

// Root-level 404 handler - redirect to locale-specific 404
// With next-intl middleware, all routes should have locale prefix
// So we redirect invalid routes to the default locale's 404 page
export default function RootNotFound() {
  // Redirect to default locale with a known invalid path to trigger locale 404
  // This ensures the middleware processes it and shows our custom 404
  redirect(`/${routing.defaultLocale}/404-not-found`);
}

