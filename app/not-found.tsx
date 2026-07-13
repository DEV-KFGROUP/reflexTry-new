import { Metadata } from 'next';
import NotFoundClient from './NotFoundClient';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '404 - Page Not Found',
    description: 'The page you are looking for could not be found. Return to Reflextry homepage or explore our brain training games.',
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function NotFound() {
  // Next.js automatically sets 404 status code for not-found.tsx
  // This ensures search engines and audit tools recognize it as a custom 404
  return <NotFoundClient locale="en" />;
}
