/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['next-mdx-remote'],
  },
  images: {
    domains: ['localhost', 'aventra.my.id'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  },
}

module.exports = nextConfig
