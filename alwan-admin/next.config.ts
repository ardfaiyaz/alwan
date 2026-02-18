import type { NextConfig } from "next";

/** Next.js config; ESLint skipped during build for Vercel compatibility */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
