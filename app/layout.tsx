import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { NavbarDynamic } from "@/components/NavbarDynamic";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LazyLoadedComponents } from "@/components/LazyLoadedComponents";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { StructuredData, generateOrganizationSchema } from "@/components/StructuredData";

export const viewport: Viewport = {
  themeColor: "#f8fafc",
};

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "optional", // Keep the fallback on slow connections rather than repainting text late.
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
      locale: "en_US",
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

import { I18nProvider } from "@/lib/i18n/context";

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

        {/* AdSense Publisher Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-3064655546051154" />

        {/* Critical Root CSS Variables - Inline for zero FOUC/CLS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: 210 33% 98%;
                --foreground: 222 47% 11%;
                --card: 0 0% 100%;
                --card-foreground: 222 47% 11%;
                --popover: 0 0% 100%;
                --popover-foreground: 222 47% 11%;
                --primary: 222 47% 11%;
                --primary-foreground: 210 40% 98%;
                --secondary: 210 24% 96%;
                --secondary-foreground: 222 47% 11%;
                --muted: 210 24% 96%;
                --muted-foreground: 215 20% 38%;
                --accent: 214 32% 91%;
                --accent-foreground: 222 47% 11%;
                --border: 214 24% 88%;
                --input: 214 24% 88%;
                --ring: 215 20% 65%;
                --radius: 0.75rem;
                --reflex: 221 39% 34%;
                --speed: 215 25% 27%;
                --accuracy: 199 18% 40%;
                --memory: 215 16% 47%;
                --wisdom: 220 9% 46%;
                --info: 217 91% 60%;
              }
              html {
                color-scheme: light;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              body {
                margin: 0;
                padding: 0;
                font-family: var(--font-outfit, system-ui, -apple-system, sans-serif);
                line-height: 1.5;
              }
            `,
          }}
        />
      </head>
      <body
        className={`${outfit.variable} antialiased bg-background text-foreground flex flex-col min-h-screen`}
      >
        <ThemeProvider>
          <I18nProvider>
            <ErrorBoundary>
              <NavbarDynamic />
              <main className="flex-1 pt-20">
                {children}
              </main>
              <Footer />
              <LazyLoadedComponents />
              <CookieBanner />
              <GoogleAnalytics />
            </ErrorBoundary>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
