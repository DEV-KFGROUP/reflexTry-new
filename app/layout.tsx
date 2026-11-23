import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDynamic } from "@/components/NavbarDynamic";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { LazyLoadedComponents } from "@/components/LazyLoadedComponents";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookieBanner } from "@/components/CookieBanner";
import { StructuredData, generateOrganizationSchema } from "@/components/StructuredData";
import { ToolKeyboardNavigation } from "@/components/ToolKeyboardNavigation";

export const viewport: Viewport = {
  themeColor: "#faf9f6",
};

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "monospace"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { getBaseUrlObject } = await import('@/lib/base-url');

  return {
    // Use canonical www version
    metadataBase: getBaseUrlObject(),
    title: {
      default: "Brain Training Games & Reaction Time Test | Reflextry",
      template: "%s | Reflextry"
    },
    description: "Train cognitive skills with free brain training games. Test reaction time (ms), working memory, CPS click speed, typing WPM, and FPS aim precision online.",
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
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Reflextry",
      title: "Brain Training Games & Reaction Time Test | Reflextry",
      description: "Free online brain training games, millisecond reaction time tests, working memory benchmarks, typing speed WPM, and FPS aim trainers.",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Reflextry — Free brain training games and cognitive benchmarks",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Brain Training Games & Reaction Time Test | Reflextry",
      description: "Free online brain training games, reaction time tests, working memory benchmarks, typing WPM, and FPS aim trainers.",
      images: ["/opengraph-image"],
      creator: "@reflextry",
    },
    alternates: {
      // Canonical URLs are handled by individual pages via generateSEOMetadata
    },
  };
}

import { headers } from "next/headers";
import { I18nProvider } from "@/lib/i18n/context";
import { DEFAULT_LOCALE, isSupportedLocale, type Locale } from "@/lib/i18n/config";
import { loadLocaleDictionary } from "@/lib/i18n/load-dictionary";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const rawLocale = headerList.get("x-locale");
  const locale: Locale = rawLocale && isSupportedLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const initialDict = locale !== DEFAULT_LOCALE ? await loadLocaleDictionary(locale) : undefined;
  const organizationSchema = generateOrganizationSchema();

  return (
    <html
      lang={locale}
      className={`light ${fraunces.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <StructuredData type="Organization" data={organizationSchema} />

        {/* AdSense Publisher Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-3064655546051154" />

        {/* Critical Root CSS Variables - Inline for zero FOUC/CLS */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: 45 25% 97%;
                --foreground: 40 7% 9%;
                --card: 0 0% 100%;
                --card-foreground: 40 7% 9%;
                --popover: 0 0% 100%;
                --popover-foreground: 40 7% 9%;
                --primary: 40 7% 9%;
                --primary-foreground: 45 25% 97%;
                --secondary: 40 16% 94%;
                --secondary-foreground: 40 7% 9%;
                --muted: 40 16% 94%;
                --muted-foreground: 36 6% 36%;
                --accent: 40 16% 92%;
                --accent-foreground: 40 7% 9%;
                --border: 38 15% 88%;
                --input: 38 15% 88%;
                --ring: 221 63% 40%;
                --radius: 0.75rem;
                --reflex: 221 39% 34%;
                --speed: 215 25% 27%;
                --accuracy: 199 18% 40%;
                --memory: 215 18% 42%;
                --wisdom: 220 9% 46%;
                --info: 221 63% 40%;
              }
              html {
                color-scheme: light;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
              }
              body {
                margin: 0;
                padding: 0;
                background-color: #FAF9F6;
                color: #161614;
                font-family: var(--font-plus-jakarta, system-ui, -apple-system, sans-serif);
                line-height: 1.55;
              }
            `,
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-[#FAF9F6] text-[#161614] flex flex-col min-h-screen"
      >
        <ThemeProvider>
          <I18nProvider initialLocale={locale} initialDict={initialDict}>
            <ErrorBoundary>
              <NavbarDynamic />
              <main className="flex-1 pt-[68px]">
                <ToolKeyboardNavigation>{children}</ToolKeyboardNavigation>
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
