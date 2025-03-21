/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitando exportação estática
  output: 'export',
  
  // Configurando o caminho base para o GitHub Pages
  basePath: '/indexforpixeldrain',
  
  // Configurações de imagens
  images: {
    unoptimized: true,
    domains: ['pixeldrain.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixeldrain.com',
        port: '',
        pathname: '/api/**'
      }
    ]
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

  reactStrictMode: true,
};

module.exports = nextConfig; 