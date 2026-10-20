// Rebuild trigger 1769746000

/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  /* config options here */

  // Image optimization configuration - Modern formats prioritized
  images: {
    formats: ['image/avif', 'image/webp'], // AVIF first (best compression), then WebP
    deviceSizes: [40, 80, 160, 320, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache for optimized images
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Enable remote patterns if needed for external images
    remotePatterns: [],
    // Optimize static images in public folder
    unoptimized: false, // Keep optimization enabled
  },

  // CDN Configuration - Serve all static assets from CDN
  // Vercel automatically provides CDN, but we can optimize further
  // For production, use CDN URL from environment variable
  assetPrefix: process.env.NEXT_PUBLIC_CDN_URL || '',
  // Base path if needed (usually empty for root domain)
  basePath: '',

  compiler: {
    // Remove legacy JavaScript polyfills for modern browsers
    // Modern browsers support ES2022 features natively
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },

  // Optimize CSS loading - Next.js automatically inlines critical CSS
  // The globals.css is automatically optimized and non-critical CSS is deferred
  // Critical CSS is already inlined in layout.tsx <head> section



  // Canonicalization: Redirect non-www to www
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'reflextry.com',
          },
        ],
        destination: 'https://www.reflextry.com/:path*',
        permanent: true,
      },
    ];
  },

  // CDN and Security Headers
  async headers() {
    const isProd = process.env.NODE_ENV === 'production';

    return [
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      // Long-lived caching for hashed assets — production only. In dev, immutable
      // Cache-Control on /_next/static breaks Turbopack HMR (stale chunks → "module factory is not available").
      ...(isProd
        ? [
            {
              source: '/:path*.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|avif)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/_next/static/:path*',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/_next/static/:path*.css',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
                },
              ],
            },
            {
              source: '/:path*(manifest.json|robots.txt|sitemap.xml|ads.txt|llms.txt|llms-full.txt|ai.txt)',
              headers: [
                {
                  key: 'Cache-Control',
                  value: 'public, max-age=86400, must-revalidate',
                },
              ],
            },
          ]
        : []),
      {
        // Short cache for API routes - 5 minutes
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
