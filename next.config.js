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
  // Configuração para Cloudflare Pages
  output: 'standalone',
};

module.exports = nextConfig; 