/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.GITHUB_ACTIONS ? '/v0-earned-values' : '', // Use basePath in production only
  assetPrefix: process.env.GITHUB_ACTIONS ? '/v0-earned-values/' : '', // Use assetPrefix in production only
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

export default nextConfig
