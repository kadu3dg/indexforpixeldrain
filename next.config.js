/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitando exportação estática
  output: 'export',
  
  // Configurando o caminho base para o GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/indexforpixeldrain' : '',
  
  // Configurações de imagens
  images: {
    unoptimized: true,
  },
  
  // Configurações adicionais
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Configurações de páginas
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Remover configurações experimentais
  experimental: undefined,
};

module.exports = nextConfig; 