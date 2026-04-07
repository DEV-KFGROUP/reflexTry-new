import type { Metadata } from "next";
import { Outfit } from "next/font/google";
// CSS is automatically optimized by Next.js - critical CSS is inlined above
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AdSense } from "@/components/AdSense";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LazyLoadedComponents } from "@/components/LazyLoadedComponents";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap", // Use system font immediately, swap when font loads (prevents render blocking)
  preload: true, // Preload font for LCP - critical for hero text rendering
  adjustFontFallback: true, // Use system font fallback for faster rendering
  fallback: ['system-ui', '-apple-system', 'sans-serif'], // Immediate fallback
});

export async function generateMetadata(): Promise<Metadata> {
  const { getBaseUrlObject } = await import('@/lib/base-url');

  return {
    // Use canonical www version
    metadataBase: getBaseUrlObject(),
    title: {
      default: "Reflextry - Test Your Accuracy & Reflexes | Free Brain Training Games",
      template: "%s | Reflextry"
    },
    description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games, reaction time tests, typing speed tests, memory games, and more.",
    keywords: ["reaction time test", "typing speed test", "brain training games", "memory games", "accuracy test", "reflex test"],
    authors: [{ name: "Reflextry" }],
    creator: "Reflextry",
    publisher: "Reflextry",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [
        { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      type: "website",
      locale: "en",
      siteName: "Reflextry",
      title: "Reflextry - Test Your Accuracy & Reflexes",
      description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games.",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Reflextry — Free brain training games",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Reflextry - Test Your Accuracy & Reflexes",
      description: "Test your accuracy and reflexes with our Gen Z tools.",
      images: ["/opengraph-image"],
    },
    alternates: {
      // Canonical URLs are handled by individual pages via generateSEOMetadata
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Critical CSS - Inline for faster initial render */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical above-the-fold styles */
              :root {
                --background: #020617;
                --foreground: #f8fafc;
                --reflex: #8b5cf6;
                --speed: #06b6d4;
                --accuracy: #10b981;
                --memory: #ec4899;
                --wisdom: #f59e0b;
                --info: #3b82f6;
                --muted: #1e293b;
                --muted-foreground: #94a3b8;
                --border: #1e293b;
                --card: #0f172a;
                --card-foreground: #f8fafc;
              }
              * {
                box-sizing: border-box;
              }
              html {
                color-scheme: dark;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              body {
                background: var(--background);
                color: var(--foreground);
                margin: 0;
                padding: 0;
                font-family: var(--font-outfit, system-ui, -apple-system, sans-serif);
                line-height: 1.5;
              }
              /* Critical layout styles */
              .flex {
                display: flex;
              }
              .flex-col {
                flex-direction: column;
              }
              .min-h-screen {
                min-height: 100vh;
              }
              .pt-20 {
                padding-top: 5rem;
              }
              /* Prevent layout shift */
              main {
                display: block;
              }
              /* Critical Navbar styles */
              nav {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
              }
              /* Critical positioning utilities */
              .fixed {
                position: fixed;
              }
              .top-0 {
                top: 0;
              }
              .left-0 {
                left: 0;
              }
              .right-0 {
                right: 0;
              }
              .z-50 {
                z-index: 50;
              }
              /* Critical spacing utilities */
              .mx-auto {
                margin-left: auto;
                margin-right: auto;
              }
              .px-4 {
                padding-left: 1rem;
                padding-right: 1rem;
              }
              .py-12 {
                padding-top: 3rem;
                padding-bottom: 3rem;
              }
              .gap-2 {
                gap: 0.5rem;
              }
              .gap-3 {
                gap: 0.75rem;
              }
              .gap-4 {
                gap: 1rem;
              }
              .gap-8 {
                gap: 2rem;
              }
              /* Critical sizing utilities */
              .w-full {
                width: 100%;
              }
              .h-20 {
                height: 5rem;
              }
              .max-w-7xl {
                max-width: 80rem;
              }
              .max-w-2xl {
                max-width: 42rem;
              }
              /* Critical typography */
              .text-2xl {
                font-size: 1.5rem;
                line-height: 2rem;
              }
              .text-xl {
                font-size: 1.25rem;
                line-height: 1.75rem;
              }
              .text-5xl {
                font-size: 3rem;
                line-height: 1;
              }
              .font-bold {
                font-weight: 700;
              }
              /* Critical alignment */
              .items-center {
                align-items: center;
              }
              .justify-between {
                justify-content: space-between;
              }
              .justify-center {
                justify-content: center;
              }
              .text-center {
                text-align: center;
              }
              /* Critical background and borders */
              .bg-background {
                background-color: var(--background);
              }
              .border-b {
                border-bottom-width: 1px;
              }
              .border-theme {
                border-color: var(--border);
              }
              /* Critical gradient text */
              .bg-gradient-to-r {
                background-image: linear-gradient(to right, var(--tw-gradient-stops));
              }
              .bg-clip-text {
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
              }
              .text-transparent {
                color: transparent;
              }
              /* Ensure gradient text is visible */
              .bg-clip-text.text-transparent {
                background-size: 100%;
                background-repeat: no-repeat;
              }
              /* Critical hero section styles for LCP */
              .text-5xl {
                font-size: 3rem;
                line-height: 1;
              }
              .text-7xl {
                font-size: 4.5rem;
                line-height: 1;
              }
              .font-bold {
                font-weight: 700;
              }
              .tracking-tight {
                letter-spacing: -0.025em;
              }
              .text-center {
                text-align: center;
              }
              .max-w-4xl {
                max-width: 56rem;
              }
              .mx-auto {
                margin-left: auto;
                margin-right: auto;
              }
              .space-y-8 {
                display: flex;
                flex-direction: column;
              }
              .space-y-8 > * + * {
                margin-top: 2rem;
              }
              /* Critical LCP element styles - Hero subtitle */
              .text-xl {
                font-size: 1.25rem;
                line-height: 1.75rem;
              }
              .text-theme-secondary {
                color: #94a3b8;
              }
              .max-w-2xl {
                max-width: 42rem;
              }
              .mt-12 {
                margin-top: 3rem;
              }
              .mb-20 {
                margin-bottom: 5rem;
              }
              /* Critical hero badge styles */
              .px-4 {
                padding-left: 1rem;
                padding-right: 1rem;
              }
              .py-1\\.5 {
                padding-top: 0.375rem;
                padding-bottom: 0.375rem;
              }
              .rounded-full {
                border-radius: 9999px;
              }
              .border {
                border-width: 1px;
              }
              .text-sm {
                font-size: 0.875rem;
                line-height: 1.25rem;
              }
              .font-medium {
                font-weight: 500;
              }
              .inline-block {
                display: inline-block;
              }
              .block {
                display: block;
              }
              .mb-2 {
                margin-bottom: 0.5rem;
              }
              .text-white {
                color: #ffffff;
              }
              .items-center {
                align-items: center;
              }
              .justify-center {
                justify-content: center;
              }
              .min-h-\\[calc\\(100vh-80px\\)\\] {
                min-height: calc(100vh - 80px);
              }
              /* Critical responsive utilities */
              @media (min-width: 640px) {
                .sm\\:px-6 {
                  padding-left: 1.5rem;
                  padding-right: 1.5rem;
                }
                .sm\\:flex-row {
                  flex-direction: row;
                }
                .sm\\:w-auto {
                  width: auto;
                }
                .sm\\:text-7xl {
                  font-size: 4.5rem;
                  line-height: 1;
                }
              }
              @media (min-width: 1024px) {
                .lg\\:px-8 {
                  padding-left: 2rem;
                  padding-right: 2rem;
                }
              }
            `,
          }}
        />


        {/* Non-critical scripts - Loaded asynchronously after page is interactive */}
        {/* These are client components that load scripts lazily */}
        <GoogleAnalytics />
        <AdSense pId="ca-pub-3064655546051154" />

        {/* Essential favicons only - Reduce requests */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#00f0ff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Always apply dark theme
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <ErrorBoundary>
            <Navbar />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
            <LazyLoadedComponents />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
