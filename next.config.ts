import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Cache Components landed here before Partial Prefetching. Keep the previous
  // prefetch behavior; leaving this unset warns on Next.js 16.4+.
  partialPrefetching: false,
};

export default nextConfig;
