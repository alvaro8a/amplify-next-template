/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  assetPrefix: '/',
  images: {
    unoptimized: true,
  },
  experimental: {},
};

module.exports = nextConfig;
