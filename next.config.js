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
    ignoreBuildErrors: true,
  },

  // Configurações de páginas
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],

  // Configurações experimentais
  experimental: {
    // Remover configurações inválidas
  },

  // Desabilitar configuração de rotas dinâmicas
  // generateStaticParams será usado no arquivo page.tsx

  reactStrictMode: true,

  // Configurações de proxy
  async rewrites() {
    return [
      // Rotas para álbuns
      {
        source: '/proxy/pixeldrain/list/:id',
        destination: 'https://pixeldrain.com/api/list/:id'
      },
      {
        source: '/proxy/pixeldrain/list',
        destination: 'https://pixeldrain.com/api/list'
      },
      // Rotas para arquivos
      {
        source: '/proxy/pixeldrain/file/:id',
        destination: 'https://pixeldrain.com/api/file/:id'
      },
      {
        source: '/proxy/pixeldrain/file/:id/thumbnail',
        destination: 'https://pixeldrain.com/api/file/:id/thumbnail'
      }
    ];
  },

  // Configurações de CORS
  async headers() {
    return [
      // Configurações para rotas de proxy do Pixeldrain
      {
        source: '/proxy/pixeldrain/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { 
            key: 'Access-Control-Allow-Headers', 
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
          },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' }
        ]
      },
      // Configurações para imagens do Next.js
      {
        source: '/_next/image/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET' }
        ]
      }
    ];
  }
};

module.exports = nextConfig; 