import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@file-store/design-system'],
  output: 'standalone',
};

export default nextConfig;
