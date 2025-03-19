/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/indexforpixeldrain' : '',
  
  // Configurações de imagens no nível correto
  images: {
    unoptimized: true,
    domains: ['pixeldrain.com'],
  },
  
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 