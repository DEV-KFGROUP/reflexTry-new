import createNextIntlPlugin from 'next-intl/plugin';
// Rebuild trigger 1769746000

const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts'
);

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

  // Target modern browsers only - removes unnecessary polyfills
  // This reduces bundle size by ~14 KiB
  compiler: {
    // Remove legacy JavaScript polyfills for modern browsers
    // Modern browsers support ES2022 features natively
  },

  // Optimize CSS loading - Next.js automatically inlines critical CSS
  // The globals.css is automatically optimized and non-critical CSS is deferred
  // Critical CSS is already inlined in layout.tsx <head> section

  // Optimize JavaScript bundles - Aggressive code splitting
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Split chunks for better caching and reduced initial bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 20, // Limit initial chunk requests
          minSize: 20000, // Only split chunks larger than 20KB
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk for third-party libraries
            vendor: {
              name: 'vendor',
              chunks: 'all',
              test: /node_modules/,
              priority: 20,
              minChunks: 1,
            },
            // Common chunk for shared code (used in 2+ places)
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate chunk for framer-motion (large library)
            framerMotion: {
              name: 'framer-motion',
              test: /[\\/]node_modules[\\/](framer-motion)[\\/]/,
              chunks: 'async', // Only load when needed (lazy)
              priority: 30,
            },
            // Separate chunk for next-intl (internationalization)
            nextIntl: {
              name: 'next-intl',
              test: /[\\/]node_modules[\\/](next-intl)[\\/]/,
              chunks: 'all',
              priority: 25,
            },
          },
        },
      };
    }
    return config;
  },

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
        ],
      },
      {
        // Long cache for static assets (images, fonts, icons) - 1 year immutable
        source: '/:path*.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JavaScript chunks - 1 year immutable (Next.js adds content hash)
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache CSS files - 1 year immutable
        source: '/_next/static/:path*.css',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache manifest and robots.txt - 1 day (can change)
        source: '/:path*(manifest.json|robots.txt|sitemap.xml|ads.txt)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, must-revalidate',
          },
        ],
      },
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

export default withNextIntl(nextConfig);
