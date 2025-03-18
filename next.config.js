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
  // Configuração para GitHub Pages
  output: 'export',
  // Define o caminho base para o GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  // Disable server functionality
  trailingSlash: true,
  // Desabilitar a verificação de tipos durante o build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Desabilitar o ESLint durante o build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Desabilitar server actions para build estático
  experimental: {
    serverActions: false,
  },
};

module.exports = nextConfig; 