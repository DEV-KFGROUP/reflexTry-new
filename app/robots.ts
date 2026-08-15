import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/base-url';

const BASE_URL = getBaseUrl();

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                // Allow all pages and static assets
                allow: '/',
                disallow: [
                    '/api/',      // API endpoints (private)
                    '/admin/',    // Admin routes (if any)
                ],
            },
            {
                // AI / LLM crawlers — explicit allow for maximum discoverability
                userAgent: [
                    'GPTBot',
                    'ChatGPT-User',
                    'Google-Extended',
                    'PerplexityBot',
                    'anthropic-ai',
                    'ClaudeBot',
                    'Cohere-AI',
                    'Applebot-Extended',
                    'YouBot',
                    'CCBot',
                ],
                allow: [
                    '/',
                    '/llms.txt',
                    '/llms-full.txt',
                    '/ai.txt',
                    '/.well-known/ai-plugin.json',
                ],
                disallow: ['/api/'],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}

