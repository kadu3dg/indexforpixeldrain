/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilitando exportação estática
  output: 'export',
  
  // Configurando o caminho base para o GitHub Pages
  basePath: '/indexforpixeldrain',
  
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

  // Adicionar configuração de rotas dinâmicas
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      ...defaultPathMap,
      // Adicionar rotas dinâmicas manualmente se necessário
      '/album/[id]': { page: '/album/[id]' },
    };
  },

  // Remover configurações experimentais
  experimental: undefined,
};

module.exports = nextConfig; 