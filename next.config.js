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
  distDir: 'out',

  // Configurações de rotas
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    const paths = {
      '/': { page: '/' },
    };

    // Adicionar rotas dinâmicas para álbuns
    try {
      const PixeldrainService = require('./app/services/pixeldrain').PixeldrainService;
      const service = new PixeldrainService();
      const albums = await service.getUserLists();

      for (const album of albums) {
        paths[`/album/${album.id}`] = {
          page: '/album/[id]',
          query: { id: album.id },
        };
      }
    } catch (error) {
      console.error('Erro ao gerar rotas de álbuns:', error);
    }

    return paths;
  }
};

module.exports = nextConfig; 