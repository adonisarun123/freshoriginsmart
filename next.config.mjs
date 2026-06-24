/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Smaller JS: strip the X-Powered-By header and let SWC drop console.* in prod.
  poweredByHeader: false,
  compiler: {
    removeConsole: { exclude: ["error", "warn"] },
  },
  images: {
    // Serve modern formats (AVIF then WebP) — addresses Lighthouse
    // "Improve image delivery". Next negotiates per-browser.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // cache optimized images 30 days
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/freshoriginsmart/**",
      },
    ],
  },
  experimental: {
    typedRoutes: false,
  },
};

export default nextConfig;
