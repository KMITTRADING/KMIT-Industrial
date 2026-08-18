import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Every route is prerendered to static HTML at build time (SSG). The §15.1 rule
  // is absolute: all visible copy must exist in view-source before any script runs.
  // A client-rendered site is forbidden. Verify with `npm run build` — every route
  // in the output table must be static, none dynamic.
  //
  // Deliberately NOT `output: 'export'`: a static export cannot issue a real 308
  // for `/` -> `/ar`, and a meta-refresh stub is a weaker canonical signal than a
  // server redirect. The pages themselves are still fully prerendered.
  async redirects() {
    return [
      // Arabic is the default language, so the bare root sends visitors there.
      { source: '/', destination: '/ar', permanent: true },

      /*
       * The careers and contact pages were removed. Both had been live and may
       * have been linked or indexed, so the four paths issue a permanent
       * redirect to the homepage in their own language rather than 404ing.
       * Contact details now live in the footer and in the presence section as
       * direct mailto: and tel: actions.
       */
      { source: '/ar/careers', destination: '/ar', permanent: true },
      { source: '/en/careers', destination: '/en', permanent: true },
      { source: '/ar/contact', destination: '/ar', permanent: true },
      { source: '/en/contact', destination: '/en', permanent: true },
    ];
  },
  images: {
    // Art is authored as WebP at final dimensions with explicit width/height on
    // every <img>, so the runtime optimiser (and sharp) is never needed.
    unoptimized: true,
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
