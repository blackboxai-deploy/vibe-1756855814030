import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  typescript: {
    // Allow production builds to successfully complete even if there are type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/photos/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
  // Optimize for serverless deployment
  output: 'standalone',
}

export default nextConfig
