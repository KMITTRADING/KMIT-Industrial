import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Trailing slashes are a canonicalisation trap on a bilingual site: /ar/products
  // and /ar/products/ would be two URLs for one page. Pick one and never emit the
  // other.
  trailingSlash: false,

  images: {
    // AVIF first. Every master in public/images is already AVIF; these are the
    // formats the optimiser is allowed to *serve*.
    formats: ['image/avif', 'image/webp'],
    // The set of widths the optimiser may generate. Capped at 2752 because that
    // is the native width of the source photography — asking for more would
    // upscale.
    deviceSizes: [420, 640, 828, 1080, 1280, 1600, 1920, 2560, 2752],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
    // A year: the masters are content-addressed by path and only change when
    // scripts/optimize-assets.mjs is re-run.
    minimumCacheTTL: 31_536_000,
  },

  // Next 16 no longer runs ESLint as part of `next build` and no longer accepts
  // an `eslint` config key. Linting is its own gate: `npm run lint`, wired into
  // CI ahead of the build step.

  /**
   * Security headers.
   *
   * Applied to every response rather than to a route list, so a route added
   * later is covered by default rather than by remembering.
   *
   * The CSP is the load-bearing one and the one with a real compromise in it:
   * `script-src` carries `'unsafe-inline'` because Next.js inlines the RSC
   * flight data and the hydration bootstrap as inline scripts. The nonce-based
   * alternative requires rendering every route dynamically, which would undo
   * the static generation this site is built on. `'unsafe-eval'` is *not*
   * granted, `object-src` is closed, and `frame-ancestors` blocks framing
   * outright. Recorded as ADR-041.
   */
  async headers() {
    const csp = [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "object-src 'none'",
      // Next inlines the RSC payload and the hydration bootstrap.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://plausible.io",
      // Tailwind emits a style element; the font loader injects @font-face.
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://www.google-analytics.com https://plausible.io",
      "manifest-src 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          // Two years, with preload eligibility. Only meaningful over HTTPS,
          // which is where this ships.
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
      {
        // The optimised image masters are content-addressed by path and only
        // change when scripts/optimize-assets.mjs is re-run.
        source: '/images/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },

  typescript: {
    // Type errors must fail the build. This is the default; it is stated
    // explicitly so nobody "fixes" a red build by flipping it.
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
