// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeRouterScrolling: true,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive, nosnippet",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/admin/dashboard",
        destination: "/admin/control-center",
        permanent: true, // oturduğunda true yapabilirsin
      },
    ];
  },
};

export default nextConfig;
