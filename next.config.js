/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita o Edge Runtime para melhor performance no Cloudflare
  experimental: {
    runtime: 'edge',
  },
  
  // Configuração de imagens
  images: {
    unoptimized: true, // Necessário para o Cloudflare Pages
    domains: ['pixeldrain.com'], // Permite imagens do Pixeldrain
  },

  // Configuração de CORS para a API do Pixeldrain
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 