/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitando exportação estática
  output: 'export',
  
  // Configurando o caminho base para o GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/indexforpixeldrain' : '',
  
  // Configurações de imagens
  images: {
    unoptimized: true,
    domains: ['pixeldrain.com'],
  },
  
  // Configurações adicionais
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configurações experimentais
  experimental: {
    // Permitir páginas dinâmicas na exportação estática
    appDir: true,
  }
};

module.exports = nextConfig; 