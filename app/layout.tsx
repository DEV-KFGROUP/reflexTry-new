import type { Metadata, Viewport } from "next";
import { Fraunces, Plus_Jakarta_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { NavbarDynamic } from "@/components/NavbarDynamic";
import { Footer } from "@/components/Footer";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import {
  GA_GTAG_SRC,
  GA_TRACKING_ID,
  buildGaBootstrapScript,
} from "@/lib/analytics/ga-config";
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
  preload: false,
  fallback: ["Georgia", "Times New Roman", "serif"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
  preload: false,
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

import { I18nProvider } from "@/lib/i18n/context";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale: Locale = DEFAULT_LOCALE;
  const organizationSchema = generateOrganizationSchema();

  return (
    <html
      lang={locale}
      className={`light ${fraunces.variable} ${plusJakartaSans.variable} ${ibmPlexMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Google tag (gtag.js) - Non-blocking async GA4 with Consent Mode v2 & AI Referral Attribution */}
        <script async src={GA_GTAG_SRC} />
        <script
          id="google-analytics"
          dangerouslySetInnerHTML={{
            __html: buildGaBootstrapScript(GA_TRACKING_ID),
          }}
        />

        <StructuredData type="Organization" data={organizationSchema} />

        {/* AdSense Publisher Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-3064655546051154" />

        {/* Critical Above-the-Fold CSS - Inlined for zero render-blocking FOUC/CLS */}
        <style
          id="critical-above-the-fold-css"
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
              *, ::before, ::after {
                box-sizing: border-box;
              }
              html {
                color-scheme: light;
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-size-adjust: 100%;
              }
              body {
                margin: 0;
                padding: 0;
                min-height: 100vh;
                display: flex;
                flex-direction: column;
                background-color: #FAF9F6;
                color: #161614;
                font-family: var(--font-plus-jakarta, system-ui, -apple-system, sans-serif);
                line-height: 1.55;
              }
              header {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 50;
                background-color: rgba(250, 249, 246, 0.95);
                border-bottom: 1px solid #E6E3DB;
              }
              main {
                flex: 1 1 0%;
                padding-top: 68px;
              }
              h1, h2, h3, .font-serif {
                font-family: var(--font-fraunces, Georgia, "Times New Roman", serif);
              }
              .font-mono {
                font-family: var(--font-ibm-plex-mono, ui-monospace, SFMono-Regular, monospace);
              }
              .cv-auto {
                content-visibility: auto;
                contain-intrinsic-size: auto 520px;
              }
            `,
          }}
        />
      </head>
      <body
        className="font-sans antialiased bg-[#FAF9F6] text-[#161614] flex flex-col min-h-screen"
      >
        <ThemeProvider>
          <I18nProvider initialLocale={locale}>
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
