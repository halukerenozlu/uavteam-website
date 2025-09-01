// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeRouterScrolling: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com", // LinkedIn avatarları
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub avatarları
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com", // Twitter / X avatarları
      },
      // Gerekirse buraya başka domainler de ekleyebilirsin
    ],
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
