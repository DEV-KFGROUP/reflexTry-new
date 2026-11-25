# Render-Blocking Resources Fix

## Optimizations Applied

### 1. Native CSS Inlining (`experimental.inlineCss: true` & `cssChunking: 'strict'`)
- Enabled `experimental.inlineCss: true` and `experimental.cssChunking: 'strict'` in `next.config.ts`.
- Next.js 16 embeds compiled stylesheet chunks directly as `<style>` tags in the initial HTML document rather than emitting external render-blocking `<link rel="stylesheet" href="/_next/static/chunks/*.css">` network requests.

### 2. Above-the-Fold Critical CSS Inlined in `app/layout.tsx`
- Expanded `#critical-above-the-fold-css` in `<head>` with root theme tokens, box-sizing, body layout, fixed header height (`68px`), main container offset, and font-family fallbacks so First Contentful Paint (FCP) renders immediately with zero FOUC or Cumulative Layout Shift (CLS).

### 3. Font Loading Strategy (`display: "swap"`)
- Configured `Fraunces` and `Plus_Jakarta_Sans` with `display: "swap"` and metric-compatible system fallbacks, while keeping `IBM_Plex_Mono` set to `preload: false` and `display: "swap"`.

### 4. Deferred Heavy Client Libraries Out of the Critical Rendering Path
- **Three.js (~600 KB) Deferred to Browser Idle Time**: Split the zero-dependency snapshot cache (`lib/three/icon-cache.ts`) from the WebGL renderer (`lib/three/icon-renderer.ts`). `components/ToolIcon.tsx` renders crisp vector icons immediately on first paint and dynamically imports `@/lib/three/icon-renderer` inside `requestIdleCallback` after initial paint, while loading `Tool3DInspectModal` via `next/dynamic(..., { ssr: false })`.
- **Framer Motion (~115 KB) Removed from Root Layout Chrome**: Replaced synchronous `framer-motion` imports in `components/ThemeProvider.tsx`, `components/Navbar.tsx`, and `components/LanguageSwitcher.tsx` with native CSS transitions.
- **Modern ES2022+ Browserslist Targets**: Updated `package.json` and `.browserslistrc` to modern Baseline browsers (`Chrome >= 105`, `Edge >= 105`, `Firefox >= 105`, `Safari >= 15.6`, `iOS >= 15.6`) to eliminate legacy polyfills.
- **Third-Party Analytics & AdSense**: Gated behind user consent and deferred with `next/script` `strategy="lazyOnload"`.
