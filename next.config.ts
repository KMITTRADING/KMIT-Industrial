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

  typescript: {
    // Type errors must fail the build. This is the default; it is stated
    // explicitly so nobody "fixes" a red build by flipping it.
    ignoreBuildErrors: false,
  },
};

export default withNextIntl(nextConfig);
