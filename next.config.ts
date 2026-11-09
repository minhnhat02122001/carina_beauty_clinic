import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // The root layout is the dynamic [locale] segment, so unknown paths need a 404 that renders outside it.
    globalNotFound: true,
  },
  images: {
    qualities: [75, 90],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      // The proxy skips these paths, so they would otherwise reach [locale] with a bogus locale and fail as a 500.
      // The destination is deeper than any route on the site, which lands it on global-not-found.
      afterFiles: [{ source: "/:first([^/]*\\.[^/]*|api|trpc)/:rest*", destination: "/not/a/route/on/this-site" }],
      fallback: [],
    };
  },
  // ponytail: no Content-Security-Policy — GTM injects marketing tags added later from its own UI, which a
  // strict CSP would silently break. Add one if a real XSS vector ever appears.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
