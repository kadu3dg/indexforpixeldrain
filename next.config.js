/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
};

module.exports = nextConfig; 