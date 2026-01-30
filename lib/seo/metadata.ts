import { Metadata } from 'next';

interface SEOProps {
    title: string;
    description: string;
    path: string;
    image?: string;
    type?: 'website' | 'article';
}

export function constructMetadata({
    title,
    description,
    path,
    image = '/og-image.jpg',
    type = 'website',
}: SEOProps): Metadata {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://reflextry.com';
    const url = `${siteUrl}${path}`;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            url,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
            type,
            siteName: 'ReflexTry',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
            creator: '@reflextry',
        },
        alternates: {
            canonical: url,
        },
        metadataBase: new URL(siteUrl),
    };
}
