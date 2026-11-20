import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Eshaal's auth page (public/auth/index.html) handles signup, verify, login and reset
  async rewrites() {
    return [{ source: "/login", destination: "/auth/index.html" }];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
