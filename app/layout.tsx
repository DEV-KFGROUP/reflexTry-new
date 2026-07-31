import type { Metadata } from "next";
import { Outfit } from "next/font/google";
// CSS is automatically optimized by Next.js - critical CSS is inlined above
import "./globals.css";
import { NavbarDynamic } from "@/components/NavbarDynamic";
import { Footer } from "@/components/Footer";
import { AdSense } from "@/components/AdSense";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LazyLoadedComponents } from "@/components/LazyLoadedComponents";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { StructuredData, generateOrganizationSchema } from "@/components/StructuredData";
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
      default: "Brain Training & Reflex Games | Reflextry",
      template: "%s | Reflextry"
    },
    description: "Test your accuracy and reflexes with our Gen Z tools. Free online brain training games, reaction time tests, typing speed tests, memory games, and more.",
    keywords: ["reaction time test", "typing speed test", "brain training games", "memory games", "accuracy test", "reflex test", "human benchmark", "reaction test", "aim trainer", "human benchmark reaction time", "test for reaction", "reaction speed test", "memory test"],
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

  const organizationSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <StructuredData type="Organization" data={organizationSchema} />
        {/* Critical CSS - Inline for faster initial render */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              /* Critical above-the-fold styles */
              :root {
                --background: #f8fafc;
                --foreground: #0f172a;
                --reflex: #64748b;
                --speed: #475569;
                --accuracy: #334155;
                --memory: #94a3b8;
                --wisdom: #52525b;
                --info: #2563eb;
                --muted: #e2e8f0;
                --muted-foreground: #64748b;
                --border: #dbe2ea;
                --card: #ffffff;
                --card-foreground: #0f172a;
              }
              * {
                box-sizing: border-box;
              }
              html {
                color-scheme: light;
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
              }
              .text-transparent {
                color: transparent;
              }
              /* Gradient text: only hide glyph fill when both utilities are used (avoids inheriting transparent fill into unrelated descendants) */
              .bg-clip-text.text-transparent {
                -webkit-text-fill-color: transparent;
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
                color: #64748b;
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
              .text-black {
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
        <meta name="theme-color" content="#f8fafc" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <ErrorBoundary>
            <NavbarDynamic />
            <main className="flex-1 pt-20">
              {children}
            </main>
            <Footer />
            <LazyLoadedComponents />
            <CookieBanner />
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
