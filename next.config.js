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
    unoptimized: true,
  },
  // Configuração para Cloudflare Pages
  output: 'standalone',
  // Desabilitar a verificação de tipos durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desabilitar o ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Configuração para evitar erros de renderização estática
  experimental: {
    serverActions: {
      allowedOrigins: ['*'],
    },
  },
};

module.exports = nextConfig; 