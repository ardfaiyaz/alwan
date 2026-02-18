/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
};

export default nextConfig;
