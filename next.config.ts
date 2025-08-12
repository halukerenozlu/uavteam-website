import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeRouterScrolling: true,
  },
};

export default nextConfig;
