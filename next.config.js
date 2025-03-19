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

  // Configurações experimentais
  experimental: {
    // Habilitar suporte para rotas dinâmicas na exportação estática
    staticPageGenerationTimeout: 60
  },

  // Configuração de rotas dinâmicas
  async exportPathMap(defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    // Adicionar rotas dinâmicas manualmente
    const dynamicRoutes = {
      '/album/default-album': { page: '/album/[id]', query: { id: 'default-album' } }
    };

    return {
      ...defaultPathMap,
      ...dynamicRoutes
    };
  }
};

module.exports = nextConfig; 