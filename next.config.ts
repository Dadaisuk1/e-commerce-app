import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false, // Disable Turbopack to test with Webpack
  },
};

export default nextConfig;
