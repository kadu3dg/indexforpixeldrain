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
  
  // Configuração de CORS e proxy
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
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

  // Configurações experimentais
  experimental: {
    // Remover configurações inválidas
  },

  // Desabilitar configuração de rotas dinâmicas
  // generateStaticParams será usado no arquivo page.tsx

  reactStrictMode: true,

  // As configurações de rewrites e headers não funcionam no modo de exportação estática
  // Elas só funcionam em ambientes de servidor (Node.js)
};

module.exports = nextConfig; 