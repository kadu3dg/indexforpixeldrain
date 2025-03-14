/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixeldrain.com',
        port: '',
        pathname: '/api/file/**',
      },
    ],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig; 